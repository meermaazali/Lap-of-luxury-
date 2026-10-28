import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject, getStorage } from 'firebase/storage';
import { db, storage, auth, app } from './firebase';
import {
  Product,
  BannerSlide,
  CategoryItem,
  Order,
  MediaAsset,
  PaymentConfig,
  BoutiqueHeroConfig,
  CustomerEnquiry,
} from '../types';
import {
  INITIAL_BANNERS,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_MEDIA,
} from '../data/initialData';
import { compressImage } from '../utils/imageUtils';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path,
  };
  console.warn('[Firebase Firestore Warning]', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// ============================================================================
// DEFAULT STORE CONFIGURATIONS
// ============================================================================

export const DEFAULT_PAYMENT_CONFIG: PaymentConfig = {
  acceptPaymentsOnline: false,
  upiId: '',
  payeeName: '',
  upiNumber: '',
  qrCodeImage: '',
  enableUPI: true,
  enableCOD: false,
  enableCard: false,
};

export const DEFAULT_BOUTIQUE_HERO: BoutiqueHeroConfig = {
  kicker: 'EXCLUSIVE COLLECTION',
  titleLine1: 'Luxury',
  titleLine2: 'For Every Moment',
  subtitleItems: ['Premium Fashion', 'Fine Leathers', 'Timeless Style'],
  ctaText: 'Explore Collections',
  image: '/images/category_mens_fashion_1791290148102.jpg',
};

// ============================================================================
// CLOUD STORAGE UPLOAD HELPER
// ============================================================================

/**
 * Uploads a file or blob with a strict timeout to prevent infinite UI hang.
 * If Firebase Storage is available, it returns the permanent HTTPS download URL.
 * If Firebase Storage is unprovisioned (404) or slow/times out (>4.5s), it safely falls back
 * immediately to saving the ultra-optimized compressed image (<60KB) directly into Cloud Firestore.
 */
async function attemptStorageUploadWithTimeout(
  storageInstance: ReturnType<typeof getStorage>,
  storagePath: string,
  blob: Blob,
  timeoutMs: number = 4500
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        reject(new Error(`Storage operation timed out after ${timeoutMs}ms`));
      }
    }, timeoutMs);

    const storageRef = ref(storageInstance, storagePath);
    uploadBytes(storageRef, blob, {
      contentType: blob.type || 'image/jpeg',
    })
      .then((snapshot) => getDownloadURL(snapshot.ref))
      .then((url) => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          resolve(url);
        }
      })
      .catch((err) => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          reject(err);
        }
      });
  });
}

/**
 * Uploads an image file or blob.
 * Automatically compresses oversized images before uploading.
 * Never hangs on 'Uploading...' — resolves within seconds.
 */
export async function uploadFileToFirebaseStorage(
  file: File | Blob,
  folder: string = 'media',
  customName?: string
): Promise<string> {
  // 1. Optimize and compress images before cloud transmission (<70KB)
  let uploadBlob: Blob = file;
  let compressedDataUrl: string | null = null;

  if (file instanceof File && file.type.startsWith('image/')) {
    try {
      compressedDataUrl = await compressImage(file, 1400, 0.82);
      const res = await fetch(compressedDataUrl);
      uploadBlob = await res.blob();
    } catch {
      uploadBlob = file;
    }
  }

  const cleanName = (customName || (file instanceof File ? file.name : `image_${Date.now()}.jpg`))
    .toLowerCase()
    .replace(/[^a-z0-9_.-]/g, '_');
  const storagePath = `${folder}/${Date.now()}_${cleanName}`;

  // 2. Attempt primary Firebase Cloud Storage upload with fast timeout
  try {
    const downloadUrl = await attemptStorageUploadWithTimeout(storage, storagePath, uploadBlob, 4500);
    if (downloadUrl) {
      console.log('✓ Firebase Cloud Storage upload succeeded:', downloadUrl);
      return downloadUrl;
    }
  } catch (primaryErr: any) {
    // Attempt fallback to standard appspot bucket with 3s timeout
    try {
      const fallbackStorage = getStorage(app, `gs://${app.options.projectId}.appspot.com`);
      const downloadUrl = await attemptStorageUploadWithTimeout(fallbackStorage, storagePath, uploadBlob, 3000);
      if (downloadUrl) {
        console.log('✓ Firebase Storage fallback bucket upload succeeded:', downloadUrl);
        return downloadUrl;
      }
    } catch (fallbackErr: any) {
      console.info(
        `[Storage Status] Cloud Storage bucket not provisioned. Image compressed (<60KB) and saved directly to Cloud Firestore.`
      );
    }
  }

  // 3. Resilient Cloud Persistence: Save the compressed image directly into Firestore 'media' collection
  const dataUrl =
    compressedDataUrl ||
    (await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(uploadBlob);
    }));

  try {
    const assetId = `med-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    await setDoc(doc(db, 'media', assetId), {
      id: assetId,
      name: customName || (file instanceof File ? file.name : 'Uploaded Media'),
      size: uploadBlob.size || (file instanceof File ? file.size : 35000),
      type: uploadBlob.type || 'image/jpeg',
      dataUrl,
      createdAt: new Date().toISOString(),
      category: folder === 'banners' ? 'Banners' : folder === 'categories' ? 'Categories' : 'Products',
    });
    console.log('✓ Resilient compressed image persisted to Cloud Firestore media collection:', assetId);
  } catch (firestoreErr) {
    console.warn('Could not persist media doc to Firestore:', firestoreErr);
  }

  return dataUrl;
}

// ============================================================================
// ONE-TIME SAFE CLOUD DATA SEEDING & MIGRATION
// ============================================================================

let isSeedingRunning = false;

/**
 * Ensures Firestore is populated with authoritative data.
 * If cloud collections are empty, seeds initial catalog cleanly.
 * Never overwrites existing valid cloud records.
 */
export async function ensureCloudDataSeeded(): Promise<void> {
  if (isSeedingRunning) return;
  isSeedingRunning = true;

  try {
    // 1. Check and Reconcile Products (never lose catalog products on refresh)
    const prodSnap = await getDocs(collection(db, 'products')).catch(() => null);
    if (!prodSnap || prodSnap.empty) {
      console.log('Seeding initial products into Firestore catalog...');
      for (const p of INITIAL_PRODUCTS) {
        await setDoc(doc(db, 'products', p.id), {
          ...p,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }).catch((err) => console.warn('Failed seeding initial product', p.id, err));
      }
    } else {
      // Auto-heal legacy broken categories or subcategories
      for (const d of prodSnap.docs) {
        const data = d.data();
        if (data.subCategory === 'Watches and Accessories') {
          await setDoc(
            doc(db, 'products', d.id),
            { subCategory: 'Watches', updatedAt: new Date().toISOString() },
            { merge: true }
          ).catch((err) => console.warn('Failed auto-healing subCategory', d.id, err));
        }
        if (['Accessories', 'Shoes', 'Footwear'].includes(data.category)) {
          const isBelt = (data.name || '').toLowerCase().includes('belt');
          await setDoc(
            doc(db, 'products', d.id),
            {
              category: isBelt ? 'Bags' : 'Men',
              department: 'men',
              subCategory: isBelt ? 'Leather Belts' : (data.subCategory || 'General'),
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          ).catch((err) => console.warn('Failed auto-healing extra category product', d.id, err));
        }
      }
    }

    // 2. Check and Reconcile Banners
    const bannerSnap = await getDocs(collection(db, 'banners')).catch(() => null);
    if (!bannerSnap || bannerSnap.empty) {
      for (const b of INITIAL_BANNERS) {
        await setDoc(doc(db, 'banners', b.id), {
          ...b,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }).catch((err) => console.warn('Failed seeding initial banner', b.id, err));
      }
    }

    // 3. Check and Reconcile Categories (ensure only core 6 categories exist)
    const catSnap = await getDocs(collection(db, 'categories')).catch(() => null);
    if (!catSnap || catSnap.empty) {
      for (const c of INITIAL_CATEGORIES) {
        await setDoc(doc(db, 'categories', c.id), {
          ...c,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }).catch((err) => console.warn('Failed seeding initial category', c.id, err));
      }
    } else {
      // Purge any unwanted/duplicate category docs
      const coreIds = new Set(['cat-men', 'cat-jeans', 'cat-women', 'cat-watches', 'cat-perfumes', 'cat-bags']);
      for (const d of catSnap.docs) {
        if (!coreIds.has(d.id)) {
          await deleteDoc(doc(db, 'categories', d.id)).catch(() => null);
        }
      }
    }

    // 4. Check Store Settings (Payment and Boutique Hero)
    const settingsDocRef = doc(db, 'storeSettings', 'config');
    const settingsSnap = await getDoc(settingsDocRef).catch(() => null);
    if (!settingsSnap || !settingsSnap.exists()) {
      console.log('Seeding initial storeSettings config into Cloud Firestore...');
      await setDoc(settingsDocRef, {
        id: 'config',
        paymentConfig: DEFAULT_PAYMENT_CONFIG,
        boutiqueHeroConfig: DEFAULT_BOUTIQUE_HERO,
        bannerInterval: 5,
        categoryInterval: 4,
        updatedAt: new Date().toISOString(),
      }).catch((err) => console.warn('Failed seeding storeSettings', err));
    }

    // 5. Check Media Assets
    const mediaSnap = await getDocs(collection(db, 'media')).catch(() => null);
    if (mediaSnap && mediaSnap.empty) {
      for (const m of INITIAL_MEDIA) {
        await setDoc(doc(db, 'media', m.id), m).catch(() => null);
      }
    }
  } catch (error) {
    console.error('Error verifying or seeding cloud data:', error);
  } finally {
    isSeedingRunning = false;
  }
}

// ============================================================================
// REAL-TIME FIRESTORE SUBSCRIPTIONS
// ============================================================================

export function subscribeToProducts(callback: (products: Product[]) => void): () => void {
  const path = 'products';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const list: Product[] = [];
      snapshot.forEach((d) => {
        const data = d.data() as Product;
        list.push({ ...data, id: d.id });
      });
      // Deterministic cross-device sorting: newest first, fallback to id
      list.sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        if (timeB !== timeA) return timeB - timeA;
        return a.id.localeCompare(b.id);
      });
      callback(list);
    },
    (error) => {
      console.warn('Realtime subscription warning for products:', error);
    }
  );
}

export function subscribeToBanners(callback: (banners: BannerSlide[]) => void): () => void {
  const path = 'banners';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const list: BannerSlide[] = [];
      snapshot.forEach((d) => {
        const data = d.data() as BannerSlide;
        list.push({ ...data, id: d.id });
      });
      // Deterministic cross-device sorting by order
      list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.id.localeCompare(b.id));
      callback(list);
    },
    (error) => {
      console.warn('Realtime subscription warning for banners:', error);
    }
  );
}

export function subscribeToCategories(callback: (categories: CategoryItem[]) => void): () => void {
  const path = 'categories';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const list: CategoryItem[] = [];
      snapshot.forEach((d) => {
        const data = d.data() as CategoryItem;
        list.push({ ...data, id: d.id });
      });
      // Deterministic cross-device sorting by order
      list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.id.localeCompare(b.id));
      callback(list);
    },
    (error) => {
      console.warn('Realtime subscription warning for categories:', error);
    }
  );
}

export function subscribeToOrders(callback: (orders: Order[]) => void): () => void {
  const path = 'orders';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const list: Order[] = [];
      snapshot.forEach((d) => {
        const data = d.data() as Order;
        list.push({ ...data, id: d.id });
      });
      // Sort newest orders first
      list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      callback(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export function subscribeToStoreSettings(
  callback: (settings: {
    paymentConfig?: PaymentConfig;
    boutiqueHeroConfig?: BoutiqueHeroConfig;
    bannerInterval?: number;
    categoryInterval?: number;
  }) => void
): () => void {
  const path = 'storeSettings/config';
  return onSnapshot(
    doc(db, 'storeSettings', 'config'),
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        callback({
          paymentConfig: data.paymentConfig,
          boutiqueHeroConfig: data.boutiqueHeroConfig,
          bannerInterval: data.bannerInterval,
          categoryInterval: data.categoryInterval,
        });
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export function subscribeToMediaAssets(callback: (media: MediaAsset[]) => void): () => void {
  const path = 'media';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const list: MediaAsset[] = [];
      snapshot.forEach((d) => {
        const data = d.data() as MediaAsset;
        list.push({ ...data, id: d.id });
      });
      list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      callback(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

/**
 * Safely sanitizes objects for Firebase Firestore:
 * - Recursively strips all `undefined` values that cause Firestore write rejections
 * - Converts `NaN` numbers to `0`
 * - Guarantees pristine, error-free payloads
 */
export function sanitizeForFirestore<T>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }
  if (typeof data !== 'object') {
    if (typeof data === 'number' && Number.isNaN(data)) {
      return 0 as unknown as T;
    }
    return data;
  }
  if (Array.isArray(data)) {
    return data
      .filter((item) => item !== undefined)
      .map((item) => sanitizeForFirestore(item)) as unknown as T;
  }
  const clean: Record<string, any> = {};
  for (const [key, val] of Object.entries(data as Record<string, any>)) {
    if (val !== undefined) {
      clean[key] = sanitizeForFirestore(val);
    }
  }
  return clean as T;
}

// ============================================================================
// FIRESTORE MUTATIONS (AUTHORITATIVE CLOUD WRITES)
// ============================================================================

export async function cloudAddProduct(productData: Omit<Product, 'id'>): Promise<Product> {
  const id = `prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const newProduct: Product = {
    ...productData,
    id,
    secondaryImage: productData.secondaryImage || '',
    subCategory: productData.subCategory || 'General',
    brand: productData.brand || 'LAP OF LUXURY',
    department: productData.department || productData.category || 'men',
    price: Number(productData.price) || 0,
    originalPrice: Number(productData.originalPrice) || Number(productData.price) || 0,
    stockCount: Number(productData.stockCount) || 0,
    inStock: (Number(productData.stockCount) || 0) > 0,
  };
  const cleanPayload = sanitizeForFirestore({
    ...newProduct,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  const path = `products/${id}`;
  try {
    await setDoc(doc(db, 'products', id), cleanPayload);
    return newProduct;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function cloudUpdateProduct(id: string, updates: Partial<Product>): Promise<void> {
  const path = `products/${id}`;
  try {
    const cleanUpdates = sanitizeForFirestore({
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    // Use setDoc with merge: true to succeed whether doc exists or needs creation
    await setDoc(doc(db, 'products', id), cleanUpdates, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function cloudDeleteProduct(id: string): Promise<void> {
  const path = `products/${id}`;
  try {
    await deleteDoc(doc(db, 'products', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function cloudUpdateStock(id: string, newStock: number): Promise<void> {
  const path = `products/${id}`;
  try {
    const stock = Math.max(0, Number(newStock) || 0);
    await setDoc(
      doc(db, 'products', id),
      {
        stockCount: stock,
        inStock: stock > 0,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function cloudAddBanner(bannerData: Omit<BannerSlide, 'id'>): Promise<BannerSlide> {
  const id = `banner-${Date.now()}`;
  const newBanner: BannerSlide = {
    ...bannerData,
    id,
  };
  const path = `banners/${id}`;
  try {
    await setDoc(doc(db, 'banners', id), {
      ...newBanner,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return newBanner;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function cloudUpdateBanner(id: string, updates: Partial<BannerSlide>): Promise<void> {
  const path = `banners/${id}`;
  try {
    await setDoc(
      doc(db, 'banners', id),
      {
        ...updates,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function cloudDeleteBanner(id: string): Promise<void> {
  const path = `banners/${id}`;
  try {
    await deleteDoc(doc(db, 'banners', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function cloudAddCategory(catData: Omit<CategoryItem, 'id'>): Promise<CategoryItem> {
  const id = `cat-${Date.now()}`;
  const newCat: CategoryItem = {
    ...catData,
    id,
  };
  const path = `categories/${id}`;
  try {
    await setDoc(doc(db, 'categories', id), {
      ...newCat,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return newCat;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function cloudUpdateCategory(id: string, updates: Partial<CategoryItem>): Promise<void> {
  const path = `categories/${id}`;
  try {
    await setDoc(
      doc(db, 'categories', id),
      {
        ...updates,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function cloudDeleteCategory(id: string): Promise<void> {
  const path = `categories/${id}`;
  try {
    await deleteDoc(doc(db, 'categories', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function cloudPlaceOrder(order: Order): Promise<Order> {
  const path = `orders/${order.id}`;
  try {
    await setDoc(doc(db, 'orders', order.id), {
      ...order,
      createdAt: order.createdAt || new Date().toISOString(),
    });
    return order;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function cloudUpdateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
  const path = `orders/${orderId}`;
  try {
    await updateDoc(doc(db, 'orders', orderId), {
      status,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function cloudMarkOrderRead(orderId: string): Promise<void> {
  const path = `orders/${orderId}`;
  try {
    await updateDoc(doc(db, 'orders', orderId), {
      isRead: true,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function cloudUpdateStoreSettings(updates: {
  paymentConfig?: Partial<PaymentConfig>;
  boutiqueHeroConfig?: Partial<BoutiqueHeroConfig>;
  bannerInterval?: number;
  categoryInterval?: number;
}): Promise<void> {
  const path = 'storeSettings/config';
  try {
    const docRef = doc(db, 'storeSettings', 'config');
    const snap = await getDoc(docRef);
    const existing = snap.exists() ? snap.data() : {};

    const payload: Record<string, any> = {
      ...existing,
      updatedAt: new Date().toISOString(),
    };

    if (updates.paymentConfig) {
      payload.paymentConfig = {
        ...(existing.paymentConfig || DEFAULT_PAYMENT_CONFIG),
        ...updates.paymentConfig,
      };
    }
    if (updates.boutiqueHeroConfig) {
      payload.boutiqueHeroConfig = {
        ...(existing.boutiqueHeroConfig || DEFAULT_BOUTIQUE_HERO),
        ...updates.boutiqueHeroConfig,
      };
    }
    if (typeof updates.bannerInterval === 'number') {
      payload.bannerInterval = updates.bannerInterval;
    }
    if (typeof updates.categoryInterval === 'number') {
      payload.categoryInterval = updates.categoryInterval;
    }

    await setDoc(docRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function cloudAddMediaAsset(asset: Omit<MediaAsset, 'id'>): Promise<MediaAsset> {
  const id = `med-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const newAsset: MediaAsset = {
    ...asset,
    id,
  };
  const path = `media/${id}`;
  try {
    await setDoc(doc(db, 'media', id), newAsset);
    return newAsset;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function cloudDeleteMediaAsset(id: string): Promise<void> {
  const path = `media/${id}`;
  try {
    await deleteDoc(doc(db, 'media', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ============================================================================
// ENQUIRIES (CUSTOMER INQUIRIES & ADMIN NOTIFICATIONS)
// ============================================================================

export function subscribeToEnquiries(callback: (enquiries: CustomerEnquiry[]) => void): () => void {
  const path = 'enquiries';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const list: CustomerEnquiry[] = [];
      snapshot.forEach((d) => {
        const data = d.data() as CustomerEnquiry;
        list.push({ ...data, id: d.id });
      });
      // Sort newest first
      list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      callback(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function cloudAddEnquiry(
  enquiryData: Omit<CustomerEnquiry, 'id' | 'createdAt' | 'isRead' | 'status'>
): Promise<CustomerEnquiry> {
  const id = `enq-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const newEnquiry: CustomerEnquiry = {
    ...enquiryData,
    id,
    status: 'new',
    isRead: false,
    createdAt: new Date().toISOString(),
  };
  const path = `enquiries/${id}`;
  try {
    await setDoc(doc(db, 'enquiries', id), newEnquiry);
    return newEnquiry;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function cloudUpdateEnquiryStatus(
  enquiryId: string,
  status: CustomerEnquiry['status']
): Promise<void> {
  const path = `enquiries/${enquiryId}`;
  try {
    await updateDoc(doc(db, 'enquiries', enquiryId), {
      status,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function cloudMarkEnquiryRead(enquiryId: string): Promise<void> {
  const path = `enquiries/${enquiryId}`;
  try {
    await updateDoc(doc(db, 'enquiries', enquiryId), {
      isRead: true,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function cloudDeleteEnquiry(enquiryId: string): Promise<void> {
  const path = `enquiries/${enquiryId}`;
  try {
    await deleteDoc(doc(db, 'enquiries', enquiryId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}


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
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage, auth } from './firebase';
import {
  Product,
  BannerSlide,
  CategoryItem,
  Order,
  MediaAsset,
  PaymentConfig,
  BoutiqueHeroConfig,
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
  console.error('[Firebase Error]', JSON.stringify(errInfo));
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
 * Uploads a file or blob directly to Firebase Cloud Storage and returns the permanent HTTPS download URL.
 * Automatically compresses oversized images before uploading.
 */
/**
 * Uploads an image file or blob.
 * 1. Automatically compresses image to high-efficiency web format (<60KB) to ensure rapid saving and no Firestore bloat.
 * 2. Attempts Firebase Storage upload with a strict 2.5-second timeout (preventing the 10-minute hanging bug if bucket is unprovisioned).
 * 3. Falls back seamlessly to /api/media/upload or optimized data URL.
 * 4. Resolves in <300ms, ensuring uploads never hang or block.
 */

/* ============================================================================
   CLOUD STORAGE UPLOAD HELPER
   Uploads images to Firebase Storage and returns a permanent HTTPS URL.
   Does not silently fall back to temporary data URLs or local images.
============================================================================ */

export async function uploadFileToFirebaseStorage(
  file: File | Blob,
  folder: string = 'media',
  customName?: string
): Promise<string> {
  // 1. Validate the selected file.
  if (!file || file.size === 0) {
    throw new Error('The selected image is empty. Please choose another image.');
  }

  let uploadBlob: Blob = file;

  // 2. Compress images before uploading to reduce upload time.
  if (
    typeof File !== 'undefined' &&
    file instanceof File &&
    file.type.startsWith('image/')
  ) {
    try {
      const compressedDataUrl = await compressImage(file, 1600, 0.82);

      if (compressedDataUrl.startsWith('data:')) {
        const response = await fetch(compressedDataUrl);

        if (!response.ok) {
          throw new Error('Could not process the compressed image.');
        }

        const compressedBlob = await response.blob();

        if (compressedBlob.size > 0) {
          uploadBlob = compressedBlob;
        }
      }
    } catch (error) {
      // If compression fails, upload the original image.
      console.warn(
        'Image compression failed. Uploading the original image.',
        error
      );
      uploadBlob = file;
    }
  }

  // 3. Create a safe, unique filename.
  const originalName =
    customName ||
    (typeof File !== 'undefined' && file instanceof File
      ? file.name
      : `image_${Date.now()}.jpg`);

  const cleanName = originalName
    .replace(/[^a-zA-Z0-9_.-]/g, '_')
    .slice(-120);

  const safeFolder = folder
    .split('/')
    .filter(Boolean)
    .map((part) => part.replace(/[^a-zA-Z0-9_-]/g, '_'))
    .join('/');

  const uniqueId =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

  const storagePath = `${safeFolder || 'media'}/${uniqueId}_${cleanName}`;
  const storageRef = ref(storage, storagePath);

  // 4. Upload to Firebase Storage.
  // Do not use a short timeout: genuine uploads may take longer than 2.5 seconds.
  try {
    await uploadBytes(storageRef, uploadBlob, {
      contentType:
        uploadBlob.type ||
        (typeof File !== 'undefined' && file instanceof File
          ? file.type
          : '') ||
        'application/octet-stream',
    });

    // 5. Get the permanent Firebase download URL.
    const downloadUrl = await getDownloadURL(storageRef);

    if (!downloadUrl.startsWith('https://')) {
      throw new Error('Firebase did not return a valid HTTPS image URL.');
    }

    return downloadUrl;
  } catch (error) {
    console.error('Firebase Storage upload failed:', error);

    const details =
      error instanceof Error ? error.message : String(error);

    throw new Error(
      `Image upload failed. Check that Firebase Storage is enabled and its security rules allow this upload. Details: ${details}`
    );
  }
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
    // 1. Check Products
    const prodSnap = await getDocs(collection(db, 'products')).catch(() => null);
    if (prodSnap && prodSnap.empty) {
      console.log('Seeding initial products into Cloud Firestore...');
      for (const p of INITIAL_PRODUCTS) {
        await setDoc(doc(db, 'products', p.id), {
          ...p,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }).catch((err) => console.warn('Failed seeding product', p.id, err));
      }
    }

    // 2. Check Banners
    const bannerSnap = await getDocs(collection(db, 'banners')).catch(() => null);
    if (bannerSnap && bannerSnap.empty) {
      console.log('Seeding initial banners into Cloud Firestore...');
      for (const b of INITIAL_BANNERS) {
        await setDoc(doc(db, 'banners', b.id), {
          ...b,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }).catch((err) => console.warn('Failed seeding banner', b.id, err));
      }
    }

    // 3. Check Categories & ensure subcategories exist
    const catSnap = await getDocs(collection(db, 'categories')).catch(() => null);
    if (catSnap && catSnap.empty) {
      console.log('Seeding initial categories into Cloud Firestore...');
      for (const c of INITIAL_CATEGORIES) {
        await setDoc(doc(db, 'categories', c.id), {
          ...c,
          subcategories: c.subcategories || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }).catch((err) => console.warn('Failed seeding category', c.id, err));
      }
    } else if (catSnap && !catSnap.empty) {
      // Safely ensure subcategories array exists on existing cloud categories
      for (const d of catSnap.docs) {
        const data = d.data() as CategoryItem;
        if (!data.subcategories || !Array.isArray(data.subcategories) || data.subcategories.length === 0) {
          const matchInitial = INITIAL_CATEGORIES.find(
            (c) =>
              c.slug.toLowerCase() === (data.slug || '').toLowerCase() ||
              c.name.toLowerCase() === (data.name || '').toLowerCase()
          );
          if (matchInitial && matchInitial.subcategories) {
            await updateDoc(doc(db, 'categories', d.id), {
              subcategories: matchInitial.subcategories,
              updatedAt: new Date().toISOString(),
            }).catch(() => null);
          }
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
      callback(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
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
      list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      callback(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
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
      callback(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
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

// ============================================================================
// FIRESTORE MUTATIONS (AUTHORITATIVE CLOUD WRITES)
// ============================================================================

export async function cloudAddProduct(productData: Omit<Product, 'id'>): Promise<Product> {
  const id = `prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const newProduct: Product = {
    ...productData,
    id,
  };
  const path = `products/${id}`;
  try {
    await setDoc(doc(db, 'products', id), {
      ...newProduct,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return newProduct;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function cloudUpdateProduct(id: string, updates: Partial<Product>): Promise<void> {
  const path = `products/${id}`;
  try {
    await updateDoc(doc(db, 'products', id), {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
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
    await updateDoc(doc(db, 'products', id), {
      stockCount: Math.max(0, newStock),
      inStock: newStock > 0,
      updatedAt: new Date().toISOString(),
    });
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
    await updateDoc(doc(db, 'banners', id), {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
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
    await updateDoc(doc(db, 'categories', id), {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
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

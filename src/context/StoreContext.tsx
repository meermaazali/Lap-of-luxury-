import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  BannerSlide,
  CategoryItem,
  CartItem,
  Order,
  MediaAsset,
  PaymentConfig,
  BoutiqueHeroConfig,
  BrandingConfig,
} from '../types';
import {
  INITIAL_BANNERS,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_MEDIA,
} from '../data/initialData';
import { normalizeImageUrl, compressImage, FALLBACK_CATEGORY_IMAGES } from '../utils/imageUtils';
import { sendOrderEmailNotification } from '../utils/orderNotification';
import { idbSetItem, idbGetItem } from '../utils/idbStorage';
import { db, storage } from '../lib/firebase';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface StoreContextType {
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateStock: (id: string, newStock: number) => void;

  // Banners
  banners: BannerSlide[];
  addBanner: (banner: Omit<BannerSlide, 'id'>) => void;
  updateBanner: (id: string, updates: Partial<BannerSlide>) => void;
  deleteBanner: (id: string) => void;
  bannerInterval: number; // in seconds
  setBannerInterval: (interval: number) => void;

  // Categories
  categories: CategoryItem[];
  addCategory: (category: Omit<CategoryItem, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<CategoryItem>) => void;
  deleteCategory: (id: string) => void;
  categoryInterval: number;
  setCategoryInterval: (interval: number) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, size?: string, quantity?: number) => void;
  removeFromCart: (productId: string, size?: string, color?: string) => void;
  updateCartQuantity: (productId: string, size: string, quantity: number) => void;
  updateQuantity: (productId: string, sizeOrQty?: any, qtyOrColor?: any, color?: any) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Wishlist
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders & Notifications
  orders: Order[];
  placeOrder: (
    customer: {
      name: string;
      phone: string;
      email?: string;
      address: string;
      city: string;
      pincode: string;
      paymentMethod: Order['paymentMethod'];
      transactionRef?: string;
      paymentScreenshot?: string;
    },
    discount?: number
  ) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  markOrderRead: (orderId: string) => void;
  unreadOrdersCount: number;
  latestNotification: Order | null;
  dismissNotification: () => void;
  playOrderChime: () => void;

  // Payment Setup Configuration
  paymentConfig: PaymentConfig;
  updatePaymentConfig: (updates: Partial<PaymentConfig>) => void;

  // Atelier Boutique Hero Configuration
  boutiqueHeroConfig: BoutiqueHeroConfig;
  updateBoutiqueHeroConfig: (updates: Partial<BoutiqueHeroConfig>) => Promise<void>;

  // Branding & Logo Configuration
  brandingConfig: BrandingConfig;
  updateBrandingConfig: (updates: Partial<BrandingConfig>) => Promise<void>;

  // Media Library / Cloud Storage
  mediaAssets: MediaAsset[];
  uploadMediaAsset: (file: File, category?: string) => Promise<MediaAsset>;
  deleteMediaAsset: (id: string) => void;

  // Navigation & Filtering
  currentView: string;
  setCurrentView: (view: string, subCategory?: string | null) => void;
  selectedSubcategory: string | null;
  setSelectedSubcategory: (sub: string | null) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  lastPlacedOrder: Order | null;
  setLastPlacedOrder: (order: Order | null) => void;

  // Admin Mode
  isAdminMode: boolean;
  setIsAdminMode: (admin: boolean) => void;

  // 3D Experience Voyage Mode
  isExperienceOpen: boolean;
  setIsExperienceOpen: (open: boolean) => void;

  // Category & Navigation Luxury White Screen Transition
  isTransitioning: boolean;
  transitionLabel: string;
  triggerTransition: (categorySlug: string, label?: string) => void;
  openProductDetail: (product: Product) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Silent order notification helper (No notification sounds per requirement)
export function playOrderChime() {
  // Intentionally silent
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial from localStorage or defaults with image path normalization
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('lol_products');
      let list: Product[] = saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
      if (Array.isArray(list)) {
        const existingIds = new Set(list.map((p) => p.id));
        const missingInitial = INITIAL_PRODUCTS.filter((p) => !existingIds.has(p.id));
        list = [...list, ...missingInitial];
      } else {
        list = INITIAL_PRODUCTS;
      }
      return list.map((p) => ({
        ...p,
        image: normalizeImageUrl(p.image, p.category),
        secondaryImage: p.secondaryImage ? normalizeImageUrl(p.secondaryImage, p.category) : undefined,
      }));
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [banners, setBanners] = useState<BannerSlide[]>(() => {
    try {
      const saved = localStorage.getItem('lol_banners');
      const list: BannerSlide[] = saved ? JSON.parse(saved) : INITIAL_BANNERS;
      return list.map((b) => ({
        ...b,
        image: normalizeImageUrl(b.image),
      }));
    } catch {
      return INITIAL_BANNERS;
    }
  });

  const [bannerInterval, setBannerInterval] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('lol_banner_interval');
      return saved ? Number(saved) : 5;
    } catch {
      return 5;
    }
  });

  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('lol_categories');
      if (saved) {
        const list: CategoryItem[] = JSON.parse(saved);
        if (Array.isArray(list) && list.length > 0) {
          // Deduplicate by slug and ensure clean valid categories
          const seen = new Set<string>();
          const deduped: CategoryItem[] = [];
          for (const c of list) {
            if (!c || !c.slug || seen.has(c.slug.toLowerCase())) continue;
            seen.add(c.slug.toLowerCase());
            const bw = FALLBACK_CATEGORY_IMAGES[c.slug];
            const isOld =
              !c.image ||
              c.image.includes('unsplash.com') ||
              c.image.includes('festive_edit_luxury') ||
              c.image.includes('hero_luxury_fashion');
            deduped.push({
              ...c,
              image: isOld && bw ? bw : normalizeImageUrl(c.image, c.slug),
            });
          }
          if (deduped.length > 0) return deduped;
        }
      }
      return INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [categoryInterval, setCategoryInterval] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('lol_category_interval');
      return saved ? Number(saved) : 4;
    } catch {
      return 4;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('lol_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('lol_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('lol_orders');
      if (saved) {
        const parsed: Order[] = JSON.parse(saved);
        return parsed.filter((o) => o.id !== 'order-101' && o.id !== 'order-102');
      }
    } catch {}
    return [];
  });

  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>(() => {
    try {
      const saved = localStorage.getItem('lol_media');
      const list: MediaAsset[] = saved ? JSON.parse(saved) : INITIAL_MEDIA;
      return list.map((m) => ({
        ...m,
        dataUrl: normalizeImageUrl(m.dataUrl),
      }));
    } catch {
      return INITIAL_MEDIA;
    }
  });

  const getInitialView = () => {
    if (typeof window === 'undefined') return 'home';
    const hash = window.location.hash.toLowerCase().replace('#', '');
    const validViews = ['home', 'men', 'women', 'bags', 'footwear', 'shoes', 'accessories', 'collections', 'bestsellers', 'sale', 'new-arrivals'];
    if (validViews.includes(hash)) {
      return hash === 'shoes' ? 'footwear' : hash;
    }
    return 'home';
  };

  const [currentView, setCurrentViewState] = useState<string>(() => getInitialView());
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  const setCurrentView = (view: string, subCategory?: string | null) => {
    const norm = view.toLowerCase().trim() === 'shoes' ? 'footwear' : view.toLowerCase().trim();
    setCurrentViewState(norm);
    setSelectedSubcategory(subCategory || null);
    if (typeof window !== 'undefined') {
      if (norm === 'home') {
        try {
          if (window.location.hash && !window.location.hash.includes('admin')) {
            window.history.pushState(null, '', window.location.pathname);
          }
        } catch {
          window.location.hash = '';
        }
      } else {
        window.location.hash = norm;
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase().replace('#', '');
      if (hash && hash !== 'admin' && hash !== 'experience') {
        const norm = hash === 'shoes' ? 'footwear' : hash;
        setCurrentViewState(norm);
      } else if (!hash) {
        setCurrentViewState('home');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);
  const [latestNotification, setLatestNotification] = useState<Order | null>(null);

  const checkIsAdminRoute = () => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    return path.startsWith('/admin') || hash.includes('admin') || search.includes('admin');
  };

  const checkIsExperienceRoute = () => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    return path.startsWith('/experience') || hash.includes('experience') || search.includes('experience');
  };

  const [isAdminMode, setIsAdminModeState] = useState<boolean>(() => checkIsAdminRoute());
  const [isExperienceOpen, setIsExperienceOpenState] = useState<boolean>(() => checkIsExperienceRoute());

  const setIsAdminMode = (admin: boolean) => {
    setIsAdminModeState(admin);
    if (typeof window !== 'undefined') {
      if (admin) {
        if (!window.location.pathname.startsWith('/admin') && !window.location.hash.includes('admin')) {
          try {
            window.history.pushState(null, '', '/admin');
          } catch {
            window.location.hash = 'admin';
          }
        }
      } else {
        if (window.location.pathname.startsWith('/admin') || window.location.hash.includes('admin')) {
          try {
            window.history.pushState(null, '', '/');
          } catch {
            window.location.hash = '';
          }
        }
      }
    }
  };

  const setIsExperienceOpen = (open: boolean) => {
    setIsExperienceOpenState(open);
    if (typeof window !== 'undefined') {
      if (open) {
        if (!window.location.pathname.startsWith('/experience') && !window.location.hash.includes('experience')) {
          try {
            window.history.pushState(null, '', '/experience');
          } catch {
            window.location.hash = 'experience';
          }
        }
      } else {
        if (window.location.pathname.startsWith('/experience') || window.location.hash.includes('experience')) {
          try {
            window.history.pushState(null, '', '/');
          } catch {
            window.location.hash = '';
          }
        }
      }
    }
  };

  useEffect(() => {
    const handleUrlChange = () => {
      setIsAdminModeState(checkIsAdminRoute());
      setIsExperienceOpenState(checkIsExperienceRoute());
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // White Screen Luxury Transition State
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [transitionLabel, setTransitionLabel] = useState<string>('');

  // Payment Setup Configuration (Kept empty per user request - client will add later)
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>(() => {
    try {
      const saved = localStorage.getItem('lol_payment_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        const upiId =
          parsed.upiId &&
          !parsed.upiId.toLowerCase().includes('maaz') &&
          !parsed.upiId.toLowerCase().includes('axis') &&
          !parsed.upiId.includes('7578887888')
            ? parsed.upiId
            : '';
        const payeeName =
          parsed.payeeName &&
          !parsed.payeeName.toLowerCase().includes('maaz') &&
          !parsed.payeeName.includes('7578887888')
            ? parsed.payeeName
            : '';
        const upiNumber =
          parsed.upiNumber && !parsed.upiNumber.toLowerCase().includes('maaz')
            ? parsed.upiNumber
            : '';
        return {
          ...parsed,
          acceptPaymentsOnline: false,
          upiId,
          payeeName,
          upiNumber,
          enableCOD: false,
          qrCodeImage: upiId
            ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi%3A%2F%2Fpay%3Fpa%3D${encodeURIComponent(
                upiId
              )}%26pn%3D${encodeURIComponent(payeeName)}%26cu%3DINR`
            : '',
        };
      }
    } catch {}
    return {
      acceptPaymentsOnline: false,
      upiId: '', // Kept empty per user request - client will add later
      payeeName: '', // Kept empty
      upiNumber: '',
      qrCodeImage: '',
      enableUPI: true,
      enableCOD: false,
      enableCard: false,
      bankAccountNumber: '',
      bankIfsc: '',
      bankName: '',
      instructions: '',
    };
  });

  const updatePaymentConfig = (updates: Partial<PaymentConfig>) => {
    setPaymentConfig((prev) => {
      const next = { ...prev, ...updates, enableCOD: false };
      try {
        localStorage.setItem('lol_payment_config', JSON.stringify(next));
      } catch (e) {
        console.warn('Could not save payment config to localStorage:', e);
      }
      fetch('/api/payments/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next),
      }).catch(() => null);
      return next;
    });
  };

  const DEFAULT_BOUTIQUE_HERO: BoutiqueHeroConfig = {
    kicker: 'EXCLUSIVE COLLECTION',
    titleLine1: 'Luxury',
    titleLine2: 'For Every Moment',
    subtitleItems: ['Premium Fashion', 'Elegant Accessories', 'Timeless Style'],
    ctaText: 'Shop Now',
    image: '/images/banner_shirts_pants.jpg',
  };

  const [boutiqueHeroConfig, setBoutiqueHeroConfig] = useState<BoutiqueHeroConfig>(() => {
    try {
      const saved = localStorage.getItem('lol_boutique_hero');
      if (saved) {
        return { ...DEFAULT_BOUTIQUE_HERO, ...JSON.parse(saved) };
      }
    } catch {}
    return DEFAULT_BOUTIQUE_HERO;
  });

  const DEFAULT_BRANDING: BrandingConfig = {
    logoUrl: '/images/lap_of_luxury_logo.png',
    storeName: 'LAP OF LUXURY',
    tagline: 'Mahbubnagar Luxury Atelier',
  };

  const [brandingConfig, setBrandingConfig] = useState<BrandingConfig>(() => {
    try {
      const saved = localStorage.getItem('lol_branding_config');
      if (saved) {
        return { ...DEFAULT_BRANDING, ...JSON.parse(saved) };
      }
    } catch {}
    return DEFAULT_BRANDING;
  });

  const updateBoutiqueHeroConfig = async (updates: Partial<BoutiqueHeroConfig>) => {
    const next = { ...boutiqueHeroConfig, ...updates };
    setBoutiqueHeroConfig(next);
    try {
      localStorage.setItem('lol_boutique_hero', JSON.stringify(next));
      await setDoc(doc(db, 'storeSettings', 'hero'), next, { merge: true });
    } catch (e) {
      console.warn('Could not save boutique hero to Firestore:', e);
    }
  };

  const updateBrandingConfig = async (updates: Partial<BrandingConfig>) => {
    const next = { ...brandingConfig, ...updates };
    setBrandingConfig(next);
    try {
      localStorage.setItem('lol_branding_config', JSON.stringify(next));
      await setDoc(doc(db, 'storeSettings', 'branding'), next, { merge: true });
    } catch (e) {
      console.warn('Could not save branding to Firestore:', e);
    }
  };

  const triggerTransition = (categorySlug: string, _label?: string) => {
    setSelectedCategory(categorySlug);
    const element = document.getElementById('catalog-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openProductDetail = (product: Product) => {
    if (typeof window !== 'undefined' && product?.id) {
      window.open(`/product/${product.id}`, '_blank', 'noopener,noreferrer');
    }
  };

  // Permanent sync state to LocalStorage & IndexedDB (ensuring products never disappear)
  useEffect(() => {
    try {
      localStorage.setItem('lol_products', JSON.stringify(products));
    } catch (e) {
      console.warn('LocalStorage quota exceeded for products, syncing to IndexedDB', e);
    }
    idbSetItem('lol_products', products);
  }, [products]);

  // On mount: Real-time synchronization with authoritative Firebase Cloud Firestore
  useEffect(() => {
    // 1. Rehydrate products from Firestore in real-time
    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      if (!snapshot.empty) {
        const list: Product[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as Product);
        });
        setProducts(list);
      } else {
        // If collection is empty, seed initial products so database is populated permanently
        INITIAL_PRODUCTS.forEach(async (p) => {
          try {
            await setDoc(doc(db, 'products', p.id), p);
          } catch (e) {}
        });
      }
    }, (err) => {
      console.warn('Firestore products listener error:', err);
    });

    // 2. Rehydrate banners from Firestore in real-time
    const unsubBanners = onSnapshot(collection(db, 'banners'), (snapshot) => {
      if (!snapshot.empty) {
        const list: BannerSlide[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as BannerSlide);
        });
        setBanners(list);
      } else {
        INITIAL_BANNERS.forEach(async (b) => {
          try {
            await setDoc(doc(db, 'banners', b.id), b);
          } catch (e) {}
        });
      }
    }, (err) => {
      console.warn('Firestore banners listener error:', err);
    });

    // 3. Rehydrate Boutique Hero configuration from Firestore
    const unsubHero = onSnapshot(doc(db, 'storeSettings', 'hero'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as BoutiqueHeroConfig;
        setBoutiqueHeroConfig((prev) => ({ ...prev, ...data }));
      }
    }, (err) => {
      console.warn('Firestore hero listener error:', err);
    });

    // 4. Rehydrate Branding & Logo configuration from Firestore
    const unsubBranding = onSnapshot(doc(db, 'storeSettings', 'branding'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as BrandingConfig;
        setBrandingConfig((prev) => ({ ...prev, ...data }));
      }
    }, (err) => {
      console.warn('Firestore branding listener error:', err);
    });

    // 5. Rehydrate Orders from Firestore in real-time
    const unsubOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
      if (!snapshot.empty) {
        const list: Order[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as Order);
        });
        setOrders(list);
      }
    }, (err) => {
      console.warn('Firestore orders listener error:', err);
    });

    // Fallback rehydrate from IndexedDB for instantaneous local render
    idbGetItem<Product[]>('lol_products').then((savedProducts) => {
      if (Array.isArray(savedProducts) && savedProducts.length > 0) {
        setProducts((current) => {
          if (current.length === 0) return savedProducts;
          return current;
        });
      }
    });

    return () => {
      unsubProducts();
      unsubBanners();
      unsubHero();
      unsubBranding();
      unsubOrders();
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('lol_banners', JSON.stringify(banners));
    } catch {
      // safe fallback
    }
    idbSetItem('lol_banners', banners);
  }, [banners]);

  useEffect(() => {
    try {
      localStorage.setItem('lol_banner_interval', bannerInterval.toString());
    } catch {
      // safe fallback
    }
  }, [bannerInterval]);

  useEffect(() => {
    try {
      localStorage.setItem('lol_categories', JSON.stringify(categories));
    } catch {
      // safe fallback
    }
    idbSetItem('lol_categories', categories);
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem('lol_category_interval', categoryInterval.toString());
    } catch {
      // safe fallback
    }
  }, [categoryInterval]);

  useEffect(() => {
    try {
      localStorage.setItem('lol_cart', JSON.stringify(cart));
    } catch {
      // safe fallback
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('lol_wishlist', JSON.stringify(wishlist));
    } catch {
      // safe fallback
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('lol_orders', JSON.stringify(orders));
    } catch {
      // safe fallback
    }
    idbSetItem('lol_orders', orders);
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('lol_media', JSON.stringify(mediaAssets));
    } catch {
      // safe fallback
    }
    idbSetItem('lol_media', mediaAssets);
  }, [mediaAssets]);

  // Listen to path & hash changes for direct admin access (/admin or #admin)
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (path.startsWith('/admin') || hash.includes('admin') || search.includes('admin')) {
        setIsAdminModeState(true);
      } else {
        setIsAdminModeState(false);
      }
    };
    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  // Products actions (persisted to Firestore, state, and IndexedDB)
  const addProduct = async (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    setProducts((prev) => [newProduct, ...prev]);

    try {
      await setDoc(doc(db, 'products', newProduct.id), newProduct);
    } catch (e) {
      console.warn('Firestore addProduct error:', e);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );

    try {
      await setDoc(doc(db, 'products', id), updates, { merge: true });
    } catch (e) {
      console.warn('Firestore updateProduct error:', e);
    }
  };

  const deleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));

    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (e) {
      console.warn('Firestore deleteProduct error:', e);
    }
  };

  const updateStock = async (id: string, newStock: number) => {
    const safeStock = Math.max(0, newStock);
    const inStock = safeStock > 0;
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              stockCount: safeStock,
              inStock,
            }
          : p
      )
    );

    try {
      await updateDoc(doc(db, 'products', id), { stockCount: safeStock, inStock });
    } catch (e) {
      console.warn('Firestore updateStock error:', e);
    }
  };

  // Banner actions (persisted to Firestore & state)
  const addBanner = async (bannerData: Omit<BannerSlide, 'id'>) => {
    const newBanner: BannerSlide = {
      ...bannerData,
      id: `banner-${Date.now()}`,
    };
    setBanners((prev) => [...prev, newBanner]);

    try {
      await setDoc(doc(db, 'banners', newBanner.id), newBanner);
    } catch (e) {
      console.warn('Firestore addBanner error:', e);
    }
  };

  const updateBanner = async (id: string, updates: Partial<BannerSlide>) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );

    try {
      await setDoc(doc(db, 'banners', id), updates, { merge: true });
    } catch (e) {
      console.warn('Firestore updateBanner error:', e);
    }
  };

  const deleteBanner = async (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));

    try {
      await deleteDoc(doc(db, 'banners', id));
    } catch (e) {
      console.warn('Firestore deleteBanner error:', e);
    }
  };

  // Category actions
  const addCategory = (catData: Omit<CategoryItem, 'id'>) => {
    const newCat: CategoryItem = {
      ...catData,
      id: `cat-${Date.now()}`,
    };
    setCategories((prev) => [...prev, newCat]);
  };

  const updateCategory = (id: string, updates: Partial<CategoryItem>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  // Cart actions
  const addToCart = (product: Product, size?: string, quantity: number = 1) => {
    const chosenSize = size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Standard');
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && (item.selectedSize === chosenSize || item.size === chosenSize)
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && (item.selectedSize === chosenSize || item.size === chosenSize)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, selectedSize: chosenSize, size: chosenSize, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, size?: string, color?: string) => {
    setCart((prev) =>
      prev.filter((item) => {
        if (item.product.id !== productId) return true;
        if (size && item.selectedSize !== size && item.size !== size) return true;
        if (color && item.color !== color) return true;
        return false;
      })
    );
  };

  const updateCartQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && (item.selectedSize === size || item.size === size)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const updateQuantity = (productId: string, sizeOrQty?: any, qtyOrColor?: any, color?: any) => {
    let size: string | undefined;
    let qty: number;
    if (typeof sizeOrQty === 'number') {
      qty = sizeOrQty;
    } else {
      size = sizeOrQty;
      qty = typeof qtyOrColor === 'number' ? qtyOrColor : 1;
    }
    if (qty <= 0) {
      removeFromCart(productId, size, color);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id !== productId) return item;
        if (size && item.selectedSize !== size && item.size !== size) return item;
        return { ...item, quantity: qty };
      })
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Wishlist actions
  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  // Orders and Notifications
  const placeOrder = (
    customer: {
      name: string;
      phone: string;
      email?: string;
      address: string;
      city: string;
      pincode: string;
      paymentMethod: Order['paymentMethod'];
      transactionRef?: string;
      paymentScreenshot?: string;
    },
    discount: number = 0
  ) => {
    const subtotal = cartTotal;
    const shipping = subtotal >= 2999 ? 0 : 150;
    const total = Math.max(0, subtotal - discount + shipping);
    const tracking = `LOL-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      trackingNumber: tracking,
      customerName: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      city: customer.city || 'Mahbubnagar',
      pincode: customer.pincode,
      customer: {
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address,
        city: customer.city || 'Mahbubnagar',
        pincode: customer.pincode,
      },
      items: [...cart],
      subtotal,
      discount,
      shipping,
      total,
      paymentMethod: customer.paymentMethod,
      paymentStatus: 'Payment Pending',
      transactionRef: customer.transactionRef,
      paymentScreenshot: customer.paymentScreenshot,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    // Deduct stock safely across items
    const deductions = cart.map((cartItem) => {
      updateStock(cartItem.product.id, cartItem.product.stockCount - cartItem.quantity);
      return { productId: cartItem.product.id, quantity: cartItem.quantity };
    });

    // Persist order directly to Firestore
    try {
      setDoc(doc(db, 'orders', newOrder.id), newOrder);
    } catch (e) {
      console.warn('Firestore placeOrder error:', e);
    }

    setOrders((prev) => [newOrder, ...prev]);
    setLastPlacedOrder(newOrder);
    sendOrderEmailNotification(newOrder);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );

    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
    } catch (e) {
      console.warn('Firestore updateOrderStatus error:', e);
    }
  };

  const markOrderRead = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, isRead: true } : o))
    );
  };

  const unreadOrdersCount = orders.filter((o) => !o.isRead).length;

  const dismissNotification = () => {
    setLatestNotification(null);
  };

  // Media upload with direct storage upload to avoid storing base64 blobs in product records
  const uploadMediaAsset = async (file: File, category: string = 'Products'): Promise<MediaAsset> => {
    let dataUrl: string;
    try {
      dataUrl = await compressImage(file, 1200, 0.85);
    } catch {
      dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    let storageUrl = dataUrl;
    try {
      const storageRef = ref(storage, `uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`);
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);
      if (downloadUrl) {
        storageUrl = downloadUrl;
      }
    } catch (e) {
      console.warn('Firebase Storage upload error, falling back to dataUrl:', e);
    }
    try {
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataUrl, filename: file.name }),
      });
      const data = await res.json();
      if (data && data.url) {
        storageUrl = data.url;
      }
    } catch (e) {
      console.warn('Backend media upload error, using local url:', e);
    }

    const newAsset: MediaAsset = {
      id: `med-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: file.name,
      size: Math.round(dataUrl.length * 0.75),
      type: 'image/jpeg',
      dataUrl: storageUrl,
      createdAt: new Date().toISOString(),
      category,
    };
    setMediaAssets((prev) => [newAsset, ...prev]);
    return newAsset;
  };

  const deleteMediaAsset = (id: string) => {
    setMediaAssets((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStock,
        banners,
        addBanner,
        updateBanner,
        deleteBanner,
        bannerInterval,
        setBannerInterval,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        categoryInterval,
        setCategoryInterval,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        removeFromWishlist,
        isInWishlist,
        orders,
        placeOrder,
        updateOrderStatus,
        markOrderRead,
        unreadOrdersCount,
        latestNotification,
        dismissNotification,
        playOrderChime,
        mediaAssets,
        uploadMediaAsset,
        deleteMediaAsset,
        currentView,
        setCurrentView,
        selectedSubcategory,
        setSelectedSubcategory,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        quickViewProduct,
        setQuickViewProduct,
        isCheckoutOpen,
        setIsCheckoutOpen,
        lastPlacedOrder,
        setLastPlacedOrder,
        isAdminMode,
        setIsAdminMode,
        isExperienceOpen,
        setIsExperienceOpen,
        paymentConfig,
        updatePaymentConfig,
        boutiqueHeroConfig,
        updateBoutiqueHeroConfig,
        brandingConfig,
        updateBrandingConfig,
        isTransitioning,
        transitionLabel,
        triggerTransition,
        openProductDetail,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

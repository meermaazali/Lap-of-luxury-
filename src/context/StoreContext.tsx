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
} from '../types';
import {
  INITIAL_BANNERS,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_MEDIA,
} from '../data/initialData';
import { normalizeImageUrl } from '../utils/imageUtils';
import { sendOrderEmailNotification } from '../utils/orderNotification';
import {
  ensureCloudDataSeeded,
  subscribeToProducts,
  subscribeToBanners,
  subscribeToCategories,
  subscribeToOrders,
  subscribeToStoreSettings,
  subscribeToMediaAssets,
  cloudAddProduct,
  cloudUpdateProduct,
  cloudDeleteProduct,
  cloudUpdateStock,
  cloudAddBanner,
  cloudUpdateBanner,
  cloudDeleteBanner,
  cloudAddCategory,
  cloudUpdateCategory,
  cloudDeleteCategory,
  cloudPlaceOrder,
  cloudUpdateOrderStatus,
  cloudMarkOrderRead,
  cloudUpdateStoreSettings,
  uploadFileToFirebaseStorage,
  cloudAddMediaAsset,
  cloudDeleteMediaAsset,
  DEFAULT_PAYMENT_CONFIG,
  DEFAULT_BOUTIQUE_HERO,
} from '../lib/firebaseServices';

interface StoreContextType {
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<void> | void;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void> | void;
  deleteProduct: (id: string) => Promise<void> | void;
  updateStock: (id: string, newStock: number) => Promise<void> | void;

  // Banners
  banners: BannerSlide[];
  addBanner: (banner: Omit<BannerSlide, 'id'>) => Promise<void> | void;
  updateBanner: (id: string, updates: Partial<BannerSlide>) => Promise<void> | void;
  deleteBanner: (id: string) => Promise<void> | void;
  bannerInterval: number;
  setBannerInterval: (interval: number) => void;

  // Categories
  categories: CategoryItem[];
  addCategory: (category: Omit<CategoryItem, 'id'>) => Promise<void> | void;
  updateCategory: (id: string, updates: Partial<CategoryItem>) => Promise<void> | void;
  deleteCategory: (id: string) => Promise<void> | void;
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

  // Flagship Boutique Hero Configuration
  boutiqueHeroConfig: BoutiqueHeroConfig;
  updateBoutiqueHeroConfig: (updates: Partial<BoutiqueHeroConfig>) => void;

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

export function playOrderChime() {
  // Silent per luxury branding requirement
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Authoritative Cloud Collections (initialized with clean presets, kept in live real-time sync with Firestore)
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [banners, setBanners] = useState<BannerSlide[]>(INITIAL_BANNERS);
  const [bannerInterval, setBannerIntervalState] = useState<number>(5);
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [categoryInterval, setCategoryIntervalState] = useState<number>(4);
  const [orders, setOrders] = useState<Order[]>([]);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>(INITIAL_MEDIA);
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>(DEFAULT_PAYMENT_CONFIG);
  const [boutiqueHeroConfig, setBoutiqueHeroConfig] = useState<BoutiqueHeroConfig>(DEFAULT_BOUTIQUE_HERO);

  // 2. Shopper Local Session Storage (Cart & Wishlist specific to current shopper's browser)
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

  useEffect(() => {
    try {
      localStorage.setItem('lol_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('lol_wishlist', JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  // 3. Navigation & Route States
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

  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [transitionLabel, setTransitionLabel] = useState<string>('');

  const triggerTransition = (categorySlug: string, label?: string) => {
    setSelectedCategory(categorySlug);
    if (label) {
      setTransitionLabel(label);
      setIsTransitioning(true);
      setTimeout(() => setIsTransitioning(false), 300);
    }
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

  // ============================================================================
  // 4. REAL-TIME FIRESTORE DATA SYNCHRONIZATION (AUTHORITATIVE CLOUD CONNECTION)
  // ============================================================================
  useEffect(() => {
    let unsubProducts: (() => void) | undefined;
    let unsubBanners: (() => void) | undefined;
    let unsubCategories: (() => void) | undefined;
    let unsubOrders: (() => void) | undefined;
    let unsubSettings: (() => void) | undefined;
    let unsubMedia: (() => void) | undefined;

    // A. Verify or Seed Cloud Firestore if completely empty
    ensureCloudDataSeeded()
      .catch((err) => console.warn('Cloud seeding check:', err))
      .finally(() => {
        // B. Attach live real-time listeners across all devices
        try {
          unsubProducts = subscribeToProducts((cloudProducts) => {
            if (cloudProducts && cloudProducts.length > 0) {
              setProducts(cloudProducts);
            }
          });
        } catch (e) {
          console.error('Failed to subscribe to products:', e);
        }

        try {
          unsubBanners = subscribeToBanners((cloudBanners) => {
            if (cloudBanners && cloudBanners.length > 0) {
              setBanners(cloudBanners);
            }
          });
        } catch (e) {
          console.error('Failed to subscribe to banners:', e);
        }

        try {
          unsubCategories = subscribeToCategories((cloudCategories) => {
            if (cloudCategories && cloudCategories.length > 0) {
              setCategories(cloudCategories);
            }
          });
        } catch (e) {
          console.error('Failed to subscribe to categories:', e);
        }

        try {
          unsubOrders = subscribeToOrders((cloudOrders) => {
            setOrders(cloudOrders);
            // Trigger in-app notification if a new unread order arrives
            const unread = cloudOrders.find((o) => !o.isRead);
            if (unread) {
              setLatestNotification(unread);
            }
          });
        } catch (e) {
          console.error('Failed to subscribe to orders:', e);
        }

        try {
          unsubSettings = subscribeToStoreSettings((settings) => {
            if (settings.paymentConfig) {
              setPaymentConfig(settings.paymentConfig);
            }
            if (settings.boutiqueHeroConfig) {
              setBoutiqueHeroConfig(settings.boutiqueHeroConfig);
            }
            if (typeof settings.bannerInterval === 'number') {
              setBannerIntervalState(settings.bannerInterval);
            }
            if (typeof settings.categoryInterval === 'number') {
              setCategoryIntervalState(settings.categoryInterval);
            }
          });
        } catch (e) {
          console.error('Failed to subscribe to storeSettings:', e);
        }

        try {
          unsubMedia = subscribeToMediaAssets((cloudMedia) => {
            if (cloudMedia && cloudMedia.length > 0) {
              setMediaAssets(cloudMedia);
            }
          });
        } catch (e) {
          console.error('Failed to subscribe to media:', e);
        }
      });

    return () => {
      unsubProducts?.();
      unsubBanners?.();
      unsubCategories?.();
      unsubOrders?.();
      unsubSettings?.();
      unsubMedia?.();
    };
  }, []);

  // ============================================================================
  // 5. CLOUD MUTATION ACTIONS (WRITES TO FIRESTORE DIRECTLY)
  // ============================================================================

  // Products
  const addProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      const created = await cloudAddProduct(productData);
      setProducts((prev) => [created, ...prev.filter((p) => p.id !== created.id)]);
    } catch (err) {
      console.error('Failed to add product to cloud:', err);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
      await cloudUpdateProduct(id, updates);
    } catch (err) {
      console.error('Failed to update product in cloud:', err);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      await cloudDeleteProduct(id);
    } catch (err) {
      console.error('Failed to delete product from cloud:', err);
    }
  };

  const updateStock = async (id: string, newStock: number) => {
    try {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                stockCount: Math.max(0, newStock),
                inStock: newStock > 0,
              }
            : p
        )
      );
      await cloudUpdateStock(id, newStock);
    } catch (err) {
      console.error('Failed to update stock in cloud:', err);
    }
  };

  // Banners
  const addBanner = async (bannerData: Omit<BannerSlide, 'id'>) => {
    try {
      const created = await cloudAddBanner(bannerData);
      setBanners((prev) => [...prev.filter((b) => b.id !== created.id), created]);
    } catch (err) {
      console.error('Failed to add banner to cloud:', err);
    }
  };

  const updateBanner = async (id: string, updates: Partial<BannerSlide>) => {
    try {
      setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
      await cloudUpdateBanner(id, updates);
    } catch (err) {
      console.error('Failed to update banner in cloud:', err);
    }
  };

  const deleteBanner = async (id: string) => {
    try {
      setBanners((prev) => prev.filter((b) => b.id !== id));
      await cloudDeleteBanner(id);
    } catch (err) {
      console.error('Failed to delete banner from cloud:', err);
    }
  };

  const setBannerInterval = (interval: number) => {
    setBannerIntervalState(interval);
    void cloudUpdateStoreSettings({ bannerInterval: interval });
  };

  // Categories
  const addCategory = async (catData: Omit<CategoryItem, 'id'>) => {
    try {
      const created = await cloudAddCategory(catData);
      setCategories((prev) => [...prev.filter((c) => c.id !== created.id), created]);
    } catch (err) {
      console.error('Failed to add category to cloud:', err);
    }
  };

  const updateCategory = async (id: string, updates: Partial<CategoryItem>) => {
    try {
      setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
      await cloudUpdateCategory(id, updates);
    } catch (err) {
      console.error('Failed to update category in cloud:', err);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      await cloudDeleteCategory(id);
    } catch (err) {
      console.error('Failed to delete category from cloud:', err);
    }
  };

  const setCategoryInterval = (interval: number) => {
    setCategoryIntervalState(interval);
    void cloudUpdateStoreSettings({ categoryInterval: interval });
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

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
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

    // Deduct stock in Cloud Firestore across all devices
    cart.forEach((cartItem) => {
      void cloudUpdateStock(cartItem.product.id, Math.max(0, cartItem.product.stockCount - cartItem.quantity));
    });

    // Write order directly to Cloud Firestore
    void cloudPlaceOrder(newOrder);

    setOrders((prev) => [newOrder, ...prev]);
    setLastPlacedOrder(newOrder);
    sendOrderEmailNotification(newOrder);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    void cloudUpdateOrderStatus(orderId, status);
  };

  const markOrderRead = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, isRead: true } : o))
    );
    void cloudMarkOrderRead(orderId);
  };

  const unreadOrdersCount = orders.filter((o) => !o.isRead).length;

  const dismissNotification = () => {
    setLatestNotification(null);
  };

  // Payment Setup Configuration
  const updatePaymentConfig = (updates: Partial<PaymentConfig>) => {
    setPaymentConfig((prev) => {
      const next = { ...prev, ...updates, enableCOD: false };
      void cloudUpdateStoreSettings({ paymentConfig: next });
      return next;
    });
  };

  // Flagship Boutique Hero Configuration
  const updateBoutiqueHeroConfig = (updates: Partial<BoutiqueHeroConfig>) => {
    setBoutiqueHeroConfig((prev) => {
      const next = { ...prev, ...updates };
      void cloudUpdateStoreSettings({ boutiqueHeroConfig: next });
      return next;
    });
  };

  // Media upload with direct Firebase Storage upload
  const uploadMediaAsset = async (file: File, category: string = 'Products'): Promise<MediaAsset> => {
    const storageUrl = await uploadFileToFirebaseStorage(file, 'media');
    const newAsset = await cloudAddMediaAsset({
      name: file.name,
      size: file.size,
      type: file.type || 'image/jpeg',
      dataUrl: storageUrl,
      createdAt: new Date().toISOString(),
      category,
    });
    setMediaAssets((prev) => [newAsset, ...prev]);
    return newAsset;
  };

  const deleteMediaAsset = (id: string) => {
    setMediaAssets((prev) => prev.filter((m) => m.id !== id));
    void cloudDeleteMediaAsset(id);
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

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
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateStock: (id: string, newStock: number) => Promise<void>;

  // Banners
  banners: BannerSlide[];
  addBanner: (banner: Omit<BannerSlide, 'id'>) => Promise<BannerSlide>;
  updateBanner: (id: string, updates: Partial<BannerSlide>) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;
  bannerInterval: number;
  setBannerInterval: (interval: number) => void;

  // Categories
  categories: CategoryItem[];
  addCategory: (category: Omit<CategoryItem, 'id'>) => Promise<CategoryItem>;
  updateCategory: (id: string, updates: Partial<CategoryItem>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
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
  deleteMediaAsset: (id: string) => Promise<void>;

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
  // 1. Cloud collections
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [banners, setBanners] = useState<BannerSlide[]>(INITIAL_BANNERS);
  const [bannerInterval, setBannerIntervalState] = useState<number>(5);
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [categoryInterval, setCategoryIntervalState] = useState<number>(4);
  const [orders, setOrders] = useState<Order[]>([]);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>(INITIAL_MEDIA);
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>(DEFAULT_PAYMENT_CONFIG);
  const [boutiqueHeroConfig, setBoutiqueHeroConfig] =
    useState<BoutiqueHeroConfig>(DEFAULT_BOUTIQUE_HERO);

  // 2. Shopper session storage: cart and wishlist
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

  // 3. Navigation and route states
  const getInitialView = () => {
    if (typeof window === 'undefined') return 'home';

    const hash = window.location.hash.toLowerCase().replace('#', '');
    const validViews = [
      'home',
      'men',
      'women',
      'bags',
      'footwear',
      'shoes',
      'accessories',
      'collections',
      'bestsellers',
      'sale',
      'new-arrivals',
    ];

    if (validViews.includes(hash)) {
      return hash === 'shoes' ? 'footwear' : hash;
    }

    return 'home';
  };

  const [currentView, setCurrentViewState] = useState<string>(() => getInitialView());
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  const setCurrentView = (view: string, subCategory?: string | null) => {
    const norm =
      view.toLowerCase().trim() === 'shoes'
        ? 'footwear'
        : view.toLowerCase().trim();

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

    return (
      path.startsWith('/admin') ||
      hash.includes('admin') ||
      search.includes('admin')
    );
  };

  const checkIsExperienceRoute = () => {
    if (typeof window === 'undefined') return false;

    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();

    return (
      path.startsWith('/experience') ||
      hash.includes('experience') ||
      search.includes('experience')
    );
  };

  const [isAdminMode, setIsAdminModeState] = useState<boolean>(() => checkIsAdminRoute());
  const [isExperienceOpen, setIsExperienceOpenState] =
    useState<boolean>(() => checkIsExperienceRoute());

  const setIsAdminMode = (admin: boolean) => {
    setIsAdminModeState(admin);

    if (typeof window !== 'undefined') {
      if (admin) {
        if (
          !window.location.pathname.startsWith('/admin') &&
          !window.location.hash.includes('admin')
        ) {
          try {
            window.history.pushState(null, '', '/admin');
          } catch {
            window.location.hash = 'admin';
          }
        }
      } else {
        if (
          window.location.pathname.startsWith('/admin') ||
          window.location.hash.includes('admin')
        ) {
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
        if (
          !window.location.pathname.startsWith('/experience') &&
          !window.location.hash.includes('experience')
        ) {
          try {
            window.history.pushState(null, '', '/experience');
          } catch {
            window.location.hash = 'experience';
          }
        }
      } else {
        if (
          window.location.pathname.startsWith('/experience') ||
          window.location.hash.includes('experience')
        ) {
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
  // 4. REAL-TIME FIRESTORE DATA SYNCHRONIZATION
  // ============================================================================
  useEffect(() => {
    let unsubProducts: (() => void) | undefined;
    let unsubBanners: (() => void) | undefined;
    let unsubCategories: (() => void) | undefined;
    let unsubOrders: (() => void) | undefined;
    let unsubSettings: (() => void) | undefined;
    let unsubMedia: (() => void) | undefined;
    let cancelled = false;

    ensureCloudDataSeeded()
      .catch((err) => {
        console.warn('Cloud seeding check:', err);
      })
      .finally(() => {
        if (cancelled) return;

        // Products
        try {
          unsubProducts = subscribeToProducts((cloudProducts) => {
            setProducts(cloudProducts);
          });
        } catch (error) {
          console.error('Failed to subscribe to products:', error);
        }

        // Banners
        try {
          unsubBanners = subscribeToBanners((cloudBanners) => {
            setBanners(cloudBanners);
          });
        } catch (error) {
          console.error('Failed to subscribe to banners:', error);
        }

        // Categories
        try {
          unsubCategories = subscribeToCategories((cloudCategories) => {
            setCategories(cloudCategories);
          });
        } catch (error) {
          console.error('Failed to subscribe to categories:', error);
        }

        // Orders and notifications
        try {
          unsubOrders = subscribeToOrders((cloudOrders) => {
            setOrders(cloudOrders);

            const unread = cloudOrders.find((order) => !order.isRead);

            if (unread) {
              setLatestNotification(unread);
            }
          });
        } catch (error) {
          console.error('Failed to subscribe to orders:', error);
        }

        // Store settings
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
        } catch (error) {
          console.error('Failed to subscribe to store settings:', error);
        }

        // Media library: also accept an empty cloud list after deletions
        try {
          unsubMedia = subscribeToMediaAssets((cloudMedia) => {
            setMediaAssets(cloudMedia);
          });
        } catch (error) {
          console.error('Failed to subscribe to media:', error);
        }
      });

    return () => {
      cancelled = true;
      unsubProducts?.();
      unsubBanners?.();
      unsubCategories?.();
      unsubOrders?.();
      unsubSettings?.();
      unsubMedia?.();
    };
  }, []);

  // ============================================================================
  // 5. CLOUD MUTATION ACTIONS
  // ============================================================================

  // Products
  const addProduct = async (
    productData: Omit<Product, 'id'>
  ): Promise<Product> => {
    const created = await cloudAddProduct(productData);

    setProducts((prev) => [
      created,
      ...prev.filter((product) => product.id !== created.id),
    ]);

    return created;
  };

  const updateProduct = async (
    id: string,
    updates: Partial<Product>
  ): Promise<void> => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, ...updates } : product
      )
    );

    await cloudUpdateProduct(id, updates);
  };

  const deleteProduct = async (id: string): Promise<void> => {
    await cloudDeleteProduct(id);
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  const updateStock = async (
    id: string,
    newStock: number
  ): Promise<void> => {
    const safeStock = Math.max(0, newStock);

    await cloudUpdateStock(id, safeStock);

    setProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? {
              ...product,
              stockCount: safeStock,
              inStock: safeStock > 0,
            }
          : product
      )
    );
  };

  // Banners
  const addBanner = async (
    bannerData: Omit<BannerSlide, 'id'>
  ): Promise<BannerSlide> => {
    const created = await cloudAddBanner(bannerData);

    setBanners((prev) => [
      ...prev.filter((banner) => banner.id !== created.id),
      created,
    ]);

    return created;
  };

  const updateBanner = async (
    id: string,
    updates: Partial<BannerSlide>
  ): Promise<void> => {
    await cloudUpdateBanner(id, updates);

    setBanners((prev) =>
      prev.map((banner) =>
        banner.id === id ? { ...banner, ...updates } : banner
      )
    );
  };

  const deleteBanner = async (id: string): Promise<void> => {
    await cloudDeleteBanner(id);
    setBanners((prev) => prev.filter((banner) => banner.id !== id));
  };

  const setBannerInterval = (interval: number) => {
    setBannerIntervalState(interval);
    void cloudUpdateStoreSettings({ bannerInterval: interval });
  };

  // Categories
  const addCategory = async (
    categoryData: Omit<CategoryItem, 'id'>
  ): Promise<CategoryItem> => {
    const created = await cloudAddCategory(categoryData);

    setCategories((prev) => [
      ...prev.filter((category) => category.id !== created.id),
      created,
    ]);

    return created;
  };

  const updateCategory = async (
    id: string,
    updates: Partial<CategoryItem>
  ): Promise<void> => {
    await cloudUpdateCategory(id, updates);

    setCategories((prev) =>
      prev.map((category) =>
        category.id === id ? { ...category, ...updates } : category
      )
    );
  };

  const deleteCategory = async (id: string): Promise<void> => {
    await cloudDeleteCategory(id);
    setCategories((prev) => prev.filter((category) => category.id !== id));
  };

  const setCategoryInterval = (interval: number) => {
    setCategoryIntervalState(interval);
    void cloudUpdateStoreSettings({ categoryInterval: interval });
  };

  // Cart actions
  const addToCart = (
    product: Product,
    size?: string,
    quantity: number = 1
  ) => {
    const chosenSize =
      size ||
      (product.sizes && product.sizes.length > 0
        ? product.sizes[0]
        : 'Standard');

    setCart((prev) => {
      const existing = prev.find(
        (item) =>
          item.product.id === product.id &&
          (item.selectedSize === chosenSize || item.size === chosenSize)
      );

      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id &&
          (item.selectedSize === chosenSize || item.size === chosenSize)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [
        ...prev,
        {
          product,
          selectedSize: chosenSize,
          size: chosenSize,
          quantity,
        },
      ];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (
    productId: string,
    size?: string,
    color?: string
  ) => {
    setCart((prev) =>
      prev.filter((item) => {
        if (item.product.id !== productId) return true;
        if (size && item.selectedSize !== size && item.size !== size) return true;
        if (color && item.color !== color) return true;
        return false;
      })
    );
  };

  const updateCartQuantity = (
    productId: string,
    size: string,
    quantity: number
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId &&
        (item.selectedSize === size || item.size === size)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const updateQuantity = (
    productId: string,
    sizeOrQty?: any,
    qtyOrColor?: any,
    color?: any
  ) => {
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

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // Wishlist actions
  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);

      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }

      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.filter((product) => product.id !== productId)
    );
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((product) => product.id === productId);
  };

  // Orders and notifications
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

    // Deduct stock in the cloud
    cart.forEach((cartItem) => {
      void cloudUpdateStock(
        cartItem.product.id,
        Math.max(
          0,
          cartItem.product.stockCount - cartItem.quantity
        )
      ).catch((error) => {
        console.error('Failed to update product stock:', error);
      });
    });

    // Save the order in the cloud
    void cloudPlaceOrder(newOrder).catch((error) => {
      console.error('Failed to save order to the cloud:', error);
    });

    setOrders((prev) => [newOrder, ...prev]);
    setLastPlacedOrder(newOrder);
    sendOrderEmailNotification(newOrder);
    clearCart();

    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string,
    status: Order['status']
  ) => {
    void cloudUpdateOrderStatus(orderId, status).catch((error) => {
      console.error('Failed to update order status:', error);
    });

    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const markOrderRead = (orderId: string) => {
    void cloudMarkOrderRead(orderId).catch((error) => {
      console.error('Failed to mark order as read:', error);
    });

    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, isRead: true } : order
      )
    );
  };

  const unreadOrdersCount = orders.filter(
    (order) => !order.isRead
  ).length;

  const dismissNotification = () => {
    setLatestNotification(null);
  };

  // Payment setup configuration
  const updatePaymentConfig = (updates: Partial<PaymentConfig>) => {
    setPaymentConfig((prev) => {
      const next = {
        ...prev,
        ...updates,
        enableCOD: false,
      };

      void cloudUpdateStoreSettings({ paymentConfig: next }).catch((error) => {
        console.error('Failed to save payment settings:', error);
      });

      return next;
    });
  };

  // Boutique hero configuration
  const updateBoutiqueHeroConfig = (
    updates: Partial<BoutiqueHeroConfig>
  ) => {
    setBoutiqueHeroConfig((prev) => {
      const next = { ...prev, ...updates };

      void cloudUpdateStoreSettings({
        boutiqueHeroConfig: next,
      }).catch((error) => {
        console.error('Failed to save boutique settings:', error);
      });

      return next;
    });
  };

  // ============================================================================
  // Media library and Firebase Storage
  // ============================================================================

  const uploadMediaAsset = async (
    file: File,
    category: string = 'Products'
  ): Promise<MediaAsset> => {
    if (!file || file.size === 0) {
      throw new Error('Please select a valid image file.');
    }

    // Upload the actual file to Firebase Storage first.
    const storageUrl = await uploadFileToFirebaseStorage(file, 'media');

    if (!storageUrl.startsWith('https://')) {
      throw new Error(
        'The image upload did not return a permanent HTTPS URL.'
      );
    }

    // Save its URL and details to the cloud media collection.
    const newAsset = await cloudAddMediaAsset({
      name: file.name,
      size: file.size,
      type: file.type || 'image/jpeg',
      dataUrl: storageUrl,
      createdAt: new Date().toISOString(),
      category,
    });

    setMediaAssets((prev) => [
      newAsset,
      ...prev.filter((asset) => asset.id !== newAsset.id),
    ]);

    return newAsset;
  };

  const deleteMediaAsset = async (id: string): Promise<void> => {
    // Delete the cloud record before removing it from the visible gallery.
    await cloudDeleteMediaAsset(id);

    setMediaAssets((prev) =>
      prev.filter((asset) => asset.id !== id)
    );
  };

  // ============================================================================
  // Provide the store context to the existing website
  // ============================================================================

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

        paymentConfig,
        updatePaymentConfig,
        boutiqueHeroConfig,
        updateBoutiqueHeroConfig,

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
    throw new Error('useStore must be used within a StoreProvider
    }

  return context;
};
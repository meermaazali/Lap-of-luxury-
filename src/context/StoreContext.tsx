import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  BannerSlide,
  CategoryItem,
  CartItem,
  Order,
  MediaAsset,
  PaymentConfig,
} from '../types';
import {
  INITIAL_BANNERS,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_MEDIA,
} from '../data/initialData';

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
  removeFromCart: (productId: string, size: string) => void;
  updateCartQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Wishlist
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
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
      paymentMethod: 'COD' | 'UPI' | 'Card';
      transactionRef?: string;
    },
    discount?: number
  ) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  markOrderRead: (orderId: string) => void;
  unreadOrdersCount: number;
  latestNotification: Order | null;
  dismissNotification: () => void;

  // Payment Setup Configuration
  paymentConfig: PaymentConfig;
  updatePaymentConfig: (updates: Partial<PaymentConfig>) => void;

  // Media Library / Cloud Storage
  mediaAssets: MediaAsset[];
  uploadMediaAsset: (file: File, category?: string) => Promise<MediaAsset>;
  deleteMediaAsset: (id: string) => void;

  // Navigation & Filtering
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

  // Category & Navigation Luxury White Screen Transition
  isTransitioning: boolean;
  transitionLabel: string;
  triggerTransition: (categorySlug: string, label?: string) => void;
  openProductDetail: (product: Product) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Web Audio API chime helper for luxury notification
function playOrderChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Primary warm bell chime
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
    osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.15); // E6
    
    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.85);

    // Harmonic bell overtone
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1760, ctx.currentTime + 0.08);
    gain2.gain.setValueAtTime(0.12, ctx.currentTime + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.08);
    osc2.stop(ctx.currentTime + 0.9);
  } catch (err) {
    console.warn('Audio chime could not be played automatically:', err);
  }
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial from localStorage or defaults
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('lol_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [banners, setBanners] = useState<BannerSlide[]>(() => {
    const saved = localStorage.getItem('lol_banners');
    return saved ? JSON.parse(saved) : INITIAL_BANNERS;
  });

  const [bannerInterval, setBannerInterval] = useState<number>(() => {
    const saved = localStorage.getItem('lol_banner_interval');
    return saved ? Number(saved) : 5; // 5 seconds default
  });

  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    const saved = localStorage.getItem('lol_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [categoryInterval, setCategoryInterval] = useState<number>(() => {
    const saved = localStorage.getItem('lol_category_interval');
    return saved ? Number(saved) : 4;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('lol_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('lol_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('lol_orders');
    if (saved) {
      try {
        const parsed: Order[] = JSON.parse(saved);
        // Filter out any previous dummy/mockup orders so state is neat and clean!
        const cleaned = parsed.filter(
          (o) => o.id !== 'order-101' && o.id !== 'order-102'
        );
        return cleaned;
      } catch {
        return [];
      }
    }
    return [];
  });

  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>(() => {
    const saved = localStorage.getItem('lol_media');
    return saved ? JSON.parse(saved) : INITIAL_MEDIA;
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);
  const [latestNotification, setLatestNotification] = useState<Order | null>(null);

  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    return window.location.hash.toLowerCase().includes('admin');
  });

  // White Screen Luxury Transition State
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [transitionLabel, setTransitionLabel] = useState<string>('');

  // Payment Setup Configuration
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>(() => {
    const saved = localStorage.getItem('lol_payment_config');
    return saved
      ? JSON.parse(saved)
      : {
          upiId: '7578887888@ybl',
          payeeName: 'Lap of Luxury Mahbubnagar',
          upiNumber: '75 7888 7888',
          qrCodeImage: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi%3A%2F%2Fpay%3Fpa%3D7578887888%40ybl%26pn%3DLap%2520of%2520Luxury%26cu%3DINR',
          enableUPI: true,
          enableCOD: true,
          enableCard: false,
          bankAccountNumber: '50200012345678',
          bankIfsc: 'HDFC0001234',
          bankName: 'HDFC Bank, Mahbubnagar',
          instructions: 'Scan the UPI QR code or send to the UPI ID. Enter 12-digit UTR below.',
        };
  });

  const updatePaymentConfig = (updates: Partial<PaymentConfig>) => {
    setPaymentConfig((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem('lol_payment_config', JSON.stringify(next));
      return next;
    });
  };

  const triggerTransition = (categorySlug: string, label?: string) => {
    setIsTransitioning(true);
    setTransitionLabel(label || categorySlug);

    // Scroll to catalog section and filter category
    setTimeout(() => {
      setSelectedCategory(categorySlug);
      const element = document.getElementById('catalog-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 280);

    // Fade out white transition screen
    setTimeout(() => {
      setIsTransitioning(false);
    }, 720);
  };

  const openProductDetail = (product: Product) => {
    setIsTransitioning(true);
    setTransitionLabel(product.name);

    setTimeout(() => {
      setQuickViewProduct(product);
    }, 280);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 640);
  };

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('lol_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('lol_banners', JSON.stringify(banners));
  }, [banners]);

  useEffect(() => {
    localStorage.setItem('lol_banner_interval', bannerInterval.toString());
  }, [bannerInterval]);

  useEffect(() => {
    localStorage.setItem('lol_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('lol_category_interval', categoryInterval.toString());
  }, [categoryInterval]);

  useEffect(() => {
    localStorage.setItem('lol_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('lol_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('lol_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('lol_media', JSON.stringify(mediaAssets));
  }, [mediaAssets]);

  // Listen to hash changes for direct admin access #admin
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash.toLowerCase().includes('admin')) {
        setIsAdminMode(true);
      } else {
        setIsAdminMode(false);
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Products actions
  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const updateStock = (id: string, newStock: number) => {
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
  };

  // Banner actions
  const addBanner = (bannerData: Omit<BannerSlide, 'id'>) => {
    const newBanner: BannerSlide = {
      ...bannerData,
      id: `banner-${Date.now()}`,
    };
    setBanners((prev) => [...prev, newBanner]);
  };

  const updateBanner = (id: string, updates: Partial<BannerSlide>) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  };

  const deleteBanner = (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
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
    const chosenSize = size || (product.sizes.length > 0 ? product.sizes[0] : 'Standard');
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.selectedSize === chosenSize
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.selectedSize === chosenSize
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, selectedSize: chosenSize, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.selectedSize === size)
      )
    );
  };

  const updateCartQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.selectedSize === size
          ? { ...item, quantity }
          : item
      )
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
      paymentMethod: 'COD' | 'UPI' | 'Card';
      transactionRef?: string;
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
      items: [...cart],
      subtotal,
      discount,
      shipping,
      total,
      paymentMethod: customer.paymentMethod,
      paymentStatus: customer.paymentMethod === 'UPI' ? 'Verified' : 'Pending',
      transactionRef: customer.transactionRef,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    // Deduct stock
    cart.forEach((cartItem) => {
      updateStock(cartItem.product.id, cartItem.product.stockCount - cartItem.quantity);
    });

    setOrders((prev) => [newOrder, ...prev]);
    setLastPlacedOrder(newOrder);
    setLatestNotification(newOrder);
    playOrderChime();
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
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

  // Media upload (unlimited local/cloud storage via DataURL + File reader)
  const uploadMediaAsset = (file: File, category: string = 'Products'): Promise<MediaAsset> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const newAsset: MediaAsset = {
          id: `med-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          name: file.name,
          size: file.size,
          type: file.type,
          dataUrl,
          createdAt: new Date().toISOString(),
          category,
        };
        setMediaAssets((prev) => [newAsset, ...prev]);
        resolve(newAsset);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
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
        clearCart,
        cartTotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        isInWishlist,
        orders,
        placeOrder,
        updateOrderStatus,
        markOrderRead,
        unreadOrdersCount,
        latestNotification,
        dismissNotification,
        mediaAssets,
        uploadMediaAsset,
        deleteMediaAsset,
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
        paymentConfig,
        updatePaymentConfig,
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

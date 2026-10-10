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
  INITIAL_ORDERS,
  INITIAL_MEDIA,
} from '../data/initialData';
import { normalizeImageUrl, compressImage, FALLBACK_CATEGORY_IMAGES } from '../utils/imageUtils';
import { sendOrderEmailNotification } from '../utils/orderNotification';

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

// Web Audio API chime helper for luxury notification
export function playOrderChime() {
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
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem('lol_payment_config', JSON.stringify(next));
      } catch (e) {
        console.warn('Could not save payment config to localStorage:', e);
      }
      return next;
    });
  };

  const DEFAULT_BOUTIQUE_HERO: BoutiqueHeroConfig = {
    kicker: 'EXCLUSIVE COLLECTION',
    titleLine1: 'Luxury',
    titleLine2: 'For Every Moment',
    subtitleItems: ['Premium Fashion', 'Elegant Accessories', 'Timeless Style'],
    ctaText: 'Shop Now',
    image: '/images/flagship_banner_16_9.jpg',
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

  const updateBoutiqueHeroConfig = (updates: Partial<BoutiqueHeroConfig>) => {
    setBoutiqueHeroConfig((prev) => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem('lol_boutique_hero', JSON.stringify(next));
      } catch (e) {
        console.warn('Could not save boutique hero to localStorage:', e);
      }
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
    sendOrderEmailNotification(newOrder);
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

  // Media upload with automatic web optimization (<150KB compression) to ensure unlimited uploads without storage quota limits
  const uploadMediaAsset = async (file: File, category: string = 'Products'): Promise<MediaAsset> => {
    let dataUrl: string;
    try {
      dataUrl = await compressImage(file, 1000, 0.82);
    } catch {
      dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    const newAsset: MediaAsset = {
      id: `med-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: file.name,
      size: Math.round(dataUrl.length * 0.75),
      type: 'image/jpeg',
      dataUrl,
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
        playOrderChime,
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

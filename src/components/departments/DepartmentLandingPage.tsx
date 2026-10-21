import React, { useState, useMemo, useEffect } from 'react';
import {
  Filter,
  SlidersHorizontal,
  ChevronDown,
  X,
  Heart,
  Eye,
  Check,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  ArrowUpDown,
  ChevronRight,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { normalizeImageUrl, FALLBACK_LUXURY_IMAGE } from '../../utils/imageUtils';

interface DepartmentLandingPageProps {
  departmentKey: string;
}

interface DeptMeta {
  title: string;
  tagline: string;
  bannerImage: string;
  subcategories: string[];
}

const DEPARTMENT_CONFIGS: Record<string, DeptMeta> = {
  men: {
    title: "MEN'S FASHION & SARTORIAL",
    tagline: 'Impeccable tailoring, double-ply cotton shirts, luxury polos, raw denim and handcrafted footwear.',
    bannerImage: '/images/category_mens_fashion_1791290148102.jpg',
    subcategories: [
      "Men's Collection",
      'Shirts',
      'T-Shirts & Polos',
      'Trousers',
      'Jeans',
      'Kurta Sets',
      'Sneakers',
      'Loafers',
      'Belts',
      'Watches',
      'Perfumes',
    ],
  },
  women: {
    title: "WOMEN'S COUTURE & ETHNIC",
    tagline: 'Pure Banarasi silks, hand-embroidered evening dresses, fluid co-ord sets, handbags and heels.',
    bannerImage: '/images/cat_womens_dress.jpg',
    subcategories: [
      "Women's Collection",
      'Sarees',
      'Dresses',
      'Tops and Shirts',
      'Co-ord Sets',
      'Handbags',
      'Clutches',
      'Heels',
      'Flats',
    ],
  },
  bags: {
    title: 'BAGS & LEATHER ATELIER',
    tagline: 'Architectural top-handle bags, quilted clutches, saddle slings, executive briefcases and weekender totes.',
    bannerImage: '/images/cat_bag_cream.jpg',
    subcategories: [
      'Bags & Luggage',
      'Handbags',
      'Shoulder Bags',
      'Sling Bags',
      'Clutches',
      'Totes',
      'Wallets',
      'Travel Bags',
    ],
  },
  footwear: {
    title: 'PREMIUM FOOTWEAR COLLECTION',
    tagline: 'Minimalist Italian sneakers, Goodyear-welted penny loafers, formal brogues and crystal stiletto heels.',
    bannerImage: '/images/cat_shoes_white.jpg',
    subcategories: [
      'Footwear Collection',
      'Sneakers',
      'Loafers',
      'Formal Shoes',
      'Heels',
      'Sandals',
      'Flats',
    ],
  },
  accessories: {
    title: 'TIMEPIECES & LUXURY ACCESSORIES',
    tagline: 'Automatic chronographs, 24k gold aviator frames, aged Cambodian amber oud and reversible leather belts.',
    bannerImage: '/images/cat_watch_gold.jpg',
    subcategories: [
      'Accessories Collection',
      'Watches',
      'Belts',
      'Sunglasses',
      'Fine Leather Accessories',
    ],
  },
  collections: {
    title: 'THE FESTIVE & OCCASION ATELIER',
    tagline: 'Curated royal wedding and festive couture featuring hand-embroidered zardozi and heirloom handlooms.',
    bannerImage: '/images/festive_edit_luxury_1791098550195.jpg',
    subcategories: ['Collections', 'Festive', 'Occasion', 'Wedding', 'Heritage'],
  },
  bestsellers: {
    title: 'BESTSELLERS & CLIENT FAVORITES',
    tagline: 'The most requested couture pieces and mastercrafted accessories of the season.',
    bannerImage: '/images/luxury_products_hero_1791099185940.jpg',
    subcategories: ['Bestsellers', 'Shirts', 'Jeans', 'Watches', 'Bags', 'Shoes'],
  },
  sale: {
    title: 'EXCLUSIVE ARCHIVE & OFFERS',
    tagline: 'Limited-edition privileged offerings on select festive couture, fine denim and leather accessories.',
    bannerImage: '/images/banner_shirts_pants.jpg',
    subcategories: ['Offers', 'Festive', 'Shirts', 'Jeans', 'Bags'],
  },
  perfumes: {
    title: 'ROYAL PERFUMES & PRIVATE BLENDS',
    tagline: 'Rare Cambodian oud, pure French parfun, extracted ambroxan and artisanal extrait de parfum.',
    bannerImage: '/images/cat_perfume_amber.jpg',
    subcategories: ['Perfumes Collection', 'Oud & Extrait', 'Eau de Parfum', 'Parfum', 'Attar & Oils', 'Dior', 'Chanel', 'Gucci', 'Tom Ford'],
  },
  watches: {
    title: 'TIMEPIECES & CHRONOGRAPHS',
    tagline: 'Master Swiss automatic movements, sapphire bezels, fine chronographs and heirloom horology.',
    bannerImage: '/images/cat_watch_gold.jpg',
    subcategories: ['Watches Collection', 'Chronograph', 'Automatic', 'Dress Watches', 'Gold Editions', 'Rado', 'Tissot', 'Rolex', 'Omega'],
  },
  jeans: {
    title: 'LUXURY JEANS & RAW DENIM',
    tagline: 'Japanese selvedge, tailored slim fit, relaxed regular and contemporary streetwear baggy cuts.',
    bannerImage: '/images/category_jeans_luxury_1791290260306.jpg',
    subcategories: ['Jeans & Denim', 'Slim Fit', 'Regular Fit', 'Baggy Fit', 'Raw Denim', 'Relaxed Fit'],
  },
  'new-arrivals': {
    title: 'NEW ARRIVALS · SEASON DROPS',
    tagline: 'Fresh arrivals direct from our Mahbubnagar store atelier and bespoke tailoring line.',
    bannerImage: '/images/hero_luxury_fashion_1791098539165.jpg',
    subcategories: ['New Arrivals', 'Footwear', 'Bags', 'Jeans', 'Outfits'],
  },
};

export const DepartmentLandingPage: React.FC<DepartmentLandingPageProps> = ({
  departmentKey,
}) => {
  const {
    products,
    categories,
    selectedSubcategory,
    setSelectedSubcategory,
    setCurrentView,
    openProductDetail,
    setQuickViewProduct,
    wishlist,
    toggleWishlist,
    isInWishlist,
  } = useStore();

  const deptMeta = DEPARTMENT_CONFIGS[departmentKey] || DEPARTMENT_CONFIGS.men;

  // Dynamically compute subcategories from configured categories in admin + default presets
  const availableSubcategories = useMemo(() => {
    const defaultSubs = deptMeta.subcategories || ['All'];
    const dynamicSubs = new Set<string>();

    categories.forEach((cat) => {
      const catDept = (cat.department || cat.parentCategory || '').toLowerCase();
      const matchesDept =
        catDept === departmentKey.toLowerCase() ||
        (departmentKey === 'men' && (cat.slug.toLowerCase() === 'men' || cat.slug.toLowerCase() === 'jeans')) ||
        (departmentKey === 'women' && cat.slug.toLowerCase() === 'women') ||
        (departmentKey === 'bags' && cat.slug.toLowerCase() === 'bags') ||
        (departmentKey === 'footwear' && (cat.slug.toLowerCase() === 'shoes' || cat.slug.toLowerCase() === 'footwear')) ||
        (departmentKey === 'perfumes' && cat.slug.toLowerCase() === 'perfumes') ||
        (departmentKey === 'watches' && cat.slug.toLowerCase() === 'watches') ||
        (departmentKey === 'jeans' && cat.slug.toLowerCase() === 'jeans') ||
        (departmentKey === 'accessories' && (cat.slug.toLowerCase() === 'accessories' || cat.slug.toLowerCase() === 'watches' || cat.slug.toLowerCase() === 'perfumes'));

      if (matchesDept && Array.isArray(cat.subcategories)) {
        cat.subcategories.forEach((s) => {
          if (s && typeof s === 'string' && s.trim()) {
            dynamicSubs.add(s.trim());
          }
        });
      }

      if (matchesDept && Array.isArray(cat.brands)) {
        cat.brands.forEach((b) => {
          if (b && typeof b === 'string' && b.trim()) {
            dynamicSubs.add(b.trim());
          }
        });
      }
    });

    const combined = [...defaultSubs];
    dynamicSubs.forEach((s) => {
      if (!combined.some((item) => item.toLowerCase() === s.toLowerCase())) {
        combined.push(s);
      }
    });
    return combined;
  }, [deptMeta, categories, departmentKey]);

  // Local filter states
  const [activeSub, setActiveSub] = useState<string>(selectedSubcategory || 'All');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'rating'>(
    'newest'
  );
  const [priceFilter, setPriceFilter] = useState<'all' | 'under-2000' | '2000-4000' | 'above-4000'>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Sync if selectedSubcategory changes from MegaMenu
  useEffect(() => {
    if (selectedSubcategory) {
      setActiveSub(selectedSubcategory);
    } else {
      setActiveSub('All');
    }
  }, [selectedSubcategory, departmentKey]);

  // Department Product Matching Logic
  const departmentProducts = useMemo(() => {
    return products.filter((p) => {
      const dept = (p.department || '').toLowerCase();
      const cat = (p.category || '').toLowerCase();
      const sub = (p.subCategory || p.subcategory || '').toLowerCase();
      const brand = (p.brand || '').toLowerCase();
      const tags = (p.tags || []).map((t) => t.toLowerCase());

      if (departmentKey === 'men') {
        // Strict exclusion: never show women's items in Men
        if (
          dept === 'women' ||
          cat === 'women' ||
          tags.includes('women') ||
          sub.includes('saree') ||
          sub.includes('gown') ||
          sub.includes('lehenga') ||
          sub.includes('co-ord') ||
          sub.includes('heels')
        ) {
          return false;
        }
        return (
          dept === 'men' ||
          cat === 'men' ||
          cat === 'jeans' ||
          sub.includes('shirt') ||
          sub.includes('polo') ||
          sub.includes('t-shirt') ||
          sub.includes('trouser') ||
          sub.includes('kurta') ||
          sub.includes('loafer') ||
          sub.includes('oxford') ||
          tags.includes('men')
        );
      }

      if (departmentKey === 'women') {
        // Strict exclusion: never show men's items in Women
        if (
          dept === 'men' ||
          cat === 'men' ||
          tags.includes('men')
        ) {
          return false;
        }
        return (
          dept === 'women' ||
          cat === 'women' ||
          sub.includes('saree') ||
          sub.includes('dress') ||
          sub.includes('gown') ||
          sub.includes('lehenga') ||
          sub.includes('co-ord') ||
          sub.includes('handbag') ||
          sub.includes('clutch') ||
          sub.includes('heel') ||
          tags.includes('women')
        );
      }

      if (departmentKey === 'bags') {
        return (
          dept === 'bags' ||
          cat === 'bags' ||
          sub.includes('bag') ||
          sub.includes('clutch') ||
          sub.includes('tote') ||
          sub.includes('wallet') ||
          sub.includes('briefcase')
        );
      }

      if (departmentKey === 'footwear') {
        return (
          dept === 'footwear' ||
          cat === 'shoes' ||
          cat === 'footwear' ||
          sub.includes('sneaker') ||
          sub.includes('loafer') ||
          sub.includes('crocs') ||
          sub.includes('heel') ||
          sub.includes('shoe') ||
          sub.includes('sandals') ||
          sub.includes('flats')
        );
      }

      if (departmentKey === 'perfumes') {
        return (
          dept === 'perfumes' ||
          cat === 'perfumes' ||
          sub.includes('perfume') ||
          sub.includes('oud') ||
          sub.includes('scent') ||
          sub.includes('attar') ||
          tags.some((t) => t.includes('perfume') || t.includes('scent') || t.includes('oud'))
        );
      }

      if (departmentKey === 'watches') {
        return (
          dept === 'watches' ||
          cat === 'watches' ||
          sub.includes('watch') ||
          sub.includes('chronograph') ||
          sub.includes('automatic') ||
          tags.some((t) => t.includes('watch') || t.includes('timepiece'))
        );
      }

      if (departmentKey === 'jeans') {
        return (
          dept === 'jeans' ||
          cat === 'jeans' ||
          sub.includes('jean') ||
          sub.includes('denim') ||
          sub.includes('slim fit') ||
          sub.includes('regular fit') ||
          sub.includes('baggy fit') ||
          tags.some((t) => t.includes('jean') || t.includes('denim'))
        );
      }

      if (departmentKey === 'accessories') {
        return (
          dept === 'accessories' ||
          cat === 'accessories' ||
          cat === 'watches' ||
          cat === 'perfumes' ||
          sub.includes('watch') ||
          sub.includes('belt') ||
          sub.includes('glasses') ||
          sub.includes('sunglasses') ||
          sub.includes('perfume') ||
          sub.includes('oud')
        );
      }

      if (departmentKey === 'collections') {
        return p.isFestiveEdit || tags.some((t) => t.includes('festive') || t.includes('wedding') || t.includes('collection'));
      }

      if (departmentKey === 'bestsellers') {
        return !!p.isBestSeller;
      }

      if (departmentKey === 'sale') {
        return (
          (p.originalPrice && p.originalPrice > p.price) ||
          p.price <= 2000
        );
      }

      if (departmentKey === 'new-arrivals') {
        return true;
      }

      return true;
    });
  }, [products, departmentKey]);

  // Apply Subcategory, Price, Stock & Size Filtering
  const filteredProducts = useMemo(() => {
    let result = [...departmentProducts];

    // Subcategory Filter
    if (activeSub && !activeSub.startsWith('All')) {
      const targetSub = activeSub.toLowerCase();
      result = result.filter((p) => {
        const sub = (p.subCategory || '').toLowerCase();
        const cat = (p.category || '').toLowerCase();
        const brand = (p.brand || '').toLowerCase();
        const name = p.name.toLowerCase();
        const tags = (p.tags || []).map((t) => t.toLowerCase());

        return (
          sub.includes(targetSub) ||
          brand.includes(targetSub) ||
          cat.includes(targetSub) ||
          name.includes(targetSub) ||
          tags.some((t) => t.includes(targetSub))
        );
      });
    }

    // Price Filter
    if (priceFilter === 'under-2000') {
      result = result.filter((p) => p.price < 2000);
    } else if (priceFilter === '2000-4000') {
      result = result.filter((p) => p.price >= 2000 && p.price <= 4000);
    } else if (priceFilter === 'above-4000') {
      result = result.filter((p) => p.price > 4000);
    }

    // Stock Filter
    if (inStockOnly) {
      result = result.filter((p) => p.inStock);
    }

    // Size Filter
    if (selectedSize !== 'all') {
      result = result.filter((p) => p.sizes.includes(selectedSize));
    }

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [departmentProducts, activeSub, priceFilter, inStockOnly, selectedSize, sortBy]);

  // Extract all available sizes in this department
  const availableSizes = useMemo(() => {
    const set = new Set<string>();
    departmentProducts.forEach((p) => p.sizes.forEach((s) => set.add(s)));
    return Array.from(set);
  }, [departmentProducts]);

  const handleSubSelect = (sub: string) => {
    setActiveSub(sub);
    setSelectedSubcategory(sub.startsWith('All') ? null : sub);
  };

  const handleResetFilters = () => {
    setActiveSub('All');
    setSelectedSubcategory(null);
    setPriceFilter('all');
    setInStockOnly(false);
    setSelectedSize('all');
    setSortBy('newest');
  };

  const hasActiveFilters =
    (!activeSub.startsWith('All') && activeSub !== '') ||
    priceFilter !== 'all' ||
    inStockOnly ||
    selectedSize !== 'all';

  return (
    <div className="w-full bg-[#FAF8F5] min-h-screen pb-16">
      {/* 1. EDITORIAL DEPARTMENT BANNER */}
      <section className="relative w-full bg-[#111113] text-white overflow-hidden border-b border-[#D4AF37]/30">
        <div className="relative aspect-[21/9] sm:aspect-[24/8] md:aspect-[24/7] max-h-[360px] w-full">
          <img
            src={deptMeta.bannerImage}
            alt={deptMeta.title}
            className="w-full h-full object-cover object-center brightness-[0.70] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />

          {/* Banner Editorial Overlay */}
          <div className="absolute inset-0 max-w-[1540px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col justify-center items-start text-left z-10">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-[10px] sm:text-xs font-medium tracking-[0.12em] uppercase text-[#D4AF37] mb-2">
              <button
                type="button"
                onClick={() => setCurrentView('home')}
                className="hover:underline cursor-pointer"
              >
                Home
              </button>
              <span>/</span>
              <span className="text-white">{deptMeta.title.split('&')[0]}</span>
              {activeSub && !activeSub.startsWith('All') && (
                <>
                  <span>/</span>
                  <span className="text-[#D4AF37] font-bold">{activeSub}</span>
                </>
              )}
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-[0.08em] uppercase text-white leading-tight max-w-2xl">
              {deptMeta.title}
            </h1>
            <p className="font-sans text-xs sm:text-sm text-[#E0D5C3] mt-2 max-w-xl font-light leading-relaxed hidden sm:block">
              {deptMeta.tagline}
            </p>
          </div>
        </div>
      </section>

      {/* 2. SUBCATEGORY PILLS CAROUSEL / BAR */}
      <div className="sticky top-[72px] sm:top-[80px] z-20 bg-white/95 backdrop-blur-md border-b border-[#E8DEC8] shadow-xs">
        <div className="max-w-[1540px] mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2 shrink-0">
            {availableSubcategories.map((sub, idx) => {
              const isActive =
                activeSub === sub || (sub.startsWith('All') && (!activeSub || activeSub.startsWith('All')));

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSubSelect(sub)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#111113] text-[#D4AF37] shadow-sm ring-1 ring-[#D4AF37]'
                      : 'bg-[#FAF8F5] text-[#554D42] hover:bg-[#FAF6EE] hover:text-[#111113] border border-[#E8DEC8]'
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>

          {/* Quick Filter Drawer Toggle for Mobile */}
          <button
            type="button"
            onClick={() => setIsFilterDrawerOpen(true)}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F5] border border-[#D4AF37]/50 rounded-full text-xs font-bold text-[#111113] shrink-0 cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5 text-[#B8860B]" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* 3. MAIN CATALOG AREA WITH DESKTOP SIDEBAR + 3:4 PRODUCT GRID */}
      <div className="max-w-[1540px] mx-auto px-4 sm:px-8 py-6 sm:py-8">
        {/* Results Header: Count & Sort Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#E8DEC8] gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#111113]">
              {filteredProducts.length}{' '}
              {filteredProducts.length === 1 ? 'Creation Available' : 'Creations Available'}
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-[#8A671A] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            <span className="text-xs font-medium text-[#7A6C58]">Sort By:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-[#D5C7B0] rounded-xl px-3 py-1.5 text-xs text-[#111113] font-semibold focus:outline-none focus:border-[#B8860B] cursor-pointer pr-8"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Client Rating & Reviews</option>
              </select>
            </div>
          </div>
        </div>

        {/* Catalog Body: 12-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 mt-6">
          {/* DESKTOP FILTER SIDEBAR (3 cols) */}
          <aside className="hidden md:block md:col-span-3 space-y-6 bg-white p-5 rounded-2xl border border-[#E8DEC8] shadow-xs self-start">
            <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#B8860B]" />
                <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-[#111113]">
                  Refine Curation
                </h3>
              </div>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-[11px] text-[#B8860B] hover:underline font-semibold cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Price Filter */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#3D3327]">
                Price Range
              </h4>
              <div className="space-y-1.5 text-xs text-[#554D42]">
                {[
                  { id: 'all', label: 'All Prices' },
                  { id: 'under-2000', label: 'Under ₹2,000' },
                  { id: '2000-4000', label: '₹2,000 – ₹4,000' },
                  { id: 'above-4000', label: 'Above ₹4,000' },
                ].map((tier) => (
                  <label
                    key={tier.id}
                    className="flex items-center gap-2 cursor-pointer hover:text-[#111113]"
                  >
                    <input
                      type="radio"
                      name="price"
                      checked={priceFilter === tier.id}
                      onChange={() => setPriceFilter(tier.id as any)}
                      className="accent-[#B8860B] cursor-pointer"
                    />
                    <span>{tier.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="space-y-2.5 border-t border-[#F0EAE1] pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#3D3327]">
                Availability
              </h4>
              <label className="flex items-center gap-2 text-xs text-[#554D42] cursor-pointer hover:text-[#111113]">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="accent-[#B8860B] rounded cursor-pointer"
                />
                <span>In Stock & Ready for Dispatch</span>
              </label>
            </div>

            {/* Size Filter */}
            {availableSizes.length > 0 && (
              <div className="space-y-2.5 border-t border-[#F0EAE1] pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#3D3327]">
                  Select Size
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedSize('all')}
                    className={`px-2.5 py-1 text-[11px] rounded-lg border font-semibold cursor-pointer ${
                      selectedSize === 'all'
                        ? 'bg-[#111113] text-[#D4AF37] border-[#111113]'
                        : 'bg-white text-[#4A4033] border-[#E8DEC8] hover:border-[#B8860B]'
                    }`}
                  >
                    All
                  </button>
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-2.5 py-1 text-[11px] rounded-lg border font-semibold cursor-pointer ${
                        selectedSize === size
                          ? 'bg-[#111113] text-[#D4AF37] border-[#111113]'
                          : 'bg-white text-[#4A4033] border-[#E8DEC8] hover:border-[#B8860B]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* PRODUCTS GRID (9 cols) */}
          <div className="md:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#E8DEC8] p-12 text-center space-y-4">
                <Sparkles className="w-8 h-8 text-[#B8860B] mx-auto opacity-70" />
                <h4 className="font-serif text-lg font-bold text-[#111113]">
                  No matching creations found
                </h4>
                <p className="text-xs text-[#7A6C58] max-w-sm mx-auto">
                  Try adjusting your filters, price range, or category selection to view available luxury styles.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 bg-[#111113] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-black cursor-pointer transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product) => {
                  const inWish = isInWishlist(product.id);
                  const discountPercent =
                    product.originalPrice && product.originalPrice > product.price
                      ? Math.round(
                          ((product.originalPrice - product.price) / product.originalPrice) * 100
                        )
                      : null;

                  return (
                    <div
                      key={product.id}
                      className="group bg-white rounded-2xl overflow-hidden border border-[#E8DEC8] hover:border-[#B8860B] hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                    >
                      {/* Product Image Container with 3:4 Luxury Portrait Aspect */}
                      <a
                        href={`/product/${product.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative aspect-[3/4] w-full overflow-hidden bg-[#FAF8F5] cursor-pointer block"
                      >
                        <img
                          src={normalizeImageUrl(product.image, product.category)}
                          alt={product.name}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = FALLBACK_LUXURY_IMAGE;
                          }}
                          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                            product.secondaryImage ? 'group-hover:opacity-0' : ''
                          }`}
                        />
                        {product.secondaryImage && (
                          <img
                            src={normalizeImageUrl(product.secondaryImage, product.category)}
                            alt={`${product.name} alternate`}
                            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105"
                          />
                        )}

                        {/* Top Badges */}
                        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                          {discountPercent && (
                            <span className="bg-[#111113] text-[#D4AF37] text-[9.5px] px-2 py-0.5 rounded-md uppercase tracking-wider border border-[#D4AF37]/40 shadow-xs">
                              {discountPercent}% OFF
                            </span>
                          )}
                          {product.isFestiveEdit && (
                            <span className="bg-[#8A671A] text-white text-[9px] px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
                              Festive Edit
                            </span>
                          )}
                        </div>

                        {/* Wishlist Heart Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleWishlist(product);
                          }}
                          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#111113] shadow-md flex items-center justify-center transition-all cursor-pointer z-10 active:scale-90"
                          title={inWish ? 'Remove from Wishlist' : 'Add to Wishlist'}
                        >
                          <Heart
                            className={`w-4 h-4 transition-colors ${
                              inWish ? 'fill-red-600 text-red-600' : 'text-[#2A241E]'
                            }`}
                          />
                        </button>
                      </a>

                      {/* Product Card Details */}
                      <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1 space-y-2">
                        <a
                          href={`/product/${product.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cursor-pointer block group-hover:text-[#B8860B] transition-colors"
                        >
                          <span className="text-[9.5px] tracking-[0.18em] uppercase text-[#8A671A] block">
                            {product.brand || 'LAP OF LUXURY'}
                          </span>
                          <h4 className="text-xs sm:text-sm text-[#111113] line-clamp-1 mt-0.5">
                            {product.name}
                          </h4>
                          <p className="text-[10px] text-[#7A6C58] line-clamp-1 mt-0.5">
                            {product.sizes?.slice(0, 4).join(' · ')}
                          </p>
                        </a>

                        {/* Pricing */}
                        <div className="pt-2 border-t border-[#F0EAE1] flex items-center justify-between">
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-sans font-bold text-sm sm:text-base text-[#111113]">
                              ₹{product.price.toLocaleString('en-IN')}
                            </span>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <span className="text-[11px] text-gray-400 line-through">
                                ₹{product.originalPrice.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>
                          <a
                            href={`/product/${product.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-xs text-[#8A671A] hover:text-[#111113] flex items-center gap-0.5 cursor-pointer"
                          >
                            <span>View</span>
                            <ChevronRight className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE FILTER MODAL DRAWER */}
      {isFilterDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/60 flex justify-end animate-in fade-in">
          <div className="w-[85%] max-w-sm bg-white h-full shadow-2xl p-5 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-serif font-bold text-sm uppercase text-[#111113]">
                  Filters & Sorting
                </h3>
                <button
                  type="button"
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="p-1 text-gray-500 hover:text-black cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Subcategories */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#3D3327]">
                  Category
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {deptMeta.subcategories.map((sub, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSubSelect(sub)}
                      className={`px-3 py-1 text-xs rounded-full font-semibold ${
                        activeSub === sub
                          ? 'bg-[#111113] text-[#D4AF37]'
                          : 'bg-[#FAF8F5] border border-gray-200 text-gray-700'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#3D3327]">
                  Price
                </h4>
                <div className="space-y-1.5 text-xs">
                  {[
                    { id: 'all', label: 'All Prices' },
                    { id: 'under-2000', label: 'Under ₹2,000' },
                    { id: '2000-4000', label: '₹2,000 – ₹4,000' },
                    { id: 'above-4000', label: 'Above ₹4,000' },
                  ].map((tier) => (
                    <label key={tier.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="mobilePrice"
                        checked={priceFilter === tier.id}
                        onChange={() => setPriceFilter(tier.id as any)}
                        className="accent-[#B8860B]"
                      />
                      <span>{tier.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
              <button
                type="button"
                onClick={handleResetFilters}
                className="w-1/2 py-2.5 text-xs font-semibold border border-gray-300 rounded-xl"
              >
                Reset All
              </button>
              <button
                type="button"
                onClick={() => setIsFilterDrawerOpen(false)}
                className="w-1/2 py-2.5 bg-[#111113] text-white text-xs font-bold rounded-xl"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

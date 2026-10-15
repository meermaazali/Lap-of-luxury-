import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Heart,
  Grid,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { normalizeImageUrl, FALLBACK_LUXURY_IMAGE } from '../../utils/imageUtils';

export const LuxuryEditorialHome: React.FC = () => {
  const {
    products,
    banners,
    boutiqueHeroConfig,
    isInWishlist,
    toggleWishlist,
  } = useStore();

  const [activeSlide, setActiveSlide] = useState(0);
  const [isSubcategoriesExpanded, setIsSubcategoriesExpanded] = useState(false);

  // Assemble campaign slides from Firestore banners & hero configuration
  const campaignSlides = useMemo(() => {
    const list: Array<{
      image: string;
      title: string;
      kicker: string;
      subtitle: string;
      ctaText: string;
      ctaLink: string;
    }> = [];

    // Boutique hero configuration from Firestore
    if (boutiqueHeroConfig?.image) {
      list.push({
        image: boutiqueHeroConfig.image,
        title: `${boutiqueHeroConfig.titleLine1 || 'Luxury'} ${boutiqueHeroConfig.titleLine2 || 'Collection'}`,
        kicker: boutiqueHeroConfig.kicker || 'EXCLUSIVE ATELIER CURATION',
        subtitle: (boutiqueHeroConfig.subtitleItems || []).join(' · ') || 'Premium Sartorial Wear, Bags & Accessories',
        ctaText: boutiqueHeroConfig.ctaText || 'Explore Catalog',
        ctaLink: '/shop',
      });
    }

    // Active banners from Firestore
    if (banners && banners.length > 0) {
      banners
        .filter((b) => b.active !== false)
        .forEach((b) => {
          list.push({
            image: b.image,
            title: b.title,
            kicker: b.kicker || 'HAUTE COUTURE EDIT',
            subtitle: b.subtitle,
            ctaText: b.ctaText || 'Shop Collection',
            ctaLink: b.ctaLink ? (b.ctaLink.startsWith('/') ? b.ctaLink : `/${b.ctaLink.toLowerCase()}`) : '/shop',
          });
        });
    }

    // Fallback if none configured
    if (list.length === 0) {
      list.push({
        image: '/images/banner_shirts_pants.jpg',
        title: 'LAP OF LUXURY',
        kicker: 'THE ATELIER CURATION',
        subtitle: 'Hand-tailored Double-ply Shirts, Raw Denim, Fine Leathers & Timepieces',
        ctaText: 'Discover The Collection',
        ctaLink: '/shop',
      });
    }

    return list;
  }, [boutiqueHeroConfig, banners]);

  // Auto-play Campaign Slider
  useEffect(() => {
    if (campaignSlides.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % campaignSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [campaignSlides.length]);

  // Shop by Category tiles (each opens in a new tab)
  const categoryTiles = [
    { title: "Men's Fashion", dept: 'men', path: '/men', image: '/images/category_mens_fashion_1791290148102.jpg', desc: 'Shirts, Denim & Blazers' },
    { title: "Women's Couture", dept: 'women', path: '/women', image: '/images/cat_womens_dress.jpg', desc: 'Sarees, Gowns & Kurtas' },
    { title: 'Designer Bags', dept: 'bags', path: '/bags', image: '/images/cat_bag_cream.jpg', desc: 'Totes, Clutches & Slings' },
    { title: 'Luxury Footwear', dept: 'footwear', path: '/footwear', image: '/images/cat_shoes_white.jpg', desc: 'Sneakers, Loafers & Heels' },
    { title: 'Fine Timepieces', dept: 'accessories', path: '/category/accessories/Watches%20and%20Accessories', image: '/images/cat_watch_gold.jpg', desc: 'Automatic Chronographs' },
    { title: 'Royal Parfums', dept: 'accessories', path: '/category/accessories/Watches%20and%20Accessories', image: '/images/cat_perfume_amber.jpg', desc: 'Amber Oud & Extrait' },
  ];

  // Comprehensive subcategory directory with all categories and subcategories
  const departmentSubcategories = [
    {
      department: "Men's Sartorial",
      link: '/men',
      subcategories: [
        { name: 'Shirts', path: '/category/men/Shirts' },
        { name: 'Trousers & Chinos', path: '/category/men/Trousers' },
        { name: 'Jeans & Denim', path: '/category/men/Jeans' },
        { name: 'Blazers & Tuxedos', path: '/category/men/Blazers' },
        { name: 'Kurta Sets & Ethnic', path: '/category/men/Kurta%20Sets' },
        { name: 'Loafers & Formals', path: '/category/men/Loafers' },
      ],
    },
    {
      department: "Women's Couture",
      link: '/women',
      subcategories: [
        { name: 'Banarasi Sarees', path: '/category/women/Sarees' },
        { name: 'Designer Lehengas', path: '/category/women/Lehengas' },
        { name: 'Evening Dresses', path: '/category/women/Dresses' },
        { name: 'Silk Tops & Blouses', path: '/category/women/Tops%20and%20Shirts' },
        { name: 'Co-ord Sets', path: '/category/women/Co-ord%20Sets' },
        { name: 'Stiletto Heels', path: '/category/women/Heels' },
      ],
    },
    {
      department: 'Bags & Leathercraft',
      link: '/bags',
      subcategories: [
        { name: 'Handbags', path: '/category/bags/Handbags' },
        { name: 'Shoulder Bags', path: '/category/bags/Shoulder%20Bags' },
        { name: 'Sling Bags', path: '/category/bags/Sling%20Bags' },
        { name: 'Evening Clutches', path: '/category/bags/Clutches' },
        { name: 'Leather Totes', path: '/category/bags/Totes' },
        { name: 'Wallets', path: '/category/bags/Wallets' },
      ],
    },
    {
      department: 'Footwear & Horology',
      link: '/footwear',
      subcategories: [
        { name: 'Luxury Sneakers', path: '/category/footwear/Sneakers' },
        { name: 'Oxford Formal Shoes', path: '/category/footwear/Formal%20Shoes' },
        { name: 'Handcrafted Loafers', path: '/category/footwear/Loafers' },
        { name: 'Occasion Heels', path: '/category/footwear/Heels' },
        { name: 'Gold Watches', path: '/category/accessories/Watches%20and%20Accessories' },
        { name: 'Leather Belts', path: '/category/accessories/Belts' },
      ],
    },
  ];

  // Active published products for the homepage curation
  const curatedProducts = products.slice(0, 12);

  return (
    <div className="w-full bg-[#FAF8F5] text-[#111113] space-y-12 sm:space-y-16 pb-16">
      {/* 1. HERO CAMPAIGN SLIDER (Displaying uploaded & Firestore banners) */}
      <section className="relative w-full bg-[#111113] overflow-hidden border-b border-[#D4AF37]/30">
        <div className="relative aspect-[16/9] sm:aspect-[21/9] md:aspect-[24/8] max-h-[560px] w-full">
          {campaignSlides.map((slide, idx) => {
            const isCurrent = idx === activeSlide;

            return (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover object-center brightness-[0.76] contrast-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />

                {/* Editorial Slide Content */}
                <div className="absolute inset-0 max-w-[1540px] mx-auto px-6 sm:px-12 lg:px-16 flex flex-col justify-center items-start text-left">
                  <span className="text-[10px] sm:text-xs font-bold tracking-[0.28em] uppercase text-[#D4AF37] mb-2 drop-shadow-sm">
                    {slide.kicker}
                  </span>
                  <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-[0.08em] text-white leading-tight max-w-3xl drop-shadow-md">
                    {slide.title}
                  </h2>
                  <p className="text-xs sm:text-sm md:text-base text-[#E0D5C3] mt-3 max-w-xl font-light leading-relaxed drop-shadow-sm hidden sm:block">
                    {slide.subtitle}
                  </p>

                  <div className="mt-5 sm:mt-7 flex items-center gap-3">
                    <a
                      href={slide.ctaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 sm:px-8 sm:py-3.5 bg-gradient-to-r from-[#DFBA53] via-[#F4E09E] to-[#B8860B] hover:brightness-105 text-[#111113] font-bold text-xs sm:text-sm uppercase tracking-[0.16em] rounded-full shadow-xl transition-all cursor-pointer flex items-center gap-2 active:scale-95"
                    >
                      <span>{slide.ctaText}</span>
                      <ArrowRight className="w-4 h-4 text-[#111113]" strokeWidth={1.75} />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Slider Prev / Next Controls */}
          {campaignSlides.length > 1 && (
            <>
              <button
                type="button"
                onClick={() =>
                  setActiveSlide(
                    (prev) => (prev - 1 + campaignSlides.length) % campaignSlides.length
                  )
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/30 flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs"
                aria-label="Previous Campaign Slide"
              >
                <ChevronLeft className="w-5 h-5" strokeWidth={1.75} />
              </button>
              <button
                type="button"
                onClick={() =>
                  setActiveSlide((prev) => (prev + 1) % campaignSlides.length)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/30 flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs"
                aria-label="Next Campaign Slide"
              >
                <ChevronRight className="w-5 h-5" strokeWidth={1.75} />
              </button>

              {/* Slider Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                {campaignSlides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveSlide(i)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      i === activeSlide ? 'w-8 bg-[#D4AF37]' : 'w-2 bg-white/50 hover:bg-white'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* 2. SHOP BY CATEGORY SECTION:
          Clicking any category tile or subcategory opens in a new tab.
          Never scrolls up or jumps.
      */}
      <section id="shop-by-category" className="max-w-[1540px] mx-auto px-4 sm:px-8 space-y-6">
        <div className="text-center space-y-1.5">
          <span className="text-[10px] sm:text-xs font-bold tracking-[0.24em] text-[#8A671A] uppercase">
            CURATED DEPARTMENTS
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-wider text-[#111113]">
            SHOP BY CATEGORY
          </h2>
          <div className="w-12 h-[2px] bg-[#B8860B] mx-auto mt-2" />
        </div>

        {/* Category Primary Tiles (opens in new tab) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
          {categoryTiles.map((cat, idx) => (
            <a
              key={idx}
              href={cat.path}
              target="_blank"
              rel="noopener noreferrer"
              className="group cursor-pointer bg-white rounded-2xl p-3 border border-[#E8DEC8] hover:border-[#B8860B] hover:shadow-lg transition-all text-center flex flex-col items-center justify-between block"
            >
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#F3EFE9] mb-3">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
              </div>
              <h4 className="font-serif text-xs sm:text-sm font-bold text-[#111113] group-hover:text-[#B8860B] transition-colors line-clamp-1">
                {cat.title}
              </h4>
              <p className="text-[10px] text-[#7A6C58] line-clamp-1 mt-0.5">
                {cat.desc}
              </p>
            </a>
          ))}
        </div>

        {/* Expandable Subcategories Browser */}
        <div className="bg-white rounded-2xl border border-[#E8DEC8] p-4 sm:p-6 shadow-xs">
          <button
            type="button"
            onClick={() => setIsSubcategoriesExpanded(!isSubcategoriesExpanded)}
            className="w-full flex items-center justify-between text-xs sm:text-sm font-bold tracking-wider uppercase text-[#111113] hover:text-[#B8860B] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#B8860B]" strokeWidth={1.75} />
              <span>Browse All Categories & Subcategories (Opens in New Tab)</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#8A671A]">
              <span>{isSubcategoriesExpanded ? 'Collapse' : 'Explore All'}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  isSubcategoriesExpanded ? 'rotate-180' : ''
                }`}
                strokeWidth={1.75}
              />
            </div>
          </button>

          {isSubcategoriesExpanded && (
            <div className="mt-5 pt-5 border-t border-[#F0EAE1] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in">
              {departmentSubcategories.map((dept, dIdx) => (
                <div key={dIdx} className="space-y-2.5">
                  <a
                    href={dept.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-serif text-xs font-bold uppercase tracking-wider text-[#111113] hover:text-[#B8860B] border-b border-[#F0EAE1] pb-1 block transition-colors"
                  >
                    {dept.department} →
                  </a>
                  <ul className="space-y-1.5">
                    {dept.subcategories.map((sub, sIdx) => (
                      <li key={sIdx}>
                        <a
                          href={sub.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#5C5040] hover:text-[#B8860B] flex items-center justify-between group transition-colors py-0.5"
                        >
                          <span>{sub.name}</span>
                          <ArrowRight
                            className="w-3 h-3 text-[#B8860B] opacity-0 group-hover:opacity-100 transition-opacity"
                            strokeWidth={1.75}
                          />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. CURATED CREATIONS (All products opening in new tab) */}
      <section className="max-w-[1540px] mx-auto px-4 sm:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#E8DEC8] pb-4 gap-2">
          <div>
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.24em] text-[#8A671A] uppercase block">
              HOUSE CURATION
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-wider text-[#111113]">
              ATELIER COLLECTION
            </h2>
          </div>
          <a
            href="/shop"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold uppercase tracking-wider text-[#B8860B] hover:text-[#111113] flex items-center gap-1 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <span>View Complete Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {curatedProducts.map((product) => (
            <ProductCardItem
              key={product.id}
              product={product}
              isInWish={isInWishlist(product.id)}
              onToggleWish={() => toggleWishlist(product)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

// Reusable 3:4 Luxury Product Card (Zero offer badges, uniform luxury icons)
const ProductCardItem: React.FC<{
  product: Product;
  isInWish: boolean;
  onToggleWish: () => void;
}> = ({ product, isInWish, onToggleWish }) => {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-[#E8DEC8] hover:border-[#B8860B] hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <a
        href={`/product/${product.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative aspect-[3/4] w-full overflow-hidden bg-[#F3EFE9] cursor-pointer block"
      >
        <img
          src={normalizeImageUrl(product.image, product.category)}
          alt={product.name}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = FALLBACK_LUXURY_IMAGE;
          }}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
            product.secondaryImage ? 'group-hover:opacity-0' : ''
          }`}
        />
        {product.secondaryImage && (
          <img
            src={normalizeImageUrl(product.secondaryImage, product.category)}
            alt={`${product.name} alternate`}
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700 group-hover:scale-105"
          />
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleWish();
          }}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#111113] shadow-md flex items-center justify-center transition-all cursor-pointer z-10 active:scale-90"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isInWish ? 'fill-red-600 text-red-600' : 'text-[#2A241E]'
            }`}
            strokeWidth={1.75}
          />
        </button>
      </a>

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
        </a>

        <div className="pt-2 border-t border-[#F0EAE1] flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm sm:text-base font-semibold text-[#111113]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          </div>
          <a
            href={`/product/${product.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-xs text-[#8A671A] hover:text-[#111113] flex items-center gap-0.5 cursor-pointer font-medium"
          >
            <span>View</span>
            <ChevronRight className="w-3 h-3" strokeWidth={1.75} />
          </a>
        </div>
      </div>
    </div>
  );
};

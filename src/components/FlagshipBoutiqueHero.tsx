import React, { useRef } from 'react';
import { ArrowRight, Gem, Truck, Headphones, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { normalizeImageUrl, FALLBACK_LUXURY_IMAGE } from '../utils/imageUtils';

interface CategoryTile {
  name: string;
  slug: string;
  image: string;
}

const CATEGORY_TILES: CategoryTile[] = [
  {
    name: "Men's Fashion",
    slug: 'Men',
    image: '/images/cat_mens_blazer.jpg',
  },
  {
    name: "Women's Fashion",
    slug: 'Women',
    image: '/images/cat_womens_dress.jpg',
  },
  {
    name: 'Bags & Wallets',
    slug: 'Bags',
    image: '/images/cat_bag_cream.jpg',
  },
  {
    name: 'Watches',
    slug: 'Watches',
    image: '/images/cat_watch_gold.jpg',
  },
  {
    name: 'Perfumes',
    slug: 'Perfumes',
    image: '/images/cat_perfume_amber.jpg',
  },
  {
    name: 'Shoes',
    slug: 'Shoes',
    image: '/images/cat_shoes_white.jpg',
  },
  {
    name: 'Accessories',
    slug: 'Accessories',
    image: '/images/cat_glasses_gold.jpg',
  },
  {
    name: 'Electronics',
    slug: 'Jeans',
    image: '/images/cat_headphones_gold.jpg',
  },
];

export const FlagshipBoutiqueHero: React.FC = () => {
  const { triggerTransition, selectedCategory, boutiqueHeroConfig } = useStore();
  const sliderRef = useRef<HTMLDivElement>(null);

  const heroImage = boutiqueHeroConfig?.image || '/images/flagship_banner_16_9.jpg';
  const heroKicker = boutiqueHeroConfig?.kicker || 'EXCLUSIVE COLLECTION';
  const heroTitleLine1 = boutiqueHeroConfig?.titleLine1 || 'Luxury';
  const heroTitleLine2 = boutiqueHeroConfig?.titleLine2 || 'For Every Moment';
  const heroSubtitleItems = boutiqueHeroConfig?.subtitleItems?.length
    ? boutiqueHeroConfig.subtitleItems
    : ['Premium Fashion', 'Elegant Accessories', 'Timeless Style'];
  const heroCtaText = boutiqueHeroConfig?.ctaText || 'Shop Now';

  const handleShopNow = () => {
    const el = document.getElementById('catalog-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCategorySelect = (tile: CategoryTile) => {
    triggerTransition(tile.slug, tile.name);
  };

  const slideLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -280, behavior: 'smooth' });
    }
  };

  const slideRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 280, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full bg-white text-[#111113] overflow-hidden select-none flex flex-col">
      {/* 1. SHOP BY CATEGORY BAR: In Desktop/Laptop it comes UP right below top header (order-1 on md+), on Mobile it stays below banner (order-2) */}
      <div
        id="shop-by-category"
        className="order-2 md:order-1 py-6 sm:py-8 md:py-9 px-3 sm:px-6 md:px-8 bg-[#FCFBF8] border-b border-[#F0E6D2] relative"
      >
        {/* Section Title with delicate flanking gold lines */}
        <div className="flex items-center justify-center gap-4 mb-5 sm:mb-7">
          <span className="w-10 sm:w-24 h-[1.5px] bg-[#D4AF37]/60" />
          <h2 className="font-bodoni font-bold text-base sm:text-xl md:text-2xl text-[#111113] tracking-wider uppercase">
            Shop By Category
          </h2>
          <span className="w-10 sm:w-24 h-[1.5px] bg-[#D4AF37]/60" />
        </div>

        {/* 8 Category Tiles Grid (4 cols on mobile x 2 rows, 8 cols on desktop) */}
        <div
          ref={sliderRef}
          className="max-w-7xl mx-auto grid grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-4 md:gap-5"
        >
          {CATEGORY_TILES.map((tile) => {
            const isSelected = selectedCategory === tile.slug;
            return (
              <div
                key={tile.name}
                onClick={() => handleCategorySelect(tile)}
                className={`flex flex-col items-center justify-between p-2 sm:p-3 rounded-2xl cursor-pointer group transition-all duration-300 ${
                  isSelected
                    ? 'bg-[#FAF5E8] border-2 border-[#D4AF37] shadow-md ring-1 ring-[#D4AF37]'
                    : 'bg-white hover:bg-[#FAF6EE] border border-[#EBE3D3] hover:border-[#D4AF37] shadow-2xs hover:shadow-sm'
                }`}
              >
                {/* Product Image Thumbnail */}
                <div className="w-full aspect-square rounded-xl overflow-hidden bg-[#F8F6F0] mb-2 p-1 sm:p-1.5 flex items-center justify-center">
                  <img
                    src={normalizeImageUrl(tile.image, tile.slug)}
                    alt={tile.name}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = FALLBACK_LUXURY_IMAGE;
                    }}
                    className="w-full h-full object-cover object-center rounded-lg group-hover:scale-108 transition-transform duration-500"
                  />
                </div>

                {/* Category Label (Dark, readable, crisp) */}
                <p className="font-sans text-[10px] sm:text-xs font-bold text-[#111113] group-hover:text-[#B8860B] transition-colors text-center leading-tight">
                  {tile.name}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. HERO SHOWCASE: Full banner on laptop/PC, vivid, crystal clear, NO tree, NO milky fog, dark readable font */}
      <div className="order-1 md:order-2 relative w-full min-h-[460px] sm:min-h-[520px] md:min-h-[580px] lg:min-h-[620px] flex items-center overflow-hidden bg-[#1A1815]">
        {/* Full-bleed Boutique Photography (Comes full across entire screen on laptop/PC & mobile) */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img
            src={heroImage}
            alt="Flagship Boutique Showcase"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/exact_mockup_banner.jpg';
            }}
            className="w-full h-full object-cover object-center sm:object-right md:object-center transition-transform duration-700"
          />
          {/* Subtle directional gradient to guarantee dark text legibility without milky fog */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/55 to-transparent sm:via-white/40 md:via-white/20 pointer-events-none" />
        </div>

        {/* Content Column (Dark, crisp, luxurious text) */}
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-10 sm:py-16 w-full">
          <div className="max-w-xl text-left p-0 rounded-2xl">
            {/* Tagline kicker */}
            <p className="font-sans text-[11px] sm:text-xs md:text-sm font-bold tracking-[0.24em] uppercase text-[#7A5508] mb-2 sm:mb-3 drop-shadow-xs">
              {heroKicker}
            </p>

            {/* Main Headline (Rich dark font, bold luxury serif) */}
            <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl lg:text-[62px] text-[#111113] leading-[1.08] tracking-tight mb-4 sm:mb-5">
              {heroTitleLine1} <br />
              <span className="font-serif italic font-bold text-[#1F1710]">{heroTitleLine2}</span>
            </h1>

            {/* Subtitle with vertical gold pipe dividers */}
            <p className="font-sans font-semibold text-xs sm:text-sm md:text-base text-[#1E1A16] tracking-wide mb-6 sm:mb-8 flex flex-wrap items-center gap-1.5 sm:gap-2.5">
              {heroSubtitleItems.map((item, idx) => (
                <React.Fragment key={idx}>
                  <span>{item}</span>
                  {idx < heroSubtitleItems.length - 1 && (
                    <span className="text-[#C5A059] font-bold">|</span>
                  )}
                </React.Fragment>
              ))}
            </p>

            {/* Shop Now CTA Button */}
            <button
              onClick={handleShopNow}
              className="inline-flex items-center gap-2.5 px-8 sm:px-10 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-[#C29748] via-[#B8860B] to-[#996D19] hover:brightness-105 text-[#111113] text-xs sm:text-sm font-black tracking-wider uppercase transition-all shadow-[0_6px_22px_rgba(184,134,11,0.35)] hover:shadow-[0_8px_28px_rgba(184,134,11,0.5)] cursor-pointer active:scale-95"
            >
              <span>{heroCtaText}</span>
              <ArrowRight className="w-4 h-4 text-[#111113]" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. GOLDEN TRUST BAR */}
      <div className="order-3 relative bg-gradient-to-r from-[#D8B456] via-[#F8E7AB] via-[#E8CB79] to-[#C99C3E] text-[#1E1604] border-t border-[#D4AF37]/50 shadow-inner py-4 sm:py-5 px-4 sm:px-8 overflow-hidden">
        {/* Specular satin light reflections */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/10 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-around gap-3.5 sm:gap-4 md:gap-6 text-xs sm:text-sm font-bold tracking-wider">
          {/* Feature 1 */}
          <div className="flex items-center gap-2.5">
            <Gem className="w-4 h-4 sm:w-5 sm:h-5 text-[#241A04] shrink-0" />
            <span className="text-[#1E1604] font-bold">100% Original Products</span>
          </div>

          <span className="hidden md:inline w-[1.5px] h-4 bg-[#7A5B0B]/35" />

          {/* Feature 2 */}
          <div className="flex items-center gap-2.5">
            <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-[#241A04] shrink-0" />
            <span className="text-[#1E1604] font-bold">Free Delivery Above ₹999</span>
          </div>

          <span className="hidden md:inline w-[1.5px] h-4 bg-[#7A5B0B]/35" />

          {/* Feature 3 */}
          <div className="flex items-center gap-2.5">
            <Headphones className="w-4 h-4 sm:w-5 sm:h-5 text-[#241A04] shrink-0" />
            <span className="text-[#1E1604] font-bold">24/7 Customer Support</span>
          </div>
        </div>
      </div>
    </div>
  );
};

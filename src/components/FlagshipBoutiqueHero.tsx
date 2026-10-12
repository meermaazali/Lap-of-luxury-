import React, { useRef } from 'react';
import { ArrowRight, Gem, Truck, Headphones } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { normalizeImageUrl, FALLBACK_LUXURY_IMAGE } from '../utils/imageUtils';

interface CategoryTile {
  name: string;
  slug: string;
  image: string;
}

const CATEGORY_TILES: CategoryTile[] = [
  {
    name: "Men's Fashion (Shirts & Pants)",
    slug: 'Men',
    image: '/images/category_mens_fashion_1791290148102.jpg',
  },
  {
    name: "Women's Fashion",
    slug: 'Women',
    image: '/images/cat_womens_dress.jpg',
  },
  {
    name: 'Bags & Handbags',
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
    name: 'Shoes & Footwear',
    slug: 'Shoes',
    image: '/images/cat_shoes_white.jpg',
  },
  {
    name: 'Accessories',
    slug: 'Accessories',
    image: '/images/cat_glasses_gold.jpg',
  },
  {
    name: 'Jeans & Denim',
    slug: 'Jeans',
    image: '/images/category_jeans_luxury_1791290260306.jpg',
  },
];

export const FlagshipBoutiqueHero: React.FC = () => {
  const { triggerTransition, selectedCategory, boutiqueHeroConfig } = useStore();
  const sliderRef = useRef<HTMLDivElement>(null);

  // Directly use the exact uploaded banner asset maintaining 16:9 proportions
  const heroImage = boutiqueHeroConfig?.image || '/images/banner_shirts_pants.jpg';
  const heroKicker = boutiqueHeroConfig?.kicker || 'EXCLUSIVE FASHION COLLECTION';
  const heroTitleLine1 = boutiqueHeroConfig?.titleLine1 || 'Luxury Fashion';
  const heroTitleLine2 = boutiqueHeroConfig?.titleLine2 || 'For Every Moment';
  const heroSubtitleItems = boutiqueHeroConfig?.subtitleItems?.length
    ? boutiqueHeroConfig.subtitleItems
    : ['Premium Shirts & Trousers', 'Handbags & Watches', 'Perfumes & Lifestyle'];
  const heroCtaText = boutiqueHeroConfig?.ctaText || 'Shop Collection';

  const handleShopNow = () => {
    const el = document.getElementById('catalog-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCategorySelect = (tile: CategoryTile) => {
    triggerTransition(tile.slug, tile.name);
    const el = document.getElementById('catalog-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative w-full bg-white text-[#111113] overflow-hidden select-none flex flex-col">
      {/* 1. HERO SHOWCASE BANNER:
          Medium, balanced height per user request for optimal screen presence
      */}
      <div className="order-1 relative w-full overflow-hidden bg-[#FAF8F5]">
        <div className="relative w-full aspect-[16/8] sm:aspect-[21/8] md:aspect-[24/8] min-h-[290px] max-h-[430px] overflow-hidden flex items-center justify-center">
          <img
            src={heroImage}
            alt="LAP OF LUXURY Fashion Collection"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/banner_shirts_pants.jpg';
            }}
            className="w-full h-full object-cover object-center"
          />

          {/* Luminous White Overlay requested by user to make the banner look pristine & elegant */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/45 to-transparent sm:from-white/75 sm:via-white/30 pointer-events-none" />

          {/* Luxury Banner Content in Luminous Frosted Card */}
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 w-full">
              <div className="max-w-md sm:max-w-lg text-left bg-white/85 backdrop-blur-sm p-3.5 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl border border-[#D4AF37]/50 shadow-[0_6px_25px_rgba(184,134,11,0.12)]">
                <p className="font-sans text-[9px] sm:text-xs md:text-sm font-bold tracking-[0.22em] uppercase text-[#8A671A] mb-1">
                  {heroKicker}
                </p>

                <h1 className="font-serif font-normal text-lg sm:text-2xl md:text-3xl text-[#111113] leading-[1.18] tracking-tight mb-1.5 sm:mb-2">
                  {heroTitleLine1} <br />
                  <span className="font-serif font-normal text-[#B8860B]">{heroTitleLine2}</span>
                </h1>

                <p className="font-sans font-normal text-[10px] sm:text-xs md:text-sm text-[#4A4033] tracking-wide mb-3 sm:mb-5 hidden sm:flex flex-wrap items-center gap-1.5 sm:gap-2">
                  {heroSubtitleItems.map((item, idx) => (
                    <React.Fragment key={idx}>
                      <span>{item}</span>
                      {idx < heroSubtitleItems.length - 1 && (
                        <span className="text-[#D4AF37] font-bold">|</span>
                      )}
                    </React.Fragment>
                  ))}
                </p>

                <button
                  type="button"
                  onClick={handleShopNow}
                  className="inline-flex items-center gap-2 px-5 sm:px-7 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#DFBA53] via-[#F4E09E] to-[#B8860B] hover:brightness-105 text-[#111113] text-xs sm:text-sm font-bold tracking-wider uppercase transition-all shadow-[0_4px_18px_rgba(212,175,55,0.35)] cursor-pointer active:scale-95"
                >
                  <span>{heroCtaText}</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#111113]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SHOP BY CATEGORY BAR */}
      <div
        id="shop-by-category"
        className="order-2 py-5 sm:py-8 md:py-9 px-2.5 sm:px-6 md:px-8 bg-[#FCFBF8] border-b border-[#F0E6D2] relative"
      >
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-7">
          <span className="w-8 sm:w-24 h-[1.5px] bg-[#D4AF37]/60" />
          <h2 className="font-serif font-medium text-sm sm:text-xl md:text-2xl text-[#111113] tracking-wider uppercase">
            Shop By Category
          </h2>
          <span className="w-8 sm:w-24 h-[1.5px] bg-[#D4AF37]/60" />
        </div>

        <div
          ref={sliderRef}
          className="max-w-7xl mx-auto grid grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-4 md:gap-5"
        >
          {CATEGORY_TILES.map((tile) => {
            const isSelected = selectedCategory === tile.slug;
            return (
              <div
                key={tile.name}
                onClick={() => handleCategorySelect(tile)}
                className={`flex flex-col items-center justify-between p-1.5 sm:p-3 rounded-xl sm:rounded-2xl cursor-pointer group transition-all duration-300 ${
                  isSelected
                    ? 'bg-[#FAF5E8] border-2 border-[#D4AF37] shadow-md ring-1 ring-[#D4AF37]'
                    : 'bg-white hover:bg-[#FAF6EE] border border-[#EBE3D3] hover:border-[#D4AF37] shadow-2xs hover:shadow-sm'
                }`}
              >
                <div className="w-full aspect-square rounded-lg sm:rounded-xl overflow-hidden bg-[#F8F6F0] mb-1.5 sm:mb-2 p-1 sm:p-1.5 flex items-center justify-center">
                  <img
                    src={normalizeImageUrl(tile.image, tile.slug)}
                    alt={tile.name}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = FALLBACK_LUXURY_IMAGE;
                    }}
                    className="w-full h-full object-cover object-center rounded-md sm:rounded-lg group-hover:scale-108 transition-transform duration-500"
                  />
                </div>

                <p className="font-sans text-[9px] xs:text-[10px] sm:text-xs font-semibold text-[#111113] group-hover:text-[#B8860B] transition-colors text-center leading-[1.15] break-words line-clamp-2 px-0.5">
                  {tile.name}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. GOLDEN TRUST BAR */}
      <div className="order-3 relative bg-gradient-to-r from-[#D8B456] via-[#F8E7AB] via-[#E8CB79] to-[#C99C3E] text-[#1E1604] border-t border-[#D4AF37]/50 shadow-inner py-3 sm:py-5 px-3 sm:px-8 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-around gap-2.5 sm:gap-4 md:gap-6 text-xs sm:text-sm font-semibold tracking-wider">
          <div className="flex items-center gap-2">
            <Gem className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-[#241A04] shrink-0" />
            <span className="text-[#1E1604] font-medium text-[11px] sm:text-sm">100% Original Premium Products</span>
          </div>

          <span className="hidden md:inline w-[1.5px] h-4 bg-[#7A5B0B]/35" />

          <div className="flex items-center gap-2">
            <Truck className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-[#241A04] shrink-0" />
            <span className="text-[#1E1604] font-medium text-[11px] sm:text-sm">Free Delivery Above ₹999</span>
          </div>

          <span className="hidden md:inline w-[1.5px] h-4 bg-[#7A5B0B]/35" />

          <div className="flex items-center gap-2">
            <Headphones className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-[#241A04] shrink-0" />
            <span className="text-[#1E1604] font-medium text-[11px] sm:text-sm">Store Timings: 9:30 AM – 10:00 PM</span>
          </div>
        </div>
      </div>
    </div>
  );
};

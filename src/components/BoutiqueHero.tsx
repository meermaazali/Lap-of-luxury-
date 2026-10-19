import React, { useRef } from 'react';
import { ArrowRight, Gem, Truck, Headphones } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { normalizeImageUrl, FALLBACK_LUXURY_IMAGE } from '../utils/imageUtils';

export const BoutiqueHero: React.FC = () => {
  const { boutiqueHeroConfig } = useStore();

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

  return (
    <div className="relative w-full bg-white text-[#111113] overflow-hidden select-none flex flex-col">
      {/* 1. HERO SHOWCASE BANNER:
          Full image visibility across mobile, tablet, desktop, laptop, and TV without cropping or cut-off
      */}
      <div className="order-1 relative w-full overflow-hidden bg-[#FBF9F5]">
        <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-[24/9] max-h-[520px] overflow-hidden flex items-center justify-center bg-[#FAF7F0]">
          {/* Ambient blurred backdrop for letterboxing on ultra-wide or narrow screens */}
          <div
            className="absolute inset-0 bg-cover bg-center blur-xl opacity-20 scale-110 pointer-events-none"
            style={{ backgroundImage: `url(${heroImage})` }}
          />

          <img
            src={heroImage}
            alt="LAP OF LUXURY Fashion Collection"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/banner_shirts_pants.jpg';
            }}
            className="relative z-10 w-full h-full object-contain sm:object-cover object-center"
          />

          {/* Luminous White Gradient Overlay to enhance text contrast without obscuring banner collection */}
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-white/80 via-white/35 to-transparent sm:from-white/75 sm:via-white/20 pointer-events-none" />

          {/* Luxury Banner Content */}
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="max-w-7xl mx-auto px-3.5 sm:px-8 lg:px-12 w-full">
              <div className="max-w-[280px] sm:max-w-md md:max-w-lg text-left bg-white/90 sm:bg-white/85 backdrop-blur-md p-3 sm:p-5 md:p-6 rounded-xl sm:rounded-3xl border border-[#D4AF37]/50 shadow-[0_6px_25px_rgba(184,134,11,0.12)]">
                <p className="font-sans text-[8px] sm:text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-[#8A671A] mb-0.5 sm:mb-1">
                  {heroKicker}
                </p>

                <h1 className="font-serif font-normal text-sm sm:text-2xl md:text-3xl text-[#111113] leading-[1.18] tracking-tight mb-1 sm:mb-2">
                  {heroTitleLine1} <br />
                  <span className="font-serif font-normal text-[#B8860B]">{heroTitleLine2}</span>
                </h1>

                <p className="font-sans font-normal text-[10px] sm:text-xs md:text-sm text-[#4A4033] tracking-wide mb-2 sm:mb-5 hidden sm:flex flex-wrap items-center gap-1.5 sm:gap-2">
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
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-7 py-1.5 sm:py-2.5 rounded-full bg-gradient-to-r from-[#DFBA53] via-[#F4E09E] to-[#B8860B] hover:brightness-105 text-[#111113] text-[10px] sm:text-sm font-bold tracking-wider uppercase transition-all shadow-[0_4px_18px_rgba(212,175,55,0.35)] cursor-pointer active:scale-95"
                >
                  <span>{heroCtaText}</span>
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-[#111113]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. GOLDEN TRUST BAR */}
      <div className="order-2 relative bg-gradient-to-r from-[#D8B456] via-[#F8E7AB] via-[#E8CB79] to-[#C99C3E] text-[#1E1604] border-t border-[#D4AF37]/50 shadow-inner py-3 sm:py-5 px-3 sm:px-8 overflow-hidden">
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

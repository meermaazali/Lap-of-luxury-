import React, { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import {
  FALLBACK_CATEGORY_IMAGES,
  FALLBACK_LUXURY_IMAGE,
  normalizeImageUrl,
} from '../utils/imageUtils';

export const CategoryAutoSlider: React.FC = () => {
  const {
    categories,
    selectedCategory,
    categoryInterval,
    triggerTransition,
  } = useStore();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Automatic sliding interval
  useEffect(() => {
    if (isPaused || !sliderRef.current) return;

    const interval = setInterval(() => {
      if (sliderRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          sliderRef.current.scrollBy({ left: 210, behavior: 'smooth' });
        }
      }
    }, (categoryInterval || 4) * 1000);

    return () => clearInterval(interval);
  }, [isPaused, categoryInterval]);

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const offset = direction === 'left' ? -240 : 240;
      sliderRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleCategoryClick = (cat: { slug: string; name: string }) => {
    triggerTransition(cat.slug, cat.name);
  };

  return (
    <section
      className="py-8 sm:py-10 bg-white/65 backdrop-blur-[2px] border-b border-[#D4AF37]/30 relative select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#D4AF37]/30">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rotate-45 bg-[#D4AF37]" />
            <h2 className="font-bodoni text-base sm:text-lg md:text-xl tracking-[0.2em] font-black uppercase text-[#111113]">
              CURATED COLLECTIONS
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-8 h-8 rounded-full border border-[#D4AF37]/60 hover:border-[#D4AF37] hover:bg-[#FAF6EE] bg-white flex items-center justify-center text-[#8A671A] transition-all cursor-pointer shadow-xs active:scale-95"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-8 h-8 rounded-full border border-[#D4AF37]/60 hover:border-[#D4AF37] hover:bg-[#FAF6EE] bg-white flex items-center justify-center text-[#8A671A] transition-all cursor-pointer shadow-xs active:scale-95"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sliding Rail with Modern 2026 Golden & White Luxury Cards */}
        <div
          ref={sliderRef}
          className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto no-scrollbar scroll-smooth pb-2 2xl:justify-center"
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat)}
                className={`flex-shrink-0 w-[160px] sm:w-[195px] md:w-[220px] rounded-2xl overflow-hidden cursor-pointer group bg-white border transition-all duration-500 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(212,175,55,0.2)] flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#D4AF37] ring-2 ring-[#D4AF37] shadow-[0_8px_25px_rgba(212,175,55,0.25)]'
                    : 'border-[#D4AF37]/35 hover:border-[#D4AF37]'
                }`}
              >
                {/* High-Fidelity Color Studio Visual */}
                <div className="relative h-48 sm:h-56 md:h-60 w-full overflow-hidden bg-[#FAF8F5]">
                  <img
                    src={normalizeImageUrl(cat.image, cat.slug)}
                    alt={cat.name}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      const fb =
                        FALLBACK_CATEGORY_IMAGES[cat.slug] || FALLBACK_LUXURY_IMAGE;
                      if (!target.src.endsWith(fb)) {
                        target.src = fb;
                      }
                    }}
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                  />

                  {/* Golden-White Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/75 transition-opacity" />

                  {/* Floating Luxury Editorial Category Name */}
                  <div className="absolute inset-x-0 bottom-3 px-3 text-center flex flex-col items-center">
                    <span className="font-bodoni font-black text-xs sm:text-sm tracking-[0.2em] uppercase text-white drop-shadow-md leading-tight group-hover:text-[#F4E09E] transition-colors">
                      {cat.name}
                    </span>
                    <span className="text-[9px] uppercase tracking-[0.22em] font-bold text-[#D4AF37] mt-1 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      DISCOVER →
                    </span>
                  </div>
                </div>

                {/* Bottom Caption Bar in Pristine White & Gold */}
                <div className="py-2.5 px-3 text-center bg-white group-hover:bg-[#FAF6EE] transition-colors duration-300 border-t border-[#D4AF37]/20">
                  <p className="font-bodoni font-bold text-[11px] sm:text-xs tracking-[0.16em] text-[#111113] group-hover:text-[#B8860B] transition-colors truncate">
                    {cat.name}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

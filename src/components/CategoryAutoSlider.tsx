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
      className="py-6 sm:py-8 bg-[#FAF8F5] border-b border-[#E8DFC8] relative select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E8DFC8]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rotate-45 bg-[#D4AF37]" />
            <h2 className="font-bodoni text-sm sm:text-base tracking-[0.2em] font-extrabold uppercase text-[#111111]">
              CURATED CATEGORIES
            </h2>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-white bg-white flex items-center justify-center text-[#111111] transition-all cursor-pointer shadow-xs active:scale-95"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-white bg-white flex items-center justify-center text-[#111111] transition-all cursor-pointer shadow-xs active:scale-95"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sliding Rail with High-Contrast Luxury Black & White Styling */}
        <div
          ref={sliderRef}
          className="flex items-stretch gap-3.5 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-1"
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat)}
                className={`flex-shrink-0 w-[150px] sm:w-[185px] md:w-[210px] rounded-xl overflow-hidden cursor-pointer group bg-white border transition-all duration-300 shadow-xs hover:shadow-lg flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#D4AF37] ring-2 ring-[#D4AF37] shadow-md'
                    : 'border-[#E2D5BE] hover:border-[#D4AF37]'
                }`}
              >
                {/* Monochrome Black & White Studio Presentation */}
                <div className="relative h-44 sm:h-52 md:h-56 w-full overflow-hidden bg-[#111113]">
                  <img
                    src={normalizeImageUrl(cat.image, cat.slug)}
                    alt={cat.name}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      const fb =
                        FALLBACK_CATEGORY_IMAGES[cat.slug] || FALLBACK_LUXURY_IMAGE;
                      if (target.src !== fb) {
                        target.src = fb;
                      }
                    }}
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out grayscale contrast-110 brightness-95 group-hover:brightness-105"
                  />

                  {/* Gradient Scrim for Editorial Typography */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 transition-opacity" />

                  {/* Floating Luxury Editorial Category Name in Good Font */}
                  <div className="absolute inset-x-0 bottom-3 px-2.5 text-center flex flex-col items-center">
                    <span className="font-bodoni font-black text-xs sm:text-sm tracking-[0.18em] uppercase text-white drop-shadow-md leading-tight group-hover:text-[#F5D88C] transition-colors">
                      {cat.name}
                    </span>
                    <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#D4AF37] mt-1 opacity-90">
                      EXPLORE →
                    </span>
                  </div>
                </div>

                {/* Bottom Caption Bar */}
                <div className="py-2.5 px-3 text-center bg-[#FAF8F5] group-hover:bg-[#111113] transition-colors duration-300 border-t border-[#EFE8DC]">
                  <p className="font-bodoni font-bold text-[11px] sm:text-xs tracking-[0.14em] text-[#111111] group-hover:text-[#D4AF37] transition-colors truncate">
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

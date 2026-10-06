import React, { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { FALLBACK_CATEGORY_IMAGES, FALLBACK_LUXURY_IMAGE } from '../utils/imageUtils';

export const CategoryAutoSlider: React.FC = () => {
  const { categories, selectedCategory, setSelectedCategory, categoryInterval, triggerTransition } = useStore();
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
          sliderRef.current.scrollBy({ left: 190, behavior: 'smooth' });
        }
      }
    }, (categoryInterval || 4) * 1000);

    return () => clearInterval(interval);
  }, [isPaused, categoryInterval]);

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const offset = direction === 'left' ? -220 : 220;
      sliderRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleCategoryClick = (cat: { slug: string; name: string }) => {
    triggerTransition(cat.slug, cat.name);
  };

  return (
    <section
      className="py-6 sm:py-8 bg-[#FAF8F5] border-b border-[#E8DFC8] relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rotate-45 bg-[#D4AF37]" />
            <h2 className="font-bodoni text-sm sm:text-base tracking-[0.2em] font-extrabold uppercase text-[#111111]">
              CURATED CATEGORIES
            </h2>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-white bg-white flex items-center justify-center text-[#111111] transition-all cursor-pointer shadow-xs"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-white bg-white flex items-center justify-center text-[#111111] transition-all cursor-pointer shadow-xs"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sliding Rail with normal mobile-responsive sizing */}
        <div
          ref={sliderRef}
          className="flex items-stretch gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-1"
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat)}
                className={`flex-shrink-0 w-[140px] sm:w-[170px] md:w-[195px] rounded-xl overflow-hidden cursor-pointer group bg-white border transition-all duration-300 shadow-xs hover:shadow-md ${
                  isSelected
                    ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]'
                    : 'border-[#E2D5BE] hover:border-[#D4AF37]'
                }`}
              >
                {/* Category Product Image (pure products, folded jeans/shirts/watches/bags) */}
                <div className="relative h-36 sm:h-44 md:h-48 w-full overflow-hidden bg-[#F2EDE3]">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      const fb = FALLBACK_CATEGORY_IMAGES[cat.slug] || FALLBACK_LUXURY_IMAGE;
                      if (target.src !== fb) {
                        target.src = fb;
                      }
                    }}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-50 group-hover:opacity-30 transition-opacity" />
                </div>

                {/* Caption in rich gold font */}
                <div className="p-2.5 sm:p-3 text-center bg-[#FAF8F5] group-hover:bg-[#FFFBF2] transition-colors border-t border-[#EFE8DC]">
                  <div className="flex items-center justify-center gap-1 text-[11px] sm:text-xs font-bold tracking-[0.14em] text-[#111111] group-hover:text-[#B8860B] transition-colors">
                    <span className="truncate">{cat.name}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform shrink-0" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

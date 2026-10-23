import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Shirt,
  ShoppingBag,
  Footprints,
  Watch,
  Droplets,
  Crown,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CategoryItem } from '../../types';
import { normalizeImageUrl, FALLBACK_LUXURY_IMAGE } from '../../utils/imageUtils';

export const CategorySliderSection: React.FC = () => {
  const { categories, setCurrentView, setSelectedSubcategory, categoryInterval } = useStore();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Active categories only, excluding hidden ones
  const activeCategories = categories.filter((c) => c.active !== false && (c.slug || c.name).toLowerCase() !== 'women');

  const visibleCount = activeCategories.length;
  const slideIntervalMs = (categoryInterval || 4) * 1000;

  // Auto-slide effect with pause-on-hover
  useEffect(() => {
    if (visibleCount <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % visibleCount);
    }, slideIntervalMs);

    return () => clearInterval(timer);
  }, [visibleCount, isPaused, slideIntervalMs]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + visibleCount) % visibleCount);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % visibleCount);
  };

  const handleCategoryClick = (category: CategoryItem, subCategory?: string) => {
    const slug = (category.slug || category.name).toLowerCase();
    let targetView = slug;

    if (slug.includes('shoe') || slug.includes('footwear')) targetView = 'footwear';
    else if (slug.includes('bag')) targetView = 'bags';
    else if (slug.includes('perfume')) targetView = 'perfumes';
    else if (slug.includes('watch')) targetView = 'watches';
    else if (slug.includes('jean')) targetView = 'jeans';
    else if (slug === 'men') targetView = 'men';
    else if (slug.includes('accessor')) targetView = 'accessories';

    setSelectedSubcategory(subCategory || null);
    setCurrentView(targetView, subCategory || null);
    navigate('/' + targetView);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const getCategoryGoldenLogo = (name: string) => {
    const norm = name.toLowerCase();
    if (norm.includes('shoe') || norm.includes('footwear')) return <Footprints className="w-4 h-4 text-[#D4AF37]" />;
    if (norm.includes('bag')) return <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />;
    if (norm.includes('watch')) return <Watch className="w-4 h-4 text-[#D4AF37]" />;
    if (norm.includes('perfume')) return <Droplets className="w-4 h-4 text-[#D4AF37]" />;
    if (norm.includes('jean')) return <Sparkles className="w-4 h-4 text-[#D4AF37]" />;
    if (norm.includes('accessor')) return <Crown className="w-4 h-4 text-[#D4AF37]" />;
    return <Shirt className="w-4 h-4 text-[#D4AF37]" />;
  };

  if (activeCategories.length === 0) return null;

  return (
    <section
      className="w-full bg-[#FAF8F5] py-12 sm:py-16 border-b border-[#E8DEC8] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className="max-w-[1540px] mx-auto px-4 sm:px-8">
        {/* Section Header with Navigation Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-5 border-b border-[#E8DEC8] gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#B8860B] animate-pulse" />
              <span className="text-[10px] sm:text-xs font-bold tracking-[0.24em] text-[#8A671A] uppercase">
                OUR DEPARTMENTS
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-wider text-[#111113]">
              EXPLORE BY CATEGORY
            </h2>
            <p className="text-xs text-[#7A6C58] mt-1 max-w-xl">
              Curated luxury fashion, fine leathers, horology, and signature perfumes crafted for discerning clientele.
            </p>
          </div>

          {/* Slider Prev / Next Controls */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              type="button"
              onClick={handlePrev}
              className="w-10 h-10 rounded-full border border-[#D4AF37]/50 bg-white hover:bg-[#FAF6EE] text-[#111113] hover:text-[#B8860B] flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
              aria-label="Previous Category Slide"
            >
              <ChevronLeft className="w-5 h-5 text-[#B8860B]" />
            </button>

            <span className="text-xs font-mono font-bold text-[#7A6C58]">
              {String(currentIndex + 1).padStart(2, '0')} / {String(visibleCount).padStart(2, '0')}
            </span>

            <button
              type="button"
              onClick={handleNext}
              className="w-10 h-10 rounded-full border border-[#D4AF37]/50 bg-white hover:bg-[#FAF6EE] text-[#111113] hover:text-[#B8860B] flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
              aria-label="Next Category Slide"
            >
              <ChevronRight className="w-5 h-5 text-[#B8860B]" />
            </button>
          </div>
        </div>

        {/* Smooth Carousel Container */}
        <div className="relative overflow-hidden" ref={sliderRef}>
          <div
            className="flex transition-transform duration-700 ease-out gap-5 sm:gap-6"
            style={{
              transform: `translateX(-${currentIndex * (100 / (typeof window !== 'undefined' && window.innerWidth < 640 ? 1.2 : typeof window !== 'undefined' && window.innerWidth < 1024 ? 2.3 : 3.5))}%)`,
            }}
          >
            {activeCategories.map((category) => {
              const subcategories = Array.isArray(category.subcategories) ? category.subcategories : [];

              return (
                <div
                  key={category.id}
                  className="w-[85%] sm:w-[45%] lg:w-[28.5%] shrink-0 group flex flex-col bg-white rounded-2xl overflow-hidden border border-[#D4AF37]/40 hover:border-[#D4AF37] shadow-sm hover:shadow-[0_10px_30px_rgba(212,175,55,0.2)] transition-all duration-300"
                >
                  {/* Category Image Card */}
                  <div
                    onClick={() => handleCategoryClick(category)}
                    className="relative aspect-[4/5] w-full overflow-hidden bg-[#1E1E22] cursor-pointer"
                  >
                    <img
                      src={normalizeImageUrl(category.image, category.name)}
                      alt={category.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = FALLBACK_LUXURY_IMAGE;
                      }}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108 brightness-[0.88] group-hover:brightness-95"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                    {/* Department Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-xs text-[#D4AF37] border border-[#D4AF37]/60 text-[9.5px] font-extrabold uppercase tracking-wider">
                        {category.department?.toUpperCase() || 'COLLECTION'}
                      </span>
                    </div>

                    {/* Golden Theme Category Logo Emblem */}
                    <div
                      className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/75 border border-[#D4AF37] flex items-center justify-center shadow-lg backdrop-blur-xs group-hover:scale-110 transition-transform"
                      title={`${category.name} Logo`}
                    >
                      {getCategoryGoldenLogo(category.name)}
                    </div>

                    {/* Bottom Title on Image */}
                    <div className="absolute bottom-4 left-4 right-4 z-10 text-white space-y-1">
                      <span className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-[#D4AF37] block">
                        LAP OF LUXURY
                      </span>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold uppercase tracking-wider text-white">
                        {category.name}
                      </h3>
                    </div>
                  </div>

                  {/* Subcategories & Action Footer */}
                  <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 space-y-3.5 bg-white">
                    {subcategories.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A671A] block">
                          Featured Subcategories:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {subcategories.slice(0, 4).map((sub) => (
                            <button
                              key={sub}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCategoryClick(category, sub);
                              }}
                              className="px-2.5 py-1 rounded-md bg-[#FAF8F5] hover:bg-[#FAF6EE] border border-[#D4AF37]/30 hover:border-[#D4AF37] text-[10.5px] font-semibold text-[#3D3327] hover:text-[#8A671A] transition-colors cursor-pointer"
                            >
                              {sub}
                            </button>
                          ))}
                          {subcategories.length > 4 && (
                            <span className="px-2 py-1 text-[10px] font-medium text-[#7A6C58]">
                              +{subcategories.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => handleCategoryClick(category)}
                      className="w-full py-2.5 px-4 rounded-xl border border-[#D4AF37] hover:bg-[#111113] hover:text-[#D4AF37] text-[#111113] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 group-hover:bg-[#111113] group-hover:text-[#D4AF37] shadow-2xs"
                    >
                      <span>Explore Collection</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#B8860B]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {activeCategories.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                idx === currentIndex ? 'w-8 bg-[#D4AF37]' : 'w-2 bg-[#D5C7B0] hover:bg-[#8A671A]'
              }`}
              aria-label={`Slide to category ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

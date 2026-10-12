import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface NavCategory {
  name: string;
  slug: string;
  badge?: string;
}

const DEFAULT_NAV_ITEMS: NavCategory[] = [
  { name: 'ALL COLLECTIONS', slug: 'All' },
  { name: "MEN'S FASHION", slug: 'Men' },
  { name: "WOMEN'S FASHION", slug: 'Women' },
  { name: 'JEANS & DENIM', slug: 'Jeans' },
  { name: 'WATCHES & TIMEPIECES', slug: 'Watches' },
  { name: 'BAGS & WALLETS', slug: 'Bags' },
  { name: 'SHOES & FOOTWEAR', slug: 'Shoes' },
  { name: 'LUXURY ACCESSORIES', slug: 'Accessories' },
  { name: 'PERFUMES & SCENTS', slug: 'Perfumes' },
  { name: 'SUNGLASSES & EYEWEAR', slug: 'Accessories' },
  { name: 'LUXURY COUTURE', slug: 'Women' },
  { name: 'THE FESTIVE EDIT', slug: 'Festive', badge: 'SPECIAL' },
  { name: 'NEW ARRIVALS', slug: 'All', badge: 'NEW' },
];

export const SubNav: React.FC = () => {
  const { selectedCategory, triggerTransition, categories } = useStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  // Mouse drag tracking refs to avoid re-renders during drag
  const dragInfo = useRef({
    isDown: false,
    startX: 0,
    scrollLeft: 0,
    hasMoved: false,
  });

  // Combine default items with any custom admin categories
  const navItems = React.useMemo(() => {
    const list = [...DEFAULT_NAV_ITEMS];
    if (categories && categories.length > 0) {
      categories.forEach((cat) => {
        if (!list.some((item) => item.slug.toLowerCase() === cat.slug.toLowerCase() || item.name.toLowerCase() === cat.name.toLowerCase())) {
          list.push({
            name: cat.name.toUpperCase(),
            slug: cat.slug,
          });
        }
      });
    }
    return list;
  }, [categories]);

  // Check scroll position to toggle arrow buttons and fade edges
  const checkScrollability = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 6);
  }, []);

  useEffect(() => {
    checkScrollability();
    const el = scrollContainerRef.current;
    if (!el) return;

    const handleResize = () => checkScrollability();
    window.addEventListener('resize', handleResize);
    el.addEventListener('scroll', checkScrollability, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      el.removeEventListener('scroll', checkScrollability);
    };
  }, [checkScrollability, navItems]);

  // Smooth scroll by an offset amount (left or right)
  const handleManualScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const scrollAmount = Math.max(260, Math.floor(el.clientWidth * 0.45));
    const targetScroll =
      direction === 'left' ? el.scrollLeft - scrollAmount : el.scrollLeft + scrollAmount;

    el.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });
  };

  // Mouse Wheel scroll support (scrolls horizontally when cursor is over the category bar)
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const el = scrollContainerRef.current;
    if (!el) return;

    if (e.deltaY !== 0 && Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
      el.scrollLeft += e.deltaY * 0.9;
      checkScrollability();
    }
  };

  // Mouse Drag / Grab to scroll handlers for PC, desktop, and laptop
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollContainerRef.current;
    if (!el) return;

    dragInfo.current = {
      isDown: true,
      startX: e.pageX - el.offsetLeft,
      scrollLeft: el.scrollLeft,
      hasMoved: false,
    };
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragInfo.current.isDown) return;
    const el = scrollContainerRef.current;
    if (!el) return;

    const x = e.pageX - el.offsetLeft;
    const walk = x - dragInfo.current.startX;

    if (Math.abs(walk) > 4) {
      dragInfo.current.hasMoved = true;
    }

    el.scrollLeft = dragInfo.current.scrollLeft - walk;
    checkScrollability();
  };

  const handleMouseUpOrLeave = () => {
    dragInfo.current.isDown = false;
    setIsDragging(false);
  };

  const handleNavClick = (slug: string, name: string) => {
    // If user dragged to scroll, don't trigger the click
    if (dragInfo.current.hasMoved) {
      dragInfo.current.hasMoved = false;
      return;
    }
    triggerTransition(slug, name);

    // Smoothly scroll catalog into view if user wants to see products
    const catalog = document.getElementById('catalog-section');
    if (catalog) {
      catalog.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      aria-label="Top Header Categories Navigation"
      className="relative bg-white/98 border-b border-[#E8DEC8] shadow-xs backdrop-blur-md select-none group/nav"
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 flex items-center relative">
        {/* Left Manual Scroll Arrow Button (for PC, Desktop & Laptop) */}
        <div
          className={`absolute left-0 top-0 bottom-0 z-20 flex items-center pl-2 pr-4 bg-gradient-to-r from-white via-white/95 to-transparent transition-opacity duration-200 ${
            canScrollLeft ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <button
            type="button"
            onClick={() => handleManualScroll('left')}
            aria-label="Scroll categories left"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-[#D4AF37]/60 text-[#111113] hover:text-[#B8860B] hover:border-[#B8860B] hover:bg-[#FAF6EE] shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_2px_12px_rgba(184,134,11,0.28)] flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Scrollable Category Track with Drag-to-Scroll & Mouse Wheel Support */}
        <div
          ref={scrollContainerRef}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className={`w-full overflow-x-auto no-scrollbar scroll-smooth py-2.5 px-6 sm:px-8 flex items-center gap-5 sm:gap-7 lg:gap-8 whitespace-nowrap ${
            isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
          }`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {navItems.map((item) => {
            const isActive =
              selectedCategory.toLowerCase() === item.slug.toLowerCase() ||
              (item.slug === 'All' && selectedCategory === 'All');

            return (
              <button
                key={item.name}
                type="button"
                onClick={() => handleNavClick(item.slug, item.name)}
                className={`group/item flex items-center gap-1.5 text-[11px] lg:text-[12px] font-bold tracking-[0.14em] uppercase transition-all duration-200 relative py-1.5 shrink-0 cursor-pointer ${
                  isActive
                    ? 'text-[#B8860B]'
                    : 'text-[#1A1816] hover:text-[#B8860B]'
                }`}
              >
                <span>{item.name}</span>

                {item.badge && (
                  <span className="text-[8px] font-extrabold tracking-wider bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black px-1.5 py-0.5 rounded-full uppercase leading-none shadow-2xs">
                    {item.badge}
                  </span>
                )}

                {/* Golden active indicator bar */}
                {isActive ? (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#B8860B] rounded-full shadow-[0_1px_4px_rgba(184,134,11,0.4)]" />
                ) : (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#B8860B] rounded-full scale-x-0 group-hover/item:scale-x-100 transition-transform duration-200 origin-center opacity-80" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Manual Scroll Arrow Button (for PC, Desktop & Laptop) */}
        <div
          className={`absolute right-0 top-0 bottom-0 z-20 flex items-center pr-2 pl-4 bg-gradient-to-l from-white via-white/95 to-transparent transition-opacity duration-200 ${
            canScrollRight ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <button
            type="button"
            onClick={() => handleManualScroll('right')}
            aria-label="Scroll categories right"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-[#D4AF37]/60 text-[#111113] hover:text-[#B8860B] hover:border-[#B8860B] hover:bg-[#FAF6EE] shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_2px_12px_rgba(184,134,11,0.28)] flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </nav>
  );
};

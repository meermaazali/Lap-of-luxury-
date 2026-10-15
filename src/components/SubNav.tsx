import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface NavCategory {
  name: string;
  slug: string;
  badge?: string;
}

const DEFAULT_NAV_ITEMS: NavCategory[] = [
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
];

const isPromotionalCategory = (name: string, slug: string): boolean => {
  const value = `${name} ${slug}`
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return /\bnew arrivals?\b|\bbest sellers?\b|\boffers?\b|\bsale\b|\bdeals?\b|\bcollections?\b|\bfestive\b|\bpopular\b|\bspecial offers?\b/.test(
    value
  );
};

export const SubNav: React.FC = () => {
  const { selectedCategory, triggerTransition, categories } = useStore();

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  const dragInfo = useRef({
    isDown: false,
    startX: 0,
    scrollLeft: 0,
    hasMoved: false,
  });

  // Keep fashion navigation items and exclude promotional categories.
  const navItems = React.useMemo(() => {
    const list = DEFAULT_NAV_ITEMS.filter(
      (item) => !isPromotionalCategory(item.name, item.slug)
    );

    if (categories && categories.length > 0) {
      categories.forEach((category) => {
        if (isPromotionalCategory(category.name, category.slug)) {
          return;
        }

        const alreadyExists = list.some(
          (item) =>
            item.slug.toLowerCase() === category.slug.toLowerCase() ||
            item.name.toLowerCase() === category.name.toLowerCase()
        );

        if (!alreadyExists) {
          list.push({
            name: category.name.toUpperCase(),
            slug: category.slug,
          });
        }
      });
    }

    return list;
  }, [categories]);

  const checkScrollability = useCallback(() => {
    const element = scrollContainerRef.current;
    if (!element) return;

    const { scrollLeft, scrollWidth, clientWidth } = element;

    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 6);
  }, []);

  useEffect(() => {
    checkScrollability();

    const element = scrollContainerRef.current;
    if (!element) return;

    const handleResize = () => checkScrollability();

    window.addEventListener('resize', handleResize);
    element.addEventListener('scroll', checkScrollability, {
      passive: true,
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      element.removeEventListener('scroll', checkScrollability);
    };
  }, [checkScrollability, navItems]);

  const handleManualScroll = (direction: 'left' | 'right') => {
    const element = scrollContainerRef.current;
    if (!element) return;

    const scrollAmount = Math.max(
      260,
      Math.floor(element.clientWidth * 0.45)
    );

    const targetScroll =
      direction === 'left'
        ? element.scrollLeft - scrollAmount
        : element.scrollLeft + scrollAmount;

    element.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const element = scrollContainerRef.current;
    if (!element) return;

    if (
      event.deltaY !== 0 &&
      Math.abs(event.deltaX) < Math.abs(event.deltaY)
    ) {
      element.scrollLeft += event.deltaY * 0.9;
      checkScrollability();
    }
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;

    const element = scrollContainerRef.current;
    if (!element) return;

    dragInfo.current = {
      isDown: true,
      startX: event.pageX - element.offsetLeft,
      scrollLeft: element.scrollLeft,
      hasMoved: false,
    };

    setIsDragging(true);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!dragInfo.current.isDown) return;

    const element = scrollContainerRef.current;
    if (!element) return;

    const x = event.pageX - element.offsetLeft;
    const distance = x - dragInfo.current.startX;

    if (Math.abs(distance) > 4) {
      dragInfo.current.hasMoved = true;
    }

    element.scrollLeft = dragInfo.current.scrollLeft - distance;
    checkScrollability();
  };

  const handleMouseUpOrLeave = () => {
    dragInfo.current.isDown = false;
    setIsDragging(false);
  };

  const handleNavClick = (slug: string, name: string) => {
    if (dragInfo.current.hasMoved) {
      dragInfo.current.hasMoved = false;
      return;
    }

    triggerTransition(slug, name);

    const catalog = document.getElementById('catalog-section');

    if (catalog) {
      catalog.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      aria-label="Top Header Categories Navigation"
      className="relative bg-white/98 border-b border-[#E8DEC8] shadow-sm backdrop-blur-md select-none group/nav"
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 flex items-center relative">
        {/* Left Scroll Arrow */}
        <div
          className={`absolute left-0 top-0 bottom-0 z-20 flex items-center pl-2 pr-4 bg-gradient-to-r from-white via-white/95 to-transparent transition-opacity duration-200 ${
            canScrollLeft
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none'
          }`}
        >
          <button
            type="button"
            onClick={() => handleManualScroll('left')}
            aria-label="Scroll categories left"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-[#D4AF37]/60 text-[#111113] hover:text-[#B8860B] hover:border-[#B8860B] hover:bg-[#FAF6EE] shadow-sm flex items-center justify-center transition-all active:scale-90 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Scrollable Category Navigation */}
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
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
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
                  <span className="text-[8px] font-extrabold tracking-wider bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black px-1.5 py-0.5 rounded-full uppercase leading-none shadow-sm">
                    {item.badge}
                  </span>
                )}

                {isActive ? (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#B8860B] rounded-full" />
                ) : (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#B8860B] rounded-full scale-x-0 group-hover/item:scale-x-100 transition-transform duration-200 origin-center opacity-80" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Scroll Arrow */}
        <div
          className={`absolute right-0 top-0 bottom-0 z-20 flex items-center pr-2 pl-4 bg-gradient-to-l from-white via-white/95 to-transparent transition-opacity duration-200 ${
            canScrollRight
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none'
          }`}
        >
          <button
            type="button"
            onClick={() => handleManualScroll('right')}
            aria-label="Scroll categories right"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-[#D4AF37]/60 text-[#111113] hover:text-[#B8860B] hover:border-[#B8860B] hover:bg-[#FAF6EE] shadow-sm flex items-center justify-center transition-all active:scale-90 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </nav>
  );
};
import React, { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface SubItem {
  label: string;
  subCategory?: string;
  isBrand?: boolean;
}

interface ColumnGroup {
  heading: string;
  items: SubItem[];
}

export const LuxuryMegaNav: React.FC = () => {
  const { currentView, setCurrentView, selectedSubcategory, categories } = useStore();
  const navigate = useNavigate();
  const [activeHoverId, setActiveHoverId] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Dynamic Navigation Configuration driven by Firestore categories while preserving luxury defaults
  const navItems = useMemo(() => {
    // Standard baseline mappings
    const defaultData: Record<
      string,
      {
        label: string;
        view: string;
        subcategories: string[];
        brands: string[];
      }
    > = {
      men: {
        label: 'Men',
        view: 'men',
        subcategories: ['Shirts', 'T-shirts', 'Hoodies', 'Full-sleeve T-shirts', 'Jeans'],
        brands: ['LAP OF LUXURY SARTORIAL', 'Ralph Lauren', 'Burberry', 'Hugo Boss'],
      },
      footwear: {
        label: 'Footwear',
        view: 'footwear',
        subcategories: ['Sneakers', 'Crocs', 'Formal Shoes', 'Loafers', 'Sandals'],
        brands: ['Nike', 'Gucci', 'Crocs', 'Prada'],
      },
      bags: {
        label: 'Bags',
        view: 'bags',
        subcategories: ['Backpacks', 'Briefcases', 'Crossbody Bags', 'Travel Bags', 'Wallets'],
        brands: ['Gucci', 'Louis Vuitton', 'Prada', 'Saint Laurent', 'Bottega Veneta'],
      },
      perfumes: {
        label: 'Perfumes',
        view: 'perfumes',
        subcategories: ['Oud & Extrait', 'Eau de Parfum', 'Parfum', 'Attar & Oils'],
        brands: ['Dior', 'Chanel', 'Gucci', 'Tom Ford', 'Creed'],
      },
      watches: {
        label: 'Watches',
        view: 'watches',
        subcategories: ['Chronograph', 'Automatic', 'Dress Watches', 'Gold Editions'],
        brands: ['Rado', 'Tissot', 'Rolex', 'Omega', 'Tag Heuer'],
      },
      jeans: {
        label: 'Jeans',
        view: 'jeans',
        subcategories: ['Slim Fit', 'Regular Fit', 'Baggy Fit', 'Raw Denim', 'Relaxed Fit'],
        brands: ['LAP OF LUXURY SARTORIAL', 'Diesel', "Levi's", 'Calvin Klein'],
      },
    };

    // Update with live Firestore categories (filter out Women from active storefront)
    if (categories && categories.length > 0) {
      categories.forEach((cat) => {
        const slugLower = (cat.slug || cat.name || '').toLowerCase();
        if (slugLower === 'women' || cat.active === false) return;

        let targetKey = slugLower;
        if (slugLower.includes('shoe') || slugLower.includes('footwear')) targetKey = 'footwear';
        else if (slugLower.includes('bag')) targetKey = 'bags';
        else if (slugLower.includes('perfume')) targetKey = 'perfumes';
        else if (slugLower.includes('watch')) targetKey = 'watches';
        else if (slugLower.includes('jean')) targetKey = 'jeans';
        else if (slugLower === 'men') targetKey = 'men';

        if (defaultData[targetKey]) {
          if (Array.isArray(cat.subcategories) && cat.subcategories.length > 0) {
            defaultData[targetKey].subcategories = Array.from(
              new Set([...defaultData[targetKey].subcategories, ...cat.subcategories])
            );
          }
          if (Array.isArray(cat.brands) && cat.brands.length > 0) {
            defaultData[targetKey].brands = Array.from(
              new Set([...defaultData[targetKey].brands, ...cat.brands])
            );
          }
        }
      });
    }

    // Build structured dropdown columns containing ONLY subcategory and brand links
    return [
      {
        id: 'home',
        label: 'Home',
        view: 'home',
        hasDropdown: false,
      },
      {
        id: 'men',
        label: 'Men',
        view: 'men',
        hasDropdown: true,
        columns: [
          {
            heading: "Men's Sartorial Categories",
            items: [
              { label: "All Men's Collection", subCategory: '' },
              ...defaultData.men.subcategories.map((sub) => ({
                label: sub,
                subCategory: sub,
              })),
            ],
          },
          {
            heading: 'Tailoring Styles & Fits',
            items: [
              { label: 'Egyptian Cotton Shirts', subCategory: 'Shirts' },
              { label: 'Oversized & Luxury Hoodies', subCategory: 'Hoodies' },
              { label: 'Long Sleeve Luxury Tees', subCategory: 'Full-sleeve T-shirts' },
              { label: 'Raw Selvedge Denim', subCategory: 'Jeans' },
            ],
          },
        ] as ColumnGroup[],
      },
      {
        id: 'footwear',
        label: 'Footwear',
        view: 'footwear',
        hasDropdown: true,
        columns: [
          {
            heading: 'Footwear Styles',
            items: [
              { label: 'All Footwear Collection', subCategory: '' },
              ...defaultData.footwear.subcategories.map((sub) => ({
                label: sub,
                subCategory: sub,
              })),
            ],
          },
          {
            heading: 'Craftsmanship & Occasions',
            items: [
              { label: 'Italian Leather Loafers', subCategory: 'Loafers' },
              { label: 'Minimalist Luxury Sneakers', subCategory: 'Sneakers' },
              { label: 'Handcrafted Sandals & Mules', subCategory: 'Sandals' },
              { label: 'Comfort Crocs & Slides', subCategory: 'Crocs' },
            ],
          },
        ] as ColumnGroup[],
      },
      {
        id: 'bags',
        label: 'Bags',
        view: 'bags',
        hasDropdown: true,
        columns: [
          {
            heading: 'Designer Brands',
            items: [
              { label: 'All Luxury Brands', subCategory: '' },
              ...defaultData.bags.brands.map((brand) => ({
                label: brand,
                subCategory: brand,
                isBrand: true,
              })),
            ],
          },
          {
            heading: 'Bags & Leathercraft',
            items: defaultData.bags.subcategories.map((sub) => ({
              label: sub,
              subCategory: sub,
            })),
          },
        ] as ColumnGroup[],
      },
      {
        id: 'perfumes',
        label: 'Perfumes',
        view: 'perfumes',
        hasDropdown: true,
        columns: [
          {
            heading: 'Perfume Maisons & Brands',
            items: [
              { label: 'All Perfume Houses', subCategory: '' },
              ...defaultData.perfumes.brands.map((brand) => ({
                label: brand,
                subCategory: brand,
                isBrand: true,
              })),
            ],
          },
          {
            heading: 'Scents & Concentrations',
            items: defaultData.perfumes.subcategories.map((sub) => ({
              label: sub,
              subCategory: sub,
            })),
          },
        ] as ColumnGroup[],
      },
      {
        id: 'watches',
        label: 'Watches',
        view: 'watches',
        hasDropdown: true,
        columns: [
          {
            heading: 'Horology Brands',
            items: [
              { label: 'All Watchmakers', subCategory: '' },
              ...defaultData.watches.brands.map((brand) => ({
                label: brand,
                subCategory: brand,
                isBrand: true,
              })),
            ],
          },
          {
            heading: 'Movements & Styles',
            items: defaultData.watches.subcategories.map((sub) => ({
              label: sub,
              subCategory: sub,
            })),
          },
        ] as ColumnGroup[],
      },
      {
        id: 'jeans',
        label: 'Jeans',
        view: 'jeans',
        hasDropdown: true,
        columns: [
          {
            heading: 'Denim Fits & Cuts',
            items: [
              { label: 'All Jeans & Denim', subCategory: '' },
              ...defaultData.jeans.subcategories.map((sub) => ({
                label: sub,
                subCategory: sub,
              })),
            ],
          },
          {
            heading: 'Premium Brands',
            items: defaultData.jeans.brands.map((brand) => ({
              label: brand,
              subCategory: brand,
              isBrand: true,
            })),
          },
        ] as ColumnGroup[],
      },
      {
        id: 'collections',
        label: 'Collections',
        view: 'collections',
        hasDropdown: false,
      },
      {
        id: 'new-arrivals',
        label: 'New Arrivals',
        view: 'new-arrivals',
        badge: 'NEW',
        badgeColor: 'bg-[#B8860B] text-white',
        hasDropdown: false,
      },
      {
        id: 'sale',
        label: 'Sale',
        view: 'sale',
        badge: 'OFFERS',
        badgeColor: 'bg-red-700 text-white',
        hasDropdown: false,
      },
    ];
  }, [categories]);

  const handleMouseEnter = (id: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setActiveHoverId(id);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    // Smooth 250ms debounce grace period prevents menu from disappearing on cursor transition
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveHoverId(null);
    }, 250);
  };

  const handleTabClick = (view: string) => {
    setActiveHoverId(null);
    setCurrentView(view, null);
    const targetPath = view === 'home' ? '/' : `/${view}`;
    navigate(targetPath);
  };

  const handleSubCategoryClick = (view: string, subCategory?: string) => {
    setActiveHoverId(null);
    setCurrentView(view, subCategory || null);
    if (subCategory && subCategory.trim()) {
      navigate(`/category/${view}/${encodeURIComponent(subCategory.trim())}`);
    } else {
      navigate(`/${view}`);
    }
  };

  return (
    <nav
      aria-label="Main Navigation"
      className="hidden md:block relative bg-white border-b border-[#E8DEC8] z-30 select-none shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
      onMouseLeave={handleMouseLeave}
    >
      <div className="max-w-[1540px] mx-auto px-4 lg:px-8">
        <ul className="flex items-center justify-between text-[11px] lg:text-xs font-semibold tracking-[0.14em] uppercase text-[#111113]">
          {navItems.map((tab) => {
            const isActive =
              currentView === tab.view ||
              (tab.view === 'home' && (!currentView || currentView === 'home'));
            const isHovered = activeHoverId === tab.id;

            return (
              <li
                key={tab.id}
                className="relative py-3 group"
                onMouseEnter={() => handleMouseEnter(tab.id)}
              >
                {/* Main Navigation Tab Button */}
                <button
                  type="button"
                  onClick={() => handleTabClick(tab.view)}
                  className={`flex items-center gap-1.5 transition-colors cursor-pointer py-1 relative ${
                    isActive
                      ? 'text-[#B8860B] font-bold'
                      : 'text-[#1F1E22] hover:text-[#B8860B]'
                  } ${tab.id === 'sale' ? 'text-red-700 font-bold' : ''}`}
                >
                  <span>{tab.label}</span>
                  {tab.hasDropdown && (
                    <ChevronDown
                      className={`w-3 h-3 transition-transform duration-200 ${
                        isHovered ? 'rotate-180 text-[#B8860B]' : 'text-[#8C8274]'
                      }`}
                    />
                  )}
                  {tab.badge && (
                    <span
                      className={`text-[8.5px] tracking-wider px-1.5 py-0.5 rounded-full font-bold uppercase ${tab.badgeColor}`}
                    >
                      {tab.badge}
                    </span>
                  )}
                  {/* Active Underline Indicator */}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#B8860B] rounded-full" />
                  )}
                </button>

                {/* LUXURY DROPDOWN MENU — SHOWS ONLY SUBCATEGORY & BRAND LINKS */}
                {tab.hasDropdown && isHovered && tab.columns && (
                  <div
                    className="absolute top-full left-0 pt-2 z-50 cursor-default"
                    onMouseEnter={() => handleMouseEnter(tab.id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {/* Invisible hover bridge prevents gaps */}
                    <div className="absolute -top-3 left-0 right-0 h-4 bg-transparent" />

                    <div className="min-w-[420px] max-w-[560px] bg-white border border-[#E8DEC8] shadow-2xl rounded-2xl p-5 lg:p-6 animate-in fade-in slide-in-from-top-1 duration-200">
                      <div className="grid grid-cols-2 gap-6">
                        {tab.columns.map((col, colIdx) => (
                          <div key={colIdx} className="space-y-2.5">
                            <h4 className="text-[11px] font-bold tracking-[0.16em] uppercase text-[#8A671A] border-b border-[#F0EAE1] pb-1.5 flex items-center justify-between">
                              <span>{col.heading}</span>
                            </h4>
                            <ul className="space-y-1.5 text-xs normal-case font-normal">
                              {col.items.map((item, itemIdx) => {
                                const isSubActive =
                                  selectedSubcategory &&
                                  item.subCategory &&
                                  selectedSubcategory.toLowerCase() ===
                                    item.subCategory.toLowerCase();

                                return (
                                  <li key={itemIdx}>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSubCategoryClick(tab.view, item.subCategory);
                                      }}
                                      className={`text-left w-full hover:text-[#B8860B] hover:translate-x-1 transition-all cursor-pointer flex items-center justify-between py-1 px-1 rounded-md group/link ${
                                        isSubActive
                                          ? 'text-[#B8860B] font-semibold bg-[#FAF6EE]'
                                          : 'text-[#3D3327] hover:bg-[#FAF8F5]'
                                      }`}
                                    >
                                      <span className="text-[12px] font-medium tracking-normal text-[#2A241E] group-hover/link:text-[#B8860B]">
                                        {item.label}
                                      </span>
                                      <ArrowRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 -translate-x-1 group-hover/link:translate-x-0 transition-all text-[#B8860B]" />
                                    </button>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        ))}
                      </div>

                      {/* Bottom Quick-Action Bar */}
                      <div className="mt-4 pt-3 border-t border-[#F0EAE1] flex items-center justify-between text-[11px]">
                        <span className="text-[#8C8274] font-normal lowercase tracking-normal">
                          explore handcrafted {tab.label.toLowerCase()}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleSubCategoryClick(tab.view)}
                          className="font-bold text-[#8A671A] hover:text-[#B8860B] uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                        >
                          <span>View All {tab.label}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

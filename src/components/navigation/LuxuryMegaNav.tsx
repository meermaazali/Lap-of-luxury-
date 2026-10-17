import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ArrowRight, Sparkles, Flame, Tag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface MegaColumn {
  heading: string;
  items: { label: string; subCategory?: string }[];
}

interface NavTabConfig {
  id: string;
  label: string;
  view: string;
  badge?: string;
  badgeColor?: string;
  hasMegaMenu?: boolean;
  megaColumns?: MegaColumn[];
  featuredCard?: {
    image: string;
    kicker: string;
    title: string;
    subtitle: string;
    cta: string;
    subCategory?: string;
  };
}

const NAV_TABS: NavTabConfig[] = [
  {
    id: 'home',
    label: 'Home',
    view: 'home',
  },
  {
    id: 'new-arrivals',
    label: 'New Arrivals',
    view: 'new-arrivals',
    badge: 'NEW',
    badgeColor: 'bg-[#B8860B] text-white',
  },
  {
    id: 'men',
    label: 'Men',
    view: 'men',
    hasMegaMenu: true,
    megaColumns: [
      {
        heading: "Men's Clothing",
        items: [
          { label: 'All Men Clothing' },
          { label: 'Shirts', subCategory: 'Shirts' },
          { label: 'T-Shirts & Polos', subCategory: 'T-Shirts' },
          { label: 'Trousers & Chinos', subCategory: 'Trousers' },
          { label: 'Jeans & Raw Denim', subCategory: 'Jeans' },
          { label: 'Jackets & Coats', subCategory: 'Jackets' },
          { label: 'Tailored Casuals & Overshirts', subCategory: 'Shirts' },
          { label: 'Ethnic Wear & Kurta Sets', subCategory: 'Kurta Sets' },
          { label: 'Wedding & Occasion Wear', subCategory: 'Occasion' },
        ],
      },
      {
        heading: "Men's Shoes",
        items: [
          { label: 'All Men Footwear' },
          { label: 'Luxury Sneakers', subCategory: 'Sneakers' },
          { label: 'Formal Shoes & Oxfords', subCategory: 'Formal Shoes' },
          { label: 'Handcrafted Loafers', subCategory: 'Loafers' },
          { label: 'Leather Sandals', subCategory: 'Sandals' },
        ],
      },
      {
        heading: "Men's Bags & Accessories",
        items: [
          { label: 'Leather Wallets', subCategory: 'Wallets' },
          { label: 'Dress Belts', subCategory: 'Belts' },
          { label: 'Watches & Chronographs', subCategory: 'Watches and Accessories' },
          { label: 'Aviator Sunglasses', subCategory: 'Watches and Accessories' },
          { label: 'Royal Oud Fragrances', subCategory: 'Watches and Accessories' },
        ],
      },
    ],
    featuredCard: {
      image: '/images/category_mens_fashion_1791290148102.jpg',
      kicker: 'SARTORIAL SHIRTING',
      title: 'Egyptian Cotton & Tailored Shirts',
      subtitle: 'Crafted for refined comfort and elegance',
      cta: 'Shop Men Collection →',
      subCategory: 'Shirts',
    },
  },
  {
    id: 'women',
    label: 'Women',
    view: 'women',
    hasMegaMenu: true,
    megaColumns: [
      {
        heading: "Women's Clothing",
        items: [
          { label: 'All Women Clothing' },
          { label: 'Evening Dresses & Gowns', subCategory: 'Dresses' },
          { label: 'Silk Tops & Shirts', subCategory: 'Tops and Shirts' },
          { label: 'Co-ord Sets', subCategory: 'Co-ord Sets' },
          { label: 'Banarasi Sarees', subCategory: 'Sarees' },
          { label: 'Designer Lehengas', subCategory: 'Lehengas' },
          { label: 'Festive Kurtas', subCategory: 'Dresses' },
          { label: 'Occasion Wear', subCategory: 'Occasion' },
        ],
      },
      {
        heading: "Women's Bags",
        items: [
          { label: 'All Handbags' },
          { label: 'Structured Handbags', subCategory: 'Handbags' },
          { label: 'Shoulder Bags', subCategory: 'Shoulder Bags' },
          { label: 'Sling Bags', subCategory: 'Sling Bags' },
          { label: 'Evening Clutches', subCategory: 'Clutches' },
          { label: 'Leather Totes', subCategory: 'Totes' },
        ],
      },
      {
        heading: "Women's Footwear & Accessories",
        items: [
          { label: 'Stiletto Heels', subCategory: 'Heels' },
          { label: 'Occasion Sandals', subCategory: 'Sandals' },
          { label: 'Pointed Flats', subCategory: 'Flats' },
          { label: 'Designer Sneakers', subCategory: 'Sneakers' },
          { label: 'Fine Accessories', subCategory: 'Accessories' },
        ],
      },
    ],
    featuredCard: {
      image: '/images/cat_womens_dress.jpg',
      kicker: 'COUTURE CAPSULE',
      title: 'Handcrafted Festive Silhouettes',
      subtitle: 'Pure silks and artisanal threadwork',
      cta: 'Explore Women →',
      subCategory: 'Dresses',
    },
  },
  {
    id: 'bags',
    label: 'Bags',
    view: 'bags',
    hasMegaMenu: true,
    megaColumns: [
      {
        heading: 'Women Bags',
        items: [
          { label: 'All Designer Handbags' },
          { label: 'Top-Handle Handbags', subCategory: 'Handbags' },
          { label: 'Shoulder Bags', subCategory: 'Shoulder Bags' },
          { label: 'Crossbody Sling Bags', subCategory: 'Sling Bags' },
          { label: 'Quilted Clutches', subCategory: 'Clutches' },
          { label: 'Spacious Totes', subCategory: 'Totes' },
        ],
      },
      {
        heading: 'Men Bags & Travel',
        items: [
          { label: 'Men Leather Bags' },
          { label: 'Executive Briefcases', subCategory: 'Briefcases' },
          { label: 'Urban Backpacks', subCategory: 'Backpacks' },
          { label: 'Weekender Travel Bags', subCategory: 'Travel Bags' },
        ],
      },
      {
        heading: 'Small Leather Goods',
        items: [
          { label: 'Bi-Fold Wallets', subCategory: 'Wallets' },
          { label: 'Slim Cardholders', subCategory: 'Wallets' },
          { label: 'Passport Cases', subCategory: 'Wallets' },
          { label: 'Zippered Pouches', subCategory: 'Clutches' },
        ],
      },
    ],
    featuredCard: {
      image: '/images/cat_bag_cream.jpg',
      kicker: 'LEATHER ATELIER',
      title: 'Full-Grain Calfskin Totes',
      subtitle: 'Constructed by master leather smiths',
      cta: 'Shop All Bags →',
      subCategory: 'Totes',
    },
  },
  {
    id: 'footwear',
    label: 'Footwear',
    view: 'footwear',
    hasMegaMenu: true,
    megaColumns: [
      {
        heading: "Men's Footwear",
        items: [
          { label: 'All Men Footwear' },
          { label: 'Minimalist Sneakers', subCategory: 'Sneakers' },
          { label: 'Formal Oxford Brogues', subCategory: 'Formal Shoes' },
          { label: 'Goodyear Welted Loafers', subCategory: 'Loafers' },
          { label: 'Leather Casual Sandals', subCategory: 'Sandals' },
        ],
      },
      {
        heading: "Women's Footwear",
        items: [
          { label: 'All Women Footwear' },
          { label: 'Stiletto & Block Heels', subCategory: 'Heels' },
          { label: 'Embellished Evening Sandals', subCategory: 'Sandals' },
          { label: 'Ballet & Pointed Flats', subCategory: 'Flats' },
          { label: 'White Leather Trainers', subCategory: 'Sneakers' },
        ],
      },
      {
        heading: 'Craftsmanship & Fit',
        items: [
          { label: 'Italian Nappa Leather' },
          { label: 'Ergonomic Arch Cushioning' },
          { label: 'Blake-Stitched Soles' },
          { label: 'Breathable Leather Linings' },
        ],
      },
    ],
    featuredCard: {
      image: '/images/cat_shoes_white.jpg',
      kicker: 'CONTEMPORARY STRIDE',
      title: 'Pristine White Court Trainers',
      subtitle: 'Supple Italian leather with Margom soles',
      cta: 'Explore Footwear →',
      subCategory: 'Sneakers',
    },
  },
  {
    id: 'accessories',
    label: 'Accessories',
    view: 'accessories',
    hasMegaMenu: true,
    megaColumns: [
      {
        heading: 'Timepieces',
        items: [
          { label: 'All Luxury Watches' },
          { label: 'Automatic Chronographs', subCategory: 'Watches and Accessories' },
          { label: '18k Gold PVD Dress Watches', subCategory: 'Watches and Accessories' },
          { label: 'Sapphire Crystal Editions', subCategory: 'Watches and Accessories' },
        ],
      },
      {
        heading: 'Parfums & Sillage',
        items: [
          { label: 'All Royal Fragrances' },
          { label: 'Imperial Oud Extrait de Parfum', subCategory: 'Watches and Accessories' },
          { label: 'Amber Bourbon & Vanilla', subCategory: 'Watches and Accessories' },
        ],
      },
      {
        heading: 'Fine Accessories',
        items: [
          { label: 'Reversible Leather Belts', subCategory: 'Belts' },
          { label: 'Polarized Aviator Sunglasses', subCategory: 'Watches and Accessories' },
          { label: 'Cufflinks & Pocket Squares', subCategory: 'Accessories' },
        ],
      },
    ],
    featuredCard: {
      image: '/images/cat_watch_gold.jpg',
      kicker: 'HAUTE HOROLOGY',
      title: 'Precision Gold Chronographs',
      subtitle: 'Japanese automatic movements',
      cta: 'Discover Accessories →',
      subCategory: 'Watches and Accessories',
    },
  },
  {
    id: 'collections',
    label: 'Collections',
    view: 'collections',
    hasMegaMenu: true,
    megaColumns: [
      {
        heading: 'Curated Seasonal Edits',
        items: [
          { label: 'The Festive Couture Edit', subCategory: 'Festive' },
          { label: 'Royal Wedding & Gala Atelier', subCategory: 'Occasion' },
          { label: 'Summer Linen & Silk Capsule', subCategory: 'Shirts' },
          { label: 'Monochrome Sartorial Tailoring', subCategory: 'Shirts' },
        ],
      },
      {
        heading: 'Signature Lines',
        items: [
          { label: 'Lap of Luxury Gold Standard' },
          { label: 'Heritage Weaves & Banarasi' },
          { label: 'Contemporary Street Tailoring' },
        ],
      },
    ],
    featuredCard: {
      image: '/images/festive_edit_luxury_1791098550195.jpg',
      kicker: 'LIMITED EDIT',
      title: 'The Festive & Wedding Atelier',
      subtitle: 'Exclusive occasion masterpieces',
      cta: 'View Collections →',
      subCategory: 'Festive',
    },
  },
  {
    id: 'bestsellers',
    label: 'Bestsellers',
    view: 'bestsellers',
    badge: 'POPULAR',
    badgeColor: 'bg-[#111113] text-[#D4AF37] border border-[#D4AF37]/50',
  },
  {
    id: 'sale',
    label: 'Sale',
    view: 'sale',
    badge: 'OFFERS',
    badgeColor: 'bg-red-700 text-white font-bold',
  },
];

export const LuxuryMegaNav: React.FC = () => {
  const { currentView, setCurrentView, selectedSubcategory } = useStore();
  const navigate = useNavigate();
  const [activeHoverId, setActiveHoverId] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (id: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setActiveHoverId(id);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveHoverId(null);
    }, 180);
  };

  const handleTabClick = (tab: NavTabConfig) => {
    setActiveHoverId(null);
    setCurrentView(tab.view);
    const targetPath = tab.view === 'home' ? '/' : `/${tab.view}`;
    navigate(targetPath);
  };

  const handleSubCategoryClick = (view: string, subCategory?: string) => {
    setActiveHoverId(null);
    setCurrentView(view, subCategory);
    if (subCategory) {
      navigate(`/category/${view}/${encodeURIComponent(subCategory)}`);
    } else {
      navigate(`/${view}`);
    }
  };

  return (
    <div
      className="hidden md:block relative bg-white border-b border-[#E8DEC8] z-30 select-none shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
      onMouseLeave={handleMouseLeave}
    >
      <div className="max-w-[1540px] mx-auto px-4 lg:px-8">
        <ul className="flex items-center justify-between text-[11px] lg:text-xs font-semibold tracking-[0.14em] uppercase text-[#111113]">
          {NAV_TABS.map((tab) => {
            const isActive =
              currentView === tab.view ||
              (tab.view === 'home' && (!currentView || currentView === 'home'));

            return (
              <li
                key={tab.id}
                className="relative py-3.5 group"
                onMouseEnter={() => handleMouseEnter(tab.id)}
              >
                <button
                  type="button"
                  onClick={() => handleTabClick(tab)}
                  className={`flex items-center gap-1.5 transition-colors cursor-pointer py-1 relative ${
                    isActive
                      ? 'text-[#B8860B] font-bold'
                      : 'text-[#1F1E22] hover:text-[#B8860B]'
                  } ${tab.id === 'sale' ? 'text-red-700 font-bold' : ''}`}
                >
                  <span>{tab.label}</span>
                  {tab.hasMegaMenu && (
                    <ChevronDown
                      className={`w-3 h-3 transition-transform duration-200 ${
                        activeHoverId === tab.id ? 'rotate-180 text-[#B8860B]' : 'text-[#8C8274]'
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

                {/* MEGA MENU DROPDOWN PANEL */}
                {tab.hasMegaMenu && activeHoverId === tab.id && tab.megaColumns && (
                  <div
                    className="absolute top-full left-1/2 -translate-x-1/2 w-[92vw] max-w-[1240px] bg-white border border-[#E8DEC8] shadow-2xl rounded-b-2xl p-6 lg:p-8 animate-in fade-in slide-in-from-top-2 duration-200 z-50 cursor-default"
                    onMouseEnter={() => handleMouseEnter(tab.id)}
                  >
                    <div className="grid grid-cols-12 gap-6 lg:gap-8">
                      {/* Subcategory Columns */}
                      <div className="col-span-8 lg:col-span-9 grid grid-cols-3 gap-6">
                        {tab.megaColumns.map((col, idx) => (
                          <div key={idx} className="space-y-3">
                            <h4 className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#8A671A] border-b border-[#F0EAE1] pb-2">
                              {col.heading}
                            </h4>
                            <ul className="space-y-2 text-xs normal-case font-normal text-[#3D3327]">
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
                                      onClick={() =>
                                        handleSubCategoryClick(tab.view, item.subCategory)
                                      }
                                      className={`text-left w-full hover:text-[#B8860B] hover:translate-x-1 transition-all cursor-pointer flex items-center justify-between group/item ${
                                        isSubActive
                                          ? 'text-[#B8860B] font-semibold'
                                          : 'text-[#4A4033]'
                                      }`}
                                    >
                                      <span>{item.label}</span>
                                      <ArrowRight className="w-2.5 h-2.5 opacity-0 group-hover/item:opacity-100 -translate-x-1 group-hover/item:translate-x-0 transition-all text-[#B8860B]" />
                                    </button>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        ))}
                      </div>

                      {/* Editorial Highlight Card */}
                      {tab.featuredCard && (
                        <div className="col-span-4 lg:col-span-3 border-l border-[#F0EAE1] pl-6 lg:pl-8 flex flex-col justify-between">
                          <div
                            onClick={() =>
                              handleSubCategoryClick(
                                tab.view,
                                tab.featuredCard?.subCategory
                              )
                            }
                            className="group/card cursor-pointer space-y-3"
                          >
                            <div className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-md">
                              <img
                                src={tab.featuredCard.image}
                                alt={tab.featuredCard.title}
                                className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                              <div className="absolute bottom-3 left-3 right-3 text-white">
                                <span className="text-[9px] font-bold tracking-[0.2em] text-[#D4AF37] uppercase block mb-1">
                                  {tab.featuredCard.kicker}
                                </span>
                                <h5 className="font-serif text-sm font-bold leading-tight">
                                  {tab.featuredCard.title}
                                </h5>
                                <p className="text-[10px] text-gray-300 mt-1 line-clamp-1">
                                  {tab.featuredCard.subtitle}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              className="text-xs font-bold uppercase tracking-wider text-[#111113] group-hover/card:text-[#B8860B] flex items-center gap-1 transition-colors"
                            >
                              <span>{tab.featuredCard.cta}</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

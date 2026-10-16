import React, { useState, useRef } from 'react';
import {
  Search,
  ShoppingBag,
  Heart,
  X,
  Menu,
  ChevronDown,
  ChevronRight,
  Phone,
  Package,
  Truck,
  Sparkles,
} from 'lucide-react';

import { useStore } from '../context/StoreContext';
import { UploadedLogoMark } from './UploadedLogoMark';
import {
  normalizeImageUrl,
  FALLBACK_LUXURY_IMAGE,
} from '../utils/imageUtils';

export interface HeaderProps {
  onOpenWishlist?: () => void;
  onOpenAboutUs?: () => void;
  onOpenContactUs?: () => void;
}

const MOBILE_DEPARTMENTS = [
  { id: 'home', label: 'Home', view: 'home' },
  {
    id: 'men',
    label: "Men's Fashion",
    view: 'men',
    subcategories: [
      { label: 'All Men Fashion', sub: '' },
      { label: 'Shirts', sub: 'Shirts' },
      { label: 'Trousers & Chinos', sub: 'Trousers' },
      { label: 'Jeans & Denim', sub: 'Jeans' },
      { label: 'Blazers & Tuxedos', sub: 'Blazers' },
      { label: 'Kurta Sets & Ethnic Wear', sub: 'Kurta Sets' },
      { label: 'Luxury Sneakers & Shoes', sub: 'Sneakers' },
      { label: 'Leather Loafers & Formal', sub: 'Loafers' },
      { label: 'Watches & Accessories', sub: 'Watches and Accessories' },
      { label: 'Belts & Wallets', sub: 'Belts' },
    ],
  },
  {
    id: 'women',
    label: "Women's Fashion",
    view: 'women',
    subcategories: [
      { label: 'All Women Fashion', sub: '' },
      { label: 'Banarasi Sarees', sub: 'Sarees' },
      { label: 'Designer Lehengas', sub: 'Lehengas' },
      { label: 'Evening Dresses & Gowns', sub: 'Dresses' },
      { label: 'Silk Tops & Blouses', sub: 'Tops and Shirts' },
      { label: 'Co-ord Sets', sub: 'Co-ord Sets' },
      { label: 'Handbags & Totes', sub: 'Handbags' },
      { label: 'Evening Clutches', sub: 'Clutches' },
      { label: 'Stiletto Heels & Flats', sub: 'Heels' },
    ],
  },
  {
    id: 'bags',
    label: 'Bags & Leathercraft',
    view: 'bags',
    subcategories: [
      { label: 'All Bags', sub: '' },
      { label: 'Top-Handle Handbags', sub: 'Handbags' },
      { label: 'Shoulder Bags', sub: 'Shoulder Bags' },
      { label: 'Sling Bags & Crossbody', sub: 'Sling Bags' },
      { label: 'Evening Clutches', sub: 'Clutches' },
      { label: 'Leather Totes', sub: 'Totes' },
      { label: 'Wallets & Small Leather Goods', sub: 'Wallets' },
      { label: 'Travel Duffles & Briefcases', sub: 'Travel Bags' },
    ],
  },
  {
    id: 'footwear',
    label: 'Footwear Collection',
    view: 'footwear',
    subcategories: [
      { label: 'All Footwear', sub: '' },
      { label: 'Luxury Sneakers', sub: 'Sneakers' },
      { label: 'Formal Shoes & Oxfords', sub: 'Formal Shoes' },
      { label: 'Handcrafted Loafers', sub: 'Loafers' },
      { label: 'Heels & Occasion Shoes', sub: 'Heels' },
      { label: 'Pointed Flats & Sandals', sub: 'Flats' },
    ],
  },
  {
    id: 'accessories',
    label: 'Accessories & Fragrances',
    view: 'accessories',
    subcategories: [
      { label: 'All Accessories', sub: '' },
      { label: 'Gold Chronographs & Watches', sub: 'Watches and Accessories' },
      { label: 'Royal Amber Oud & Parfums', sub: 'Watches and Accessories' },
      { label: 'Aviator Sunglasses', sub: 'Watches and Accessories' },
      { label: 'Reversible Leather Belts', sub: 'Belts' },
    ],
  },
];

export const Header: React.FC<HeaderProps> = ({
  onOpenWishlist,
  onOpenAboutUs,
  onOpenContactUs,
}) => {
  const {
    searchQuery,
    setSearchQuery,
    cartCount,
    setIsCartOpen,
    products,
    openProductDetail,
    currentView,
    setCurrentView,
    wishlist,
    setIsAdminMode,
  } = useStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobileDept, setExpandedMobileDept] = useState<string | null>(
    null
  );

  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleHomeClick = () => {
    setCurrentView('home');
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMobileNav = (view: string, subCategory?: string) => {
    setCurrentView(view, subCategory || null);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter products for live search.
  const searchResults = searchQuery.trim()
    ? products
        .filter(
          (product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            product.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            product.tags?.some((tag) =>
              tag.toLowerCase().includes(searchQuery.toLowerCase())
            )
        )
        .slice(0, 6)
    : [];

  return (
    <>
      <header className="bg-white border-b border-[#E8DEC8]/80 sticky top-0 z-40 backdrop-blur-md shadow-[0_2px_15px_rgba(184,134,11,0.06)] rounded-t-[16px] sm:rounded-t-[28px]">
        <div className="max-w-[1540px] mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-3 sm:gap-6 min-h-[74px] sm:min-h-[82px]">
          {/* Mobile Menu Hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-9 h-9 rounded-full border border-[#E8DEC8] flex items-center justify-center text-[#111113] hover:text-[#B8860B] hover:bg-[#FAF8F5] transition-colors cursor-pointer shrink-0"
              aria-label={
                isMobileMenuOpen ? 'Close Menu' : 'Open Navigation Menu'
              }
              title="Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Brand Logo and Title */}
          <div
            onClick={handleHomeClick}
            className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer select-none shrink-0"
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                handleHomeClick();
              }
            }}
            title="LAP OF LUXURY - Official Store"
          >
            <div className="w-12 h-12 sm:w-15 sm:h-15 md:w-16 md:h-16 shrink-0 aspect-square flex items-center justify-center">
              <UploadedLogoMark
                className="w-full h-full"
                color="#111113"
              />
            </div>

            <div className="flex flex-col text-left justify-center">
              <span className="font-serif tracking-[0.16em] font-normal uppercase text-base sm:text-xl md:text-2xl text-[#111113] leading-none whitespace-nowrap">
                LAP OF LUXURY
              </span>
              <span className="font-sans font-normal tracking-[0.12em] text-[8.5px] xs:text-[9.5px] sm:text-[11px] text-[#554D42] uppercase whitespace-nowrap mt-1">
                Experience Premium In Every Touch
              </span>
            </div>
          </div>

          {/* Desktop and Tablet Search */}
          <div className="hidden lg:flex flex-1 max-w-md mx-4 relative">
            <div className="w-full relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() =>
                  setTimeout(() => setIsSearchFocused(false), 250)
                }
                placeholder="Search by product, category, or style..."
                className="w-full bg-[#FAF8F5] border border-[#E0D5C3] hover:border-[#B8860B] focus:border-[#B8860B] rounded-full py-2 pl-10 pr-4 text-xs text-[#111113] placeholder:text-[#8C8274] focus:outline-none transition-all shadow-inner"
              />

              <Search className="w-4 h-4 text-[#8C8274] absolute left-3.5 pointer-events-none" />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-gray-400 hover:text-black cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Live Search Results */}
            {isSearchFocused && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-[#D4AF37]/30 py-3 z-50 animate-in fade-in max-h-96 overflow-y-auto">
                <div className="px-4 py-1 text-[10px] font-bold text-[#8A671A] uppercase tracking-wider border-b border-gray-100 flex items-center justify-between">
                  <span>Product Suggestions</span>
                  <span className="text-[#8C8274] font-normal">
                    {searchResults.length} matches
                  </span>
                </div>

                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    onMouseDown={() => {
                      openProductDetail(product);
                      setSearchQuery('');
                    }}
                    className="px-4 py-2.5 hover:bg-[#FAF6EE] flex items-center gap-3 cursor-pointer transition-colors"
                  >
                    <img
                      src={normalizeImageUrl(
                        product.image,
                        product.category
                      )}
                      alt={product.name}
                      onError={(event) => {
                        const target = event.target as HTMLImageElement;
                        target.src = FALLBACK_LUXURY_IMAGE;
                      }}
                      className="w-10 h-10 object-cover rounded-lg border border-gray-200"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#111113] truncate">
                        {product.name}
                      </p>
                      <p className="text-[10px] text-[#7A6C58]">
                        {product.category} ·{' '}
                        <span className="font-bold text-[#111113]">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Actions: Search, Wishlist and Shopping Bag */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3.5 justify-end shrink-0">
            {/* Mobile and Tablet Search */}
            <div className="lg:hidden relative">
              {isSearchOpen ? (
                <div className="flex items-center bg-[#FAF8F5] border border-[#B8860B] rounded-full px-2.5 py-1 shadow-inner animate-in fade-in duration-200">
                  <input
                    ref={searchInputRef}
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search..."
                    className="w-28 xs:w-36 text-xs bg-transparent focus:outline-none text-[#111113]"
                    aria-label="Search products"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="text-gray-400 hover:text-black ml-1 cursor-pointer"
                    aria-label="Close search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[#2A241E] hover:text-[#B8860B] hover:bg-[#FAF6EE] transition-all cursor-pointer"
                  aria-label="Search Collection"
                  title="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              type="button"
              onClick={() => {
                if (onOpenWishlist) {
                  onOpenWishlist();
                } else {
                  window.location.href = '/wishlist';
                }
              }}
              className="relative p-1.5 sm:px-2.5 sm:py-1.5 rounded-full hover:bg-[#FAF6EE] text-[#111113] hover:text-[#B8860B] transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1.5"
              aria-label="Wishlist"
              title="My Wishlist"
            >
              <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              <span className="hidden xl:inline text-[11px] uppercase tracking-wider">
                Wishlist
              </span>

              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 sm:static sm:top-auto sm:right-auto bg-[#B8860B] text-white text-[9.5px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Bag Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative bg-[#111113] hover:bg-[#28282D] text-white px-3 sm:px-4 py-2 rounded-full transition-all cursor-pointer shadow-sm flex items-center gap-2 active:scale-95"
              aria-label="Shopping Bag"
              title="View Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-xs font-bold tracking-wider">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Expandable Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex animate-in fade-in duration-200">
          <div className="w-[84%] max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-300">
            {/* Mobile Menu Header */}
            <div>
              <div className="p-4 border-b border-[#E8DEC8] flex items-center justify-between bg-[#FAF8F5]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8">
                    <UploadedLogoMark
                      className="w-full h-full"
                      color="#111113"
                    />
                  </div>

                  <span className="font-serif font-bold text-sm tracking-wider uppercase text-[#111113]">
                    LAP OF LUXURY
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-black cursor-pointer"
                  aria-label="Close navigation menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Department Navigation */}
              <div className="py-2 divide-y divide-gray-100">
                {MOBILE_DEPARTMENTS.map((department) => {
                  const isExpanded =
                    expandedMobileDept === department.id;
                  const isActive = currentView === department.view;

                  return (
                    <div key={department.id} className="px-2">
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() =>
                            handleMobileNav(department.view)
                          }
                          className={`flex-1 py-3 px-3 text-left text-xs font-bold tracking-wider uppercase flex items-center gap-2 cursor-pointer ${
                            isActive
                              ? 'text-[#B8860B]'
                              : 'text-[#1F1E22] hover:text-[#B8860B]'
                          }`}
                        >
                          <span>{department.label}</span>
                        </button>

                        {department.subcategories && (
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedMobileDept(
                                isExpanded ? null : department.id
                              )
                            }
                            className="p-2 text-gray-400 hover:text-black cursor-pointer"
                            aria-label={`Toggle ${department.label} subcategories`}
                          >
                            <ChevronDown
                              className={`w-4 h-4 transition-transform ${
                                isExpanded
                                  ? 'rotate-180 text-[#B8860B]'
                                  : ''
                              }`}
                            />
                          </button>
                        )}
                      </div>

                      {/* Subcategory Accordion */}
                      {department.subcategories && isExpanded && (
                        <div className="bg-[#FAF8F5] rounded-xl p-2.5 mb-2 space-y-1 pl-4">
                          {department.subcategories.map(
                            (subcategory, index) => (
                              <button
                                key={`${department.id}-${index}`}
                                type="button"
                                onClick={() =>
                                  handleMobileNav(
                                    department.view,
                                    subcategory.sub
                                  )
                                }
                                className="w-full py-1.5 text-left text-[11px] text-[#4A4033] hover:text-[#B8860B] flex items-center justify-between cursor-pointer"
                              >
                                <span>{subcategory.label}</span>
                                <ChevronRight className="w-3 h-3 text-gray-300" />
                              </button>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile Menu Footer */}
            <div className="p-4 border-t border-[#E8DEC8] bg-[#FAF8F5] space-y-3">
              <div className="text-xs space-y-1">
                <p className="text-[#111113]">
                  Mahbubnagar Flagship Store
                </p>
                <p className="text-[11px] text-[#7A6C58]">
                  D/6, Kota Complex, Telangana Chowrasta, 509001
                </p>
                <p className="text-[11px] text-[#7A6C58]">
                  Phone: +91 75 7888 7888 (9:30 AM–10:00 PM)
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);

                    if (onOpenAboutUs) {
                      onOpenAboutUs();
                    } else {
                      window.location.href = '/about-us';
                    }
                  }}
                  className="text-[11px] font-semibold text-[#111113] hover:text-[#B8860B] uppercase tracking-wider"
                >
                  Our Story
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsAdminMode(true);
                  }}
                  className="text-[11px] font-semibold text-[#8A671A] hover:underline uppercase tracking-wider"
                >
                  Admin Login
                </button>
              </div>
            </div>
          </div>

          {/* Close drawer when backdrop is clicked */}
          <div
            className="flex-1"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
        </div>
      )}
    </>
  );
};
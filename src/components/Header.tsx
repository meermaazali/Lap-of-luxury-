import React, { useState } from 'react';
import {
  Search,
  ShoppingCart,
  X,
  BookOpen,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { UploadedLogoMark } from './UploadedLogoMark';
import { normalizeImageUrl, FALLBACK_LUXURY_IMAGE } from '../utils/imageUtils';

interface HeaderProps {
  onOpenAccountModal: () => void;
  onOpenWishlist: () => void;
  onOpenStoryModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAccountModal,
  onOpenWishlist,
  onOpenStoryModal,
}) => {
  const {
    searchQuery,
    setSearchQuery,
    cartCount,
    setIsCartOpen,
    wishlist,
    products,
    openProductDetail,
  } = useStore();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // Filter products for quick search dropdown
  const searchResults = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  return (
    <header className="bg-[#FAF8F5] border-b-2 border-[#D4AF37]/50 sticky top-0 z-40 backdrop-blur-md bg-opacity-95 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-6">
        {/* Left: Search Bar & Compact Cart Icon Symbol Directly Below Search */}
        <div className="relative flex-1 max-w-[180px] sm:max-w-[220px] md:max-w-[260px] flex flex-col gap-1.5">
          {/* Desktop Search Bar */}
          <div className="relative flex items-center hidden sm:flex">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search shirts, jeans, watches..."
              className="w-full pl-3.5 pr-8 py-1.5 text-xs bg-white border border-[#D4AF37]/60 rounded-full focus:outline-none focus:border-[#B89758] focus:ring-1 focus:ring-[#B89758] text-[#1E1E22] placeholder:text-[#9E9484] shadow-2xs transition-all"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-[#8A7F70] hover:text-[#1E1E22] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <Search className="w-4 h-4 text-[#B89758] absolute right-3 pointer-events-none" />
            )}
          </div>

          {/* Cart Icon Symbol Only (Small & Clean under search on Desktop) */}
          <div className="hidden sm:flex items-center">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full border border-[#D4AF37] bg-white hover:bg-[#FAF6EE] shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center justify-center shrink-0 active:scale-95 group"
              title={`Shopping Cart (${cartCount} items)`}
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4 text-[#B89758] group-hover:text-[#111111] transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#111111] text-[#D4AF37] border border-[#D4AF37] text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile search toggle + Mobile cart icon symbol only */}
          <div className="sm:hidden flex items-center gap-2">
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="p-1.5 text-[#1E1E22] hover:text-[#B89758] cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-[#B89758]" />
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full border border-[#D4AF37] bg-white text-[#111111] cursor-pointer shadow-2xs active:scale-95 flex items-center justify-center"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4 text-[#B89758]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#111111] text-[#D4AF37] border border-[#D4AF37] text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Quick Search Preview dropdown */}
          {isSearchFocused && searchResults.length > 0 && (
            <div
              className="absolute left-0 right-0 top-full mt-1 bg-white border-2 border-[#D4AF37]/60 rounded-xl shadow-xl overflow-hidden z-50 divide-y divide-[#F2EBDC]"
              onMouseDown={(e) => e.preventDefault()}
            >
              <div className="px-3 py-2 bg-[#FBF9F5] text-[10px] font-bold tracking-wider uppercase text-[#8C6D1F] flex justify-between items-center">
                <span>Matching Items</span>
                <span>{searchResults.length} Results</span>
              </div>
              {searchResults.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    openProductDetail(item);
                    setIsSearchFocused(false);
                  }}
                  className="flex items-center gap-3 p-2.5 hover:bg-[#FAF6EE] cursor-pointer transition-colors"
                >
                  <img
                    src={normalizeImageUrl(item.image, item.category)}
                    alt={item.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = FALLBACK_LUXURY_IMAGE;
                    }}
                    className="w-10 h-10 object-cover rounded bg-[#F2EFE9]"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#1E1E22] truncate">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-[#7A6C58]">
                      {item.category} · ₹{item.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <span className="text-[11px] text-[#B89758] font-bold whitespace-nowrap">
                    View →
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Center: Brand Identity Logo (Enlarged) and Non-Clipping Typography */}
        <div className="flex flex-col items-center select-none text-center flex-shrink-0 px-2 overflow-visible">
          <div
            className="flex items-center gap-3 sm:gap-4 cursor-pointer overflow-visible"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            {/* Enlarged Logo Mark */}
            <UploadedLogoMark
              className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 shrink-0 transition-transform duration-300 drop-shadow-xs"
              color="#111111"
            />
            {/* Brand Title with extra padding so 'Y' is never cut off */}
            <span className="font-bodoni tracking-[0.12em] sm:tracking-[0.16em] md:tracking-[0.18em] font-black uppercase leading-none text-xl sm:text-2xl md:text-3.5xl lg:text-4xl text-[#111111] px-2.5 inline-block whitespace-nowrap overflow-visible">
              LAP OF LUXURY
            </span>
          </div>

          {/* Golden Divider Line */}
          <div className="flex items-center justify-center w-full max-w-[280px] sm:max-w-[360px] gap-2.5 my-1 overflow-visible">
            <span className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-[#C5A880] to-[#C5A880]" />
            <span className="w-1.5 h-1.5 rotate-45 bg-[#B89758] shrink-0" />
            <span className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent via-[#C5A880] to-[#C5A880]" />
          </div>

          {/* Tagline: Full Visibility with padding so never cut off */}
          <div className="mt-0.5 max-w-full overflow-visible">
            <p className="font-bodoni italic tracking-[0.12em] sm:tracking-[0.16em] text-[10px] sm:text-xs md:text-[13px] uppercase font-semibold text-[#8A671A] px-2 text-center whitespace-normal sm:whitespace-nowrap overflow-visible leading-tight">
              Experience premium in every touch
            </p>
          </div>
        </div>

        {/* Right: Our Story, Wishlist & Track Order links */}
        <div className="flex items-center gap-2 sm:gap-3.5 flex-1 justify-end">
          {/* Our Story / About Us Link */}
          {onOpenStoryModal && (
            <button
              onClick={onOpenStoryModal}
              className="hidden lg:flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#3B332A] hover:text-[#B89758] transition-colors cursor-pointer px-2 py-1 rounded-md border border-transparent hover:border-[#D5C7B0]"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#B89758]" />
              <span>Our Story</span>
            </button>
          )}

          {/* Wishlist text link */}
          <button
            onClick={onOpenWishlist}
            className="hidden sm:flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#3B332A] hover:text-[#B89758] transition-colors cursor-pointer"
          >
            <span>Wishlist</span>
            {wishlist.length > 0 && (
              <span className="bg-[#B89758] text-white text-[10px] font-bold px-1.5 rounded-full">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Track Order text link */}
          <button
            onClick={onOpenAccountModal}
            className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#3B332A] hover:text-[#B89758] transition-colors cursor-pointer px-2.5 py-1 rounded-md border border-[#D4AF37]/50 hover:border-[#D4AF37]"
          >
            Track Order
          </button>
        </div>
      </div>

      {/* Mobile Search Expandable Bar */}
      {isMobileSearchOpen && (
        <div className="sm:hidden px-4 pb-3 pt-1 border-t border-[#EAE0CD]">
          <div className="relative flex items-center">
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search shirts, jeans, watches..."
              className="w-full pl-3.5 pr-8 py-2 text-xs bg-white border border-[#D4AF37] rounded-full focus:outline-none focus:border-[#B89758] text-[#1E1E22]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-[#8A7F70]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

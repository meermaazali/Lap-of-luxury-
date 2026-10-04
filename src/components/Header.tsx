import React, { useState } from 'react';
import { Search, X, ShoppingCart } from 'lucide-react';
import { UploadedLogoMark } from './UploadedLogoMark';
import { useStore } from '../context/StoreContext';

interface HeaderProps {
  onOpenAccountModal?: () => void;
  onOpenWishlist?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAccountModal,
  onOpenWishlist,
}) => {
  const {
    searchQuery,
    setSearchQuery,
    cart,
    cartCount,
    cartTotal,
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
    <header className="bg-[#FAF8F5] border-b border-[#E0D3BC] sticky top-0 z-40 backdrop-blur-md bg-opacity-95 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-3 sm:gap-6">
        {/* Left: Search input on desktop / search toggle on mobile */}
        <div className="relative flex-1 max-w-[200px] sm:max-w-[240px] md:max-w-[280px]">
          <div className="relative flex items-center hidden sm:flex">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search shirts, jeans, watches..."
              className="w-full pl-3.5 pr-8 py-1.5 md:py-2 text-xs md:text-sm bg-white border border-[#D5C7B0] rounded-full focus:outline-none focus:border-[#B89758] focus:ring-1 focus:ring-[#B89758] text-[#1E1E22] placeholder:text-[#9E9484] shadow-xs transition-all"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-[#8A7F70] hover:text-[#1E1E22] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <Search className="w-4 h-4 text-[#8A7F70] absolute right-3 pointer-events-none" />
            )}
          </div>

          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="p-1.5 text-[#1E1E22] hover:text-[#B89758] cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Search Preview dropdown */}
          {isSearchFocused && searchResults.length > 0 && (
            <div
              className="absolute left-0 right-0 mt-2 bg-white border border-[#B89758]/50 rounded-xl shadow-xl overflow-hidden z-50 divide-y divide-[#F2EBDC]"
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
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 object-cover rounded bg-[#F2EFE9]"
                    referrerPolicy="no-referrer"
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

        {/* Center: Brand Identity Logo WITH CART BUTTON BESIDE TAGLINE */}
        <div className="flex flex-col items-center select-none text-center flex-shrink-0">
          <div
            className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <UploadedLogoMark
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 shrink-0 transition-transform duration-300"
              color="#111111"
            />
            <span className="font-bodoni tracking-[0.20em] font-black uppercase leading-none text-2xl sm:text-3xl md:text-4xl text-[#111111]">
              LAP OF LUXURY
            </span>
          </div>

          {/* Golden Divider Line */}
          <div className="flex items-center justify-center w-full max-w-[280px] sm:max-w-[340px] gap-2.5 my-1">
            <span className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-[#C5A880] to-[#C5A880]" />
            <span className="w-1.5 h-1.5 rotate-45 bg-[#B89758] shrink-0" />
            <span className="h-[1.5px] flex-1 bg-gradient-l from-transparent via-[#C5A880] to-[#C5A880]" />
          </div>

          {/* Tagline ROW with Cart Button Positioned Directly Beside It */}
          <div className="flex items-center justify-center gap-2.5 sm:gap-3.5 flex-wrap">
            <p className="font-bodoni italic tracking-[0.18em] text-[11px] sm:text-xs md:text-[13px] uppercase font-semibold text-[#8A671A]">
              Experience premium in every touch
            </p>

            {/* Cart Button Kept Right Beside Tagline */}
            <button
              onClick={() => setIsCartOpen(true)}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full border transition-all cursor-pointer shadow-xs active:scale-95 ${
                cartCount > 0
                  ? 'bg-[#111111] text-[#F3E7D5] border-[#B89758] hover:bg-[#2A2A2E]'
                  : 'bg-white text-[#3B332A] border-[#D5C7B0] hover:border-[#B89758]'
              }`}
              title="Shopping Cart"
            >
              {/* Stacked Thumbnails if items exist */}
              {cart.length > 0 ? (
                <div className="flex -space-x-1.5 overflow-hidden">
                  {cart.slice(0, 2).map((item, idx) => (
                    <img
                      key={idx}
                      src={item.product.image}
                      alt={item.product.name}
                      className="inline-block h-4 w-4 sm:h-5 sm:w-5 rounded-full ring-1 ring-white object-cover bg-white"
                    />
                  ))}
                </div>
              ) : (
                <ShoppingCart className="w-3.5 h-3.5 text-[#B89758]" />
              )}

              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                Cart ({cartCount})
              </span>

              {cartCount > 0 && (
                <span className="text-[10px] sm:text-xs text-[#E5C07B] font-extrabold tabular-nums">
                  ₹{cartTotal.toLocaleString('en-IN')}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Right: Wishlist & Track Order links */}
        <div className="flex items-center gap-2.5 sm:gap-4 flex-1 justify-end">
          {/* Wishlist text link */}
          <button
            onClick={onOpenWishlist}
            className="hidden md:flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#3B332A] hover:text-[#B89758] transition-colors cursor-pointer"
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
            className="text-xs font-semibold uppercase tracking-wider text-[#3B332A] hover:text-[#B89758] transition-colors cursor-pointer px-2.5 py-1 rounded-md border border-transparent hover:border-[#D5C7B0]"
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
              placeholder="Search premium shirts, jeans, watches..."
              className="w-full pl-3.5 pr-8 py-2 text-xs bg-white border border-[#B89758] rounded-full focus:outline-none text-[#1E1E22]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-gray-500"
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

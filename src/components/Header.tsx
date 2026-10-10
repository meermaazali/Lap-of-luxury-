import React, { useState } from 'react';
import {
  Search,
  ShoppingBag,
  User,
  X,
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
    products,
    openProductDetail,
    setSelectedCategory,
  } = useStore();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

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
    <header className="bg-white/95 border-b border-[#E8DEC8]/80 sticky top-0 z-40 backdrop-blur-md transition-all shadow-[0_2px_15px_rgba(184,134,11,0.06)] rounded-t-[16px] sm:rounded-t-[28px]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8 py-2.5 sm:py-4 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand Identity Logo + Title + Tagline (Full text, completely visible, never cut off) */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 sm:gap-3.5 cursor-pointer select-none group shrink-0"
        >
          <UploadedLogoMark
            className="w-8 h-8 sm:w-11 sm:h-11 md:w-13 md:h-13 shrink-0 transition-transform duration-300 group-hover:scale-105"
            color="#111113"
          />
          <div className="flex flex-col text-left">
            <span className="font-bodoni tracking-[0.1em] sm:tracking-[0.16em] font-bold uppercase text-[13px] sm:text-lg md:text-2xl text-[#111113] leading-tight whitespace-nowrap">
              LAP OF LUXURY
            </span>
            <span className="font-sans font-bold tracking-[0.05em] sm:tracking-[0.12em] md:tracking-[0.16em] text-[8px] xs:text-[9.5px] sm:text-[10px] md:text-[11px] text-[#1A1816] uppercase mt-0.5 whitespace-nowrap">
              Experience Premium In Every Touch
            </span>
          </div>
        </div>

        {/* Center: Classic Luxury Navigation Links (Home, Shop, Categories, About, Contact - Desktop & TV) */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold tracking-[0.14em] uppercase">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-[#B8860B] font-bold hover:text-[#967018] transition-colors cursor-pointer relative py-1"
          >
            <span>Home</span>
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#B8860B] rounded-full" />
          </button>
          <button
            onClick={() => scrollToSection('catalog-section')}
            className="text-[#18181A] hover:text-[#B8860B] transition-colors cursor-pointer py-1"
          >
            Shop
          </button>
          <button
            onClick={() => scrollToSection('shop-by-category')}
            className="text-[#18181A] hover:text-[#B8860B] transition-colors cursor-pointer py-1"
          >
            Categories
          </button>
          <button
            onClick={onOpenStoryModal || (() => scrollToSection('brand-story'))}
            className="text-[#18181A] hover:text-[#B8860B] transition-colors cursor-pointer py-1"
          >
            About
          </button>
          <button
            onClick={() => scrollToSection('contact-footer')}
            className="text-[#18181A] hover:text-[#B8860B] transition-colors cursor-pointer py-1"
          >
            Contact
          </button>
        </nav>

        {/* Right: Search, Account, Shopping Bag (Sound toggle removed per user request) */}
        <div className="flex items-center gap-1.5 sm:gap-3 justify-end shrink-0">
          {/* Search Toggle & Search Input Bar */}
          <div className="relative">
            {isSearchOpen ? (
              <div className="flex items-center bg-[#FAF8F5] border border-[#D4AF37]/70 rounded-full px-2.5 sm:px-3 py-1 shadow-inner animate-in fade-in duration-200">
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search collections..."
                  className="w-24 xs:w-36 sm:w-48 text-[11px] sm:text-xs bg-transparent focus:outline-none text-[#111113] placeholder:text-gray-400"
                />
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="text-gray-400 hover:text-black ml-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[#2A241E] hover:text-[#B8860B] hover:bg-[#FAF6EE] transition-all cursor-pointer"
                aria-label="Search"
                title="Search"
              >
                <Search className="w-3.5 h-3.5 sm:w-[18px] sm:h-[18px]" />
              </button>
            )}

            {/* Quick Search Dropdown */}
            {isSearchOpen && isSearchFocused && searchResults.length > 0 && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-[#D4AF37]/40 py-2 z-50 animate-in fade-in">
                <div className="px-3 py-1 text-[10px] font-bold text-[#8A671A] uppercase tracking-wider border-b border-gray-100">
                  Quick Matching Products
                </div>
                {searchResults.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => {
                      openProductDetail(prod);
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="px-3 py-2 hover:bg-[#FAF6EE] flex items-center gap-3 cursor-pointer transition-colors"
                  >
                    <img
                      src={normalizeImageUrl(prod.image, prod.category)}
                      alt={prod.name}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = FALLBACK_LUXURY_IMAGE;
                      }}
                      className="w-9 h-9 object-cover rounded border border-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#111113] truncate">
                        {prod.name}
                      </p>
                      <p className="text-[11px] font-bold text-[#B8860B]">
                        ₹{prod.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Account Button */}
          <button
            onClick={onOpenAccountModal}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[#2A241E] hover:text-[#B8860B] hover:bg-[#FAF6EE] transition-all cursor-pointer"
            aria-label="Account & Orders"
            title="My Account / Orders"
          >
            <User className="w-3.5 h-3.5 sm:w-[18px] sm:h-[18px]" />
          </button>

          {/* Shopping Bag Button with Golden Count Badge */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[#2A241E] hover:text-[#B8860B] hover:bg-[#FAF6EE] transition-all cursor-pointer group"
            aria-label="Shopping Bag"
            title={`Shopping Bag (${cartCount} items)`}
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-[19px] sm:h-[19px] text-[#2A241E] group-hover:text-[#B8860B] transition-colors" />
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 bg-gradient-to-r from-[#DFBA53] to-[#B8860B] text-black font-extrabold text-[8.5px] sm:text-[9px] w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center shadow-xs border border-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

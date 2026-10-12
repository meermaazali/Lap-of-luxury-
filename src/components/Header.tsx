import React, { useState, useRef } from 'react';
import {
  Search,
  ShoppingBag,
  Heart,
  X,
  Menu,
  Clock,
  Phone,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { UploadedLogoMark } from './UploadedLogoMark';
import { normalizeImageUrl, FALLBACK_LUXURY_IMAGE } from '../utils/imageUtils';

interface HeaderProps {
  onOpenWishlist: () => void;
  onOpenAboutUs: () => void;
  onOpenContactUs?: () => void;
}

const CATEGORY_MOBILE_LINKS = [
  { name: 'All Collections', slug: 'All' },
  { name: "Men's Fashion (Shirts & Pants)", slug: 'Men' },
  { name: "Women's Fashion", slug: 'Women' },
  { name: 'Jeans & Trousers', slug: 'Jeans' },
  { name: 'Watches & Timepieces', slug: 'Watches' },
  { name: 'Bags & Handbags', slug: 'Bags' },
  { name: 'Shoes & Footwear', slug: 'Shoes' },
  { name: 'Perfumes & Fragrances', slug: 'Perfumes' },
  { name: 'Luxury Accessories', slug: 'Accessories' },
  { name: 'The Festive Edit', slug: 'Festive' },
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
    setSelectedCategory,
    triggerTransition,
    wishlist,
  } = useStore();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHomeClick = () => {
    setSelectedCategory('All');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const handleAboutUsClick = () => {
    onOpenAboutUs();
    setIsMobileMenuOpen(false);
  };

  const handleContactUsClick = () => {
    if (onOpenContactUs) {
      onOpenContactUs();
    } else {
      scrollToSection('contact-footer');
    }
    setIsMobileMenuOpen(false);
  };

  const handleCategorySelect = (slug: string, name: string) => {
    triggerTransition(slug, name);
    setIsMobileMenuOpen(false);
    const catalog = document.getElementById('catalog-section');
    if (catalog) {
      catalog.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filter products for quick search dropdown
  const searchResults = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.tags?.some((t) =>
              t.toLowerCase().includes(searchQuery.toLowerCase())
            )
        )
        .slice(0, 5)
    : [];

  return (
    <>
      <header className="bg-white border-b border-[#E8DEC8]/80 sticky top-0 z-40 backdrop-blur-md transition-none shadow-[0_2px_15px_rgba(184,134,11,0.06)] rounded-t-[16px] sm:rounded-t-[28px]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8 py-3 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4 min-h-[72px] sm:min-h-[80px]">
          {/* Mobile Menu Hamburger Toggle (Visible on mobile/tablet only) */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-8 h-8 rounded-full border border-[#E8DEC8] flex items-center justify-center text-[#111113] hover:text-[#B8860B] hover:bg-[#FAF8F5] transition-colors cursor-pointer shrink-0"
            aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Navigation Menu'}
            title="Menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>

          {/* Left: Brand Trademark Logo + Title + Tagline (Completely stable, zero vertical shifting) */}
          <div
            onClick={handleHomeClick}
            className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer select-none shrink-0"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleHomeClick();
            }}
            title="LAP OF LUXURY - Home"
          >
            <div className="w-13 h-13 sm:w-16 sm:h-16 md:w-18 md:h-18 shrink-0 aspect-square flex items-center justify-center">
              <UploadedLogoMark
                className="w-full h-full"
                color="#111113"
              />
            </div>
            <div className="flex flex-col text-left justify-center">
              <span className="font-serif tracking-[0.14em] font-normal uppercase text-base sm:text-xl md:text-2xl text-[#111113] leading-none whitespace-nowrap">
                LAP OF LUXURY
              </span>
              <span className="font-sans font-normal tracking-[0.08em] sm:tracking-[0.12em] text-[9px] xs:text-[10px] sm:text-xs text-[#554D42] uppercase whitespace-nowrap mt-1">
                Experience Premium In Every Touch
              </span>
            </div>
          </div>

          {/* Center: Desktop-Only Navigation with Home, About Us, Contact Us */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-10 text-xs font-semibold tracking-[0.16em] uppercase text-[#1F1E22]">
            {/* Home */}
            <button
              type="button"
              onClick={handleHomeClick}
              className="text-[#111113] hover:text-[#B8860B] transition-colors cursor-pointer py-1 relative hover:underline underline-offset-8"
            >
              <span>Home</span>
            </button>

            {/* About Us */}
            <button
              type="button"
              onClick={handleAboutUsClick}
              className="text-[#111113] hover:text-[#B8860B] transition-colors cursor-pointer py-1 relative hover:underline underline-offset-8"
            >
              <span>About Us</span>
            </button>

            {/* Contact Us */}
            <button
              type="button"
              onClick={handleContactUsClick}
              className="text-[#111113] hover:text-[#B8860B] transition-colors cursor-pointer py-1 relative hover:underline underline-offset-8"
            >
              <span>Contact Us</span>
            </button>
          </nav>

          {/* Right: Search, Wishlist, Shopping Bag */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 justify-end shrink-0">
            {/* Search Input Bar / Toggle */}
            <div className="relative">
              {isSearchOpen ? (
                <div className="flex items-center bg-[#FAF8F5] border border-[#D4AF37]/70 rounded-full px-2.5 sm:px-3 py-1 shadow-inner animate-in fade-in duration-200">
                  <input
                    ref={searchInputRef}
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    placeholder="Search collection..."
                    className="w-24 xs:w-36 sm:w-48 text-[11px] sm:text-xs bg-transparent focus:outline-none text-[#111113] placeholder:text-gray-400 font-normal"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="text-gray-400 hover:text-black ml-1 cursor-pointer"
                    aria-label="Clear search"
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
                  <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              )}

              {/* Quick Search Matching Results Dropdown */}
              {isSearchOpen && isSearchFocused && searchResults.length > 0 && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-[#D4AF37]/40 py-2 z-50 animate-in fade-in">
                  <div className="px-3 py-1 text-[10px] font-bold text-[#8A671A] uppercase tracking-wider border-b border-gray-100">
                    Matching Products
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
                        <p className="text-xs font-normal text-[#111113] truncate">
                          {prod.name}
                        </p>
                        <p className="text-[11px] font-semibold text-[#B8860B]">
                          ₹{prod.price.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              type="button"
              onClick={onOpenWishlist}
              className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[#2A241E] hover:text-[#B8860B] hover:bg-[#FAF6EE] transition-all cursor-pointer group"
              aria-label={`Wishlist (${wishlist.length} saved)`}
              title={`Wishlist (${wishlist.length} items)`}
            >
              <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2A241E] group-hover:text-[#B8860B] transition-colors" />
              {wishlist.length > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-gradient-to-r from-[#DFBA53] to-[#B8860B] text-black font-bold text-[8px] sm:text-[8.5px] w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Bag Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[#2A241E] hover:text-[#B8860B] hover:bg-[#FAF6EE] transition-all cursor-pointer group"
              aria-label={`Shopping Bag (${cartCount} items)`}
              title={`Shopping Bag (${cartCount} items)`}
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2A241E] group-hover:text-[#B8860B] transition-colors" />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-gradient-to-r from-[#DFBA53] to-[#B8860B] text-black font-bold text-[8.5px] w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center border border-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer / Slide-Over Menu (Preserved for mobile layout) */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-[#E8DEC8] bg-[#FAF8F5] px-4 py-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-2 gap-2 text-xs font-medium uppercase tracking-wider">
              <button
                type="button"
                onClick={handleHomeClick}
                className="p-2.5 bg-white border border-[#E8DEC8] rounded-xl text-left text-[#111113] hover:text-[#B8860B] flex items-center justify-between"
              >
                <span>Home</span>
                <span>→</span>
              </button>

              <button
                type="button"
                onClick={handleAboutUsClick}
                className="p-2.5 bg-white border border-[#E8DEC8] rounded-xl text-left text-[#111113] hover:text-[#B8860B] flex items-center justify-between"
              >
                <span>About Us</span>
                <span>→</span>
              </button>

              <button
                type="button"
                onClick={handleContactUsClick}
                className="p-2.5 bg-white border border-[#E8DEC8] rounded-xl text-left text-[#111113] hover:text-[#B8860B] flex items-center justify-between"
              >
                <span>Contact Us</span>
                <span>→</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onOpenWishlist();
                  setIsMobileMenuOpen(false);
                }}
                className="p-2.5 bg-white border border-[#E8DEC8] rounded-xl text-left text-[#111113] hover:text-[#B8860B] flex items-center justify-between"
              >
                <span>Wishlist ({wishlist.length})</span>
                <span>♥</span>
              </button>
            </div>

            {/* Category Quick Links Accordion on Mobile */}
            <div className="pt-2 border-t border-[#E8DEC8]">
              <p className="text-[10px] font-bold text-[#8A671A] uppercase tracking-wider mb-2">
                Browse By Category
              </p>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORY_MOBILE_LINKS.map((cat) => (
                  <button
                    key={'mobile-' + cat.slug + cat.name}
                    type="button"
                    onClick={() => handleCategorySelect(cat.slug, cat.name)}
                    className="px-2.5 py-1 bg-white border border-[#E8DEC8] rounded-lg text-[11px] text-[#2C241E] hover:text-[#B8860B] hover:border-[#B8860B] transition-colors"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Footer Info */}
            <div className="pt-2 border-t border-[#E8DEC8] flex flex-col gap-1 text-[11px] text-[#554D42]">
              <div className="flex items-center gap-1.5 font-normal">
                <Clock className="w-3.5 h-3.5 text-[#B8860B] shrink-0" />
                <span>Store Timings: 9:30 AM – 10:00 PM</span>
              </div>
              <div className="flex items-center gap-1.5 font-normal">
                <Phone className="w-3.5 h-3.5 text-[#B8860B] shrink-0" />
                <span>Concierge Cell: 75 7888 7888</span>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

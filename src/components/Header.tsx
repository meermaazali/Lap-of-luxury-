import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  ShoppingBag,
  User,
  Heart,
  X,
  Menu,
  ChevronDown,
  Clock,
  Phone,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { UploadedLogoMark } from './UploadedLogoMark';
import { normalizeImageUrl, FALLBACK_LUXURY_IMAGE } from '../utils/imageUtils';

interface HeaderProps {
  onOpenWishlist: () => void;
  onOpenAboutUs: () => void;
}

const CATEGORY_DROPDOWN_LINKS = [
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
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsCategoriesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handleShopClick = () => {
    setSelectedCategory('All');
    scrollToSection('catalog-section');
    setIsMobileMenuOpen(false);
  };

  const handleCategorySelect = (slug: string, name: string) => {
    triggerTransition(slug, name);
    setIsCategoriesDropdownOpen(false);
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
      <header className="bg-white border-b border-[#E8DEC8]/80 sticky top-0 z-40 backdrop-blur-md transition-all shadow-[0_2px_15px_rgba(184,134,11,0.06)] rounded-t-[16px] sm:rounded-t-[28px]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4">
          {/* Mobile Menu Hamburger Toggle (Visible on mobile/tablet) */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-8 h-8 rounded-full border border-[#E8DEC8] flex items-center justify-center text-[#111113] hover:text-[#B8860B] hover:bg-[#FAF8F5] transition-colors cursor-pointer shrink-0"
            aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Navigation Menu'}
            title="Menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>

          {/* Left: Brand Identity Logo + Title + Tagline (Enlarged per user request) */}
          <div
            onClick={handleHomeClick}
            className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer select-none group shrink-0"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleHomeClick();
            }}
            title="Lap of Luxury - Return to Home"
          >
            <UploadedLogoMark
              className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-[76px] lg:h-[76px] shrink-0 transition-transform duration-300 group-hover:scale-105"
              color="#111113"
            />
            <div className="flex flex-col text-left">
              <span className="font-serif tracking-[0.12em] sm:tracking-[0.15em] font-medium uppercase text-base sm:text-xl md:text-2xl text-[#111113] leading-tight whitespace-nowrap">
                LAP OF LUXURY
              </span>
              <span className="font-sans font-normal tracking-[0.06em] sm:tracking-[0.12em] text-[9px] xs:text-[10px] sm:text-xs text-[#554D42] uppercase whitespace-nowrap">
                Experience Premium In Every Touch
              </span>
            </div>
          </div>

          {/* Center: Desktop Navigation Links (Home, Shop, Categories Dropdown, About Us, Contact) */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-7 text-xs font-medium tracking-[0.12em] uppercase text-[#1F1E22]">
            {/* Home */}
            <button
              type="button"
              onClick={handleHomeClick}
              className="text-[#111113] hover:text-[#B8860B] transition-colors cursor-pointer py-1 relative font-semibold"
            >
              <span>Home</span>
            </button>

            {/* Shop */}
            <button
              type="button"
              onClick={handleShopClick}
              className="text-[#111113] hover:text-[#B8860B] transition-colors cursor-pointer py-1"
            >
              Shop
            </button>

            {/* Categories with Dropdown Menu */}
            <div
              className="relative"
              ref={dropdownRef}
              onMouseEnter={() => setIsCategoriesDropdownOpen(true)}
              onMouseLeave={() => setIsCategoriesDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => setIsCategoriesDropdownOpen(!isCategoriesDropdownOpen)}
                className="flex items-center gap-1 text-[#111113] hover:text-[#B8860B] transition-colors cursor-pointer py-1"
                aria-expanded={isCategoriesDropdownOpen}
                aria-haspopup="true"
              >
                <span>Categories</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isCategoriesDropdownOpen ? 'rotate-180 text-[#B8860B]' : ''
                  }`}
                />
              </button>

              {/* Categories Dropdown Panel */}
              {isCategoriesDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-[#D4AF37]/40 py-2 z-50 animate-in fade-in duration-150">
                  <div className="px-3.5 py-1.5 text-[9.5px] font-bold text-[#8A671A] uppercase tracking-wider border-b border-[#F0E6D2] flex items-center justify-between">
                    <span>Fashion Collections</span>
                    <Sparkles className="w-3 h-3 text-[#B8860B]" />
                  </div>
                  {CATEGORY_DROPDOWN_LINKS.map((cat) => (
                    <button
                      key={cat.slug + cat.name}
                      type="button"
                      onClick={() => handleCategorySelect(cat.slug, cat.name)}
                      className="w-full text-left px-3.5 py-2 text-xs font-normal text-[#1A1816] hover:text-[#B8860B] hover:bg-[#FAF6EE] transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] text-[#A3927B] opacity-0 group-hover:opacity-100">
                        →
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* About Us (Opens exact About Us Modal) */}
            <button
              type="button"
              onClick={onOpenAboutUs}
              className="text-[#111113] hover:text-[#B8860B] transition-colors cursor-pointer py-1"
            >
              About Us
            </button>

            {/* Contact */}
            <button
              type="button"
              onClick={() => scrollToSection('contact-footer')}
              className="text-[#111113] hover:text-[#B8860B] transition-colors cursor-pointer py-1"
            >
              Contact
            </button>
          </nav>

          {/* Right: Search, Wishlist, Account, Shopping Bag */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-2.5 justify-end shrink-0">
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
                    placeholder="Search shirts, pants, watches..."
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

            {/* Wishlist Button with Golden Count Badge */}
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

            {/* Shopping Bag Button with Golden Count Badge */}
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

        {/* Mobile Navigation Drawer / Slide-Over Menu (When hamburger tapped) */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E8DEC8] bg-[#FAF8F5] px-4 py-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
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
                onClick={handleShopClick}
                className="p-2.5 bg-white border border-[#E8DEC8] rounded-xl text-left text-[#111113] hover:text-[#B8860B] flex items-center justify-between"
              >
                <span>Shop All</span>
                <span>→</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onOpenAboutUs();
                  setIsMobileMenuOpen(false);
                }}
                className="p-2.5 bg-white border border-[#E8DEC8] rounded-xl text-left text-[#111113] hover:text-[#B8860B] flex items-center justify-between"
              >
                <span>About Us</span>
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
                {CATEGORY_DROPDOWN_LINKS.map((cat) => (
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

            {/* Mobile Footer Info: Store Timings & Contact */}
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

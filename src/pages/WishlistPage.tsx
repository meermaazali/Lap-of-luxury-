import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { normalizeImageUrl, FALLBACK_LUXURY_IMAGE } from '../utils/imageUtils';
import { Header } from '../components/Header';
import { LuxuryMegaNav } from '../components/navigation/LuxuryMegaNav';
import { Footer } from '../components/Footer';
import { CartDrawer } from '../components/CartDrawer';

export const WishlistPage: React.FC = () => {
  const { wishlist, removeFromWishlist, addToCart } = useStore();

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#111113] flex flex-col font-normal">
      <Header />
      <LuxuryMegaNav />

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-[#7A6C58] flex items-center gap-1.5">
          <Link to="/" className="hover:text-[#B8860B] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-[#111113]">Wishlist</span>
        </nav>

        <div className="border-b border-[#E8DEC8] pb-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-[0.24em] text-[#8A671A] block">
              Curated Favourites
            </span>
            <h1 className="text-2xl sm:text-3xl text-[#111113] uppercase tracking-wider">
              My Wishlist ({wishlist.length})
            </h1>
          </div>

          {wishlist.length > 0 && (
            <Link
              to="/shop"
              className="text-xs text-[#8A671A] hover:text-[#111113] transition-colors"
            >
              + Discover More Pieces
            </Link>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-[#E8DEC8] p-8 space-y-4 max-w-md mx-auto">
            <Heart className="w-12 h-12 text-[#B8860B] mx-auto stroke-1" />
            <h2 className="text-lg text-[#111113]">Your Wishlist is Empty</h2>
            <p className="text-xs text-[#7A6C58]">
              Save pieces you love by tapping the heart icon on any product.
            </p>
            <Link
              to="/shop"
              className="inline-block px-6 py-2.5 bg-[#111113] text-[#D4AF37] text-xs uppercase tracking-wider rounded-xl hover:bg-black transition-colors"
            >
              Explore Shop All
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {wishlist.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl overflow-hidden border border-[#E8DEC8] hover:border-[#B8860B] hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Product image link: Open in NEW tab */}
                <a
                  href={`/product/${product.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative aspect-[3/4] w-full overflow-hidden bg-[#F3EFE9] cursor-pointer block"
                >
                  <img
                    src={normalizeImageUrl(product.image, product.category)}
                    alt={product.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = FALLBACK_LUXURY_IMAGE;
                    }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Remove from wishlist button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeFromWishlist(product.id);
                    }}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-red-600 shadow-md flex items-center justify-center transition-all cursor-pointer z-10"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </a>

                {/* Card Info */}
                <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1 space-y-3">
                  <div>
                    <span className="text-[9.5px] tracking-[0.18em] uppercase text-[#8A671A] block">
                      {product.brand || 'LAP OF LUXURY'} · {product.category}
                    </span>
                    <a
                      href={`/product/${product.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm text-[#111113] hover:text-[#B8860B] transition-colors block line-clamp-1 mt-0.5"
                    >
                      {product.name}
                    </a>
                    <p className="text-xs text-[#111113] pt-1 tabular-nums">
                      ₹{product.price.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#F0EAE1] flex gap-2">
                    <button
                      type="button"
                      onClick={() => addToCart(product, product.sizes?.[0] || 'Standard', 1)}
                      className="flex-1 py-2 bg-gradient-to-r from-[#DFBA53] via-[#F4E09E] to-[#B8860B] hover:brightness-105 text-[#111113] text-[11px] uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Bag</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
};

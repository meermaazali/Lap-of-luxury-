import React from 'react';
import { X, Heart, Trash2, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import {
  normalizeImageUrl,
  FALLBACK_CATEGORY_IMAGES,
  FALLBACK_LUXURY_IMAGE,
} from '../utils/imageUtils';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({ isOpen, onClose }) => {
  const { wishlist, toggleWishlist, addToCart } = useStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] border-l border-[#E2D7C5] shadow-2xl flex flex-col">
          {/* Header with Back Button */}
          <div className="px-6 py-5 bg-[#FAF8F5] border-b border-[#E8DFC8] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <button
                onClick={onClose}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-[#111111] hover:text-[#B89758] border border-[#D5C7B0] rounded-lg hover:bg-white transition-colors cursor-pointer"
              >
                ← Back
              </button>
              <div>
                <h2 className="font-display text-base sm:text-lg font-bold tracking-[0.16em] uppercase text-[#1E1E22] flex items-center gap-2">
                  <Heart className="w-4 h-4 fill-[#B89758] text-[#B89758]" />
                  SAVED WISHLIST
                </h2>
                <p className="text-xs text-[#7A6C58]">
                  {wishlist.length} {wishlist.length === 1 ? 'product' : 'products'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-[#D5C7B0] hover:border-[#1E1E22] flex items-center justify-center text-[#1E1E22] hover:bg-[#F2ECE1] transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {wishlist.length === 0 ? (
              <div className="py-20 text-center">
                <Heart className="w-12 h-12 text-[#C5B39E] mx-auto mb-3" />
                <p className="font-display text-base font-bold text-[#1E1E22] uppercase tracking-wider">
                  NO SAVED ITEMS
                </p>
                <p className="text-xs text-[#7A6C58] mt-1 max-w-xs mx-auto">
                  Click the heart icon on any shirt, jeans, watch, or handbag to save it here for later.
                </p>
              </div>
            ) : (
              wishlist.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-[#E5DAC8] p-3 flex gap-4 items-center justify-between shadow-xs"
                >
                  <img
                    src={normalizeImageUrl(item.image, item.category)}
                    alt={item.name}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      const fb = FALLBACK_CATEGORY_IMAGES[item.category] || FALLBACK_LUXURY_IMAGE;
                      if (target.src !== fb) target.src = fb;
                    }}
                    className="w-16 h-16 object-cover rounded-lg border border-[#EFE8DD]"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#1E1E22] truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs text-[#7A6C58] mt-0.5">
                      ₹{item.price.toLocaleString('en-IN')}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => {
                          addToCart(item, item.sizes[0] || 'Standard');
                          toggleWishlist(item);
                        }}
                        className="px-2.5 py-1 bg-[#1E1E22] text-[#F3E7D5] text-[10px] font-bold uppercase tracking-wider rounded flex items-center gap-1 cursor-pointer"
                      >
                        <ShoppingBag className="w-3 h-3" /> Move to Bag
                      </button>

                      <button
                        onClick={() => toggleWishlist(item)}
                        className="text-[#9E8E7D] hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

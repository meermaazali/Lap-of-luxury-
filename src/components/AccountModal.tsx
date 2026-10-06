import React, { useState } from 'react';
import { X, Package, Search, Phone, MapPin, CheckCircle, Clock, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface AccountModalProps {
  isOpen?: boolean;
  onClose: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({ onClose }) => {
  const { orders } = useStore();
  const [searchTracking, setSearchTracking] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<typeof orders[0] | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const cleaned = searchTracking.trim().replace('#', '').toUpperCase();
    const found = orders.find(
      (o) =>
        o.trackingNumber.toUpperCase() === cleaned ||
        o.phone.includes(cleaned) ||
        o.customerName.toLowerCase().includes(cleaned.toLowerCase())
    );
    setSearchedOrder(found || null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF8F5] w-full max-w-lg rounded-2xl border border-[#D5C2A5] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header with Back button */}
        <div className="px-6 py-4 bg-white border-b border-[#E8DEC8] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-[#111111] hover:text-[#B89758] border border-[#D5C7B0] rounded-lg hover:bg-[#FAF8F5] transition-colors cursor-pointer"
            >
              ← Back
            </button>
            <div>
              <h2 className="font-display text-sm sm:text-base font-bold tracking-[0.16em] uppercase text-[#1E1E22]">
                ORDER TRACKING & ACCOUNT
              </h2>
              <p className="text-[11px] text-[#7A6C58]">
                Track your Lap of Luxury delivery
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

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Tracking Search Form */}
          <form onSubmit={handleTrack} className="space-y-3">
            <label className="block text-xs font-semibold text-[#4A4033] uppercase tracking-wider">
              ENTER TRACKING NUMBER OR PHONE:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchTracking}
                onChange={(e) => setSearchTracking(e.target.value)}
                placeholder="e.g. LOL-8921 or 75 7888 7888"
                className="flex-1 px-3 py-2 text-xs bg-white border border-[#D5C7B0] rounded focus:outline-none focus:border-[#B89758]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#1E1E22] hover:bg-[#34343A] text-white text-xs font-semibold uppercase tracking-wider rounded cursor-pointer transition-colors"
              >
                Track
              </button>
            </div>
          </form>

          {/* Results */}
          {hasSearched && (
            <div className="pt-2">
              {searchedOrder ? (
                <div className="bg-white rounded-xl border border-[#D5C2A5] p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-[#7A6C58]">Order Reference</span>
                      <p className="font-mono font-bold text-sm text-[#1E1E22]">
                        #{searchedOrder.trackingNumber}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
                        searchedOrder.status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : searchedOrder.status === 'Shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : searchedOrder.status === 'Confirmed'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {searchedOrder.status}
                    </span>
                  </div>

                  <div className="text-xs text-[#5C5040] space-y-1 pt-2 border-t border-[#EFE8DD]">
                    <p>
                      <strong>Recipient:</strong> {searchedOrder.customerName} ({searchedOrder.phone})
                    </p>
                    <p>
                      <strong>Address:</strong> {searchedOrder.address}, {searchedOrder.city} - {searchedOrder.pincode}
                    </p>
                    <p>
                      <strong>Payment:</strong> {searchedOrder.paymentMethod} · Total: ₹{searchedOrder.total.toLocaleString('en-IN')}
                    </p>
                  </div>

                  {/* Items */}
                  <div className="pt-2 border-t border-[#EFE8DD]">
                    <p className="text-[11px] font-bold text-[#3D3327] mb-2 uppercase">
                      Ordered Items:
                    </p>
                    <div className="space-y-2">
                      {searchedOrder.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-8 h-8 rounded object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <span className="flex-1 truncate font-medium text-[#1E1E22]">
                            {item.product.name} ({item.selectedSize})
                          </span>
                          <span className="text-[#7A6C58]">×{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs text-center">
                  No active order found matching "{searchTracking}". Please check the tracking number or contact our Mahabubnagar store directly at <strong>75 7888 7888</strong>.
                </div>
              )}
            </div>
          )}

          {/* Store Direct Assistance */}
          <div className="p-4 bg-[#F2EDE3] rounded-xl border border-[#E2D6C3] text-xs text-[#5E5142] space-y-1.5">
            <p className="font-bold text-[#1E1E22] uppercase tracking-wider">
              MAHBUBNAGAR STORE CONCIERGE:
            </p>
            <p className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#B89758]" />
              <span>Cell: <strong>75 7888 7888</strong></span>
            </p>
            <p className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#B89758] shrink-0" />
              <span>D/6, Kota Complex, Telangana Chowrasta, 2-2-2/2, Boyapalle Rural, Mahbubnagar, Telangana 509001</span>
            </p>
            <p className="text-[11px] text-[#7A6C58] pt-1 border-t border-[#E0D5C3]">
              Support Email: <a href="mailto:lapofluxurypremium@gmail.com" className="text-[#B89758] font-bold hover:underline">lapofluxurypremium@gmail.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

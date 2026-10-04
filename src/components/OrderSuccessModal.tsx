import React from 'react';
import { CheckCircle2, PackageCheck, Copy, ArrowRight, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const OrderSuccessModal: React.FC = () => {
  const { lastPlacedOrder, setLastPlacedOrder, setIsAdminMode } = useStore();

  if (!lastPlacedOrder) return null;

  const copyTracking = () => {
    navigator.clipboard.writeText(lastPlacedOrder.trackingNumber);
    alert(`Tracking number ${lastPlacedOrder.trackingNumber} copied to clipboard!`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF8F5] w-full max-w-lg rounded-2xl border border-[#D5C2A5] shadow-2xl overflow-hidden p-6 sm:p-8 text-center relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={() => setLastPlacedOrder(null)}
          className="absolute top-4 right-4 text-[#8C7D6B] hover:text-[#1E1E22] p-1 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 bg-[#F3EAD9] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#D5C2A5]">
          <CheckCircle2 className="w-8 h-8 text-[#B89758]" />
        </div>

        <span className="font-editorial text-xs italic tracking-[0.2em] uppercase text-[#7D6B55]">
          Order Confirmed
        </span>

        <h2 className="font-display text-2xl font-bold tracking-[0.14em] uppercase text-[#1E1E22] mt-1 mb-2">
          THANK YOU FOR YOUR ORDER
        </h2>

        <p className="text-xs sm:text-sm text-[#5E5244] max-w-sm mx-auto leading-relaxed">
          Hello <strong>{lastPlacedOrder.customerName}</strong>, your order has been received at our Mahabubnagar store and is being prepared with white-glove luxury packaging.
        </p>

        {/* Order Reference Box */}
        <div className="bg-white rounded-xl border border-[#E0D5C3] p-4 my-5 text-left space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#7A6C58]">Tracking Number:</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-sm text-[#1E1E22]">
                #{lastPlacedOrder.trackingNumber}
              </span>
              <button
                onClick={copyTracking}
                className="text-[#B89758] hover:text-[#1E1E22] p-1 cursor-pointer"
                title="Copy tracking"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-between justify-between text-xs text-[#7A6C58]">
            <span>Delivery To:</span>
            <span className="text-[#1E1E22] font-medium text-right truncate max-w-[200px]">
              {lastPlacedOrder.address}, {lastPlacedOrder.city}
            </span>
          </div>

          <div className="flex justify-between text-xs text-[#7A6C58]">
            <span>Total Amount:</span>
            <span className="font-bold text-[#1E1E22] tabular-nums">
              ₹{lastPlacedOrder.total.toLocaleString('en-IN')} ({lastPlacedOrder.paymentMethod})
            </span>
          </div>

          <div className="flex justify-between text-xs text-[#7A6C58]">
            <span>Estimated Delivery:</span>
            <span className="text-emerald-700 font-semibold">2 - 4 Business Days</span>
          </div>

          <div className="flex justify-between text-xs text-[#7A6C58] pt-1 border-t border-[#EFE8DD]">
            <span>Support Concierge:</span>
            <a href="mailto:lapofluxury@gmail.com" className="text-[#B89758] font-bold hover:underline">
              lapofluxury@gmail.com
            </a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setLastPlacedOrder(null)}
            className="flex-1 py-3 bg-[#1E1E22] hover:bg-[#34343A] text-white text-xs font-semibold tracking-wider uppercase rounded cursor-pointer transition-colors"
          >
            CONTINUE SHOPPING
          </button>

          <button
            onClick={() => {
              setLastPlacedOrder(null);
              setIsAdminMode(true);
              window.location.hash = 'admin';
            }}
            className="py-3 px-4 border border-[#B89758] text-[#B89758] hover:bg-[#B89758] hover:text-white text-xs font-semibold tracking-wider uppercase rounded cursor-pointer transition-colors"
          >
            VIEW IN ADMIN PORTAL
          </button>
        </div>
      </div>
    </div>
  );
};

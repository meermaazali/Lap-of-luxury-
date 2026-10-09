import React from 'react';
import { CheckCircle2, PackageCheck, Copy, ArrowRight, X, Mail } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getOrderMailtoUrl } from '../utils/orderNotification';

export const OrderSuccessModal: React.FC = () => {
  const { lastPlacedOrder, setLastPlacedOrder, setIsAdminMode } = useStore();

  if (!lastPlacedOrder) return null;

  const [copiedTracking, setCopiedTracking] = React.useState(false);

  const copyTracking = () => {
    navigator.clipboard.writeText(lastPlacedOrder.trackingNumber);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2500);
  };

  const handleEmailReceipt = () => {
    const ownerEmail = localStorage.getItem('lol_owner_email') || 'taherab375@gmail.com';
    const mailto = getOrderMailtoUrl(lastPlacedOrder, ownerEmail);
    window.open(mailto, '_blank');
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
                className="text-[#B89758] hover:text-[#1E1E22] px-2 py-0.5 rounded text-[11px] font-bold border border-[#E0D5C3] hover:border-[#B89758] transition-colors cursor-pointer flex items-center gap-1"
                title="Copy tracking"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedTracking ? 'Copied!' : 'Copy'}</span>
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
            <a href="mailto:lapofluxurypremium@gmail.com" className="text-[#B89758] font-bold hover:underline">
              lapofluxurypremium@gmail.com
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
          <a
            href={`https://wa.me/917578887888?text=${encodeURIComponent(
              `Hello Lap of Luxury Mahbubnagar,\nI just placed an order:\nOrder #${lastPlacedOrder.trackingNumber}\nCustomer: ${lastPlacedOrder.customerName}\nPhone: ${lastPlacedOrder.phone}\nAddress: ${lastPlacedOrder.address}, ${lastPlacedOrder.city}\nTotal: ₹${lastPlacedOrder.total}\nItems:\n${lastPlacedOrder.items
                .map((i) => `• ${i.product.name} (${i.selectedSize}) x${i.quantity}`)
                .join('\n')}`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="py-3 px-3 bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <span>WhatsApp (75 7888 7888)</span>
          </a>

          <button
            onClick={handleEmailReceipt}
            className="py-3 px-3 bg-[#FAF6EE] hover:bg-[#F2ECE1] border border-[#B89758] text-[#8C6D1F] font-bold text-xs uppercase tracking-wider rounded-lg shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-[#B89758]" />
            <span>Email Receipt</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setLastPlacedOrder(null)}
            className="w-full py-3 bg-[#1E1E22] hover:bg-[#34343A] text-white text-xs font-semibold tracking-wider uppercase rounded-xl cursor-pointer transition-colors shadow-sm"
          >
            CONTINUE SHOPPING
          </button>
        </div>
      </div>
    </div>
  );
};

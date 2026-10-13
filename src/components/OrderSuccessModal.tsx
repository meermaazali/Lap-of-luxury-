import React, { useState } from 'react';
import { Copy, X, Mail, Phone, ShoppingBag, MapPin, Calendar } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getOrderMailtoUrl } from '../utils/orderNotification';
import { normalizeImageUrl } from '../utils/imageUtils';

export const OrderSuccessModal: React.FC = () => {
  const { lastPlacedOrder, setLastPlacedOrder } = useStore();

  if (!lastPlacedOrder) return null;

  const [copiedTracking, setCopiedTracking] = useState(false);

  const copyTracking = () => {
    navigator.clipboard.writeText(lastPlacedOrder.trackingNumber);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2500);
  };

  const handleEmailReceipt = () => {
    const ownerEmail = localStorage.getItem('lol_owner_email') || 'lapofluxurypremium@gmail.com';
    const mailto = getOrderMailtoUrl(lastPlacedOrder, ownerEmail);
    window.open(mailto, '_blank');
  };

  const orderDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none">
      <div className="bg-[#FAF8F5] w-full max-w-xl rounded-2xl border-2 border-[#D4AF37] shadow-2xl overflow-hidden p-5 sm:p-8 text-center relative animate-in fade-in zoom-in-95 duration-200 text-[#1E1E22]">
        <div className="flex items-center justify-between mb-3 border-b border-[#E8DEC8] pb-3">
          <button
            type="button"
            onClick={() => setLastPlacedOrder(null)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#111111] hover:text-[#B8860B] border border-[#D5C7B0] rounded-lg hover:bg-white transition-colors cursor-pointer"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={() => setLastPlacedOrder(null)}
            className="w-8 h-8 rounded-full border border-[#D5C7B0] hover:bg-[#EFE8DC] flex items-center justify-center text-[#1E1E22] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Premium Gold Checkmark Animation */}
        <div className="relative w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          {/* Animated Gold Aura Ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#D4AF37]/30 to-[#F5DEB3]/50 animate-ping opacity-60" />
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-[#C5A059] via-[#D4AF37] to-[#E5C158] flex items-center justify-center shadow-[0_4px_25px_rgba(212,175,55,0.45)] border-2 border-white">
            <svg
              className="w-9 h-9 text-white drop-shadow-md"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>

        {/* Accurate Payment Status Badge */}
        <span className={`font-sans text-[11px] font-semibold tracking-[0.2em] uppercase block mb-1 ${
          lastPlacedOrder.paymentStatus === 'Paid' || lastPlacedOrder.paymentStatus === 'Verified'
            ? 'text-emerald-700'
            : 'text-[#8C6D1F]'
        }`}>
          {lastPlacedOrder.paymentStatus === 'Paid' || lastPlacedOrder.paymentStatus === 'Verified'
            ? 'Payment Verified & Confirmed'
            : 'Order Placed · Payment Pending Verification'}
        </span>

        <h2 className="font-serif text-2xl sm:text-3xl font-semibold tracking-wide uppercase text-[#111113] mb-1">
          ORDER RECEIVED
        </h2>

        {/* Order Number */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#D4AF37]/60 shadow-2xs mt-2 mb-4">
          <span className="text-xs text-[#7A6C58] font-normal">Order Number:</span>
          <span className="font-mono font-bold text-sm text-[#111113]">
            #{lastPlacedOrder.trackingNumber}
          </span>
          <button
            type="button"
            onClick={copyTracking}
            className="text-[#8C6D1F] hover:text-[#111113] ml-1 p-0.5 cursor-pointer"
            title="Copy Order Number"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          {copiedTracking && (
            <span className="text-[10px] text-emerald-600 font-semibold ml-1">
              Copied!
            </span>
          )}
        </div>

        <p className="text-xs sm:text-sm text-[#5C5040] max-w-md mx-auto leading-relaxed font-normal mb-5">
          {lastPlacedOrder.paymentStatus === 'Paid' || lastPlacedOrder.paymentStatus === 'Verified' ? (
            <>Thank you, <strong>{lastPlacedOrder.customerName}</strong>. Your payment is verified and your luxury order is being prepared for dispatch.</>
          ) : (
            <>Thank you, <strong>{lastPlacedOrder.customerName}</strong>. Your luxury order has been recorded. Payment status is currently <strong>Payment Pending</strong> and will be marked as Paid once confirmed by PhonePe / bank settlement.</>
          )}
        </p>

        {/* Order Summary Box */}
        <div className="bg-white rounded-xl border border-[#E0D5C3] p-4 text-left space-y-3 shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#F0E6D2] pb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#111113] flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-[#B8860B]" />
              <span>Order Summary</span>
            </span>
            <span className="text-[11px] text-[#7A6C58] flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#B8860B]" />
              <span>{orderDate}</span>
            </span>
          </div>

          {/* Items List */}
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {lastPlacedOrder.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    src={normalizeImageUrl(item.product.image, item.product.category)}
                    alt={item.product.name}
                    className="w-9 h-9 object-cover rounded border border-gray-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-normal text-[#111113] truncate">
                      {item.product.name}
                    </p>
                    <p className="text-[10.5px] text-[#7A6C58]">
                      Size: {item.selectedSize} · Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="font-semibold text-[#111113] tabular-nums shrink-0">
                  ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          {/* Customer & Delivery Details */}
          <div className="pt-2 border-t border-[#F0E6D2] grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#554D42]">
            <div className="flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#B8860B] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[#111113] font-medium">Delivery Address:</strong>
                <p className="text-[11px] text-[#554D42] leading-tight">
                  {lastPlacedOrder.address}, {lastPlacedOrder.city} - {lastPlacedOrder.pincode}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#B8860B] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[#111113] font-medium">Phone Number:</strong>
                <p className="text-[11px] text-[#554D42]">
                  {lastPlacedOrder.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Pricing Totals */}
          <div className="pt-2 border-t border-[#F0E6D2] space-y-1 text-xs">
            <div className="flex justify-between text-[#6B5E4E]">
              <span>Payment Mode:</span>
              <span className="font-medium text-[#111113]">
                {lastPlacedOrder.paymentMethod} (Verified)
              </span>
            </div>
            <div className="flex justify-between font-semibold text-sm text-[#111113] pt-1">
              <span>Total Paid:</span>
              <span className="text-base font-bold text-[#111113] tabular-nums">
                ₹{lastPlacedOrder.total.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons: WhatsApp & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-4">
          <a
            href={`https://wa.me/917578887888?text=${encodeURIComponent(
              `Hello Lap of Luxury Mahbubnagar,\nI have verified payment for my order:\nOrder #${lastPlacedOrder.trackingNumber}\nCustomer: ${lastPlacedOrder.customerName}\nPhone: ${lastPlacedOrder.phone}\nAddress: ${lastPlacedOrder.address}, ${lastPlacedOrder.city}\nTotal: ₹${lastPlacedOrder.total}\nPayment: ${lastPlacedOrder.paymentMethod} (Verified)\nItems:\n${lastPlacedOrder.items
                .map((i) => `• ${i.product.name} (${i.selectedSize}) x${i.quantity}`)
                .join('\n')}`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="py-2.5 px-3 bg-[#25D366] hover:bg-[#20BA5A] text-white font-medium text-xs tracking-wider uppercase rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <span>WhatsApp (75 7888 7888)</span>
          </a>

          <button
            type="button"
            onClick={handleEmailReceipt}
            className="py-2.5 px-3 bg-[#FAF6EE] hover:bg-[#F2ECE1] border border-[#B89758] text-[#8C6D1F] font-medium text-xs tracking-wider uppercase rounded-xl shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-[#B89758]" />
            <span>Email Receipt</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setLastPlacedOrder(null)}
          className="w-full py-3 bg-[#111113] hover:bg-[#2A2A2E] text-white text-xs font-medium tracking-widest uppercase rounded-xl cursor-pointer transition-colors"
        >
          CONTINUE SHOPPING
        </button>
      </div>
    </div>
  );
};

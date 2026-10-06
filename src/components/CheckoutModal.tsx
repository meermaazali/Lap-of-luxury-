import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Banknote,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Copy,
  Smartphone,
  Info,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartTotal,
    placeOrder,
    paymentConfig,
  } = useStore();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: 'Mahbubnagar',
    pincode: '509001',
    paymentMethod: 'UPI' as 'COD' | 'UPI' | 'Card',
    transactionRef: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  if (!isCheckoutOpen) return null;

  const shippingCost = cartTotal >= 2999 ? 0 : 150;
  const orderTotal = cartTotal + shippingCost;

  // Dynamic QR for exact checkout amount
  const dynamicCheckoutQr = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    `upi://pay?pa=${paymentConfig.upiId}&pn=${paymentConfig.payeeName}&am=${orderTotal}&cu=INR`
  )}`;

  const activeQrImage = paymentConfig.qrCodeImage || dynamicCheckoutQr;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(paymentConfig.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setErrorMsg('Please enter your full name, phone number, and delivery address.');
      return;
    }

    if (formData.paymentMethod === 'Card' && !paymentConfig.enableCard) {
      setErrorMsg('Online card gateway is currently being configured. Please select UPI or Cash on Delivery.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      placeOrder({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode,
        paymentMethod: formData.paymentMethod,
        transactionRef: formData.transactionRef,
      });
      setIsSubmitting(false);
      setIsCheckoutOpen(false);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF8F5] w-full max-w-xl rounded-2xl border border-[#D5C2A5] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header with Back Button */}
        <div className="px-6 py-4 bg-white border-b border-[#E8DEC8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-[#111111] hover:text-[#B89758] border border-[#D5C7B0] rounded-lg hover:bg-[#FAF8F5] transition-colors cursor-pointer"
            >
              ← Back to Cart
            </button>
            <div>
              <h2 className="font-display text-base sm:text-lg font-bold tracking-[0.16em] uppercase text-[#1E1E22]">
                SECURE CHECKOUT
              </h2>
              <p className="text-[11px] text-[#7A6C58]">
                Lap of Luxury · Mahbubnagar · lapofluxurypremium@gmail.com
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="w-8 h-8 rounded-full border border-[#D5C7B0] hover:border-[#1E1E22] flex items-center justify-center text-[#1E1E22] hover:bg-[#F2ECE1] transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Customer Details */}
          <div>
            <h3 className="text-xs font-bold tracking-[0.14em] uppercase text-[#3D3327] mb-3 flex items-center gap-1.5">
              <span>1. Customer & Delivery Contact</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#5A4F41] mb-1">
                  FULL NAME *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Vikram Reddy"
                  className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded text-xs focus:outline-none focus:border-[#B89758]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#5A4F41] mb-1">
                  PHONE NUMBER (WhatsApp / Call) *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 75 7888 7888"
                  className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded text-xs focus:outline-none focus:border-[#B89758]"
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-[11px] font-semibold text-[#5A4F41] mb-1">
                EMAIL ADDRESS (For order receipt)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="lapofluxurypremium@gmail.com"
                className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded text-xs focus:outline-none focus:border-[#B89758]"
              />
            </div>
          </div>

          {/* Shipping Address */}
          <div className="pt-3 border-t border-[#EAE2D2]">
            <h3 className="text-xs font-bold tracking-[0.14em] uppercase text-[#3D3327] mb-3 flex items-center gap-1.5">
              <span>2. Delivery Address</span>
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#5A4F41] mb-1">
                  STREET ADDRESS / LANDMARK *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="House/Flat No, Landmark, Area (e.g. Telangana Chowrasta...)"
                  className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded text-xs focus:outline-none focus:border-[#B89758]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#5A4F41] mb-1">
                    CITY / TOWN *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded text-xs focus:outline-none focus:border-[#B89758]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#5A4F41] mb-1">
                    PINCODE *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded text-xs focus:outline-none focus:border-[#B89758]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="pt-3 border-t border-[#EAE2D2]">
            <h3 className="text-xs font-bold tracking-[0.14em] uppercase text-[#3D3327] mb-3 flex items-center gap-1.5">
              <span>3. Payment Method</span>
            </h3>

            <div className="grid grid-cols-3 gap-2.5 mb-4">
              {/* UPI */}
              {paymentConfig.enableUPI && (
                <label
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer transition-all ${
                    formData.paymentMethod === 'UPI'
                      ? 'border-[#B89758] bg-[#FAF3E6] text-[#1E1E22] ring-2 ring-[#B89758]'
                      : 'border-[#D5C7B0] bg-white text-[#5C5040] hover:bg-[#FBF9F5]'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    className="sr-only"
                    checked={formData.paymentMethod === 'UPI'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'UPI' })}
                  />
                  <QrCode className="w-5 h-5 mb-1 text-[#B89758]" />
                  <span className="text-[11px] font-bold">UPI / QR Pay</span>
                  <span className="text-[9px] text-[#7A6C58]">PhonePe / GPay</span>
                </label>
              )}

              {/* COD */}
              {paymentConfig.enableCOD && (
                <label
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer transition-all ${
                    formData.paymentMethod === 'COD'
                      ? 'border-[#B89758] bg-[#FAF3E6] text-[#1E1E22] ring-2 ring-[#B89758]'
                      : 'border-[#D5C7B0] bg-white text-[#5C5040] hover:bg-[#FBF9F5]'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    className="sr-only"
                    checked={formData.paymentMethod === 'COD'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'COD' })}
                  />
                  <Banknote className="w-5 h-5 mb-1 text-[#B89758]" />
                  <span className="text-[11px] font-bold">Cash on Delivery</span>
                  <span className="text-[9px] text-[#7A6C58]">Pay at doorstep</span>
                </label>
              )}

              {/* Card Gateway */}
              <label
                className={`flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer transition-all ${
                  formData.paymentMethod === 'Card'
                    ? 'border-[#B89758] bg-[#FAF3E6] text-[#1E1E22] ring-2 ring-[#B89758]'
                    : 'border-[#D5C7B0] bg-white text-[#5C5040] hover:bg-[#FBF9F5]'
                } ${!paymentConfig.enableCard ? 'opacity-60' : ''}`}
              >
                <input
                  type="radio"
                  name="payment"
                  className="sr-only"
                  checked={formData.paymentMethod === 'Card'}
                  onChange={() => setFormData({ ...formData, paymentMethod: 'Card' })}
                />
                <CreditCard className="w-5 h-5 mb-1 text-[#B89758]" />
                <span className="text-[11px] font-bold">Cards / Gateway</span>
                <span className="text-[9px] text-[#7A6C58]">
                  {paymentConfig.enableCard ? 'Online Pay' : 'In Setup'}
                </span>
              </label>
            </div>

            {/* UPI SCAN & PAY MODULE (When UPI is selected) */}
            {formData.paymentMethod === 'UPI' && (
              <div className="bg-white rounded-xl p-4 border border-[#B89758]/60 shadow-xs space-y-3 animate-in fade-in">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-36 h-36 bg-white p-2 rounded-xl border-2 border-[#D4AF37] flex items-center justify-center shadow-xs shrink-0">
                    <img
                      src={activeQrImage}
                      alt="UPI QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 space-y-2 text-xs">
                    <div className="flex items-center justify-between pb-1 border-b border-gray-100">
                      <span className="text-gray-500">Store UPI ID:</span>
                      <div className="flex items-center gap-1 font-mono font-bold text-[#111111]">
                        <span>{paymentConfig.upiId}</span>
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="p-1 hover:text-[#B89758] cursor-pointer"
                          title="Copy UPI ID"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pb-1 border-b border-gray-100">
                      <span className="text-gray-500">Payee:</span>
                      <span className="font-bold text-[#111111]">{paymentConfig.payeeName}</span>
                    </div>

                    <div className="flex items-center justify-between pb-1 border-b border-gray-100">
                      <span className="text-gray-500">Amount to Pay:</span>
                      <span className="font-extrabold text-base text-[#111111] tabular-nums">
                        ₹{orderTotal.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {copiedUpi && (
                      <p className="text-[11px] text-emerald-600 font-bold text-right">
                        UPI ID copied!
                      </p>
                    )}
                  </div>
                </div>

                {/* UTR Reference Input */}
                <div className="pt-2">
                  <label className="block text-[11px] font-bold text-[#4A4033] mb-1">
                    ENTER 12-DIGIT UPI REFERENCE / UTR NUMBER (AFTER PAYMENT):
                  </label>
                  <input
                    type="text"
                    value={formData.transactionRef}
                    onChange={(e) => setFormData({ ...formData, transactionRef: e.target.value })}
                    placeholder="e.g. 427819827361"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D5C7B0] rounded text-xs focus:outline-none focus:border-[#B89758] font-mono"
                  />
                  <p className="text-[10px] text-[#7A6C58] mt-1">
                    Optional: Speeds up instant payment verification by our Mahbubnagar dispatch desk.
                  </p>
                </div>
              </div>
            )}

            {/* COD Notice */}
            {formData.paymentMethod === 'COD' && (
              <div className="p-3 bg-white rounded-xl border border-[#D5C7B0] text-xs text-[#5C5040] space-y-1">
                <p className="font-bold text-[#111111]">Cash on Delivery Selected</p>
                <p>Pay cash upon delivery. Our delivery associate will collect ₹{orderTotal.toLocaleString('en-IN')} at your door.</p>
              </div>
            )}

            {/* Card Gateway Notice */}
            {formData.paymentMethod === 'Card' && !paymentConfig.enableCard && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <div>
                  <strong className="block">Direct Card Gateway Setup in Progress</strong>
                  <span>To complete your order right now, please select <strong>UPI / QR Pay</strong> or <strong>Cash on Delivery</strong>.</span>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary & Total */}
          <div className="p-4 bg-white rounded-xl border border-[#E8DFC8] space-y-2 text-xs">
            <div className="flex justify-between text-[#6B5E4E]">
              <span>Cart Subtotal ({cart.length} items):</span>
              <span className="font-bold text-[#1E1E22] tabular-nums">
                ₹{cartTotal.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between text-[#6B5E4E]">
              <span>Shipping & White-Glove Packaging:</span>
              <span className="font-bold text-emerald-700">
                {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}
              </span>
            </div>
            <div className="pt-2 border-t border-[#F0EAE0] flex justify-between items-baseline font-bold text-sm sm:text-base text-[#1E1E22]">
              <span>Grand Total:</span>
              <span className="text-lg font-extrabold text-[#1E1E22] tabular-nums">
                ₹{orderTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Place Order CTA or Coming Soon */}
          {!paymentConfig.acceptPaymentsOnline ? (
            <div className="space-y-2">
              <div className="p-3.5 bg-gradient-to-r from-[#FAF6EE] to-[#F3E7BE] border-2 border-[#D4AF37] rounded-xl text-center space-y-1">
                <span className="text-[10px] tracking-[0.2em] font-extrabold uppercase text-[#B8860B] block">
                  ONLINE PAYMENT COMING SOON
                </span>
                <p className="text-xs text-[#2C241B] font-semibold">
                  Online gateway is in setup. You can place this order directly with our boutique desk:
                </p>
                <div className="flex items-center justify-center gap-3 pt-1">
                  <a
                    href="tel:7578887888"
                    className="text-xs font-black text-[#111111] bg-white px-3 py-1 rounded-full border border-[#D4AF37] hover:bg-[#D4AF37] transition-colors"
                  >
                    📞 Call 75 7888 7888
                  </a>
                </div>
              </div>

              <a
                href={`https://wa.me/917578887888?text=${encodeURIComponent(
                  `Hello Lap of Luxury Mahbubnagar,\nI want to place an order for:\nCustomer: ${formData.name || 'Guest'}\nPhone: ${formData.phone}\nAddress: ${formData.address}, ${formData.city} - ${formData.pincode}\nItems:\n${cart
                    .map((i) => `• ${i.product.name} (${i.selectedSize}) x${i.quantity} = ₹${i.product.price * i.quantity}`)
                    .join('\n')}\nTotal: ₹${orderTotal}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 bg-[#111111] hover:bg-[#28282D] text-[#E5C07B] font-extrabold text-xs sm:text-sm tracking-[0.16em] uppercase rounded-xl shadow-lg transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2 border border-[#D4AF37]"
              >
                <span>CONFIRM ORDER VIA WHATSAPP (₹{orderTotal.toLocaleString('en-IN')})</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#B8860B] hover:brightness-105 text-[#111111] font-extrabold text-xs sm:text-sm tracking-[0.16em] uppercase rounded-xl shadow-lg transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>SECURING YOUR ORDER...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>PLACE ORDER (₹{orderTotal.toLocaleString('en-IN')})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

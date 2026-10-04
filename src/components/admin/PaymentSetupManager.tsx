import React, { useState } from 'react';
import {
  QrCode,
  Smartphone,
  CreditCard,
  Banknote,
  CheckCircle2,
  Copy,
  Upload,
  Save,
  ShieldCheck,
  Building,
  Info,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const PaymentSetupManager: React.FC = () => {
  const { paymentConfig, updatePaymentConfig } = useStore();

  const [upiId, setUpiId] = useState(paymentConfig.upiId);
  const [payeeName, setPayeeName] = useState(paymentConfig.payeeName);
  const [upiNumber, setUpiNumber] = useState(paymentConfig.upiNumber);
  const [qrCodeImage, setQrCodeImage] = useState(paymentConfig.qrCodeImage);
  const [enableUPI, setEnableUPI] = useState(paymentConfig.enableUPI);
  const [enableCOD, setEnableCOD] = useState(paymentConfig.enableCOD);
  const [enableCard, setEnableCard] = useState(paymentConfig.enableCard);
  const [bankAccountNumber, setBankAccountNumber] = useState(paymentConfig.bankAccountNumber || '');
  const [bankIfsc, setBankIfsc] = useState(paymentConfig.bankIfsc || '');
  const [bankName, setBankName] = useState(paymentConfig.bankName || '');
  const [instructions, setInstructions] = useState(paymentConfig.instructions || '');

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate live dynamic QR based on current UPI ID and Payee Name
  const liveGeneratedQR = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    `upi://pay?pa=${upiId}&pn=${payeeName}&cu=INR`
  )}`;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePaymentConfig({
      upiId,
      payeeName,
      upiNumber,
      qrCodeImage: qrCodeImage || liveGeneratedQR,
      enableUPI,
      enableCOD,
      enableCard,
      bankAccountNumber,
      bankIfsc,
      bankName,
      instructions,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        setQrCodeImage(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const copyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-[#E0D5C3] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#D4AF37]/15 text-[#B8860B]">
              <QrCode className="w-5 h-5" />
            </span>
            <h2 className="font-bodoni text-xl font-bold tracking-wider text-[#111111] uppercase">
              PAYMENT & UPI SETUP
            </h2>
          </div>
          <p className="text-xs text-[#7A6C58]">
            Configure store UPI ID, real QR code for instant scan-to-pay, and payment methods.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-300 px-4 py-2 rounded-xl text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Payment settings updated successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Details (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Payment Methods */}
          <div className="bg-white rounded-2xl p-6 border border-[#E0D5C3] shadow-xs space-y-4">
            <h3 className="font-bodoni text-sm font-bold tracking-wider text-[#111111] uppercase flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#B89758]" />
              ACTIVE PAYMENT METHODS
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* UPI */}
              <label
                className={`p-4 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                  enableUPI
                    ? 'border-[#B89758] bg-[#FAF8F3] ring-1 ring-[#B89758]'
                    : 'border-gray-200 bg-gray-50 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Smartphone className="w-5 h-5 text-[#B89758]" />
                  <input
                    type="checkbox"
                    checked={enableUPI}
                    onChange={(e) => setEnableUPI(e.target.checked)}
                    className="accent-[#B89758] w-4 h-4 cursor-pointer"
                  />
                </div>
                <span className="text-xs font-bold text-[#111111]">UPI / QR Code</span>
                <span className="text-[10px] text-[#7A6C58]">GPay, PhonePe, Paytm</span>
              </label>

              {/* COD */}
              <label
                className={`p-4 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                  enableCOD
                    ? 'border-[#B89758] bg-[#FAF8F3] ring-1 ring-[#B89758]'
                    : 'border-gray-200 bg-gray-50 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Banknote className="w-5 h-5 text-[#B89758]" />
                  <input
                    type="checkbox"
                    checked={enableCOD}
                    onChange={(e) => setEnableCOD(e.target.checked)}
                    className="accent-[#B89758] w-4 h-4 cursor-pointer"
                  />
                </div>
                <span className="text-xs font-bold text-[#111111]">Cash on Delivery</span>
                <span className="text-[10px] text-[#7A6C58]">Pay upon delivery</span>
              </label>

              {/* Card / Online Gateway */}
              <label
                className={`p-4 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                  enableCard
                    ? 'border-[#B89758] bg-[#FAF8F3] ring-1 ring-[#B89758]'
                    : 'border-gray-200 bg-gray-50 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <CreditCard className="w-5 h-5 text-[#B89758]" />
                  <input
                    type="checkbox"
                    checked={enableCard}
                    onChange={(e) => setEnableCard(e.target.checked)}
                    className="accent-[#B89758] w-4 h-4 cursor-pointer"
                  />
                </div>
                <span className="text-xs font-bold text-[#111111]">Cards & NetBanking</span>
                <span className="text-[10px] text-[#7A6C58]">
                  {enableCard ? 'Enabled' : 'Disabled (Setup when ready)'}
                </span>
              </label>
            </div>
          </div>

          {/* UPI Merchant Details */}
          <div className="bg-white rounded-2xl p-6 border border-[#E0D5C3] shadow-xs space-y-4">
            <h3 className="font-bodoni text-sm font-bold tracking-wider text-[#111111] uppercase">
              STORE UPI CONFIGURATION
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#4A4033] mb-1">
                  STORE UPI ID (VPA):
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. 7578887888@ybl or lapofluxury@okhdfcbank"
                    className="w-full px-3 py-2 text-xs border border-[#D5C7B0] rounded-xl focus:outline-none focus:border-[#B89758] bg-[#FAF8F5]"
                    required
                  />
                </div>
                <p className="text-[10px] text-[#8C7E6C] mt-1">
                  Customers can pay directly to this UPI ID or scan the live QR code.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A4033] mb-1">
                  PAYEE NAME:
                </label>
                <input
                  type="text"
                  value={payeeName}
                  onChange={(e) => setPayeeName(e.target.value)}
                  placeholder="e.g. Lap of Luxury Mahbubnagar"
                  className="w-full px-3 py-2 text-xs border border-[#D5C7B0] rounded-xl focus:outline-none focus:border-[#B89758] bg-[#FAF8F5]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A4033] mb-1">
                  OFFICIAL UPI NUMBER / CELL:
                </label>
                <input
                  type="text"
                  value={upiNumber}
                  onChange={(e) => setUpiNumber(e.target.value)}
                  placeholder="75 7888 7888"
                  className="w-full px-3 py-2 text-xs border border-[#D5C7B0] rounded-xl focus:outline-none focus:border-[#B89758] bg-[#FAF8F5]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A4033] mb-1">
                  UPLOAD CUSTOM QR IMAGE (PNG/JPG):
                </label>
                <div className="flex items-center gap-2">
                  <label className="flex-1 px-3 py-2 text-xs border border-dashed border-[#B89758] rounded-xl text-center cursor-pointer hover:bg-[#FAF8F5] transition-colors flex items-center justify-center gap-1.5 text-[#5C5040]">
                    <Upload className="w-3.5 h-3.5 text-[#B89758]" />
                    <span>Choose PNG/JPG QR</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleQrUpload}
                      className="hidden"
                    />
                  </label>
                  {qrCodeImage && (
                    <button
                      type="button"
                      onClick={() => setQrCodeImage('')}
                      className="px-2.5 py-2 text-xs text-red-600 border border-red-200 rounded-xl hover:bg-red-50 cursor-pointer"
                      title="Reset to live generated QR"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A4033] mb-1">
                CHECKOUT PAYMENT INSTRUCTIONS:
              </label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={2}
                placeholder="Instructions displayed to customer after selecting UPI..."
                className="w-full px-3 py-2 text-xs border border-[#D5C7B0] rounded-xl focus:outline-none focus:border-[#B89758] bg-[#FAF8F5]"
              />
            </div>
          </div>

          {/* Optional Bank RTGS Details */}
          <div className="bg-white rounded-2xl p-6 border border-[#E0D5C3] shadow-xs space-y-4">
            <h3 className="font-bodoni text-sm font-bold tracking-wider text-[#111111] uppercase flex items-center gap-2">
              <Building className="w-4 h-4 text-[#B89758]" />
              BANK ACCOUNT DETAILS (FOR DIRECT RTGS/NEFT)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#4A4033] mb-1">
                  ACCOUNT NUMBER:
                </label>
                <input
                  type="text"
                  value={bankAccountNumber}
                  onChange={(e) => setBankAccountNumber(e.target.value)}
                  placeholder="50200012345678"
                  className="w-full px-3 py-2 text-xs border border-[#D5C7B0] rounded-xl focus:outline-none focus:border-[#B89758] bg-[#FAF8F5]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#4A4033] mb-1">
                  IFSC CODE:
                </label>
                <input
                  type="text"
                  value={bankIfsc}
                  onChange={(e) => setBankIfsc(e.target.value)}
                  placeholder="HDFC0001234"
                  className="w-full px-3 py-2 text-xs border border-[#D5C7B0] rounded-xl focus:outline-none focus:border-[#B89758] bg-[#FAF8F5]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#4A4033] mb-1">
                  BANK & BRANCH:
                </label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="HDFC Bank, Mahbubnagar"
                  className="w-full px-3 py-2 text-xs border border-[#D5C7B0] rounded-xl focus:outline-none focus:border-[#B89758] bg-[#FAF8F5]"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#111111] hover:bg-[#28282D] text-white text-xs font-bold tracking-[0.16em] uppercase rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Save className="w-4 h-4 text-[#D4AF37]" />
            <span>SAVE PAYMENT CONFIGURATION</span>
          </button>
        </div>

        {/* Right Column: Live QR Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#1A1A1E] text-white rounded-2xl p-6 border-2 border-[#D4AF37]/50 shadow-xl flex flex-col items-center text-center">
            <span className="text-[10px] tracking-[0.2em] font-extrabold uppercase text-[#D4AF37] mb-1">
              CUSTOMER CHECKOUT PREVIEW
            </span>
            <h4 className="font-bodoni text-lg font-bold uppercase tracking-wider text-white">
              INSTANT SCAN & PAY
            </h4>
            <p className="text-xs text-gray-300 mt-0.5 mb-4">
              This exact QR code is presented to customers during checkout.
            </p>

            {/* QR Code Container */}
            <div className="bg-white p-3 rounded-2xl shadow-2xl border-4 border-[#D4AF37] max-w-[240px] aspect-square flex items-center justify-center">
              <img
                src={qrCodeImage || liveGeneratedQR}
                alt="Store Payment QR Code"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>

            {/* UPI ID Box */}
            <div className="w-full bg-[#111113] border border-[#D4AF37]/40 rounded-xl p-3 mt-4 text-left space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Payee:</span>
                <span className="font-bold text-white">{payeeName}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">UPI ID:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-[#E5C07B]">{upiId}</span>
                  <button
                    type="button"
                    onClick={copyUpi}
                    className="p-1 hover:text-[#D4AF37] text-gray-400 cursor-pointer"
                    title="Copy UPI ID"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
              {copied && (
                <p className="text-[10px] text-emerald-400 font-semibold text-right">
                  Copied to clipboard!
                </p>
              )}
            </div>

            <div className="mt-4 flex items-center gap-2 text-[11px] text-gray-400">
              <Info className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
              <span>Supports PhonePe, Google Pay, Paytm, BHIM & all banking apps.</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

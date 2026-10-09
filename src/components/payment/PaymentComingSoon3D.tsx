import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  QrCode,
  Smartphone,
  ShieldCheck,
  ArrowLeft,
  Sparkles,
  Lock,
  ArrowRight,
  CheckCircle2,
  Clock,
  Phone,
  Radio,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { UploadedLogoMark } from '../UploadedLogoMark';

interface PaymentComingSoon3DProps {
  onBackToCart: () => void;
  onProceedCOD: () => void;
  orderTotal: number;
}

export const PaymentComingSoon3D: React.FC<PaymentComingSoon3DProps> = ({
  onBackToCart,
  onProceedCOD,
  orderTotal,
}) => {
  // 3D Card tilt state
  const [cardRotate, setCardRotate] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState<'card' | 'upi' | 'qr'>('card');

  // Subtle interactive 3D tilt on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setCardRotate({
      x: -(y / rect.height) * 16,
      y: (x / rect.width) * 16,
    });
  };

  const handleMouseLeave = () => {
    setCardRotate({ x: 0, y: 0 });
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Top Navigation & Back Button */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E8DEC8]">
        <button
          type="button"
          onClick={onBackToCart}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D5C7B0] bg-white hover:bg-[#FAF6EE] text-[#111111] hover:text-[#B8860B] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-2xs group"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#B8860B] group-hover:-translate-x-1 transition-transform" />
          <span>← Back to Bag</span>
        </button>

        <span className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-[#8C6D1F] flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#D4AF37]" />
          PREMIUM 3D GATEWAY PREVIEW
        </span>
      </div>

      {/* Hero 3D Interactive Stage */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#232328] via-[#1B1B1F] to-[#121214] p-5 sm:p-6 text-white border-2 border-[#D4AF37]/60 shadow-xl">
        {/* Ambient Gold & Metallic Glow */}
        <div className="absolute -top-20 -right-20 w-56 h-56 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-slate-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* 3D Method Switcher Pills */}
        <div className="relative z-10 flex items-center justify-center gap-2 mb-4">
          <button
            type="button"
            onClick={() => setActiveTab('card')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'card'
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black shadow-md'
                : 'bg-white/10 text-gray-300 hover:bg-white/15'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>3D Metallic Card</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('upi')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'upi'
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black shadow-md'
                : 'bg-white/10 text-gray-300 hover:bg-white/15'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>UPI Matrix</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('qr')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'qr'
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black shadow-md'
                : 'bg-white/10 text-gray-300 hover:bg-white/15'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Laser QR Scan</span>
          </button>
        </div>

        {/* 3D VIEWPORT CONTAINER */}
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative z-10 min-h-[220px] sm:min-h-[240px] flex items-center justify-center perspective-[1200px]"
        >
          {/* TAB 1: 3D GREY METALLIC LUXURY CARD */}
          {activeTab === 'card' && (
            <div
              style={{
                transform: `rotateX(${cardRotate.x}deg) rotateY(${cardRotate.y}deg)`,
                transition: cardRotate.x === 0 ? 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)' : 'transform 0.08s ease-out',
                transformStyle: 'preserve-3d',
              }}
              className="relative w-full max-w-[340px] sm:max-w-[370px] aspect-[1.586/1] rounded-2xl p-5 shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing border border-slate-600/80 bg-gradient-to-br from-[#3A3A42] via-[#24242A] to-[#17171B]"
            >
              {/* Metallic Brushed Texture Overlay */}
              <div
                className="absolute inset-0 opacity-25 mix-blend-overlay pointer-events-none"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(45deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 4px)',
                }}
              />

              {/* Dynamic Holographic Specular Sheen */}
              <div
                className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none transition-transform duration-300"
                style={{
                  transform: `translate(${cardRotate.y * 3}px, ${cardRotate.x * 3}px)`,
                }}
              />

              {/* Card Top: Monogram & Bank Title */}
              <div className="relative z-10 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#111113] border border-[#D4AF37] p-1 flex items-center justify-center">
                    <UploadedLogoMark className="w-full h-full" color="#D4AF37" />
                  </div>
                  <div>
                    <span className="font-bodoni font-black tracking-[0.18em] uppercase text-xs text-[#F2D68A] block leading-none">
                      LAP OF LUXURY
                    </span>
                    <span className="text-[8px] tracking-[0.25em] text-gray-400 uppercase font-semibold">
                      TITANIUM ELITE
                    </span>
                  </div>
                </div>

                {/* Contactless waves icon */}
                <div className="flex items-center gap-1 opacity-70">
                  <Radio className="w-4 h-4 text-[#D4AF37] rotate-90" />
                </div>
              </div>

              {/* Card Middle: Gold Chip & Hologram */}
              <div className="relative z-10 my-4 flex items-center justify-between">
                {/* 3D Gold EMV Chip */}
                <div className="w-10 h-7 rounded-md bg-gradient-to-br from-[#F5D88C] via-[#C99C3B] to-[#E8CA7E] border border-[#FFE7A8] shadow-inner p-1 relative overflow-hidden">
                  <div className="w-full h-full border border-black/20 rounded-xs flex items-center justify-center">
                    <div className="w-full h-[1px] bg-black/30" />
                  </div>
                </div>

                {/* Hologram Badge */}
                <div className="px-2 py-0.5 rounded-md bg-gradient-to-r from-emerald-400/20 via-purple-400/20 to-amber-400/20 border border-white/20 text-[8px] font-bold tracking-widest text-gray-300 uppercase backdrop-blur-xs">
                  2026 EDITION
                </div>
              </div>

              {/* Card Number: Embossed Metallic */}
              <div className="relative z-10 mb-2">
                <p className="font-mono text-sm sm:text-base tracking-[0.22em] text-[#E5D7B7] font-bold drop-shadow-sm">
                  •••• •••• •••• 2026
                </p>
              </div>

              {/* Card Bottom: Holder Name & Expiry */}
              <div className="relative z-10 flex items-end justify-between text-[9px] uppercase tracking-wider text-gray-300 font-mono">
                <div>
                  <span className="text-[7px] text-gray-500 block">CARDHOLDER</span>
                  <span className="font-bold text-white tracking-widest">VIP VALUED CLIENT</span>
                </div>
                <div>
                  <span className="text-[7px] text-gray-500 block">VALID THRU</span>
                  <span className="font-bold text-white">08/29</span>
                </div>
                <div className="font-sans font-black italic text-xs text-[#D4AF37] tracking-tighter">
                  VISA <span className="text-white text-[8px] font-normal not-italic">Infinite</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ANIMATED UPI 3D FLOATING MATRIX */}
          {activeTab === 'upi' && (
            <div className="w-full max-w-sm flex flex-col items-center justify-center text-center p-4 space-y-4 animate-in zoom-in-95 duration-200">
              {/* Central Glowing UPI Orb */}
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#2D2D33] to-[#18181B] border-2 border-[#D4AF37] flex items-center justify-center shadow-2xl shadow-[#D4AF37]/20 animate-pulse">
                  <Smartphone className="w-10 h-10 text-[#D4AF37]" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#1E1E22] flex items-center justify-center text-[10px]">
                  ✓
                </div>
              </div>

              {/* Floating UPI Provider Badges */}
              <div className="grid grid-cols-4 gap-2 w-full pt-1">
                {[
                  { name: 'Google Pay', icon: 'GPay', color: 'from-blue-500/20 to-blue-600/30 border-blue-400/40' },
                  { name: 'PhonePe', icon: 'PhonePe', color: 'from-purple-500/20 to-purple-600/30 border-purple-400/40' },
                  { name: 'Paytm UPI', icon: 'Paytm', color: 'from-cyan-500/20 to-cyan-600/30 border-cyan-400/40' },
                  { name: 'BHIM UPI', icon: 'BHIM', color: 'from-amber-500/20 to-amber-600/30 border-amber-400/40' },
                ].map((item) => (
                  <div
                    key={item.name}
                    className={`p-2 rounded-xl border bg-gradient-to-b ${item.color} backdrop-blur-xs text-center transition-transform hover:scale-105`}
                  >
                    <span className="text-[10px] font-bold text-white block truncate">{item.icon}</span>
                    <span className="text-[8px] text-gray-400 block uppercase">Instant</span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-300 font-medium max-w-xs">
                Zero-friction instant UPI intent & dynamic deep-linking engine in certification.
              </p>
            </div>
          )}

          {/* TAB 3: ANIMATED LASER SCAN QR GLASS TILE */}
          {activeTab === 'qr' && (
            <div className="w-full max-w-xs flex flex-col items-center justify-center text-center p-3 animate-in zoom-in-95 duration-200">
              <div className="relative w-36 h-36 rounded-2xl bg-white p-3 shadow-2xl border-2 border-[#D4AF37] overflow-hidden">
                {/* QR Symbol Matrix Placeholder */}
                <div className="w-full h-full flex items-center justify-center text-black">
                  <QrCode className="w-28 h-28 text-slate-900" />
                </div>

                {/* Sweeping Laser Scan Line */}
                <div
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent shadow-[0_0_12px_#D4AF37]"
                  style={{
                    animation: 'scannerMove 2s ease-in-out infinite alternate',
                  }}
                />
              </div>

              <div className="mt-3 flex items-center gap-1.5 text-xs text-[#D4AF37] font-mono">
                <ShieldCheck className="w-4 h-4" />
                <span>DYNAMIC QR ENGINE READY</span>
              </div>
            </div>
          )}
        </div>

        {/* Status Callout Banner */}
        <div className="relative z-10 mt-4 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="text-gray-300 text-[11px]">
              Direct Card & UPI Processing: <strong>Deploying Soon</strong>
            </span>
          </div>

          <span className="font-mono text-xs font-bold text-[#F3D78E]">
            Order Total: ₹{orderTotal.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Immediate Order Reservation Module */}
      <div className="bg-white rounded-2xl p-5 border border-[#E0D5C3] shadow-xs space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-[#FAF3E6] border border-[#D4AF37] flex items-center justify-center text-[#B8860B] shrink-0 mt-0.5">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bodoni font-bold text-sm text-[#111111] uppercase tracking-wider">
              RESERVE YOUR ORDER NOW (CASH ON DELIVERY)
            </h4>
            <p className="text-xs text-[#6E6152] mt-0.5 leading-relaxed">
              While our automated online gateway is in final staging, you can instantly confirm your order with <strong>Cash on Delivery (Doorstep Payment)</strong> or direct phone concierge verification.
            </p>
          </div>
        </div>

        <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE0D0] text-xs text-[#524637] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-[#B89758]" />
            <span>Mahbubnagar Store Concierge: <strong>75 7888 7888</strong></span>
          </div>
          <span className="text-emerald-700 font-bold text-[11px]">FREE Delivery Active</span>
        </div>

        {/* Dual Actions: Proceed COD / Back Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2">
          <button
            type="button"
            onClick={onBackToCart}
            className="px-4 py-3 rounded-xl border border-[#D5C7B0] bg-white hover:bg-[#FAF8F5] text-[#33333A] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5 order-2 sm:order-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← Return to Bag</span>
          </button>

          <button
            type="button"
            onClick={onProceedCOD}
            className="flex-1 py-3.5 bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#B8860B] hover:brightness-105 text-[#111111] font-black text-xs sm:text-sm tracking-[0.16em] uppercase rounded-xl shadow-md transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2 order-1 sm:order-2"
          >
            <Lock className="w-4 h-4" />
            <span>CONTINUE WITH CASH ON DELIVERY (₹{orderTotal.toLocaleString('en-IN')})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scannerMove {
          0% { top: 8px; }
          100% { top: 120px; }
        }
      `}</style>
    </div>
  );
};

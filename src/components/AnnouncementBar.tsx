import React, { useState, useEffect } from 'react';
import { Sparkles, Phone, ShieldCheck, ChevronRight } from 'lucide-react';

interface AnnouncementBarProps {
  onOpenContact?: () => void;
}

const MESSAGES = [
  'Complimentary Express Delivery Across India on Orders ₹2,999+',
  'The Festive Couture Edit is Now Live · Handcrafted Luxury',
  'Authentic Artisan Craftsmanship · 100% Genuine Guaranteed',
  'Boutique Concierge & Styling Assistance: +91 9848263939',
];

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onOpenContact }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#111113] text-[#E8DFC8] border-b border-[#D4AF37]/20 text-[11px] py-2 px-3 sm:px-6 flex items-center justify-between select-none">
      {/* Left: Country / Currency & Boutique Location */}
      <div className="hidden md:flex items-center gap-3 text-[#A89F91]">
        <span className="flex items-center gap-1.5 font-medium tracking-wider">
          <span className="text-xs">🇮🇳</span>
          <span className="text-[10px] uppercase font-semibold text-[#D4AF37]">INDIA · INR (₹)</span>
        </span>
        <span className="text-[#3A352E]">|</span>
        <span className="text-[10px] tracking-wide text-[#8C8274]">
          Atelier Boutique · Mahbubnagar
        </span>
      </div>

      {/* Center: Rotating Editorial Announcement */}
      <div className="flex-1 flex items-center justify-center text-center overflow-hidden px-2">
        <div className="flex items-center gap-2 animate-in fade-in duration-500 key={currentIndex}">
          <Sparkles className="w-3 h-3 text-[#D4AF37] shrink-0" />
          <span className="font-medium tracking-[0.06em] text-white text-[11px] sm:text-xs">
            {MESSAGES[currentIndex]}
          </span>
        </div>
      </div>

      {/* Right: Personal Stylist / Concierge & Track */}
      <div className="hidden sm:flex items-center gap-3 text-[10px] text-[#A89F91] shrink-0 font-medium tracking-wider uppercase">
        <button
          type="button"
          onClick={onOpenContact}
          className="hover:text-[#D4AF37] transition-colors flex items-center gap-1 cursor-pointer"
        >
          <Phone className="w-3 h-3 text-[#D4AF37]" />
          <span>Concierge</span>
        </button>
        <span className="text-[#3A352E]">|</span>
        <span className="text-[#8C8274]">Original Luxury</span>
      </div>
    </div>
  );
};

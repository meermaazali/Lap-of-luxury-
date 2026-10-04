import React from 'react';
import { X, Gem, Award, ShieldCheck, HeartHandshake } from 'lucide-react';
import { BrandLogo } from '../BrandLogo';

interface OurStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OurStoryModal: React.FC<OurStoryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl border border-[#D5C2A5] shadow-2xl overflow-hidden relative my-6">
        {/* Header */}
        <div className="px-6 py-5 bg-[#FAF8F5] border-b border-[#E8DFC8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-[#111111] hover:text-[#B89758] border border-[#D5C7B0] rounded-lg hover:bg-white transition-colors cursor-pointer"
            >
              ← Back to Store
            </button>
            <BrandLogo variant="header" showSubtitle={false} size="sm" />
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-[#D5C7B0] hover:bg-[#F2EDE2] flex items-center justify-center text-[#111111] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 text-[#3D3327]">
          <div>
            <span className="font-editorial text-xs italic tracking-[0.2em] uppercase text-[#8C6D1F] font-bold">
              Heritage & Craftsmanship
            </span>
            <h2 className="font-bodoni text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-[#111111] mt-1">
              MORE THAN A STORE. IT'S A LIFESTYLE.
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-[#5C5040] leading-relaxed">
            Founded with an uncompromising devotion to sartorial elegance, <strong>LAP OF LUXURY</strong> was established in Mahabubnagar to bring world-class tailoring, Italian leathercraft, and precision horology directly to discerning clients across Telangana and beyond.
          </p>

          <p className="text-xs sm:text-sm text-[#5C5040] leading-relaxed">
            Every garment in our collection — from our ₹1,000 double-ply Egyptian cotton shirts to our ₹1,200 Japanese selvedge denim jeans — undergoes rigorous inspections for stitch density, button durability, and structural drape.
          </p>

          {/* Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8DEC8] text-center">
              <Gem className="w-6 h-6 text-[#B89758] mx-auto mb-2" />
              <h4 className="font-bodoni font-bold text-xs uppercase tracking-wider text-[#111111]">
                PURE LUXURY
              </h4>
              <p className="text-[11px] text-[#6B5F50] mt-1">
                Hand-picked fabrics, mother-of-pearl buttons, and genuine full-grain leathers.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8DEC8] text-center">
              <Award className="w-6 h-6 text-[#B89758] mx-auto mb-2" />
              <h4 className="font-bodoni font-bold text-xs uppercase tracking-wider text-[#111111]">
                MASTER FIT
              </h4>
              <p className="text-[11px] text-[#6B5F50] mt-1">
                Engineered contours crafted for commanding presence and all-day comfort.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8DEC8] text-center">
              <HeartHandshake className="w-6 h-6 text-[#B89758] mx-auto mb-2" />
              <h4 className="font-bodoni font-bold text-xs uppercase tracking-wider text-[#111111]">
                WHITE GLOVE CARE
              </h4>
              <p className="text-[11px] text-[#6B5F50] mt-1">
                Personal concierge support, 7-day exchanges, and verified delivery.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E8DEC8] flex items-center justify-between text-xs text-[#7A6C58]">
            <span>Mahabubnagar Flagship · Telangana</span>
            <span className="font-bold text-[#111111]">Direct Line: 75 7888 7888</span>
          </div>
        </div>
      </div>
    </div>
  );
};

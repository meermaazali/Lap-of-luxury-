import React from 'react';
import { X } from 'lucide-react';
import { UploadedLogoMark } from '../UploadedLogoMark';

interface AboutUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * About Us Modal
 * Exact content approved by user with clean, simple, and readable typography.
 */
export const AboutUsModal: React.FC<AboutUsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 select-none"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-xl rounded-2xl border border-[#D5C2A5] shadow-2xl overflow-hidden relative my-6 text-[#1A1816]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-5 sm:px-6 py-4 bg-[#FAF8F5] border-b border-[#E8DFC8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#111111] hover:text-[#B89758] border border-[#D5C7B0] rounded-lg hover:bg-white transition-colors cursor-pointer"
            >
              ← Back
            </button>
            <div className="flex items-center gap-2.5">
              <UploadedLogoMark className="w-10 h-10" color="#111113" />
              <div>
                <span className="font-serif tracking-wider font-semibold uppercase text-xs sm:text-sm text-[#111113] block">
                  LAP OF LUXURY
                </span>
                <span className="text-[10px] text-[#7A6C58]">
                  About Our Brand
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close About Us"
            className="w-8 h-8 rounded-full border border-[#D5C7B0] hover:bg-[#F2EDE2] flex items-center justify-center text-[#111111] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content with exact requested text */}
        <div className="p-6 sm:p-8 space-y-5 leading-relaxed font-sans text-sm sm:text-[15px] text-[#2C241E]">
          <h2 className="font-serif text-xl sm:text-2xl font-normal tracking-wide text-[#111113] border-b border-[#E8DFC8] pb-3">
            About LAP OF LUXURY
          </h2>

          <p className="font-normal text-[#382F26]">
            LAP OF LUXURY is a premium fashion and lifestyle brand created for those who believe style is more than what you wear—it is an expression of who you are.
          </p>

          <p className="font-normal text-[#382F26]">
            We bring together carefully selected premium clothing, footwear, watches, handbags, perfumes and lifestyle accessories, combining contemporary trends with timeless elegance.
          </p>

          <p className="font-normal text-[#382F26]">
            Our philosophy is simple: quality, sophistication and individuality. Every product is selected to deliver a refined experience, from the first look to the final touch.
          </p>

          <p className="font-normal text-[#382F26]">
            At LAP OF LUXURY, we believe everyone deserves to experience premium fashion.
          </p>

          {/* Closing Brand Signoff */}
          <div className="pt-4 border-t border-[#E8DFC8] text-center sm:text-left">
            <p className="font-serif tracking-[0.16em] uppercase text-sm font-semibold text-[#111113]">
              LAP OF LUXURY
            </p>
            <p className="text-xs sm:text-sm font-normal text-[#B8860B] mt-1 tracking-wider">
              Experience Premium in Every Touch.
            </p>
          </div>
        </div>

        {/* Footer with Store Hours & Close Button */}
        <div className="px-6 py-3.5 bg-[#FAF8F5] border-t border-[#E8DFC8] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#5C4F3C]">
          <span className="font-normal">
            Store Timings: 9:30 AM – 10:00 PM
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-[#111113] text-white text-xs font-medium hover:bg-[#B8860B] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

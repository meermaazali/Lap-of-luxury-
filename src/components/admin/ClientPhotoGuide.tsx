import React from 'react';
import {
  Image as ImageIcon,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Smartphone,
  Monitor,
  Tv,
  Layers,
  ShoppingBag,
  Sliders,
  Upload,
  AlertTriangle,
  FileCheck,
} from 'lucide-react';

export const ClientPhotoGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1A1A1E] via-[#242019] to-[#1A1A1E] text-white p-6 rounded-2xl border-2 border-[#D4AF37]/70 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1.5 rounded-lg bg-[#D4AF37] text-black">
                <Sparkles className="w-5 h-5" />
              </span>
              <span className="text-[10px] uppercase tracking-[0.22em] font-extrabold text-[#D4AF37]">
                OFFICIAL CLIENT HANDBOOK
              </span>
            </div>
            <h2 className="font-bodoni text-xl sm:text-2xl font-bold tracking-wider uppercase text-white">
              PHOTO UPLOAD & DIMENSIONS GUIDE
            </h2>
            <p className="text-xs text-gray-300 mt-1 max-w-2xl leading-relaxed">
              Complete guide for store owners on which photos to upload, recommended image sizes, aspect ratios, and how to upload directly from your computer or phone without typing links.
            </p>
          </div>

          <div className="bg-white/10 border border-[#D4AF37]/50 rounded-xl p-3.5 text-xs text-[#E5C07B] space-y-1 shrink-0">
            <p className="font-bold flex items-center gap-1.5 text-white">
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
              <span>Direct File Upload Enabled</span>
            </p>
            <p className="text-[11px] text-gray-300">
              No URLs or links needed. Select photos directly from your device.
            </p>
          </div>
        </div>
      </div>

      {/* 3 Main Categories Cards: Hero Banner, Products, Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Main Flagship Banner */}
        <div className="bg-white rounded-2xl p-5 border-2 border-[#D4AF37]/50 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="p-2 rounded-xl bg-[#FAF6EE] text-[#B8860B] border border-[#E8DEC8]">
                <Sliders className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-black text-[#D4AF37] px-2.5 py-1 rounded-full">
                16:9 Widescreen
              </span>
            </div>

            <h3 className="font-bodoni text-base font-bold text-[#111113] uppercase tracking-wide">
              1. MAIN HERO BANNER
            </h3>
            <p className="text-xs text-[#7A6C58] mt-1 mb-4">
              The flagship showcase at the very top of your homepage.
            </p>

            {/* Aspect Ratio Diagram */}
            <div className="w-full aspect-[16/9] bg-[#1A1815] rounded-xl border-2 border-[#D4AF37]/40 flex flex-col items-center justify-center text-white mb-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
              <Monitor className="w-8 h-8 text-[#D4AF37] mb-1" />
              <span className="text-xs font-mono font-bold text-[#E5C07B]">1920 × 1080 px</span>
              <span className="text-[9px] text-gray-400 font-sans uppercase">Aspect Ratio 16:9</span>
            </div>

            <div className="space-y-2 text-xs text-[#4A4033]">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Recommended Size:</strong> 1920 × 1080 px (minimum 1600 × 900 px).
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Style:</strong> Horizontal luxury photoshoot with models, lifestyle scenery, or flagship boutique showcase.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Device Scaling:</strong> Keeps full width on Laptops, 4K TVs, and auto-centers cleanly on smartphones.
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F0E6D2] text-[11px] text-[#7A6C58]">
            📍 Edit in: <strong>Banners & Slider</strong> tab
          </div>
        </div>

        {/* Card 2: Product Images */}
        <div className="bg-white rounded-2xl p-5 border-2 border-[#D4AF37]/50 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="p-2 rounded-xl bg-[#FAF6EE] text-[#B8860B] border border-[#E8DEC8]">
                <ShoppingBag className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-black text-[#D4AF37] px-2.5 py-1 rounded-full">
                1:1 Square or 4:5
              </span>
            </div>

            <h3 className="font-bodoni text-base font-bold text-[#111113] uppercase tracking-wide">
              2. PRODUCT PHOTOS
            </h3>
            <p className="text-xs text-[#7A6C58] mt-1 mb-4">
              All catalogue items (Shirts, Watches, Bags, Footwear, Perfumes).
            </p>

            {/* Aspect Ratio Diagram */}
            <div className="w-full aspect-square max-h-[175px] mx-auto bg-[#FAF8F5] rounded-xl border-2 border-[#D4AF37]/40 flex flex-col items-center justify-center text-[#1E1E22] mb-4 relative overflow-hidden">
              <ImageIcon className="w-8 h-8 text-[#B8860B] mb-1" />
              <span className="text-xs font-mono font-bold text-[#1E1E22]">1000 × 1000 px</span>
              <span className="text-[9px] text-[#7A6C58] font-sans uppercase">Aspect Ratio 1:1 or 4:5</span>
            </div>

            <div className="space-y-2 text-xs text-[#4A4033]">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Recommended Size:</strong> 1000 × 1000 px (square) or 800 × 1000 px (portrait).
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Background:</strong> Clean plain white, cream, warm beige, or minimal marble so product stands out.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Secondary Image (Optional):</strong> Detail shot, fabric zoom, or back view.
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F0E6D2] text-[11px] text-[#7A6C58]">
            📍 Edit in: <strong>Products</strong> tab
          </div>
        </div>

        {/* Card 3: Shop By Category Tiles */}
        <div className="bg-white rounded-2xl p-5 border-2 border-[#D4AF37]/50 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="p-2 rounded-xl bg-[#FAF6EE] text-[#B8860B] border border-[#E8DEC8]">
                <Layers className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-black text-[#D4AF37] px-2.5 py-1 rounded-full">
                1:1 Square Icon
              </span>
            </div>

            <h3 className="font-bodoni text-base font-bold text-[#111113] uppercase tracking-wide">
              3. CATEGORY TILES
            </h3>
            <p className="text-xs text-[#7A6C58] mt-1 mb-4">
              The 8 visual round/square category tiles under the hero banner.
            </p>

            {/* Aspect Ratio Diagram */}
            <div className="w-full aspect-square max-h-[175px] mx-auto bg-[#FAF8F5] rounded-xl border-2 border-[#D4AF37]/40 flex flex-col items-center justify-center text-[#1E1E22] mb-4 relative overflow-hidden">
              <div className="w-14 h-14 rounded-full bg-[#FAF5E8] border border-[#D4AF37] flex items-center justify-center mb-1">
                <Layers className="w-6 h-6 text-[#B8860B]" />
              </div>
              <span className="text-xs font-mono font-bold text-[#1E1E22]">500 × 500 px</span>
              <span className="text-[9px] text-[#7A6C58] font-sans uppercase">Aspect Ratio 1:1</span>
            </div>

            <div className="space-y-2 text-xs text-[#4A4033]">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Recommended Size:</strong> 500 × 500 px (square).
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Subject:</strong> Centered close-up of item (e.g. golden blazer, luxury handbag, watch face).
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Mobile:</strong> Displays neatly in 4 columns without clipping on mobile screens.
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F0E6D2] text-[11px] text-[#7A6C58]">
            📍 Edit in: <strong>Categories</strong> tab
          </div>
        </div>
      </div>

      {/* Step-by-Step "How to Use" Instructions for Clients (Zero Technical Hassle) */}
      <div className="bg-white rounded-2xl p-6 border border-[#E0D5C3] shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-[#F0E6D2] pb-3">
          <Upload className="w-5 h-5 text-[#B8860B]" />
          <h3 className="font-bodoni text-lg font-bold uppercase tracking-wider text-[#111113]">
            HOW TO UPLOAD PHOTOS (STEP-BY-STEP FOR CLIENTS)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E8DEC8]">
            <span className="w-7 h-7 rounded-full bg-[#111113] text-[#D4AF37] font-bold text-xs flex items-center justify-center mb-2.5">
              1
            </span>
            <h4 className="text-xs font-bold text-[#111113] uppercase tracking-wide mb-1">
              Click Upload Button
            </h4>
            <p className="text-[11px] text-[#6B5E4E] leading-relaxed">
              In any manager (Banner, Product, or Category), click the golden <strong>"Upload Photo from Device"</strong> button.
            </p>
          </div>

          <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E8DEC8]">
            <span className="w-7 h-7 rounded-full bg-[#111113] text-[#D4AF37] font-bold text-xs flex items-center justify-center mb-2.5">
              2
            </span>
            <h4 className="text-xs font-bold text-[#111113] uppercase tracking-wide mb-1">
              Select Your Photo
            </h4>
            <p className="text-[11px] text-[#6B5E4E] leading-relaxed">
              Pick your JPG, PNG, or WebP photo directly from your laptop or smartphone gallery. No URLs needed!
            </p>
          </div>

          <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E8DEC8]">
            <span className="w-7 h-7 rounded-full bg-[#111113] text-[#D4AF37] font-bold text-xs flex items-center justify-center mb-2.5">
              3
            </span>
            <h4 className="text-xs font-bold text-[#111113] uppercase tracking-wide mb-1">
              Check Live Preview
            </h4>
            <p className="text-[11px] text-[#6B5E4E] leading-relaxed">
              The preview box updates instantly so you can see exactly how it will appear to customers before publishing.
            </p>
          </div>

          <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E8DEC8]">
            <span className="w-7 h-7 rounded-full bg-[#111113] text-[#D4AF37] font-bold text-xs flex items-center justify-center mb-2.5">
              4
            </span>
            <h4 className="text-xs font-bold text-[#111113] uppercase tracking-wide mb-1">
              Click Save Changes
            </h4>
            <p className="text-[11px] text-[#6B5E4E] leading-relaxed">
              Click <strong>"Save"</strong>. Your new image is immediately published live on the store and works on Vercel automatically.
            </p>
          </div>
        </div>
      </div>

      {/* Safety & Fallback Guarantee */}
      <div className="bg-[#FAF5E8] border-2 border-[#D4AF37] rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <FileCheck className="w-6 h-6 text-[#967018] shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#382B09]">
              LIVE IMAGE FALLBACK PROTECTION (VERCEL COMPLIANT)
            </h4>
            <p className="text-[11px] text-[#5C4A19] mt-0.5 leading-relaxed">
              The website has built-in smart fallback protection. If an image path is ever missing or offline, the boutique automatically swaps in an official luxury brand asset so your storefront is <strong>never broken and has zero blank boxes</strong>.
            </p>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <span className="text-[10px] font-bold bg-[#111113] text-[#D4AF37] px-3 py-1.5 rounded-lg uppercase tracking-wider">
            100% Fail-Safe Guarantee
          </span>
        </div>
      </div>
    </div>
  );
};

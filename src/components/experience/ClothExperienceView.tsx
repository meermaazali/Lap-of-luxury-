import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  Layers,
  ChevronRight,
  ChevronLeft,
  X,
  Check,
  RotateCcw,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ThreeClothCanvas, FabricType } from './ThreeClothCanvas';
import { MacroWeaveLoupe } from './MacroWeaveLoupe';
import { soundManager } from './SoundManager';
import { UploadedLogoMark } from '../UploadedLogoMark';
import { normalizeImageUrl, FALLBACK_LUXURY_IMAGE } from '../../utils/imageUtils';

interface Chapter {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  poeticVerse: string;
  fabric: FabricType;
  fabricName: string;
  threadSpec: string;
  productId: string;
  specs: string[];
}

const CHAPTERS: Chapter[] = [
  {
    id: 'prologue',
    number: '00',
    title: 'THE POETRY OF TACTILE LUXURY',
    subtitle: 'Where Master Craftsmanship Meets Fluid Motion',
    poeticVerse:
      'True luxury is not merely seen; it is felt in the unbroken whisper of two-ply cotton, the heavy resilience of unwashed selvedge, and the quiet dignity of hand-finished seams.',
    fabric: 'silk',
    fabricName: 'Imperial Silk & Egyptian Cotton',
    threadSpec: 'Double-Ply 120/2 Combed Staple · Zero synthetic blend',
    productId: 'prod-1',
    specs: ['Giza Long-Staple Cotton', 'Mother-of-Pearl Fasteners', 'Single-Needle French Seams'],
  },
  {
    id: 'shirt',
    number: '01',
    title: 'THE DOUBLE-PLY WEAVE',
    subtitle: 'Tailored Egyptian Cotton Shirt · ₹1,000',
    poeticVerse:
      'Spun from long-staple Egyptian riverbanks, two strands intertwined into one unbroken cord. Breathable, structured, and commanding an effortless quiet authority.',
    fabric: 'silk',
    fabricName: '120s Egyptian Double-Ply Cotton',
    threadSpec: 'High-density pinpoint weave · 140 grams/sqm',
    productId: 'prod-1',
    specs: ['Pure Mother-of-Pearl Buttons', 'Structured Spread Collar', 'The Festive Edit Exclusive'],
  },
  {
    id: 'denim',
    number: '02',
    title: 'THE SHUTTLE LOOM WEFT',
    subtitle: '14.5oz Raw Indigo Selvedge Denim · ₹1,200',
    poeticVerse:
      'Woven on slow, rhythmic vintage wooden shuttle looms. The white-and-gold selvedge tape seals the perimeter, resisting fray for a lifetime of personal contours.',
    fabric: 'denim',
    fabricName: 'Kurabo Raw Indigo Selvedge',
    threadSpec: 'Ring-spun American cotton warp · Natural indigo vat-dyed',
    productId: 'prod-2',
    specs: ['Gold Selvedge ID Ticking', 'Solid Antique Brass Hardware', 'Sanforized Ergonomic Cut'],
  },
  {
    id: 'watch',
    number: '03',
    title: 'THE HOROLOGICAL PULSE',
    subtitle: '18K Gilded Automatic Chronograph · ₹3,499',
    poeticVerse:
      'A mechanical heartbeat driven by the wearer’s own kinetic movement. Anti-reflective sapphire crystal encasing a sunburst dial of brushed 18-karat gold.',
    fabric: 'gold',
    fabricName: 'Liquid 24K Metallurgical Lamé',
    threadSpec: 'Micro-polished 18k brushed gold alloy & sapphire crystal',
    productId: 'prod-3',
    specs: ['21-Jewel Automatic Caliber', 'Sapphire Glass Coating', '50M Water Resistance'],
  },
  {
    id: 'bag',
    number: '04',
    title: 'THE SCULPTED GRAIN',
    subtitle: 'Hand-Stitched Tuscan Calfskin · ₹3,499',
    poeticVerse:
      'Full-grain calfskin selected for unbroken grain fidelity. Hand-waxed saddle stitching ensures enduring structural silhouette and tactile warmth.',
    fabric: 'noir',
    fabricName: 'Sculpted Tuscan Grain Leather',
    threadSpec: 'Full-Grain Calfskin · Waxed Linen Thread · 8 stitches/inch',
    productId: 'prod-4',
    specs: ['Hand-Beveled Edge Coating', 'Solid Brass Padlock & Key', 'Detachable Shoulder Strap'],
  },
  {
    id: 'perfume',
    number: '05',
    title: 'THE OLFACTORY SILLAGE',
    subtitle: 'Royal Amber Oud Extrait · ₹2,499',
    poeticVerse:
      'A dense harmonic sillage of aged agarwood, Bourbon vanilla, and velvety Damascene rose. An invisible garment that lingers long after departure.',
    fabric: 'gold',
    fabricName: 'Golden Amber Essence Vapour',
    threadSpec: '32% Extrait de Parfum Concentration · Natural Botanicals',
    productId: 'prod-7',
    specs: ['Aged Cambodian Agarwood', 'Turkish Damascena Rose', 'Bourbon Vanilla Bean'],
  },
];

interface ClothExperienceViewProps {
  onClose: () => void;
}

export const ClothExperienceView: React.FC<ClothExperienceViewProps> = ({ onClose }) => {
  const { products, addToCart, setIsCheckoutOpen, setIsCartOpen, cartCount } = useStore();

  const [currentChapterIdx, setCurrentChapterIdx] = useState(0);
  const [selectedFabricOverride, setSelectedFabricOverride] = useState<FabricType | null>(null);
  const [isAudioActive, setIsAudioActive] = useState(!soundManager.getIsMuted());
  const [isAddedSuccess, setIsAddedSuccess] = useState(false);

  const chapter = CHAPTERS[currentChapterIdx];
  const activeFabric = selectedFabricOverride || chapter.fabric;

  const currentProduct = products.find((p) => p.id === chapter.productId) || products[0];

  const handleNext = () => {
    if (currentChapterIdx < CHAPTERS.length - 1) {
      setCurrentChapterIdx((prev) => prev + 1);
      setSelectedFabricOverride(null);
      soundManager.playChime(1.1);
    }
  };

  const handlePrev = () => {
    if (currentChapterIdx > 0) {
      setCurrentChapterIdx((prev) => prev - 1);
      setSelectedFabricOverride(null);
      soundManager.playChime(0.9);
    }
  };

  const toggleSound = () => {
    const newState = !isAudioActive;
    setIsAudioActive(newState);
    soundManager.setMuted(!newState);
  };

  const handleAddToCart = () => {
    if (currentProduct) {
      addToCart(currentProduct, currentProduct.sizes[0] || 'Standard', 1);
      setIsAddedSuccess(true);
      soundManager.playChime(1.3);
      setTimeout(() => setIsAddedSuccess(false), 2000);
    }
  };

  const handleQuickCheckout = () => {
    if (currentProduct) {
      addToCart(currentProduct, currentProduct.sizes[0] || 'Standard', 1);
      onClose();
      setIsCheckoutOpen(true);
    }
  };

  // Keyboard navigation (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') handleNext();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') handlePrev();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentChapterIdx]);

  return (
    <div className="fixed inset-0 z-[150] bg-[#0E0E11] text-[#FAF8F5] flex flex-col justify-between overflow-hidden select-none animate-in fade-in duration-500 font-sans">
      {/* 1. Full-Screen 3D Interactive WebGL Cloth Simulation Canvas */}
      <div className="absolute inset-0 z-0">
        <ThreeClothCanvas
          fabric={activeFabric}
          interactive={true}
          accentText={`Chapter ${chapter.number} · ${chapter.fabricName}`}
        />
      </div>

      {/* 2. Top Luxury Navigation Bar */}
      <header className="relative z-20 px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between border-b border-white/10 bg-gradient-to-b from-black/80 via-black/40 to-transparent backdrop-blur-xs">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-black/60 border border-[#D4AF37] p-1 flex items-center justify-center shadow-lg">
            <UploadedLogoMark className="w-full h-full" color="#D4AF37" />
          </div>
          <div>
            <h1 className="font-bodoni font-black tracking-[0.24em] text-sm sm:text-base uppercase text-white leading-none">
              LAP OF LUXURY
            </h1>
            <span className="font-mono text-[9px] tracking-[0.28em] uppercase text-[#D4AF37] block mt-0.5">
              EXPERIENTIAL 3D TEXTILE VOYAGE
            </span>
          </div>
        </div>

        {/* Right: Sound Toggle, Cart, and Return Button */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Ambient Soundscape Toggle */}
          <button
            onClick={toggleSound}
            className={`px-3 py-1.5 rounded-full border text-xs font-mono tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              isAudioActive
                ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#F3E1A6] shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                : 'bg-black/50 border-white/20 text-gray-400 hover:text-white'
            }`}
            title="Toggle Ambient Soundscape"
          >
            {isAudioActive ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="hidden sm:inline">SOUND ON</span>
                {/* Micro Animated Sound Wave Equalizer Bars */}
                <div className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 h-2 bg-[#D4AF37] animate-pulse" />
                  <span className="w-0.5 h-3 bg-[#D4AF37] animate-bounce" />
                  <span className="w-0.5 h-1.5 bg-[#D4AF37] animate-pulse" />
                </div>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">MUTED</span>
              </>
            )}
          </button>

          {/* Cart Bag trigger */}
          <button
            onClick={() => {
              onClose();
              setIsCartOpen(true);
            }}
            className="relative px-3 py-1.5 rounded-full border border-white/20 bg-black/50 hover:bg-black/80 text-white text-xs font-mono tracking-wider flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="hidden sm:inline">BAG</span>
            {cartCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#D4AF37] text-black text-[10px] font-bold">
                {cartCount}
              </span>
            )}
          </button>

          {/* Close / Return to Boutique */}
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-white text-xs font-mono uppercase tracking-widest transition-all cursor-pointer group"
          >
            <span>Exit 3D</span>
            <X className="w-3.5 h-3.5 text-[#D4AF37] group-hover:rotate-90 transition-transform" />
          </button>
        </div>
      </header>

      {/* 3. Main Center Stage: Poetic Chapter Storytelling & Garment Card */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-6 w-full flex-1 flex flex-col lg:flex-row items-center justify-between gap-8 pointer-events-none">
        {/* Left Column: Poetic Narrative Text (David Whyte style) */}
        <div className="max-w-xl space-y-4 pointer-events-auto animate-in slide-in-from-left duration-500">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs sm:text-sm font-bold text-[#D4AF37] tracking-[0.3em]">
              CHAPTER {chapter.number}
            </span>
            <span className="h-[1px] w-12 bg-[#D4AF37]/50" />
            <span className="text-[11px] font-mono tracking-widest text-gray-400 uppercase">
              {currentChapterIdx + 1} OF {CHAPTERS.length}
            </span>
          </div>

          <h2 className="font-bodoni text-2xl sm:text-4xl md:text-5xl font-black tracking-[0.14em] uppercase text-white leading-tight drop-shadow-lg">
            {chapter.title}
          </h2>

          <p className="font-editorial italic text-base sm:text-lg text-[#E8DCC2] tracking-wider leading-relaxed">
            "{chapter.poeticVerse}"
          </p>

          {/* Technical Craftsmanship Bullet Points */}
          <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono">
            {chapter.specs.map((spec, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full bg-black/60 border border-white/15 text-gray-300 backdrop-blur-xs flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                {spec}
              </span>
            ))}
          </div>

          {/* Fabric switcher buttons for this chapter */}
          <div className="pt-4 flex items-center gap-2">
            <span className="text-[10px] font-mono text-gray-400 tracking-wider uppercase mr-1">
              FEEL WEAVE:
            </span>
            {(['silk', 'denim', 'gold', 'noir'] as FabricType[]).map((f) => (
              <button
                key={f}
                onClick={() => {
                  setSelectedFabricOverride(f);
                  soundManager.playChime(1.2);
                }}
                className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  activeFabric === f
                    ? 'bg-[#D4AF37] text-black font-bold shadow-md shadow-[#D4AF37]/30 scale-105'
                    : 'bg-black/50 text-gray-300 border border-white/15 hover:border-[#D4AF37]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Garment Artifact Buy Card */}
        {currentProduct && (
          <div className="w-full max-w-sm pointer-events-auto bg-black/75 backdrop-blur-md rounded-2xl border-2 border-[#D4AF37]/60 p-5 shadow-2xl space-y-4 animate-in zoom-in-95 duration-500">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold block">
                  FEATURED GARMENT
                </span>
                <h3 className="font-bodoni text-lg sm:text-xl font-bold uppercase text-white tracking-wider mt-0.5">
                  {currentProduct.name}
                </h3>
              </div>

              <div className="text-right">
                <span className="font-sans text-lg font-black text-[#F4D992] block tabular-nums">
                  ₹{currentProduct.price.toLocaleString('en-IN')}
                </span>
                {currentProduct.originalPrice && (
                  <span className="text-[10px] text-gray-400 line-through tabular-nums">
                    ₹{currentProduct.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            </div>

            {/* Garment Image Miniature Preview */}
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-white/5 border border-white/10 group">
              <img
                src={normalizeImageUrl(currentProduct.image, currentProduct.category)}
                alt={currentProduct.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK_LUXURY_IMAGE;
                }}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-3 text-[11px] font-mono text-gray-300">
                {currentProduct.category} · Mahbubnagar Desk Ready
              </div>
            </div>

            {/* Action Buttons: Add to Bag & Checkout */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold font-mono tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                {isAddedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>ADDED TO BAG!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                    <span>ADD TO BAG</span>
                  </>
                )}
              </button>

              <button
                onClick={handleQuickCheckout}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#B8860B] hover:brightness-110 text-black text-xs font-black font-mono tracking-wider uppercase shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>ACQUIRE NOW</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* 4. Macro Loupe Component (Hold to inspect weave) */}
      <MacroWeaveLoupe
        activeChapterName={chapter.title}
        fabricName={chapter.fabricName}
        threadSpec={chapter.threadSpec}
      />

      {/* 5. Bottom Navigation Rail & Chapter Stepper */}
      <footer className="relative z-20 px-4 sm:px-8 py-4 border-t border-white/10 bg-gradient-to-t from-black/90 via-black/50 to-transparent backdrop-blur-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Chapter Steps Dots / Labels */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-full">
          {CHAPTERS.map((ch, idx) => (
            <button
              key={ch.id}
              onClick={() => {
                setCurrentChapterIdx(idx);
                setSelectedFabricOverride(null);
                soundManager.playChime(1.0);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                currentChapterIdx === idx
                  ? 'bg-white text-black font-bold shadow-lg'
                  : 'bg-black/50 border border-white/15 text-gray-400 hover:text-white'
              }`}
            >
              <span>{ch.number}</span>
              <span className="hidden md:inline">{ch.id.toUpperCase()}</span>
            </button>
          ))}
        </div>

        {/* Previous & Next Chapter Arrows */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handlePrev}
            disabled={currentChapterIdx === 0}
            className={`px-3.5 py-2 rounded-xl border flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
              currentChapterIdx === 0
                ? 'opacity-30 border-white/10 text-gray-500 cursor-not-allowed'
                : 'border-white/20 bg-black/50 hover:bg-white/10 text-white'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev Chapter</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentChapterIdx === CHAPTERS.length - 1}
            className={`px-4 py-2 rounded-xl border flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider font-bold transition-all cursor-pointer ${
              currentChapterIdx === CHAPTERS.length - 1
                ? 'opacity-30 border-white/10 text-gray-500 cursor-not-allowed'
                : 'border-[#D4AF37] bg-[#D4AF37] text-black hover:brightness-110 shadow-md'
            }`}
          >
            <span>Next Chapter</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
};

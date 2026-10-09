import React, { useState } from 'react';
import { Sparkles, Layers, ShieldCheck, ArrowRight, ZoomIn, Eye } from 'lucide-react';
import { ThreeClothCanvas, FabricType } from './ThreeClothCanvas';
import { soundManager } from './SoundManager';
import { useStore } from '../../context/StoreContext';

interface FabricOption {
  id: FabricType;
  name: string;
  category: string;
  tagline: string;
  description: string;
  threadSpec: string;
  finish: string;
  targetCategory: string;
}

const FABRIC_OPTIONS: FabricOption[] = [
  {
    id: 'silk',
    name: 'Imperial Egyptian Silk',
    category: 'Men',
    tagline: '120s Double-Ply Combed Long-Staple Cotton',
    description: 'Spun from unbroken riverbank fibers into a double-twisted yarn. Delivers an effortless drape, radiant pearlescent luster, and all-day breathable crispness.',
    threadSpec: 'Double-Ply 120/2 Combed Cotton · 140 g/m²',
    finish: 'Mother-of-Pearl Fasteners · Single-Needle French Seams',
    targetCategory: 'Men',
  },
  {
    id: 'gold',
    name: 'Liquid 24K Gold Lamé',
    category: 'Watches',
    tagline: 'High-Luster Metallurgical Woven Sheen',
    description: 'Inspired by horological craftsmanship, reflecting warm champagne and liquid gold light with fluid micro-crests that catch every glint of motion.',
    threadSpec: 'Micro-polished 18K brushed gold alloy & sapphire crystal',
    finish: 'Sunburst Dial Finish · Anti-Reflective Glare Shield',
    targetCategory: 'Watches',
  },
  {
    id: 'denim',
    name: 'Raw Selvedge Denim',
    category: 'Jeans',
    tagline: '14.5oz Japanese Kurabo Shuttle Loom',
    description: 'Woven on vintage wooden shuttle looms at low tension. Sealed with golden-and-white selvedge tape that molds uniquely to the wearer’s journey.',
    threadSpec: 'Ring-Spun Cotton Warp · Natural Indigo Vat-Dyed',
    finish: 'Gold Selvedge ID Ticking · Solid Antique Brass Hardware',
    targetCategory: 'Jeans',
  },
  {
    id: 'noir',
    name: 'Sculpted Grain Leather',
    category: 'Bags',
    tagline: 'Full-Grain Tuscan Calfskin & Obsidian Velvet',
    description: 'Hand-beveled edges and hand-waxed saddle stitching create enduring structural fidelity with a soft, supple tactile warmth.',
    threadSpec: 'Full-Grain Calfskin · Waxed Linen Thread · 8 stitches/inch',
    finish: 'Hand-Polished Brass Padlock · Saddle-Stitched Seams',
    targetCategory: 'Bags',
  },
  {
    id: 'white',
    name: 'Pure Alabaster Linen',
    category: 'Women',
    tagline: '140s Double-Twist Radiance',
    description: 'Pristine pure white weave reflecting immaculate light and serene elegance, woven for ceremonial luxury and everyday distinction.',
    threadSpec: '140s Double-Twist Pure Staple · Zero Synthetic Blend',
    finish: 'Hand-Rolled Hemlines · Silk Thread Finishes',
    targetCategory: 'Women',
  },
];

export const TactileClothShowcase: React.FC = () => {
  const [selectedFabric, setSelectedFabric] = useState<FabricType>('silk');
  const [isInspecting, setIsInspecting] = useState(false);
  const { triggerTransition } = useStore();

  const currentOption =
    FABRIC_OPTIONS.find((f) => f.id === selectedFabric) || FABRIC_OPTIONS[0];

  const handleFabricSelect = (fabric: FabricType) => {
    soundManager.playChime(1.2);
    setSelectedFabric(fabric);
  };

  const handleExploreCategory = () => {
    triggerTransition(currentOption.targetCategory, currentOption.name);
  };

  return (
    <section className="py-12 sm:py-16 bg-white/65 backdrop-blur-[2px] border-y border-[#D4AF37]/30 relative overflow-hidden select-none">
      {/* Decorative Golden Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF5E6] border border-[#D4AF37]/60 mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-[#8A671A]">
              Tactile Craftsmanship · 3D Interactive Cloth
            </span>
          </div>

          <h2 className="font-bodoni text-2xl sm:text-4xl md:text-5xl font-black tracking-[0.16em] uppercase text-[#111113] leading-tight mb-3">
            THE POETRY OF TACTILE LUXURY
          </h2>

          <div className="flex items-center justify-center gap-3 my-3">
            <span className="w-16 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37] to-[#D4AF37]" />
            <span className="w-2 h-2 rotate-45 bg-[#D4AF37]" />
            <span className="w-16 h-[1.5px] bg-gradient-to-l from-transparent via-[#D4AF37] to-[#D4AF37]" />
          </div>

          <p className="font-sans text-xs sm:text-sm md:text-base text-[#5A5043] leading-relaxed max-w-2xl mx-auto">
            True luxury is felt before it is seen. Interact with our living 3D cloth physics canvas to experience the drape, tensile resilience, and light response of our signature weaves.
          </p>
        </div>

        {/* Fabric Type Selector Pills */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-8">
          {FABRIC_OPTIONS.map((fabric) => {
            const isSelected = selectedFabric === fabric.id;
            return (
              <button
                key={fabric.id}
                onClick={() => handleFabricSelect(fabric.id)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-bold tracking-[0.14em] uppercase transition-all cursor-pointer flex items-center gap-2 active:scale-95 ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#DFBA53] via-[#F4E09E] to-[#B8860B] text-[#111113] shadow-[0_4px_16px_rgba(212,175,55,0.35)] ring-2 ring-[#D4AF37]'
                    : 'bg-white hover:bg-[#FAF6EE] text-[#4A4237] border border-[#D4AF37]/40 shadow-xs hover:border-[#D4AF37]'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    fabric.id === 'gold'
                      ? 'bg-[#B8860B]'
                      : fabric.id === 'denim'
                      ? 'bg-[#1a2b4c]'
                      : fabric.id === 'noir'
                      ? 'bg-[#141417]'
                      : 'bg-[#D4AF37]'
                  }`}
                />
                <span>{fabric.name}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive 3D Cloth Display & Editorial Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center bg-white rounded-3xl p-4 sm:p-7 md:p-9 border-2 border-[#D4AF37]/40 shadow-[0_16px_45px_rgba(212,175,55,0.12)]">
          {/* Left: 3D Cloth Canvas with real-time interactive cursor drag */}
          <div className="lg:col-span-7 relative h-[360px] sm:h-[440px] md:h-[480px] rounded-2xl overflow-hidden border border-[#D4AF37]/50 bg-gradient-to-b from-[#FAF8F5] to-[#F2EDE2] shadow-inner group">
            <ThreeClothCanvas
              fabric={selectedFabric}
              interactive={true}
              accentText="Drag Cursor / Finger to Ripple the 3D Cloth"
            />

            {/* Instruction tooltip badge */}
            <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#D4AF37]/60 text-[10px] font-bold tracking-wider uppercase text-[#8A671A] flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping" />
              <span>Interactive 3D WebGL Cloth</span>
            </div>

            {/* Current fabric name watermark */}
            <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
              <div className="bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-lg text-white">
                <span className="font-bodoni tracking-widest text-xs uppercase text-[#F4E09E] font-bold block">
                  {currentOption.name}
                </span>
                <span className="text-[9px] text-gray-300 tracking-wider uppercase block">
                  Fluid 3D Wave Simulation
                </span>
              </div>

              <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#D4AF37]/50 text-[10px] font-bold text-[#111113] shadow-xs">
                Drag Surface ↔
              </div>
            </div>
          </div>

          {/* Right: Craftsmanship Specifications & Poetry */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full py-2 space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2 h-2 rotate-45 bg-[#D4AF37]" />
                <span className="font-editorial italic tracking-[0.2em] text-xs uppercase text-[#8A671A] font-bold">
                  Material Craftsmanship
                </span>
              </div>

              <h3 className="font-bodoni text-2xl sm:text-3xl font-black uppercase tracking-[0.14em] text-[#111113] leading-snug">
                {currentOption.name}
              </h3>

              <p className="font-sans text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#8A671A] mt-1 mb-3">
                {currentOption.tagline}
              </p>

              <p className="font-sans text-xs sm:text-sm text-[#4A4237] leading-relaxed">
                {currentOption.description}
              </p>
            </div>

            {/* Technical Craftsmanship Details */}
            <div className="space-y-3 pt-3 border-t border-[#F0E8DC]">
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8DFC8]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A671A] block">
                  Weave & Density Specification
                </span>
                <span className="text-xs font-semibold text-[#111113] mt-0.5 block">
                  {currentOption.threadSpec}
                </span>
              </div>

              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8DFC8]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A671A] block">
                  Tailoring & Hardware Details
                </span>
                <span className="text-xs font-semibold text-[#111113] mt-0.5 block">
                  {currentOption.finish}
                </span>
              </div>
            </div>

            {/* Direct Shop Link Button */}
            <div className="pt-2">
              <button
                onClick={handleExploreCategory}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#DFBA53] via-[#F4E09E] to-[#B8860B] hover:brightness-105 text-[#111113] text-xs sm:text-sm font-bold tracking-[0.18em] uppercase transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>EXPLORE {currentOption.targetCategory.toUpperCase()} PIECES →</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

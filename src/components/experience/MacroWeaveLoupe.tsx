import React, { useState, useEffect } from 'react';
import { Eye, Sparkles, ZoomIn, ShieldCheck } from 'lucide-react';
import { soundManager } from './SoundManager';

interface MacroWeaveLoupeProps {
  activeChapterName: string;
  fabricName: string;
  threadSpec: string;
}

export const MacroWeaveLoupe: React.FC<MacroWeaveLoupeProps> = ({
  activeChapterName,
  fabricName,
  threadSpec,
}) => {
  const [isPressing, setIsPressing] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [pressProgress, setPressProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPressing) {
      soundManager.playChime(1.5);
      interval = setInterval(() => {
        setPressProgress((prev) => Math.min(100, prev + 12));
      }, 30);
    } else {
      setPressProgress(0);
    }
    return () => clearInterval(interval);
  }, [isPressing]);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPos({ x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <>
      {/* Subtle bottom indicator instructing to hold */}
      <div
        onMouseDown={() => setIsPressing(true)}
        onMouseUp={() => setIsPressing(false)}
        onTouchStart={() => setIsPressing(true)}
        onTouchEnd={() => setIsPressing(false)}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 select-none cursor-pointer group"
      >
        <div className="px-5 py-2.5 rounded-full bg-black/75 hover:bg-black/90 backdrop-blur-md border border-[#D4AF37]/60 text-white shadow-2xl flex items-center gap-3 transition-transform active:scale-95">
          <div className="relative w-5 h-5 flex items-center justify-center">
            {/* Circular progress ring */}
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="10"
                cy="10"
                r="8"
                stroke="currentColor"
                strokeWidth="2"
                fill="transparent"
                className="text-white/20"
              />
              <circle
                cx="10"
                cy="10"
                r="8"
                stroke="#D4AF37"
                strokeWidth="2.5"
                fill="transparent"
                strokeDasharray="50.2"
                strokeDashoffset={50.2 - (50.2 * pressProgress) / 100}
                className="transition-all duration-75"
              />
            </svg>
            <ZoomIn className="w-2.5 h-2.5 text-[#D4AF37] absolute" />
          </div>

          <div className="text-left">
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase font-bold text-[#E5D7B7] block">
              HOLD TO INSPECT FIBERS
            </span>
            <span className="text-[9px] text-gray-400 block -mt-0.5">
              10x Microscopic Thread Loupe
            </span>
          </div>
        </div>
      </div>

      {/* Loupe Overlay active when pressing */}
      {isPressing && (
        <div className="fixed inset-0 z-40 pointer-events-none select-none animate-in fade-in duration-200">
          {/* Magnifying Loupe attached to cursor */}
          <div
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-80 sm:h-80 rounded-full border-4 border-[#D4AF37] shadow-[0_0_80px_rgba(212,175,55,0.4)] overflow-hidden bg-[#0A0A0C] backdrop-blur-xl"
          >
            {/* Microscopic Weave Texture Canvas */}
            <div
              className="absolute inset-0 opacity-70"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(0deg, rgba(212,175,55,0.18) 0px, rgba(212,175,55,0.18) 2px, transparent 2px, transparent 8px),
                  repeating-linear-gradient(90deg, rgba(255,255,255,0.15) 0px, rgba(255,255,255,0.15) 2px, transparent 2px, transparent 8px)
                `,
                backgroundSize: '16px 16px',
              }}
            />

            {/* Glowing Loupe Crosshairs */}
            <div className="absolute inset-x-0 top-1/2 h-[1px] bg-[#D4AF37]/50" />
            <div className="absolute inset-y-0 left-1/2 w-[1px] bg-[#D4AF37]/50" />
            <div className="absolute inset-8 rounded-full border border-dashed border-[#D4AF37]/30 animate-spin duration-1000" />

            {/* Center Data Badge */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
              <span className="font-mono text-[10px] tracking-widest text-[#D4AF37] uppercase font-bold">
                MICRON ANALYSIS · 10X
              </span>
              <p className="font-bodoni text-sm sm:text-base font-black text-white uppercase tracking-wider my-1">
                {fabricName}
              </p>
              <p className="text-[10px] font-mono text-gray-300 max-w-[200px] leading-tight">
                {threadSpec}
              </p>
              <div className="mt-2 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[9px] font-mono text-[#F4D992]">
                <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
                <span>100% PURE ARTISANAL WEAVE</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

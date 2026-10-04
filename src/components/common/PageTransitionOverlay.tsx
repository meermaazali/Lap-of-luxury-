import React from 'react';
import { useStore } from '../../context/StoreContext';
import { UploadedLogoMark } from '../UploadedLogoMark';

export const PageTransitionOverlay: React.FC = () => {
  const { isTransitioning, transitionLabel } = useStore();

  if (!isTransitioning) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-white flex flex-col items-center justify-center pointer-events-none animate-in fade-in zoom-in-95 duration-200 select-none">
      <div className="flex flex-col items-center text-center px-4">
        {/* Big Monogram Logo in Black */}
        <div className="mb-3 transform animate-pulse duration-700">
          <UploadedLogoMark className="w-20 h-20 sm:w-28 sm:h-28 text-black" color="#111111" />
        </div>

        {/* Big Bodoni Title */}
        <h2 className="font-bodoni text-3xl sm:text-5xl font-black tracking-[0.24em] uppercase text-black leading-none my-1">
          LAP OF LUXURY
        </h2>

        {/* Golden Diamond Divider */}
        <div className="flex items-center justify-center w-full max-w-[280px] sm:max-w-[340px] gap-3 my-2.5">
          <span className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-[#C5A880] to-[#C5A880]" />
          <span className="w-2 h-2 rotate-45 bg-[#B89758]" />
          <span className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent via-[#C5A880] to-[#C5A880]" />
        </div>

        {/* Tagline */}
        <p className="font-bodoni italic tracking-[0.20em] uppercase text-xs sm:text-sm font-semibold text-[#8C6D1F]">
          Experience premium in every touch
        </p>

        {/* Dynamic Transition Target Label */}
        {transitionLabel && (
          <div className="mt-6 px-4 py-1.5 rounded-full bg-[#FAF8F5] border border-[#E5DAC8] text-[11px] font-bold tracking-[0.2em] text-[#1E1E22] uppercase">
            Curating {transitionLabel}...
          </div>
        )}
      </div>
    </div>
  );
};

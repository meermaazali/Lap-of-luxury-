import React, { useEffect, useState } from 'react';
import { UploadedLogoMark } from './UploadedLogoMark';

interface IntroSplashScreenProps {
  onFinish?: () => void;
}

export const IntroSplashScreen: React.FC<IntroSplashScreenProps> = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Show splash for 1.8s, then start smooth fade out
    const timer = setTimeout(() => {
      setIsFading(true);
    }, 1700);

    const removeTimer = setTimeout(() => {
      setIsVisible(false);
      if (onFinish) onFinish();
    }, 2400);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, [onFinish]);

  if (!isVisible) return null;

  return (
    <div
      onClick={() => {
        setIsFading(true);
        setTimeout(() => setIsVisible(false), 500);
      }}
      className={`fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center cursor-pointer transition-opacity duration-700 ease-in-out select-none ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center text-center px-4 animate-in fade-in zoom-in-95 duration-700">
        {/* Exact Uploaded Monogram Mark in Solid Black Bodoni Style */}
        <div className="mb-4">
          <UploadedLogoMark
            className="w-20 h-20 sm:w-28 sm:h-28 text-black transition-transform duration-700 hover:scale-105"
            color="#000000"
          />
        </div>

        {/* LAP OF LUXURY in Black Bodoni style */}
        <h1 className="font-bodoni text-2xl sm:text-4xl md:text-5xl font-black tracking-[0.24em] uppercase text-black leading-none my-1">
          LAP OF LUXURY
        </h1>

        {/* Subtitle in Bodoni Italic with clean spacing, no cutting line */}
        <p className="font-bodoni italic tracking-[0.2em] uppercase text-xs sm:text-sm font-semibold text-[#8C6D1F] mt-2">
          Experience premium in every touch
        </p>

        {/* Tap to enter hint */}
        <span className="mt-8 text-[10px] tracking-widest uppercase text-gray-400 font-sans">
          Mahabubnagar · Luxury Store
        </span>
      </div>
    </div>
  );
};

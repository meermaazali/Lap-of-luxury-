import React from 'react';
import { UploadedLogoMark } from './UploadedLogoMark';

interface BrandLogoProps {
  variant?: 'light' | 'dark' | 'header' | 'footer' | 'compact' | 'gold' | 'splash';
  showSubtitle?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'giant';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'header',
  showSubtitle = true,
  className = '',
  size = 'md',
}) => {
  const isDark = variant === 'dark' || variant === 'footer';
  const isGold = variant === 'gold';

  const logoColor = isDark
    ? '#FFFFFF'
    : isGold
    ? '#D4AF37'
    : '#111111';

  return (
    <div className={`flex flex-col items-center select-none text-center ${className}`}>
      {/* Exact Monogram + Bodoni Typography (Enlarged for grand luxury presence) */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        <UploadedLogoMark
          className={`${
            size === 'sm'
              ? 'w-10 h-10 sm:w-12 sm:h-12'
              : size === 'md'
              ? 'w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20'
              : size === 'lg'
              ? 'w-18 h-18 sm:w-22 sm:h-22 md:w-26 md:h-26'
              : size === 'giant'
              ? 'w-28 h-28 sm:w-36 sm:h-36'
              : 'w-22 h-22 sm:w-26 sm:h-26'
          } shrink-0 transition-transform duration-300`}
          color={logoColor}
        />

        <div className="flex flex-col items-center">
          <span
            className={`font-bodoni tracking-[0.12em] sm:tracking-[0.16em] md:tracking-[0.18em] font-black uppercase transition-colors leading-none px-1.5 inline-block whitespace-nowrap overflow-visible ${
              size === 'sm'
                ? 'text-lg sm:text-xl'
                : size === 'md'
                ? 'text-2xl sm:text-3xl md:text-4xl'
                : size === 'lg'
                ? 'text-3xl sm:text-4xl md:text-5xl'
                : size === 'giant'
                ? 'text-4xl sm:text-5xl md:text-6xl'
                : 'text-2xl sm:text-3xl md:text-4xl'
            } ${
              isDark
                ? 'text-white'
                : isGold
                ? 'text-[#B8860B]'
                : 'text-[#111111]'
            }`}
          >
            LAP OF LUXURY
          </span>
        </div>
      </div>

      {/* Tagline without cutting line */}
      {showSubtitle && (
        <div className="flex flex-col items-center mt-1 w-full max-w-[320px] sm:max-w-[420px]">
          <p
            className={`font-bodoni italic tracking-[0.14em] sm:tracking-[0.18em] text-[11px] sm:text-xs md:text-[13px] uppercase font-semibold px-2 text-center whitespace-normal sm:whitespace-nowrap overflow-visible ${
              isDark ? 'text-[#F3D78E]' : 'text-[#8A671A]'
            }`}
          >
            Experience premium in every touch
          </p>
        </div>
      )}
    </div>
  );
};

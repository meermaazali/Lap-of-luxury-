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
              ? 'w-12 h-12 sm:w-14 sm:h-14'
              : size === 'md'
              ? 'w-16 h-16 sm:w-20 sm:h-20'
              : size === 'lg'
              ? 'w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28'
              : size === 'giant'
              ? 'w-32 h-32 sm:w-40 sm:h-40'
              : 'w-24 h-24 sm:w-28 sm:h-28'
          } shrink-0 transition-transform duration-300`}
          color={logoColor}
        />

        <div className="flex flex-col items-center">
          <span
            className={`font-serif tracking-[0.12em] sm:tracking-[0.16em] md:tracking-[0.18em] font-normal uppercase transition-colors leading-none px-1.5 inline-block whitespace-normal sm:whitespace-nowrap ${
              size === 'sm'
                ? 'text-base sm:text-lg'
                : size === 'md'
                ? 'text-xl sm:text-2xl md:text-3xl'
                : size === 'lg'
                ? 'text-2xl sm:text-3xl md:text-4xl'
                : size === 'giant'
                ? 'text-3xl sm:text-4xl md:text-5xl'
                : 'text-xl sm:text-2xl md:text-3xl'
            } ${
              isDark
                ? 'text-white'
                : isGold
                ? 'text-[#B8860B]'
                : 'text-[#111113]'
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
            className={`font-sans tracking-[0.08em] sm:tracking-[0.14em] text-[10px] sm:text-xs md:text-[11px] uppercase font-normal px-2 text-center whitespace-normal sm:whitespace-nowrap ${
              isDark ? 'text-[#F3D78E]' : 'text-[#7A6C58]'
            }`}
          >
            Experience premium in every touch
          </p>
        </div>
      )}
    </div>
  );
};

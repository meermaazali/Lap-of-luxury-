import React from 'react';
import { UploadedLogoMark } from './UploadedLogoMark';

interface BrandLogoProps {
  variant?: 'light' | 'dark' | 'header' | 'footer' | 'compact' | 'gold' | 'splash';
  showSubtitle?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'giant';
}

/**
 * BrandLogo Component
 * Renders the exact original LAP OF LUXURY trademark logo and typography.
 * Completely stable without unwanted vertical movement or shifting on any screen.
 * High-definition, properly proportioned with zero clipping.
 */
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
    : '#111113';

  const logoDimension =
    size === 'sm'
      ? 'w-12 h-12 sm:w-14 sm:h-14'
      : size === 'md'
      ? 'w-16 h-16 sm:w-20 sm:h-20'
      : size === 'lg'
      ? 'w-22 h-22 sm:w-26 sm:h-26'
      : size === 'giant'
      ? 'w-28 h-28 sm:w-36 sm:h-36'
      : 'w-16 h-16 sm:w-20 sm:h-20';

  const titleSize =
    size === 'sm'
      ? 'text-sm sm:text-base'
      : size === 'md'
      ? 'text-lg sm:text-xl md:text-2xl'
      : size === 'lg'
      ? 'text-2xl sm:text-3xl'
      : size === 'giant'
      ? 'text-3xl sm:text-4xl md:text-5xl'
      : 'text-xl sm:text-2xl';

  return (
    <div className={`flex flex-col select-none ${className}`}>
      {/* Trademark Logo & Brand Typography */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 w-full">
        <div className={`${logoDimension} shrink-0 aspect-square flex items-center justify-center`}>
          <UploadedLogoMark
            className="w-full h-full"
            color={logoColor}
          />
        </div>

        <div className="flex flex-col items-start text-left justify-center flex-1 min-w-0">
          <span
            className={`font-serif tracking-[0.14em] font-normal uppercase leading-tight truncate w-full ${titleSize} ${
              isDark
                ? 'text-white'
                : isGold
                ? 'text-[#B8860B]'
                : 'text-[#111113]'
            }`}
          >
            LAP OF LUXURY
          </span>
          {showSubtitle && (
            <span
              className={`font-sans tracking-[0.06em] sm:tracking-[0.12em] text-[9px] sm:text-[10px] md:text-xs uppercase font-normal leading-normal mt-0.5 break-words ${
                isDark ? 'text-[#F3D78E]' : 'text-[#7A6C58]'
              }`}
            >
              Experience premium in every touch
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

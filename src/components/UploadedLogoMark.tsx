import React from 'react';

interface UploadedLogoMarkProps {
  className?: string;
  color?: string; // 'black' | 'gold' | 'white' | custom hex
}

/**
 * Exact vector replication of the user's uploaded logo mark:
 * file_00000000b5608208b2b3a47d71987b34.png
 * Interlocking L - O - L luxury monogram with high-contrast Roman Bodoni serifs.
 */
export const UploadedLogoMark: React.FC<UploadedLogoMarkProps> = ({
  className = 'w-10 h-10',
  color = 'currentColor',
}) => {
  return (
    <svg
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Lap of Luxury Monogram"
    >
      {/* Circle "O" Interlocking */}
      <path
        d="M 248 116 C 182 116 130 168 130 234 C 130 300 182 352 248 352 C 304 352 350 312 363 260 L 338 254 C 328 290 292 324 248 324 C 196 324 156 284 156 234 C 156 184 196 144 248 144 C 292 144 328 178 338 214 L 363 208 C 350 156 304 116 248 116 Z"
        fill={color}
      />

      {/* Main Upper Serif "L" */}
      {/* Top horizontal serif */}
      <path
        d="M 172 68 H 272 V 80 C 260 80 252 83 249 92 C 248 95 248 102 248 114 V 282 L 314 282 C 330 282 338 274 344 252 H 354 L 342 308 H 218 V 296 C 228 296 234 292 236 284 C 237 280 237 274 237 262 V 114 C 237 102 237 95 236 92 C 234 83 228 80 218 80 V 68 H 172 Z"
        fill={color}
      />

      {/* Lower Extended Horizontal Serif "L" with sweeping upward wing */}
      <path
        d="M 172 376 C 190 376 200 371 204 360 C 206 354 206 346 206 332 H 234 C 234 350 250 366 280 372 C 314 378 348 376 376 350 C 384 342 390 334 394 322 H 404 L 388 394 C 354 394 310 398 274 398 C 220 398 172 394 172 376 Z"
        fill={color}
      />
    </svg>
  );
};

import React from 'react';

interface UploadedLogoMarkProps {
  className?: string;
  color?: string; // 'black' | 'gold' | 'white' | custom hex
}

/**
 * Exact, high-fidelity vector replication of the user's uploaded logo mark:
 * file_00000000b5608208b2b3a47d71987b34.png
 * Interlocking Roman Didone L - O - L luxury monogram with sharp architectural serifs.
 */
export const UploadedLogoMark: React.FC<UploadedLogoMarkProps> = ({
  className = 'w-14 h-14',
  color = 'currentColor',
}) => {
  return (
    <svg
      viewBox="0 0 1000 1000"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} overflow-visible`}
      role="img"
      aria-label="Lap of Luxury Monogram"
    >
      <g fill={color} fillRule="evenodd" clipRule="evenodd">
        {/* Central Circular "O" Ring */}
        {/* Outer Circle (R=210) & Inner Cutout Circle (R=155) centered at (510, 460) */}
        <path
          d="M 510 250 C 625.98 250 720 344.02 720 460 C 720 575.98 625.98 670 510 670 C 394.02 670 300 575.98 300 460 C 300 344.02 394.02 250 510 250 Z M 510 306 C 595.05 306 664 374.95 664 460 C 664 545.05 595.05 614 510 614 C 424.95 614 356 545.05 356 460 C 356 374.95 424.95 306 510 306 Z"
        />

        {/* Primary Upper "L" Glyph: Classic Roman Serif L with Top Bracketed Serif, Thick Vertical Stem, and Right Foot with Upturned Beak */}
        <path
          d="M 325 120 H 575 V 136 C 545 136 515 144 485 168 C 478 174 475 185 475 200 V 550 C 475 558 480 564 490 568 C 500 572 525 572 555 572 H 600 C 622 572 638 564 648 544 L 656 525 H 668 L 652 610 H 380 V 596 C 405 596 420 590 425 578 C 427 572 427 562 427 545 V 200 C 427 185 424 174 417 168 C 387 144 355 136 325 136 V 120 Z"
        />

        {/* Lower Horizontal "L" Sweep Base running underneath the "O" with Left Serif and Elegant Upward Wing Flourish */}
        <path
          d="M 325 745 C 355 745 385 737 415 715 C 423 708 427 698 427 682 H 465 C 466 702 485 718 518 722 C 555 726 605 722 650 690 C 665 678 676 662 685 640 H 698 L 678 755 C 625 756 565 760 510 760 C 430 760 360 755 325 745 Z"
        />
      </g>
    </svg>
  );
};

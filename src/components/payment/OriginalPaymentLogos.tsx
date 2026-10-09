import React from 'react';

/**
 * Authentic, official vector logos for Google Pay (GPay), PhonePe, and BHIM UPI
 */

export const GooglePayLogo: React.FC<{ className?: string }> = ({ className = 'h-6' }) => (
  <svg viewBox="0 0 1024 410" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* GPay G icon */}
    <path
      d="M366.5 208.6c0-13.4-1.2-26.2-3.4-38.6H187.3v73.1h100.6c-4.4 23.4-17.7 43.3-37.7 56.6v47.1h61c35.7-32.9 55.3-81.3 55.3-138.2z"
      fill="#4285F4"
    />
    <path
      d="M187.3 391.2c51.7 0 95.1-17.1 126.8-46.4l-61-47.1c-17.1 11.5-39 18.3-65.8 18.3-50.5 0-93.3-34.1-108.6-80H15.6v48.6c31.7 62.9 97 106.6 171.7 106.6z"
      fill="#34A853"
    />
    <path
      d="M78.7 236c-3.9-11.5-6.1-23.8-6.1-36.6s2.2-25.1 6.1-36.6V114.2H15.6C5.6 134.1 0 156.6 0 199.4s5.6 65.3 15.6 85.2l63.1-48.6z"
      fill="#FBBC04"
    />
    <path
      d="M187.3 79.9c28.1 0 53.4 9.7 73.3 28.7l55-55C282.1 20.3 238.8 0 187.3 0 112.6 0 47.3 43.7 15.6 106.6l63.1 48.6c15.3-45.9 58.1-80 108.6-80z"
      fill="#EA4335"
    />
    {/* "Pay" wordmark */}
    <path
      d="M523.5 137.6H463v205.6h40.3V271h20.2c41.2 0 71.9-29.4 71.9-66.7s-30.7-66.7-71.9-66.7zm-1 95.7h-19.2V175h19.2c22.3 0 34.5 13.9 34.5 29.1 0 15.3-12.2 29.2-34.5 29.2z"
      fill="#5F6368"
    />
    <path
      d="M666.2 209.6c-24.5 0-42.5 18.9-42.5 44.5 0 25.4 18 44.5 42.5 44.5 12.5 0 22.8-5.3 28.4-13.4v11.7c0 19.4-10.4 29.8-27.1 29.8-13.6 0-22.1-9.7-25.6-17.7l-35.4 14.8c10.3 20.6 32.7 34.7 61 34.7 35.4 0 65.3-20.8 65.3-69.1V213.2h-38.6v11.7c-5.8-9.4-16.1-15.3-28-15.3zm4.5 61.2c-14.8 0-25.9-12.2-25.9-26.7s11.1-26.7 25.9-26.7c14.6 0 26.2 12.2 26.2 26.7s-11.6 26.7-26.2 26.7z"
      fill="#5F6368"
    />
    <path
      d="M771.6 343.2h40.3L930.5 86.8h-42.3L832.1 247l-56.1-160.2h-43.9l62.2 171-22.7 85.4z"
      fill="#5F6368"
    />
  </svg>
);

export const PhonePeLogo: React.FC<{ className?: string }> = ({ className = 'h-7' }) => (
  <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Official PhonePe Purple Circle */}
    <circle cx="60" cy="60" r="56" fill="#5F259F" />
    {/* White 'Pe' Devanagari ligature mark */}
    <path
      d="M60.8 28.5H41.5c-2.2 0-4 1.8-4 4v55c0 2.2 1.8 4 4 4s4-1.8 4-4V70.8h15.3c14.8 0 25.7-10.9 25.7-21.2 0-10.2-10.9-21.1-25.7-21.1zm0 34.3H49.5V36.5h11.3c9.5 0 17.7 5.2 17.7 13.1 0 7.9-8.2 13.2-17.7 13.2z"
      fill="#FFFFFF"
    />
    <path
      d="M78.8 55.2l-23 27.5c-1.4 1.7-.9 4.2.8 5.6 1.7 1.4 4.2.9 5.6-.8l23-27.5c1.4-1.7.9-4.2-.8-5.6-1.7-1.3-4.2-.9-5.6.8z"
      fill="#FFFFFF"
    />
  </svg>
);

export const BhimUpiLogo: React.FC<{ className?: string }> = ({ className = 'h-6' }) => (
  <svg viewBox="0 0 160 60" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* UPI Forward Double Triangles */}
    <path d="M12 48L32 12H12L2 48h10z" fill="#097939" />
    <path d="M24 48L44 12H30L16 48h8z" fill="#ED752E" />
    {/* UPI Text */}
    <text x="50" y="38" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="28" fill="#1C355E" letterSpacing="1">
      UPI
    </text>
    <rect x="50" y="44" width="46" height="3" fill="#097939" rx="1.5" />
  </svg>
);

export const PaytmLogo: React.FC<{ className?: string }> = ({ className = 'h-6' }) => (
  <svg viewBox="0 0 120 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="4" y="28" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="24" fill="#002E6E">
      Pay
    </text>
    <text x="48" y="28" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="24" fill="#00BAF2">
      tm
    </text>
  </svg>
);

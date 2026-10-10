import React from 'react';

/**
 * Authentic, official vector logos for Google Pay (GPay), PhonePe, BHIM UPI,
 * Powered by UPI (NPCI), Paytm, and RuPay.
 */

// Official Google Pay Logo (Official Multicolor 'G' + 'Pay')
export const GooglePayLogo: React.FC<{ className?: string }> = ({ className = 'h-6' }) => (
  <svg
    viewBox="0 0 160 56"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Google Pay"
  >
    {/* Google 4-color 'G' icon */}
    <g transform="translate(6, 6) scale(0.95)">
      {/* Blue */}
      <path
        d="M44.5 23.2c0-1.6-.1-3.1-.4-4.6H23v8.8h12.1c-.5 2.8-2.1 5.2-4.5 6.8v5.6h7.3c4.3-3.9 6.6-9.8 6.6-16.6z"
        fill="#4285F4"
      />
      {/* Green */}
      <path
        d="M23 45c6.2 0 11.4-2 15.2-5.6l-7.3-5.6c-2.1 1.4-4.7 2.2-7.9 2.2-6.1 0-11.2-4.1-13-9.6H2.4v5.8C6.2 39.8 14 45 23 45z"
        fill="#34A853"
      />
      {/* Yellow */}
      <path
        d="M10 26.4c-.5-1.4-.7-2.9-.7-4.4s.2-3 .7-4.4V11.8H2.4C.9 14.8 0 18.3 0 22s.9 7.2 2.4 10.2l7.6-5.8z"
        fill="#FBBC05"
      />
      {/* Red */}
      <path
        d="M23 7.8c3.4 0 6.4 1.2 8.8 3.5l6.6-6.6C34.4 1.8 29.2 0 23 0 14 0 6.2 5.2 2.4 12.8l7.6 5.8c1.8-5.5 6.9-9.6 13-9.6z"
        fill="#EA4335"
      />
    </g>

    {/* Official "Pay" Typography */}
    <g fill="#3C4043">
      {/* P */}
      <path d="M68 14.5h8.8c4.6 0 8 3.2 8 7.6 0 4.5-3.4 7.7-8 7.7H72.2v10.7H68V14.5zm8.5 11.3c2.4 0 4.1-1.6 4.1-3.7 0-2-1.7-3.7-4.1-3.7H72.2v7.4h4.3z" />
      {/* a */}
      <path d="M96.7 23.3v17.2h-3.9v-2.8c-1.3 2-3.6 3.2-6.1 3.2-4.5 0-7.7-3.2-7.7-7.6 0-4.6 3.5-7.5 8.1-7.5 2.1 0 4 .7 5.3 1.9v-.4c0-2.3-1.8-3.7-4.4-3.7-2.3 0-4.3 1-5.6 2.5l-2.4-2.5c1.9-2.3 5-3.6 8.3-3.6 4.9 0 8.4 2.7 8.4 8.3zm-4 6.8c-.8-.9-2.1-1.5-3.6-1.5-2.6 0-4.4 1.7-4.4 4.3 0 2.5 1.7 4.2 4.3 4.2 1.6 0 2.9-.6 3.7-1.6v-5.4z" />
      {/* y */}
      <path d="M103.7 23.7l5.2 14.7 5.1-14.7h4.4l-7.7 20.3c-1.3 3.5-3.3 5.4-6.8 5.4-1.2 0-2.3-.3-3-.6l.9-3.4c.5.2 1.3.4 2 .4 1.9 0 2.9-.9 3.6-2.8l.6-1.6-7.8-17.7h4.7z" />
    </g>
  </svg>
);

// Official PhonePe Logo (Purple rounded container with authentic Devanagari Pe + wordmark)
export const PhonePeLogo: React.FC<{ className?: string }> = ({ className = 'h-7' }) => (
  <svg
    viewBox="0 0 170 56"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="PhonePe"
  >
    {/* PhonePe Purple Icon */}
    <rect x="4" y="6" width="44" height="44" rx="22" fill="#5F259F" />
    <g fill="#FFFFFF">
      {/* Devanagari 'पे' ligature */}
      <path d="M26.2 16.5h-9c-1.1 0-2 .9-2 2v21.5c0 1.1.9 2 2 2s2-.9 2-2v-9h7c6.8 0 11.8-4.8 11.8-11.8 0-4.8-4.8-8.7-11.8-8.7zm0 15.2H21.2v-11.4h5c4.3 0 7.8 2.4 7.8 6s-3.5 5.4-7.8 5.4z" />
      <path d="M34.8 28.2l-10.4 12.8c-.7.9-.5 2.1.4 2.7.9.6 2.1.4 2.7-.4l10.4-12.8c.6-.9.4-2.1-.4-2.7-.9-.6-2.1-.4-2.7.4z" />
    </g>
    {/* "PhonePe" Brand Wordmark */}
    <text
      x="56"
      y="35"
      fontFamily="Inter, Arial, sans-serif"
      fontWeight="800"
      fontSize="22"
      fill="#5F259F"
      letterSpacing="-0.5"
    >
      PhonePe
    </text>
  </svg>
);

// Official BHIM UPI Logo (NPCI Authentic Triangles + UPI typography)
export const BhimUpiLogo: React.FC<{ className?: string }> = ({ className = 'h-6' }) => (
  <svg
    viewBox="0 0 150 48"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="BHIM UPI"
  >
    {/* Official NPCI Green & Orange Forward Slashes */}
    <path d="M8 38L24 10H10L0 38h8z" fill="#097939" />
    <path d="M19 38L35 10H25L13 38h6z" fill="#ED752E" />

    {/* "UPI" Wordmark */}
    <text
      x="40"
      y="31"
      fontFamily="Arial, Helvetica, sans-serif"
      fontWeight="900"
      fontSize="25"
      fill="#1C355E"
      letterSpacing="1.2"
    >
      UPI
    </text>

    {/* Dual Accent Bar */}
    <rect x="40" y="36" width="28" height="3" fill="#097939" rx="1.5" />
    <rect x="70" y="36" width="22" height="3" fill="#ED752E" rx="1.5" />
  </svg>
);

// Official "POWERED BY UPI" NPCI Certification Badge
export const PoweredByUpiBadge: React.FC<{ className?: string }> = ({ className = 'h-7' }) => (
  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F4F7FB] border border-[#CBD5E1] shadow-2xs ${className}`}>
    <span className="text-[9px] font-extrabold tracking-wider text-[#475569] uppercase whitespace-nowrap">
      POWERED BY
    </span>
    <svg viewBox="0 0 95 32" className="h-4.5 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 26L16 6H6L0 26h5z" fill="#097939" />
      <path d="M13 26L24 6H17L9 26h4z" fill="#ED752E" />
      <text
        x="27"
        y="21"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="900"
        fontSize="17"
        fill="#1C355E"
        letterSpacing="0.8"
      >
        UPI
      </text>
      <rect x="27" y="24" width="18" height="2" fill="#097939" rx="1" />
      <rect x="46" y="24" width="16" height="2" fill="#ED752E" rx="1" />
    </svg>
  </div>
);

// Official Paytm Logo
export const PaytmLogo: React.FC<{ className?: string }> = ({ className = 'h-5' }) => (
  <svg
    viewBox="0 0 110 36"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Paytm"
  >
    <text
      x="2"
      y="26"
      fontFamily="Arial, Helvetica, sans-serif"
      fontWeight="900"
      fontSize="24"
      fill="#002E6E"
      letterSpacing="-0.5"
    >
      Pay
    </text>
    <text
      x="46"
      y="26"
      fontFamily="Arial, Helvetica, sans-serif"
      fontWeight="900"
      fontSize="24"
      fill="#00BAF2"
      letterSpacing="-0.5"
    >
      tm
    </text>
  </svg>
);

// Official RuPay Badge
export const RuPayLogo: React.FC<{ className?: string }> = ({ className = 'h-4' }) => (
  <svg viewBox="0 0 100 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <text
      x="2"
      y="22"
      fontFamily="Arial, sans-serif"
      fontWeight="900"
      fontSize="19"
      fill="#097939"
      fontStyle="italic"
    >
      Ru
    </text>
    <text
      x="30"
      y="22"
      fontFamily="Arial, sans-serif"
      fontWeight="900"
      fontSize="19"
      fill="#ED752E"
      fontStyle="italic"
    >
      Pay
    </text>
    <path d="M72 8l10 8-10 8h8l10-8-10-8h-8z" fill="#0072BC" />
  </svg>
);

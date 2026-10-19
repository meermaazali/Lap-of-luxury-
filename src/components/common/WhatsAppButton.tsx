import React from 'react';

interface WhatsAppButtonProps {
  className?: string;
  variant?: 'header' | 'floating' | 'banner';
  message?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  className = '',
  variant = 'header',
  message = 'Hello Lap of Luxury, I would like to inquire about your luxury collection.',
}) => {
  // Use official store WhatsApp phone number (+91 75 7888 7888) with env fallback
  const phone = (import.meta.env.VITE_WHATSAPP_PHONE || '917578887888').replace(/[^0-9]/g, '');
  const chatUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  if (variant === 'floating') {
    return (
      <aside aria-label="WhatsApp Contact" className="relative z-40">
        <a
          href={chatUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with Lap of Luxury on WhatsApp"
          className={`fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-3.5 py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full shadow-2xl hover:shadow-[0_0_20px_rgba(37,211,102,0.6)] transition-all duration-300 group cursor-pointer active:scale-95 border-2 border-white/80 ${className}`}
        >
          {/* Subtle pulse ring animation */}
          <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-35 animate-ping pointer-events-none" />

          {/* Official WhatsApp SVG Logo */}
          <svg
            className="w-5 h-5 fill-current shrink-0"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.275-.1-.476-.15-.677.15-.2.301-.777.979-.953 1.18-.175.2-.351.226-.652.075-.3-.15-1.27-.468-2.42-1.492-.895-.798-1.5-1.785-1.675-2.086-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.2-.301.301-.502.1-.2.05-.376-.025-.526-.075-.15-.677-1.631-.928-2.233-.244-.587-.493-.507-.677-.517-.175-.01-.376-.01-.577-.01-.2 0-.527.075-.803.376s-1.054 1.029-1.054 2.509 1.079 2.91 1.23 3.111c.15.2 2.123 3.242 5.143 4.547.719.31 1.28.496 1.718.636.721.23 1.378.197 1.897.12.578-.087 1.78-.727 2.031-1.43.25-.702.25-1.304.175-1.43-.075-.125-.276-.2-.577-.35zm-5.467 7.618c-2.07 0-4.015-.558-5.71-1.53l-.409-.236-4.249 1.114 1.134-4.141-.267-.424C1.61 14.996 1 12.981 1 10.875 1 5.43 5.43 1 10.875 1S20.75 5.43 20.75 10.875 16.32 20.75 10.875 20.75zm0-20.75C4.879 0 0 4.879 0 10.875c0 2.14.61 4.14 1.667 5.845L0 24l7.464-1.636c1.644.975 3.565 1.511 5.541 1.511 5.996 0 10.875-4.879 10.875-10.875S16.871 0 10.875 0z" />
          </svg>

          <span className="hidden sm:inline-block text-xs font-bold tracking-wider uppercase font-sans">
            WhatsApp Concierge
          </span>
        </a>
      </aside>
    );
  }

  // Header variant: Sleek luxury badge button near top of the website
  return (
    <a
      href={chatUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp Luxury Styling & Orders"
      className={`relative inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-[#25D366] hover:bg-[#1faa53] text-white rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-xs hover:shadow-[0_0_12px_rgba(37,211,102,0.45)] cursor-pointer group active:scale-95 ${className}`}
    >
      {/* Subtle pulse indicator dot */}
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
      </span>

      {/* Official WhatsApp SVG Logo */}
      <svg
        className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current shrink-0"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.275-.1-.476-.15-.677.15-.2.301-.777.979-.953 1.18-.175.2-.351.226-.652.075-.3-.15-1.27-.468-2.42-1.492-.895-.798-1.5-1.785-1.675-2.086-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.2-.301.301-.502.1-.2.05-.376-.025-.526-.075-.15-.677-1.631-.928-2.233-.244-.587-.493-.507-.677-.517-.175-.01-.376-.01-.577-.01-.2 0-.527.075-.803.376s-1.054 1.029-1.054 2.509 1.079 2.91 1.23 3.111c.15.2 2.123 3.242 5.143 4.547.719.31 1.28.496 1.718.636.721.23 1.378.197 1.897.12.578-.087 1.78-.727 2.031-1.43.25-.702.25-1.304.175-1.43-.075-.125-.276-.2-.577-.35zm-5.467 7.618c-2.07 0-4.015-.558-5.71-1.53l-.409-.236-4.249 1.114 1.134-4.141-.267-.424C1.61 14.996 1 12.981 1 10.875 1 5.43 5.43 1 10.875 1S20.75 5.43 20.75 10.875 16.32 20.75 10.875 20.75zm0-20.75C4.879 0 0 4.879 0 10.875c0 2.14.61 4.14 1.667 5.845L0 24l7.464-1.636c1.644.975 3.565 1.511 5.541 1.511 5.996 0 10.875-4.879 10.875-10.875S16.871 0 10.875 0z" />
      </svg>

      <span className="tracking-wider">WhatsApp</span>
    </a>
  );
};

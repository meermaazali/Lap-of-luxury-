
import React from 'react';
import { useStore } from '../context/StoreContext';

interface UploadedLogoMarkProps {
  className?: string;
  color?: string;
}

export const UploadedLogoMark: React.FC<UploadedLogoMarkProps> = ({
  className = 'w-16 h-16',
}) => {
  const store = useStore?.();
  const customLogo = store?.brandingConfig?.logoUrl;
  const logoSrc = customLogo || '/images/lap_of_luxury_logo.png';

  return (
    <div className={`${className} flex items-center justify-center overflow-visible`}>
      <img
        src={logoSrc}
        alt="LAP OF LUXURY official logo"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          if (!target.src.includes('ibb.co')) {
            target.src = 'https://i.ibb.co/rKsk7rdq/file-00000000b5608208b2b3a47d71987b34.png';
          }
        }}
        className="w-full h-full object-contain"
        style={{ transform: 'scale(1.15)' }}
      />
    </div>
  );
};

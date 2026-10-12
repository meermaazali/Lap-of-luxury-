
import React from 'react';

interface UploadedLogoMarkProps {
  className?: string;
  color?: string;
}

export const UploadedLogoMark: React.FC<UploadedLogoMarkProps> = ({
  className = 'w-16 h-16',
}) => {
  return (
    <div className={`${className} flex items-center justify-center overflow-visible`}>
      <img
        src="https://i.ibb.co/BHNLzMnv/file-00000000b5608208b2b3a47d71987b34.png"
        alt="LAP OF LUXURY official logo"
        className="w-full h-full object-contain"
        style={{ transform: 'scale(1.2)' }}
      />
    </div>
  );
};

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
        src="https://i.ibb.co/0jFg4Zk9/Charcoal-L-D-Monogram-Logo.png"
        alt="LAP OF LUXURY LD Monogram Logo"
        className="w-full h-full object-contain"
        style={{ transform: 'scale(1.15)' }}
      />
    </div>
  );
};
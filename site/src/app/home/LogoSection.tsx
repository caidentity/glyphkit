import React from 'react';
import Image from '@/components/Image/Image';
import { getLogoPath } from '@/lib/assetLoader';

interface LogoSectionProps {
  isVisible: boolean;
}

const LogoSection: React.FC<LogoSectionProps> = ({ isVisible }) => {
  const logoPath = getLogoPath('logo.svg');
  
  return (
    <div className="logo-section">
      <div className={`logo-wrapper ${isVisible ? 'visible' : ''}`}>
        <Image src={logoPath} alt="Logo" width={140}  priority />
      </div>
      <p className={`description ${isVisible ? 'visible' : ''}`}>
        1000+ icons designed to improve cohesion and development
      </p>
    </div>
  );
};

export default LogoSection; 
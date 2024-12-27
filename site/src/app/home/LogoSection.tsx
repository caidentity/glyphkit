import React from 'react';

interface LogoSectionProps {
  isVisible: boolean;
}

const LogoSection: React.FC<LogoSectionProps> = ({ isVisible }) => (
  <div className="logo-section">
    <div className={`logo-wrapper ${isVisible ? 'visible' : ''}`}>
      <span className="logo-text">LOGO</span>
    </div>
    <p className={`description ${isVisible ? 'visible' : ''}`}>
      Icon repository with over 1000+ icons designed to improve cohesion and development process
    </p>
  </div>
);

export default LogoSection; 
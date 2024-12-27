import React from 'react';

interface BackgroundPatternProps {
  isVisible: boolean;
}

const BackgroundPattern: React.FC<BackgroundPatternProps> = ({ isVisible }) => (
  <div className={`background-pattern ${isVisible ? 'visible' : ''}`}>
    <svg 
      preserveAspectRatio="none" 
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern 
          id="dots" 
          x="0" 
          y="0" 
          width="10" 
          height="10" 
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2" cy="2" r="1" fill="#ffffff" fillOpacity="0.3"/>
        </pattern>
      </defs>
      <path d="M0 0 L100 50 L100 0 Z" fill="#4a90e2"/>
      <path d="M0 0 L100 50 L100 0 Z" fill="url(#dots)"/>
    </svg>
  </div>
);

export default BackgroundPattern; 
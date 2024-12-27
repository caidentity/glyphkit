import React from 'react';
import { CanvasBackground } from '@/components/Gradient/Gradient';

interface BackgroundPatternProps {
  isVisible: boolean;
}

const BackgroundPattern: React.FC<BackgroundPatternProps> = ({ isVisible }) => (
  <div className={`masthead-background ${isVisible ? 'visible' : ''}`}>
    <div className="clipped-section">
      <CanvasBackground className="gradient-background" />
      <div className="background-pattern" />
    </div>
    <svg 
      className="pattern-overlay"
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
      <rect width="100" height="100" fill="url(#dots)"/>
    </svg>
  </div>
);

export default BackgroundPattern; 
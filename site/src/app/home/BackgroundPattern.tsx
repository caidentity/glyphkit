import React from 'react';
import { CanvasBackground } from '@/components/Gradient/Gradient';
import { getAssetPath } from '@/lib/assetLoader';

interface BackgroundPatternProps {
  isVisible: boolean;
}

const BackgroundPattern: React.FC<BackgroundPatternProps> = ({ isVisible }) => {
  const iconPath = getAssetPath('home', 'icons.svg');
  
  return (
    <div className={`masthead-background ${isVisible ? 'visible' : ''}`}>
      <div className="clipped-section">
        <CanvasBackground className="gradient-background" />
        <div className="background-pattern" />
        <div className="pattern-overlay">
          <div 
            className="pattern-repeat"
            style={{
              backgroundImage: `url(${iconPath})`,
              backgroundRepeat: 'repeat',
              backgroundSize: '891px 510.75px', // Reduced to 25% of original (1188/4 × 681/4)
              backgroundPosition: 'center',
              transform: 'rotate(-10deg) scale(1.5)',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default BackgroundPattern; 
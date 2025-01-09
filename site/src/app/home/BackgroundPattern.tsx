import React from 'react';
import { CanvasBackground } from '@/components/Gradient/Gradient';
import { getAssetPath } from '@/lib/assetLoader';
import MastheadClip from './MastheadClip';

interface BackgroundPatternProps {
  isVisible: boolean;
}

const BackgroundPattern: React.FC<BackgroundPatternProps> = ({ isVisible }) => {
  const iconPath = getAssetPath('home', 'icons.svg');
  
  return (
    <div className={`masthead-background ${isVisible ? 'visible' : ''}`}>
      <MastheadClip />
      <div className="clipped-section">
        <div className="gradient-content">
          <CanvasBackground className="gradient-background" />
          <div className="background-pattern" />
          <div className="pattern-overlay">
            <div 
              className="pattern-repeat"
              style={{
                backgroundImage: `url(${iconPath})`,
                backgroundRepeat: 'repeat',
                backgroundSize: '891px 510.75px',
                backgroundPosition: 'center',
                transform: 'rotate(-10deg) scale(1.5)',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackgroundPattern; 
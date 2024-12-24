'use client';

import React, { useState, useRef, useEffect } from 'react';
import './Tooltip.scss';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePosition = () => {
      if (!tooltipRef.current || !wrapperRef.current) return;

      const wrapper = wrapperRef.current.getBoundingClientRect();
      const tooltip = tooltipRef.current;

      // Position tooltip above the trigger
      tooltip.style.bottom = '100%';
      tooltip.style.left = '50%';
      tooltip.style.transform = 'translateX(-50%)';
      tooltip.style.marginBottom = '8px'; // Gap between tooltip and trigger
    };

    if (isVisible) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
    }

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isVisible]);

  return (
    <div 
      className={`tooltip-wrapper ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      ref={wrapperRef}
    >
      {children}
      {isVisible && (
        <div className="tooltip" ref={tooltipRef}>
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip; 
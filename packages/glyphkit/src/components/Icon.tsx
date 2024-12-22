import React from 'react';
import { icons } from '../icons/registry';

export interface IconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
  onError?: (error: Error) => void;
  onLoad?: () => void;
}

export const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 24, 
  color = 'currentColor',
  className = '',
  onError,
  onLoad
}) => {
  const icon = icons[name];
  if (!icon) {
    console.error(`Icon not found: ${name}`);
    return null;
  }

  return (
    <svg 
      className={`glyphkit-icon ${className}`.trim()}
      width={size}
      height={size}
      viewBox={icon.viewBox}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={icon.d}
        fill={color}
      />
    </svg>
  );
}; 
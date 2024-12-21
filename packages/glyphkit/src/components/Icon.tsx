import React, { memo } from 'react';
import { icons } from '../icons';

export interface IconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
  'aria-label'?: string;
  onError?: (error: Error) => void;
}

export const Icon = memo<IconProps>(({ 
  name, 
  size = 24, 
  color = 'currentColor',
  className = '',
  'aria-label': ariaLabel,
  onError,
}) => {
  const icon = icons[name];
  
  if (!icon) {
    onError?.(new Error(`Icon "${name}" not found`));
    return null;
  }

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox={icon.viewBox}
      fill={color}
      className={`glyphkit-icon ${className}`.trim()}
      aria-label={ariaLabel || `${name} icon`}
      role="img"
    >
      <path d={icon.path} />
    </svg>
  );
});

Icon.displayName = 'Icon'; 
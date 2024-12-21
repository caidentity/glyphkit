import React, { memo } from 'react';
import { icons } from '../icons';
import type { IconDefinition } from '../types/icon.types';

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
  const icon = icons[name] as IconDefinition;
  
  if (!icon) {
    onError?.(new Error(`Icon "${name}" not found`));
    return null;
  }

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox={icon.viewBox || '0 0 24 24'}
      fill={color}
      className={`glyphkit-icon ${className}`.trim()}
      aria-label={ariaLabel || `${name} icon`}
      role="img"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={icon.path} />
    </svg>
  );
});

Icon.displayName = 'Icon'; 
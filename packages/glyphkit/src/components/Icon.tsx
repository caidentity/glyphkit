import React, { memo } from 'react';

export interface IconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
  'aria-label'?: string;
  onError?: (error: Error) => void;
}

export const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 24, 
  color = 'currentColor',
  className = '',
  'aria-label': ariaLabel,
  onError,
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      className={`glyphkit-icon ${className}`.trim()}
      aria-label={ariaLabel || `${name} icon`}
      role="img"
    >
      <path 
        d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" 
        stroke="currentColor"
        fill={color}
      />
    </svg>
  );
};

export default memo(Icon); 
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

interface PathAttributes {
  d: string;
  fillRule?: string;
  clipRule?: string;
  fill?: string;
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
    const error = new Error(`Icon not found: ${name}`);
    onError?.(error);
    return null;
  }

  React.useEffect(() => {
    onLoad?.();
  }, [onLoad]);

  return (
    <svg 
      className={`glyphkit-icon ${className}`.trim()}
      width={size}
      height={size}
      viewBox={icon.viewBox}
      xmlns="http://www.w3.org/2000/svg"
    >
      {icon.d ? (
        // Single path format
        <path
          d={icon.d}
          fill={color}
        />
      ) : icon.paths ? (
        // Multi-path format
        icon.paths.map((pathData: PathAttributes, index: number) => (
          <path
            key={index}
            d={pathData.d}
            fill={pathData.fill || color}
            fillRule={pathData.fillRule}
            clipRule={pathData.clipRule}
          />
        ))
      ) : null}
    </svg>
  );
}; 
import React from 'react';
import { icons } from '../icons/registry';

// Define strict types for fill and clip rules
type RuleValue = 'nonzero' | 'evenodd' | 'inherit';

interface PathAttributes {
  d: string;
  fillRule?: RuleValue;
  clipRule?: RuleValue;
  fill?: string;
}

interface IconDefinition {
  viewBox: string;
  d?: string;
  paths?: PathAttributes[];
}

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
  const icon = icons[name] as IconDefinition;

  React.useEffect(() => {
    if (!icon) {
      const error = new Error(`Icon not found: ${name}`);
      onError?.(error);
    } else if (onLoad) {
      onLoad();
    }
  }, [icon, name, onError, onLoad]);

  if (!icon) {
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
            key={`icon-path-${index}`}
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

export default Icon; 
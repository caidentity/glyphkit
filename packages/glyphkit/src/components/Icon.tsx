import React, { memo } from 'react';
import { icons } from '../icons/index.js';

export interface IconProps {
  name: keyof typeof icons;
  size?: number;
  color?: string;
  className?: string;
  'aria-label'?: string;
  onError?: (error: Error) => void;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      svg: React.SVGProps<SVGSVGElement>;
    }
  }
}

export const Icon = memo<IconProps>(({ 
  name, 
  size = 24, 
  color = 'currentColor',
  className = '',
  'aria-label': ariaLabel,
  onError,
}) => {
  try {
    const icon = icons[name];
    if (!icon) {
      const error = new Error(`Icon "${name}" not found`);
      console.error('[Icon]', error);
      onError?.(error);
      return null;
    }

    return (
      <svg 
        className={`glyphkit-icon ${className}`.trim()}
        width={size}
        height={size}
        viewBox={icon.viewBox}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={ariaLabel || `${name} icon`}
        style={{ color }}
        dangerouslySetInnerHTML={{ 
          __html: icon.path 
        }}
      />
    );
  } catch (error) {
    console.error('[Icon] Render error:', error);
    onError?.(error as Error);
    return null;
  }
});

Icon.displayName = 'Icon'; 
import * as React from 'react';
import { memo } from 'react';
import { icons } from '../icons';

export interface IconProps {
  name: keyof typeof icons;
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
  try {
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
        style={{ color }}
        role="img"
        aria-label={ariaLabel || `${String(name)} icon`}
        dangerouslySetInnerHTML={{ __html: icon.path }}
      />
    );
  } catch (error) {
    console.error('[Icon] Render error:', error);
    onError?.(error as Error);
    return null;
  }
});

Icon.displayName = 'Icon'; 
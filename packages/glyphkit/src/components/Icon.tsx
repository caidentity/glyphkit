import React, { memo, useEffect, useState } from 'react';

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
  const [svgContent, setSvgContent] = useState<string | null>(null);

  useEffect(() => {
    const loadIcon = async () => {
      try {
        const response = await fetch(`/icons/${name}.svg`);
        if (!response.ok) {
          throw new Error(`Failed to load icon: ${name}`);
        }
        const svg = await response.text();
        setSvgContent(svg);
      } catch (error) {
        onError?.(error as Error);
      }
    };

    loadIcon();
  }, [name, onError]);

  if (!svgContent) return null;

  return (
    <div 
      className={`glyphkit-icon ${className}`.trim()}
      style={{ 
        width: size, 
        height: size,
        color: color 
      }}
      dangerouslySetInnerHTML={{ 
        __html: svgContent
          .replace(/width="([^"]+)"/, `width="${size}"`)
          .replace(/height="([^"]+)"/, `height="${size}"`)
          .replace(/fill="([^"]+)"/, `fill="currentColor"`)
      }}
      role="img"
      aria-label={ariaLabel || `${name} icon`}
    />
  );
});

Icon.displayName = 'Icon'; 
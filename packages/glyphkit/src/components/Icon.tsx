import { FC, useEffect, useState, useCallback, memo } from 'react';

export interface IconProps {
  name: string;
  size?: number | string;
  color?: string;
  className?: string;
  svgDirectory?: string;
  iconPrefix?: string;
  onError?: (error: Error) => void;
  onLoad?: () => void;
}

// Cache for loaded SVG content
const svgCache = new Map<string, string>();

export const Icon: FC<IconProps> = memo(({
  name,
  size = 24,
  color = 'currentColor',
  className,
  svgDirectory = 'public/icons',
  iconPrefix = 'gk',
  onError,
  onLoad
}) => {
  const [svgContent, setSvgContent] = useState<string | null>(() => svgCache.get(name) || null);
  const [error, setError] = useState<Error | null>(null);

  const loadIcon = useCallback(async () => {
    // Return cached content if available
    if (svgCache.has(name)) {
      const cachedContent = svgCache.get(name);
      if (cachedContent) {
        setSvgContent(cachedContent);
      }
      onLoad?.();
      return;
    }

    try {
      const iconPath = `${svgDirectory}/${name}.svg`;
      const response = await fetch(iconPath);
      
      if (!response.ok) {
        throw new Error(`Failed to load icon: ${name}`);
      }
      
      const content = await response.text();
      // Cache the SVG content
      svgCache.set(name, content);
      setSvgContent(content);
      onLoad?.();
    } catch (err) {
      const error = err as Error;
      setError(error);
      onError?.(error);
      console.error(`Error loading icon: ${name}`, error);
    }
  }, [name, svgDirectory, onError, onLoad]);

  useEffect(() => {
    loadIcon();
  }, [loadIcon]);

  if (error || !svgContent) return null;

  return (
    <svg
      width={size}
      height={size}
      fill={color}
      className={className}
      viewBox="0 0 24 24"
      data-icon={`${iconPrefix}-${name}`}
      aria-label={name}
      role="img"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
});

Icon.displayName = 'Icon'; 
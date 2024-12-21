'use client';

import React from 'react';
import { IconMetadata } from '@/types/icon';
import { loadSvgContent } from '@/lib/iconLoader';
import { useQuery } from '@tanstack/react-query';

interface IconProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: IconMetadata;
  className?: string;
  showSize?: boolean;
  customSize?: number;
}

const Icon: React.FC<IconProps> = ({ 
  icon, 
  className = "", 
  showSize = false,
  customSize,
  ...props 
}) => {
  const { data: svgContent } = useQuery({
    queryKey: ['icon-svg', icon.path],
    queryFn: () => loadSvgContent(icon.path.startsWith('/') ? icon.path : `/${icon.path}`),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  const iconSize = customSize || icon.size;

  return (
    <div 
      className={`inline-flex flex-col items-center ${className}`}
      {...props}
    >
      {svgContent && (
        <div 
          style={{ 
            width: iconSize, 
            height: iconSize 
          }}
          dangerouslySetInnerHTML={{ 
            __html: svgContent
              .replace(/width="([^"]+)"/, `width="${iconSize}"`)
              .replace(/height="([^"]+)"/, `height="${iconSize}"`)
          }} 
        />
      )}
      {showSize && (
        <span className="text-xs text-gray-400 mt-1">{iconSize}px</span>
      )}
    </div>
  );
};

export default Icon; 
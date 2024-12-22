'use client';

import React from 'react';
import { Icon as GlyphKitIcon } from '@glyphkit/glyphkit';
import { IconMetadata } from '@/types/icon';

interface IconRegistryItem {
  category: string;
  name: string;
}

interface IconRegistry {
  icons: Record<string, IconRegistryItem>;
  categories: Record<string, {
    icons: string[];
    count: number;
  }>;
}

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
  const iconSize = customSize || icon.size;
  
  // Use icon name directly since it's already processed by loadIconMetadata
  const iconName = icon.name;

  return (
    <div 
      className={`inline-flex flex-col items-center ${className}`}
      {...props}
    >
      <div style={{ width: iconSize, height: iconSize }}>
        <GlyphKitIcon
          name={iconName}
          size={iconSize}
          onError={(error) => console.error('Icon not found:', iconName)}
        />
      </div>
      {showSize && (
        <span className="text-xs text-gray-400 mt-1">
          {iconSize}px
        </span>
      )}
      <span className="text-xs text-gray-600 mt-1">
        {iconName}
      </span>
    </div>
  );
};

export default Icon; 
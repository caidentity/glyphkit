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

interface IconProps {
  icon: IconMetadata;
  className?: string;
  showSize?: boolean;
  showLabel?: boolean;
  customSize?: number;
  color?: string;
}

const Icon: React.FC<IconProps> = ({ 
  icon, 
  className = "", 
  showSize = false,
  showLabel = false,
  customSize,
  color = "#000000",
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
          color={color}
          onError={(error) => console.error('Icon not found:', iconName)}
        />
      </div>

    </div>
  );
};

export default Icon; 
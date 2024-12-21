'use client';

import React from 'react';
import Image from 'next/image';
import { IconMetadata } from '@/types/icon';

interface IconProps {
  icon: IconMetadata;
  className?: string;
  onClick?: () => void;
  showSize?: boolean;
}

const Icon = ({ icon, className = '', onClick, showSize = true }: IconProps) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  const previewSize = showSize 
    ? (icon.size === 16 ? '32px' : '48px') 
    : `${icon.size}px`;

  return (
    <div 
      className={`
        relative inline-flex items-center justify-center
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={{ width: previewSize, height: previewSize }}
      onClick={onClick}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-md" />
      )}
      {hasError ? (
        <div className="absolute inset-0 bg-red-50 flex items-center justify-center rounded-md">
          <span className="text-xs text-red-400">Error</span>
        </div>
      ) : (
        <Image
          src={icon.path}
          alt={icon.name}
          width={parseInt(previewSize)}
          height={parseInt(previewSize)}
          className={`
            w-full h-full object-contain
            transition-opacity duration-200
            ${isLoading ? 'opacity-0' : 'opacity-100'}
          `}
          onLoadingComplete={() => setIsLoading(false)}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
          }}
          priority={icon.size === 24}
        />
      )}
    </div>
  );
};

export default Icon; 
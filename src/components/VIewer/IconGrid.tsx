'use client';

import React from 'react';
import { IconMetadata } from '@/types/icon';
import Icon from './Icon';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Eye, Download, Link } from 'lucide-react';
import Button from "../Button/Button";

interface IconGridProps {
  icons: IconMetadata[];
  onIconSelect?: (icon: IconMetadata) => void;
  onIconDownload?: (icon: IconMetadata) => void;
  onIconCopy?: (icon: IconMetadata) => void;
  viewMode: 'grid' | 'list';
  iconScale: number;
  gridPadding: number;
}

const IconGrid: React.FC<IconGridProps> = ({ 
  icons, 
  onIconSelect,
  onIconDownload,
  onIconCopy,
  viewMode,
  iconScale,
  gridPadding
}) => {
  const parentRef = React.useRef<HTMLDivElement>(null);
  
  const calculateDynamicPadding = React.useCallback(() => {
    const basePadding = 24;
    const paddingReduction = (gridPadding - 2) * 2;
    return Math.max(8, basePadding - paddingReduction);
  }, [gridPadding]);

  const calculateIconSize = React.useCallback((baseSize: number) => {
    const scaleFactor = Math.max(0.8, 1 - (gridPadding - 4) * 0.1);
    return baseSize * iconScale * (viewMode === 'list' ? 1 : scaleFactor * 2);
  }, [gridPadding, iconScale, viewMode]);

  const dynamicPadding = calculateDynamicPadding();
  
  const renderIconCard = React.useCallback((icon: IconMetadata) => (
    <div 
      key={icon.path} 
      className={`
        group relative flex ${viewMode === 'list' ? 'flex-row' : 'flex-col'} 
        items-center border rounded-lg 
        hover:border-blue-500 hover:shadow-sm transition-all duration-200
        ${viewMode === 'list' ? 'p-4' : `p-${dynamicPadding/4}`}
        ${viewMode === 'list' ? 'gap-4' : 'gap-3'}
      `}
      style={{
        padding: viewMode === 'list' ? '1rem' : `${dynamicPadding}px`,
      }}
    >
      <div className={`
        flex items-center justify-center w-full
        ${viewMode === 'list' ? '' : 'mb-4'}
      `}>
        <Icon
          icon={icon}
          customSize={calculateIconSize(icon.size)}
          className={viewMode === 'list' ? 'p-2' : `p-${dynamicPadding/8}`}
        />
      </div>
      <div className={`
        w-full text-center space-y-1
        ${viewMode === 'list' ? '' : 'mt-auto'}
      `}>
        <p className="text-sm text-gray-600 truncate max-w-full px-2">
          {icon.name}
        </p>
        <span className="text-xs text-gray-400">
          {icon.size}px
        </span>
      </div>
      
      <div className="absolute inset-0 bg-white/90 opacity-0 
                    group-hover:opacity-100 transition-opacity duration-200 
                    flex items-center justify-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            onIconSelect?.(icon);
          }}
          className="w-8 h-8 p-0"
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            onIconDownload?.(icon);
          }}
          className="w-8 h-8 p-0"
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            onIconCopy?.(icon);
          }}
          className="w-8 h-8 p-0"
        >
          <Link className="h-4 w-4" />
        </Button>
      </div>
    </div>
  ), [viewMode, calculateIconSize, dynamicPadding, onIconSelect, onIconDownload, onIconCopy]);

  const rowVirtualizer = useVirtualizer({
    count: Math.ceil(icons.length / gridPadding),
    getScrollElement: () => parentRef.current,
    estimateSize: () => viewMode === 'list' ? 80 : 160 + dynamicPadding * 2,
    overscan: 5,
  });

  return (
    <div 
      ref={parentRef}
      className="h-[calc(100vh-300px)] overflow-auto"
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const startIndex = virtualRow.index * (viewMode === 'list' ? 1 : gridPadding);
          const rowIcons = icons.slice(
            startIndex, 
            startIndex + (viewMode === 'list' ? 1 : gridPadding)
          );

          return (
            <div
              key={virtualRow.index}
              className={`
                absolute top-0 left-0 w-full
                ${viewMode === 'grid' ? 'grid' : 'block'}
              `}
              style={{
                transform: `translateY(${virtualRow.start}px)`,
                padding: `${dynamicPadding}px`,
                gap: `${dynamicPadding}px`,
                gridTemplateColumns: viewMode === 'grid' 
                  ? `repeat(${gridPadding}, minmax(0, 1fr))`
                  : 'none',
                height: viewMode === 'list' ? 'auto' : `${virtualRow.size}px`,
              }}
            >
              {rowIcons.map(renderIconCard)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IconGrid; 
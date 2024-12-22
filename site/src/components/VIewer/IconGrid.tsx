'use client';

import React from 'react';
import { IconMetadata } from '@/types/icon';
import Icon from './Icon';
import { useViewportSize } from '@/hooks/useViewportSize';
import iconRegistry from '@/lib/iconRegistry.json';
import { useVirtualizer } from '@tanstack/react-virtual';

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
  const { width } = useViewportSize();

  const getResponsiveColumns = React.useCallback(() => {
    if (viewMode === 'list') return 1;
    if (width < 640) return 2;
    if (width < 1024) return 4;
    return Math.min(gridPadding, 5);
  }, [viewMode, gridPadding, width]);

  const columns = getResponsiveColumns();
  
  const calculateDynamicPadding = React.useCallback(() => {
    const basePadding = 24;
    const paddingReduction = (columns - 2) * 2;
    return Math.max(8, basePadding - paddingReduction);
  }, [columns]);

  const calculateIconSize = React.useCallback((baseSize: number) => {
    const scaleFactor = Math.max(0.8, 1 - (columns - 4) * 0.1);
    return baseSize * iconScale * (viewMode === 'list' ? 1 : scaleFactor * 2);
  }, [columns, iconScale, viewMode]);

  const dynamicPadding = calculateDynamicPadding();

  const renderIconCard = React.useCallback((icon: IconMetadata) => {
    return (
      <div
        key={icon.name}
        onClick={() => onIconSelect?.(icon)}
        className={`
          relative flex flex-col 
          items-center border rounded-lg 
          hover:border-blue-500 hover:shadow-sm transition-all duration-200
          ${viewMode === 'list' ? 'p-4' : `p-${dynamicPadding/4}`}
          ${viewMode === 'list' ? 'gap-4' : 'gap-3'}
        `}
        style={{
          padding: viewMode === 'list' ? '1rem' : `${dynamicPadding}px`,
        }}
      >
        <Icon
          icon={icon}
          customSize={calculateIconSize(icon.size)}
          className={viewMode === 'list' ? 'flex-shrink-0' : ''}
        />
        
        <div className={`
          flex ${viewMode === 'list' ? 'flex-row gap-4' : 'flex-col gap-2'} 
          items-center
        `}>
          {onIconDownload && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onIconDownload(icon);
              }}
              className="text-gray-500 hover:text-blue-500"
            >
              Download
            </button>
          )}
          {onIconCopy && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onIconCopy(icon);
              }}
              className="text-gray-500 hover:text-blue-500"
            >
              Copy
            </button>
          )}
        </div>
      </div>
    );
  }, [viewMode, dynamicPadding, calculateIconSize, onIconSelect, onIconDownload, onIconCopy]);

  const rowVirtualizer = useVirtualizer({
    count: Math.ceil(icons.length / getResponsiveColumns()),
    getScrollElement: () => parentRef.current,
    estimateSize: () => 150, // Estimate row height
    overscan: 5,
  });

  return (
    <div ref={parentRef} className="h-[800px] overflow-auto">
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const startIndex = virtualRow.index * columns;
          const rowIcons = icons.slice(startIndex, startIndex + columns);
          
          return (
            <div
              key={virtualRow.index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: virtualRow.size,
                transform: `translateY(${virtualRow.start}px)`,
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gap: '1rem',
                padding: '0.5rem',
              }}
            >
              {rowIcons.map((icon) => renderIconCard(icon))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IconGrid; 
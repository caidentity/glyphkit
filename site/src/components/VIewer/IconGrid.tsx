'use client';

import React from 'react';
import { IconMetadata } from '@/types/icon';
import Icon from './Icon';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Eye, Download, Link } from 'lucide-react';
import Button from "@/components/Button/Button";
import { useViewportSize } from '@/hooks/useViewportSize';
import { useQueries } from '@tanstack/react-query';
import { loadSvgContent } from '@/lib/iconLoader';

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
    
    // Get max columns based on viewport
    let maxColumns;
    if (width < 640) maxColumns = 2;      // Mobile
    else if (width < 1024) maxColumns = 4; // Tablet
    else maxColumns = 5;                   // Desktop

    // Return the smaller of user-selected columns or viewport max
    return Math.min(gridPadding, maxColumns);
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
    count: Math.ceil(icons.length / columns),
    getScrollElement: () => parentRef.current,
    estimateSize: () => viewMode === 'list' ? 80 : 160 + dynamicPadding * 2,
    overscan: 5,
  });

  // Batch load SVGs
  const iconQueries = useQueries({
    queries: icons.map(icon => ({
      queryKey: ['icon-svg', icon.path],
      queryFn: () => loadSvgContent(icon.path.startsWith('/') ? icon.path : `/${icon.path}`),
      staleTime: 1000 * 60 * 60, // 1 hour
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      enabled: true,
    })),
  });

  const isLoading = iconQueries.some(query => query.isLoading);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

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
          const startIndex = virtualRow.index * (viewMode === 'list' ? 1 : columns);
          const rowIcons = icons.slice(
            startIndex, 
            startIndex + (viewMode === 'list' ? 1 : columns)
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
                  ? `repeat(${columns}, minmax(0, 1fr))`
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
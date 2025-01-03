'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IconMetadata } from '@/types/icon';
import Icon from './Icon';
import { useVirtualizer } from '@tanstack/react-virtual';
import './styling/IconViewer.scss';
import { Icon as GlyphKitIcon } from '@glyphkit/glyphkit';
import Tooltip from '../Tooltip/Tooltip';
import Button from '../Button/Button';

interface IconGridProps {
  icons: IconMetadata[];
  onIconSelect?: (icon: IconMetadata) => void;
  onIconDownload?: (icon: IconMetadata) => void;
  onIconCopy?: (text: string, type?: 'name' | 'code') => void;
  viewMode: 'grid' | 'list';
  iconScale?: number;
  gridPadding?: number;
}

const IconGrid: React.FC<IconGridProps> = React.memo(({ 
  icons, 
  onIconSelect,
  onIconDownload,
  onIconCopy,
  viewMode,
  iconScale = 1,
  gridPadding = 6
}) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate grid dimensions with flexible columns (2-10)
  const gridDimensions = useMemo(() => {
    const baseColumns = 5;
    const gap = gridPadding;
    
    if (!containerWidth) {
      return { columns: baseColumns, itemWidth: 100 };
    }

    // Adjust columns based on iconScale (2-10 columns)
    const adjustedColumns = Math.min(10, Math.max(2, Math.round(baseColumns / iconScale)));
    
    // Calculate item width based on container width and gaps
    const totalGapWidth = gap * (adjustedColumns - 1);
    const availableWidth = containerWidth - totalGapWidth - (gap * 2); // Account for outer padding
    const itemWidth = availableWidth / adjustedColumns;

    return { 
      columns: adjustedColumns,
      itemWidth: Math.max(80, itemWidth)
    };
  }, [containerWidth, gridPadding, iconScale]);

  // Update container width on resize
  useEffect(() => {
    const updateWidth = () => {
      if (parentRef.current) {
        const width = parentRef.current.getBoundingClientRect().width;
        setContainerWidth(width);
      }
    };

    updateWidth();
    const resizeObserver = new ResizeObserver(updateWidth);
    if (parentRef.current) {
      resizeObserver.observe(parentRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // Virtual list configuration with extra padding
  const rowVirtualizer = useVirtualizer({
    count: Math.ceil(icons.length / gridDimensions.columns),
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback(() => {
      // Add extra padding to prevent overlap
      const baseHeight = viewMode === 'list' ? 60 : gridDimensions.itemWidth;
      return baseHeight + (gridPadding * 3); // Extra padding between rows
    }, [viewMode, gridDimensions.itemWidth, gridPadding]),
    overscan: 5,
  });

  const calculateIconSize = useCallback((baseSize: number) => {
    if (viewMode === 'list') {
      return 24;
    }
    return Math.floor(baseSize * iconScale);
  }, [viewMode, iconScale]);

  // Render icon card with error boundary
  const renderIconCard = useCallback((icon: IconMetadata) => {
    if (!icon) return null;

    try {
      return (
        <div
          key={`${icon.name}_${icon.size}`}
          onClick={() => onIconSelect?.(icon)}
          className={viewMode === 'list' ? 'viewer-list__item' : 'viewer-grid__item'}
          role="button"
          tabIndex={0}
        >
          <div className="viewer-grid__item-content">
            <Icon
              icon={icon}
              customSize={calculateIconSize(icon.size)}
              className={viewMode === 'list' ? 'viewer-list__item-icon' : 'viewer-grid__item-icon'}
              showLabel={false}
            />
            <span 
              className={viewMode === 'list' ? 'viewer-list__item-name' : 'viewer-grid__item-name'}
              text-sm
            >
              {icon.name}
            </span>
          </div>

          <div className={viewMode === 'list' ? 'viewer-list__item-actions' : 'viewer-grid__item-actions'}>
            <Tooltip content="Copy name">
              <Button
                variant="outline"
                size="xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onIconCopy?.(icon.name, 'name');
                }}
                className="icon-action-button"
              >
                <GlyphKitIcon name="text_24" size={16} />
              </Button>
            </Tooltip>

            <Tooltip content="Copy code">
              <Button
                variant="outline"
                size="xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onIconCopy?.(icon.name, 'code');
                }}
                className="icon-action-button"
              >
              <GlyphKitIcon name="arrow_chevron_left_right_24" size={16} />
            </Button>
            </Tooltip>

            <Tooltip content="Download SVG">
              <Button
                variant="outline"
                size="xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onIconDownload?.(icon);
                }}
                className="icon-action-button"
              >
                <GlyphKitIcon name="arrow_line_wall_down_24" size={16} />
              </Button>
            </Tooltip>
          </div>
        </div>
      );
    } catch (error) {
      console.error('Error rendering icon card:', error);
      return null;
    }
  }, [viewMode, onIconSelect, onIconCopy, onIconDownload, calculateIconSize]);

  // Render grid rows
  const renderRow = useCallback((virtualRow: any) => {
    const startIndex = virtualRow.index * gridDimensions.columns;
    const rowIcons = icons.slice(startIndex, startIndex + gridDimensions.columns);

    return (
      <div
        key={virtualRow.index}
        className={`icon-viewer__row ${viewMode === 'list' ? 'icon-viewer__row--list' : ''}`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: virtualRow.size,
          transform: `translateY(${virtualRow.start}px)`,
          display: 'flex',
          gap: gridPadding,
          padding: gridPadding,
          boxSizing: 'border-box',
          marginBottom: gridPadding, // Extra space between rows
        }}
      >
        {rowIcons.map((icon) => (
          <div
            key={`${icon.name}_${icon.size}`}
            style={{
              width: viewMode === 'list' ? '100%' : `${100 / gridDimensions.columns}%`,
              height: viewMode === 'list' ? 60 : 'auto',
              boxSizing: 'border-box',
            }}
          >
            {renderIconCard(icon)}
          </div>
        ))}
      </div>
    );
  }, [icons, gridDimensions.columns, renderIconCard, viewMode, gridPadding]);

  return (
    <div 
      ref={parentRef}
      className={`icon-viewer ${isLoading ? 'icon-viewer--loading' : ''}`}
      style={{ 
        height: '100%', 
        overflow: 'auto',
        width: '100%',
        position: 'relative',
      }}
    >
      <div
        className={`icon-viewer__grid ${viewMode === 'list' ? 'icon-viewer__grid--list' : ''}`}
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map(renderRow)}
      </div>
      
      {icons.length === 0 && (
        <div className="icon-viewer__empty">
          No icons found matching your criteria
        </div>
      )}
    </div>
  );
});

IconGrid.displayName = 'IconGrid';

export default IconGrid; 
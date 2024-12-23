'use client';

import React from 'react';
import { IconMetadata } from '@/types/icon';
import Icon from './Icon';
import { useViewportSize } from '@/hooks/useViewportSize';
import iconRegistry from '@/lib/iconRegistry.json';
import { useVirtualizer } from '@tanstack/react-virtual';
import Button from '../Button/Button';
import { Download, Code } from 'lucide-react';

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
        key={`${icon.name}_${icon.size}`}
        onClick={() => onIconSelect?.(icon)}
        className={`${
          viewMode === 'list' ? 'viewer-list__item' : 'viewer-grid__item'
        }`}
      >
        <div className="viewer-grid__item-content">
          <Icon
            icon={icon}
            customSize={calculateIconSize(icon.size)}
            className={`${
              viewMode === 'list' 
                ? 'viewer-list__item-icon' 
                : 'viewer-grid__item-icon'
            }`}
            showLabel={false}
          />
          <span 
            className={`
              ${viewMode === 'list' ? 'viewer-list__item-name' : 'viewer-grid__item-name'}
              text-sm
            `}
          >
            {icon.name}
          </span>
        </div>
        
        <div className={viewMode === 'list' ? 'viewer-list__item-actions' : 'viewer-grid__item-actions'}>
          {onIconDownload && (
            <Button
              variant="default"
              size="xs"
              onClick={(e) => {
                e.stopPropagation();
                onIconDownload(icon);
              }}
              className="icon-action-button"
              title="Download"
            >
              <Download className="h-3 w-3" />
            </Button>
          )}
          {onIconCopy && (
            <Button
              variant="outline"
              size="xs"
              onClick={(e) => {
                e.stopPropagation();
                onIconCopy(icon);
              }}
              className="icon-action-button"
              title="Copy"
            >
              <Code className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    );
  }, [viewMode, calculateIconSize, onIconSelect, onIconDownload, onIconCopy]);

  const rowVirtualizer = useVirtualizer({
    count: Math.ceil(icons.length / getResponsiveColumns()),
    getScrollElement: () => parentRef.current,
    estimateSize: () => 150, // Estimate row height
    overscan: 5,
  });

  // Get grid size class based on padding/icons per row
  const getSizeClass = () => {
    if (gridPadding <= 4) return 'viewer-grid--small';
    if (gridPadding >= 8) return 'viewer-grid--large';
    return 'viewer-grid--medium';
  };

  return (
    <div className="viewer-grid-wrapper">
      <div className={`viewer-grid ${getSizeClass()}`}>
        {icons.map((icon) => renderIconCard(icon))}
      </div>
    </div>
  );
};

export default IconGrid; 
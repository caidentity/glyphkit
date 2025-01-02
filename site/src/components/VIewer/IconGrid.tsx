'use client';

import React, { useState, useEffect } from 'react';
import { IconMetadata, IconCategory, IconTag } from '@/types/icon';
import Icon from './Icon';
import { useViewportSize } from '@/hooks/useViewportSize';
import { useVirtualizer } from '@tanstack/react-virtual';
import Button from '../Button/Button';
import { Download } from 'lucide-react';
import { Icon as GlyphKitIcon } from '@glyphkit/glyphkit';
import Tooltip from '../Tooltip/Tooltip';
import { calculateTagCounts, getCategories } from '@/lib/iconLoader';

interface IconGridProps {
  icons: IconMetadata[];
  onIconSelect?: (icon: IconMetadata) => void;
  onIconDownload?: (icon: IconMetadata) => void;
  onIconCopy?: (text: string) => void;
  viewMode: 'grid' | 'list';
  iconScale: number;
  gridPadding: number;
}

const IconGrid: React.FC<IconGridProps> = React.memo(({ 
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

  const calculateIconSize = React.useCallback((baseSize: number) => {
    const columns = getResponsiveColumns();
    const scaleFactor = Math.max(0.8, 1 - (columns - 4) * 0.1);
    return baseSize * iconScale * (viewMode === 'list' ? 1 : scaleFactor * 2);
  }, [getResponsiveColumns, iconScale, viewMode]);

  const renderIconCard = React.useCallback((icon: IconMetadata) => (
    <div
      key={`${icon.name}_${icon.size}`}
      onClick={() => onIconSelect?.(icon)}
      className={`${viewMode === 'list' ? 'viewer-list__item' : 'viewer-grid__item'}`}
    >
      <div className="viewer-grid__item-content">
        <Icon
          icon={icon}
          customSize={calculateIconSize(icon.size)}
          className={`${viewMode === 'list' ? 'viewer-list__item-icon' : 'viewer-grid__item-icon'}`}
          showLabel={false}
        />
        <span className={`${viewMode === 'list' ? 'viewer-list__item-name' : 'viewer-grid__item-name'} text-sm`}>
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
              onIconCopy?.(icon.name);
            }}
            className="icon-action-button"
          >
            <GlyphKitIcon name="text_24" size={16} />
          </Button>
        </Tooltip>

        <Tooltip content="Copy path">
          <Button
            variant="outline"
            size="xs"
            onClick={(e) => {
              e.stopPropagation();
              onIconCopy?.(icon.path);
            }}
            className="icon-action-button"
          >
            <GlyphKitIcon name="arrow_chevron_left_right_24" size={16} />
          </Button>
        </Tooltip>

        <Tooltip content="Download icon">
          <Button
            variant="outline"
            size="xs"
            onClick={(e) => {
              e.stopPropagation();
              onIconDownload?.(icon);
            }}
            className="icon-action-button"
          >
            <Download className="h-4 w-4" />
          </Button>
        </Tooltip>
      </div>
    </div>
  ), [viewMode, calculateIconSize, onIconSelect, onIconDownload, onIconCopy]);

  const getSizeClass = () => {
    if (gridPadding <= 4) return 'viewer-grid--small';
    if (gridPadding >= 8) return 'viewer-grid--large';
    return 'viewer-grid--medium';
  };

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, [icons]);

  return (
    <div className="viewer-grid-wrapper">
      <div className={`viewer-grid ${getSizeClass()} ${isLoading ? 'viewer-grid--loading' : ''}`}>
        {icons.map((icon) => renderIconCard(icon))}
      </div>
    </div>
  );
});

IconGrid.displayName = 'IconGrid';

export default IconGrid; 
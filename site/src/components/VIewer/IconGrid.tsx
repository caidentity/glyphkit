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
import FilterPanel from './FilterPanel';

interface IconGridProps {
  icons: IconMetadata[];
  onIconSelect?: (icon: IconMetadata) => void;
  onIconDownload?: (icon: IconMetadata) => void;
  onIconCopy?: (text: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  iconScale: number;
  setIconScale: (scale: number) => void;
  gridPadding: number;
  setGridPadding: (padding: number) => void;
}

const IconGrid: React.FC<IconGridProps> = ({ 
  icons, 
  onIconSelect,
  onIconDownload,
  onIconCopy,
  viewMode,
  setViewMode,
  iconScale,
  setIconScale,
  gridPadding,
  setGridPadding
}) => {
  const parentRef = React.useRef<HTMLDivElement>(null);
  const { width } = useViewportSize();

  // Local state for filtering
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tags, setTags] = useState<IconTag[]>([]);
  const [categories, setCategories] = useState<IconCategory[]>([]);

  // Load categories and tags on mount
  useEffect(() => {
    const loadIconData = async () => {
      try {
        const response = await fetch('/registry/iconRegistry.json');
        if (!response.ok) {
          throw new Error('Failed to load icon registry');
        }
        
        const iconRegistry = await response.json();
        const calculatedTags = calculateTagCounts(iconRegistry);
        const loadedCategories = getCategories(iconRegistry);
        
        setTags(calculatedTags || []);
        setCategories(loadedCategories || []);
      } catch (error) {
        console.error('Failed to load icon registry:', error);
        // Set empty arrays on error to prevent undefined
        setTags([]);
        setCategories([]);
      }
    };

    loadIconData();
  }, []);

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

  const hasActiveFilters = selectedSize !== null || 
    selectedCategories.length > 0 || 
    selectedTags.length > 0;

  const handleResetFilters = () => {
    setSelectedSize(null);
    setSelectedCategories([]);
    setSelectedTags([]);
  };

  const getSizeClass = () => {
    if (gridPadding <= 4) return 'viewer-grid--small';
    if (gridPadding >= 8) return 'viewer-grid--large';
    return 'viewer-grid--medium';
  };

  return (
    <div className="viewer">
      <FilterPanel
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        viewMode={viewMode}
        setViewMode={setViewMode}
        iconScale={iconScale}
        setIconScale={setIconScale}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        categories={categories}
        tags={tags}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
        gridPadding={gridPadding}
        setGridPadding={setGridPadding}
      />
      <div className="viewer-grid-wrapper">
        <div className={`viewer-grid ${getSizeClass()}`}>
          {icons.map((icon) => renderIconCard(icon))}
        </div>
      </div>
    </div>
  );
};

export default IconGrid; 
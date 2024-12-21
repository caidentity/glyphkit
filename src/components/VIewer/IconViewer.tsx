'use client';

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Download, X, Link, Check, Code, ArrowDownToLine, FileText, Grid, List, SlidersHorizontal } from 'lucide-react';
import  Input  from "../Input/Input";
import  Button  from "../Button/Button";
import Badge  from "../Badge/Badge";
import { IconMetadata, hasTag, hasTags } from '@/types/icon';
import { loadIconMetadata, loadSvgContent } from '@/lib/iconLoader';
import IconGrid from './IconGrid';
import Icon from './Icon';
import AlertDescription from "../Alert/AlertDescription";
import Alert from "../Alert/Alert";
import { useVirtualizer } from '@tanstack/react-virtual';
import Slider from "../Slider/Slider";
import FilterPanel from './FilterPanel';
import { useIconFiltering } from './useIconFiltering';
import { IconCategory } from '@/types/icon';
import './styling/Viewer.scss';
import IconDetailPanel from './IconDetailPanel';

const IconViewer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSize, setSelectedSize] = useState<number | null>(24);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedIcon, setSelectedIcon] = useState<IconMetadata | null>(null);
  const [copyAlert, setCopyAlert] = useState<string | null>(null);
  const [showLargePreview, setShowLargePreview] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [iconScale, setIconScale] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [gridPadding, setGridPadding] = useState<number>(16);

  const { data: categories = [], isLoading, error } = useQuery<IconCategory[]>({
    queryKey: ['icons-metadata'],
    queryFn: loadIconMetadata,
  });

  const allIcons = useMemo(() => {
    return categories.flatMap(category => category.icons);
  }, [categories]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    allIcons.forEach(icon => {
      icon.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [allIcons]);

  const { filteredIcons, hasActiveFilters } = useIconFiltering({
    allIcons,
    searchQuery,
    selectedSize,
    selectedCategories,
  });

  const handleDownload = async (icon: IconMetadata) => {
    try {
      const svgContent = await loadSvgContent(icon.path);
      if (svgContent) {
        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${icon.name}-${icon.size}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading icon:', error);
    }
  };

  const handleCopy = async (iconName: string) => {
    try {
      await navigator.clipboard.writeText(iconName);
      setCopyAlert(`Copied "${iconName}" to clipboard`);
      setTimeout(() => setCopyAlert(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      setCopyAlert('Failed to copy to clipboard');
      setTimeout(() => setCopyAlert(null), 2000);
    }
  };

  const renderTags = () => {
    if (!selectedIcon?.tags?.length) {
      return <p className="text-sm text-gray-400">No tags</p>;
    }
    return selectedIcon.tags.map(tag => (
      <Badge key={tag} variant="secondary">{tag}</Badge>
    ));
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSize(null);
    setSelectedCategories([]);
  };

  return (
    <div className="viewer">
      <div className="viewer-header">
        <h1 className="viewer-header__title">Glyph Kit</h1>
        <p className="viewer-header__subtitle">
          Showing {filteredIcons.length} of {allIcons.length} icons
          {(selectedCategories.length > 0 || searchQuery) && (
            <span className="viewer-header__subtitle-highlight">
              {selectedCategories.length > 0 && (
                <span className="mr-2">
                  in {selectedCategories.length} {selectedCategories.length === 1 ? 'category' : 'categories'}
                </span>
              )}
              {searchQuery && (
                <span>matching "{searchQuery}"</span>
              )}
            </span>
          )}
        </p>
      </div>

      <div className="viewer-search">
        <div className="viewer-search__input-wrapper">
          <Input
            type="text"
            placeholder="Search icons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="viewer-search__input"
          />
          <Search className="viewer-search__icon" />
        </div>
      </div>

      <div className="viewer-mobile-filter">
        <Button
          variant="outline"
          onClick={() => setIsFilterOpen(true)}
          className="viewer-mobile-filter__button"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </div>

      <div className="viewer-content">
        <div className="viewer-content__sidebar">
          <FilterPanel
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            viewMode={viewMode}
            setViewMode={setViewMode}
            iconScale={iconScale}
            setIconScale={setIconScale}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            categories={categories}
            hasActiveFilters={hasActiveFilters}
            onResetFilters={handleResetFilters}
            gridPadding={gridPadding}
            setGridPadding={setGridPadding}
          />
        </div>

        <div className="viewer-content__main">
          {isLoading ? (
            <div className="viewer-loading">
              <div className="viewer-loading__spinner" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertDescription>Failed to load icons</AlertDescription>
            </Alert>
          ) : filteredIcons.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No icons found matching your criteria
            </div>
          ) : (
            <IconGrid 
              icons={filteredIcons} 
              onIconSelect={setSelectedIcon}
              onIconDownload={handleDownload}
              onIconCopy={(icon) => handleCopy(icon.name)}
              viewMode={viewMode}
              iconScale={iconScale}
              gridPadding={gridPadding}
            />
          )}
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      {isFilterOpen && (
        <div className="viewer-filter-overlay">
          <div className="viewer-filter-overlay__panel">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Filters</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFilterOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <FilterPanel
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              viewMode={viewMode}
              setViewMode={setViewMode}
              iconScale={iconScale}
              setIconScale={setIconScale}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              categories={categories}
              hasActiveFilters={hasActiveFilters}
              onResetFilters={handleResetFilters}
              gridPadding={gridPadding}
              setGridPadding={setGridPadding}
            />
          </div>
        </div>
      )}

      {/* Details Panel */}
      {selectedIcon && (
        <IconDetailPanel
          icon={selectedIcon}
          onClose={() => setSelectedIcon(null)}
          onDownload={handleDownload}
          onCopy={handleCopy}
        />
      )}

      {/* Copy Alert */}
      {copyAlert && (
        <div className="viewer-alert">
          <Alert variant="success">
            <Check className="h-4 w-4 mr-2" />
            <AlertDescription>{copyAlert}</AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
};

export default IconViewer; 
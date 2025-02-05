'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Search, Download, X, Link, Check, Code, ArrowDownToLine, FileText, Grid, List, SlidersHorizontal } from 'lucide-react';
import Input from "../Input/Input";
import Button from "../Button/Button";
import Badge from "@/components/Badge/Badge";
import { IconMetadata, hasTag, hasTags } from '@/types/icon';
import { loadIconMetadata, loadSvgContent } from '@/lib/iconLoader';
import IconGrid from './IconGrid';
import Icon from './Icon';
import AlertDescription from "@/components/Alert/AlertDescription";
import Alert from "../Alert/Alert";
import { useVirtualizer } from '@tanstack/react-virtual';
import Slider from "../Slider/Slider";
import FilterPanel from './FilterPanel';
import { useIconFiltering } from './useIconFiltering';
import { IconCategory } from '@/types/icon';
import './styling/Viewer.scss';
import IconDetailPanel from './IconDetailPanel';
import Tooltip from '../Tooltip/Tooltip';
import SearchInput, { SearchSuggestion } from '../Search/SearchInput';
import { useDebounce } from '../../hooks/useDebounce';
import Toast, { ToastType } from '../Toast/Toast';
import { AnimatePresence } from 'framer-motion';
import { useSearchSuggestions } from '../../hooks/useSearchSuggestions';
import { useSearch } from '@/contexts/SearchContext';

export default function IconViewer() {
  const [searchQuery, setSearchQuery] = useState('');
  const { query, setQuery, selectedSuggestion } = useSearch();
  const [selectedSize, setSelectedSize] = useState<number | null>(24);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedIcon, setSelectedIcon] = useState<IconMetadata | null>(null);
  const [showLargePreview, setShowLargePreview] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [iconScale, setIconScale] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [gridPadding, setGridPadding] = useState<number>(16);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('currentColor');

  const queryClient = useQueryClient();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const initialSearch = searchParams.get('search') || '';
    if (initialSearch) {
      setSearchQuery(initialSearch);
      const newUrl = `${window.location.pathname}?search=${encodeURIComponent(initialSearch)}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const newUrl = `${window.location.pathname}?search=${encodeURIComponent(searchQuery)}`;
      window.history.replaceState({}, '', newUrl);
    } else {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [searchQuery]);

  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['iconMetadata'],
    queryFn: loadIconMetadata,
    staleTime: Infinity,
    gcTime: Infinity,
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

  useDebounce(() => {
    setDebouncedSearch(searchQuery);
  }, 150, [searchQuery]);

  useEffect(() => {
    if (debouncedSearch) {
      const newUrl = `${window.location.pathname}?search=${encodeURIComponent(debouncedSearch)}`;
      window.history.replaceState({}, '', newUrl);
    } else {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [debouncedSearch]);

  const { 
    filteredIcons, 
    hasActiveFilters, 
    totalResults 
  } = useIconFiltering({
    allIcons,
    searchQuery: debouncedSearch,
    selectedSize,
    selectedCategories,
    selectedTags
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

  const handleCopy = async (text: string, type: 'name' | 'code' = 'name') => {
    try {
      let copyText = text;
      if (type === 'code') {
        copyText = `import { Icon } from '@glyphkit/glyphkit';\n\n<Icon name="${text}" size={24} />`;
      }
      
      await navigator.clipboard.writeText(copyText);
      setToast({ 
        message: `Copied ${type === 'code' ? 'code snippet' : `"${text}"`} to clipboard`, 
        type: 'success' 
      });
    } catch (error) {
      console.error('Failed to copy:', error);
      setToast({ message: 'Failed to copy to clipboard', type: 'error' });
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
    setSelectedSize(24);
    setSelectedCategories([]);
    setSelectedTags([]);
    setIconScale(1);
    setIsDetailPanelOpen(false);
    setSelectedIcon(null);
    setSelectedColor('currentColor');
    window.history.replaceState({}, '', window.location.pathname);
  };

  const prefetchSvgs = React.useCallback(async (icons: IconMetadata[]) => {
    const paths = icons.map(icon => icon.path);
    await Promise.all(paths.map(path => loadSvgContent(path)));
  }, []);

  const handleIconSelect = (icon: IconMetadata) => {
    setSelectedIcon(icon);
    setIsDetailPanelOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailPanelOpen(false);
    setTimeout(() => setSelectedIcon(null), 300);
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    const newUrl = `${window.location.pathname}?search=${encodeURIComponent(value)}`;
    window.history.replaceState({}, '', newUrl);
  };

  const handleCategoryToggle = (categoryName: string) => {
    if (!categoryName) return;
    
    setSelectedCategories(prev => {
      // If category is already selected, remove it
      if (prev.includes(categoryName)) {
        return prev.filter(cat => cat !== categoryName);
      }
      // Add the category to existing selection
      return [...prev, categoryName];
    });
  };

  const handleTagToggle = (tagName: string) => {
    if (!tagName) return;
    
    setSelectedTags(prev => {
      // If already selected, clear selection
      if (prev.includes(tagName)) {
        return [];
      }
      // Otherwise, set only this tag
      return [tagName];
    });
    
    // Clear other filters when selecting a tag
    setSelectedCategories([]);
    setSearchQuery('');
  };

  const filterPanel = (
    <FilterPanel
      selectedSize={selectedSize}
      setSelectedSize={setSelectedSize}
      viewMode={viewMode}
      setViewMode={setViewMode}
      iconScale={iconScale}
      setIconScale={setIconScale}
      selectedCategories={selectedCategories}
      setSelectedCategories={handleCategoryToggle}
      selectedTags={selectedTags}
      setSelectedTags={handleTagToggle}
      categories={categories}
      tags={allTags.map(tag => ({ 
        name: tag, 
        count: allIcons.filter(icon => icon.tags?.includes(tag)).length 
      }))}
      hasActiveFilters={hasActiveFilters}
      onResetFilters={handleResetFilters}
      gridPadding={gridPadding}
      setGridPadding={setGridPadding}
      selectedColor={selectedColor}
      setSelectedColor={setSelectedColor}
    />
  );

  useEffect(() => {
    // Cleanup function to reset state when component unmounts
    return () => {
      setSearchQuery('');
      setSelectedSize(null);
      setSelectedCategories([]);
      setSelectedTags([]);
      setIconScale(1);
      setIsFilterOpen(false);
      setIsDetailPanelOpen(false);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        const newUrl = `${window.location.pathname}?search=${encodeURIComponent(searchQuery)}`;
        window.history.replaceState({}, '', newUrl);
      } else {
        window.history.replaceState({}, '', window.location.pathname);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (categories.length > 0 && !categories.some(c => selectedCategories.includes(c.name))) {
      setSelectedCategories([]);
    }
  }, [categories]);

  // Effect to handle search state restoration and filters
  useEffect(() => {
    // Restore search state from homepage
    const lastSearch = sessionStorage.getItem('lastSearch');
    if (lastSearch) {
      setSearchQuery(lastSearch);
      setQuery(lastSearch);
      sessionStorage.removeItem('lastSearch');
    }

    const searchType = sessionStorage.getItem('searchType');
    const searchValue = sessionStorage.getItem('searchValue');

    if (searchType && searchValue) {
      // Handle filters based on suggestion type
      if (searchType === 'category') {
        setSelectedCategories([searchValue]);
      } else if (searchType === 'tag') {
        setSelectedTags([searchValue]);
      }
      
      sessionStorage.removeItem('searchType');
      sessionStorage.removeItem('searchValue');
    }
  }, [setQuery, setSelectedCategories, setSelectedTags]);

  // Effect to sync search query with global state
  useEffect(() => {
    setSearchQuery(query);
  }, [query]);

  // Add error handling for empty states
  if (!categories.length) {
    return (
      <div className="p-4">
        No icon categories available. Please try refreshing the page.
      </div>
    );
  }

  return (
    <div className="viewer">
      <div className="viewer-content">
        <div className="viewer-content__sidebar">
          {filterPanel}
        </div>

        <div className="viewer-content__main">
          <IconGrid 
            icons={filteredIcons}
            onIconSelect={handleIconSelect}
            onIconDownload={handleDownload}
            onIconCopy={handleCopy}
            viewMode={viewMode}
            iconScale={iconScale}
            gridPadding={gridPadding}
            iconColor={selectedColor}
          />
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      {isFilterOpen && (
        <div className="viewer-filter-overlay">
          <div className="viewer-filter-overlay__panel">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Filters</h2>
              <Button
                variant="tertiary"
                size="sm"
                onClick={() => setIsFilterOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {filterPanel}
          </div>
        </div>
      )}

      {/* Details Panel */}
      {selectedIcon && (
        <IconDetailPanel
          icon={selectedIcon}
          isOpen={isDetailPanelOpen}
          onClose={handleCloseDetail}
          onDownload={handleDownload}
          onCopy={handleCopy}
        />
      )}

      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
            duration={2000}
          />
        )}
      </AnimatePresence>
    </div>
  );
} 
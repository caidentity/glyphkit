import { useMemo } from 'react';
import { IconMetadata } from '@/types/icon';

interface UseIconFilteringProps {
  allIcons: IconMetadata[];
  searchQuery?: string;
  selectedSize?: number | null;
  selectedCategories?: string[];
  selectedTags?: string[];
}

export const useIconFiltering = ({ 
  allIcons, 
  searchQuery = '',
  selectedSize = null,
  selectedCategories = [],
  selectedTags = []
}: UseIconFilteringProps) => {
  const filteredIcons = useMemo(() => {
    // Start with valid icons only
    let filtered = allIcons.filter(icon => {
      // Ensure icon has required properties and valid category
      if (!icon || !icon.name || !icon.category || icon.category === 'undefined') {
        return false;
      }
      
      // Validate size (only 16px or 24px)
      if (icon.size !== 16 && icon.size !== 24) {
        return false;
      }

      // Filter out link_16 and link_24 if they're not explicitly searched for
      if ((icon.name === 'link_16' || icon.name === 'link_24') && 
          !searchQuery.toLowerCase().includes('link')) {
        return false;
      }

      return true;
    });

    // Apply filters in order of specificity
    if (selectedSize !== null) {
      filtered = filtered.filter(icon => icon.size === selectedSize);
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(icon => {
        // Ensure the category is valid and matches selection
        return icon.category && 
               icon.category !== 'undefined' && 
               selectedCategories.includes(icon.category);
      });
    }
    else if (selectedTags.length > 0) {
      filtered = filtered.filter(icon => {
        // Ensure tags exist and match selection
        return icon.tags && 
               icon.tags.length > 0 && 
               icon.tags.some(tag => selectedTags.includes(tag));
      });
    }

    // Apply search filter last
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(icon => {
        // Skip link icons unless explicitly searched for
        if ((icon.name === 'link_16' || icon.name === 'link_24') && 
            !query.includes('link')) {
          return false;
        }

        // Check name match first (most specific)
        if (icon.name.toLowerCase().includes(query)) {
          return true;
        }
        // Then category match
        if (icon.category.toLowerCase().includes(query)) {
          return true;
        }
        // Finally tag match
        return icon.tags?.some(tag => 
          tag.toLowerCase().includes(query)
        ) || false;
      });
    }

    // Sort with consistent ordering
    return filtered.sort((a, b) => {
      // First by category
      const categoryCompare = a.category.localeCompare(b.category);
      if (categoryCompare !== 0) return categoryCompare;
      
      // Then by size (larger first)
      if (a.size !== b.size) return b.size - a.size;
      
      // Finally by name
      return a.name.localeCompare(b.name);
    });
  }, [allIcons, searchQuery, selectedSize, selectedCategories, selectedTags]);

  const hasActiveFilters = Boolean(
    searchQuery.trim() || 
    selectedSize !== null || 
    selectedCategories.length > 0 ||
    selectedTags.length > 0
  );

  return { 
    filteredIcons, 
    hasActiveFilters,
    totalIcons: allIcons.length,
    filteredCount: filteredIcons.length
  };
}; 
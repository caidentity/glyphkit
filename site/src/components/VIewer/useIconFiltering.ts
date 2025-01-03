import { useMemo } from 'react';
import { IconMetadata } from '@/types/icon';

interface UseIconFilteringProps {
  allIcons: IconMetadata[];
  searchQuery: string;
  selectedSize: number | null;
  selectedCategories: string[];
  selectedTags: string[];
}

export const useIconFiltering = ({
  allIcons,
  searchQuery,
  selectedSize,
  selectedCategories,
  selectedTags,
}: UseIconFilteringProps) => {
  const filteredIcons = useMemo(() => {
    try {
      // Guard against null/undefined allIcons
      if (!Array.isArray(allIcons)) {
        console.warn('Invalid icons array:', allIcons);
        return [];
      }

      let filtered = [...allIcons];
      console.log('Initial icons count:', filtered.length);

      // Apply size filter
      if (selectedSize) {
        filtered = filtered.filter(icon => icon.size === selectedSize);
        console.log('After size filter:', filtered.length);
      }

      // Apply category filter - allow multiple categories
      if (selectedCategories.length > 0) {
        filtered = filtered.filter(icon => {
          const result = selectedCategories.includes(icon.category);
          return result;
        });
        console.log('After category filter:', filtered.length, 'Selected categories:', selectedCategories);
      }

      // Apply tag filter - allow multiple tags
      if (selectedTags.length > 0) {
        filtered = filtered.filter(icon => {
          if (!icon.tags) return false;
          return selectedTags.some(tag => icon.tags?.includes(tag));
        });
        console.log('After tag filter:', filtered.length);
      }

      // Apply search filter
      if (searchQuery.trim()) {
        const normalizedQuery = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(icon => {
          try {
            return (
              icon.name.toLowerCase().includes(normalizedQuery) ||
              icon.category.toLowerCase().includes(normalizedQuery) ||
              icon.tags?.some(tag => tag.toLowerCase().includes(normalizedQuery))
            );
          } catch (error) {
            console.error('Error in search filter for icon:', icon, error);
            return false;
          }
        });
        console.log('After search filter:', filtered.length);
      }

      return filtered;
    } catch (error) {
      console.error('Error during filtering:', error);
      return [];
    }
  }, [allIcons, searchQuery, selectedSize, selectedCategories, selectedTags]);

  return {
    filteredIcons,
    hasActiveFilters: Boolean(
      searchQuery || 
      selectedSize || 
      selectedCategories.length || 
      selectedTags.length
    ),
    totalResults: filteredIcons.length
  };
}; 
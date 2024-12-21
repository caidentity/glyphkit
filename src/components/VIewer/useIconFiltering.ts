import { useMemo } from 'react';
import { IconMetadata, hasTag } from '@/types/icon';

interface UseIconFilteringProps {
  allIcons: IconMetadata[];
  searchQuery: string;
  selectedSize: number;
  selectedCategories: string[];
  selectedTags: string[];
}

interface UseIconFilteringResult {
  filteredIcons: IconMetadata[];
  hasActiveFilters: boolean;
}

export const useIconFiltering = ({
  allIcons,
  searchQuery,
  selectedSize,
  selectedCategories,
  selectedTags,
}: UseIconFilteringProps): UseIconFilteringResult => {
  const filteredIcons = useMemo(() => {
    return allIcons.filter(icon => {
      const matchesSearch = icon.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSize = icon.name.includes(selectedSize === 16 ? '16px' : '24px');
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(icon.category);
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => hasTag(icon, tag));
      
      return matchesSearch && matchesSize && matchesCategory && matchesTags;
    });
  }, [allIcons, searchQuery, selectedSize, selectedCategories, selectedTags]);

  const hasActiveFilters = Boolean(searchQuery || selectedCategories.length > 0 || selectedTags.length > 0);

  return {
    filteredIcons,
    hasActiveFilters
  };
}; 
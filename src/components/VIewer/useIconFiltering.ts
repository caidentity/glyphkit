import { useMemo } from 'react';
import { IconMetadata, hasTag } from '@/types/icon';

interface UseIconFilteringProps {
  allIcons: IconMetadata[];
  searchQuery: string;
  selectedSize: number;
  selectedCategories: string[];
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
}: UseIconFilteringProps): UseIconFilteringResult => {
  const filteredIcons = useMemo(() => {
    return allIcons.filter(icon => {
      if (selectedSize && icon.size !== selectedSize) {
        return false;
      }

      if (selectedCategories.length > 0 && !selectedCategories.includes(icon.category)) {
        return false;
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          icon.name.toLowerCase().includes(query) ||
          icon.category.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [allIcons, searchQuery, selectedSize, selectedCategories]);

  const hasActiveFilters = Boolean(
    searchQuery || 
    selectedSize || 
    selectedCategories.length > 0
  );

  return { filteredIcons, hasActiveFilters };
}; 
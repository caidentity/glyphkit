import { useMemo } from 'react';
import { IconMetadata } from '@/types/icon';

interface UseIconFilteringProps {
  allIcons: IconMetadata[];
  searchQuery: string;
  selectedSize: number | null;
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
    const filtered = allIcons.filter(icon => {
      // Filter by size
      if (selectedSize !== null && icon.size !== selectedSize) {
        return false;
      }

      // Filter by categories
      if (selectedCategories.length > 0 && !selectedCategories.includes(icon.category)) {
        return false;
      }

      // Filter by tags
      if (selectedTags.length > 0) {
        if (!icon.tags?.some(tag => selectedTags.includes(tag))) {
          return false;
        }
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          icon.name.toLowerCase().includes(query) ||
          icon.category.toLowerCase().includes(query) ||
          icon.tags?.some(tag => tag.toLowerCase().includes(query)) ||
          false
        );
      }

      return true;
    });

    // Sort icons alphabetically by name
    return filtered.sort((a, b) => {
      // First sort by size if they're different
      if (a.size !== b.size) {
        return a.size - b.size;
      }
      // Then sort alphabetically
      return a.name.localeCompare(b.name);
    });
  }, [allIcons, searchQuery, selectedSize, selectedCategories, selectedTags]);

  const hasActiveFilters = Boolean(
    searchQuery || 
    selectedSize !== null || 
    selectedCategories.length > 0 ||
    selectedTags.length > 0
  );

  return { filteredIcons, hasActiveFilters };
}; 
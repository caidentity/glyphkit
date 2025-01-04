'use client';

import { useMemo } from 'react';
import { SearchSuggestion } from '@/components/Search/SearchInput';
import { IconMetadata } from '@/types/icon';

interface Category {
  name: string;
  icons: IconMetadata[];
}

export const useSearchSuggestions = (
  searchQuery: string,
  categories: Category[] = [], // Default to empty array
  allIcons: IconMetadata[] = [] // Default to empty array
) => {
  return useMemo(() => {
    if (!searchQuery.trim()) return [];

    const suggestions: SearchSuggestion[] = [];
    const query = searchQuery.toLowerCase().trim();
    
    // Add category suggestions
    categories.forEach(category => {
      if (category.name.toLowerCase().includes(query)) {
        suggestions.push({
          type: 'category',
          value: category.name,
          count: category.icons.length
        });
      }
    });

    // Add tag suggestions
    const allTags = Array.from(new Set(allIcons.flatMap(icon => icon.tags || [])));
    allTags.forEach(tag => {
      if (tag.toLowerCase().includes(query)) {
        suggestions.push({
          type: 'tag',
          value: tag,
          count: allIcons.filter(icon => icon.tags?.includes(tag)).length
        });
      }
    });

    // Add icon suggestions
    allIcons.forEach(icon => {
      if (icon.name.toLowerCase().includes(query)) {
        suggestions.push({
          type: 'icon',
          value: icon.name
        });
      }
    });

    return suggestions.slice(0, 10);
  }, [searchQuery, categories, allIcons]);
}; 
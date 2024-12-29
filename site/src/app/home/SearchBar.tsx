'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import SearchInput, { SearchSuggestion } from '@/components/Search/SearchInput';
import { loadIconMetadata } from '@/lib/iconLoader';
import './styling/Search.scss';

interface SearchBarProps {
  isVisible: boolean;
  onTransitionStart?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ isVisible, onTransitionStart }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

  const { data: categories = [] } = useQuery({
    queryKey: ['iconMetadata'],
    queryFn: loadIconMetadata,
    staleTime: Infinity,
  });

  const allIcons = categories.flatMap(category => category.icons);
  const allTags = Array.from(new Set(allIcons.flatMap(icon => icon.tags || [])));

  const generateSearchSuggestions = (): SearchSuggestion[] => {
    if (!searchQuery) return [];
    
    const suggestions: SearchSuggestion[] = [];
    const query = searchQuery.toLowerCase();

    // Similar suggestion generation logic as IconViewer
    categories.forEach(category => {
      if (category.name.toLowerCase().includes(query)) {
        suggestions.push({
          type: 'category',
          value: category.name,
          count: category.icons.length
        });
      }
    });

    allTags.forEach(tag => {
      if (tag.toLowerCase().includes(query)) {
        suggestions.push({
          type: 'tag',
          value: tag,
          count: allIcons.filter(icon => icon.tags?.includes(tag)).length
        });
      }
    });

    allIcons.forEach(icon => {
      if (icon.name.toLowerCase().includes(query)) {
        suggestions.push({
          type: 'icon',
          value: icon.name
        });
      }
    });

    return suggestions.slice(0, 10);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsTransitioning(true);
    onTransitionStart?.();
    
    sessionStorage.setItem('fromHomeSearch', 'true');
    
    setTimeout(() => {
      router.push(`/icons?search=${encodeURIComponent(query.trim())}`);
    }, 500);
  };

  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    handleSearch(suggestion.value);
  };

  return (
    <div className={`search-container ${isVisible ? 'visible' : ''} ${isTransitioning ? 'transitioning' : ''}`}>
      <div className="search-wrapper">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          onSuggestionSelect={handleSuggestionSelect}
          suggestions={generateSearchSuggestions()}
          placeholder="Search 1000+ icons..."
          className="search-input"
        />
      </div>
    </div>
  );
};

export default SearchBar; 
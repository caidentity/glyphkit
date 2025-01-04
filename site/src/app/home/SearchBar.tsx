'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import SearchInput, { SearchSuggestion } from '@/components/Search/SearchInput';
import { useSearch } from '@/contexts/SearchContext';
import { useSearchSuggestions } from '@/hooks/useSearchSuggestions';
import { loadIconMetadata } from '@/lib/iconLoader';
import './styling/Search.scss';

interface SearchBarProps {
  isVisible: boolean;
  onTransitionStart?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ isVisible, onTransitionStart }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();
  const { query, setQuery, selectedSuggestion, setSelectedSuggestion } = useSearch();
  const { data: categories = [] } = useQuery({
    queryKey: ['iconMetadata'],
    queryFn: loadIconMetadata,
    staleTime: Infinity,
  });
  const allIcons = categories.flatMap(category => category.icons);
  const suggestions = useSearchSuggestions(query, categories, allIcons);

  const handleSearch = (searchQuery: string) => {
    setIsTransitioning(true);
    onTransitionStart?.();
    
    // Store search state
    sessionStorage.setItem('lastSearch', searchQuery);
    if (selectedSuggestion) {
      sessionStorage.setItem('searchType', selectedSuggestion.type);
      sessionStorage.setItem('searchValue', selectedSuggestion.value);
    }
    
    setTimeout(() => {
      router.push(`/icons?search=${encodeURIComponent(searchQuery.trim())}`);
    }, 500);
  };

  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    setSelectedSuggestion(suggestion);
    setQuery(suggestion.value);
    handleSearch(suggestion.value);
  };

  return (
    <div className={`search-container ${isVisible ? 'visible' : ''} ${isTransitioning ? 'transitioning' : ''}`}>
      <div className="search-wrapper">
        <SearchInput
          value={query}
          onChange={setQuery}
          onSearch={handleSearch}
          onSuggestionSelect={handleSuggestionSelect}
          suggestions={suggestions}
          placeholder="Search 1000+ icons..."
          className="search-input"
          size='large'
        />
      </div>
    </div>
  );
};

export default SearchBar; 
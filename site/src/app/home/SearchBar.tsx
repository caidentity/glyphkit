'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import SearchInput, { SearchSuggestion } from '@/components/Search/SearchInput';
import { useSearch } from '@/contexts/SearchContext';
import { useSearchSuggestions } from '@/hooks/useSearchSuggestions';
import './styling/Search.scss';
import { useQuery } from '@tanstack/react-query';
import { loadIconMetadata } from '@/lib/iconLoader';

interface SearchBarProps {
  isVisible: boolean;
  onTransitionStart?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ isVisible, onTransitionStart }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();
  const { query, setQuery, selectedSuggestion, setSelectedSuggestion } = useSearch();
  
  // Load initial data for suggestions
  const { data: categories = [] } = useQuery({
    queryKey: ['iconMetadata'],
    queryFn: loadIconMetadata,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const allIcons = useMemo(() => {
    return categories.flatMap(category => category.icons);
  }, [categories]);

  // Get suggestions using the same hook as IconViewer
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

  const quickSuggestions = ['files', 'objects', 'text', 'controls',];

  const handleQuickSuggestion = (term: string) => {
    setQuery(term);
    handleSearch(term);
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
          size="large"
          autoFocus
        />
        <div className="quick-suggestions">
          <span className="suggestions-label">Suggestions:</span>
          {quickSuggestions.map((term) => (
            <button
              key={term}
              className="quick-suggestion"
              onClick={() => handleQuickSuggestion(term)}
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBar; 
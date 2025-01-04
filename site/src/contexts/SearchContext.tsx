'use client';

import React, { createContext, useContext, useState } from 'react';
import { SearchSuggestion } from '@/components/Search/SearchInput';

interface SearchState {
  query: string;
  setQuery: (query: string) => void;
  selectedSuggestion: SearchSuggestion | null;
  setSelectedSuggestion: (suggestion: SearchSuggestion | null) => void;
}

const SearchContext = createContext<SearchState | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState('');
  const [selectedSuggestion, setSelectedSuggestion] = useState<SearchSuggestion | null>(null);

  return (
    <SearchContext.Provider value={{
      query,
      setQuery,
      selectedSuggestion,
      setSelectedSuggestion,
    }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
} 
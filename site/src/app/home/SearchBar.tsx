'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

interface SearchBarProps {
  isVisible: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ isVisible }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/icons?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <div className={`search-container ${isVisible ? 'visible' : ''}`}>
      <form onSubmit={handleSearch} className="search-wrapper">
        <input
          type="text"
          placeholder="Search icons..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button 
          type="submit" 
          className="search-button" 
          aria-label="Search"
        >
          <Search size={24} />
        </button>
      </form>
    </div>
  );
};

export default SearchBar; 
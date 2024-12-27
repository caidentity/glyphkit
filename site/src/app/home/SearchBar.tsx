'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/Input/Input';
import './styling/Search.scss';

interface SearchBarProps {
  isVisible: boolean;
  onTransitionStart?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ isVisible, onTransitionStart }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

  const handleSearchInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    setIsTransitioning(true);
    onTransitionStart?.();
    
    sessionStorage.setItem('fromHomeSearch', 'true');
    
    await new Promise(resolve => setTimeout(resolve, 500));
    router.push(`/icons?search=${encodeURIComponent(value.trim())}`);
  };

  return (
    <div className={`search-container ${isVisible ? 'visible' : ''} ${isTransitioning ? 'transitioning' : ''}`}>
      <div className="search-wrapper">
        <Input
          variant="search"
          placeholder="Search icons..."
          value={searchQuery}
          onChange={handleSearchInput}
          className="search-input"
          autoFocus
        />
      </div>
    </div>
  );
};

export default SearchBar; 
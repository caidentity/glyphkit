'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { createPortal } from 'react-dom';
import Input from "../Input/Input";
import './SearchInput.scss';

export interface SearchSuggestion {
  type: 'icon' | 'category' | 'tag';
  value: string;
  count?: number;
}

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  suggestions: SearchSuggestion[];
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onSuggestionSelect,
  suggestions,
  placeholder = "Search...",
  autoFocus,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    onSuggestionSelect?.(suggestion);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          handleSuggestionClick(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('.search-suggestions-portal')
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getSuggestionLabel = (suggestion: SearchSuggestion) => {
    switch (suggestion.type) {
      case 'icon':
        return `Icon: ${suggestion.value}`;
      case 'category':
        return `Category: ${suggestion.value}`;
      case 'tag':
        return `Tag: ${suggestion.value}`;
      default:
        return suggestion.value;
    }
  };

  const renderSuggestions = () => {
    if (!isOpen) return null;

    const content = (
      <div 
        className="search-suggestions-portal" 
        style={{
          position: 'absolute',
          top: dropdownPosition.top,
          left: dropdownPosition.left,
          width: dropdownPosition.width,
        }}
      >
        <div className="search-suggestions">
          {suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <div
                key={`${suggestion.type}-${suggestion.value}`}
                className={`search-suggestion ${index === highlightedIndex ? 'highlighted' : ''}`}
                onClick={() => handleSuggestionClick(suggestion)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <span className="suggestion-type">{suggestion.type}</span>
                <span className="suggestion-value">{suggestion.value}</span>
                {suggestion.count !== undefined && (
                  <span className="suggestion-count">{suggestion.count}</span>
                )}
              </div>
            ))
          ) : (
            <div className="search-suggestion search-suggestion--empty">
              No matches found
            </div>
          )}
        </div>
      </div>
    );

    return createPortal(content, document.body);
  };

  return (
    <div className="search-input-container" ref={inputRef}>
      <Input
        variant="search"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={className}
      />
      {renderSuggestions()}
    </div>
  );
};

export default SearchInput; 
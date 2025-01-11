import React, { useCallback, useEffect } from 'react';
import { Check, Grid, List } from 'lucide-react';
import Button from "../Button/Button";
import Slider from "../Slider/Slider";
import { IconCategory, IconTag } from '@/types/icon';
import './styling/FilterPanel.scss';
import ButtonGroup from "../Button/ButtonGroup";
import { Icon as GlyphKitIcon } from '@glyphkit/glyphkit';
import ColorPicker from "../ColorPicker/ColorPicker";

interface FilterPanelProps {
  selectedSize: number | null;
  setSelectedSize: React.Dispatch<React.SetStateAction<number | null>>;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  iconScale: number;
  setIconScale: (scale: number) => void;
  selectedCategories: string[];
  setSelectedCategories: (category: string) => void;
  selectedTags: string[];
  setSelectedTags: (tag: string) => void;
  categories: IconCategory[];
  tags: IconTag[];
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  gridPadding: number;
  setGridPadding: (padding: number) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  selectedSize,
  setSelectedSize,
  viewMode,
  setViewMode,
  iconScale,
  setIconScale,
  selectedCategories,
  setSelectedCategories,
  selectedTags,
  setSelectedTags,
  categories,
  tags = [],
  hasActiveFilters,
  onResetFilters,
  gridPadding,
  setGridPadding,
  selectedColor,
  setSelectedColor,
}) => {
  const handleCategoryClick = useCallback((categoryName: string) => {
    setSelectedCategories(categoryName);
  }, [setSelectedCategories]);

  const handleTagClick = useCallback((tagName: string) => {
    setSelectedTags(tagName);
  }, [setSelectedTags]);

  // Handle initial search state
  useEffect(() => {
    const searchType = sessionStorage.getItem('searchType');
    const searchValue = sessionStorage.getItem('searchValue');
    
    if (searchType && searchValue) {
      if (searchType === 'category') {
        setSelectedCategories(searchValue);
      } else if (searchType === 'tag') {
        setSelectedTags(searchValue);
      }
      // Clear search params after applying
      sessionStorage.removeItem('searchType');
      sessionStorage.removeItem('searchValue');
    }
  }, [setSelectedCategories, setSelectedTags]);

  useEffect(() => {
    if (!selectedSize) {
      setSelectedSize(24);
    }
  }, []); // Only run once on mount

  return (
    <div className="filter">
      <div className="filter-container">
        <div className="filter-content">
          <div className="filter-sections">
            <section className="filter-section">
              <div className="filter-section-header">
                <h3 className="filter-section-title">Size</h3>
                <ButtonGroup>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedSize(prev => prev === 24 ? null : 24)}
                    data-state={selectedSize === 24 ? 'active' : undefined}
                  >
                    24px
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedSize(prev => prev === 16 ? null : 16)}
                    data-state={selectedSize === 16 ? 'active' : undefined}
                  >
                    16px
                  </Button>
                </ButtonGroup>
              </div>
            </section>

            <section className="filter-section">
              <div className="filter-section-header">
                <h3 className="filter-section-title">View Mode</h3>
                <ButtonGroup>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    data-state={viewMode === 'grid' ? 'active' : undefined}
                  >
                    <GlyphKitIcon name="view_layout_grid_16" size={14} />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setViewMode('list')}
                    data-state={viewMode === 'list' ? 'active' : undefined}
                  >
                    <GlyphKitIcon name="lines_two_16" size={14} />
                  </Button>
                </ButtonGroup>
              </div>
            </section>

            <section className="filter-section">
              <div className="filter-section-header">
                <h3 className="filter-section-title">Icon Size</h3>
                <div className="filter-section-scale">
                  <Slider
                    label="Scale"
                    value={[iconScale]}
                    min={0.5}
                    max={2}
                    step={0.1}
                    formatValue={(value) => `${value}x`}
                    onValueChange={([value]) => setIconScale(value)}
                    showTooltip
                  />
                </div>
              </div>
            </section>

            {/* <section className="filter-section">
              <div className="filter-section-header">
                <h3 className="filter-section-title">Icons per Row</h3>
                <div className="filter-section-scale">
                  <Slider
                    label="Count"
                    value={[gridPadding]}
                    min={2}
                    max={8}
                    step={1}
                    formatValue={(value) => `${value}`}
                    onValueChange={([value]) => setGridPadding(value)}
                  />
                </div>
              </div>
            </section> */}

            <section className="filter-section">
              <div className="filter-section-header">
                <h3 className="filter-section-title">Color</h3>
                <ColorPicker
                  initialColor={selectedColor}
                  onChange={setSelectedColor}
                />
              </div>
            </section>

            <section className="filter-categories">
              <h3 className="filter-section-title">Categories</h3>
              <div className="filter-categories-list">
                {categories.map(category => (
                  <div 
                    key={category.name}
                    className="filter-categories-item"
                    onClick={() => handleCategoryClick(category.name)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className={`
                      filter-categories-checkbox
                      ${selectedCategories.includes(category.name) 
                        ? 'filter-categories-checkbox--checked'
                        : 'filter-categories-checkbox--unchecked'
                      }
                    `}>
                      {selectedCategories.includes(category.name) && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <span className="text-sm">
                      {category.name}
                      <span className="text-gray-400 ml-1">
                        ({category.icons.length})
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="filter-categories">
              <h3 className="filter-section-title">Tags</h3>
              <div className="filter-categories-list">
                {tags?.length > 0 ? (
                  tags.map(tag => (
                    <div 
                      key={tag.name}
                      className="filter-categories-item"
                      onClick={() => handleTagClick(tag.name)}
                      role="button"
                      tabIndex={0}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleTagClick(tag.name);
                        }
                      }}
                    >
                      <div className={`
                        filter-categories-checkbox
                        ${selectedTags.includes(tag.name) 
                          ? 'filter-categories-checkbox--checked'
                          : 'filter-categories-checkbox--unchecked'
                        }
                      `}>
                        {selectedTags.includes(tag.name) && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <span className="text-sm">
                        {tag.name}
                        <span className="text-gray-400 ml-1">
                          ({tag.count})
                        </span>
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-400 p-2">No tags available</div>
                )}
              </div>
            </section>

            <div className="filter-reset">
              <Button
                variant="tertiary"
                size="sm"
                onClick={onResetFilters}
              >
                Reset all filters
              </Button>
            </div>
          </div>
          
          <section className="filter-footer">
            <ul className="filter-footer-list">
              {[
                { label: 'Home', href: '/' },
                { label: 'Docs', href: '/docs' },
                { label: 'Releases', href: '/releases' },
                { label: 'About', href: '/about' },
                { label: 'Terms', href: '/terms' },
                { label: 'License', href: '/license' },
              ].map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="filter-footer-link">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="filter-footer-copyright">
              © {new Date().getFullYear()} Interact LLC
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel; 
import React from 'react';
import { Check, Grid, List, SlidersHorizontal } from 'lucide-react';
import Button from "../Button/Button";
import Badge from "../Badge/Badge";
import Slider from "../Slider/Slider";
import { IconCategory, IconTag } from '@/types/icon';
import './styling/FilterPanel.scss';
import ButtonGroup from "../Button/ButtonGroup";

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
}) => {
  const handleCategoryClick = (categoryName: string) => {
    try {
      setSelectedCategories(categoryName);
    } catch (error) {
      console.error('Error toggling category:', error);
      // Optionally show an error message to the user
    }
  };

  const handleTagClick = (tagName: string) => {
    try {
      setSelectedTags(tagName);
    } catch (error) {
      console.error('Error toggling tag:', error);
      // Optionally show an error message to the user
    }
  };

  return (
    <div className="filter">
      <div className="filter-container">
        {hasActiveFilters && (
          <div className="filter-reset">
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
            >
              Reset all filters
            </Button>
          </div>
        )}

        <div className="filter-content">
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
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setViewMode('list')}
                  data-state={viewMode === 'list' ? 'active' : undefined}
                >
                  <List className="h-4 w-4" />
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
                />
              </div>
            </div>
          </section>

          <section className="filter-section">
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
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleCategoryClick(category.name);
                    }
                  }}
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

          <section className="filter-tags">
            <h3 className="filter-section-title">Tags</h3>
            <div className="filter-tags-list">
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
        </div>
      </div>
    </div>
  );
};

export default FilterPanel; 
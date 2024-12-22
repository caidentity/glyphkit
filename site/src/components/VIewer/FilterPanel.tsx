import React from 'react';
import { Check, Grid, List, SlidersHorizontal } from 'lucide-react';
import Button from "../Button/Button";
import Badge from "../Badge/Badge";
import Slider from "../Slider/Slider";
import { IconCategory } from '@/types/icon';
import './styling/FilterPanel.scss';

interface FilterPanelProps {
  selectedSize: number | null;
  setSelectedSize: React.Dispatch<React.SetStateAction<number | null>>;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  iconScale: number;
  setIconScale: (scale: number) => void;
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  categories: IconCategory[];
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
  categories,
  hasActiveFilters,
  onResetFilters,
  gridPadding,
  setGridPadding,
}) => {
  const handleCategoryToggle = (categoryName: string) => {
    setSelectedCategories((prev: string[]) => 
      prev.includes(categoryName)
        ? prev.filter((c: string) => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  return (
    <div className="filter">
      <div className="filter-container">
        {hasActiveFilters && (
          <div className="filter-reset">
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              className="text-xs text-blue-500 hover:text-blue-600"
            >
              Reset all filters
            </Button>
          </div>
        )}

        <div className="filter-content">
          <section className="filter-section">
            <div className="filter-section-header">
              <h3 className="filter-section-title">Size</h3>
              <div className="filter-section-actions">
                <Button
                  variant={selectedSize === 24 ? "default" : "outline"}
                  onClick={() => setSelectedSize(prev => prev === 24 ? null : 24)}
                  size="sm"
                >
                  24px
                </Button>
                <Button
                  variant={selectedSize === 16 ? "default" : "outline"}
                  onClick={() => setSelectedSize(prev => prev === 16 ? null : 16)}
                  size="sm"
                >
                  16px
                </Button>
              </div>
            </div>
          </section>

          <section className="filter-section">
            <div className="filter-section-header">
              <h3 className="filter-section-title">View Mode</h3>
              <div className="filter-section-actions">
                <Button
                  variant={viewMode === 'grid' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </section>

          <section className="filter-section">
            <div className="filter-section-header">
              <h3 className="filter-section-title">Icon Size</h3>
              <div className="filter-section-scale">
                <Slider
                  value={[iconScale]}
                  min={0.5}
                  max={2}
                  step={0.1}
                  onValueChange={([value]) => setIconScale(value)}
                  className="w-[140px]"
                />
              </div>
            </div>
          </section>

          <section className="filter-section">
            <div className="filter-section-header">
              <h3 className="filter-section-title">Icons per Row</h3>
              <div className="filter-section-scale">
                <Slider
                  value={[gridPadding]}
                  min={2}
                  max={8}
                  step={1}
                  onValueChange={([value]) => setGridPadding(value)}
                  className="w-[140px]"
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
                  onClick={() => handleCategoryToggle(category.name)}
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
        </div>
      </div>
    </div>
  );
};

export default FilterPanel; 
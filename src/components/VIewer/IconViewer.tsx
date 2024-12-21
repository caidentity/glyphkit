'use client';

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Download, X, Link, Check, Code, ArrowDownToLine, FileText } from 'lucide-react';
import  Input  from "../Input/Input";
import  Button  from "../Button/Button";
import Badge  from "../Badge/Badge";
import { IconMetadata, hasTag, hasTags } from '@/types/icon';
import { loadIconMetadata, loadSvgContent } from '@/lib/iconLoader';
import IconGrid from './IconGrid';
import Icon from './Icon';
import AlertDescription from "../Alert/AlertDescription";
import Alert from "../Alert/Alert";
import { useVirtualizer } from '@tanstack/react-virtual';

const IconViewer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSize, setSelectedSize] = useState(24);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedIcon, setSelectedIcon] = useState<IconMetadata | null>(null);
  const [copyAlert, setCopyAlert] = useState<string | null>(null);

  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['icons-metadata'],
    queryFn: loadIconMetadata,
  });

  const allIcons = useMemo(() => {
    return categories.flatMap(category => category.icons);
  }, [categories]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    allIcons.forEach(icon => {
      icon.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [allIcons]);

  const filteredIcons = useMemo(() => {
    return allIcons.filter(icon => {
      const matchesSearch = icon.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSize = icon.name.includes(selectedSize === 16 ? '16px' : '24px');
      const matchesCategory = !selectedCategory || icon.category === selectedCategory;
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => hasTag(icon, tag));
      
      return matchesSearch && matchesSize && matchesCategory && matchesTags;
    });
  }, [allIcons, searchQuery, selectedSize, selectedCategory, selectedTags]);

  const handleDownload = async (icon: IconMetadata) => {
    try {
      const svgContent = await loadSvgContent(icon.path);
      if (svgContent) {
        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${icon.name}-${icon.size}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading icon:', error);
    }
  };

  const handleCopy = async (iconName: string) => {
    try {
      await navigator.clipboard.writeText(iconName);
      setCopyAlert(`Copied "${iconName}" to clipboard`);
      setTimeout(() => setCopyAlert(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      setCopyAlert('Failed to copy to clipboard');
      setTimeout(() => setCopyAlert(null), 2000);
    }
  };

  const renderTags = () => {
    if (!selectedIcon?.tags?.length) {
      return <p className="text-sm text-gray-400">No tags</p>;
    }
    return selectedIcon.tags.map(tag => (
      <Badge key={tag} variant="secondary">{tag}</Badge>
    ));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto relative">
      {copyAlert && (
        <div className="fixed top-4 right-4 z-50">
          <Alert variant="success">
            <Check className="h-4 w-4 mr-2" />
            <AlertDescription>{copyAlert}</AlertDescription>
          </Alert>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load icons. Please try again later.
          </AlertDescription>
        </Alert>
      ) : (
        <div 
          className={`
            transition-all duration-300 ease-in-out
            ${selectedIcon ? 'mr-96' : 'mr-0'}
          `}
        >
          <div className="mb-6 space-y-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search icons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            <div className="flex gap-2">
              <Button
                variant={selectedSize === 24 ? "default" : "outline"}
                onClick={() => setSelectedSize(24)}
                size="md"
              >
                24px
              </Button>
              <Button
                variant={selectedSize === 16 ? "default" : "outline"}
                onClick={() => setSelectedSize(16)}
                size="md"
              >
                16px
              </Button>
            </div>

            <select
              className="w-full p-2 border rounded"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>

            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedTags(prev => 
                    prev.includes(tag) 
                      ? prev.filter(t => t !== tag)
                      : [...prev, tag]
                  )}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {filteredIcons.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No icons found matching your criteria
            </div>
          ) : (
            <IconGrid 
              icons={filteredIcons} 
              onIconSelect={setSelectedIcon}
              onIconDownload={handleDownload}
              onIconCopy={(icon) => handleCopy(icon.name)}
            />
          )}
        </div>
      )}

      {selectedIcon && (
        <div 
          className={`
            fixed top-0 right-0 h-full w-96 bg-white border-l shadow-lg 
            transform transition-transform duration-300 ease-in-out overflow-y-auto
            ${selectedIcon ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          <div className="p-6">
            <div className="border-b pb-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold">Details</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedIcon(null)}
                  className="w-8 h-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-600">{selectedIcon.name}</p>
            </div>
            
            <div className="space-y-6">
              <div className="flex justify-center items-center h-48 border rounded-lg bg-gray-50">
                <Icon
                  icon={selectedIcon}
                  showSize={true}
                  className="p-4"
                />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">Usage</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500">React Component</p>
                    <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                      <code>{`<Icon name="${selectedIcon.name}" size={${selectedIcon.size}} />`}</code>
                    </pre>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500">Import Path</p>
                    <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                      <code>{selectedIcon.path}</code>
                    </pre>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Size</h3>
                  <p className="text-sm">{selectedIcon.size}px</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Category</h3>
                  <p className="text-sm">{selectedIcon.category}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Tags</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {renderTags()}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => handleCopy(`<Icon name="${selectedIcon.name}" size={${selectedIcon.size}} />`)}
                  variant="outline"
                  className="w-full justify-between"
                >
                  <span className="flex items-center">
                    <Code className="h-4 w-4 mr-2" />
                    Copy Component
                  </span>
                  <Link className="h-4 w-4" />
                </Button>
                
                <Button
                  onClick={() => handleDownload(selectedIcon)}
                  variant="outline"
                  className="w-full justify-between"
                >
                  <span className="flex items-center">
                    <Download className="h-4 w-4 mr-2" />
                    Download SVG
                  </span>
                  <ArrowDownToLine className="h-4 w-4" />
                </Button>
                
                <Button
                  onClick={() => handleCopy(selectedIcon.path)}
                  variant="outline"
                  className="w-full justify-between"
                >
                  <span className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Copy Path
                  </span>
                  <Link className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IconViewer; 
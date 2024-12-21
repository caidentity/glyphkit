'use client';

import React from 'react';
import { IconMetadata } from '@/types/icon';
import Icon from './Icon';
import { useVirtualizer, VirtualItem } from '@tanstack/react-virtual';
import { Eye, Download, Link } from 'lucide-react';
import Button from "../Button/Button";

interface IconGridProps {
  icons: IconMetadata[];
  onIconSelect?: (icon: IconMetadata) => void;
  onIconDownload?: (icon: IconMetadata) => void;
  onIconCopy?: (icon: IconMetadata) => void;
  viewMode: 'grid' | 'list';
  iconScale: number;
}

const IconGrid = ({ 
  icons, 
  onIconSelect,
  onIconDownload,
  onIconCopy,
  viewMode,
  iconScale
}: IconGridProps) => {
  const parentRef = React.useRef<HTMLDivElement>(null);
  
  // Dynamically calculate columns based on viewport
  const [columns, setColumns] = React.useState(4);
  
  React.useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < 640) setColumns(2);
      else if (width < 1024) setColumns(3);
      else setColumns(4);
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  const rowVirtualizer = useVirtualizer({
    count: Math.ceil(icons.length / columns),
    getScrollElement: () => parentRef.current,
    estimateSize: () => 160,
    overscan: 5,
  });

  return (
    <div 
      ref={parentRef}
      className="h-[calc(100vh-300px)] overflow-auto"
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const startIndex = virtualRow.index * (viewMode === 'list' ? 1 : columns);
          const rowIcons = icons.slice(
            startIndex, 
            startIndex + (viewMode === 'list' ? 1 : columns)
          );

          return (
            <div
              key={virtualRow.index}
              className={`
                absolute top-0 left-0 w-full p-4
                ${viewMode === 'grid' 
                  ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
                  : 'block'
                }
              `}
              style={{
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {rowIcons.map((icon) => (
                <div 
                  key={icon.path} 
                  className={`
                    group relative flex ${viewMode === 'list' ? 'flex-row' : 'flex-col'} 
                    items-center gap-4 p-4 border rounded-lg 
                    hover:border-blue-500 hover:shadow-sm transition-all duration-200
                  `}
                >
                  <div className="flex items-center justify-center">
                    <Icon
                      icon={icon}
                      customSize={icon.size * iconScale * (viewMode === 'list' ? 1 : 1.5)}
                      className="p-2"
                    />
                  </div>
                  <div className="w-full text-center space-y-1">
                    <p className="text-xs text-gray-600 truncate max-w-full px-2">
                      {icon.name}
                    </p>
                    <span className="text-xs text-gray-400">
                      {icon.size}px
                    </span>
                  </div>
                  
                  <div className="absolute inset-0 bg-white/90 opacity-0 
                              group-hover:opacity-100 transition-opacity duration-200 
                              flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onIconSelect?.(icon);
                      }}
                      className="w-10 h-10 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onIconDownload?.(icon);
                      }}
                      className="w-10 h-10 p-0"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onIconCopy?.(icon);
                      }}
                      className="w-10 h-10 p-0"
                    >
                      <Link className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IconGrid; 
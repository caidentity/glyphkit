import { IconMetadata, IconCategory, IconRegistryData, IconTag, PathAttributes } from '@/types/icon'
import { ICONS_CONFIG } from '@/constants/icons'

interface MetadataCache {
  data: IconCategory[] | null
  timestamp: number
}

let metadataCache: MetadataCache = {
  data: null,
  timestamp: 0
}

function isCacheValid(cache: MetadataCache): boolean {
  const now = Date.now()
  return Boolean(
    cache.data && 
    now - cache.timestamp < ICONS_CONFIG.CACHE_DURATION
  )
}

export async function loadIconMetadata(): Promise<IconCategory[]> {
  try {
    if (metadataCache.data && isCacheValid(metadataCache)) {
      return metadataCache.data;
    }

    const response = await fetch('/registry/iconRegistry.json');
    if (!response.ok) {
      throw new Error('Failed to load icon registry');
    }
    
    const data: IconRegistryData = await response.json();
    
    if (!data.categories) {
      throw new Error('Invalid registry format');
    }

    const categories = Object.entries(data.categories).map(([name, categoryData]) => ({
      name,
      count: categoryData.count,
      icons: categoryData.icons.map(iconName => {
        const iconData = data.icons[iconName];
        return {
          name: iconName,
          category: iconData.category,
          size: iconName.endsWith('24') ? 24 : 16,
          path: `/api/icons/${iconData.category}/${iconName}`,
          tags: iconData.tags
        };
      })
    }));

    metadataCache = {
      data: categories,
      timestamp: Date.now()
    };

    return categories;
  } catch (error) {
    console.error('Error loading icon metadata:', error);
    return [];
  }
}

export function calculateTagCounts(registry: IconRegistryData): IconTag[] {
  const tagCounts = new Map<string, number>();
  
  Object.values(registry.icons).forEach(icon => {
    if (icon.tags) {
      icon.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    }
  });
  
  return Array.from(tagCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getCategories(registry: IconRegistryData): IconCategory[] {
  return Object.entries(registry.categories).map(([name, data]) => ({
    name,
    count: data.count,
    icons: data.icons.map(iconName => {
      const iconData = registry.icons[iconName];
      return {
        name: iconName,
        category: iconData.category,
        size: iconName.endsWith('24') ? 24 : 16,
        path: `/api/icons/${iconData.category}/${iconName}`,
        tags: iconData.tags
      };
    })
  }));
}

export async function loadSvgContent(path: string): Promise<string | null> {
  try {
    const cleanPath = path.replace(/\/+/g, '/');
    const response = await fetch(cleanPath);
    if (!response.ok) return null;
    return await response.text();
  } catch (error) {
    console.error('Error loading SVG content:', error);
    return null;
  }
}

export function generateIconPath(icon: IconMetadata): string {
  return `/api/icons/${icon.category}/${icon.name}`;
}

export async function loadSvgBatch(paths: string[]): Promise<{ [key: string]: string }> {
  try {
    // Fix: Properly encode each path individually before creating URLSearchParams
    const encodedPaths = JSON.stringify(paths.map(path => path.replace(/\/+/g, '/')));
    
    const searchParams = new URLSearchParams({
      batch: 'true',
      paths: encodedPaths,
    });

    const response = await fetch(`/api/icons?${searchParams.toString()}`);
    if (!response.ok) throw new Error('Failed to load SVGs');
    return response.json();
  } catch (error) {
    console.error('Error loading SVG batch:', error);
    return {};
  }
} 
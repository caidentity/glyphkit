import { IconMetadata, IconCategory, IconsMetadata } from '@/types/icon'
import { ICONS_CONFIG, METADATA_DEFAULTS } from '@/constants/icons'
import path from 'path'

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
    console.log('Starting metadata load...');
    performance.mark('metadata-load-start');

    if (isCacheValid(metadataCache)) {
      console.log('Using cache...');
      performance.mark('metadata-load-end');
      performance.measure('metadata-load', 'metadata-load-start', 'metadata-load-end');
      return Array.from(metadataCache.data ?? []);
    }

    console.log('Fetching metadata...');
    const response = await fetch(`${ICONS_CONFIG.BASE_DIR}/${ICONS_CONFIG.METADATA_FILE}`, {
      cache: process.env.NODE_ENV === 'development' ? 'force-cache' : 'default',
    });

    console.log('Response status:', response.status);
    if (!response.ok) {
      console.warn('Failed to load metadata, using defaults');
      return [...METADATA_DEFAULTS.EMPTY_METADATA.categories];
    }
    
    console.log('Parsing JSON...');
    const data: IconsMetadata = await response.json();
    console.log('Metadata loaded:', data.categories.length, 'categories');
    
    metadataCache = {
      data: data.categories,
      timestamp: Date.now()
    };

    performance.mark('metadata-load-end');
    performance.measure('metadata-load', 'metadata-load-start', 'metadata-load-end');
    
    return Array.from(data.categories);
  } catch (error) {
    console.error('Error loading icon metadata:', error);
    return [...METADATA_DEFAULTS.EMPTY_METADATA.categories];
  }
}

export async function loadSvgContent(path: string): Promise<string | null> {
  try {
    const response = await fetch(`/api/icons${path.replace('/icons', '')}`)
    if (!response.ok) throw new Error('Failed to load SVG')
    return response.text()
  } catch (error) {
    console.error('Error loading SVG content:', error)
    return null
  }
}

export function generateIconPath(icon: IconMetadata): string {
  const sizeSuffix = icon.size === ICONS_CONFIG.SMALL_SIZE 
    ? ICONS_CONFIG.SMALL_SUFFIX 
    : ''
  return [
    ICONS_CONFIG.BASE_DIR,
    icon.category,
    `${icon.name}${sizeSuffix}.svg`,
  ].join('/')
}

export async function loadSvgBatch(paths: string[]): Promise<{ [key: string]: string }> {
  try {
    const searchParams = new URLSearchParams({
      batch: 'true',
      paths: JSON.stringify(paths),
    });

    const response = await fetch(`/api/icons?${searchParams.toString()}`);
    if (!response.ok) throw new Error('Failed to load SVGs');
    return response.json();
  } catch (error) {
    console.error('Error loading SVG batch:', error);
    return {};
  }
} 
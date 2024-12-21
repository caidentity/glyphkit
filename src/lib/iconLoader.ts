import { IconMetadata, IconCategory, IconsMetadata } from '@/types/icon'
import { ICONS_CONFIG, METADATA_DEFAULTS } from '@/constants/icons'

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
    if (isCacheValid(metadataCache)) {
      return [...metadataCache.data!];
    }

    const response = await fetch('/icons/metadata.json')
    if (!response.ok) {
      return [...METADATA_DEFAULTS.EMPTY_METADATA.categories];
    }
    
    const data: IconsMetadata = await response.json()
    if (!data?.categories?.length) {
      return [...METADATA_DEFAULTS.EMPTY_METADATA.categories];
    }
    
    metadataCache = {
      data: [...data.categories],
      timestamp: Date.now()
    }
    
    return [...data.categories];
  } catch (error) {
    console.error('Error loading icon metadata:', error)
    return [...METADATA_DEFAULTS.EMPTY_METADATA.categories];
  }
}

export async function loadSvgContent(path: string): Promise<string | null> {
  try {
    const response = await fetch(path)
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
  return `/icons/${icon.category}/${icon.name}${sizeSuffix}${ICONS_CONFIG.FILE_EXTENSION}`
} 
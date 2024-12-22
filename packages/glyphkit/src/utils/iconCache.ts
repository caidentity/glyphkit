import type { IconDefinition } from '../types/icon.types';

interface CacheEntry {
  content: IconDefinition;
  timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const iconCache = new Map<string, CacheEntry>();

export function cacheIcon(name: string, content: IconDefinition): void {
  iconCache.set(name, {
    content,
    timestamp: Date.now()
  });
}

export function getCachedIcon(name: string): IconDefinition | null {
  const cached = iconCache.get(name);
  if (cached) {
    if (Date.now() - cached.timestamp > CACHE_DURATION) {
      iconCache.delete(name);
      return null;
    }
    return cached.content;
  }
  return null;
} 
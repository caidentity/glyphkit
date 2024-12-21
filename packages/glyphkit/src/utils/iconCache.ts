import { IconCache } from '../types/icon.types';

const CACHE_DURATION = 1000 * 60 * 60; // 1 hour cache duration

class IconCacheManager {
  private cache: Map<string, IconCache> = new Map();

  set(key: string, content: string): void {
    this.cache.set(key, {
      content,
      timestamp: Date.now()
    });
  }

  get(key: string): string | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }

    return cached.content;
  }

  clear(): void {
    this.cache.clear();
  }
}

export const iconCache = new IconCacheManager(); 
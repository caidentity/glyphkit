import { IconRegistry } from '../types/icon.types';

const iconRegistry: IconRegistry = {};
const iconCache = new Map<string, { path: string; viewBox?: string }>();

export function registerIcon(name: string, definition: { path: string; viewBox?: string }) {
  iconRegistry[name] = definition;
}

export function getIcon(name: string) {
  // Check registry first
  if (iconRegistry[name]) {
    return iconRegistry[name];
  }
  
  // Then check cache
  if (iconCache.has(name)) {
    return iconCache.get(name);
  }
  
  return null;
}

export function cacheIcon(name: string, definition: { path: string; viewBox?: string }) {
  iconCache.set(name, definition);
} 
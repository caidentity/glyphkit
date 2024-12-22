export interface IconDefinition {
  d: string;
  viewBox: string;
}

export interface IconCache {
  [key: string]: CacheEntry;
}

export type IconName = keyof typeof import('../icons/registry').icons;

interface CacheEntry {
  content: IconDefinition;
  timestamp: number;
}

export interface IconDefinition {
  path: string;
  viewBox?: string;
  preserveColors?: boolean;
}

export type IconName = string;

export interface IconRegistry {
  [key: string]: IconDefinition;
}

export interface IconMetadata {
  name: string;
  path: string;
  categories?: string[];
  tags?: string[];
}

export interface IconCache {
  content: string;
  timestamp: number;
} 
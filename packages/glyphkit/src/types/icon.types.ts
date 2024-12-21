export interface IconDefinition {
  path: string;
  viewBox?: string;
}

export type IconName = string;

export interface IconRegistry {
  [key: IconName]: IconDefinition;
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
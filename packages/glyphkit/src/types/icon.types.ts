import { ReactElement, SVGProps } from 'react';

export interface IconDefinition {
  path: string;
  viewBox?: string;
}

export interface IconRegistry {
  [key: string]: IconDefinition;
}

export type IconElement = ReactElement<SVGProps<SVGPathElement>>;

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
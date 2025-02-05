export interface PathAttributes {
  d: string;
  fillRule?: 'nonzero' | 'evenodd' | 'inherit';
  clipRule?: 'nonzero' | 'evenodd' | 'inherit';
  fill?: string;
}

export interface IconDefinition {
  viewBox: string;
  paths: PathAttributes[];
  category?: string;
  tags?: string[];
}

export type IconName = keyof typeof import('../icons/registry').icons;

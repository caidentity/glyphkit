export interface IconDefinition {
  d: string;
  viewBox: string;
}

export type IconName = keyof typeof import('../icons/registry').icons;

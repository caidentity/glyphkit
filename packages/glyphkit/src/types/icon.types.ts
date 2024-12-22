export interface IconDefinition {
  path: string;
  viewBox: string;
}

export type IconName = keyof typeof import('../icons/registry').icons;

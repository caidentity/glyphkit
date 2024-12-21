export interface IconMetadata {
  name: string;
  path: string;
  size: number;
  category: string;
  tags?: string[];
}

export interface IconCategory {
  name: string;
  icons: IconMetadata[];
}

export interface IconsMetadata {
  categories: IconCategory[];
}

// Icon size constants
export const ICON_SIZES = {
  SMALL: 16,
  REGULAR: 24,
} as const

export type IconSize = typeof ICON_SIZES[keyof typeof ICON_SIZES]

// Helper type guards
export function hasTag(icon: IconMetadata, tag: string): boolean {
  return icon.tags?.includes(tag) ?? false
}

export function hasTags(icon: IconMetadata): boolean {
  return Array.isArray(icon.tags) && icon.tags.length > 0
}
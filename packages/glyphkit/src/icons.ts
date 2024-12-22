// Export the icon components and types
import { paths, getPath } from '../icons/flat/paths.js';
import type { IconDefinition } from './types/icon.types';

// Use the existing type from types file
export type { IconDefinition };

// Cast paths to the correct type to handle the conversion
export const icons = paths as unknown as Record<string, IconDefinition>;
export const getIcon = getPath;

export function registerIcon(name: string, definition: IconDefinition): void {
  (icons as Record<string, IconDefinition>)[name] = definition;
}
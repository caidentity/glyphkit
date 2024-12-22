import { icons } from './icons/registry';
import type { IconDefinition } from './types/icon.types';

export function getIcon(name: string): IconDefinition | null {
  return icons[name.toLowerCase()] || null;
}

export { icons };
export type { IconDefinition };
// This file is auto-generated. Do not edit manually.
import type { IconDefinition } from '../types/icon.types';
import { paths } from '../../icons/flat/paths';

export const icons: Record<string, IconDefinition> = {};

// Convert React elements to IconDefinition format
Object.entries(paths).forEach(([name, pathElement]) => {
  if (name !== 'default' && pathElement.props) {
    icons[name] = {
      path: `<path d="${pathElement.props.d}" fill="currentColor"/>`,
      viewBox: "0 0 24 24"
    };
  }
});

export function getIcon(name: string): IconDefinition | null {
  return icons[name] || null;
}

export function registerIcon(name: string, definition: IconDefinition) {
  icons[name] = definition;
}
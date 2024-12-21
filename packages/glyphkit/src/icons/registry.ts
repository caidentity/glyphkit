import { IconRegistry } from '../types/icon.types';

export const iconRegistry: IconRegistry = {};

export function registerIcon(name: string, definition: { path: string; viewBox?: string }) {
  iconRegistry[name] = definition;
}

export function getIcon(name: string) {
  return iconRegistry[name];
} 
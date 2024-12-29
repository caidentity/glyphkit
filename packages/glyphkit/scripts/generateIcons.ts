import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface IconPath {
  d: string;
}

interface IconDefinition {
  viewBox: string;
  paths: IconPath[];
  category?: string;
  tags?: string[];
}

interface IconModule {
  [key: string]: Record<string, IconDefinition>;
}

async function generateIconRegistry() {
  const iconsDir = path.resolve(__dirname, '../icons/flat/Icons');
  const outputDir = path.resolve(__dirname, '../src/icons');
  
  await fs.mkdir(outputDir, { recursive: true });
  await fs.mkdir(path.resolve(__dirname, '../src/types'), { recursive: true });

  const files = await fs.readdir(iconsDir);
  const icons: Record<string, IconDefinition> = {};
  const categories = new Set<string>();
  const allTags = new Set<string>();

  // Process icon files
  for (const file of files) {
    if (file.endsWith('.js')) {
      const filePath = path.join(iconsDir, file);
      try {
        // Use dynamic import instead of require
        const iconModule = await import(`file://${filePath}`) as IconModule;
        const [, categoryIcons] = Object.entries(iconModule)[0]; // Get first export's value
        
        // Type-safe assignment of icons
        Object.entries(categoryIcons).forEach(([name, icon]) => {
          icons[name] = icon;
          if (icon.category) {
            categories.add(icon.category);
          }
          if (icon.tags) {
            icon.tags.forEach(tag => allTags.add(tag));
          }
        });
      } catch (error) {
        console.error(`Failed to load icons from ${file}:`, error);
      }
    }
  }

  // Generate registry.ts
  const registryContent = `// Auto-generated file
import type { IconDefinition } from '../types/icon.types';

export const icons: Record<string, IconDefinition> = ${JSON.stringify(icons, null, 2)};

export const categories = ${JSON.stringify(Array.from(categories), null, 2)} as const;
export const tags = ${JSON.stringify(Array.from(allTags), null, 2)} as const;

export function getIcon(name: string): IconDefinition | null {
  return icons[name.toLowerCase()] || null;
}

export function getIconsByCategory(category: string): IconDefinition[] {
  return Object.values(icons).filter(icon => icon.category === category);
}

export function getIconsByTag(tag: string): IconDefinition[] {
  return Object.values(icons).filter(icon => icon.tags?.includes(tag));
}`;

  // Write files
  await Promise.all([
    fs.writeFile(
      path.join(outputDir, 'registry.ts'),
      registryContent,
      'utf-8'
    ),
    fs.writeFile(
      path.join(outputDir, 'index.ts'),
      `// Auto-generated file
export * from './registry';
export type { IconDefinition, IconName, IconCategory, IconTag } from '../types/icon.types';
`,
      'utf-8'
    ),
    fs.writeFile(
      path.resolve(__dirname, '../src/types/icon.types.ts'),
      `export interface IconPath {
  d: string;
}

export interface IconDefinition {
  viewBox: string;
  paths: IconPath[];
  category?: string;
  tags?: string[];
}

export type IconName = keyof typeof import('../icons/registry').icons;
export type IconCategory = typeof import('../icons/registry').categories[number];
export type IconTag = typeof import('../icons/registry').tags[number];
`,
      'utf-8'
    )
  ]);

  console.log(`Generated icon registry with ${Object.keys(icons).length} icons`);
  console.log(`Found ${categories.size} categories and ${allTags.size} unique tags`);
}

generateIconRegistry().catch(console.error); 
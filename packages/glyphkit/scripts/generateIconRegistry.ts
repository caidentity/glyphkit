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

interface IconMetadata {
  categories: Array<{
    name: string;
    icons: Array<{
      name: string;
      path: string;
      tags?: string[];
    }>;
  }>;
}

async function loadIconMetadata() {
  try {
    const metadataPath = path.resolve(process.cwd(), 'public/icons/metadata.json');
    const data = await fs.readFile(metadataPath, 'utf-8');
    return JSON.parse(data) as IconMetadata;
  } catch (error) {
    console.error('Failed to load metadata:', error);
    return { categories: [] };
  }
}

async function generateIconRegistry() {
  // Create directories
  await fs.mkdir(path.resolve(process.cwd(), 'src/icons'), { recursive: true });
  await fs.mkdir(path.resolve(process.cwd(), 'src/types'), { recursive: true });
  
  const metadata = await loadIconMetadata();
  const icons: Record<string, IconDefinition> = {};
  const categories = new Set<string>();
  const allTags = new Set<string>();

  // Process each category
  for (const category of metadata.categories) {
    categories.add(category.name);
    
    for (const icon of category.icons) {
      const iconKey = icon.name.toLowerCase();
      try {
        // Read SVG file
        const svgPath = path.resolve(process.cwd(), 'public', icon.path);
        const svgContent = await fs.readFile(svgPath, 'utf-8');
        
        // Extract viewBox and path data
        const viewBox = svgContent.match(/viewBox="([^"]+)"/)?.[1] || "0 0 24 24";
        const d = svgContent.match(/d="([^"]+)"/)?.[1];

        if (d) {
          const iconTags = [category.name, ...icon.tags || []];
          iconTags.forEach(tag => allTags.add(tag));

          icons[iconKey] = {
            viewBox,
            paths: [{ d: d.trim().replace(/\s+/g, ' ') }],
            category: category.name,
            tags: iconTags
          };
        }
      } catch (error) {
        console.warn(`Failed to process icon ${icon.name}:`, error);
      }
    }
  }

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
      path.resolve(process.cwd(), 'src/icons/registry.ts'),
      registryContent,
      'utf-8'
    ),
    fs.writeFile(
      path.resolve(process.cwd(), 'src/icons/index.ts'),
      `// Auto-generated file
export * from './registry';
export type { IconDefinition, IconName, IconCategory, IconTag } from '../types/icon.types';
`,
      'utf-8'
    ),
    fs.writeFile(
      path.resolve(process.cwd(), 'src/types/icon.types.ts'),
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

generateIconRegistry().catch((error) => {
  console.error('Icon generation failed:', error);
  process.exit(1);
});
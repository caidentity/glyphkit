import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import * as path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface PathAttributes {
  d: string;
  fillRule?: 'nonzero' | 'evenodd' | 'inherit';
  clipRule?: 'nonzero' | 'evenodd' | 'inherit';
  fill?: string;
}

interface IconDefinition {
  viewBox: string;
  paths: PathAttributes[];
  d?: string;
  category?: string;
  tags?: string[];
}

interface IconData {
  viewBox: string;
  paths: PathAttributes[];
}

interface IconModule {
  [key: string]: Record<string, IconData>;
}

async function generateIconRegistry() {
  const iconsDir = path.resolve(__dirname, '../icons/flat/Icons');
  const outputDir = path.resolve(__dirname, '../src/icons');
  
  await fs.mkdir(outputDir, { recursive: true });

  const files = await fs.readdir(iconsDir);
  const icons: Record<string, IconDefinition> = {};
  const categories = new Set<string>();
  const allTags = new Set<string>();

  for (const file of files) {
    if (file.endsWith('.js')) {
      const filePath = path.join(iconsDir, file);
      try {
        const module = await import(`file://${filePath}`);
        const iconModule = module as IconModule;
        const [, categoryIcons] = Object.entries(iconModule)[0];
        const category = path.basename(file, '.js');

        Object.entries(categoryIcons).forEach(([name, icon]) => {
          const nameTags = name.split('_').filter(tag => 
            tag !== '16' && tag !== '24'
          );

          const paths = icon.paths.map(path => ({
            ...path,
            d: path.d,
            fillRule: path.fillRule || 'nonzero',
            clipRule: path.clipRule,
            fill: path.fill !== '#000000' ? path.fill : undefined
          }));

          icons[name] = {
            viewBox: icon.viewBox,
            paths: paths,
            d: paths[0]?.d,
            category,
            tags: [category, ...nameTags]
          };

          categories.add(category);
          nameTags.forEach(tag => allTags.add(tag));
        });
      } catch (error) {
        console.error(`Failed to load icons from ${file}:`, error);
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
}`;

  await fs.writeFile(
    path.join(outputDir, 'registry.ts'),
    registryContent,
    'utf-8'
  );

  console.log(`Generated icon registry with ${Object.keys(icons).length} icons`);
  console.log(`Found ${categories.size} categories and ${allTags.size} unique tags`);
}

generateIconRegistry().catch(console.error); 
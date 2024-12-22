import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface IconDefinition {
  viewBox: string;
  d: string;
}

async function generateIconRegistry() {
  const iconsDir = path.resolve(__dirname, '../icons/flat/Icons');
  const outputDir = path.resolve(__dirname, '../src/icons');
  
  await fs.mkdir(outputDir, { recursive: true });
  await fs.mkdir(path.resolve(__dirname, '../src/types'), { recursive: true });

  const files = await fs.readdir(iconsDir);
  const icons: Record<string, IconDefinition> = {};

  // Process icon files
  for (const file of files) {
    if (file.endsWith('.js')) {
      const filePath = path.join(iconsDir, file);
      try {
        // Use dynamic import instead of require
        const iconModule = await import(`file://${filePath}`);
        const categoryIcons = Object.values(iconModule)[0];
        Object.assign(icons, categoryIcons);
      } catch (error) {
        console.error(`Failed to load icons from ${file}:`, error);
      }
    }
  }

  // Generate registry.ts
  const registryContent = `// Auto-generated file
import type { IconDefinition } from '../types/icon.types';

export const icons: Record<string, IconDefinition> = ${JSON.stringify(icons, null, 2)};

export function getIcon(name: string): IconDefinition | null {
  return icons[name.toLowerCase()] || null;
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
export type { IconDefinition, IconName } from '../types/icon.types';
`,
      'utf-8'
    ),
    fs.writeFile(
      path.resolve(__dirname, '../src/types/icon.types.ts'),
      `export interface IconDefinition {
  d: string;
  viewBox: string;
}

export type IconName = keyof typeof import('../icons/registry').icons;
`,
      'utf-8'
    )
  ]);

  console.log(`Generated icon registry with ${Object.keys(icons).length} icons`);
}

generateIconRegistry().catch(console.error); 
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function loadIconMetadata() {
  try {
    const metadataPath = path.resolve(process.cwd(), 'public/icons/metadata.json');
    const data = await fs.readFile(metadataPath, 'utf-8');
    return JSON.parse(data);
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
  const icons: Record<string, { d: string; viewBox: string }> = {};

  // Process each category
  for (const category of metadata.categories) {
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
          icons[iconKey] = {
            d: d.trim().replace(/\s+/g, ' '),
            viewBox
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

export function getIcon(name: string): IconDefinition | null {
  return icons[name.toLowerCase()] || null;
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
export type { IconDefinition, IconName } from '../types/icon.types';
`,
      'utf-8'
    ),
    fs.writeFile(
      path.resolve(process.cwd(), 'src/types/icon.types.ts'),
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

generateIconRegistry().catch((error) => {
  console.error('Icon generation failed:', error);
  process.exit(1);
});
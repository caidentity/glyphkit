import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define config constants directly in script to avoid import issues
const ICONS_CONFIG = {
  BASE_DIR: 'public/icons',
  FILE_EXTENSION: '.svg',
  DEFAULT_SIZE: 24,
  SMALL_SIZE: 16,
  SMALL_SUFFIX: '-small'
} as const;

interface IconDefinition {
  path: string;
  viewBox: string;
}

async function generateIconsIndex(iconDir: string) {
  const icons: Record<string, IconDefinition> = {};
  
  // Ensure directory exists
  try {
    await fs.access(iconDir);
  } catch {
    console.error(`Directory not found: ${iconDir}`);
    return;
  }

  // Scan recursively through directories
  async function scanDirectory(dir: string) {
    const files = await fs.readdir(dir);

    for (const file of files) {
      const filepath = path.join(dir, file);
      const stat = await fs.stat(filepath);

      if (stat.isDirectory()) {
        await scanDirectory(filepath);
      } else if (file.endsWith('.svg')) {
        const content = await fs.readFile(filepath, 'utf-8');
        const name = path.basename(file, '.svg')
          .replace(ICONS_CONFIG.SMALL_SUFFIX, '');
        
        // Extract path and viewBox from SVG
        const pathMatch = content.match(/d="([^"]+)"/);
        const viewBoxMatch = content.match(/viewBox="([^"]+)"/);

        if (pathMatch && viewBoxMatch) {
          icons[name] = {
            path: pathMatch[1],
            viewBox: viewBoxMatch[1]
          };
        }
      }
    }
  }

  await scanDirectory(iconDir);

  // Generate icons index file
  const indexContent = `
import { IconDefinition } from '../types/icon.types';

export const icons: Record<string, IconDefinition> = ${JSON.stringify(icons, null, 2)};
`;

  const outputDir = path.join(__dirname, '../src/icons');
  
  // Ensure output directory exists
  try {
    await fs.access(outputDir);
  } catch {
    await fs.mkdir(outputDir, { recursive: true });
  }

  await fs.writeFile(
    path.join(outputDir, 'index.ts'),
    indexContent
  );

  console.log(`✓ Generated icon definitions for ${Object.keys(icons).length} icons`);
}

// Run the script
const iconDir = path.resolve(__dirname, '../../../public/icons');
generateIconsIndex(iconDir).catch(console.error); 
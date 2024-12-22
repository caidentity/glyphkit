import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const packageRoot = dirname(dirname(__filename));

interface IconDefinition {
  path: string;
  viewBox: string;
}

async function generateIconRegistry() {
  console.log('Generating icon registry...');
  
  // Get all icon files from the directory
  const iconDir = path.join(packageRoot, 'icons/flat/Icons');
  const files = await fs.readdir(iconDir);
  const iconFiles = files.filter(f => f.endsWith('.tsx'));

  const icons: Record<string, IconDefinition> = {};
  let totalIcons = 0;

  for (const file of iconFiles) {
    try {
      const filePath = path.join(iconDir, file);
      const content = await fs.readFile(filePath, 'utf-8');
      console.log(`Processing ${file}...`);
      
      // Extract icon definitions using regex
      const iconRegex = /(?:export const\s+)?(ic_[\w_]+_(?:16|24|32)):\s*`\s*<svg[^>]*viewBox="([^"]+)"[^>]*>([\s\S]*?)<\/svg>\s*`/g;
      
      let match;
      while ((match = iconRegex.exec(content)) !== null) {
        const iconName = match[1];
        const viewBox = match[2];
        const svgContent = match[3].trim();
        
        // Extract all SVG elements (path, circle, rect, etc)
        const elementRegex = /<(?:path|circle|rect|g)[^>]+>/g;
        const elements = svgContent.match(elementRegex);
        
        if (elements) {
          icons[iconName] = {
            path: elements.join(''),
            viewBox
          };
          totalIcons++;
          
          if (totalIcons % 100 === 0) {
            console.log(`Processed ${totalIcons} icons...`);
          }
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not process file ${file}:`, error);
    }
  }

  const typeContent = `export interface IconDefinition {
  path: string;
  viewBox: string;
}

export interface IconCache {
  [key: string]: IconDefinition;
}`;

  const content = `// Auto-generated file
import type { IconDefinition } from '../types/icon.types';

export const icons: Record<string, IconDefinition> = ${JSON.stringify(icons, null, 2)};

export function getIcon(name: string): IconDefinition | null {
  return icons[name] || null;
}

// Export individual icons for direct usage
${Object.keys(icons)
  .map(name => `export const ${name}: IconDefinition = icons['${name}'];`)
  .join('\n')}
`;

  // Write the type definition
  const typeDir = path.join(packageRoot, 'src/types');
  await fs.mkdir(typeDir, { recursive: true });
  await fs.writeFile(path.join(typeDir, 'icon.types.ts'), typeContent);

  // Write the icon registry
  const outputFile = path.join(packageRoot, 'src/icons/index.ts');
  await fs.writeFile(outputFile, content, 'utf-8');

  console.log(`\nGenerated ${totalIcons} icons to ${outputFile}`);
  console.log('Icon categories:', new Set(Object.keys(icons).map(name => name.split('_')[1])).size);
  console.log('Sample icons:', Object.keys(icons).slice(0, 5).join(', '));
}

generateIconRegistry().catch(console.error); 
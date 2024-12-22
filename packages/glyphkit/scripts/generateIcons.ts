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
  
  const iconFiles = ['nature', 'files', 'controls', 'view'];
  const icons: Record<string, IconDefinition> = {};

  for (const category of iconFiles) {
    try {
      const filePath = path.join(packageRoot, 'icons/flat/Icons', `${category}.tsx`);
      const content = await fs.readFile(filePath, 'utf-8');
      
      // Extract icon definitions using regex
      const iconRegex = /ic_[\w_]+_(?:16|24):\s*`\s*<svg[^>]*viewBox="([^"]+)"[^>]*>([\s\S]*?)<\/svg>\s*`/g;
      
      let match;
      while ((match = iconRegex.exec(content)) !== null) {
        const iconName = match[0].split(':')[0].trim();
        const viewBox = match[1];
        const svgContent = match[2].trim();
        
        // Extract path elements
        const pathRegex = /<path[^>]+>/g;
        const paths = svgContent.match(pathRegex);
        
        if (paths) {
          icons[iconName] = {
            path: paths.join(''),
            viewBox
          };
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not process category ${category}:`, error);
    }
  }

  const content = `// Auto-generated file
import type { IconDefinition } from '../types/icon.types';

export const icons: Record<string, IconDefinition> = ${JSON.stringify(icons, null, 2)};

export function getIcon(name: string): IconDefinition | null {
  return icons[name] || null;
}`;

  const outputFile = path.join(packageRoot, 'src/icons/index.ts');
  await fs.writeFile(outputFile, content, 'utf-8');

  const iconCount = Object.keys(icons).length;
  console.log(`Generated ${iconCount} icons to ${outputFile}`);
}

generateIconRegistry().catch(console.error); 
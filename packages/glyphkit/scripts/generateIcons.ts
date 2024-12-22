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
  
  // Import files.tsx content directly
  const filesContent = await fs.readFile(
    path.join(packageRoot, 'icons/flat/Icons/files.tsx'),
    'utf-8'
  );

  // Extract SVG content using regex
  const icons: Record<string, IconDefinition> = {};
  const iconRegex = /ic_[\w_]+_\d+:\s*`\s*<svg[^>]*viewBox="([^"]+)"[^>]*>([\s\S]*?)<\/svg>\s*`/g;
  
  let match;
  while ((match = iconRegex.exec(filesContent)) !== null) {
    const iconName = match[0].split(':')[0].trim();
    const viewBox = match[1];
    const svgContent = match[2].trim();
    
    icons[iconName] = {
      path: svgContent,
      viewBox: viewBox
    };
  }

  const content = `// Auto-generated file
import type { IconDefinition } from '../types/icon.types';

export const icons: Record<string, IconDefinition> = ${JSON.stringify(icons, null, 2)};

export function getIcon(name: string): IconDefinition | null {
  return icons[name] || null;
}
`;

  const outputFile = path.join(packageRoot, 'src/icons/index.ts');
  await fs.writeFile(outputFile, content, 'utf-8');

  const iconCount = Object.keys(icons).length;
  console.log(`Generated ${iconCount} icons to ${outputFile}`);
}

generateIconRegistry().catch(console.error); 
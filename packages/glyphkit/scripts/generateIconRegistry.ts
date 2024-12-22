import * as fs from 'fs/promises';
import * as path from 'path';
import { paths } from '../icons/flat/paths';

async function generateIconRegistry() {
  // First verify paths are loaded correctly
  console.log(`Found ${Object.keys(paths).length} icons in paths.tsx`);
  
  const registryContent = `// This file is auto-generated. Do not edit manually.
import type { IconDefinition } from '../types/icon.types';
import { paths } from '../../icons/flat/paths';

export const icons: Record<string, IconDefinition> = {};

// Convert React elements to IconDefinition format
Object.entries(paths).forEach(([name, pathElement]) => {
  if (name !== 'default' && pathElement.props) {
    icons[name] = {
      path: \`<path d="\${pathElement.props.d}" fill="currentColor"/>\`,
      viewBox: "0 0 24 24"
    };
  }
});

export function getIcon(name: string): IconDefinition | null {
  return icons[name] || null;
}

export function registerIcon(name: string, definition: IconDefinition) {
  icons[name] = definition;
}`;

  const indexContent = `// This file is auto-generated. Do not edit manually.
import type { IconDefinition } from '../types/icon.types';
import { icons, getIcon, registerIcon } from './registry';

export { icons, getIcon, registerIcon };

// Export individual icons
${Object.keys(paths)
  .filter(name => name !== 'default')
  .map(name => {
    const exportName = name.startsWith('ic_') ? name : `ic_${name}`;
    return `export const ${exportName} = icons['${name}'];`;
  })
  .join('\n')}
`;

  await fs.writeFile(
    path.resolve(process.cwd(), 'src/icons/registry.ts'),
    registryContent,
    'utf-8'
  );

  await fs.writeFile(
    path.resolve(process.cwd(), 'src/icons/index.ts'),
    indexContent,
    'utf-8'
  );

  console.log('Generated icon files successfully');
}

generateIconRegistry().catch(console.error);
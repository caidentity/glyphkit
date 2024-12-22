import * as fs from 'fs/promises';
import * as path from 'path';
import { paths } from '../icons/flat/paths';

async function generateIconRegistry() {
  const iconEntries = Object.entries(paths).filter(([name]) => name !== 'default');
  const successfulIcons: string[] = [];
  const failedIcons: string[] = [];

  console.log(`Processing ${iconEntries.length} icons`);

  const registryContent = `// Auto-generated file
import type { IconDefinition } from '../types/icon.types';

export const icons: Record<string, IconDefinition> = {
${iconEntries.map(([name, pathElement]) => {
  try {
    if (!pathElement.props?.d) {
      failedIcons.push(name);
      console.warn(`Warning: No path data for icon "${name}"`);
      return null;
    }

    // Escape any quotes in the path data
    const escapedPath = pathElement.props.d.replace(/([\\"])/g, '\\$1');
    const viewBox = pathElement.props.viewBox || "0 0 24 24";

    successfulIcons.push(name);
    return `  "${name}": {
    path: '<path d="${escapedPath}" fill="currentColor"/>',
    viewBox: "${viewBox}"
  }`;
  } catch (error) {
    failedIcons.push(name);
    console.error(`Error processing icon "${name}":`, error);
    return null;
  }
}).filter(Boolean).join(',\n')}
};

export function getIcon(name: string): IconDefinition | null {
  return icons[name] || null;
}

export function registerIcon(name: string, definition: IconDefinition) {
  icons[name] = definition;
}`;

  const indexContent = `// Auto-generated file
export * from './registry';
export type { IconDefinition, IconName } from '../types/icon.types';
`;

  try {
    // Create directories
    await fs.mkdir(path.resolve(process.cwd(), 'src/icons'), { recursive: true });
    await fs.mkdir(path.resolve(process.cwd(), 'src/types'), { recursive: true });

    // Write files
    await Promise.all([
      fs.writeFile(
        path.resolve(process.cwd(), 'src/icons/registry.ts'),
        registryContent,
        'utf-8'
      ),
      fs.writeFile(
        path.resolve(process.cwd(), 'src/icons/index.ts'),
        indexContent,
        'utf-8'
      ),
      fs.writeFile(
        path.resolve(process.cwd(), 'src/types/icon.types.ts'),
        `export interface IconDefinition {
  path: string;
  viewBox: string;
}

export type IconName = keyof typeof import('../icons/registry').icons;
`,
        'utf-8'
      )
    ]);

    console.log(`
Icon Generation Summary:
- Total icons processed: ${iconEntries.length}
- Successfully generated: ${successfulIcons.length}
- Failed: ${failedIcons.length}
${failedIcons.length > 0 ? `\nFailed icons:\n${failedIcons.join('\n')}` : ''}
    `);
  } catch (error) {
    console.error('Failed to write icon files:', error);
    process.exit(1);
  }
}

generateIconRegistry().catch((error) => {
  console.error('Icon generation failed:', error);
  process.exit(1);
});
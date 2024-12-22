import * as fs from 'fs/promises';
import * as path from 'path';

const ICON_SETS = [
  'arrows',
  'brand',
  'communication',
  'controls',
  'data',
  'files',
  'location',
  'media',
  'message',
  'money',
  'nature',
  'objects',
  'people',
  'shapes',
  'system',
  'text',
  'time',
  'ui',
  'view'
];

async function generateIconFiles() {
  const iconsDir = path.resolve(process.cwd(), 'icons/flat/Icons');
  
  // Create directory if it doesn't exist
  await fs.mkdir(iconsDir, { recursive: true });

  // Create index.ts file for exporting all icons
  const indexContent = ICON_SETS
    .map(set => `export { ${set}Icons } from "./${set}.js";`)
    .join('\n');

  await fs.writeFile(
    path.join(iconsDir, 'index.ts'),
    indexContent + '\n',
    'utf-8'
  );

  // Create each icon file
  for (const set of ICON_SETS) {
    const filePath = path.join(iconsDir, `${set}.js`);
    const content = `// Auto-generated file
export const ${set}Icons = {
  // Icon definitions will be added here
};
`;
    
    try {
      await fs.writeFile(filePath, content, 'utf-8');
      console.log(`Created ${set}.js`);
    } catch (error) {
      console.error(`Error creating ${set}.js:`, error);
    }
  }
}

generateIconFiles().catch(console.error); 
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Define minimal React types if needed
type ReactElement = {
  props?: {
    children?: string;
  };
};

const __filename = fileURLToPath(import.meta.url);
const currentDir = dirname(__filename);
const packageRoot = dirname(currentDir); // This is the glyphkit package root

// Fix paths to be relative to the glyphkit package root
const FLAT_ICONS_DIR = path.resolve(packageRoot, 'icons/flat');
const SVG_ICONS_DIR = path.resolve(packageRoot, 'demo/public/icons');
const OUTPUT_FILE = path.resolve(packageRoot, 'src/icons/index.ts');

// Create necessary directories
async function ensureDirectories() {
  const directories = [
    path.dirname(OUTPUT_FILE),
    SVG_ICONS_DIR,
  ];

  for (const dir of directories) {
    try {
      await fs.access(dir);
    } catch {
      console.log(`Creating directory: ${dir}`);
      await fs.mkdir(dir, { recursive: true });
    }
  }
}

interface IconDefinition {
  path: string;
  viewBox: string;
}

async function importFlatIcons(): Promise<Record<string, IconDefinition>> {
  try {
    const { paths } = await import('../icons/flat/paths.js');
    const icons: Record<string, IconDefinition> = {};
    let processedCount = 0;
    let skippedCount = 0;

    console.log('\nProcessing flat icons...');

    for (const [name, element] of Object.entries(paths)) {
      if (name === 'default') continue;
      
      // Log the name and first few characters of the content
      const preview = typeof element === 'string' 
        ? element.substring(0, 50) 
        : element.props?.children?.toString().substring(0, 50);
      
      console.log(`Processing icon: ${name}`);
      console.log(`Content preview: ${preview}...`);

      const iconDef = extractSvgContent(element);
      if (iconDef) {
        icons[name] = iconDef;
        processedCount++;
        
        // Validate the icon definition
        if (!iconDef.path.includes('<path')) {
          console.warn(`⚠️ Warning: No path element found in icon ${name}`);
        }
        if (!iconDef.viewBox) {
          console.warn(`⚠️ Warning: No viewBox found in icon ${name}`);
        }
      } else {
        console.warn(`⚠️ Skipped icon ${name} - Could not extract SVG content`);
        skippedCount++;
      }

      if (processedCount % 50 === 0) {
        console.log(`Processed ${processedCount} icons...`);
      }
    }

    console.log(`\nFlat icons processing complete:`);
    console.log(`✓ Successfully processed: ${processedCount} icons`);
    console.log(`✗ Skipped: ${skippedCount} icons`);

    return icons;
  } catch (error) {
    console.error('Failed to import flat icons:', error);
    return {};
  }
}

async function importSvgFiles(): Promise<Record<string, IconDefinition>> {
  const icons: Record<string, IconDefinition> = {};

  try {
    // Check if directory exists before trying to read it
    try {
      await fs.access(SVG_ICONS_DIR);
    } catch {
      console.log(`SVG directory not found: ${SVG_ICONS_DIR}`);
      return icons;
    }

    const files = await fs.readdir(SVG_ICONS_DIR);
    console.log(`Found ${files.length} files in SVG directory`);
    
    for (const file of files) {
      if (!file.endsWith('.svg')) continue;

      const filePath = path.join(SVG_ICONS_DIR, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const name = path.basename(file, '.svg');
      
      const viewBoxMatch = content.match(/viewBox="([^"]+)"/);
      const pathMatch = content.match(/<path[^>]*>/g);

      if (pathMatch) {
        icons[name] = {
          path: pathMatch.join('\n').replace(/fill="[^"]*"/g, 'fill="currentColor"'),
          viewBox: viewBoxMatch?.[1] || '0 0 24 24'
        };
      }
    }
  } catch (error) {
    console.error('Failed to import SVG files:', error);
  }

  return icons;
}

function extractSvgContent(element: string | ReactElement): IconDefinition | null {
  try {
    const elementStr = typeof element === 'string' ? element : element.props?.children?.toString() || '';
    
    // Add debug logging
    if (!elementStr) {
      console.warn('Empty element string received');
      return null;
    }

    const viewBoxMatch = elementStr.match(/viewBox="([^"]+)"/);
    const pathMatch = elementStr.match(/<path[^>]*>/g);

    if (!pathMatch) {
      console.warn('No path elements found in:', elementStr.substring(0, 100));
      return null;
    }

    return {
      path: pathMatch.join('\n').replace(/fill="[^"]*"/g, 'fill="currentColor"'),
      viewBox: viewBoxMatch?.[1] || '0 0 24 24'
    };
  } catch (error) {
    console.error('Failed to extract SVG content:', error);
    return null;
  }
}

async function generateRegistry() {
  console.log('Starting icon registry generation...');

  try {
    // Ensure all required directories exist
    await ensureDirectories();

    // Import both flat icons and SVG files
    const [flatIcons, svgIcons] = await Promise.all([
      importFlatIcons(),
      importSvgFiles()
    ]);

    // Merge both sets of icons
    const icons = {
      ...flatIcons,
      ...svgIcons
    };

    const content = `// This file is auto-generated. Do not edit manually.
import type { IconDefinition } from '../types/icon.types';

export const icons: Record<string, IconDefinition> = ${JSON.stringify(icons, null, 2)};
`;

    await fs.writeFile(OUTPUT_FILE, content, 'utf-8');
    console.log(`✓ Successfully generated registry with ${Object.keys(icons).length} icons`);
    console.log(`✓ Output written to: ${OUTPUT_FILE}`);

  } catch (error) {
    console.error('Failed to generate icon registry:', error);
    process.exit(1);
  }
}

generateRegistry().catch(console.error); 
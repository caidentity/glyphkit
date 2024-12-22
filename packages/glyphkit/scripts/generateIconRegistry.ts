import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ICONS_DIR = path.resolve(__dirname, '../../../public/icons');
const OUTPUT_FILE = path.resolve(__dirname, '../src/icons/index.ts');

interface IconDefinition {
  path: string;
  viewBox: string;
}

async function readSvgContent(filePath: string): Promise<IconDefinition> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    
    // Extract viewBox
    const viewBoxMatch = content.match(/viewBox="([^"]+)"/);
    const viewBox = viewBoxMatch?.[1] || '0 0 24 24';

    // Extract everything between <svg> tags
    const svgMatch = content.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);
    if (!svgMatch) {
      throw new Error(`Invalid SVG content in ${filePath}`);
    }

    // Get the inner content
    const innerContent = svgMatch[1];

    // Find all path elements with their attributes
    const pathElements = innerContent.match(/<path[^>]*?\/>/g) || [];
    if (pathElements.length === 0) {
      throw new Error(`No paths found in ${filePath}`);
    }

    // Process each path element
    const processedPaths = pathElements
      .map(pathElement => {
        // Preserve all attributes except fill
        return pathElement.replace(/fill="[^"]*"/g, 'fill="currentColor"');
      })
      .join('\n');

    console.log(`Processing ${path.basename(filePath)} - Found ${pathElements.length} paths`);
    
    // Verify paths were preserved
    const finalPathCount = (processedPaths.match(/<path/g) || []).length;
    if (finalPathCount !== pathElements.length) {
      console.warn(`Path count mismatch in ${filePath}: ${pathElements.length} -> ${finalPathCount}`);
    }

    return {
      path: processedPaths,
      viewBox
    };

  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    throw error;
  }
}

async function generateRegistry() {
  const startTime = Date.now();
  const icons: Record<string, IconDefinition> = {};
  const stats = {
    processed: 0,
    errors: 0,
    singlePath: 0,
    multiPath: 0
  };

  async function processDirectory(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        await processDirectory(fullPath);
      } else if (entry.name.endsWith('.svg')) {
        const iconName = entry.name.replace('.svg', '');
        
        try {
          const iconDefinition = await readSvgContent(fullPath);
          icons[iconName] = iconDefinition;
          stats.processed++;

          // Track path statistics
          const pathCount = (iconDefinition.path.match(/<path/g) || []).length;
          if (pathCount > 1) {
            stats.multiPath++;
            console.log(`Multi-path icon: ${iconName} (${pathCount} paths)`);
          } else {
            stats.singlePath++;
          }
        } catch (error) {
          stats.errors++;
          console.error(`❌ Failed to process ${iconName}:`, error);
        }
      }
    }
  }

  try {
    console.log('Starting icon registry generation...');
    await processDirectory(ICONS_DIR);
    
    const content = `// This file is auto-generated. Do not edit manually.
import type { IconDefinition } from '../types/icon.types';

export const icons: Record<string, IconDefinition> = ${JSON.stringify(icons, null, 2)};
`;

    await fs.writeFile(OUTPUT_FILE, content, 'utf-8');

    const endTime = Date.now();
    console.log('\nGeneration complete:');
    console.log(`✓ Processed: ${stats.processed} icons`);
    console.log(`✓ Single path: ${stats.singlePath} icons`);
    console.log(`✓ Multi path: ${stats.multiPath} icons`);
    console.log(`✓ Errors: ${stats.errors} icons`);
    console.log(`✓ Time taken: ${((endTime - startTime) / 1000).toFixed(2)}s`);

    // Verify specific icons
    const testIcons = ['ic_sun_filled_24px', 'ic_star_filled_24px'];
    console.log('\nVerifying specific icons:');
    for (const iconName of testIcons) {
      if (icons[iconName]) {
        const pathCount = (icons[iconName].path.match(/<path/g) || []).length;
        console.log(`✓ ${iconName}: ${pathCount} paths`);
        console.log(icons[iconName].path);
      } else {
        console.log(`❌ ${iconName} not found`);
      }
    }

    // After writing the file
    const writtenContent = await fs.readFile(OUTPUT_FILE, 'utf-8');
    console.log('\nVerifying written content:');
    console.log('File size:', writtenContent.length);
    console.log('Number of icons:', Object.keys(JSON.parse(writtenContent.split('=')[1])).length);

    // Test specific icon
    const sunIcon = icons['ic_sun_filled_24px'];
    if (sunIcon) {
      console.log('\nSun icon details:');
      console.log('ViewBox:', sunIcon.viewBox);
      console.log('Path count:', (sunIcon.path.match(/<path/g) || []).length);
      console.log('Path content:', sunIcon.path);
    }

  } catch (error) {
    console.error('Failed to generate registry:', error);
    process.exit(1);
  }
}

generateRegistry().catch(console.error);
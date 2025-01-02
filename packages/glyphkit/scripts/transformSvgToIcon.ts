import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface PathAttributes {
  d: string;
  fillRule?: 'nonzero' | 'evenodd' | 'inherit';
  clipRule?: 'nonzero' | 'evenodd' | 'inherit';
  fill?: string;
}

interface IconDefinition {
  viewBox: string;
  paths: PathAttributes[];
}

function transformSvgToIcon(svgContent: string): IconDefinition | null {
  try {
    const viewBoxMatch = svgContent.match(/viewBox="([^"]+)"/);
    if (!viewBoxMatch) {
      console.warn('Could not find viewBox attribute');
      return null;
    }

    const pathMatches = svgContent.match(/<path[^>]*>/g);
    if (!pathMatches) {
      console.warn('Could not find any path elements');
      return null;
    }

    const paths = pathMatches.map(pathElement => {
      const dMatch = pathElement.match(/d="([^"]+)"/);
      const fillRuleMatch = pathElement.match(/fill-rule="([^"]+)"/);
      const clipRuleMatch = pathElement.match(/clip-rule="([^"]+)"/);
      const fillMatch = pathElement.match(/fill="([^"]+)"/);

      if (!dMatch) return null;

      const pathData: PathAttributes = {
        d: dMatch[1]
      };

      if (fillRuleMatch) pathData.fillRule = fillRuleMatch[1] as 'nonzero' | 'evenodd' | 'inherit';
      if (clipRuleMatch) pathData.clipRule = clipRuleMatch[1] as 'nonzero' | 'evenodd' | 'inherit';
      if (fillMatch) pathData.fill = fillMatch[1];

      return pathData;
    }).filter((p): p is PathAttributes => p !== null);

    return {
      viewBox: viewBoxMatch[1],
      paths
    };
  } catch (error) {
    console.error('Error transforming SVG:', error);
    return null;
  }
}

async function processIconsFile(filePath: string): Promise<void> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    
    // Extract category name from filename
    const categoryName = path.basename(filePath, '.tsx').toLowerCase();
    
    // Extract the icons object
    const iconsMatch = content.match(/export const \w+Icons = ({[\s\S]+?});/);
    if (!iconsMatch) {
      throw new Error(`Could not find icons object in ${filePath}`);
    }

    const iconsObjectStr = iconsMatch[1];
    
    // Parse the icons object (safely evaluate the string)
    const iconsObject = eval(`(${iconsObjectStr})`);
    
    // Transform each icon
    const transformedIcons: Record<string, IconDefinition> = {};
    
    for (const [iconName, svgContent] of Object.entries(iconsObject)) {
      const cleanName = iconName.replace(/^ic_/, '');
      const transformed = transformSvgToIcon(svgContent as string);
      if (transformed) {
        transformedIcons[cleanName] = transformed;
      }
    }

    // Write the transformed icons to a new .js file
    const outputDir = path.resolve(__dirname, '..', 'icons', 'flat', 'Icons');
    const outputPath = path.join(outputDir, `${categoryName}.js`);
    const outputContent = `export const ${categoryName}Icons = ${JSON.stringify(transformedIcons, null, 2)};`;
    
    await fs.writeFile(outputPath, outputContent, 'utf-8');
    console.log(`Successfully processed ${categoryName} icons`);

  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    throw error;
  }
}

async function transformAllIcons() {
  const iconsDir = path.resolve(__dirname, '..', 'icons', 'flat', 'Icons', 'export');
  
  try {
    // Read all files from the export directory
    const files = await fs.readdir(iconsDir);
    const iconFiles = files.filter(file => file.endsWith('.tsx'));

    if (iconFiles.length === 0) {
      throw new Error(`No .tsx files found in ${iconsDir}`);
    }

    // Create output directory
    const outputDir = path.resolve(__dirname, '..', 'icons', 'flat', 'Icons');
    await fs.mkdir(outputDir, { recursive: true });

    // Process each icon file
    for (const file of iconFiles) {
      const sourceFile = path.join(iconsDir, file);
      const categoryName = path.basename(file, '.tsx').toLowerCase();
      
      console.log(`Processing ${categoryName} icons...`);
      await processIconsFile(sourceFile);
    }

    // Generate index.ts
    const categories = iconFiles.map(file => path.basename(file, '.tsx').toLowerCase());
    const indexContent = categories
      .map(category => `export { ${category}Icons } from './${category}';`)
      .join('\n') + '\n';

    await fs.writeFile(path.join(outputDir, 'index.ts'), indexContent, 'utf-8');
    console.log('Successfully generated index.ts');

  } catch (error) {
    console.error('Error transforming icons:', error);
    process.exit(1);
  }
}

transformAllIcons().catch(console.error); 
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

/**
 * Create or Update Icons Script
 * ============================
 * 
 * This script adds or updates icons in the GlyphKit icon set by processing SVG files
 * and adding them to the appropriate icon category file.
 * 
 * Configuration
 * ------------
 * Update SOURCE_CONFIG below with:
 * - sourcePath: Path to SVG file or directory containing SVG files
 * - targetFile: Path to the JS file to update
 * 
 * Example Structure:
 * /packages/glyphkit/
 *   ├── icons/flat/Icons/
 *   │   ├── location.js        <- Target file
 *   │   └── newicons/
 *   │       └── locations/     <- Source directory
 *   │           └── factory_16.svg
 * 
 * SVG File Requirements
 * -------------------
 * - File naming: name_size.svg (e.g., factory_16.svg)
 * - Must contain valid SVG path elements
 * - Supported attributes: d, fill-rule, clip-rule, fill
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the glyphkit package root
const PACKAGE_ROOT = path.resolve(__dirname, '..', '..');

// Configure source and target paths relative to package root
const SOURCE_CONFIG = {
  "location": {
    sourcePath: path.join(PACKAGE_ROOT, 'icons/flat/Icons/newicons'),
    targetFile: path.join(PACKAGE_ROOT, 'icons/flat/Icons/brand.js')
  }
};

// Verify paths exist before processing
function verifyPaths(): void {
  Object.entries(SOURCE_CONFIG).forEach(([name, config]) => {
    const { sourcePath, targetFile } = config;
    
    // Check source path
    if (!fs.existsSync(sourcePath)) {
      console.error(`Error: Source path not found for ${name}:`);
      console.error(`  ${sourcePath}`);
      process.exit(1);
    }

    // Check target file and its directory
    const targetDir = path.dirname(targetFile);
    if (!fs.existsSync(targetDir)) {
      console.error(`Error: Target directory not found for ${name}:`);
      console.error(`  ${targetDir}`);
      process.exit(1);
    }

    // If target file doesn't exist, create it with empty icon set
    if (!fs.existsSync(targetFile)) {
      const iconType = path.basename(targetFile, '.js');
      fs.writeFileSync(targetFile, `export const ${iconType}Icons = {};\n`);
      console.log(`Created new icon file: ${targetFile}`);
    }
  });
}

interface PathAttributes {
  d: string;
  fillRule?: string;
  clipRule?: string;
  fill?: string;
}

interface IconData {
  viewBox: string;
  d?: string;          // Keep for backward compatibility
  paths?: PathAttributes[]; // Optional paths array for multi-path icons
}

interface IconSet {
  [key: string]: IconData;
}

interface IconConfig {
  sourcePath: string;
  targetFile: string;
}

function extractSVGData(svgContent: string): IconData {
  const viewBoxMatch = svgContent.match(/viewBox="([^"]+)"/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : "0 0 24 24";

  const paths: PathAttributes[] = [];
  const pathRegex = /<path[^>]*?(?:\/?>|\/>)/g;
  let match;

  while ((match = pathRegex.exec(svgContent)) !== null) {
    const pathElement = match[0];
    const path: PathAttributes = { d: '' };

    // Extract path attributes with improved regex
    const dMatch = pathElement.match(/\sd="([^"]+)"/);
    if (dMatch) {
      // Clean up path data
      path.d = dMatch[1].trim()
        .replace(/\s+/g, ' ')  // Normalize spaces
        .replace(/([A-Za-z])/g, ' $1 ') // Add spaces around commands
        .trim();
    }

    const fillRuleMatch = pathElement.match(/\sfill-rule="([^"]+)"/);
    if (fillRuleMatch) path.fillRule = fillRuleMatch[1];

    const clipRuleMatch = pathElement.match(/\sclip-rule="([^"]+)"/);
    if (clipRuleMatch) path.clipRule = clipRuleMatch[1];

    const fillMatch = pathElement.match(/\sfill="([^"]+)"/);
    if (fillMatch && fillMatch[1] !== 'currentColor') {
      path.fill = fillMatch[1];
    }

    if (path.d) {
      paths.push(path);
    }
  }

  // If there's only one path with no special attributes, use simple d format
  if (paths.length === 1 && !paths[0].fillRule && !paths[0].clipRule && !paths[0].fill) {
    return {
      viewBox,
      d: paths[0].d
    };
  }

  // Otherwise use paths array format
  return {
    viewBox,
    paths
  };
}

function generateIconName(filePath: string): string {
  const baseName = path.basename(filePath, '.svg')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_'); // Replace multiple underscores with single
  
  // Extract size if present in filename
  const sizeMatch = baseName.match(/_(\d+)$/);
  const size = sizeMatch ? sizeMatch[1] : '24';
  
  return `${baseName}${sizeMatch ? '' : `_${size}`}`;
}

async function processIcon(svgPath: string, targetJsFile: string): Promise<void> {
  try {
    console.log(`Processing: ${svgPath}`);
    const svgContent = fs.readFileSync(svgPath, 'utf8');
    const iconData = extractSVGData(svgContent);
    const iconName = generateIconName(svgPath);

    if (!iconData.d && (!iconData.paths || iconData.paths.length === 0)) {
      console.error(`No valid paths found in ${path.basename(svgPath)}`);
      return;
    }

    // Read target JS file
    if (!fs.existsSync(targetJsFile)) {
      console.error(`Target JS file not found: ${targetJsFile}`);
      return;
    }

    const existingContent = fs.readFileSync(targetJsFile, 'utf8');
    const iconTypeMatch = path.basename(targetJsFile, '.js');
    
    // Extract existing icons
    const match = existingContent.match(/export const \w+Icons = ({[\s\S]+});/);
    if (!match) {
      console.error(`Invalid icon file format: ${targetJsFile}`);
      return;
    }

    let existingIcons: Record<string, IconData>;
    try {
      existingIcons = eval(`(${match[1]})`);
    } catch (error) {
      console.error(`Error parsing existing icons in ${targetJsFile}`);
      return;
    }

    // Add or update icon
    existingIcons[iconName] = iconData;

    // Generate new content with consistent formatting
    const newContent = `export const ${iconTypeMatch}Icons = {
${Object.entries(existingIcons)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([key, value]) => {
    if (value.d) {
      // Simple path format
      return `  ${key}: {
    viewBox: "${value.viewBox}",
    d: "${value.d}"
  }`;
    } else {
      // Multi-path format
      const pathsStr = value.paths!
        .map(path => {
          const attrs = [];
          if (path.d) attrs.push(`d: "${path.d}"`);
          if (path.fillRule) attrs.push(`fillRule: "${path.fillRule}"`);
          if (path.clipRule) attrs.push(`clipRule: "${path.clipRule}"`);
          if (path.fill) attrs.push(`fill: "${path.fill}"`);
          return `    {\n      ${attrs.join(',\n      ')}\n    }`;
        })
        .join(',\n');

      return `  ${key}: {
    viewBox: "${value.viewBox}",
    paths: [
${pathsStr}
    ]
  }`;
    }
  })
  .join(',\n\n')}
};
`;

    // Write updated content
    fs.writeFileSync(targetJsFile, newContent);
    console.log(`✓ ${iconName} added/updated in ${path.basename(targetJsFile)}`);

  } catch (error) {
    console.error(`Error processing ${svgPath}:`, error);
  }
}

async function processIconSet(config: IconConfig): Promise<void> {
  const { sourcePath, targetFile } = config;

  if (!fs.existsSync(sourcePath)) {
    console.error(`Source path not found: ${sourcePath}`);
    console.error('Make sure the path exists and contains SVG files');
    return;
  }

  if (!fs.existsSync(targetFile)) {
    console.error(`Target file not found: ${targetFile}`);
    console.error('Make sure the target JS file exists');
    return;
  }

  console.log(`\nProcessing icon set...`);
  console.log(`Target file: ${targetFile}`);
  console.log(`Source: ${sourcePath}\n`);

  if (fs.statSync(sourcePath).isDirectory()) {
    console.log(`Processing directory: ${sourcePath}`);
    const files = fs.readdirSync(sourcePath)
      .filter(file => file.toLowerCase().endsWith('.svg'));
    
    if (files.length === 0) {
      console.error('No SVG files found in directory');
      return;
    }

    console.log(`Found ${files.length} SVG files\n`);
    
    for (const file of files) {
      await processIcon(path.join(sourcePath, file), targetFile);
    }
  } else {
    await processIcon(sourcePath, targetFile);
  }
}

async function main() {
  console.log('\nStarting icon processing...');
  
  // Verify all paths before processing
  verifyPaths();

  for (const [name, config] of Object.entries(SOURCE_CONFIG)) {
    console.log(`\nProcessing ${name} icons...`);
    await processIconSet(config);
  }

  console.log('\nIcon processing complete!');
}

main().catch(console.error); 
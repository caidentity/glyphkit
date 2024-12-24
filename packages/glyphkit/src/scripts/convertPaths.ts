import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

/**
 * Convert Paths Script
 * ===================
 * 
 * This script converts all icon files to use a consistent path format.
 * It maintains backward compatibility with existing icon usage while
 * supporting both single and multi-path icons.
 * 
 * Usage:
 * npm run convert-paths
 * 
 * This will:
 * 1. Process all JS files in packages/glyphkit/icons/flat/Icons/
 * 2. Convert icons to use consistent path format
 * 3. Maintain backward compatibility
 * 4. Fix any broken icon paths
 * 
 * Icon Format:
 * - Single path without attributes: Uses simple 'd' property
 * - Multiple paths or with attributes: Uses 'paths' array
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PACKAGE_ROOT = path.resolve(__dirname, '..', '..');
const ICONS_DIR = path.join(PACKAGE_ROOT, 'icons', 'flat', 'Icons');

interface PathAttributes {
  d: string;
  fillRule?: string;
  clipRule?: string;
  fill?: string;
}

interface IconData {
  viewBox: string;
  d?: string;          // For single path icons
  paths?: PathAttributes[]; // For multi-path icons
}

interface IconSet {
  [key: string]: IconData;
}

function formatSVGPath(pathData: string): string {
  if (!pathData) return '';
  
  return pathData
    .split(/(?=[MLHVCSQTAZ])/i)
    .map(cmd => cmd.trim())
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function convertSinglePathToMulti(iconData: any): IconData {
  if (!iconData || !iconData.viewBox) {
    console.error('Invalid icon data:', iconData);
    return { viewBox: "0 0 24 24", d: "" };
  }

  // If it has a single 'd' property, keep it that way
  if (iconData.d && typeof iconData.d === 'string') {
    return {
      viewBox: iconData.viewBox,
      d: formatSVGPath(iconData.d)
    };
  }

  // If it already has valid paths array, keep it
  if (iconData.paths && Array.isArray(iconData.paths) && iconData.paths.length > 0) {
    return {
      viewBox: iconData.viewBox,
      paths: iconData.paths.map(path => ({
        ...path,
        d: formatSVGPath(path.d)
      }))
    };
  }

  // Convert legacy format if needed
  if (iconData.d || iconData.fillRule || iconData.clipRule || iconData.fill) {
    return {
      viewBox: iconData.viewBox,
      paths: [{
        d: formatSVGPath(iconData.d || ''),
        ...(iconData.fillRule && { fillRule: iconData.fillRule }),
        ...(iconData.clipRule && { clipRule: iconData.clipRule }),
        ...(iconData.fill && { fill: iconData.fill })
      }]
    };
  }

  // Default case
  return {
    viewBox: iconData.viewBox,
    d: ""
  };
}

function processIconFile(filePath: string): void {
  console.log(`\nProcessing file: ${filePath}`);
  
  try {
    // Create backup
    const backupPath = `${filePath}.backup`;
    fs.copyFileSync(filePath, backupPath);
    console.log('Created backup file');

    const content = fs.readFileSync(filePath, 'utf8');
    console.log('File read successfully');

    // Extract existing icons
    const match = content.match(/export const (\w+)Icons = ({[\s\S]+});/);
    if (!match) {
      console.log('Skipping - invalid icon file format');
      return;
    }

    const [, iconType, iconObject] = match;
    console.log(`Processing ${iconType} icons...`);

    let parsed;
    try {
      parsed = eval(`(${iconObject})`);
    } catch (error) {
      console.error('Error parsing icon data:', error);
      return;
    }

    console.log('Converting paths...');
    const formatted = Object.entries(parsed).reduce((acc, [key, value]) => {
      acc[key] = convertSinglePathToMulti(value);
      return acc;
    }, {} as IconSet);

    // Generate new content with consistent formatting
    const newContent = `export const ${iconType}Icons = {
${Object.entries(formatted)
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
    fs.writeFileSync(filePath, newContent);
    console.log(`✓ Successfully processed ${path.basename(filePath)}`);

    // Remove backup if successful
    fs.unlinkSync(backupPath);
    console.log('Removed backup file');

  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    // Restore from backup if it exists
    const backupPath = `${filePath}.backup`;
    if (fs.existsSync(backupPath)) {
      fs.copyFileSync(backupPath, filePath);
      fs.unlinkSync(backupPath);
      console.log('Restored from backup');
    }
  }
}

function processDirectory(dirPath: string): void {
  console.log('\nStarting path conversion...');
  console.log('Looking in directory:', dirPath);

  if (!fs.existsSync(dirPath)) {
    console.error(`Directory not found: ${dirPath}`);
    console.log('Current working directory:', process.cwd());
    process.exit(1);
  }

  const files = fs.readdirSync(dirPath)
    .filter(file => file.endsWith('.js'));

  console.log(`Found ${files.length} JS files`);

  if (files.length === 0) {
    console.error('No JS files found to process');
    process.exit(1);
  }

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    processIconFile(fullPath);
  });

  console.log('\nPath conversion complete!');
}

processDirectory(ICONS_DIR); 
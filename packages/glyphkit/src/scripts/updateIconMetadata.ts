import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface IconPath {
  d: string;
  fill?: string;
  fillRule?: string;
  clipRule?: string;
}

interface IconDefinition {
  viewBox: string;
  paths: IconPath[];
  category?: string;
  tags?: string[];
}

interface IconSet {
  [key: string]: IconDefinition;
}

const ICONS_DIR = path.resolve(__dirname, '../../icons/flat/Icons');
const TARGET_FILES = ['brand.js', 'location.js'];

function processIconFile(filePath: string): void {
  const fileName = path.basename(filePath, '.js');
  const category = fileName;
  
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Parse the existing export
  const iconSetMatch = content.match(/export const (\w+)\s*=\s*({[\s\S]+});/);
  if (!iconSetMatch) {
    console.warn(`Could not parse file: ${filePath}`);
    return;
  }
  
  const [, exportName, iconSetString] = iconSetMatch;
  
  try {
    // Safely evaluate the icon set object
    const iconSet = JSON.parse(iconSetString.replace(/([{,]\s*)(\w+):/g, '$1"$2":')) as IconSet;
    
    // Add category and tags to each icon
    const updatedIconSet: IconSet = {};
    
    for (const [iconName, icon] of Object.entries(iconSet)) {
      // Generate tags from icon name (e.g., "brand_github_16" -> ["brand", "github"])
      const nameParts = iconName.split('_');
      const tags = nameParts.filter(tag => 
        tag !== '16' && tag !== '24'
      );
      
      updatedIconSet[iconName] = {
        ...icon,
        category,
        tags: [category, ...tags]
      };
    }
    
    // Generate the new file content with proper formatting
    const newContent = `export const ${exportName} = ${JSON.stringify(updatedIconSet, null, 2)};`;
    
    // Write back to file
    fs.writeFileSync(filePath, newContent);
    
    console.log(`Updated ${fileName} with categories and tags`);
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
}

// Process each target file
TARGET_FILES.forEach(file => {
  const filePath = path.join(ICONS_DIR, file);
  if (fs.existsSync(filePath)) {
    processIconFile(filePath);
  } else {
    console.warn(`File not found: ${file}`);
  }
});
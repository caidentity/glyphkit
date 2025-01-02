const fs = require('fs');
const path = require('path');

interface IconPath {
  d: string;
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

const ICONS_DIR = path.resolve(__dirname, '../icons/flat/Icons');

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
    const iconSet = eval(`(${iconSetString})`) as IconSet;
    
    // Add category and tags to each icon
    const updatedIconSet: IconSet = {};
    
    for (const [iconName, icon] of Object.entries(iconSet)) {
      // Generate base tags from icon name
      const nameTags = iconName.split('_').filter(tag => 
        tag !== '16' && tag !== '24'
      );
      
      updatedIconSet[iconName] = {
        ...icon,
        category,
        tags: [category, ...nameTags]
      };
    }
    
    // Generate the new file content
    const newContent = `export const ${exportName} = ${JSON.stringify(updatedIconSet, null, 2)};`;
    
    // Write back to file
    fs.writeFileSync(filePath, newContent);
    
    console.log(`Updated ${fileName} with categories and tags`);
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
}

// Process all icon files
try {
  const files = fs.readdirSync(ICONS_DIR)
    .filter((file: string) => file.endsWith('.js'));

  files.forEach((file: string) => {
    processIconFile(path.join(ICONS_DIR, file));
  });
} catch (error) {
  console.error('Error reading icons directory:', error);
} 
import * as fs from 'fs/promises';
import * as path from 'path';

interface IconRegistry {
  icons: {
    [key: string]: {
      category: string;
      name: string;
    };
  };
  categories: {
    [key: string]: {
      icons: string[];
      count: number;
    };
  };
  metadata: {
    totalIcons: number;
    totalCategories: number;
    generatedAt: string;
  };
}

async function generateIconRegistry() {
  // Handle different build environments
  const repoRoot = process.env.VERCEL 
    ? process.cwd()
    : path.resolve(__dirname, '../../../');
    
  const iconsDir = path.join(repoRoot, 'packages/glyphkit/icons/flat/Icons');
  const outputDir = path.join(repoRoot, 'site/src/lib');
  
  console.log('Build environment:', {
    isVercel: !!process.env.VERCEL,
    nodeEnv: process.env.NODE_ENV,
    cwd: process.cwd(),
    iconsDir,
    outputDir
  });
  
  await fs.mkdir(outputDir, { recursive: true });

  const iconFiles = await fs.readdir(iconsDir);
  const registry: IconRegistry = {
    icons: {},
    categories: {},
    metadata: {
      totalIcons: 0,
      totalCategories: 0,
      generatedAt: new Date().toISOString()
    }
  };
  
  for (const file of iconFiles) {
    if (file.endsWith('.js')) {
      const categoryName = path.basename(file, '.js');
      const filePath = path.join(iconsDir, file);
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        const match = content.match(/export const \w+Icons = ({[\s\S]+?});/);
        if (!match) continue;
        
        const categoryIcons = Function(`return ${match[1]}`)();
        const iconNames = Object.keys(categoryIcons);

        // Initialize category
        registry.categories[categoryName] = {
          icons: iconNames,
          count: iconNames.length
        };

        // Add each icon to the registry
        iconNames.forEach(iconName => {
          registry.icons[iconName] = {
            category: categoryName,
            name: iconName
          };
        });

        console.log(`Processed ${categoryName}: found ${iconNames.length} icons`);
      } catch (error) {
        console.error(`Failed to process ${file}:`, error);
      }
    }
  }

  // Update metadata
  registry.metadata.totalIcons = Object.keys(registry.icons).length;
  registry.metadata.totalCategories = Object.keys(registry.categories).length;

  // Write the full registry
  const registryPath = path.join(outputDir, 'iconRegistry.json');
  await fs.writeFile(
    registryPath,
    JSON.stringify(registry, null, 2),
    'utf-8'
  );

  // Write individual files for easier imports
  await Promise.all([
    // Icons only
    fs.writeFile(
      path.join(outputDir, 'icons.json'),
      JSON.stringify(registry.icons, null, 2),
      'utf-8'
    ),
    // Categories only
    fs.writeFile(
      path.join(outputDir, 'categories.json'),
      JSON.stringify(registry.categories, null, 2),
      'utf-8'
    )
  ]);

  console.log(`Generated icon registry with:
- ${registry.metadata.totalIcons} icons
- ${registry.metadata.totalCategories} categories
Output written to:
- ${registryPath}
- ${path.join(outputDir, 'icons.json')}
- ${path.join(outputDir, 'categories.json')}`);
}

generateIconRegistry().catch(error => {
  console.error('Failed to generate icon registry:', error);
  process.exit(1);
}); 
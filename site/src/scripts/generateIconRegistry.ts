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
  // Simplified path resolution
  const iconsDir = process.env.VERCEL 
    ? path.join(process.cwd(), 'public/icons')
    : path.resolve(__dirname, '../../../public/icons');
    
  const outputDir = path.join(process.cwd(), 'src/lib');
  
  console.log('Build environment:', {
    isVercel: !!process.env.VERCEL,
    nodeEnv: process.env.NODE_ENV,
    cwd: process.cwd(),
    iconsDir,
    outputDir
  });

  // Create output directory if it doesn't exist
  await fs.mkdir(outputDir, { recursive: true });

  try {
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

    // Process each icon file
    for (const file of iconFiles) {
      if (file.endsWith('.svg')) {
        const categoryName = path.basename(path.dirname(file));
        const iconName = path.basename(file, '.svg');
        
        // Initialize category if it doesn't exist
        if (!registry.categories[categoryName]) {
          registry.categories[categoryName] = {
            icons: [],
            count: 0
          };
        }

        // Add icon to registry
        registry.icons[iconName] = {
          category: categoryName,
          name: iconName
        };

        // Add to category
        registry.categories[categoryName].icons.push(iconName);
        registry.categories[categoryName].count++;
      }
    }

    // Update metadata
    registry.metadata.totalIcons = Object.keys(registry.icons).length;
    registry.metadata.totalCategories = Object.keys(registry.categories).length;

    // Write registry files
    await Promise.all([
      fs.writeFile(
        path.join(outputDir, 'iconRegistry.json'),
        JSON.stringify(registry, null, 2),
        'utf-8'
      ),
      fs.writeFile(
        path.join(outputDir, 'icons.json'),
        JSON.stringify(registry.icons, null, 2),
        'utf-8'
      ),
      fs.writeFile(
        path.join(outputDir, 'categories.json'),
        JSON.stringify(registry.categories, null, 2),
        'utf-8'
      )
    ]);

    console.log(`Generated icon registry with:
- ${registry.metadata.totalIcons} icons
- ${registry.metadata.totalCategories} categories`);

  } catch (error) {
    console.error('Failed to generate icon registry:', error);
    throw error;
  }
}

generateIconRegistry().catch(error => {
  console.error('Failed to generate icon registry:', error);
  process.exit(1);
}); 
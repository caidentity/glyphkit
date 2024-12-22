import * as fs from 'fs/promises';
import * as path from 'path';
import { brandIcons } from '../../../packages/glyphkit/icons/flat/Icons/brand';
import { systemIcons } from '../../../packages/glyphkit/icons/flat/Icons/system';
import { peopleIcons } from '../../../packages/glyphkit/icons/flat/Icons/people';
import { arrowsIcons } from '../../../packages/glyphkit/icons/flat/Icons/arrows';
import { objectsIcons } from '../../../packages/glyphkit/icons/flat/Icons/objects';
import { communicationIcons } from '../../../packages/glyphkit/icons/flat/Icons/communication';
import { controlsIcons } from '../../../packages/glyphkit/icons/flat/Icons/controls';
import { dataIcons } from '../../../packages/glyphkit/icons/flat/Icons/data';
import { filesIcons } from '../../../packages/glyphkit/icons/flat/Icons/files';
import { locationIcons } from '../../../packages/glyphkit/icons/flat/Icons/location';
import { mediaIcons } from '../../../packages/glyphkit/icons/flat/Icons/media';
import { messageIcons } from '../../../packages/glyphkit/icons/flat/Icons/message';
import { moneyIcons } from '../../../packages/glyphkit/icons/flat/Icons/money';
import { natureIcons } from '../../../packages/glyphkit/icons/flat/Icons/nature';
import { shapesIcons } from '../../../packages/glyphkit/icons/flat/Icons/shapes';
import { textIcons } from '../../../packages/glyphkit/icons/flat/Icons/text';
import { timeIcons } from '../../../packages/glyphkit/icons/flat/Icons/time';
import { uiIcons } from '../../../packages/glyphkit/icons/flat/Icons/ui';
import { viewIcons } from '../../../packages/glyphkit/icons/flat/Icons/view';

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

const ICON_SETS = {
  arrows: arrowsIcons,
  brand: brandIcons,
  communication: communicationIcons,
  controls: controlsIcons,
  data: dataIcons,
  files: filesIcons,
  location: locationIcons,
  media: mediaIcons,
  message: messageIcons,
  money: moneyIcons,
  nature: natureIcons,
  objects: objectsIcons,
  people: peopleIcons,
  shapes: shapesIcons,
  system: systemIcons,
  text: textIcons,
  time: timeIcons,
  ui: uiIcons,
  view: viewIcons
};

async function generateIconRegistry() {
  const outputDir = path.join(process.cwd(), 'src/lib');
  
  console.log('Generating icon registry:');
  console.log('- Output:', outputDir);

  try {
    // Create output directory
    await fs.mkdir(outputDir, { recursive: true });

    // Generate registry from all icon sets
    const registry: IconRegistry = {
      icons: {},
      categories: {},
      metadata: {
        totalIcons: 0,
        totalCategories: Object.keys(ICON_SETS).length,
        generatedAt: new Date().toISOString()
      }
    };

    // Initialize categories
    Object.keys(ICON_SETS).forEach(category => {
      registry.categories[category] = {
        icons: [],
        count: 0
      };
    });

    // Process all icon sets
    for (const [category, iconSet] of Object.entries(ICON_SETS)) {
      for (const [iconName, iconData] of Object.entries(iconSet)) {
        registry.icons[iconName] = {
          category,
          name: iconName
        };
        registry.categories[category].icons.push(iconName);
        registry.categories[category].count++;
      }
    }

    registry.metadata.totalIcons = Object.keys(registry.icons).length;

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
  console.error('Error:', error);
  process.exit(1);
}); 
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

interface PathAttributes {
  d: string;
  fillRule?: 'nonzero' | 'evenodd' | 'inherit';
  clipRule?: 'nonzero' | 'evenodd' | 'inherit';
  fill?: string;
}

interface IconDefinition {
  viewBox: string;
  paths: PathAttributes[];
  category?: string;
  tags?: string[];
}

interface IconRegistry {
  icons: {
    [key: string]: {
      category: string;
      name: string;
      viewBox: string;
      paths: PathAttributes[];
      tags: string[];
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
  const srcLibDir = path.join(process.cwd(), 'src/lib');
  const publicDir = path.join(process.cwd(), 'public');
  
  console.log('Generating icon registry...');

  try {
    await fs.mkdir(srcLibDir, { recursive: true });
    await fs.mkdir(path.join(publicDir, 'icons'), { recursive: true });

    const registry: IconRegistry = {
      icons: {},
      categories: {},
      metadata: {
        totalIcons: 0,
        totalCategories: 0,
        generatedAt: new Date().toISOString()
      }
    };

    const uniqueCategories = new Set<string>();

    // Process all icon sets
    for (const [fileCategory, iconSet] of Object.entries(ICON_SETS)) {
      for (const [iconKey, iconDefinition] of Object.entries(iconSet)) {
        const iconDef = iconDefinition as IconDefinition;
        
        // Get category from icon or fallback to file category
        const category = iconDef.category || fileCategory;
        
        // Get tags from name
        const nameTags = iconKey.split('_').filter(tag => 
          tag !== '16' && tag !== '24'
        );

        // Initialize category if needed
        if (!registry.categories[category]) {
          registry.categories[category] = {
            icons: [],
            count: 0
          };
        }

        uniqueCategories.add(category);

        // Combine all tags, avoiding Set spread operator
        const allTags = Array.from(new Set([
          category,
          ...(iconDef.tags || []),
          ...nameTags
        ]));

        // Add icon to registry
        registry.icons[iconKey] = {
          category,
          name: iconKey,
          viewBox: iconDef.viewBox,
          paths: iconDef.paths.map(path => ({
            d: path.d,
            fillRule: path.fillRule || 'nonzero',
            clipRule: path.clipRule,
            fill: path.fill !== '#000000' ? path.fill : undefined
          })),
          tags: allTags
        };

        registry.categories[category].icons.push(iconKey);
        registry.categories[category].count++;
      }
    }

    registry.metadata.totalIcons = Object.keys(registry.icons).length;
    registry.metadata.totalCategories = uniqueCategories.size;

    // Write files
    await Promise.all([
      fs.writeFile(
        path.join(srcLibDir, 'iconRegistry.json'),
        JSON.stringify(registry, null, 2),
        'utf-8'
      ),
      fs.writeFile(
        path.join(publicDir, 'icon-metadata.json'),
        JSON.stringify(registry, null, 2),
        'utf-8'
      ),
      fs.writeFile(
        path.join(publicDir, 'icons/metadata.json'),
        JSON.stringify(registry, null, 2),
        'utf-8'
      )
    ]);

    console.log(`✓ Generated icon registry with ${registry.metadata.totalIcons} icons in ${registry.metadata.totalCategories} categories`);
  } catch (error) {
    console.error('Failed to generate icon registry:', error);
    throw error;
  }
}

generateIconRegistry().catch(error => {
  console.error('Error:', error);
  process.exit(1);
}); 
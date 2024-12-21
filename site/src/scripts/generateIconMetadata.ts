import { promises as fs } from 'fs'
import * as path from 'path'
import type { IconMetadata, IconCategory, IconsMetadata, IconSize } from '@/types/icon'
import { ICONS_CONFIG } from '@/constants/icons'

async function ensureDirectory(dir: string): Promise<void> {
  try {
    await fs.access(dir)
  } catch {
    await fs.mkdir(dir, { recursive: true })
  }
}

function getIconSize(filename: string): IconSize {
  return filename.includes('-small') 
    ? ICONS_CONFIG.SMALL_SIZE 
    : ICONS_CONFIG.DEFAULT_SIZE
}

function createIconMetadata(
  filename: string, 
  category: string, 
  filepath: string
): IconMetadata {
  const name = path.basename(filename, '.svg')
    .replace(ICONS_CONFIG.SMALL_SUFFIX, '')
  
  return {
    name,
    category,
    path: path.posix.join(
      ICONS_CONFIG.BASE_DIR,
      category,
      filename
    ),
    size: getIconSize(filename)
  }
}

async function scanDirectory(dir: string, category: string): Promise<IconMetadata[]> {
  const files = await fs.readdir(dir)
  const icons: IconMetadata[] = []

  for (const file of files) {
    const filepath = path.join(dir, file)
    const stat = await fs.stat(filepath)

    if (stat.isDirectory()) {
      const subIcons = await scanDirectory(filepath, file)
      icons.push(...subIcons)
    } else if (file.endsWith('.svg')) {
      icons.push(createIconMetadata(file, category, filepath))
    }
  }

  return icons
}

async function generateMetadata(): Promise<void> {
  try {
    // Source directory is now relative to the build environment
    const sourceIconsDir = process.env.NODE_ENV === 'production'
      ? path.join(process.cwd(), 'public', 'icons')
      : path.join(process.cwd(), '..', 'public', 'icons');
    
    console.log('Reading icons from:', sourceIconsDir);
    
    // Ensure the public directory exists
    await fs.mkdir(path.join(process.cwd(), 'public'), { recursive: true });

    const items = await fs.readdir(sourceIconsDir);
    console.log('Found items in directory:', items);
    
    const categories = await Promise.all(
      items.map(async item => {
        const itemPath = path.join(sourceIconsDir, item)
        console.log('Checking item:', item, 'at path:', itemPath)
        return (await fs.stat(itemPath)).isDirectory() ? item : null
      })
    ).then(dirs => dirs.filter((dir): dir is string => dir !== null))

    console.log('Found categories:', categories)

    if (categories.length === 0) {
      const emptyMetadata: IconsMetadata = { categories: [] }
      const metadataPath = path.join(process.cwd(), 'public', 'icon-metadata.json')
      await fs.writeFile(metadataPath, JSON.stringify(emptyMetadata, null, 2))
      console.log('✓ Created empty metadata file - no icon directories found')
      return
    }

    const categoriesData = await Promise.all(
      categories.map(async category => ({
        name: category,
        icons: await scanDirectory(path.join(sourceIconsDir, category), category)
      }))
    )

    // Sort categories and icons
    categoriesData.sort((a, b) => a.name.localeCompare(b.name))
    categoriesData.forEach(cat => {
      cat.icons.sort((a, b) => a.name.localeCompare(b.name))
    })

    const metadata: IconsMetadata = { categories: categoriesData }
    
    // Calculate total icons
    const totalIcons = categoriesData.reduce((sum, cat) => sum + cat.icons.length, 0);
    
    // Write metadata to the site's public directory
    const metadataPath = path.join(process.cwd(), 'public', 'icon-metadata.json');
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));

    console.log(`✓ Generated metadata for ${totalIcons} icons in ${categories.length} categories`);
    console.log('Metadata written to:', metadataPath);
  } catch (error) {
    console.error('Error generating metadata:', error);
    // Create empty metadata file in case of error
    const metadataPath = path.join(process.cwd(), 'public', 'icon-metadata.json');
    await fs.writeFile(metadataPath, JSON.stringify({ categories: [] }, null, 2));
    throw error;
  }
}

// Run in both development and production
generateMetadata().catch(error => {
  console.error('Failed to generate metadata:', error);
  process.exit(1);
}); 
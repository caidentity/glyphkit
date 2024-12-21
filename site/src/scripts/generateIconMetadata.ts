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

async function writeMetadata(metadata: IconsMetadata): Promise<void> {
  const metadataPath = path.join(process.cwd(), '..', 'public', 'icons', 'metadata.json');
  console.log('Writing metadata to:', metadataPath);
  await fs.writeFile(
    metadataPath,
    JSON.stringify(metadata, null, 2)
  )
  console.log('Metadata written successfully');
}

async function generateMetadata(): Promise<void> {
  try {
    // Source icons directory (in root/public/icons)
    const sourceIconsDir = path.join(process.cwd(), '..', 'public', 'icons')
    console.log('Source icons directory:', sourceIconsDir)

    // Destination directory (in site/public/icons)
    const destIconsDir = path.join(process.cwd(), 'public', 'icons')
    console.log('Destination icons directory:', destIconsDir)

    // Ensure destination directory exists
    await ensureDirectory(destIconsDir)

    // Copy icons from source to destination
    console.log('Copying icons from source to destination...')
    await fs.cp(sourceIconsDir, destIconsDir, { recursive: true })
    console.log('Icons copied successfully')

    const items = await fs.readdir(destIconsDir)
    console.log('Found items in directory:', items)
    
    const categories = await Promise.all(
      items.map(async item => {
        const itemPath = path.join(destIconsDir, item)
        console.log('Checking item:', item, 'at path:', itemPath)
        return (await fs.stat(itemPath)).isDirectory() ? item : null
      })
    ).then(dirs => dirs.filter((dir): dir is string => dir !== null))

    console.log('Found categories:', categories)

    if (categories.length === 0) {
      const emptyMetadata: IconsMetadata = { categories: [] }
      await writeMetadata(emptyMetadata)
      console.log('✓ Created empty metadata file - no icon directories found')
      return
    }

    const categoriesData = await Promise.all(
      categories.map(async category => ({
        name: category,
        icons: await scanDirectory(path.join(destIconsDir, category), category)
      }))
    )

    // Sort categories and icons
    categoriesData.sort((a, b) => a.name.localeCompare(b.name))
    categoriesData.forEach(cat => {
      cat.icons.sort((a, b) => a.name.localeCompare(b.name))
    })

    const metadata: IconsMetadata = { categories: categoriesData }
    // Write metadata to the site's public directory
    const metadataPath = path.join(process.cwd(), 'public', 'icon-metadata.json')
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2))

    const totalIcons = categoriesData.reduce((sum, cat) => sum + cat.icons.length, 0)
    console.log(`✓ Generated metadata for ${totalIcons} icons in ${categories.length} categories`)
  } catch (error) {
    console.error('Error generating metadata:', error)
    throw error
  }
}

// Only run in development or during build
if (process.env.NODE_ENV !== 'production') {
  generateMetadata().catch(console.error)
} 
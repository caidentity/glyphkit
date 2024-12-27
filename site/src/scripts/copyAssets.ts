import fs from 'fs-extra'
import path from 'path'

const ASSETS_SOURCE = path.join(process.cwd(), 'src/assets')
const PUBLIC_DIR = path.join(process.cwd(), 'public')

interface AssetMapping {
  from: string
  to: string
  files: string[]
}

const ASSET_MAPPINGS: AssetMapping[] = [
  {
    from: 'Logo/favicon',
    to: '.',
    files: [
      'favicon.ico',
      'apple-touch-icon.png'
    ]
  },
  {
    from: 'root',
    to: '.',
    files: [
      'site.webmanifest'
    ]
  },
  {
    from: 'social',
    to: 'assets/social',
    files: [
      'og-image.png'
    ]
  },
  {
    from: 'Logo',
    to: 'assets/Logo',
    files: [
      'logo.svg'
    ]
  },
  {
    from: 'home',
    to: 'assets/home',
    files: [
      'icons.svg'
    ]
  }
]

async function findFileIgnoreCase(dirPath: string, fileName: string): Promise<string | null> {
  try {
    const files = await fs.readdir(dirPath)
    const match = files.find(file => file.toLowerCase() === fileName.toLowerCase())
    return match ? path.join(dirPath, match) : null
  } catch {
    return null
  }
}

async function copyAssets() {
  try {
    // Verify source directories exist
    const sourceHomeDir = path.join(ASSETS_SOURCE, 'home')
    if (!await fs.pathExists(sourceHomeDir)) {
      console.warn(`Creating source home directory: ${sourceHomeDir}`)
      await fs.ensureDir(sourceHomeDir)
    }

    // Ensure target directories exist
    await fs.ensureDir(path.join(PUBLIC_DIR, 'assets/social'))
    await fs.ensureDir(path.join(PUBLIC_DIR, 'assets/Logo'))
    await fs.ensureDir(path.join(PUBLIC_DIR, 'assets/home'))

    // Copy assets according to mappings
    for (const mapping of ASSET_MAPPINGS) {
      const sourceDir = path.join(ASSETS_SOURCE, mapping.from)
      const targetDir = path.join(PUBLIC_DIR, mapping.to)

      // Add debug logging
      console.log(`Checking directory: ${sourceDir}`)
      const exists = await fs.pathExists(sourceDir)
      console.log(`Directory exists: ${exists}`)

      if (!exists) {
        console.warn(`Warning: Source directory not found: ${sourceDir}`)
        continue
      }

      // List files in directory
      const files = await fs.readdir(sourceDir)
      console.log(`Files in directory: ${files.join(', ')}`)

      // Copy each specified file
      for (const file of mapping.files) {
        const sourceDir = path.join(ASSETS_SOURCE, mapping.from)
        const targetDir = path.join(PUBLIC_DIR, mapping.to)
        
        const sourcePath = await findFileIgnoreCase(sourceDir, file)
        const targetPath = path.join(targetDir, file)

        if (sourcePath) {
          await fs.copy(sourcePath, targetPath, { overwrite: true })
          console.log(`✓ Copied ${file} to ${targetPath}`)
        } else {
          console.warn(`Warning: Source file not found: ${path.join(sourceDir, file)}`)
        }
      }
    }

    console.log('✓ Assets copied successfully')
  } catch (error) {
    console.error('Failed to copy assets:', error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  copyAssets()
}

export default copyAssets 
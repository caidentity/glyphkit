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
  }
]

async function copyAssets() {
  try {
    // Ensure target directories exist
    await fs.ensureDir(path.join(PUBLIC_DIR, 'assets/social'))
    await fs.ensureDir(path.join(PUBLIC_DIR, 'assets/Logo'))

    // Copy assets according to mappings
    for (const mapping of ASSET_MAPPINGS) {
      const sourceDir = path.join(ASSETS_SOURCE, mapping.from)
      const targetDir = path.join(PUBLIC_DIR, mapping.to)

      console.log(`Copying from ${sourceDir} to ${targetDir}`)

      // Ensure source directory exists
      if (!await fs.pathExists(sourceDir)) {
        console.warn(`Warning: Source directory not found: ${sourceDir}`)
        continue
      }

      // Copy each specified file
      for (const file of mapping.files) {
        const sourcePath = path.join(sourceDir, file)
        const targetPath = path.join(targetDir, file)

        if (await fs.pathExists(sourcePath)) {
          await fs.copy(sourcePath, targetPath, { overwrite: true })
          console.log(`✓ Copied ${file} to ${targetPath}`)
        } else {
          console.warn(`Warning: Source file not found: ${sourcePath}`)
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
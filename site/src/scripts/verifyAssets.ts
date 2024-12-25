import fs from 'fs-extra'
import path from 'path'

const ASSETS_SOURCE = path.join(process.cwd(), 'src/assets')
const PUBLIC_DIR = path.join(process.cwd(), 'public')

const requiredAssets = {
  root: [
    'favicon.ico',
    'apple-touch-icon.png',
    'site.webmanifest'
  ],
  social: [
    'og-Image.png'
  ]
}

async function fileExistsIgnoreCase(dirPath: string, fileName: string): Promise<boolean> {
  try {
    const files = await fs.readdir(dirPath)
    return files.some(file => file.toLowerCase() === fileName.toLowerCase())
  } catch {
    return false
  }
}

async function verifyAssets() {
  // Verify root assets
  for (const file of requiredAssets.root) {
    const dirPath = PUBLIC_DIR
    if (!await fileExistsIgnoreCase(dirPath, file)) {
      throw new Error(`Missing required root asset: ${file}`)
    }
  }

  // Verify social assets
  for (const file of requiredAssets.social) {
    const dirPath = path.join(PUBLIC_DIR, 'assets/social')
    if (!await fileExistsIgnoreCase(dirPath, file)) {
      throw new Error(`Missing required social asset: ${file}`)
    }
  }
  
  console.log('✓ All assets verified')
}

async function ensureDirectories() {
  // Ensure public directories exist
  await fs.ensureDir(path.join(PUBLIC_DIR, 'assets/social'))
}

// Run verification
ensureDirectories()
  .then(verifyAssets)
  .catch((error) => {
    console.error('Asset verification failed:', error)
    process.exit(1)
  }) 
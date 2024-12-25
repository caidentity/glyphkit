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
    'og-image.png'
  ]
}

async function verifyAssets() {
  // Verify root assets
  for (const file of requiredAssets.root) {
    const filePath = path.join(PUBLIC_DIR, file)
    if (!await fs.pathExists(filePath)) {
      throw new Error(`Missing required root asset: ${file}`)
    }
  }

  // Verify social assets
  for (const file of requiredAssets.social) {
    const filePath = path.join(PUBLIC_DIR, 'assets/social', file)
    if (!await fs.pathExists(filePath)) {
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
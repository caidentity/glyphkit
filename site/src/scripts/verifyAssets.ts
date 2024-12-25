import fs from 'fs-extra'
import path from 'path'

const PUBLIC_DIR = path.join(process.cwd(), 'public')

const requiredAssets = {
  root: [
    'favicon.ico',
    'apple-touch-icon.png',
    'site.webmanifest',
    'icon-metadata.json'
  ],
  social: [
    'og-image.png'
  ]
}

async function verifyAssets() {
  // Verify root assets
  for (const file of requiredAssets.root) {
    if (!await fs.pathExists(path.join(PUBLIC_DIR, file))) {
      throw new Error(`Missing required root asset: ${file}`)
    }
  }

  // Verify social assets
  const socialDir = path.join(PUBLIC_DIR, 'assets/social')
  for (const file of requiredAssets.social) {
    if (!await fs.pathExists(path.join(socialDir, file))) {
      throw new Error(`Missing required social asset: ${file}`)
    }
  }
  
  console.log('✓ All assets verified')
}

// Ensure directories exist before verification
fs.ensureDir(path.join(PUBLIC_DIR, 'assets/social'))
  .then(verifyAssets)
  .catch((error) => {
    console.error('Asset verification failed:', error)
    process.exit(1)
  }) 
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
    'og-Image.png'
  ],
  registry: [
    'registry/iconRegistry.json',
    'registry/icons.json',
    'registry/categories.json'
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
  for (const file of requiredAssets.social) {
    if (!await fs.pathExists(path.join(PUBLIC_DIR, 'assets/social', file))) {
      throw new Error(`Missing required social asset: ${file}`)
    }
  }

  // Verify registry files
  for (const file of requiredAssets.registry) {
    if (!await fs.pathExists(path.join(PUBLIC_DIR, file))) {
      throw new Error(`Missing required registry file: ${file}`)
    }
  }
  
  console.log('✓ All assets verified')
}

// Ensure directories exist before verification
async function ensureDirectories() {
  await Promise.all([
    fs.ensureDir(path.join(PUBLIC_DIR, 'assets/social')),
    fs.ensureDir(path.join(PUBLIC_DIR, 'registry')),
    fs.ensureDir(path.join(PUBLIC_DIR, 'icons'))
  ])
}

// Run verification
ensureDirectories()
  .then(verifyAssets)
  .catch((error) => {
    console.error('Asset verification failed:', error)
    process.exit(1)
  }) 
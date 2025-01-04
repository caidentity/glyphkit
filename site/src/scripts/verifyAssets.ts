import fs from 'fs-extra'
import path from 'path'

const PUBLIC_DIR = path.join(process.cwd(), 'public')

const REQUIRED_FILES = {
  root: [
    'favicon.ico',
    'apple-touch-icon.png',
    'site.webmanifest'
  ],
  assets: {
    social: ['og-image.png'],
    Logo: ['logo.svg']
  }
}

async function verifyAssets() {
  try {
    // Verify root files
    for (const file of REQUIRED_FILES.root) {
      const filePath = path.join(PUBLIC_DIR, file)
      if (!await fs.pathExists(filePath)) {
        throw new Error(`Missing required root asset: ${file}`)
      }
    }

    // Verify assets in subdirectories
    for (const [dir, files] of Object.entries(REQUIRED_FILES.assets)) {
      for (const file of files) {
        const filePath = path.join(PUBLIC_DIR, 'assets', dir, file)
        if (!await fs.pathExists(filePath)) {
          throw new Error(`Missing required asset: assets/${dir}/${file}`)
        }
      }
    }

    console.log('✓ All required assets verified')
    return true
  } catch (error) {
    console.error('Asset verification failed:', error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  verifyAssets()
}

export default verifyAssets 
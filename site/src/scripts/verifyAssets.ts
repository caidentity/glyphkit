import fs from 'fs-extra'
import path from 'path'
import { createReadStream } from 'fs'
import { promisify } from 'util'
import { exec } from 'child_process'

const execAsync = promisify(exec)

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

async function verifyImageDimensions(imagePath: string, expectedWidth: number, expectedHeight: number) {
  try {
    // Using ImageMagick's identify command if available
    const { stdout } = await execAsync(`identify -format "%wx%h" "${imagePath}"`)
    const [width, height] = stdout.split('x').map(Number)
    
    if (width !== expectedWidth || height !== expectedHeight) {
      console.warn(`Warning: ${path.basename(imagePath)} dimensions are ${width}x${height}, expected ${expectedWidth}x${expectedHeight}`)
    }
  } catch {
    // Silently fail if ImageMagick is not available
  }
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
  
  // Verify social image dimensions
  const ogImagePath = path.join(PUBLIC_DIR, 'assets/social', 'og-image.png')
  if (await fs.pathExists(ogImagePath)) {
    await verifyImageDimensions(ogImagePath, 1200, 630)
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
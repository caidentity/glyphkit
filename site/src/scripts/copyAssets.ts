import fs from 'fs-extra'
import path from 'path'

const ASSETS_SOURCE = path.join(process.cwd(), 'src/assets')
const PUBLIC_DIR = path.join(process.cwd(), 'public')

async function copyAssets() {
  try {
    // Special handling for root files from Logo/favicon
    const faviconDir = path.join(ASSETS_SOURCE, 'Logo/favicon')
    if (await fs.pathExists(faviconDir)) {
      const rootFiles = ['favicon.ico', 'apple-touch-icon.png', 'site.webmanifest']
      for (const file of rootFiles) {
        const src = path.join(faviconDir, file)
        const dest = path.join(PUBLIC_DIR, file)
        if (await fs.pathExists(src)) {
          await fs.copy(src, dest)
          console.log(`✓ Copied root file: ${file}`)
        }
      }
    }

    // Copy remaining assets to public/assets
    await fs.copy(ASSETS_SOURCE, path.join(PUBLIC_DIR, 'assets'), {
      overwrite: true,
      errorOnExist: false,
      filter: (src) => {
        // Skip source/temp files and favicon directory
        return !src.includes('_source') && 
               !src.includes('.ai') && 
               !src.includes('Logo/favicon')
      }
    })
    
    console.log('✓ Assets copied successfully')
  } catch (error) {
    console.error('Failed to copy assets:', error)
    process.exit(1)
  }
}

export default copyAssets

// Run if called directly
if (require.main === module) {
  copyAssets()
} 
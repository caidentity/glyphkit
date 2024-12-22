import fs from 'fs-extra'
import path from 'path'

const SOURCE_DIR = path.join(process.cwd(), 'src/assets')
const TARGET_DIR = path.join(process.cwd(), 'public/assets')

async function copyAssets() {
  try {
    // Ensure source Logo directory exists
    const logoSourceDir = path.join(SOURCE_DIR, 'Logo')
    if (!await fs.pathExists(logoSourceDir)) {
      console.error('❌ Source Logo directory not found at:', logoSourceDir)
      console.log('Creating Logo directory and default logo...')
      
      // Create the directory
      await fs.ensureDir(logoSourceDir)
      
      // Create a default logo if none exists
      const defaultLogo = `<svg width="120" height="32" viewBox="0 0 120 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="10" y="24" font-family="Arial" font-size="24" fill="currentColor">Glyphkit</text>
      </svg>`
      
      await fs.writeFile(path.join(logoSourceDir, 'logo.svg'), defaultLogo)
    }

    // Ensure target directory exists
    await fs.ensureDir(TARGET_DIR)
    
    // Log the source and target directories
    console.log('Copying assets from:', SOURCE_DIR)
    console.log('Copying assets to:', TARGET_DIR)
    
    // Copy all assets recursively
    await fs.copy(SOURCE_DIR, TARGET_DIR, {
      overwrite: true,
      filter: (src: string) => {
        // Skip README files and any other files you want to exclude
        const shouldCopy = !src.includes('README.md')
        if (shouldCopy) {
          console.log('Copying:', src)
        }
        return shouldCopy
      }
    })
    
    // Verify the copy
    const logoDir = path.join(TARGET_DIR, 'Logo')
    if (await fs.pathExists(logoDir)) {
      const files = await fs.readdir(logoDir)
      console.log('✅ Assets copied successfully. Files in Logo directory:', files)
    } else {
      throw new Error('Logo directory not created in target')
    }
  } catch (error) {
    console.error('❌ Error copying assets:', error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  copyAssets()
}

export default copyAssets 
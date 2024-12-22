import fs from 'fs-extra'
import path from 'path'

const SOURCE_DIR = path.join(process.cwd(), 'src/assets')
const TARGET_DIR = path.join(process.cwd(), 'public/assets')

async function copyAssets() {
  try {
    // Ensure target directory exists
    await fs.ensureDir(TARGET_DIR)
    
    // Copy all assets recursively
    await fs.copy(SOURCE_DIR, TARGET_DIR, {
      overwrite: true,
      filter: (src: string) => {
        // Skip README files and any other files you want to exclude
        return !src.includes('README.md')
      }
    })
    
    console.log('✅ Assets copied successfully')
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
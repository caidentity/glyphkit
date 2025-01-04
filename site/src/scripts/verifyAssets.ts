import fs from 'fs-extra'
import path from 'path'

const PUBLIC_DIR = path.join(process.cwd(), 'public')

const REQUIRED_FILES = {
  root: [
    'favicon.ico',
    'site.webmanifest'
  ],
  assets: {
    Logo: ['logo.svg']
  }
}

async function verifyAssets() {
  let hasErrors = false

  try {
    // Verify root files
    for (const file of REQUIRED_FILES.root) {
      const filePath = path.join(PUBLIC_DIR, file)
      if (!await fs.pathExists(filePath)) {
        console.warn(`⚠️ Warning: Missing root asset: ${file}`)
        hasErrors = true
      } else {
        console.log(`✓ Verified root asset: ${file}`)
      }
    }

    // Verify assets in subdirectories
    for (const [dir, files] of Object.entries(REQUIRED_FILES.assets)) {
      for (const file of files) {
        const filePath = path.join(PUBLIC_DIR, 'assets', dir, file)
        if (!await fs.pathExists(filePath)) {
          console.warn(`⚠️ Warning: Missing asset: assets/${dir}/${file}`)
          hasErrors = true
        } else {
          console.log(`✓ Verified asset: assets/${dir}/${file}`)
        }
      }
    }

    if (hasErrors) {
      console.warn('\n⚠️ Some assets are missing but build will continue')
    } else {
      console.log('\n✓ All required assets verified')
    }
    
    return true
  } catch (error) {
    console.error('Asset verification error:', error)
    // Return true to allow build to continue
    return true
  }
}

// Run if called directly
if (require.main === module) {
  verifyAssets()
}

// Single export default statement
export default verifyAssets 

import fs from 'fs-extra'
import path from 'path'

async function verifyAssets() {
  const logoPath = path.join(process.cwd(), 'public/assets/Logo/logo.svg')
  
  try {
    const exists = await fs.pathExists(logoPath)
    if (!exists) {
      throw new Error(`Logo not found at ${logoPath}`)
    }
    console.log('✅ Logo verified at:', logoPath)
  } catch (error) {
    console.error('❌ Asset verification failed:', error)
    process.exit(1)
  }
}

verifyAssets() 
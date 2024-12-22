import fs from 'fs-extra'
import path from 'path'

async function verifyAssetSetup() {
  const checks = {
    sourceDir: path.join(process.cwd(), 'src/assets'),
    targetDir: path.join(process.cwd(), 'public/assets'),
    sourceLogo: path.join(process.cwd(), 'src/assets/Logo'),
    targetLogo: path.join(process.cwd(), 'public/assets/Logo'),
  }

  try {
    // Check source directory structure
    console.log('\n📁 Checking source directories...')
    for (const [key, dir] of Object.entries(checks)) {
      const exists = await fs.pathExists(dir)
      console.log(`${exists ? '✅' : '❌'} ${key}: ${dir}`)
      
      if (exists) {
        const files = await fs.readdir(dir)
        console.log(`   Files: ${files.join(', ')}`)
      }
    }

    // Verify logo files
    console.log('\n🖼 Checking logo files...')
    const logoFiles = ['logo.svg', 'logo.png']
    for (const file of logoFiles) {
      const sourcePath = path.join(checks.sourceLogo, file)
      const targetPath = path.join(checks.targetLogo, file)
      
      const sourceExists = await fs.pathExists(sourcePath)
      const targetExists = await fs.pathExists(targetPath)
      
      console.log(`${file}:`)
      console.log(`  Source: ${sourceExists ? '✅' : '❌'} ${sourcePath}`)
      console.log(`  Target: ${targetExists ? '✅' : '❌'} ${targetPath}`)
      
      if (sourceExists && targetExists) {
        const sourceStats = await fs.stat(sourcePath)
        const targetStats = await fs.stat(targetPath)
        console.log(`  Size match: ${sourceStats.size === targetStats.size ? '✅' : '❌'}`)
      }
    }

    // Check asset loader configuration
    console.log('\n⚙️ Checking asset loader configuration...')
    const assetLoaderPath = path.join(process.cwd(), 'src/lib/assetLoader.ts')
    const assetLoaderExists = await fs.pathExists(assetLoaderPath)
    console.log(`Asset loader: ${assetLoaderExists ? '✅' : '❌'} ${assetLoaderPath}`)

    // Check webpack configuration
    console.log('\n🔧 Checking webpack configuration...')
    const nextConfigPath = path.join(process.cwd(), 'next.config.js')
    const nextConfigExists = await fs.pathExists(nextConfigPath)
    console.log(`Next config: ${nextConfigExists ? '✅' : '❌'} ${nextConfigPath}`)
    
    if (nextConfigExists) {
      const config = await fs.readFile(nextConfigPath, 'utf8')
      const hasAssetConfig = config.includes('asset/resource')
      const hasCopyPlugin = config.includes('copy-webpack-plugin')
      console.log(`Asset handling: ${hasAssetConfig ? '✅' : '❌'}`)
      console.log(`Copy plugin: ${hasCopyPlugin ? '✅' : '❌'}`)
    }

  } catch (error) {
    console.error('❌ Verification failed:', error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  verifyAssetSetup()
}

export default verifyAssetSetup 
import * as fs from 'fs/promises';
import * as path from 'path';

async function copyIconRegistry() {
  const srcDir = path.join(process.cwd(), 'src/lib');
  const destDir = path.join(process.cwd(), 'public/registry');

  console.log('Copying registry files:');
  console.log('- From:', srcDir);
  console.log('- To:', destDir);

  try {
    // Ensure source files exist
    const files = ['iconRegistry.json', 'icons.json', 'categories.json'];
    for (const file of files) {
      const srcPath = path.join(srcDir, file);
      try {
        await fs.access(srcPath);
        const stats = await fs.stat(srcPath);
        console.log(`Found ${file} (${stats.size} bytes)`);
      } catch (error) {
        console.error(`Source file ${file} not found in ${srcDir}`);
        process.exit(1);
      }
    }

    // Create destination directory
    await fs.mkdir(destDir, { recursive: true });

    // Copy files
    await Promise.all(files.map(async (file) => {
      const srcPath = path.join(srcDir, file);
      const destPath = path.join(destDir, file);
      await fs.copyFile(srcPath, destPath);
      const stats = await fs.stat(destPath);
      console.log(`Copied ${file} to public/registry (${stats.size} bytes)`);
    }));

    console.log('Successfully copied all icon registry files');
  } catch (error) {
    console.error('Failed to copy icon registry:', error);
    throw error;
  }
}

copyIconRegistry().catch(error => {
  console.error('Error:', error);
  process.exit(1);
}); 
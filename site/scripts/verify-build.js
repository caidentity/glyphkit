const fs = require('fs').promises;
const path = require('path');

async function verifyBuild() {
  console.log('Verifying build artifacts...');
  
  const checks = [
    {
      path: 'public/icon-metadata.json',
      type: 'file',
      name: 'Icon metadata'
    },
    {
      path: 'public/icons',
      type: 'directory',
      name: 'Icons directory'
    }
  ];

  let failed = false;

  for (const check of checks) {
    try {
      const stats = await fs.stat(path.join(process.cwd(), check.path));
      const isValid = check.type === 'file' ? stats.isFile() : stats.isDirectory();
      
      if (!isValid) {
        console.error(`❌ ${check.name} is not a ${check.type}`);
        failed = true;
        continue;
      }

      if (check.path === 'public/icon-metadata.json') {
        const content = await fs.readFile(path.join(process.cwd(), check.path), 'utf8');
        const metadata = JSON.parse(content);
        if (!metadata.categories || !Array.isArray(metadata.categories)) {
          console.error('❌ Invalid metadata format');
          failed = true;
          continue;
        }
      }

      console.log(`✅ ${check.name} verified`);
    } catch (error) {
      console.error(`❌ ${check.name} check failed:`, error.message);
      failed = true;
    }
  }

  if (failed) {
    process.exit(1);
  }
}

verifyBuild().catch(error => {
  console.error('Build verification failed:', error);
  process.exit(1);
}); 
const fs = require('fs');
const path = require('path');

console.log('Verifying build artifacts...');

// Check required paths
const requiredPaths = [
  path.join(process.cwd(), 'public/icons'),
  path.join(process.cwd(), '.next'),
  path.join(process.cwd(), 'src/lib/iconRegistry.json')
];

for (const p of requiredPaths) {
  try {
    fs.statSync(p);
    console.log('✅ Verified:', p);
  } catch (error) {
    console.error('❌ Missing:', p);
    process.exit(1);
  }
}

console.log('✅ All build artifacts verified'); 
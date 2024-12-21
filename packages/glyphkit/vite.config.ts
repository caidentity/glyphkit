import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: './demo',
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
        '.ts': 'tsx'
      }
    }
  },
  build: {
    outDir: '../dist-demo',
    emptyOutDir: true
  }
}); 
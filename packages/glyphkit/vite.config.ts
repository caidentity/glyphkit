import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: './demo',
  publicDir: '../public',
  build: {
    outDir: '../dist/demo'
  },
  css: {
    postcss: './demo/postcss.config.cjs'
  },
  server: {
    watch: {
      usePolling: true
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@demo': path.resolve(__dirname, './demo/src'),
      '@icons': path.resolve(__dirname, './src/icons')
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  },
  assetsInclude: ['**/*.svg'],
}); 
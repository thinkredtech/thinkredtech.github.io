import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // For thinkredtech.github.io (user/org site)
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
    host: '0.0.0.0',
    middlewareMode: false,
    proxy: {},
    fs: {
      strict: false
    }
  },
  preview: {
    port: 4173,
    host: '0.0.0.0',
    allowedHosts: true,
  },
  build: {
    outDir: 'build',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: id => {
          if (id.includes('node_modules')) {
            // React core
            if (id.includes('react/') || id.includes('react-dom/')) {
              return 'react-core';
            }
            // React Router
            if (id.includes('react-router')) {
              return 'react-router';
            }
            // Markdown processing
            if (
              id.includes('markdown') ||
              id.includes('remark') ||
              id.includes('rehype') ||
              id.includes('unified') ||
              id.includes('micromark') ||
              id.includes('mdast') ||
              id.includes('hast')
            ) {
              return 'markdown-vendors';
            }
            // Large UI/utility libraries
            if (
              id.includes('framer-motion') ||
              id.includes('gsap') ||
              id.includes('lodash')
            ) {
              return 'ui-vendors';
            }
            // All other vendor libraries
            return 'vendors';
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  publicDir: 'public',
});

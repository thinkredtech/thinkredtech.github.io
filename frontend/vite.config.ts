import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { randomBytes } from "crypto";
import { createCSPPlugin } from "./src/plugins/vite-csp-plugin";
import { reactRegexFixPlugin } from "./vite-plugins/react-regex-fix.js";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable React performance optimizations
      jsxRuntime: 'automatic',
      babel: {
        plugins: [
          // Remove propTypes in production for smaller bundles
          ...(process.env.NODE_ENV === 'production' ? [
            ['babel-plugin-transform-react-remove-prop-types', { removeImport: true }]
          ] : [])
        ]
      }
    }),
    // CSP Plugin for secure Content Security Policy - Addresses GitHub Issue #45
    // Note: Disabled during build - post-build optimizers handle CSP nonces
    createCSPPlugin({
      enabled: false, // Disabled to preserve manual CSP in HTML template
      development: process.env.NODE_ENV !== "production",
    }),
    // React 19.1.1 Regex Fix Plugin - Automatically fixes malformed regex pattern
    reactRegexFixPlugin(),
  ],
  base: "/", // For thinkredtech.github.io (user/org site)
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    open: true,
    host: "0.0.0.0",
    middlewareMode: false,
    hmr: true, // Let Vite auto-configure HMR port
    proxy: {},
    fs: {
      strict: false,
    },
  },
  preview: {
    port: 4173,
    host: "0.0.0.0",
    allowedHosts: true,
  },
  build: {
    outDir: "dist",
    sourcemap: process.env.NODE_ENV !== "production" ? true : false, // Disable sourcemaps in prod for smaller files
    rollupOptions: {
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false
      },
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            // React core - keep small and critical
            if (id.includes("react/") || id.includes("react-dom/")) {
              return "react-core";
            }
            // React Router - separate for route-based loading
            if (id.includes("react-router")) {
              return "react-router";
            }
            // React Icons - large library, separate chunk
            if (id.includes("react-icons")) {
              return "react-icons";
            }
            // Markdown processing - only loaded when needed
            if (
              id.includes("markdown") ||
              id.includes("remark") ||
              id.includes("rehype") ||
              id.includes("unified") ||
              id.includes("micromark") ||
              id.includes("mdast") ||
              id.includes("hast")
            ) {
              return "markdown-vendors";
            }
            // Animation and UI libraries - defer loading
            if (
              id.includes("framer-motion") ||
              id.includes("gsap") ||
              id.includes("lodash")
            ) {
              return "ui-vendors";
            }
            // Date manipulation libraries
            if (id.includes("date-fns")) {
              return "date-vendors";
            }
            // Utility libraries
            if (
              id.includes("clsx") ||
              id.includes("classnames") ||
              id.includes("uuid")
            ) {
              return "utils";
            }
            // All other vendor libraries
            return "vendors";
          }
        },
        // Optimize chunk naming for better caching
        chunkFileNames: (chunkInfo) => {
          // Critical chunks get priority naming
          if (chunkInfo.name === 'react-core' || chunkInfo.name === 'vendors') {
            return 'assets/[name]-[hash].js';
          }
          // Non-critical chunks get prefixed for easier identification
          return 'assets/chunk-[name]-[hash].js';
        },
        entryFileNames: 'assets/main-[hash].js',
        assetFileNames: (assetInfo) => {
          // Separate assets by type for better caching
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'assets/styles-[hash][extname]';
          }
          if (assetInfo.name && /\.(png|jpe?g|gif|svg|webp|avif)$/.test(assetInfo.name)) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (assetInfo.name && /\.(woff2?|eot|ttf|otf)$/.test(assetInfo.name)) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      },
    },
    chunkSizeWarningLimit: 500, // Reasonable chunk size warning
    // Simple, safe minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        // Keep only essential, safe optimizations
        dead_code: true,
        unused: true,
      },
      mangle: {
        safari10: true,
        // Keep function names for debugging
        keep_fnames: true,
      },
      format: {
        comments: false,
      },
    },
    cssCodeSplit: true,
    assetsInlineLimit: 2048, // Reduce inline limit for better compression
    // Enable additional optimizations
    target: ['es2020', 'chrome80', 'firefox78', 'safari14', 'edge88'],
    cssMinify: true, // Use default CSS minification
    // Rollup-specific optimizations
    reportCompressedSize: false, // Faster builds
    emptyOutDir: true,
    // Module preload optimization
    modulePreload: {
      polyfill: false, // Reduce bundle size by disabling polyfill
    },
    // Advanced build optimizations
    commonjsOptions: {
      transformMixedEsModules: true,
      include: [/node_modules/],
    },
  },
  // Security: CSP nonce generation for production builds
  define: {
    __CSP_NONCE__: JSON.stringify(
      process.env.NODE_ENV === "production"
        ? randomBytes(16).toString("base64")
        : "",
    ),
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "react-icons/fa",
      "react-icons/si",
      "react-icons/bs",
      "react-icons/md",
      "react-icons/ri",
    ],
    exclude: ["@vite/client", "@vite/env"],
    // Force optimization of commonly used dependencies
    force: false,
    esbuildOptions: {
      // Optimize dependency bundling
      target: 'es2020',
      format: 'esm',
      treeShaking: true,
    },
  },
  publicDir: "public",
});

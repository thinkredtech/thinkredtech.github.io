import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { randomBytes } from "crypto";
import { createCSPPlugin } from "./src/plugins/vite-csp-plugin";

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
      enabled: process.env.NODE_ENV !== "production",
      development: process.env.NODE_ENV !== "production",
    }),
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
    chunkSizeWarningLimit: 300, // Reduce chunk size warning for better performance
    // Enhanced optimizations for PageSpeed
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        passes: 3, // Increased compression passes
        dead_code: true,
        unused: true,
        side_effects: false,
        // Additional aggressive optimizations
        arrows: true,
        arguments: true,
        booleans: true,
        collapse_vars: true,
        comparisons: true,
        computed_props: true,
        conditionals: true,
        directives: true,
        evaluate: true,
        hoist_funs: true,
        hoist_props: true,
        hoist_vars: false,
        if_return: true,
        inline: true,
        join_vars: true,
        loops: true,
        negate_iife: true,
        properties: true,
        reduce_funcs: true,
        reduce_vars: true,
        sequences: true,
        switches: true,
        typeofs: true,
        unsafe: true,
        unsafe_arrows: true,
        unsafe_comps: true,
        unsafe_Function: true,
        unsafe_math: true,
        unsafe_symbols: true,
        unsafe_methods: true,
        unsafe_proto: true,
        unsafe_regexp: true,
        unsafe_undefined: true,
      },
      mangle: {
        safari10: true,
        toplevel: true,
        eval: true,
        keep_fnames: false,
        reserved: ['__CSP_NONCE__'], // Preserve CSP nonce
      },
      format: {
        comments: false,
        ascii_only: true, // Better compression
        ecma: 2020,
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

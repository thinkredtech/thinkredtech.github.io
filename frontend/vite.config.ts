import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { randomBytes } from "crypto";
import { createCSPPlugin } from "./src/plugins/vite-csp-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // CSP Plugin for secure Content Security Policy - Addresses GitHub Issue #45
    createCSPPlugin({
      enabled: true,
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
    sourcemap: true,
    rollupOptions: {
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false
      },
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            // React core
            if (id.includes("react/") || id.includes("react-dom/")) {
              return "react-core";
            }
            // React Router
            if (id.includes("react-router")) {
              return "react-router";
            }
            // React Icons
            if (id.includes("react-icons")) {
              return "react-icons";
            }
            // Markdown processing
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
            // Large UI/utility libraries
            if (
              id.includes("framer-motion") ||
              id.includes("gsap") ||
              id.includes("lodash")
            ) {
              return "ui-vendors";
            }
            // All other vendor libraries
            return "vendors";
          }
        },
        // Optimize chunk naming for better caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      },
    },
    chunkSizeWarningLimit: 500, // Reduce chunk size warning
    // Enhanced optimizations for PageSpeed
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        passes: 2,
        dead_code: true,
        unused: true,
        side_effects: false,
      },
      mangle: {
        safari10: true,
      },
      format: {
        comments: false,
      },
    },
    cssCodeSplit: true,
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
    // Enable additional optimizations
    target: ['es2020', 'chrome80', 'firefox78', 'safari14', 'edge88'],
    cssMinify: true,
    // Rollup-specific optimizations
    reportCompressedSize: false, // Faster builds
    emptyOutDir: true,
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
    ],
    exclude: ["@vite/client", "@vite/env"],
  },
  publicDir: "public",
});

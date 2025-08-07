#!/usr/bin/env node

/**
 * Simple Clean Optimization Script
 * Minimal, safe optimizations for production builds
 */

/* eslint-disable no-undef */

const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(process.cwd(), 'dist');
const ASSETS_DIR = path.join(DIST_DIR, 'assets');
const INDEX_PATH = path.join(DIST_DIR, 'index.html');

console.log('🧹 Running simple clean optimization...');

function optimizeCSS() {
  if (!fs.existsSync(ASSETS_DIR)) return;
  
  const cssFiles = fs.readdirSync(ASSETS_DIR).filter(file => file.endsWith('.css'));
  
  cssFiles.forEach(file => {
    const filePath = path.join(ASSETS_DIR, file);
    let css = fs.readFileSync(filePath, 'utf8');
    
    // Only the safest CSS optimizations
    css = css
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\s{2,}/g, ' ') // Collapse whitespace
      .replace(/;\s*}/g, '}') // Remove trailing semicolons
      .trim();
    
    fs.writeFileSync(filePath, css);
    console.log(`✅ Optimized CSS: ${file}`);
  });
}

function optimizeHTML() {
  if (!fs.existsSync(INDEX_PATH)) return;
  
  // Skip HTML optimization to preserve CSP meta tags
  console.log('✅ HTML optimization skipped to preserve CSP headers');
}

function addBasicPerformanceHints() {
  if (!fs.existsSync(INDEX_PATH)) return;
  
  let html = fs.readFileSync(INDEX_PATH, 'utf8');
  
  // Only add hints if not already present (avoid duplicates)
  if (!html.includes('dns-prefetch') && !html.includes('fonts.googleapis.com')) {
    const hints = `
    <link rel="dns-prefetch" href="//fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`;
    
    html = html.replace('</head>', `${hints}\n</head>`);
    fs.writeFileSync(INDEX_PATH, html);
    console.log('✅ Added performance hints');
  } else {
    console.log('✅ Performance hints already present');
  }
}

// Main execution
try {
  optimizeCSS();
  optimizeHTML();
  addBasicPerformanceHints();
  console.log('🎉 Simple optimization completed successfully!');
} catch (error) {
  console.error('❌ Optimization failed:', error.message);
  process.exit(1);
}

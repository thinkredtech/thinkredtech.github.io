#!/usr/bin/env node

/**
 * Post-build optimization script
 * Optimizes the generated index.html for better performance
 */

const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distDir, 'index.html');

try {
  // Read the generated index.html
  let html = fs.readFileSync(indexPath, 'utf8');
  
  // Find the main CSS file reference
  const cssMatch = html.match(/<link[^>]*rel="stylesheet"[^>]*href="([^"]*\.css)"[^>]*>/);
  
  if (cssMatch) {
    const cssHref = cssMatch[1];
    const fullMatch = cssMatch[0];
    
    // Replace the blocking CSS link with non-blocking version
    const nonBlockingCSS = `
    <!-- Preload CSS for better performance -->
    <link rel="preload" href="${cssHref}" as="style" crossorigin>
    
    <!-- Non-blocking CSS loading -->
    <link rel="stylesheet" media="print" onload="this.media='all'" crossorigin href="${cssHref}">
    <noscript><link rel="stylesheet" crossorigin href="${cssHref}"></noscript>`;
    
    html = html.replace(fullMatch, nonBlockingCSS);
  }
  
  // Find the main JS file reference
  const jsMatch = html.match(/<script[^>]*type="module"[^>]*src="([^"]*\.js)"[^>]*>/);
  
  if (jsMatch) {
    const jsHref = jsMatch[1];
    
    // Add preload for the main JS file before the existing script tag
    const preloadJS = `    <link rel="preload" href="${jsHref}" as="script" crossorigin>\n    `;
    html = html.replace(jsMatch[0], preloadJS + jsMatch[0]);
  }
  
  // Find vendor JS files and add preloads
  const vendorMatches = html.match(/<link[^>]*rel="modulepreload"[^>]*href="([^"]*vendors[^"]*\.js)"[^>]*>/g);
  if (vendorMatches) {
    vendorMatches.forEach(match => {
      const hrefMatch = match.match(/href="([^"]*)"/);
      if (hrefMatch) {
        const vendorHref = hrefMatch[1];
        const preloadVendor = `    <link rel="preload" href="${vendorHref}" as="script" crossorigin>\n    `;
        html = html.replace(match, preloadVendor + match);
      }
    });
  }
  
  // Write the optimized HTML back
  fs.writeFileSync(indexPath, html, 'utf8');
  
  console.log('✅ Post-build optimization completed successfully');
  console.log('   - Non-blocking CSS loading enabled');
  console.log('   - Resource preloading optimized');
  
} catch (error) {
  console.error('❌ Post-build optimization failed:', error.message);
  process.exit(1);
}

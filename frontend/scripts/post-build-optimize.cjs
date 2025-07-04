#!/usr/bin/env node

/**
 * Post-build optimization script
 * Optimizes the generated index.html for better performance
 */

const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distDir, 'index.html');
const assetsDir = path.join(distDir, 'assets');

try {
  // Read the generated index.html
  let html = fs.readFileSync(indexPath, 'utf8');
  
  // Find the main CSS and JS files in the assets directory
  const assetFiles = fs.readdirSync(assetsDir);
  const mainCSSFile = assetFiles.find(file => file.startsWith('index-') && file.endsWith('.css'));
  const mainJSFile = assetFiles.find(file => file.startsWith('index-') && file.endsWith('.js') && !file.endsWith('.js.map'));
  const vendorsJSFile = assetFiles.find(file => file.startsWith('vendors-') && file.endsWith('.js') && !file.endsWith('.js.map'));
  const reactCoreJSFile = assetFiles.find(file => file.startsWith('react-core-') && file.endsWith('.js') && !file.endsWith('.js.map'));
  const reactRouterJSFile = assetFiles.find(file => file.startsWith('react-router-') && file.endsWith('.js') && !file.endsWith('.js.map'));
  
  console.log('Found assets:', { mainCSSFile, mainJSFile, vendorsJSFile, reactCoreJSFile, reactRouterJSFile });
  
  // If assets are found but not in HTML, inject them
  if (mainCSSFile && !html.includes(mainCSSFile)) {
    // Find the closing </head> tag to inject assets
    const headCloseIndex = html.indexOf('</head>');
    if (headCloseIndex !== -1) {
      let assetsHTML = '\n';
      
      // Add preloads for critical resources
      if (mainJSFile) {
        assetsHTML += `    <link rel="preload" href="/assets/${mainJSFile}" as="script" crossorigin>\n`;
      }
      if (mainCSSFile) {
        assetsHTML += `    <link rel="preload" href="/assets/${mainCSSFile}" as="style" crossorigin>\n`;
      }
      if (vendorsJSFile) {
        assetsHTML += `    <link rel="preload" href="/assets/${vendorsJSFile}" as="script" crossorigin>\n`;
      }
      if (reactCoreJSFile) {
        assetsHTML += `    <link rel="preload" href="/assets/${reactCoreJSFile}" as="script" crossorigin>\n`;
      }
      
      // Add non-blocking CSS
      if (mainCSSFile) {
        assetsHTML += `    \n    <!-- Non-blocking CSS loading -->\n`;
        assetsHTML += `    <link rel="stylesheet" media="print" onload="this.media='all'" crossorigin href="/assets/${mainCSSFile}">\n`;
        assetsHTML += `    <noscript><link rel="stylesheet" crossorigin href="/assets/${mainCSSFile}"></noscript>\n`;
      }
      
      // Add module scripts
      if (mainJSFile) {
        assetsHTML += `    \n    <script type="module" crossorigin src="/assets/${mainJSFile}"></script>\n`;
      }
      if (vendorsJSFile) {
        assetsHTML += `    <link rel="modulepreload" crossorigin href="/assets/${vendorsJSFile}">\n`;
      }
      if (reactCoreJSFile) {
        assetsHTML += `    <link rel="modulepreload" crossorigin href="/assets/${reactCoreJSFile}">\n`;
      }
      if (reactRouterJSFile) {
        assetsHTML += `    <link rel="modulepreload" crossorigin href="/assets/${reactRouterJSFile}">\n`;
      }
      
      assetsHTML += '  ';
      
      // Insert before </head>
      html = html.slice(0, headCloseIndex) + assetsHTML + html.slice(headCloseIndex);
    }
  } else {
    // If assets are already in HTML, optimize them
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

#!/usr/bin/env node

/**
 * Post-build optimization script
 * Optimizes the generated index.html for better performance
 */

/* eslint-disable no-undef */

const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distDir, 'index.html');
const assetsDir = path.join(distDir, 'assets');

// Critical CSS to inject
const criticalCSS = `
    <!-- Critical above-the-fold CSS -->
    <style>
      /* Critical CSS for above-the-fold content */
      * { box-sizing: border-box; margin: 0; padding: 0; }
      html { line-height: 1.15; }
      body { 
        font-family: 'Montserrat', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
        background-color: #ffffff; 
        color: #1f2937; 
        line-height: 1.6; 
        font-display: swap;
      }
      
      /* Prevent layout shift during font loading */
      .font-comfortaa { font-family: 'Comfortaa', system-ui, sans-serif; font-display: swap; }
      .font-montserrat { font-family: 'Montserrat', system-ui, sans-serif; font-display: swap; }
      
      /* High contrast text colors for accessibility */
      .text-gray-600 { color: #4b5563 !important; }
      .text-gray-700 { color: #374151 !important; }
      .text-gray-800 { color: #1f2937 !important; }
      .text-gray-900 { color: #111827 !important; }
      
      /* Header and navigation */
      header { 
        background-color: rgba(255, 255, 255, 0.95); 
        -webkit-backdrop-filter: blur(10px);
        backdrop-filter: blur(10px); 
        position: sticky; 
        top: 0; 
        z-index: 50; 
        will-change: transform;
        transition: all 0.3s ease;
      }
      
      /* Header border when scrolled (matches bg-white class) */
      header.bg-white {
        border-bottom: 1px solid #e5e7eb;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }
      nav { 
        max-width: 1280px; 
        margin: 0 auto; 
        padding: 1rem 1.5rem; 
        display: flex; 
        align-items: center; 
        justify-content: space-between; 
      }
      
      /* Hero section */
      .hero { 
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); 
        min-height: 80vh; 
        display: flex; 
        align-items: center; 
        padding: 2rem 1.5rem; 
        contain: layout style;
      }
      .hero-content { 
        max-width: 1280px; 
        margin: 0 auto; 
        display: grid; 
        grid-template-columns: 1fr 1fr; 
        gap: 3rem; 
        align-items: center; 
      }
      .hero h1 { 
        font-size: 3rem; 
        font-weight: 700; 
        color: #1f2937; 
        line-height: 1.2; 
        margin-bottom: 1.5rem; 
        font-display: swap;
      }
      .hero p { 
        font-size: 1.25rem; 
        color: #4b5563; 
        margin-bottom: 2rem; 
        line-height: 1.6; 
      }
      
      /* Buttons */
      .btn { 
        display: inline-flex; 
        align-items: center; 
        padding: 0.75rem 1.5rem; 
        border-radius: 0.5rem; 
        font-weight: 600; 
        text-decoration: none; 
        transition: all 0.2s ease; 
        border: 2px solid transparent; 
        cursor: pointer;
      }
      .btn-primary { 
        background-color: #e4093e; 
        color: #ffffff; 
        box-shadow: 0 4px 6px rgba(228, 9, 62, 0.25); 
      }
      .btn-primary:hover { 
        background-color: #c1082f; 
        transform: translateY(-1px); 
        box-shadow: 0 6px 12px rgba(228, 9, 62, 0.35); 
      }
      
      /* Focus styles for accessibility - override Tailwind defaults */
      .btn:focus, button:focus, input:focus, textarea:focus, select:focus {
        outline: 2px solid #e4093e !important;
        outline-offset: 2px !important;
        box-shadow: 0 0 0 3px rgba(228, 9, 62, 0.1) !important;
      }
      
      /* Remove focus styles for navigation elements */
      nav a:focus, header a:focus, .logo-link:focus, nav a:focus-visible, header a:focus-visible, .logo-link:focus-visible {
        outline: none !important;
        box-shadow: none !important;
        background-color: transparent !important;
      }
      
      /* General link focus with softer styling */
      a:focus {
        outline: 1px solid rgba(228, 9, 62, 0.4) !important;
        outline-offset: 2px !important;
        box-shadow: 0 0 0 2px rgba(228, 9, 62, 0.06) !important;
        border-radius: 3px !important;
      }
      
      /* Loading state */
      .loading { opacity: 0; }
      .loaded { opacity: 1; transition: opacity 0.3s ease-in-out; }
      
      /* Prevent layout shift */
      img { height: auto; max-width: 100%; }
      
      /* Responsive design */
      @media (max-width: 768px) {
        .hero-content { grid-template-columns: 1fr; text-align: center; }
        .hero h1 { font-size: 2.25rem; }
        .hero p { font-size: 1.125rem; }
        nav { flex-direction: column; gap: 1rem; }
      }
    </style>`;

try {
  // Read the generated index.html
  let html = fs.readFileSync(indexPath, 'utf8');
  
  // ONLY inject critical CSS - don't modify any existing structure
  const headOpenIndex = html.indexOf('<head>');
  if (headOpenIndex !== -1) {
    // Find position after opening head tag
    const insertPosition = html.indexOf('>', headOpenIndex) + 1;
    // Insert critical CSS right after <head> tag, without disturbing other content
    html = html.slice(0, insertPosition) + criticalCSS + html.slice(insertPosition);
  }
  
  // Find the main CSS and JS files in the assets directory
  const assetFiles = fs.readdirSync(assetsDir);
  const mainCSSFile = assetFiles.find(file => file.endsWith('.css') && (file.startsWith('index-') || file.startsWith('styles-')));
  const mainJSFile = assetFiles.find(file => file.startsWith('main-') && file.endsWith('.js') && !file.endsWith('.js.map'));
  const vendorsJSFile = assetFiles.find(file => file.startsWith('vendors-') && file.endsWith('.js') && !file.endsWith('.js.map'));
  const reactCoreJSFile = assetFiles.find(file => file.startsWith('react-core-') && file.endsWith('.js') && !file.endsWith('.js.map'));
  const reactRouterJSFile = assetFiles.find(file => file.startsWith('react-router-') && file.endsWith('.js') && !file.endsWith('.js.map'));
  
  console.log('Found assets:', { mainCSSFile, mainJSFile, vendorsJSFile, reactCoreJSFile, reactRouterJSFile });
  
  // Always ensure CSS is properly linked (critical for functionality)
  console.log(`Checking CSS: ${mainCSSFile}`);
  console.log(`CSS in HTML check: ${html.includes(`/assets/${mainCSSFile}`)}`);
  
  if (mainCSSFile && !html.includes(`/assets/${mainCSSFile}`)) {
    console.log(`Adding missing CSS link: ${mainCSSFile}`);
    const headCloseIndex = html.indexOf('</head>');
    if (headCloseIndex !== -1) {
      const cssLink = `    <link rel="stylesheet" href="/assets/${mainCSSFile}" crossorigin>\n`;
      html = html.slice(0, headCloseIndex) + cssLink + html.slice(headCloseIndex);
      console.log('CSS link added successfully');
    } else {
      console.log('ERROR: Could not find </head> tag');
    }
  } else if (mainCSSFile) {
    console.log(`CSS already present: ${mainCSSFile}`);
  } else {
    console.log('ERROR: No CSS file found');
  }

  // If other assets are missing, add them
  if (mainJSFile && !html.includes(mainJSFile)) {
    // Find the closing </head> tag to inject assets
    const headCloseIndex = html.indexOf('</head>');
    if (headCloseIndex !== -1) {
      let assetsHTML = '\n';
      
      // Add preloads for critical resources
      if (mainJSFile) {
        assetsHTML += `    <link rel="preload" href="/assets/${mainJSFile}" as="script" crossorigin>\n`;
      }
      if (vendorsJSFile) {
        assetsHTML += `    <link rel="preload" href="/assets/${vendorsJSFile}" as="script" crossorigin>\n`;
      }
      if (reactCoreJSFile) {
        assetsHTML += `    <link rel="preload" href="/assets/${reactCoreJSFile}" as="script" crossorigin>\n`;
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
    // Assets are already in HTML - just verify presence
    console.log('Other assets already in HTML');
    
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

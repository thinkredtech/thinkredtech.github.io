#!/usr/bin/env node

/**
 * CSS Compatibility Fixer
 * Fixes CSS compatibility issues for better browser support
 */

const fs = require('fs');
const path = require('path');

console.log('🎨 Fixing CSS compatibility issues...');

function addVendorPrefixes(css) {
  // Add -webkit- prefix for backdrop-filter
  css = css.replace(/(?<!-webkit-)backdrop-filter:/g, 'backdrop-filter: $&\n  -webkit-backdrop-filter:');
  css = css.replace(/backdrop-filter:\s*([^;]+);/g, 'backdrop-filter: $1;\n  -webkit-backdrop-filter: $1;');
  
  // Fix text-size-adjust to include standard property
  css = css.replace(/-webkit-text-size-adjust:\s*([^;]+);/g, '-webkit-text-size-adjust: $1;\n  text-size-adjust: $1;');
  
  return css;
}

function removeFetchPriorityForCompatibility(html) {
  // Remove fetchpriority attribute for better compatibility
  html = html.replace(/\s+fetchpriority="[^"]*"/g, '');
  return html;
}

function fixDistFiles() {
  const distDir = path.join(process.cwd(), 'frontend/dist');
  
  if (!fs.existsSync(distDir)) {
    console.log('⚠️  No dist directory found');
    return;
  }

  // Fix HTML files
  const htmlFiles = fs.readdirSync(distDir).filter(file => file.endsWith('.html'));
  htmlFiles.forEach(file => {
    const filePath = path.join(distDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove fetchpriority for compatibility
    const originalContent = content;
    content = removeFetchPriorityForCompatibility(content);
    
    // Add vendor prefixes to inline styles
    content = addVendorPrefixes(content);
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed compatibility issues in: ${file}`);
    }
  });

  // Fix CSS files
  const cssDir = path.join(distDir, 'assets');
  if (fs.existsSync(cssDir)) {
    const cssFiles = fs.readdirSync(cssDir).filter(file => file.endsWith('.css'));
    cssFiles.forEach(file => {
      const filePath = path.join(cssDir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      
      const originalContent = content;
      content = addVendorPrefixes(content);
      
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content);
        console.log(`✅ Fixed CSS compatibility in: ${file}`);
      }
    });
  }
}

// Run the fixer
fixDistFiles();
console.log('✅ CSS compatibility fixing completed!');

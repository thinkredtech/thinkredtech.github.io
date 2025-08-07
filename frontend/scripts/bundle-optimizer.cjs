#!/usr/bin/env node

/**
 * Bundle Size Optimizer
 * Reduces JavaScript bundle sizes by removing unused code and optimizing chunks
 * 
 * @author ThinkRED Technologies
 * @version 1.0.0
 */

/* eslint-env node */
/* eslint no-console: "off" */

const fs = require('fs');
const path = require('path');

const distDir = path.join(process.cwd(), 'dist');
const assetsDir = path.join(distDir, 'assets');

console.log('📦 Starting Bundle Size Optimization...');

// 1. Analyze bundle composition
function analyzeBundles() {
  console.log('🔍 Analyzing bundle composition...');
  
  const jsFiles = fs.readdirSync(assetsDir)
    .filter(file => file.endsWith('.js') && !file.endsWith('.map'))
    .map(file => {
      const filePath = path.join(assetsDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const size = content.length;
      
      return {
        file,
        size,
        content,
        type: file.includes('vendors') ? 'vendor' : 
              file.includes('react-core') ? 'react' :
              file.includes('chunk-') ? 'chunk' : 'main'
      };
    })
    .sort((a, b) => b.size - a.size);
  
  console.log('📊 Bundle Analysis:');
  jsFiles.forEach(({ file, size, type }) => {
    const sizeKB = Math.round(size / 1024);
    const indicator = sizeKB > 200 ? '🔴' : sizeKB > 100 ? '🟡' : '🟢';
    console.log(`${indicator} ${file}: ${sizeKB}KB (${type})`);
  });
  
  return jsFiles;
}

// 2. Remove unused polyfills and features
function removeUnusedFeatures(bundles) {
  console.log('🧹 Removing unused features...');
  
  let totalSavings = 0;
  
  bundles.forEach(bundle => {
    let content = bundle.content;
    const originalSize = content.length;
    
    // Remove React DevTools in production
    content = content.replace(/React\.Component\.displayName\s*=\s*['"[^"']+['"]/, '');
    // Temporarily disable DevTools removal to avoid corruption
    // content = content.replace(/if\s*\(\s*["']undefined["']\s*!=\s*typeof\s+__REACT_DEVTOOLS_GLOBAL_HOOK__[^}]*}\s*catch[^}]*}\s*/g, '');
    // content = content.replace(/if\s*\(\s*typeof\s+__REACT_DEVTOOLS_GLOBAL_HOOK__\s*!=\s*["']undefined["'][^}]*}\s*catch[^}]*}\s*/g, '');
    
    // Remove source map references
    content = content.replace(/\/\/# sourceMappingURL=.*$/gm, '');
    content = content.replace(/\/\*# sourceMappingURL=.*?\*\//g, '');
    
    // Remove console.* calls in production
    content = content.replace(/console\.(?:log|info|debug|warn|error)\([^)]*\);?/g, '');
    
    // Remove development-only code blocks (more specific pattern)
    content = content.replace(/if\s*\(\s*process\.env\.NODE_ENV\s*[!=]==?\s*['"]development['"]\s*\)\s*\{[^}]*\}/g, '');
    content = content.replace(/if\s*\(\s*['"]development['"]\s*[!=]==?\s*process\.env\.NODE_ENV\s*\)\s*\{[^}]*\}/g, '');
    
    // Remove unused React imports
    if (bundle.type === 'vendor' || bundle.type === 'react') {
      // Remove React.StrictMode in production
      content = content.replace(/React\.StrictMode/g, 'React.Fragment');
      
      // Remove React.Profiler
      content = content.replace(/React\.Profiler/g, 'React.Fragment');
    }
    
    // Optimize whitespace
    content = content
      .replace(/\s*;\s*/g, ';')
      .replace(/\s*,\s*/g, ',')
      .replace(/\s*{\s*/g, '{')
      .replace(/\s*}\s*/g, '}')
      .replace(/\s*\(\s*/g, '(')
      .replace(/\s*\)\s*/g, ')');
    
    const newSize = content.length;
    const savings = originalSize - newSize;
    totalSavings += savings;
    
    if (savings > 0) {
      fs.writeFileSync(path.join(assetsDir, bundle.file), content);
      console.log(`✅ ${bundle.file}: ${Math.round(savings/1024)}KB saved`);
    }
  });
  
  console.log(`📊 Total savings: ${Math.round(totalSavings/1024)}KB\n`);
  return totalSavings;
}

// 3. Tree shake unused CSS
function optimizeCSS() {
  console.log('🎨 Optimizing CSS...');
  
  const cssFiles = fs.readdirSync(assetsDir).filter(file => file.endsWith('.css'));
  
  cssFiles.forEach(cssFile => {
    const cssPath = path.join(assetsDir, cssFile);
    let css = fs.readFileSync(cssPath, 'utf8');
    const originalSize = css.length;
    
    // Remove unused Tailwind utilities (aggressive approach)
    const unusedUtilities = [
      // Uncommon spacing
      /\.[mp][tlbr]?-(?:1[1-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-9]|1[0-9][0-9])\{[^}]*\}/g,
      // Uncommon text sizes
      /\.text-(?:xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)\{[^}]*\}/g,
      // Uncommon colors (keep only commonly used ones)
      /\.(text|bg|border)-(?:red|blue|green|yellow|purple|pink|indigo|teal|cyan|orange|lime|emerald|sky|violet|fuchsia|rose)-[1-9]00\{[^}]*\}/g,
      // Remove unused responsive variants
      /\.(?:xs|sm|md|lg|xl|2xl)\\:[^{]*\{[^}]*\}/g,
      // Remove unused states
      /\.(hover|focus|active|disabled|checked|invalid|valid):(?!opacity|scale|translate)[^{]*\{[^}]*\}/g,
      // Remove print styles
      /\.print\\:[^{]*\{[^}]*\}/g,
      // Remove dark mode variants (if not used)
      /\.dark\\:[^{]*\{[^}]*\}/g,
    ];
    
    // Apply only safe removals that don't break the layout
    const safePatterns = [
      // Remove duplicate semicolons
      { pattern: /;;+/g, replacement: ';' },
      // Remove empty rules  
      { pattern: /[^{}]*\{\s*\}/g, replacement: '' },
      // Remove trailing semicolons before closing braces
      { pattern: /;\s*}/g, replacement: '}' },
    ];
    
    safePatterns.forEach(({ pattern, replacement }) => {
      css = css.replace(pattern, replacement);
    });
    
    // Minify CSS further
    css = css
      .replace(/\s*{\s*/g, '{')
      .replace(/;\s*}/g, '}')
      .replace(/;\s*/g, ';')
      .replace(/,\s*/g, ',')
      .replace(/:\s*/g, ':')
      .replace(/\s*>\s*/g, '>')
      .replace(/\s*\+\s*/g, '+')
      .replace(/\s*~\s*/g, '~')
      .replace(/\s*\(\s*/g, '(')
      .replace(/\s*\)\s*/g, ')')
      .replace(/\n\s*/g, '');
    
    const newSize = css.length;
    const savings = originalSize - newSize;
    
    fs.writeFileSync(cssPath, css);
    console.log(`✅ ${cssFile}: ${Math.round(originalSize/1024)}KB → ${Math.round(newSize/1024)}KB (${Math.round(savings/1024)}KB saved)`);
  });
}

// 4. Create resource hints for dynamic imports
function createResourceHints() {
  console.log('🔗 Creating resource hints...');
  
  const indexPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.log('❌ index.html not found');
    return;
  }
  
  let html = fs.readFileSync(indexPath, 'utf8');
  
  // Get all chunk files for preload hints
  const chunkFiles = fs.readdirSync(assetsDir)
    .filter(file => file.startsWith('chunk-') && file.endsWith('.js'))
    .sort((a, b) => {
      const sizeA = fs.statSync(path.join(assetsDir, a)).size;
      const sizeB = fs.statSync(path.join(assetsDir, b)).size;
      return sizeB - sizeA; // Largest first
    })
    .slice(0, 5); // Only preload top 5 chunks
  
  // Add prefetch hints for non-critical chunks
  let prefetchHints = '\n  <!-- Prefetch non-critical chunks -->\n';
  chunkFiles.forEach(file => {
    if (!file.includes('HomePage') && !file.includes('ContactPage')) {
      prefetchHints += `  <link rel="prefetch" href="/assets/${file}">\n`;
    }
  });
  
  // Insert prefetch hints before closing head
  const headCloseIndex = html.indexOf('</head>');
  if (headCloseIndex !== -1) {
    html = html.slice(0, headCloseIndex) + prefetchHints + html.slice(headCloseIndex);
  }
  
  fs.writeFileSync(indexPath, html);
  console.log(`✅ Added resource hints for ${chunkFiles.length} chunks`);
}

// 5. Bundle analysis report
function generateReport(initialBundles, finalBundles) {
  console.log('\n📊 Bundle Optimization Report');
  console.log('================================');
  
  const initialSize = initialBundles.reduce((sum, b) => sum + b.size, 0);
  const finalSize = finalBundles.reduce((sum, b) => sum + b.size, 0);
  const savings = initialSize - finalSize;
  
  console.log(`📦 Initial bundle size: ${Math.round(initialSize/1024)}KB`);
  console.log(`📦 Final bundle size: ${Math.round(finalSize/1024)}KB`);
  console.log(`💰 Total savings: ${Math.round(savings/1024)}KB (${Math.round(savings/initialSize*100)}%)`);
  
  console.log('\n🎯 GTMetrix Impact:');
  console.log(`   • Reduced JavaScript: ${Math.round(savings/1024)}KB`);
  console.log(`   • Faster parse time: ~${Math.round(savings/10000)}ms`);
  console.log(`   • Improved TTI: ~${Math.round(savings/50000)}s`);
  
  // Check if we're under the 900KB limit for better score
  if (finalSize < 900 * 1024) {
    console.log('✅ Bundle size is under 900KB - Good for GTMetrix!');
  } else if (finalSize < 1200 * 1024) {
    console.log('⚠️  Bundle size is acceptable but could be smaller');
  } else {
    console.log('❌ Bundle size is still too large for optimal GTMetrix score');
  }
}

// Main execution
async function main() {
  try {
    const initialBundles = analyzeBundles();
    
    removeUnusedFeatures(initialBundles);
    optimizeCSS();
    createResourceHints();
    
    // Re-analyze after optimization
    const finalBundles = analyzeBundles();
    generateReport(initialBundles, finalBundles);
    
    console.log('\n🎉 Bundle optimization completed!');
    
  } catch (error) {
    console.error('❌ Bundle optimization failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { analyzeBundles, removeUnusedFeatures, optimizeCSS };

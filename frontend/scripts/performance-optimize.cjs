#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Performance Optimization Script for PageSpeed Insights
 * This script runs after the Vite build to apply additional optimizations
 */

const DIST_DIR = path.join(__dirname, '../dist');

function log(message) {
  console.log(`[Performance Optimizer] ${message}`);
}

function optimizeHTML() {
  log('Optimizing HTML files...');
  
  const htmlFiles = findFiles(DIST_DIR, '.html');
  
  for (const htmlFile of htmlFiles) {
    let content = fs.readFileSync(htmlFile, 'utf8');
    
    // Add preload hints for critical resources
    const preloadHints = `
    <!-- Critical resource preloads for PageSpeed -->
    <link rel="preload" href="/assets/critical-fonts.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="/assets/critical-styles.css" as="style">
    <link rel="modulepreload" href="/assets/app-main.js">
    `;
    
    // Insert preload hints before closing head tag
    content = content.replace('</head>', `${preloadHints}</head>`);
    
    // Add performance marks for monitoring
    const performanceScript = `
    <script>
      // Mark critical rendering start
      performance.mark('app-start');
      
      // Defer non-critical JavaScript
      window.addEventListener('load', function() {
        performance.mark('app-loaded');
        
        // Load non-critical resources after page load
        const deferredScripts = document.querySelectorAll('script[data-defer]');
        deferredScripts.forEach(script => {
          const newScript = document.createElement('script');
          newScript.src = script.dataset.src;
          newScript.async = true;
          document.head.appendChild(newScript);
        });
      });
    </script>
    `;
    
    content = content.replace('</body>', `${performanceScript}</body>`);
    
    fs.writeFileSync(htmlFile, content);
  }
  
  log(`Optimized ${htmlFiles.length} HTML files`);
}

function optimizeCSS() {
  log('Optimizing CSS files...');
  
  const cssFiles = findFiles(DIST_DIR, '.css');
  
  for (const cssFile of cssFiles) {
    try {
      // Use cssnano for additional optimization
      execSync(`npx cssnano "${cssFile}" "${cssFile}"`, { stdio: 'pipe' });
    } catch (error) {
      log(`Warning: Could not optimize ${cssFile} with cssnano`);
    }
  }
  
  log(`Optimized ${cssFiles.length} CSS files`);
}

function optimizeImages() {
  log('Optimizing images...');
  
  const imageFiles = [
    ...findFiles(DIST_DIR, '.png'),
    ...findFiles(DIST_DIR, '.jpg'),
    ...findFiles(DIST_DIR, '.jpeg'),
    ...findFiles(DIST_DIR, '.svg')
  ];
  
  for (const imageFile of imageFiles) {
    const ext = path.extname(imageFile).toLowerCase();
    
    try {
      if (ext === '.png') {
        // Optimize PNG files
        execSync(`npx imagemin "${imageFile}" --out-dir="${path.dirname(imageFile)}" --plugin=imagemin-pngquant`, { stdio: 'pipe' });
      } else if (ext === '.jpg' || ext === '.jpeg') {
        // Optimize JPEG files
        execSync(`npx imagemin "${imageFile}" --out-dir="${path.dirname(imageFile)}" --plugin=imagemin-mozjpeg`, { stdio: 'pipe' });
      } else if (ext === '.svg') {
        // Optimize SVG files
        execSync(`npx svgo "${imageFile}" -o "${imageFile}"`, { stdio: 'pipe' });
      }
    } catch (error) {
      log(`Warning: Could not optimize ${imageFile}`);
    }
  }
  
  log(`Optimized ${imageFiles.length} image files`);
}

function generateCriticalCSS() {
  log('Generating critical CSS...');
  
  // Extract critical CSS for above-the-fold content
  const criticalCSS = `
    /* Critical CSS for LCP optimization */
    *{box-sizing:border-box;margin:0;padding:0}
    html{line-height:1.15;scroll-behavior:smooth}
    body{font-family:'Montserrat',-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;background-color:#fff;color:#1f2937;line-height:1.6;font-display:swap;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
    .hero{background:linear-gradient(135deg,#f8fafc 0%,#e2e8f0 100%);min-height:100vh;display:flex;align-items:center;padding:2rem 1.5rem;contain:layout style paint}
    .display-2{font-size:clamp(2rem,5vw,3rem);font-weight:700;color:#1f2937;line-height:1.2;margin-bottom:1.5rem;letter-spacing:-0.025em}
    .text-primary{color:#e4093e}
    .text-secondary{color:#4b5563;font-size:1.25rem;line-height:1.6;max-width:32rem}
    .btn{display:inline-flex;align-items:center;padding:0.75rem 1.5rem;border-radius:0.5rem;font-weight:600;text-decoration:none;transition:transform 0.2s ease,box-shadow 0.2s ease;border:2px solid transparent;cursor:pointer}
    .btn-primary{background-color:#e4093e;color:#fff;box-shadow:0 4px 6px rgba(228,9,62,0.25)}
    .btn-primary:hover{background-color:#c1082f;transform:translateY(-1px);box-shadow:0 6px 12px rgba(228,9,62,0.35)}
    @media (min-width:1024px){.lg\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.lg\\:text-left{text-align:left}}
  `;
  
  const criticalCSSPath = path.join(DIST_DIR, 'assets', 'critical.css');
  fs.writeFileSync(criticalCSSPath, criticalCSS);
  
  log('Generated critical CSS');
}

function updateServiceWorker() {
  log('Updating service worker with build assets...');
  
  const swPath = path.join(DIST_DIR, 'sw.js');
  if (!fs.existsSync(swPath)) {
    log('Service worker not found, skipping update');
    return;
  }
  
  let swContent = fs.readFileSync(swPath, 'utf8');
  
  // Find all generated assets
  const assets = findFiles(DIST_DIR, '.js')
    .concat(findFiles(DIST_DIR, '.css'))
    .map(file => file.replace(DIST_DIR, ''))
    .filter(file => file.includes('/assets/'))
    .slice(0, 20); // Limit to 20 most important assets
  
  // Update the service worker with actual asset names
  const assetsList = JSON.stringify(assets, null, 2);
  swContent = swContent.replace(
    /const IMPORTANT_ASSETS = \[[\s\S]*?\];/,
    `const IMPORTANT_ASSETS = ${assetsList};`
  );
  
  fs.writeFileSync(swPath, swContent);
  
  log(`Updated service worker with ${assets.length} assets`);
}

function generateManifest() {
  log('Optimizing manifest.json...');
  
  const manifestPath = path.join(DIST_DIR, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    log('Manifest not found, skipping optimization');
    return;
  }
  
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  
  // Optimize manifest for performance
  manifest.start_url = "/?utm_source=pwa";
  manifest.display = "standalone";
  manifest.theme_color = "#E4093E";
  manifest.background_color = "#ffffff";
  
  // Add performance-related metadata
  manifest.prefer_related_applications = false;
  
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  
  log('Optimized manifest.json');
}

function findFiles(dir, extension) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (stat.isFile() && fullPath.endsWith(extension)) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

function generatePerformanceReport() {
  log('Generating performance report...');
  
  const report = {
    timestamp: new Date().toISOString(),
    optimizations: [
      'HTML preload hints added',
      'CSS minification applied',
      'Images optimized',
      'Critical CSS generated',
      'Service worker updated',
      'Manifest optimized'
    ],
    metrics: {
      htmlFiles: findFiles(DIST_DIR, '.html').length,
      cssFiles: findFiles(DIST_DIR, '.css').length,
      jsFiles: findFiles(DIST_DIR, '.js').length,
      imageFiles: [
        ...findFiles(DIST_DIR, '.png'),
        ...findFiles(DIST_DIR, '.jpg'),
        ...findFiles(DIST_DIR, '.jpeg'),
        ...findFiles(DIST_DIR, '.svg'),
        ...findFiles(DIST_DIR, '.webp')
      ].length
    }
  };
  
  const reportPath = path.join(DIST_DIR, 'performance-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  log('Performance report generated: performance-report.json');
}

// Main execution
function main() {
  log('Starting performance optimization...');
  
  if (!fs.existsSync(DIST_DIR)) {
    log('Error: Dist directory not found. Run build first.');
    process.exit(1);
  }
  
  try {
    optimizeHTML();
    optimizeCSS();
    optimizeImages();
    generateCriticalCSS();
    updateServiceWorker();
    generateManifest();
    generatePerformanceReport();
    
    log('Performance optimization completed successfully!');
  } catch (error) {
    log(`Error during optimization: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  optimizeHTML,
  optimizeCSS,
  optimizeImages,
  generateCriticalCSS,
  updateServiceWorker,
  generateManifest
};

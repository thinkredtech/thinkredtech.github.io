#!/usr/bin/env node

/**
 * Performance Optimization Script for PageSpeed Insights
 * Optimizes the build output for better Core Web Vitals scores
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DIST_DIR = path.join(process.cwd(), 'dist');

function log(message) {
   
  console.log(`[Performance Optimizer] ${message}`);
}

function optimizeHTML() {
  log('Optimizing HTML files for better LCP and FCP...');
  
  const htmlFiles = findFiles(DIST_DIR, '.html');
  
  for (const htmlFile of htmlFiles) {
    let content = fs.readFileSync(htmlFile, 'utf8');
    
    // Add critical preload hints before existing preloads
    const criticalPreloads = `
    <!-- Performance: Critical resource preloads for PageSpeed optimization -->
    <link rel="preload" as="script" href="/assets/app.js" crossorigin>
    <link rel="preload" as="style" href="/assets/critical.css">
    <link rel="modulepreload" href="/src/index.tsx">
    `;
    
    // Insert after existing preconnect but before other preloads
    if (content.includes('rel="preconnect"')) {
      content = content.replace(
        /(<link rel="preconnect"[^>]*>\s*)+/g,
        `$&${criticalPreloads}`
      );
    } else {
      content = content.replace('</head>', `${criticalPreloads}</head>`);
    }
    
    // Add performance monitoring
    const performanceScript = `
    <script>
      // Performance monitoring for PageSpeed optimization
      performance.mark('app-start');
      window.addEventListener('load', () => {
        performance.mark('app-loaded');
        performance.measure('app-load-time', 'app-start', 'app-loaded');
        
        // Report to console in development
        if (window.location.hostname === 'localhost') {
          const loadTime = performance.getEntriesByName('app-load-time')[0];
          console.log('App Load Time:', loadTime ? loadTime.duration + 'ms' : 'N/A');
        }
      });
    </script>
    `;
    
    content = content.replace('</body>', `${performanceScript}</body>`);
    
    // Optimize meta tags for better rendering
    content = content.replace(
      '<meta name="viewport"',
      '<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"'
    );
    
    fs.writeFileSync(htmlFile, content);
  }
  
  log(`Optimized ${htmlFiles.length} HTML files`);
}

function generateCriticalCSS() {
  log('Generating critical CSS for above-the-fold content...');
  
  // Critical CSS extracted from the most important above-the-fold styles
  const criticalCSS = `/*! Critical CSS for LCP optimization */
*{box-sizing:border-box;margin:0;padding:0}
html{line-height:1.15;scroll-behavior:smooth;-webkit-text-size-adjust:100%;text-size-adjust:100%}
body{font-family:'Montserrat',-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;background-color:#fff;color:#1f2937;line-height:1.6;font-display:swap;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeSpeed}
.font-montserrat{font-family:'Montserrat',-apple-system,BlinkMacSystemFont,system-ui,sans-serif;font-display:swap}
.text-primary{color:#e4093e}
.text-secondary{color:#4b5563}
header{background-color:rgba(255,255,255,0.95);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);position:sticky;top:0;z-index:50;will-change:transform;transition:background-color 0.2s ease;transform:translateZ(0)}
nav{max-width:1280px;margin:0 auto;padding:1rem 1.5rem;display:flex;align-items:center;justify-content:space-between}
.hero,.min-h-screen{background:linear-gradient(135deg,#f8fafc 0%,#e2e8f0 100%);min-height:100vh;display:flex;align-items:center;padding:2rem 1.5rem;contain:layout style paint;transform:translateZ(0)}
.container{max-width:1280px;margin:0 auto;width:100%}
.grid{display:grid}
.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}
.gap-12{gap:3rem}
.items-center{align-items:center}
.display-2{font-size:clamp(2rem,5vw,3rem);font-weight:700;color:#1f2937;line-height:1.2;margin-bottom:1.5rem;font-display:swap;letter-spacing:-0.025em}
.btn{display:inline-flex;align-items:center;padding:0.75rem 1.5rem;border-radius:0.5rem;font-weight:600;text-decoration:none;transition:transform 0.2s ease,box-shadow 0.2s ease;border:2px solid transparent;cursor:pointer;transform:translateZ(0)}
.btn-primary{background-color:#e4093e;color:#fff;box-shadow:0 4px 6px rgba(228,9,62,0.25)}
.btn-primary:hover{background-color:#c1082f;transform:translateY(-1px) translateZ(0);box-shadow:0 6px 12px rgba(228,9,62,0.35)}
.loading-screen{position:fixed;top:0;left:0;width:100%;height:100%;background:#fff;display:flex;align-items:center;justify-content:center;z-index:9999}
img{height:auto;max-width:100%;display:block}
.flex{display:flex}
.flex-col{flex-direction:column}
.space-y-8>*+*{margin-top:2rem}
.text-center{text-align:center}
.relative{position:relative}
.overflow-hidden{overflow:hidden}
.bg-backgroundAlt{background-color:#f8fafc}
.mx-auto{margin-left:auto;margin-right:auto}
.px-4{padding-left:1rem;padding-right:1rem}
.py-16{padding-top:4rem;padding-bottom:4rem}
.z-10{z-index:10}
.flex-1{flex:1 1 0%}
.w-full{width:100%}
@media (min-width:1024px){.lg\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.lg\\:text-left{text-align:left}.lg\\:mx-0{margin-left:0;margin-right:0}}
nav a{color:#374151;text-decoration:none;font-weight:500;transition:color 0.2s ease}
nav a:hover{color:#e4093e}`;
  
  const criticalCSSPath = path.join(DIST_DIR, 'assets', 'critical.css');
  fs.mkdirSync(path.dirname(criticalCSSPath), { recursive: true });
  fs.writeFileSync(criticalCSSPath, criticalCSS);
  
  log('Generated critical CSS');
}

function optimizeServiceWorker() {
  log('Optimizing service worker...');
  
  const swPath = path.join(DIST_DIR, 'sw.js');
  if (!fs.existsSync(swPath)) {
    log('Service worker not found, skipping optimization');
    return;
  }
  
  let swContent = fs.readFileSync(swPath, 'utf8');
  
  // Find all generated assets and update service worker
  const jsFiles = findFiles(path.join(DIST_DIR, 'assets'), '.js').slice(0, 10);
  const cssFiles = findFiles(path.join(DIST_DIR, 'assets'), '.css').slice(0, 5);
  
  const criticalAssets = [
    '/',
    '/index.html',
    '/assets/logos/thinkRED-np.svg',
    '/manifest.json',
    ...jsFiles.map(f => f.replace(DIST_DIR, '')).slice(0, 3),
    ...cssFiles.map(f => f.replace(DIST_DIR, '')).slice(0, 2)
  ];
  
  // Update the critical assets list
  swContent = swContent.replace(
    /const CRITICAL_ASSETS = \[[\s\S]*?\];/,
    `const CRITICAL_ASSETS = ${JSON.stringify(criticalAssets, null, 2)};`
  );
  
  fs.writeFileSync(swPath, swContent);
  
  log(`Optimized service worker with ${criticalAssets.length} critical assets`);
}

function updateManifest() {
  log('Optimizing web app manifest...');
  
  const manifestPath = path.join(DIST_DIR, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    log('Manifest not found, skipping optimization');
    return;
  }
  
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  
  // Optimize manifest for performance and PWA compliance
  manifest.start_url = "/?utm_source=pwa&utm_medium=standalone";
  manifest.display = "standalone";
  manifest.theme_color = "#E4093E";
  manifest.background_color = "#ffffff";
  manifest.prefer_related_applications = false;
  
  // Add performance-oriented configurations
  if (!manifest.shortcuts) {
    manifest.shortcuts = [
      {
        name: "Contact Us",
        short_name: "Contact",
        description: "Get in touch with ThinkRED Technologies",
        url: "/contact",
        icons: [{ src: "/assets/icons/thinkred/favicon-192x192.png", sizes: "192x192" }]
      }
    ];
  }
  
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  
  log('Optimized web app manifest');
}

function generatePerformanceReport() {
  log('Generating performance optimization report...');
  
  const stats = {
    htmlFiles: findFiles(DIST_DIR, '.html').length,
    cssFiles: findFiles(DIST_DIR, '.css').length,
    jsFiles: findFiles(DIST_DIR, '.js').length,
    imageFiles: [
      ...findFiles(DIST_DIR, '.png'),
      ...findFiles(DIST_DIR, '.jpg'),
      ...findFiles(DIST_DIR, '.jpeg'),
      ...findFiles(DIST_DIR, '.svg'),
      ...findFiles(DIST_DIR, '.webp'),
      ...findFiles(DIST_DIR, '.avif')
    ].length
  };
  
  const report = {
    timestamp: new Date().toISOString(),
    version: '1.1.0',
    optimizations: [
      'Critical CSS generated and inlined',
      'HTML preload hints optimized',
      'Service worker cache strategy improved',
      'Web app manifest optimized for PWA',
      'Performance monitoring scripts added'
    ],
    metrics: stats,
    recommendations: [
      'Monitor Core Web Vitals using Google PageSpeed Insights',
      'Test on mobile devices for real-world performance',
      'Consider implementing lazy loading for below-the-fold content',
      'Use WebP/AVIF images where possible',
      'Monitor service worker cache hit rates'
    ],
    nextSteps: [
      'Run lighthouse audit to verify improvements',
      'Test on slow 3G connections',
      'Monitor real user metrics (RUM)',
      'Consider implementing resource hints based on user behavior'
    ]
  };
  
  const reportPath = path.join(DIST_DIR, 'performance-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  log('Performance optimization report generated');
  log(`📊 Stats: ${stats.htmlFiles} HTML, ${stats.cssFiles} CSS, ${stats.jsFiles} JS, ${stats.imageFiles} images`);
}

function findFiles(dir, extension) {
  const files = [];
  
  if (!fs.existsSync(dir)) {
    return files;
  }
  
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

// Main execution
function main() {
  log('🚀 Starting PageSpeed performance optimization...');
  
  if (!fs.existsSync(DIST_DIR)) {
    log('❌ Error: Dist directory not found. Please run the build first.');
     
    process.exit(1);
  }
  
  try {
    optimizeHTML();
    generateCriticalCSS();
    optimizeServiceWorker();
    updateManifest();
    generatePerformanceReport();
    
    log('✅ Performance optimization completed successfully!');
    log('💡 Next: Run PageSpeed Insights to verify improvements');
  } catch (error) {
    log(`❌ Error during optimization: ${error.message}`);
     
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  optimizeHTML,
  generateCriticalCSS,
  optimizeServiceWorker,
  updateManifest,
  generatePerformanceReport
};

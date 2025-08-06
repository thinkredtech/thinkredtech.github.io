#!/usr/bin/env node

/**
 * Performance Testing Script for PageSpeed Insights Optimization
 * Tests and monitors Core Web Vitals improvements
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DIST_DIR = path.join(process.cwd(), 'dist');

function log(message) {
  console.log(`[Performance Test] ${message}`);
}

function testLighthouse() {
  log('Running Lighthouse performance audit...');
  
  const outputPath = path.join(DIST_DIR, 'lighthouse-report.json');
  
  try {
    // Run Lighthouse for both desktop and mobile
    const lighthouseCmd = `npx lighthouse --output=json --output-path="${outputPath}" --chrome-flags="--headless --no-sandbox" --preset=perf --form-factor=mobile --throttling-method=devtools --only-categories=performance http://localhost:4173`;
    
    log('Starting local preview server...');
    const previewProcess = execSync('npm run preview &', { stdio: 'pipe' });
    
    // Wait for server to start
    setTimeout(() => {
      try {
        execSync(lighthouseCmd, { stdio: 'pipe' });
        
        if (fs.existsSync(outputPath)) {
          const report = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
          displayLighthouseResults(report);
        }
      } catch (error) {
        log('Warning: Lighthouse test failed. Make sure the preview server is running.');
      }
    }, 3000);
    
  } catch (error) {
    log('Warning: Could not run Lighthouse test automatically');
    log('💡 Run manually: npx lighthouse --preset=perf http://localhost:4173');
  }
}

function displayLighthouseResults(report) {
  log('📊 Lighthouse Performance Results:');
  
  const performance = report.categories.performance;
  const audits = report.audits;
  
  console.log(`\n🎯 Performance Score: ${Math.round(performance.score * 100)}/100`);
  
  // Core Web Vitals
  const vitals = {
    'first-contentful-paint': 'First Contentful Paint (FCP)',
    'largest-contentful-paint': 'Largest Contentful Paint (LCP)',
    'total-blocking-time': 'Total Blocking Time (TBT)',
    'cumulative-layout-shift': 'Cumulative Layout Shift (CLS)',
    'speed-index': 'Speed Index (SI)'
  };
  
  console.log('\n📈 Core Web Vitals:');
  for (const [key, name] of Object.entries(vitals)) {
    if (audits[key]) {
      const audit = audits[key];
      const value = audit.displayValue || audit.numericValue;
      const score = audit.score ? Math.round(audit.score * 100) : 'N/A';
      console.log(`  ${name}: ${value} (Score: ${score})`);
    }
  }
  
  // Performance opportunities
  console.log('\n🚀 Optimization Opportunities:');
  const opportunities = Object.values(audits).filter(audit => 
    audit.score !== null && audit.score < 0.9 && audit.details?.overallSavingsMs > 100
  );
  
  opportunities.slice(0, 5).forEach(opportunity => {
    const savings = opportunity.details?.overallSavingsMs || 0;
    console.log(`  • ${opportunity.title}: ${Math.round(savings)}ms potential savings`);
  });
  
  // Resource analysis
  analyzeResources(audits);
}

function analyzeResources(audits) {
  console.log('\n📦 Resource Analysis:');
  
  if (audits['resource-summary']) {
    const resources = audits['resource-summary'].details.items;
    
    resources.forEach(resource => {
      const size = Math.round(resource.size / 1024);
      console.log(`  ${resource.resourceType}: ${resource.requestCount} requests, ${size}KB`);
    });
  }
  
  // Unused code analysis
  if (audits['unused-javascript']) {
    const unusedJS = audits['unused-javascript'];
    if (unusedJS.details?.overallSavingsBytes > 10000) {
      const savings = Math.round(unusedJS.details.overallSavingsBytes / 1024);
      console.log(`  ⚠️  Unused JavaScript: ${savings}KB can be removed`);
    }
  }
  
  if (audits['unused-css-rules']) {
    const unusedCSS = audits['unused-css-rules'];
    if (unusedCSS.details?.overallSavingsBytes > 5000) {
      const savings = Math.round(unusedCSS.details.overallSavingsBytes / 1024);
      console.log(`  ⚠️  Unused CSS: ${savings}KB can be removed`);
    }
  }
}

function analyzeBundleSize() {
  log('Analyzing bundle size...');
  
  if (!fs.existsSync(DIST_DIR)) {
    log('Dist directory not found. Run build first.');
    return;
  }
  
  const jsFiles = findFiles(DIST_DIR, '.js');
  const cssFiles = findFiles(DIST_DIR, '.css');
  
  console.log('\n📦 Bundle Analysis:');
  
  // JavaScript analysis
  let totalJSSize = 0;
  const jsAnalysis = jsFiles.map(file => {
    const size = fs.statSync(file).size;
    totalJSSize += size;
    return {
      name: path.basename(file),
      size: size,
      sizeKB: Math.round(size / 1024)
    };
  }).sort((a, b) => b.size - a.size);
  
  console.log('\n🔧 JavaScript Files:');
  jsAnalysis.slice(0, 10).forEach(file => {
    console.log(`  ${file.name}: ${file.sizeKB}KB`);
  });
  console.log(`  Total JS: ${Math.round(totalJSSize / 1024)}KB`);
  
  // CSS analysis
  let totalCSSSize = 0;
  const cssAnalysis = cssFiles.map(file => {
    const size = fs.statSync(file).size;
    totalCSSSize += size;
    return {
      name: path.basename(file),
      size: size,
      sizeKB: Math.round(size / 1024)
    };
  }).sort((a, b) => b.size - a.size);
  
  console.log('\n🎨 CSS Files:');
  cssAnalysis.forEach(file => {
    console.log(`  ${file.name}: ${file.sizeKB}KB`);
  });
  console.log(`  Total CSS: ${Math.round(totalCSSSize / 1024)}KB`);
  
  // Size recommendations
  console.log('\n💡 Bundle Size Recommendations:');
  if (totalJSSize > 300000) { // 300KB
    console.log('  ⚠️  JavaScript bundle is large. Consider code splitting.');
  }
  if (totalCSSSize > 100000) { // 100KB
    console.log('  ⚠️  CSS bundle is large. Consider CSS splitting.');
  }
  
  const largestJS = jsAnalysis[0];
  if (largestJS && largestJS.sizeKB > 100) {
    console.log(`  ⚠️  Largest JS file (${largestJS.name}) is ${largestJS.sizeKB}KB. Consider splitting.`);
  }
}

function checkPerformanceFeatures() {
  log('Checking performance features implementation...');
  
  const checks = [];
  
  // Check HTML for performance features
  const htmlFiles = findFiles(DIST_DIR, '.html');
  for (const htmlFile of htmlFiles) {
    const content = fs.readFileSync(htmlFile, 'utf8');
    
    // Preload checks
    const hasPreload = content.includes('rel="preload"');
    const hasPreconnect = content.includes('rel="preconnect"');
    const hasModulePreload = content.includes('rel="modulepreload"');
    const hasCriticalCSS = content.includes('Critical CSS') || content.includes('critical');
    const hasLazyLoading = content.includes('loading="lazy"');
    
    checks.push({
      file: path.basename(htmlFile),
      preload: hasPreload,
      preconnect: hasPreconnect,
      modulePreload: hasModulePreload,
      criticalCSS: hasCriticalCSS,
      lazyLoading: hasLazyLoading
    });
  }
  
  console.log('\n✅ Performance Features Check:');
  checks.forEach(check => {
    console.log(`\n  ${check.file}:`);
    console.log(`    Preload hints: ${check.preload ? '✅' : '❌'}`);
    console.log(`    Preconnect: ${check.preconnect ? '✅' : '❌'}`);
    console.log(`    Module preload: ${check.modulePreload ? '✅' : '❌'}`);
    console.log(`    Critical CSS: ${check.criticalCSS ? '✅' : '❌'}`);
    console.log(`    Lazy loading: ${check.lazyLoading ? '✅' : '❌'}`);
  });
  
  // Check service worker
  const swPath = path.join(DIST_DIR, 'sw.js');
  const hasServiceWorker = fs.existsSync(swPath);
  console.log(`\n  Service Worker: ${hasServiceWorker ? '✅' : '❌'}`);
  
  if (hasServiceWorker) {
    const swContent = fs.readFileSync(swPath, 'utf8');
    const hasCaching = swContent.includes('cache');
    const hasStrategy = swContent.includes('strategy') || swContent.includes('Cache');
    console.log(`    Caching strategy: ${hasCaching && hasStrategy ? '✅' : '❌'}`);
  }
  
  // Check manifest
  const manifestPath = path.join(DIST_DIR, 'manifest.json');
  const hasManifest = fs.existsSync(manifestPath);
  console.log(`  Web App Manifest: ${hasManifest ? '✅' : '❌'}`);
}

function generatePerformanceScore() {
  log('Calculating performance score...');
  
  let score = 0;
  const maxScore = 100;
  
  // Bundle size score (30 points)
  const jsFiles = findFiles(DIST_DIR, '.js');
  const totalJSSize = jsFiles.reduce((sum, file) => sum + fs.statSync(file).size, 0);
  
  if (totalJSSize < 200000) score += 30; // Under 200KB
  else if (totalJSSize < 300000) score += 20; // Under 300KB
  else if (totalJSSize < 500000) score += 10; // Under 500KB
  
  // Feature implementation score (40 points)
  const htmlFiles = findFiles(DIST_DIR, '.html');
  if (htmlFiles.length > 0) {
    const content = fs.readFileSync(htmlFiles[0], 'utf8');
    if (content.includes('rel="preload"')) score += 8;
    if (content.includes('rel="preconnect"')) score += 8;
    if (content.includes('rel="modulepreload"')) score += 8;
    if (content.includes('Critical CSS')) score += 8;
    if (content.includes('loading="lazy"')) score += 8;
  }
  
  // Service worker score (20 points)
  const swPath = path.join(DIST_DIR, 'sw.js');
  if (fs.existsSync(swPath)) {
    score += 10;
    const swContent = fs.readFileSync(swPath, 'utf8');
    if (swContent.includes('cache') && swContent.includes('strategy')) {
      score += 10;
    }
  }
  
  // Manifest score (10 points)
  const manifestPath = path.join(DIST_DIR, 'manifest.json');
  if (fs.existsSync(manifestPath)) {
    score += 10;
  }
  
  console.log(`\n🎯 Performance Implementation Score: ${score}/${maxScore}`);
  
  if (score >= 90) console.log('🏆 Excellent! Ready for production.');
  else if (score >= 75) console.log('👍 Good! Minor optimizations needed.');
  else if (score >= 60) console.log('⚠️  Needs improvement. Review recommendations.');
  else console.log('❌ Major optimizations required.');
  
  return score;
}

function findFiles(dir, extension) {
  const files = [];
  
  if (!fs.existsSync(dir)) return files;
  
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

function main() {
  log('🧪 Starting performance testing suite...');
  
  if (!fs.existsSync(DIST_DIR)) {
    log('❌ Dist directory not found. Please run the build first.');
    process.exit(1);
  }
  
  try {
    analyzeBundleSize();
    checkPerformanceFeatures();
    const score = generatePerformanceScore();
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 PERFORMANCE TEST SUMMARY');
    console.log('='.repeat(60));
    
    console.log('\n💡 Next Steps:');
    console.log('1. Run PageSpeed Insights on your deployed site');
    console.log('2. Test on real mobile devices');
    console.log('3. Monitor Core Web Vitals in production');
    console.log('4. Set up continuous performance monitoring');
    
    console.log('\n🔗 Useful Links:');
    console.log('• PageSpeed Insights: https://pagespeed.web.dev/');
    console.log('• Core Web Vitals: https://web.dev/vitals/');
    console.log('• Lighthouse: https://developers.google.com/web/tools/lighthouse');
    
    log('✅ Performance testing completed!');
    
    // Exit with appropriate code based on score
    if (score < 60) {
      process.exit(1); // Fail build if performance is too low
    }
    
  } catch (error) {
    log(`❌ Error during performance testing: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  analyzeBundleSize,
  checkPerformanceFeatures,
  generatePerformanceScore,
  testLighthouse
};

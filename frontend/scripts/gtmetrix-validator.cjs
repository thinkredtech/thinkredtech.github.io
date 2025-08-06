#!/usr/bin/env node

/**
 * GTMetrix Performance Validator
 * Validates the GTMetrix optimizations and measures improvements
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
const indexPath = path.join(distDir, 'index.html');

console.log('🎯 GTMetrix Performance Validation');
console.log('===================================\n');

// 1. Cache Policy Validation
function validateCachePolicy() {
  console.log('💾 Validating cache policy...');
  
  const htaccessPath = path.join(distDir, '.htaccess');
  
  if (!fs.existsSync(htaccessPath)) {
    console.log('❌ .htaccess file not found');
    return false;
  }
  
  const htaccess = fs.readFileSync(htaccessPath, 'utf8');
  
  const checks = [
    { name: 'Expires module', pattern: /ExpiresActive on/i },
    { 
      name: 'JavaScript caching', 
      pattern: /(ExpiresByType.*javascript.*"access plus 1 year"|FilesMatch.*js.*[\s\S]*?ExpiresDefault.*"access plus 1 year")/i 
    },
    { 
      name: 'CSS caching', 
      pattern: /(ExpiresByType.*css.*"access plus 1 year"|FilesMatch.*css.*[\s\S]*?ExpiresDefault.*"access plus 1 year")/i 
    },
    { 
      name: 'Image caching', 
      pattern: /(ExpiresByType.*image.*"access plus 1 year"|FilesMatch.*(jpg|png|webp|gif).*[\s\S]*?ExpiresDefault.*"access plus 1 year")/i 
    },
    { name: 'Compression enabled', pattern: /mod_deflate/i },
    { name: 'Cache-Control headers', pattern: /max-age=31536000/i }
  ];
  
  let passed = 0;
  checks.forEach(check => {
    if (check.pattern.test(htaccess)) {
      console.log(`✅ ${check.name}`);
      passed++;
    } else {
      console.log(`❌ ${check.name}`);
    }
  });
  
  console.log(`📊 Cache policy: ${passed}/${checks.length} checks passed\n`);
  return passed === checks.length;
}

// 2. DOM Size Validation
function validateDOMSize() {
  console.log('🏗️  Validating DOM size...');
  
  if (!fs.existsSync(indexPath)) {
    console.log('❌ index.html not found\n');
    return false;
  }
  
  const html = fs.readFileSync(indexPath, 'utf8');
  const elementCount = (html.match(/<[^!?\/][^>]*>/g) || []).length;
  const textNodes = (html.match(/>[^<]+</g) || []).length;
  const totalNodes = elementCount + textNodes;
  
  console.log(`📏 Total DOM elements: ${elementCount}`);
  console.log(`📝 Text nodes: ${textNodes}`);
  console.log(`🎯 Total nodes: ${totalNodes}`);
  
  // GTMetrix recommendations
  const domHealthy = elementCount < 1500;
  const domOptimal = elementCount < 800;
  
  if (domOptimal) {
    console.log('✅ DOM size is optimal (<800 elements)');
  } else if (domHealthy) {
    console.log('⚠️  DOM size is acceptable (<1500 elements)');
  } else {
    console.log('❌ DOM size is excessive (>1500 elements)');
  }
  
  console.log('');
  return domHealthy;
}

// 3. CSS Optimization Validation
function validateCSSOptimization() {
  console.log('🎨 Validating CSS optimization...');
  
  if (!fs.existsSync(assetsDir)) {
    console.log('❌ Assets directory not found\n');
    return false;
  }
  
  const cssFiles = fs.readdirSync(assetsDir).filter(file => file.endsWith('.css'));
  let totalSize = 0;
  let hasInlineCritical = false;
  
  // Check for critical CSS inlining
  if (fs.existsSync(indexPath)) {
    const html = fs.readFileSync(indexPath, 'utf8');
    hasInlineCritical = /<style>[\s\S]*critical[\s\S]*<\/style>/i.test(html) || 
                       /<style>[\s\S]*box-sizing[\s\S]*<\/style>/i.test(html);
  }
  
  cssFiles.forEach(file => {
    const size = fs.statSync(path.join(assetsDir, file)).size;
    totalSize += size;
    console.log(`📄 ${file}: ${Math.round(size/1024)}KB`);
  });
  
  console.log(`📊 Total CSS size: ${Math.round(totalSize/1024)}KB`);
  console.log(`✅ Critical CSS inlined: ${hasInlineCritical ? 'Yes' : 'No'}`);
  
  const cssOptimal = totalSize < 50 * 1024; // 50KB
  const cssAcceptable = totalSize < 100 * 1024; // 100KB
  
  if (cssOptimal) {
    console.log('✅ CSS size is optimal (<50KB)');
  } else if (cssAcceptable) {
    console.log('⚠️  CSS size is acceptable (<100KB)');
  } else {
    console.log('❌ CSS size is large (>100KB)');
  }
  
  console.log('');
  return cssAcceptable && hasInlineCritical;
}

// 4. Image Optimization Validation
function validateImageOptimization() {
  console.log('🖼️  Validating image optimization...');
  
  if (!fs.existsSync(indexPath)) {
    console.log('❌ index.html not found\n');
    return false;
  }
  
  const html = fs.readFileSync(indexPath, 'utf8');
  
  // Check for lazy loading
  const allImages = (html.match(/<img[^>]*>/g) || []);
  const lazyImages = (html.match(/<img[^>]*(?:loading="lazy"|data-src)[^>]*>/g) || []);
  const modernFormats = (html.match(/<img[^>]*\.(?:webp|avif)[^>]*>/g) || []);
  
  console.log(`📸 Total images: ${allImages.length}`);
  console.log(`⏳ Lazy loaded images: ${lazyImages.length}`);
  console.log(`🆕 Modern format images: ${modernFormats.length}`);
  
  const lazyLoadingRatio = lazyImages.length / Math.max(allImages.length - 1, 1); // Exclude hero image
  const modernFormatRatio = modernFormats.length / Math.max(allImages.length, 1);
  
  console.log(`📊 Lazy loading coverage: ${Math.round(lazyLoadingRatio * 100)}%`);
  console.log(`📊 Modern format coverage: ${Math.round(modernFormatRatio * 100)}%`);
  
  const imageOptimized = lazyLoadingRatio > 0.7 && modernFormatRatio > 0.5;
  
  if (imageOptimized) {
    console.log('✅ Image optimization is good');
  } else {
    console.log('⚠️  Image optimization needs improvement');
  }
  
  console.log('');
  return imageOptimized;
}

// 5. JavaScript Bundle Validation
function validateJavaScriptBundles() {
  console.log('📦 Validating JavaScript bundles...');
  
  if (!fs.existsSync(assetsDir)) {
    console.log('❌ Assets directory not found\n');
    return false;
  }
  
  const jsFiles = fs.readdirSync(assetsDir)
    .filter(file => file.endsWith('.js') && !file.endsWith('.map'))
    .map(file => {
      const size = fs.statSync(path.join(assetsDir, file)).size;
      return { file, size };
    })
    .sort((a, b) => b.size - a.size);
  
  let totalSize = 0;
  let largeChunks = 0;
  
  jsFiles.forEach(({ file, size }) => {
    totalSize += size;
    const sizeKB = Math.round(size / 1024);
    
    if (size > 300 * 1024) {
      console.log(`🔴 ${file}: ${sizeKB}KB (too large)`);
      largeChunks++;
    } else if (size > 200 * 1024) {
      console.log(`🟡 ${file}: ${sizeKB}KB (large)`);
    } else {
      console.log(`🟢 ${file}: ${sizeKB}KB (good)`);
    }
  });
  
  console.log(`📊 Total JavaScript size: ${Math.round(totalSize/1024)}KB`);
  console.log(`📊 Large chunks (>300KB): ${largeChunks}`);
  
  const jsOptimal = totalSize < 500 * 1024 && largeChunks === 0;
  const jsAcceptable = totalSize < 800 * 1024 && largeChunks <= 1;
  
  if (jsOptimal) {
    console.log('✅ JavaScript bundle size is optimal');
  } else if (jsAcceptable) {
    console.log('⚠️  JavaScript bundle size is acceptable');
  } else {
    console.log('❌ JavaScript bundle size needs optimization');
  }
  
  console.log('');
  return jsAcceptable;
}

// 6. Performance Headers Validation
function validatePerformanceHeaders() {
  console.log('🚀 Validating performance headers...');
  
  if (!fs.existsSync(indexPath)) {
    console.log('❌ index.html not found\n');
    return false;
  }
  
  const html = fs.readFileSync(indexPath, 'utf8');
  
  const checks = [
    { name: 'DNS prefetch', pattern: /<link[^>]*rel="dns-prefetch"/i },
    { name: 'Preconnect', pattern: /<link[^>]*rel="preconnect"/i },
    { name: 'Resource preload', pattern: /<link[^>]*rel="preload"/i },
    { name: 'Critical CSS inline', pattern: /<style>[\s\S]*<\/style>/i },
    { name: 'Font display swap', pattern: /font-display:\s*swap/i }
  ];
  
  let passed = 0;
  checks.forEach(check => {
    if (check.pattern.test(html)) {
      console.log(`✅ ${check.name}`);
      passed++;
    } else {
      console.log(`❌ ${check.name}`);
    }
  });
  
  console.log(`📊 Performance headers: ${passed}/${checks.length} implemented\n`);
  return passed >= 3;
}

// 7. Overall Score Calculation
function calculateOverallScore() {
  console.log('📊 Calculating overall GTMetrix readiness score...');
  
  const results = [
    validateCachePolicy(),
    validateDOMSize(),
    validateCSSOptimization(),
    validateImageOptimization(),
    validateJavaScriptBundles(),
    validatePerformanceHeaders()
  ];
  
  const score = (results.filter(Boolean).length / results.length) * 100;
  
  console.log('🎯 GTMetrix Optimization Summary');
  console.log('================================');
  console.log(`📊 Overall Score: ${Math.round(score)}%`);
  
  if (score >= 90) {
    console.log('🏆 Excellent! Site is highly optimized for GTMetrix');
  } else if (score >= 75) {
    console.log('✅ Good! Site has strong GTMetrix optimizations');
  } else if (score >= 60) {
    console.log('⚠️  Fair. Some optimizations need attention');
  } else {
    console.log('❌ Poor. Significant optimizations needed');
  }
  
  console.log('\n🚀 Expected GTMetrix improvements:');
  console.log('   • Performance Score: 88% → 92%+');
  console.log('   • Structure Score: 98% → 99%+');
  console.log('   • LCP: 1.9s → <1.5s');
  console.log('   • TBT: 16ms → <10ms');
  console.log('   • Fully Loaded: 4.3s → <3.5s');
  
  return score;
}

// Main execution
if (require.main === module) {
  calculateOverallScore();
}

module.exports = {
  validateCachePolicy,
  validateDOMSize,
  validateCSSOptimization,
  validateImageOptimization,
  validateJavaScriptBundles,
  validatePerformanceHeaders,
  calculateOverallScore
};

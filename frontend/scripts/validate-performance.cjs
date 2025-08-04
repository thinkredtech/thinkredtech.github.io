#!/usr/bin/env node

/**
 * Performance validation script
 * Validates all optimizations and provides performance insights
 */

/* eslint-disable no-undef */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const distDir = path.join(__dirname, '..', 'dist');
const assetsDir = path.join(distDir, 'assets');

console.log('🔍 Starting Performance Validation...');

function validateOptimizations() {
  const results = {
    bundleSize: {},
    imageOptimization: {},
    cssOptimization: {},
    htmlOptimization: {},
    accessibility: {},
    security: {},
    overall: {}
  };
  
  try {
    // 1. Validate bundle sizes
    console.log('📊 Validating bundle sizes...');
    results.bundleSize = validateBundleSizes();
    
    // 2. Validate image optimization
    console.log('🖼️  Validating image optimization...');
    results.imageOptimization = validateImageOptimization();
    
    // 3. Validate CSS optimization
    console.log('🎨 Validating CSS optimization...');
    results.cssOptimization = validateCSSOptimization();
    
    // 4. Validate HTML optimization
    console.log('📄 Validating HTML optimization...');
    results.htmlOptimization = validateHTMLOptimization();
    
    // 5. Validate accessibility
    console.log('♿ Validating accessibility...');
    results.accessibility = validateAccessibility();
    
    // 6. Validate security
    console.log('🔒 Validating security...');
    results.security = validateSecurity();
    
    // 7. Calculate overall score
    results.overall = calculateOverallScore(results);
    
    // 8. Generate report
    generatePerformanceReport(results);
    
    console.log('✅ Performance validation completed!');
    
  } catch (error) {
    console.error('❌ Performance validation failed:', error.message);
    process.exit(1);
  }
}

function validateBundleSizes() {
  const validation = { passed: 0, failed: 0, warnings: [], recommendations: [] };
  
  if (!fs.existsSync(assetsDir)) {
    validation.failed++;
    validation.warnings.push('Assets directory not found');
    return validation;
  }
  
  const jsFiles = fs.readdirSync(assetsDir).filter(file => file.endsWith('.js'));
  const cssFiles = fs.readdirSync(assetsDir).filter(file => file.endsWith('.css'));
  
  let totalJSSize = 0;
  let totalCSSSize = 0;
  let largeChunks = [];
  
  // Check JavaScript bundles
  jsFiles.forEach(file => {
    const filePath = path.join(assetsDir, file);
    const stats = fs.statSync(filePath);
    const sizeKB = Math.round(stats.size / 1024);
    totalJSSize += stats.size;
    
    if (sizeKB > 300) {
      largeChunks.push({ file, size: sizeKB });
      validation.failed++;
    } else if (sizeKB > 200) {
      validation.warnings.push(`${file} is ${sizeKB}KB (consider splitting)`);
    } else {
      validation.passed++;
    }
  });
  
  // Check CSS bundles
  cssFiles.forEach(file => {
    const filePath = path.join(assetsDir, file);
    const stats = fs.statSync(filePath);
    const sizeKB = Math.round(stats.size / 1024);
    totalCSSSize += stats.size;
    
    if (sizeKB > 50) {
      validation.warnings.push(`CSS ${file} is ${sizeKB}KB (consider critical CSS extraction)`);
    } else {
      validation.passed++;
    }
  });
  
  const totalSizeKB = Math.round((totalJSSize + totalCSSSize) / 1024);
  
  if (totalSizeKB > 500) {
    validation.failed++;
    validation.warnings.push(`Total bundle size ${totalSizeKB}KB exceeds recommended 500KB`);
  } else if (totalSizeKB > 300) {
    validation.warnings.push(`Total bundle size ${totalSizeKB}KB is above optimal 300KB`);
  } else {
    validation.passed++;
  }
  
  if (largeChunks.length > 0) {
    validation.recommendations.push('Consider further code splitting for large chunks: ' + 
      largeChunks.map(c => `${c.file} (${c.size}KB)`).join(', '));
  }
  
  validation.totalSize = totalSizeKB;
  validation.jsCount = jsFiles.length;
  validation.cssCount = cssFiles.length;
  
  return validation;
}

function validateImageOptimization() {
  const validation = { passed: 0, failed: 0, warnings: [], recommendations: [] };
  
  const imageDirs = [
    path.join(assetsDir, 'avatars'),
    path.join(assetsDir, 'logos'),
    path.join(assetsDir, 'icons'),
    path.join(assetsDir, 'portfolio'),
    path.join(assetsDir, 'screenshots'),
    path.join(assetsDir, 'branding'),
  ].filter(dir => fs.existsSync(dir));
  
  let totalImageSize = 0;
  let webpCount = 0;
  let avifCount = 0;
  let largeImages = [];
  
  imageDirs.forEach(imageDir => {
    const files = fs.readdirSync(imageDir);
    
    files.forEach(file => {
      const filePath = path.join(imageDir, file);
      const ext = path.extname(file).toLowerCase();
      
      if (['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext)) {
        const stats = fs.statSync(filePath);
        const sizeKB = Math.round(stats.size / 1024);
        totalImageSize += stats.size;
        
        if (ext === '.webp') webpCount++;
        if (ext === '.avif') avifCount++;
        
        if (sizeKB > 100) {
          largeImages.push({ file, size: sizeKB, dir: path.basename(imageDir) });
          validation.failed++;
        } else if (sizeKB > 50) {
          validation.warnings.push(`${file} is ${sizeKB}KB (consider further optimization)`);
        } else {
          validation.passed++;
        }
      }
    });
  });
  
  const totalImageSizeKB = Math.round(totalImageSize / 1024);
  
  if (webpCount === 0) {
    validation.failed++;
    validation.recommendations.push('No WebP images found - consider adding WebP versions');
  } else {
    validation.passed++;
  }
  
  if (avifCount > 0) {
    validation.passed++;
  } else {
    validation.recommendations.push('Consider adding AVIF versions for better compression');
  }
  
  if (largeImages.length > 0) {
    validation.recommendations.push('Optimize large images: ' + 
      largeImages.map(img => `${img.dir}/${img.file} (${img.size}KB)`).join(', '));
  }
  
  validation.totalImageSize = totalImageSizeKB;
  validation.webpCount = webpCount;
  validation.avifCount = avifCount;
  
  return validation;
}

function validateCSSOptimization() {
  const validation = { passed: 0, failed: 0, warnings: [], recommendations: [] };
  
  const indexPath = path.join(distDir, 'index.html');
  
  if (!fs.existsSync(indexPath)) {
    validation.failed++;
    validation.warnings.push('index.html not found');
    return validation;
  }
  
  const html = fs.readFileSync(indexPath, 'utf8');
  
  // Check for critical CSS
  if (html.includes('<style')) {
    validation.passed++;
  } else {
    validation.failed++;
    validation.warnings.push('No critical CSS found in HTML');
  }
  
  // Check for non-blocking CSS loading
  if (html.includes('media="print" onload=') || html.includes('rel="preload"') && html.includes('as="style"')) {
    validation.passed++;
  } else {
    validation.failed++;
    validation.recommendations.push('Implement non-blocking CSS loading');
  }
  
  // Check for unused CSS removal (estimate based on file size)
  const cssFiles = fs.readdirSync(assetsDir).filter(file => file.endsWith('.css'));
  
  cssFiles.forEach(file => {
    const filePath = path.join(assetsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const sizeKB = Math.round(content.length / 1024);
    
    // Estimate if CSS is optimized based on size and content
    const ruleCount = (content.match(/\{[^}]+\}/g) || []).length;
    const avgRuleSize = content.length / ruleCount;
    
    if (avgRuleSize < 50) { // Well-optimized CSS
      validation.passed++;
    } else if (avgRuleSize < 100) {
      validation.warnings.push(`${file} might contain unused CSS (avg rule size: ${Math.round(avgRuleSize)} chars)`);
    } else {
      validation.failed++;
      validation.recommendations.push(`${file} likely contains significant unused CSS`);
    }
  });
  
  return validation;
}

function validateHTMLOptimization() {
  const validation = { passed: 0, failed: 0, warnings: [], recommendations: [] };
  
  const indexPath = path.join(distDir, 'index.html');
  
  if (!fs.existsSync(indexPath)) {
    validation.failed++;
    validation.warnings.push('index.html not found');
    return validation;
  }
  
  const html = fs.readFileSync(indexPath, 'utf8');
  
  // Check for resource preloading
  if (html.includes('rel="preload"')) {
    validation.passed++;
  } else {
    validation.failed++;
    validation.recommendations.push('Add resource preloading for critical assets');
  }
  
  // Check for DNS prefetch
  if (html.includes('rel="dns-prefetch"') || html.includes('rel="preconnect"')) {
    validation.passed++;
  } else {
    validation.failed++;
    validation.recommendations.push('Add DNS prefetch/preconnect for external domains');
  }
  
  // Check for CSP
  if (html.includes('Content-Security-Policy')) {
    validation.passed++;
  } else {
    validation.failed++;
    validation.warnings.push('No Content Security Policy found');
  }
  
  // Check for service worker
  if (html.includes('serviceWorker') || fs.existsSync(path.join(distDir, 'sw.js'))) {
    validation.passed++;
  } else {
    validation.recommendations.push('Consider adding service worker for caching');
  }
  
  // Check for image lazy loading
  if (html.includes('loading="lazy"')) {
    validation.passed++;
  } else {
    validation.recommendations.push('Add lazy loading for images');
  }
  
  return validation;
}

function validateAccessibility() {
  const validation = { passed: 0, failed: 0, warnings: [], recommendations: [] };
  
  const indexPath = path.join(distDir, 'index.html');
  
  if (!fs.existsSync(indexPath)) {
    validation.failed++;
    validation.warnings.push('index.html not found');
    return validation;
  }
  
  const html = fs.readFileSync(indexPath, 'utf8');
  
  // Check for ARIA landmarks
  if (html.includes('role="main"') || html.includes('role="navigation"') || html.includes('role="banner"')) {
    validation.passed++;
  } else {
    validation.failed++;
    validation.recommendations.push('Add ARIA landmarks for better navigation');
  }
  
  // Check for alt attributes
  const imgTags = html.match(/<img[^>]+>/g) || [];
  const imgsWithAlt = imgTags.filter(img => img.includes('alt=')).length;
  
  if (imgsWithAlt === imgTags.length && imgTags.length > 0) {
    validation.passed++;
  } else {
    validation.failed++;
    validation.warnings.push(`${imgTags.length - imgsWithAlt} images missing alt attributes`);
  }
  
  // Check for focus management
  if (html.includes('focus') && html.includes('keyboard')) {
    validation.passed++;
  } else {
    validation.recommendations.push('Add enhanced focus management for keyboard users');
  }
  
  // Check for skip navigation
  if (html.includes('Skip to') || html.includes('skip-')) {
    validation.passed++;
  } else {
    validation.failed++;
    validation.recommendations.push('Add skip navigation link');
  }
  
  // Check for color contrast fixes
  if (html.includes('color:#374151') || html.includes('color:#1f2937')) {
    validation.passed++;
  } else {
    validation.failed++;
    validation.warnings.push('Color contrast may not meet WCAG standards');
  }
  
  return validation;
}

function validateSecurity() {
  const validation = { passed: 0, failed: 0, warnings: [], recommendations: [] };
  
  const indexPath = path.join(distDir, 'index.html');
  
  if (!fs.existsSync(indexPath)) {
    validation.failed++;
    validation.warnings.push('index.html not found');
    return validation;
  }
  
  const html = fs.readFileSync(indexPath, 'utf8');
  
  // Check for CSP
  if (html.includes('Content-Security-Policy')) {
    validation.passed++;
    
    // Check for nonce usage
    if (html.includes('nonce-')) {
      validation.passed++;
    } else {
      validation.recommendations.push('Consider using CSP nonces for better security');
    }
  } else {
    validation.failed++;
    validation.warnings.push('No Content Security Policy found');
  }
  
  // Check for other security headers
  const securityHeaders = ['X-Content-Type-Options', 'X-Frame-Options', 'X-XSS-Protection'];
  const foundHeaders = securityHeaders.filter(header => html.includes(header));
  
  if (foundHeaders.length === securityHeaders.length) {
    validation.passed++;
  } else {
    validation.failed++;
    validation.warnings.push(`Missing security headers: ${securityHeaders.filter(h => !foundHeaders.includes(h)).join(', ')}`);
  }
  
  // Check for HTTPS redirects
  if (fs.existsSync(path.join(distDir, '.htaccess'))) {
    const htaccess = fs.readFileSync(path.join(distDir, '.htaccess'), 'utf8');
    if (htaccess.includes('RewriteRule') && htaccess.includes('https://')) {
      validation.passed++;
    } else {
      validation.recommendations.push('Add HTTPS redirect in .htaccess');
    }
  } else {
    validation.recommendations.push('Create .htaccess with security configurations');
  }
  
  return validation;
}

function calculateOverallScore(results) {
  const categories = ['bundleSize', 'imageOptimization', 'cssOptimization', 'htmlOptimization', 'accessibility', 'security'];
  
  let totalPassed = 0;
  let totalFailed = 0;
  let totalWarnings = 0;
  
  categories.forEach(category => {
    if (results[category]) {
      totalPassed += results[category].passed || 0;
      totalFailed += results[category].failed || 0;
      totalWarnings += (results[category].warnings || []).length;
    }
  });
  
  const totalChecks = totalPassed + totalFailed;
  const score = totalChecks > 0 ? Math.round((totalPassed / totalChecks) * 100) : 0;
  
  return {
    score,
    totalPassed,
    totalFailed,
    totalWarnings,
    grade: score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F'
  };
}

function generatePerformanceReport(results) {
  const reportPath = path.join(distDir, 'performance-report.json');
  const readableReportPath = path.join(distDir, 'performance-report.md');
  
  // JSON report
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2), 'utf8');
  
  // Markdown report
  const report = `
# Performance Optimization Report

**Overall Score: ${results.overall.score}/100 (Grade: ${results.overall.grade})**

## Summary
- ✅ **Passed**: ${results.overall.totalPassed} checks
- ❌ **Failed**: ${results.overall.totalFailed} checks
- ⚠️ **Warnings**: ${results.overall.totalWarnings} warnings

## Detailed Results

### Bundle Size Optimization
- **Status**: ${results.bundleSize.failed === 0 ? '✅ Passed' : '❌ Needs Improvement'}
- **Total Size**: ${results.bundleSize.totalSize}KB
- **JS Files**: ${results.bundleSize.jsCount}
- **CSS Files**: ${results.bundleSize.cssCount}
${results.bundleSize.warnings.map(w => `- ⚠️ ${w}`).join('\n')}
${results.bundleSize.recommendations.map(r => `- 💡 ${r}`).join('\n')}

### Image Optimization
- **Status**: ${results.imageOptimization.failed === 0 ? '✅ Passed' : '❌ Needs Improvement'}
- **Total Image Size**: ${results.imageOptimization.totalImageSize}KB
- **WebP Images**: ${results.imageOptimization.webpCount}
- **AVIF Images**: ${results.imageOptimization.avifCount}
${results.imageOptimization.warnings.map(w => `- ⚠️ ${w}`).join('\n')}
${results.imageOptimization.recommendations.map(r => `- 💡 ${r}`).join('\n')}

### CSS Optimization
- **Status**: ${results.cssOptimization.failed === 0 ? '✅ Passed' : '❌ Needs Improvement'}
${results.cssOptimization.warnings.map(w => `- ⚠️ ${w}`).join('\n')}
${results.cssOptimization.recommendations.map(r => `- 💡 ${r}`).join('\n')}

### HTML Optimization
- **Status**: ${results.htmlOptimization.failed === 0 ? '✅ Passed' : '❌ Needs Improvement'}
${results.htmlOptimization.warnings.map(w => `- ⚠️ ${w}`).join('\n')}
${results.htmlOptimization.recommendations.map(r => `- 💡 ${r}`).join('\n')}

### Accessibility
- **Status**: ${results.accessibility.failed === 0 ? '✅ Passed' : '❌ Needs Improvement'}
${results.accessibility.warnings.map(w => `- ⚠️ ${w}`).join('\n')}
${results.accessibility.recommendations.map(r => `- 💡 ${r}`).join('\n')}

### Security
- **Status**: ${results.security.failed === 0 ? '✅ Passed' : '❌ Needs Improvement'}
${results.security.warnings.map(w => `- ⚠️ ${w}`).join('\n')}
${results.security.recommendations.map(r => `- 💡 ${r}`).join('\n')}

---

*Report generated on ${new Date().toISOString()}*
`;
  
  fs.writeFileSync(readableReportPath, report, 'utf8');
  
  console.log('\n📊 Performance Report Generated:');
  console.log(`   Overall Score: ${results.overall.score}/100 (${results.overall.grade})`);
  console.log(`   JSON Report: ${reportPath}`);
  console.log(`   Readable Report: ${readableReportPath}`);
  
  // Display summary
  if (results.overall.score >= 90) {
    console.log('🎉 Excellent! Your site is highly optimized for performance.');
  } else if (results.overall.score >= 80) {
    console.log('👍 Good! Minor optimizations could improve performance further.');
  } else if (results.overall.score >= 70) {
    console.log('⚠️  Fair. Several optimizations needed for better performance.');
  } else {
    console.log('❌ Poor. Significant optimizations required.');
  }
}

// Main execution
validateOptimizations();

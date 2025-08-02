#!/usr/bin/env node

/**
 * ThinkRED Pre-Deployment Performance Checker
 * 
 * Comprehensive pre-deployment validation that includes:
 * - Lighthouse performance testing
 * - Bundle size analysis
 * - Build optimization verification
 * - Asset compression checks
 * - Performance budget validation
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { execSync } = require('child_process');
const LighthouseRunner = require('./lighthouse-runner');

class PreDeploymentChecker {
  constructor(options = {}) {
    this.options = {
      buildDir: options.buildDir || path.join(__dirname, '../../frontend/dist'),
      maxBundleSize: options.maxBundleSize || 1000 * 1024, // 1MB
      maxImageSize: options.maxImageSize || 500 * 1024, // 500KB
      performanceThresholds: {
        performance: 85,
        accessibility: 90,
        bestPractices: 90,
        seo: 90,
        pwa: 80,
        ...options.performanceThresholds
      },
      testUrls: options.testUrls || ['http://localhost:3000'],
      skipLighthouse: options.skipLighthouse || false,
      outputDir: options.outputDir || path.join(__dirname, '../../reports/pre-deployment'),
      ...options
    };

    this.results = {
      bundleAnalysis: null,
      assetOptimization: null,
      performanceTesting: null,
      overallStatus: 'pending',
      violations: [],
      recommendations: []
    };
  }

  /**
   * Run complete pre-deployment check
   */
  async runPreDeploymentCheck() {
    this.log('🚀 Starting Pre-Deployment Performance Check...', 'info');
    
    try {
      // Ensure output directory exists
      if (!fs.existsSync(this.options.outputDir)) {
        fs.mkdirSync(this.options.outputDir, { recursive: true });
      }

      // Step 1: Verify build exists
      await this.verifyBuild();

      // Step 2: Analyze bundle sizes
      await this.analyzeBundles();

      // Step 3: Check asset optimization
      await this.checkAssetOptimization();

      // Step 4: Run Lighthouse performance tests
      if (!this.options.skipLighthouse) {
        await this.runPerformanceTests();
      }

      // Step 5: Generate final report
      await this.generateFinalReport();

      // Step 6: Determine overall status
      this.determineOverallStatus();

      this.log('🎉 Pre-deployment check completed!', 'success');
      return this.results;

    } catch (error) {
      this.log(`❌ Pre-deployment check failed: ${error.message}`, 'error');
      this.results.overallStatus = 'failed';
      this.results.violations.push({
        category: 'system',
        severity: 'high',
        issue: 'Pre-deployment check failed',
        details: error.message
      });
      throw error;
    }
  }

  /**
   * Verify that the build directory exists and contains expected files
   */
  async verifyBuild() {
    this.log('📁 Verifying build directory...', 'info');

    if (!fs.existsSync(this.options.buildDir)) {
      throw new Error(`Build directory not found: ${this.options.buildDir}`);
    }

    const indexPath = path.join(this.options.buildDir, 'index.html');
    if (!fs.existsSync(indexPath)) {
      throw new Error('index.html not found in build directory');
    }

    const assetsDir = path.join(this.options.buildDir, 'assets');
    if (!fs.existsSync(assetsDir)) {
      this.log('⚠️  Assets directory not found - checking for alternative structure', 'warn');
    }

    this.log('✅ Build verification passed', 'success');
  }

  /**
   * Analyze JavaScript and CSS bundle sizes
   */
  async analyzeBundles() {
    this.log('📊 Analyzing bundle sizes...', 'info');

    const bundleAnalysis = {
      totalSize: 0,
      jsSize: 0,
      cssSize: 0,
      imageSize: 0,
      otherSize: 0,
      files: [],
      violations: []
    };

    // Recursively analyze all files in build directory
    const analyzeDirectory = (dir, relativePath = '') => {
      const files = fs.readdirSync(dir);

      files.forEach(file => {
        const fullPath = path.join(dir, file);
        const relativeFilePath = path.join(relativePath, file);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
          analyzeDirectory(fullPath, relativeFilePath);
        } else {
          const size = stats.size;
          const ext = path.extname(file).toLowerCase();

          bundleAnalysis.files.push({
            path: relativeFilePath,
            size,
            type: this.getFileType(ext),
            compressed: this.isCompressed(fullPath, ext)
          });

          bundleAnalysis.totalSize += size;

          // Categorize by type
          if (['.js', '.mjs'].includes(ext)) {
            bundleAnalysis.jsSize += size;
          } else if (['.css'].includes(ext)) {
            bundleAnalysis.cssSize += size;
          } else if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.avif'].includes(ext)) {
            bundleAnalysis.imageSize += size;
          } else {
            bundleAnalysis.otherSize += size;
          }

          // Check for violations
          this.checkBundleViolations(file, size, ext, bundleAnalysis.violations);
        }
      });
    };

    analyzeDirectory(this.options.buildDir);

    // Sort files by size (largest first)
    bundleAnalysis.files.sort((a, b) => b.size - a.size);

    // Calculate percentages
    bundleAnalysis.jsPercentage = ((bundleAnalysis.jsSize / bundleAnalysis.totalSize) * 100).toFixed(1);
    bundleAnalysis.cssPercentage = ((bundleAnalysis.cssSize / bundleAnalysis.totalSize) * 100).toFixed(1);
    bundleAnalysis.imagePercentage = ((bundleAnalysis.imageSize / bundleAnalysis.totalSize) * 100).toFixed(1);

    this.results.bundleAnalysis = bundleAnalysis;

    // Log summary
    this.log(`📦 Total bundle size: ${this.formatBytes(bundleAnalysis.totalSize)}`, 'info');
    this.log(`   JavaScript: ${this.formatBytes(bundleAnalysis.jsSize)} (${bundleAnalysis.jsPercentage}%)`, 'info');
    this.log(`   CSS: ${this.formatBytes(bundleAnalysis.cssSize)} (${bundleAnalysis.cssPercentage}%)`, 'info');
    this.log(`   Images: ${this.formatBytes(bundleAnalysis.imageSize)} (${bundleAnalysis.imagePercentage}%)`, 'info');

    if (bundleAnalysis.violations.length > 0) {
      this.log(`⚠️  Found ${bundleAnalysis.violations.length} bundle size violations`, 'warn');
      this.results.violations.push(...bundleAnalysis.violations);
    }

    this.log('✅ Bundle analysis completed', 'success');
  }

  /**
   * Check for bundle size violations
   */
  checkBundleViolations(filename, size, ext, violations) {
    // Check JavaScript bundle size
    if (['.js', '.mjs'].includes(ext) && size > this.options.maxBundleSize) {
      violations.push({
        category: 'bundle-size',
        severity: 'high',
        issue: `JavaScript bundle too large`,
        details: `${filename} is ${this.formatBytes(size)}, exceeds limit of ${this.formatBytes(this.options.maxBundleSize)}`,
        recommendations: [
          'Implement code splitting',
          'Remove unused dependencies',
          'Enable tree shaking',
          'Use dynamic imports for non-critical code'
        ]
      });
    }

    // Check image size
    if (['.png', '.jpg', '.jpeg', '.gif'].includes(ext) && size > this.options.maxImageSize) {
      violations.push({
        category: 'asset-size',
        severity: 'medium',
        issue: `Image file too large`,
        details: `${filename} is ${this.formatBytes(size)}, exceeds recommended limit of ${this.formatBytes(this.options.maxImageSize)}`,
        recommendations: [
          'Compress images using tools like imagemin',
          'Convert to modern formats (WebP, AVIF)',
          'Implement responsive images with srcset',
          'Consider lazy loading for below-the-fold images'
        ]
      });
    }

    // Check for uncompressed files
    if (['.js', '.css', '.html', '.svg'].includes(ext) && !this.isCompressed(null, ext)) {
      violations.push({
        category: 'compression',
        severity: 'medium',
        issue: `File should be compressed`,
        details: `${filename} appears to be uncompressed`,
        recommendations: [
          'Enable gzip or brotli compression on server',
          'Pre-compress assets during build',
          'Configure proper Content-Encoding headers'
        ]
      });
    }
  }

  /**
   * Check asset optimization
   */
  async checkAssetOptimization() {
    this.log('🎨 Checking asset optimization...', 'info');

    const optimization = {
      modernFormats: { found: 0, total: 0 },
      compression: { enabled: false, types: [] },
      lazyLoading: { implemented: false },
      criticalCSS: { inlined: false },
      fontOptimization: { implemented: false },
      violations: []
    };

    // Check for modern image formats
    const imageFiles = this.results.bundleAnalysis.files.filter(f => 
      ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif'].includes(path.extname(f.path).toLowerCase())
    );

    imageFiles.forEach(file => {
      optimization.modernFormats.total++;
      const ext = path.extname(file.path).toLowerCase();
      if (['.webp', '.avif'].includes(ext)) {
        optimization.modernFormats.found++;
      }
    });

    // Check index.html for optimizations
    const indexPath = path.join(this.options.buildDir, 'index.html');
    if (fs.existsSync(indexPath)) {
      const indexContent = fs.readFileSync(indexPath, 'utf-8');
      
      // Check for critical CSS inlining
      if (indexContent.includes('<style>') && indexContent.includes('critical')) {
        optimization.criticalCSS.inlined = true;
      }

      // Check for font optimization
      if (indexContent.includes('font-display:') || indexContent.includes('font-display: swap')) {
        optimization.fontOptimization.implemented = true;
      }

      // Check for lazy loading
      if (indexContent.includes('loading="lazy"') || indexContent.includes('data-src')) {
        optimization.lazyLoading.implemented = true;
      }
    }

    // Generate optimization violations
    if (optimization.modernFormats.total > 0 && optimization.modernFormats.found / optimization.modernFormats.total < 0.5) {
      optimization.violations.push({
        category: 'image-optimization',
        severity: 'medium',
        issue: 'Low adoption of modern image formats',
        details: `Only ${optimization.modernFormats.found}/${optimization.modernFormats.total} images use modern formats`,
        recommendations: [
          'Convert images to WebP or AVIF format',
          'Implement progressive JPEG for large images',
          'Use SVG for icons and simple graphics'
        ]
      });
    }

    if (!optimization.criticalCSS.inlined) {
      optimization.violations.push({
        category: 'css-optimization',
        severity: 'medium',
        issue: 'Critical CSS not inlined',
        details: 'Critical above-the-fold CSS should be inlined',
        recommendations: [
          'Identify and inline critical CSS',
          'Load non-critical CSS asynchronously',
          'Use tools like critical or purgeCSS'
        ]
      });
    }

    if (!optimization.fontOptimization.implemented) {
      optimization.violations.push({
        category: 'font-optimization',
        severity: 'low',
        issue: 'Font loading not optimized',
        details: 'Font-display: swap not detected',
        recommendations: [
          'Add font-display: swap to font declarations',
          'Preload critical fonts',
          'Use system fonts as fallbacks'
        ]
      });
    }

    this.results.assetOptimization = optimization;
    this.results.violations.push(...optimization.violations);

    this.log(`🖼️  Modern image formats: ${optimization.modernFormats.found}/${optimization.modernFormats.total}`, 'info');
    this.log(`🎨 Critical CSS inlined: ${optimization.criticalCSS.inlined ? '✅' : '❌'}`, 'info');
    this.log(`📝 Font optimization: ${optimization.fontOptimization.implemented ? '✅' : '❌'}`, 'info');

    this.log('✅ Asset optimization check completed', 'success');
  }

  /**
   * Run Lighthouse performance tests
   */
  async runPerformanceTests() {
    this.log('🚦 Running Lighthouse performance tests...', 'info');

    try {
      const runner = new LighthouseRunner({
        urls: this.options.testUrls,
        outputDir: this.options.outputDir,
        isCI: true,
        thresholds: this.options.performanceThresholds
      });

      const lighthouseReport = await runner.runAudits();
      this.results.performanceTesting = lighthouseReport;

      // Convert Lighthouse failures to violations
      lighthouseReport.results.forEach(result => {
        if (result.failed) {
          this.results.violations.push({
            category: 'performance-test',
            severity: 'high',
            issue: 'Lighthouse test failed',
            details: `${result.url}: ${result.error}`,
            recommendations: ['Fix build process', 'Ensure server is running', 'Check URL accessibility']
          });
        } else if (!result.passed.overall) {
          // Add violations for failed performance categories
          Object.entries(result.passed).forEach(([category, passed]) => {
            if (!passed && category !== 'overall') {
              this.results.violations.push({
                category: 'performance-score',
                severity: this.getScoreSeverity(result.scores[category]),
                issue: `${category} score below threshold`,
                details: `${result.url}: ${result.scores[category]}/100 (threshold: ${this.options.performanceThresholds[category]}/100)`,
                recommendations: result.recommendations
                  .filter(rec => rec.category === category)
                  .flatMap(rec => rec.issues.map(issue => issue.action))
              });
            }
          });
        }
      });

      this.log('✅ Performance testing completed', 'success');
    } catch (error) {
      this.log(`❌ Performance testing failed: ${error.message}`, 'error');
      this.results.violations.push({
        category: 'performance-test',
        severity: 'high',
        issue: 'Performance testing failed',
        details: error.message,
        recommendations: ['Check if development server is running', 'Verify test URLs are accessible']
      });
    }
  }

  /**
   * Generate comprehensive final report
   */
  async generateFinalReport() {
    this.log('📋 Generating final report...', 'info');

    const reportPath = path.join(this.options.outputDir, `pre-deployment-report-${Date.now()}.json`);
    const report = {
      timestamp: new Date().toISOString(),
      status: this.results.overallStatus,
      summary: this.generateSummary(),
      bundleAnalysis: this.results.bundleAnalysis,
      assetOptimization: this.results.assetOptimization,
      performanceTesting: this.results.performanceTesting,
      violations: this.results.violations,
      recommendations: this.generateRecommendations(),
      metadata: {
        version: '1.0.0',
        tool: 'ThinkRED Pre-Deployment Checker',
        buildDir: this.options.buildDir,
        thresholds: this.options.performanceThresholds
      }
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Generate markdown report
    await this.generateMarkdownReport(report);

    this.log(`📊 Report saved to: ${reportPath}`, 'success');
    return report;
  }

  /**
   * Generate markdown report
   */
  async generateMarkdownReport(report) {
    const markdownPath = path.join(this.options.outputDir, `pre-deployment-report-${Date.now()}.md`);
    
    let markdown = `# 🚀 Pre-Deployment Performance Report

Generated: ${new Date(report.timestamp).toLocaleString()}

## 📊 Executive Summary

**Status:** ${report.status === 'passed' ? '✅ READY FOR DEPLOYMENT' : '❌ DEPLOYMENT BLOCKED'}

### Bundle Analysis
- **Total Size:** ${this.formatBytes(report.bundleAnalysis.totalSize)}
- **JavaScript:** ${this.formatBytes(report.bundleAnalysis.jsSize)} (${report.bundleAnalysis.jsPercentage}%)
- **CSS:** ${this.formatBytes(report.bundleAnalysis.cssSize)} (${report.bundleAnalysis.cssPercentage}%)
- **Images:** ${this.formatBytes(report.bundleAnalysis.imageSize)} (${report.bundleAnalysis.imagePercentage}%)

### Asset Optimization
- **Modern Image Formats:** ${report.assetOptimization.modernFormats.found}/${report.assetOptimization.modernFormats.total}
- **Critical CSS:** ${report.assetOptimization.criticalCSS.inlined ? '✅' : '❌'}
- **Font Optimization:** ${report.assetOptimization.fontOptimization.implemented ? '✅' : '❌'}

`;

    if (report.performanceTesting && report.performanceTesting.summary.averageScores) {
      markdown += `### Performance Scores
- **Performance:** ${report.performanceTesting.summary.averageScores.performance}/100
- **Accessibility:** ${report.performanceTesting.summary.averageScores.accessibility}/100
- **Best Practices:** ${report.performanceTesting.summary.averageScores.bestPractices}/100
- **SEO:** ${report.performanceTesting.summary.averageScores.seo}/100
- **PWA:** ${report.performanceTesting.summary.averageScores.pwa}/100

`;
    }

    // Add violations
    if (report.violations.length > 0) {
      markdown += `## ⚠️  Violations (${report.violations.length})

`;
      const violationsByCategory = {};
      report.violations.forEach(violation => {
        if (!violationsByCategory[violation.category]) {
          violationsByCategory[violation.category] = [];
        }
        violationsByCategory[violation.category].push(violation);
      });

      Object.entries(violationsByCategory).forEach(([category, violations]) => {
        markdown += `### ${category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}

`;
        violations.forEach(violation => {
          const severityEmoji = violation.severity === 'high' ? '🔴' : violation.severity === 'medium' ? '🟡' : '🟢';
          markdown += `${severityEmoji} **${violation.issue}**
- Details: ${violation.details}
- Recommendations: ${violation.recommendations.join(', ')}

`;
        });
      });
    }

    // Add largest files
    if (report.bundleAnalysis.files.length > 0) {
      markdown += `## 📦 Largest Files

| File | Size | Type |
|------|------|------|
`;
      report.bundleAnalysis.files.slice(0, 10).forEach(file => {
        markdown += `| ${file.path} | ${this.formatBytes(file.size)} | ${file.type} |\n`;
      });
      markdown += `\n`;
    }

    fs.writeFileSync(markdownPath, markdown);
    this.log(`📝 Markdown report saved to: ${markdownPath}`, 'success');
  }

  /**
   * Generate summary
   */
  generateSummary() {
    const highViolations = this.results.violations.filter(v => v.severity === 'high').length;
    const mediumViolations = this.results.violations.filter(v => v.severity === 'medium').length;
    const lowViolations = this.results.violations.filter(v => v.severity === 'low').length;

    return {
      totalViolations: this.results.violations.length,
      highSeverityViolations: highViolations,
      mediumSeverityViolations: mediumViolations,
      lowSeverityViolations: lowViolations,
      bundleSize: this.results.bundleAnalysis ? this.results.bundleAnalysis.totalSize : 0,
      performancePassed: this.results.performanceTesting ? this.results.performanceTesting.summary.status === 'passed' : null
    };
  }

  /**
   * Generate recommendations
   */
  generateRecommendations() {
    const recommendations = [];

    // Bundle size recommendations
    if (this.results.bundleAnalysis && this.results.bundleAnalysis.totalSize > 500 * 1024) {
      recommendations.push({
        priority: 'high',
        category: 'bundle-optimization',
        title: 'Reduce bundle size',
        actions: [
          'Implement code splitting',
          'Use dynamic imports',
          'Remove unused dependencies',
          'Enable tree shaking'
        ]
      });
    }

    // Image optimization recommendations
    if (this.results.assetOptimization && this.results.assetOptimization.modernFormats.total > 0) {
      const modernFormatRatio = this.results.assetOptimization.modernFormats.found / this.results.assetOptimization.modernFormats.total;
      if (modernFormatRatio < 0.8) {
        recommendations.push({
          priority: 'medium',
          category: 'image-optimization',
          title: 'Optimize images',
          actions: [
            'Convert to WebP/AVIF format',
            'Implement responsive images',
            'Add lazy loading',
            'Compress existing images'
          ]
        });
      }
    }

    // Performance recommendations
    const highViolations = this.results.violations.filter(v => v.severity === 'high');
    if (highViolations.length > 0) {
      recommendations.push({
        priority: 'high',
        category: 'performance',
        title: 'Fix critical performance issues',
        actions: highViolations.map(v => v.issue)
      });
    }

    return recommendations;
  }

  /**
   * Determine overall deployment readiness status
   */
  determineOverallStatus() {
    const highViolations = this.results.violations.filter(v => v.severity === 'high').length;
    const performanceFailed = this.results.performanceTesting && this.results.performanceTesting.summary.status === 'failed';

    if (highViolations > 0 || performanceFailed) {
      this.results.overallStatus = 'failed';
      this.log('❌ Deployment blocked due to critical issues', 'error');
    } else {
      this.results.overallStatus = 'passed';
      this.log('✅ Ready for deployment!', 'success');
    }
  }

  /**
   * Utility methods
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getFileType(ext) {
    const types = {
      '.js': 'JavaScript',
      '.mjs': 'JavaScript (Module)',
      '.css': 'Stylesheet',
      '.html': 'HTML',
      '.png': 'Image (PNG)',
      '.jpg': 'Image (JPEG)',
      '.jpeg': 'Image (JPEG)',
      '.gif': 'Image (GIF)',
      '.svg': 'Image (SVG)',
      '.webp': 'Image (WebP)',
      '.avif': 'Image (AVIF)',
      '.woff': 'Font (WOFF)',
      '.woff2': 'Font (WOFF2)',
      '.ttf': 'Font (TTF)',
      '.eot': 'Font (EOT)'
    };
    return types[ext] || 'Other';
  }

  isCompressed(filePath, ext) {
    // Basic heuristic - in a real implementation, you might check file headers
    return ['.gz', '.br'].some(compExt => ext.endsWith(compExt));
  }

  getScoreSeverity(score) {
    if (score < 50) return 'high';
    if (score < 75) return 'medium';
    return 'low';
  }

  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = `[${timestamp}]`;
    
    switch (type) {
      case 'success':
        console.log(chalk.green(`${prefix} ${message}`));
        break;
      case 'warn':
        console.log(chalk.yellow(`${prefix} ${message}`));
        break;
      case 'error':
        console.log(chalk.red(`${prefix} ${message}`));
        break;
      default:
        console.log(chalk.blue(`${prefix} ${message}`));
    }
  }
}

module.exports = PreDeploymentChecker;

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {};

  // Parse command line arguments
  for (let i = 0; i < args.length; i += 2) {
    const arg = args[i];
    const value = args[i + 1];

    switch (arg) {
      case '--build-dir':
        options.buildDir = value;
        break;
      case '--test-url':
        options.testUrls = [value];
        break;
      case '--skip-lighthouse':
        options.skipLighthouse = true;
        i -= 1; // No value for this flag
        break;
      case '--max-bundle-size':
        options.maxBundleSize = parseInt(value) * 1024; // Convert KB to bytes
        break;
    }
  }

  const checker = new PreDeploymentChecker(options);
  
  checker.runPreDeploymentCheck()
    .then(results => {
      if (results.overallStatus === 'passed') {
        console.log(chalk.green('\n🎉 Pre-deployment check passed! Ready for deployment.'));
        process.exit(0);
      } else {
        console.log(chalk.red('\n❌ Pre-deployment check failed! Please fix issues before deployment.'));
        console.log(chalk.yellow(`\nFound ${results.violations.length} violations:`));
        results.violations.forEach(violation => {
          const severityColor = violation.severity === 'high' ? 'red' : violation.severity === 'medium' ? 'yellow' : 'blue';
          console.log(chalk[severityColor](`  ${violation.severity.toUpperCase()}: ${violation.issue}`));
        });
        process.exit(1);
      }
    })
    .catch(error => {
      console.error(chalk.red('❌ Pre-deployment check crashed:'), error);
      process.exit(1);
    });
}

#!/usr/bin/env node

/**
 * ThinkRED Automated Performance Improvement System
 * 
 * Analyzes performance data and automatically generates actionable improvement
 * suggestions with implementation examples and priority rankings.
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class PerformanceImprovementAnalyzer {
  constructor(options = {}) {
    this.options = {
      reportsDir: options.reportsDir || path.join(__dirname, '../../reports/performance'),
      outputDir: options.outputDir || path.join(__dirname, '../../reports/improvements'),
      frontendDir: options.frontendDir || path.join(__dirname, '../../frontend'),
      thresholds: {
        performance: 85,
        accessibility: 90,
        bestPractices: 90,
        seo: 90,
        pwa: 80,
        bundleSize: 1000 * 1024, // 1MB
        imageSize: 500 * 1024,   // 500KB
        ...options.thresholds
      },
      ...options
    };

    this.improvements = [];
  }

  /**
   * Analyze performance data and generate improvements
   */
  async analyzeAndGenerateImprovements() {
    console.log(chalk.blue('🔍 Analyzing performance data for improvement opportunities...'));

    try {
      // Analyze lighthouse reports
      await this.analyzeLighthouseData();

      // Analyze bundle data
      await this.analyzeBundleData();

      // Analyze current codebase
      await this.analyzeCodebase();

      // Generate improvement report
      await this.generateImprovementReport();

      // Generate implementation files
      await this.generateImplementationFiles();

      console.log(chalk.green(`✅ Analysis complete! Found ${this.improvements.length} improvement opportunities`));
      return this.improvements;

    } catch (error) {
      console.error(chalk.red('❌ Analysis failed:'), error);
      throw error;
    }
  }

  /**
   * Analyze lighthouse performance data
   */
  async analyzeLighthouseData() {
    const lighthouseReports = this.findRecentReports('lighthouse-report-*.json');
    
    if (lighthouseReports.length === 0) {
      console.log(chalk.yellow('⚠️  No lighthouse reports found'));
      return;
    }

    for (const reportPath of lighthouseReports) {
      try {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
        this.analyzeLighthouseReport(report);
      } catch (error) {
        console.warn(chalk.yellow(`Warning: Could not process ${reportPath}`));
      }
    }
  }

  /**
   * Analyze single lighthouse report
   */
  analyzeLighthouseReport(report) {
    if (!report.results || report.results.length === 0) return;

    const result = report.results[0];
    const scores = result.scores;
    const opportunities = result.opportunities || [];
    const metrics = result.metrics || {};

    // Performance score improvements
    if (scores.performance < this.options.thresholds.performance) {
      this.addImprovement({
        category: 'performance',
        priority: 'high',
        title: 'Improve Performance Score',
        currentScore: scores.performance,
        targetScore: this.options.thresholds.performance,
        impact: 'high',
        effort: 'medium',
        description: 'Core Web Vitals optimization needed to improve user experience',
        opportunities: opportunities.slice(0, 5),
        implementation: this.generatePerformanceImplementation(opportunities, metrics)
      });
    }

    // Accessibility improvements
    if (scores.accessibility < this.options.thresholds.accessibility) {
      this.addImprovement({
        category: 'accessibility',
        priority: 'high',
        title: 'Enhance Accessibility',
        currentScore: scores.accessibility,
        targetScore: this.options.thresholds.accessibility,
        impact: 'high',
        effort: 'low',
        description: 'Improve website accessibility for all users',
        implementation: this.generateAccessibilityImplementation()
      });
    }

    // SEO improvements
    if (scores.seo < this.options.thresholds.seo) {
      this.addImprovement({
        category: 'seo',
        priority: 'medium',
        title: 'Optimize SEO',
        currentScore: scores.seo,
        targetScore: this.options.thresholds.seo,
        impact: 'medium',
        effort: 'low',
        description: 'Improve search engine optimization',
        implementation: this.generateSEOImplementation()
      });
    }

    // Core Web Vitals specific improvements
    this.analyzeCorWebVitals(metrics);
  }

  /**
   * Analyze Core Web Vitals
   */
  analyzeCorWebVitals(metrics) {
    // First Contentful Paint
    if (metrics.firstContentfulPaint > 1800) {
      this.addImprovement({
        category: 'core-web-vitals',
        priority: 'high',
        title: 'Improve First Contentful Paint',
        current: `${Math.round(metrics.firstContentfulPaint)}ms`,
        target: '< 1800ms',
        impact: 'high',
        effort: 'medium',
        description: 'Reduce time to first meaningful content',
        implementation: this.generateFCPImplementation()
      });
    }

    // Largest Contentful Paint
    if (metrics.largestContentfulPaint > 2500) {
      this.addImprovement({
        category: 'core-web-vitals',
        priority: 'high',
        title: 'Improve Largest Contentful Paint',
        current: `${Math.round(metrics.largestContentfulPaint)}ms`,
        target: '< 2500ms',
        impact: 'high',
        effort: 'medium',
        description: 'Optimize largest element loading time',
        implementation: this.generateLCPImplementation()
      });
    }

    // Cumulative Layout Shift
    if (metrics.cumulativeLayoutShift > 0.1) {
      this.addImprovement({
        category: 'core-web-vitals',
        priority: 'medium',
        title: 'Reduce Cumulative Layout Shift',
        current: metrics.cumulativeLayoutShift.toFixed(3),
        target: '< 0.1',
        impact: 'medium',
        effort: 'low',
        description: 'Minimize unexpected layout shifts',
        implementation: this.generateCLSImplementation()
      });
    }
  }

  /**
   * Analyze bundle data
   */
  async analyzeBundleData() {
    const bundleReports = this.findRecentReports('pre-deployment-report-*.json');
    
    for (const reportPath of bundleReports) {
      try {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
        this.analyzeBundleReport(report);
      } catch (error) {
        console.warn(chalk.yellow(`Warning: Could not process bundle report ${reportPath}`));
      }
    }
  }

  /**
   * Analyze bundle report
   */
  analyzeBundleReport(report) {
    const bundleAnalysis = report.bundleAnalysis;
    if (!bundleAnalysis) return;

    // Large bundle size
    if (bundleAnalysis.totalSize > this.options.thresholds.bundleSize) {
      this.addImprovement({
        category: 'bundle-optimization',
        priority: 'high',
        title: 'Reduce Bundle Size',
        current: this.formatBytes(bundleAnalysis.totalSize),
        target: this.formatBytes(this.options.thresholds.bundleSize),
        impact: 'high',
        effort: 'medium',
        description: 'Large bundle size affects loading performance',
        implementation: this.generateBundleOptimizationImplementation(bundleAnalysis)
      });
    }

    // JavaScript percentage too high
    if (parseFloat(bundleAnalysis.jsPercentage) > 80) {
      this.addImprovement({
        category: 'code-splitting',
        priority: 'medium',
        title: 'Implement Code Splitting',
        current: `${bundleAnalysis.jsPercentage}% JavaScript`,
        target: '< 80% JavaScript',
        impact: 'medium',
        effort: 'medium',
        description: 'Reduce initial JavaScript payload',
        implementation: this.generateCodeSplittingImplementation()
      });
    }

    // Large images
    const largeImages = bundleAnalysis.files?.filter(f => 
      f.type.includes('Image') && f.size > this.options.thresholds.imageSize
    ) || [];

    if (largeImages.length > 0) {
      this.addImprovement({
        category: 'image-optimization',
        priority: 'medium',
        title: 'Optimize Large Images',
        current: `${largeImages.length} large images`,
        target: 'All images < 500KB',
        impact: 'medium',
        effort: 'low',
        description: 'Large images slow down page loading',
        implementation: this.generateImageOptimizationImplementation(largeImages)
      });
    }
  }

  /**
   * Analyze current codebase for improvement opportunities
   */
  async analyzeCodebase() {
    const viteConfigPath = path.join(this.options.frontendDir, 'vite.config.ts');
    const packageJsonPath = path.join(this.options.frontendDir, 'package.json');

    // Analyze Vite configuration
    if (fs.existsSync(viteConfigPath)) {
      const viteConfig = fs.readFileSync(viteConfigPath, 'utf-8');
      this.analyzeViteConfig(viteConfig);
    }

    // Analyze package.json for optimization opportunities
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      this.analyzePackageJson(packageJson);
    }

    // Analyze source files
    this.analyzeSourceFiles();
  }

  /**
   * Analyze Vite configuration
   */
  analyzeViteConfig(config) {
    // Check for missing optimizations
    if (!config.includes('rollupOptions')) {
      this.addImprovement({
        category: 'build-optimization',
        priority: 'medium',
        title: 'Add Rollup Optimizations',
        impact: 'medium',
        effort: 'low',
        description: 'Enhance build process with advanced Rollup options',
        implementation: this.generateRollupOptimizationImplementation()
      });
    }

    if (!config.includes('chunkSizeWarningLimit')) {
      this.addImprovement({
        category: 'build-optimization',
        priority: 'low',
        title: 'Configure Chunk Size Warnings',
        impact: 'low',
        effort: 'low',
        description: 'Monitor bundle chunk sizes during build',
        implementation: this.generateChunkSizeImplementation()
      });
    }
  }

  /**
   * Analyze package.json for opportunities
   */
  analyzePackageJson(packageJson) {
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

    // Check for heavy dependencies
    const heavyDeps = ['moment', 'lodash', 'rxjs'];
    const foundHeavyDeps = heavyDeps.filter(dep => deps[dep]);

    if (foundHeavyDeps.length > 0) {
      this.addImprovement({
        category: 'dependency-optimization',
        priority: 'medium',
        title: 'Replace Heavy Dependencies',
        current: foundHeavyDeps.join(', '),
        target: 'Lightweight alternatives',
        impact: 'medium',
        effort: 'medium',
        description: 'Heavy dependencies increase bundle size',
        implementation: this.generateDependencyOptimizationImplementation(foundHeavyDeps)
      });
    }

    // Check for missing performance-related packages
    if (!deps['@vitejs/plugin-legacy']) {
      this.addImprovement({
        category: 'browser-compatibility',
        priority: 'low',
        title: 'Add Legacy Browser Support',
        impact: 'low',
        effort: 'low',
        description: 'Support older browsers with polyfills',
        implementation: this.generateLegacySupportImplementation()
      });
    }
  }

  /**
   * Analyze source files for patterns
   */
  analyzeSourceFiles() {
    const srcDir = path.join(this.options.frontendDir, 'src');
    if (!fs.existsSync(srcDir)) return;

    // Check for large components
    this.findLargeComponents(srcDir);

    // Check for missing lazy loading
    this.checkLazyLoading(srcDir);
  }

  /**
   * Find large components that could benefit from optimization
   */
  findLargeComponents(dir) {
    const files = this.getAllFiles(dir, ['.tsx', '.ts', '.jsx', '.js']);
    const largeFiles = files.filter(file => {
      const stats = fs.statSync(file);
      return stats.size > 10 * 1024; // 10KB
    });

    if (largeFiles.length > 0) {
      this.addImprovement({
        category: 'component-optimization',
        priority: 'low',
        title: 'Optimize Large Components',
        current: `${largeFiles.length} large components`,
        target: 'Modular components',
        impact: 'low',
        effort: 'medium',
        description: 'Large components can be split into smaller, more manageable pieces',
        implementation: this.generateComponentOptimizationImplementation(largeFiles)
      });
    }
  }

  /**
   * Check for lazy loading implementation
   */
  checkLazyLoading(dir) {
    const routeFiles = this.getAllFiles(dir, ['.tsx', '.ts']).filter(file => 
      file.includes('pages') || file.includes('routes') || file.includes('App.')
    );

    let hasLazyLoading = false;
    for (const file of routeFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      if (content.includes('React.lazy') || content.includes('lazy(')) {
        hasLazyLoading = true;
        break;
      }
    }

    if (!hasLazyLoading && routeFiles.length > 0) {
      this.addImprovement({
        category: 'lazy-loading',
        priority: 'medium',
        title: 'Implement Route-Based Code Splitting',
        impact: 'medium',
        effort: 'low',
        description: 'Lazy load route components to reduce initial bundle size',
        implementation: this.generateLazyLoadingImplementation()
      });
    }
  }

  /**
   * Generate implementation for performance improvements
   */
  generatePerformanceImplementation(opportunities, metrics) {
    const implementations = [];

    // Resource optimization
    if (opportunities.some(opp => opp.id === 'unused-css-rules')) {
      implementations.push({
        file: 'vite.config.ts',
        action: 'Add CSS purging',
        code: `
// Add to vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  css: {
    postcss: {
      plugins: [
        require('@fullhuman/postcss-purgecss')({
          content: ['./src/**/*.{ts,tsx,html}'],
          defaultExtractor: content => content.match(/[\\w-/:]+(?<!:)/g) || []
        })
      ]
    }
  }
});`
      });
    }

    // Preloading critical resources
    if (metrics.firstContentfulPaint > 1800) {
      implementations.push({
        file: 'index.html',
        action: 'Add resource preloading',
        code: `
<!-- Add to <head> in index.html -->
<link rel="preload" href="/fonts/main-font.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/hero-image.webp" as="image">
<link rel="modulepreload" href="/src/main.tsx">`
      });
    }

    return implementations;
  }

  /**
   * Generate accessibility implementation
   */
  generateAccessibilityImplementation() {
    return [
      {
        file: 'src/components/ui/Button.tsx',
        action: 'Improve button accessibility',
        code: `
// Enhanced button component
export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary',
  disabled = false,
  ariaLabel,
  ...props 
}) => {
  return (
    <button
      className={\`btn btn-\${variant}\`}
      disabled={disabled}
      aria-label={ariaLabel || children}
      aria-disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};`
      },
      {
        file: 'src/styles/accessibility.css',
        action: 'Add accessibility styles',
        code: `
/* High contrast focus indicators */
:focus-visible {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

/* Ensure sufficient color contrast */
.text-primary { color: #1a365d; } /* WCAG AA compliant */
.text-secondary { color: #2d3748; } /* WCAG AA compliant */

/* Skip navigation link */
.skip-nav {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #000;
  color: #fff;
  padding: 8px;
  text-decoration: none;
  z-index: 1000;
}

.skip-nav:focus {
  top: 6px;
}`
      }
    ];
  }

  /**
   * Generate SEO implementation
   */
  generateSEOImplementation() {
    return [
      {
        file: 'index.html',
        action: 'Add meta tags',
        code: `
<!-- Add to <head> -->
<meta name="description" content="ThinkRED Technologies - Innovation in software development">
<meta name="keywords" content="software development, web development, technology solutions">
<meta name="author" content="ThinkRED Technologies">

<!-- Open Graph tags -->
<meta property="og:title" content="ThinkRED Technologies">
<meta property="og:description" content="Innovation in software development">
<meta property="og:image" content="/og-image.jpg">
<meta property="og:url" content="https://thinkredtech.github.io">

<!-- Twitter Card tags -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="ThinkRED Technologies">
<meta name="twitter:description" content="Innovation in software development">`
      },
      {
        file: 'public/sitemap.xml',
        action: 'Create sitemap',
        code: `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://thinkredtech.github.io/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://thinkredtech.github.io/about</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>0.8</priority>
  </url>
</urlset>`
      }
    ];
  }

  /**
   * Generate Core Web Vitals implementations
   */
  generateFCPImplementation() {
    return [
      {
        file: 'src/main.tsx',
        action: 'Optimize initial render',
        code: `
// Optimize React rendering
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Preload critical resources
const criticalResourcesLoaded = Promise.all([
  // Preload critical CSS
  import('./styles/critical.css'),
  // Preload critical components
  import('./components/Header'),
]);

const container = document.getElementById('root')!;
const root = createRoot(container);

criticalResourcesLoaded.then(() => {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});`
      }
    ];
  }

  generateLCPImplementation() {
    return [
      {
        file: 'src/components/HeroSection.tsx',
        action: 'Optimize hero image loading',
        code: `
// Optimize LCP element (hero image)
export const HeroSection = () => {
  return (
    <section className="hero">
      <img
        src="/hero-image.webp"
        alt="Hero image"
        loading="eager"
        fetchPriority="high"
        width={1200}
        height={600}
        style={{ objectFit: 'cover' }}
      />
    </section>
  );
};`
      }
    ];
  }

  generateCLSImplementation() {
    return [
      {
        file: 'src/styles/layout.css',
        action: 'Prevent layout shifts',
        code: `
/* Reserve space for images */
.image-container {
  aspect-ratio: 16/9; /* Maintain aspect ratio */
  overflow: hidden;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Reserve space for dynamic content */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}`
      }
    ];
  }

  /**
   * Add improvement to list with deduplication
   */
  addImprovement(improvement) {
    // Check for duplicates
    const exists = this.improvements.some(existing => 
      existing.category === improvement.category && 
      existing.title === improvement.title
    );

    if (!exists) {
      this.improvements.push({
        id: `imp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        ...improvement
      });
    }
  }

  /**
   * Generate comprehensive improvement report
   */
  async generateImprovementReport() {
    if (!fs.existsSync(this.options.outputDir)) {
      fs.mkdirSync(this.options.outputDir, { recursive: true });
    }

    const reportPath = path.join(this.options.outputDir, `improvements-${Date.now()}.md`);
    const report = this.createImprovementMarkdown();

    fs.writeFileSync(reportPath, report);
    console.log(chalk.green(`📊 Improvement report generated: ${reportPath}`));

    // Also generate JSON report
    const jsonPath = path.join(this.options.outputDir, `improvements-${Date.now()}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      improvements: this.improvements,
      summary: this.generateSummary()
    }, null, 2));
  }

  /**
   * Create markdown improvement report
   */
  createImprovementMarkdown() {
    const priorityOrder = ['high', 'medium', 'low'];
    const groupedImprovements = {};

    // Group by priority
    priorityOrder.forEach(priority => {
      groupedImprovements[priority] = this.improvements.filter(imp => imp.priority === priority);
    });

    return `# 🚀 Performance Improvement Recommendations

*Generated: ${new Date().toLocaleString()}*

## 📊 Executive Summary

**Total Recommendations:** ${this.improvements.length}
- **High Priority:** ${groupedImprovements.high.length} items
- **Medium Priority:** ${groupedImprovements.medium.length} items  
- **Low Priority:** ${groupedImprovements.low.length} items

## 🎯 Quick Wins (High Impact, Low Effort)

${this.improvements
  .filter(imp => imp.impact === 'high' && imp.effort === 'low')
  .map(imp => `- **${imp.title}**: ${imp.description}`)
  .join('\n') || 'No quick wins identified'}

## 📋 Detailed Recommendations

${priorityOrder.map(priority => this.formatPrioritySection(priority, groupedImprovements[priority])).join('\n\n')}

## 🛠️ Implementation Priority

1. **Start with High Priority items** - These have the biggest impact on user experience
2. **Address Core Web Vitals** - Focus on FCP, LCP, and CLS improvements
3. **Optimize Bundle Size** - Implement code splitting and remove unused code
4. **Enhance Accessibility** - Ensure the site is usable by everyone
5. **Improve SEO** - Better search engine visibility

## 📈 Expected Impact

Implementing all recommendations could result in:
- **Performance Score:** +${this.calculateExpectedImprovement('performance')} points
- **Bundle Size Reduction:** ~${this.calculateBundleSizeReduction()}%
- **Load Time Improvement:** ~${this.calculateLoadTimeImprovement()}ms faster
- **User Experience:** Significantly improved

---

*Next Steps: Review each recommendation and prioritize based on your development capacity and business goals.*`;
  }

  /**
   * Format priority section
   */
  formatPrioritySection(priority, improvements) {
    if (improvements.length === 0) {
      return `### ${priority.toUpperCase()} Priority\n\nNo ${priority} priority items identified.`;
    }

    const priorityEmoji = priority === 'high' ? '🔴' : priority === 'medium' ? '🟡' : '🟢';
    
    return `### ${priorityEmoji} ${priority.toUpperCase()} Priority (${improvements.length} items)

${improvements.map(imp => `
#### ${imp.title}

**Current:** ${imp.current || 'N/A'} → **Target:** ${imp.target || 'Improved'}
**Impact:** ${imp.impact} | **Effort:** ${imp.effort}

${imp.description}

${imp.implementation ? `
**Implementation:**
${imp.implementation.map(impl => `
- **${impl.file}**: ${impl.action}
\`\`\`${this.getLanguageFromFile(impl.file)}
${impl.code}
\`\`\`
`).join('')}` : ''}
`).join('\n')}`;
  }

  /**
   * Generate implementation files
   */
  async generateImplementationFiles() {
    const implementationFiles = new Map();

    // Collect all implementation suggestions by file
    this.improvements.forEach(improvement => {
      if (improvement.implementation) {
        improvement.implementation.forEach(impl => {
          if (!implementationFiles.has(impl.file)) {
            implementationFiles.set(impl.file, []);
          }
          implementationFiles.get(impl.file).push({
            improvement: improvement.title,
            action: impl.action,
            code: impl.code,
            priority: improvement.priority
          });
        });
      }
    });

    // Generate implementation guide for each file
    for (const [file, implementations] of implementationFiles) {
      const guidePath = path.join(this.options.outputDir, `implementation-${file.replace(/[\/\\]/g, '-')}.md`);
      const guide = this.createImplementationGuide(file, implementations);
      fs.writeFileSync(guidePath, guide);
    }

    console.log(chalk.green(`📝 Generated ${implementationFiles.size} implementation guides`));
  }

  /**
   * Create implementation guide for specific file
   */
  createImplementationGuide(file, implementations) {
    return `# Implementation Guide: ${file}

## 📋 Proposed Changes

${implementations.map((impl, index) => `
### ${index + 1}. ${impl.improvement} (${impl.priority} priority)

**Action:** ${impl.action}

\`\`\`${this.getLanguageFromFile(file)}
${impl.code}
\`\`\`
`).join('\n')}

## 🚀 Implementation Steps

1. **Backup Current File**: Create a backup of the current ${file}
2. **Apply Changes**: Implement the changes above in order of priority
3. **Test Changes**: Verify functionality after each change
4. **Run Performance Tests**: Use \`npm run performance:test\` to validate improvements
5. **Deploy**: Deploy changes once validated

## ⚠️ Important Notes

- Test each change individually to isolate any issues
- Consider browser compatibility when implementing new features
- Update tests if needed to cover new functionality
- Monitor performance metrics after deployment

---

*Generated by ThinkRED Performance Improvement Analyzer*`;
  }

  /**
   * Utility methods
   */
  getLanguageFromFile(filename) {
    const ext = path.extname(filename).toLowerCase();
    const langMap = {
      '.ts': 'typescript',
      '.tsx': 'typescript',
      '.js': 'javascript',
      '.jsx': 'javascript',
      '.css': 'css',
      '.html': 'html',
      '.md': 'markdown',
      '.json': 'json'
    };
    return langMap[ext] || 'text';
  }

  generateSummary() {
    return {
      totalImprovements: this.improvements.length,
      highPriority: this.improvements.filter(i => i.priority === 'high').length,
      mediumPriority: this.improvements.filter(i => i.priority === 'medium').length,
      lowPriority: this.improvements.filter(i => i.priority === 'low').length,
      categories: [...new Set(this.improvements.map(i => i.category))],
      quickWins: this.improvements.filter(i => i.impact === 'high' && i.effort === 'low').length
    };
  }

  calculateExpectedImprovement(category) {
    const improvements = this.improvements.filter(i => i.category === category);
    return improvements.length * 5; // Rough estimate: 5 points per improvement
  }

  calculateBundleSizeReduction() {
    const bundleImprovements = this.improvements.filter(i => 
      i.category === 'bundle-optimization' || i.category === 'code-splitting'
    );
    return bundleImprovements.length * 15; // Rough estimate: 15% per optimization
  }

  calculateLoadTimeImprovement() {
    const performanceImprovements = this.improvements.filter(i => 
      i.category === 'performance' || i.category === 'core-web-vitals'
    );
    return performanceImprovements.length * 200; // Rough estimate: 200ms per improvement
  }

  findRecentReports(pattern) {
    if (!fs.existsSync(this.options.reportsDir)) return [];
    
    const files = fs.readdirSync(this.options.reportsDir);
    const regex = new RegExp(pattern.replace('*', '.*'));
    
    return files
      .filter(file => regex.test(file))
      .map(file => path.join(this.options.reportsDir, file))
      .sort((a, b) => fs.statSync(b).mtime - fs.statSync(a).mtime)
      .slice(0, 3); // Only use 3 most recent reports
  }

  getAllFiles(dir, extensions = []) {
    let files = [];
    
    try {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          files = files.concat(this.getAllFiles(fullPath, extensions));
        } else if (extensions.length === 0 || extensions.includes(path.extname(item))) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Ignore permission errors, etc.
    }
    
    return files;
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Additional implementation generators would go here...
  generateBundleOptimizationImplementation(bundleAnalysis) {
    return [
      {
        file: 'vite.config.ts',
        action: 'Optimize bundle splitting',
        code: `
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          utils: ['lodash-es', 'date-fns']
        }
      }
    }
  }
});`
      }
    ];
  }

  generateCodeSplittingImplementation() {
    return [
      {
        file: 'src/App.tsx',
        action: 'Implement lazy loading',
        code: `
import { Suspense, lazy } from 'react';

const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Suspense>
  );
}`
      }
    ];
  }

  generateImageOptimizationImplementation(largeImages) {
    return [
      {
        file: 'scripts/optimize-images.js',
        action: 'Create image optimization script',
        code: `
const sharp = require('sharp');
const fs = require('fs');

async function optimizeImages() {
  const images = ${JSON.stringify(largeImages.map(img => img.path), null, 2)};
  
  for (const imagePath of images) {
    await sharp(imagePath)
      .webp({ quality: 80 })
      .toFile(imagePath.replace(/\\.[^.]+$/, '.webp'));
  }
}

optimizeImages();`
      }
    ];
  }
}

module.exports = PerformanceImprovementAnalyzer;

// CLI usage
if (require.main === module) {
  const analyzer = new PerformanceImprovementAnalyzer();
  
  analyzer.analyzeAndGenerateImprovements()
    .then(improvements => {
      console.log(chalk.green(`\n🎉 Analysis complete! Generated ${improvements.length} improvement recommendations.`));
      
      const highPriority = improvements.filter(i => i.priority === 'high').length;
      if (highPriority > 0) {
        console.log(chalk.yellow(`⚠️  ${highPriority} high priority items need attention.`));
      }
      
      console.log(chalk.blue('\n📁 Check the reports/improvements directory for detailed implementation guides.'));
    })
    .catch(error => {
      console.error(chalk.red('❌ Analysis failed:'), error);
      process.exit(1);
    });
}

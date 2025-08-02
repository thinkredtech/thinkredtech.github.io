#!/usr/bin/env node

/**
 * ThinkRED Lighthouse Performance Testing Runner
 * 
 * Comprehensive lighthouse-based performance testing with automated reporting,
 * improvement suggestions, and pre-deployment validation.
 */

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { createRequire } = require('module');

class LighthouseRunner {
  constructor(options = {}) {
    this.options = {
      urls: options.urls || ['http://localhost:3000'],
      outputDir: options.outputDir || path.join(__dirname, '../../reports/performance'),
      isCI: options.isCI || process.env.CI === 'true',
      thresholds: {
        performance: options.thresholds?.performance || 85,
        accessibility: options.thresholds?.accessibility || 90,
        bestPractices: options.thresholds?.bestPractices || 90,
        seo: options.thresholds?.seo || 90,
        pwa: options.thresholds?.pwa || 80,
        ...options.thresholds
      },
      categories: ['performance', 'accessibility', 'best-practices', 'seo', 'pwa'],
      ...options
    };

    this.results = [];
    this.reportPath = path.join(this.options.outputDir, `lighthouse-report-${Date.now()}.json`);
    this.htmlReportPath = path.join(this.options.outputDir, `lighthouse-report-${Date.now()}.html`);
  }

  /**
   * Initialize performance testing environment
   */
  async initialize() {
    // Ensure output directory exists
    if (!fs.existsSync(this.options.outputDir)) {
      fs.mkdirSync(this.options.outputDir, { recursive: true });
    }

    this.log('🚀 Initializing Lighthouse Performance Testing...', 'info');
    this.log(`📊 Testing ${this.options.urls.length} URL(s)`, 'info');
    this.log(`📁 Reports will be saved to: ${this.options.outputDir}`, 'info');
  }

  /**
   * Run lighthouse audits for all configured URLs
   */
  async runAudits() {
    await this.initialize();

    for (const url of this.options.urls) {
      try {
        await this.runSingleAudit(url);
      } catch (error) {
        this.log(`❌ Failed to audit ${url}: ${error.message}`, 'error');
        this.results.push({
          url,
          error: error.message,
          timestamp: new Date().toISOString(),
          failed: true
        });
      }
    }

    return this.generateReport();
  }

  /**
   * Run lighthouse audit for a single URL
   */
  async runSingleAudit(url) {
    this.log(`🔍 Auditing: ${url}`, 'info');

    const chrome = await chromeLauncher.launch({
      chromeFlags: this.options.isCI ? ['--headless', '--no-sandbox', '--disable-gpu'] : ['--headless']
    });

    const config = {
      logLevel: 'info',
      output: 'json',
      onlyCategories: this.options.categories,
      port: chrome.port,
      settings: {
        maxWaitForLoad: 30000,
        throttlingMethod: 'simulate',
        screenEmulation: {
          mobile: false,
          width: 1350,
          height: 940,
          deviceScaleFactor: 1,
          disabled: false,
        },
        formFactor: 'desktop',
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0,
        },
        auditMode: false,
        gatherMode: false,
        disableStorageReset: false,
        emulatedUserAgent: false,
      }
    };

    try {
      const startTime = Date.now();
      const runnerResult = await lighthouse(url, config);
      const endTime = Date.now();
      
      await chrome.kill();

      const scores = this.extractScores(runnerResult.lhr);
      const metrics = this.extractMetrics(runnerResult.lhr);
      const opportunities = this.extractOpportunities(runnerResult.lhr);
      const diagnostics = this.extractDiagnostics(runnerResult.lhr);

      const result = {
        url,
        timestamp: new Date().toISOString(),
        duration: endTime - startTime,
        scores,
        metrics,
        opportunities,
        diagnostics,
        rawResult: runnerResult.lhr,
        passed: this.checkThresholds(scores),
        recommendations: this.generateRecommendations(scores, opportunities, diagnostics)
      };

      this.results.push(result);
      this.logResults(result);

      return result;
    } catch (error) {
      await chrome.kill();
      throw error;
    }
  }

  /**
   * Extract category scores from lighthouse results
   */
  extractScores(lhr) {
    const categories = lhr.categories || {};
    return {
      performance: Math.round((categories.performance?.score || 0) * 100),
      accessibility: Math.round((categories.accessibility?.score || 0) * 100),
      bestPractices: Math.round((categories['best-practices']?.score || 0) * 100),
      seo: Math.round((categories.seo?.score || 0) * 100),
      pwa: Math.round((categories.pwa?.score || 0) * 100)
    };
  }

  /**
   * Extract key performance metrics
   */
  extractMetrics(lhr) {
    const audits = lhr.audits || {};
    return {
      firstContentfulPaint: audits['first-contentful-paint']?.numericValue || 0,
      largestContentfulPaint: audits['largest-contentful-paint']?.numericValue || 0,
      firstMeaningfulPaint: audits['first-meaningful-paint']?.numericValue || 0,
      speedIndex: audits['speed-index']?.numericValue || 0,
      timeToInteractive: audits['interactive']?.numericValue || 0,
      totalBlockingTime: audits['total-blocking-time']?.numericValue || 0,
      cumulativeLayoutShift: audits['cumulative-layout-shift']?.numericValue || 0,
      maxPotentialFID: audits['max-potential-fid']?.numericValue || 0
    };
  }

  /**
   * Extract performance opportunities
   */
  extractOpportunities(lhr) {
    const audits = lhr.audits || {};
    const opportunities = [];

    // Key performance opportunities
    const opportunityAudits = [
      'unused-css-rules',
      'unused-javascript',
      'render-blocking-resources',
      'unminified-css',
      'unminified-javascript',
      'efficient-animated-content',
      'modern-image-formats',
      'offscreen-images',
      'legacy-javascript',
      'uses-long-cache-ttl',
      'uses-optimized-images',
      'uses-text-compression',
      'uses-responsive-images'
    ];

    opportunityAudits.forEach(auditId => {
      const audit = audits[auditId];
      if (audit && audit.details && audit.numericValue > 0) {
        opportunities.push({
          id: auditId,
          title: audit.title,
          description: audit.description,
          savings: audit.numericValue,
          displayValue: audit.displayValue,
          details: audit.details
        });
      }
    });

    return opportunities.sort((a, b) => b.savings - a.savings);
  }

  /**
   * Extract diagnostics information
   */
  extractDiagnostics(lhr) {
    const audits = lhr.audits || {};
    const diagnostics = [];

    const diagnosticAudits = [
      'network-requests',
      'network-rtt',
      'network-server-latency',
      'main-thread-tasks',
      'metrics',
      'screenshot-thumbnails',
      'final-screenshot'
    ];

    diagnosticAudits.forEach(auditId => {
      const audit = audits[auditId];
      if (audit) {
        diagnostics.push({
          id: auditId,
          title: audit.title,
          description: audit.description,
          details: audit.details,
          numericValue: audit.numericValue,
          displayValue: audit.displayValue
        });
      }
    });

    return diagnostics;
  }

  /**
   * Check if scores meet defined thresholds
   */
  checkThresholds(scores) {
    const passed = {
      performance: scores.performance >= this.options.thresholds.performance,
      accessibility: scores.accessibility >= this.options.thresholds.accessibility,
      bestPractices: scores.bestPractices >= this.options.thresholds.bestPractices,
      seo: scores.seo >= this.options.thresholds.seo,
      pwa: scores.pwa >= this.options.thresholds.pwa
    };

    passed.overall = Object.values(passed).every(p => p === true);
    return passed;
  }

  /**
   * Generate improvement recommendations
   */
  generateRecommendations(scores, opportunities, diagnostics) {
    const recommendations = [];

    // Performance recommendations
    if (scores.performance < this.options.thresholds.performance) {
      recommendations.push({
        category: 'performance',
        priority: 'high',
        title: 'Improve Core Web Vitals',
        issues: opportunities.slice(0, 5).map(opp => ({
          issue: opp.title,
          impact: `${Math.round(opp.savings / 1000)}s potential savings`,
          action: this.getActionForOpportunity(opp.id)
        }))
      });
    }

    // Accessibility recommendations
    if (scores.accessibility < this.options.thresholds.accessibility) {
      recommendations.push({
        category: 'accessibility',
        priority: 'high',
        title: 'Improve Accessibility',
        issues: [
          { issue: 'Color contrast', action: 'Ensure color contrast ratio meets WCAG AA standards (4.5:1)' },
          { issue: 'Alt text', action: 'Add descriptive alt text to all images' },
          { issue: 'Keyboard navigation', action: 'Ensure all interactive elements are keyboard accessible' }
        ]
      });
    }

    // SEO recommendations
    if (scores.seo < this.options.thresholds.seo) {
      recommendations.push({
        category: 'seo',
        priority: 'medium',
        title: 'Improve SEO',
        issues: [
          { issue: 'Meta descriptions', action: 'Add unique meta descriptions to all pages' },
          { issue: 'Title tags', action: 'Optimize title tags for relevant keywords' },
          { issue: 'Structured data', action: 'Implement JSON-LD structured data' }
        ]
      });
    }

    return recommendations;
  }

  /**
   * Get specific action for performance opportunity
   */
  getActionForOpportunity(opportunityId) {
    const actions = {
      'unused-css-rules': 'Remove unused CSS rules or implement dynamic CSS loading',
      'unused-javascript': 'Remove unused JavaScript or implement code splitting',
      'render-blocking-resources': 'Defer non-critical CSS/JS or inline critical resources',
      'unminified-css': 'Minify CSS files in your build process',
      'unminified-javascript': 'Minify JavaScript files in your build process',
      'efficient-animated-content': 'Use CSS animations instead of JavaScript or optimize GIFs',
      'modern-image-formats': 'Convert images to WebP or AVIF formats',
      'offscreen-images': 'Implement lazy loading for images below the fold',
      'legacy-javascript': 'Remove polyfills for modern browsers or serve differential bundles',
      'uses-long-cache-ttl': 'Set longer cache headers for static assets',
      'uses-optimized-images': 'Compress and optimize images',
      'uses-text-compression': 'Enable gzip or brotli compression on your server',
      'uses-responsive-images': 'Serve appropriately sized images using srcset'
    };

    return actions[opportunityId] || 'Review and optimize this resource';
  }

  /**
   * Generate comprehensive performance report
   */
  async generateReport() {
    const summary = this.generateSummary();
    const report = {
      timestamp: new Date().toISOString(),
      summary,
      results: this.results,
      thresholds: this.options.thresholds,
      metadata: {
        version: '1.0.0',
        tool: 'ThinkRED Lighthouse Runner',
        environment: this.options.isCI ? 'CI' : 'local'
      }
    };

    // Save JSON report
    fs.writeFileSync(this.reportPath, JSON.stringify(report, null, 2));

    // Generate HTML report
    await this.generateHTMLReport(report);

    // Generate markdown summary
    await this.generateMarkdownSummary(report);

    this.log(`📊 Performance report saved to: ${this.reportPath}`, 'success');
    this.log(`🌐 HTML report saved to: ${this.htmlReportPath}`, 'success');

    return report;
  }

  /**
   * Generate performance summary
   */
  generateSummary() {
    const successful = this.results.filter(r => !r.failed);
    const failed = this.results.filter(r => r.failed);
    
    if (successful.length === 0) {
      return { 
        status: 'failed', 
        totalTests: this.results.length,
        passed: 0,
        failed: failed.length,
        averageScores: null
      };
    }

    const averageScores = {
      performance: Math.round(successful.reduce((sum, r) => sum + r.scores.performance, 0) / successful.length),
      accessibility: Math.round(successful.reduce((sum, r) => sum + r.scores.accessibility, 0) / successful.length),
      bestPractices: Math.round(successful.reduce((sum, r) => sum + r.scores.bestPractices, 0) / successful.length),
      seo: Math.round(successful.reduce((sum, r) => sum + r.scores.seo, 0) / successful.length),
      pwa: Math.round(successful.reduce((sum, r) => sum + r.scores.pwa, 0) / successful.length)
    };

    const overallPassed = successful.every(r => r.passed.overall);

    return {
      status: overallPassed ? 'passed' : 'failed',
      totalTests: this.results.length,
      passed: successful.filter(r => r.passed.overall).length,
      failed: failed.length + successful.filter(r => !r.passed.overall).length,
      averageScores,
      worstPerforming: this.findWorstPerforming(successful),
      bestPerforming: this.findBestPerforming(successful)
    };
  }

  /**
   * Find worst performing URL
   */
  findWorstPerforming(results) {
    if (results.length === 0) return null;
    
    return results.reduce((worst, current) => {
      const worstScore = worst.scores.performance;
      const currentScore = current.scores.performance;
      return currentScore < worstScore ? current : worst;
    });
  }

  /**
   * Find best performing URL
   */
  findBestPerforming(results) {
    if (results.length === 0) return null;
    
    return results.reduce((best, current) => {
      const bestScore = best.scores.performance;
      const currentScore = current.scores.performance;
      return currentScore > bestScore ? current : best;
    });
  }

  /**
   * Generate HTML report
   */
  async generateHTMLReport(report) {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ThinkRED Performance Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #e4093e, #518cea); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { padding: 20px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px; }
        .summary-card { background: #f8f9fa; border-radius: 6px; padding: 15px; text-align: center; }
        .summary-card h3 { margin: 0 0 10px 0; color: #333; }
        .summary-card .value { font-size: 24px; font-weight: bold; }
        .score { padding: 4px 8px; border-radius: 4px; color: white; font-weight: bold; }
        .score-excellent { background: #0cce6b; }
        .score-good { background: #ffa400; }
        .score-poor { background: #ff4e42; }
        .results { margin-top: 30px; }
        .result-item { border: 1px solid #ddd; border-radius: 6px; margin-bottom: 20px; overflow: hidden; }
        .result-header { background: #f8f9fa; padding: 15px; border-bottom: 1px solid #ddd; }
        .result-content { padding: 15px; }
        .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin: 15px 0; }
        .metric { text-align: center; padding: 10px; background: #f8f9fa; border-radius: 4px; }
        .opportunities { margin-top: 20px; }
        .opportunity { padding: 10px; border-left: 4px solid #ffa400; background: #fff8e1; margin-bottom: 10px; }
        .recommendations { margin-top: 20px; }
        .recommendation { padding: 15px; border-left: 4px solid #2196f3; background: #e3f2fd; margin-bottom: 15px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 ThinkRED Performance Report</h1>
            <p>Generated on ${new Date(report.timestamp).toLocaleString()}</p>
        </div>
        <div class="content">
            ${this.generateHTMLSummary(report.summary)}
            ${this.generateHTMLResults(report.results)}
        </div>
    </div>
</body>
</html>`;

    fs.writeFileSync(this.htmlReportPath, html);
  }

  /**
   * Generate HTML summary section
   */
  generateHTMLSummary(summary) {
    if (!summary.averageScores) {
      return `<div class="summary"><div class="summary-card"><h3>❌ All Tests Failed</h3></div></div>`;
    }

    return `
        <div class="summary">
            <div class="summary-card">
                <h3>Overall Status</h3>
                <div class="value ${summary.status === 'passed' ? 'score-excellent' : 'score-poor'}" style="color: white; padding: 8px; border-radius: 4px;">
                    ${summary.status.toUpperCase()}
                </div>
            </div>
            <div class="summary-card">
                <h3>Performance</h3>
                <div class="value score ${this.getScoreClass(summary.averageScores.performance)}">${summary.averageScores.performance}</div>
            </div>
            <div class="summary-card">
                <h3>Accessibility</h3>
                <div class="value score ${this.getScoreClass(summary.averageScores.accessibility)}">${summary.averageScores.accessibility}</div>
            </div>
            <div class="summary-card">
                <h3>Best Practices</h3>
                <div class="value score ${this.getScoreClass(summary.averageScores.bestPractices)}">${summary.averageScores.bestPractices}</div>
            </div>
            <div class="summary-card">
                <h3>SEO</h3>
                <div class="value score ${this.getScoreClass(summary.averageScores.seo)}">${summary.averageScores.seo}</div>
            </div>
            <div class="summary-card">
                <h3>PWA</h3>
                <div class="value score ${this.getScoreClass(summary.averageScores.pwa)}">${summary.averageScores.pwa}</div>
            </div>
        </div>`;
  }

  /**
   * Generate HTML results section
   */
  generateHTMLResults(results) {
    return `
        <div class="results">
            <h2>📊 Detailed Results</h2>
            ${results.map(result => this.generateHTMLResultItem(result)).join('')}
        </div>`;
  }

  /**
   * Generate HTML for single result item
   */
  generateHTMLResultItem(result) {
    if (result.failed) {
      return `
            <div class="result-item">
                <div class="result-header">
                    <h3>❌ ${result.url}</h3>
                    <p style="color: #d32f2f;">Failed: ${result.error}</p>
                </div>
            </div>`;
    }

    const metrics = Object.entries(result.metrics).map(([key, value]) => {
      const displayValue = key.includes('layout-shift') ? value.toFixed(3) : `${Math.round(value)}ms`;
      return `<div class="metric"><strong>${this.formatMetricName(key)}</strong><br>${displayValue}</div>`;
    }).join('');

    const opportunities = result.opportunities.slice(0, 5).map(opp => 
      `<div class="opportunity"><strong>${opp.title}</strong><br>Potential savings: ${Math.round(opp.savings / 1000)}s</div>`
    ).join('');

    const recommendations = result.recommendations.map(rec => 
      `<div class="recommendation">
        <h4>${rec.title}</h4>
        ${rec.issues.map(issue => `<p><strong>${issue.issue}:</strong> ${issue.action}</p>`).join('')}
      </div>`
    ).join('');

    return `
        <div class="result-item">
            <div class="result-header">
                <h3>${result.url}</h3>
                <p>Status: ${result.passed.overall ? '✅ Passed' : '❌ Failed'} | Duration: ${result.duration}ms</p>
            </div>
            <div class="result-content">
                <h4>Scores</h4>
                <div class="metrics-grid">
                    <div class="metric">Performance<br><span class="score ${this.getScoreClass(result.scores.performance)}">${result.scores.performance}</span></div>
                    <div class="metric">Accessibility<br><span class="score ${this.getScoreClass(result.scores.accessibility)}">${result.scores.accessibility}</span></div>
                    <div class="metric">Best Practices<br><span class="score ${this.getScoreClass(result.scores.bestPractices)}">${result.scores.bestPractices}</span></div>
                    <div class="metric">SEO<br><span class="score ${this.getScoreClass(result.scores.seo)}">${result.scores.seo}</span></div>
                    <div class="metric">PWA<br><span class="score ${this.getScoreClass(result.scores.pwa)}">${result.scores.pwa}</span></div>
                </div>
                
                <h4>Core Web Vitals</h4>
                <div class="metrics-grid">${metrics}</div>
                
                ${opportunities ? `<div class="opportunities"><h4>Top Opportunities</h4>${opportunities}</div>` : ''}
                
                ${recommendations ? `<div class="recommendations"><h4>Recommendations</h4>${recommendations}</div>` : ''}
            </div>
        </div>`;
  }

  /**
   * Generate markdown summary report
   */
  async generateMarkdownSummary(report) {
    const markdownPath = path.join(this.options.outputDir, `lighthouse-summary-${Date.now()}.md`);
    
    let markdown = `# 🚀 ThinkRED Performance Report

Generated on: ${new Date(report.timestamp).toLocaleString()}

## 📊 Summary

`;

    if (report.summary.averageScores) {
      markdown += `| Category | Score | Status |
|----------|-------|--------|
| **Performance** | ${report.summary.averageScores.performance}/100 | ${this.getStatusEmoji(report.summary.averageScores.performance)} |
| **Accessibility** | ${report.summary.averageScores.accessibility}/100 | ${this.getStatusEmoji(report.summary.averageScores.accessibility)} |
| **Best Practices** | ${report.summary.averageScores.bestPractices}/100 | ${this.getStatusEmoji(report.summary.averageScores.bestPractices)} |
| **SEO** | ${report.summary.averageScores.seo}/100 | ${this.getStatusEmoji(report.summary.averageScores.seo)} |
| **PWA** | ${report.summary.averageScores.pwa}/100 | ${this.getStatusEmoji(report.summary.averageScores.pwa)} |

**Overall Status:** ${report.summary.status === 'passed' ? '✅ PASSED' : '❌ FAILED'}

`;
    } else {
      markdown += `**Status:** ❌ All tests failed\n\n`;
    }

    // Add detailed results
    markdown += `## 📋 Detailed Results\n\n`;
    
    report.results.forEach(result => {
      if (result.failed) {
        markdown += `### ❌ ${result.url}\n**Error:** ${result.error}\n\n`;
      } else {
        markdown += `### ${result.url}\n\n`;
        markdown += `**Scores:** Performance: ${result.scores.performance} | Accessibility: ${result.scores.accessibility} | Best Practices: ${result.scores.bestPractices} | SEO: ${result.scores.seo} | PWA: ${result.scores.pwa}\n\n`;
        
        if (result.opportunities.length > 0) {
          markdown += `**Top Opportunities:**\n`;
          result.opportunities.slice(0, 3).forEach(opp => {
            markdown += `- ${opp.title}: ${Math.round(opp.savings / 1000)}s potential savings\n`;
          });
          markdown += `\n`;
        }
      }
    });

    fs.writeFileSync(markdownPath, markdown);
    this.log(`📝 Markdown summary saved to: ${markdownPath}`, 'success');
  }

  /**
   * Get CSS class for score
   */
  getScoreClass(score) {
    if (score >= 90) return 'score-excellent';
    if (score >= 70) return 'score-good';
    return 'score-poor';
  }

  /**
   * Get status emoji for score
   */
  getStatusEmoji(score) {
    if (score >= 90) return '✅ Excellent';
    if (score >= 70) return '🟡 Good';
    return '❌ Poor';
  }

  /**
   * Format metric name for display
   */
  formatMetricName(name) {
    return name
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Log results to console
   */
  logResults(result) {
    if (result.failed) {
      this.log(`❌ ${result.url}: ${result.error}`, 'error');
      return;
    }

    const status = result.passed.overall ? '✅' : '❌';
    this.log(`${status} ${result.url}`, result.passed.overall ? 'success' : 'warn');
    this.log(`   Performance: ${result.scores.performance}/100 (${result.passed.performance ? '✅' : '❌'})`, 'info');
    this.log(`   Accessibility: ${result.scores.accessibility}/100 (${result.passed.accessibility ? '✅' : '❌'})`, 'info');
    this.log(`   Best Practices: ${result.scores.bestPractices}/100 (${result.passed.bestPractices ? '✅' : '❌'})`, 'info');
    this.log(`   SEO: ${result.scores.seo}/100 (${result.passed.seo ? '✅' : '❌'})`, 'info');
    this.log(`   PWA: ${result.scores.pwa}/100 (${result.passed.pwa ? '✅' : '❌'})`, 'info');
  }

  /**
   * Enhanced logging utility
   */
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

module.exports = LighthouseRunner;

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const config = {
    urls: args.length > 0 ? args : ['http://localhost:3000'],
    isCI: process.env.CI === 'true'
  };

  const runner = new LighthouseRunner(config);
  
  runner.runAudits()
    .then(report => {
      console.log(chalk.green('\n🎉 Performance testing completed!'));
      
      if (report.summary.status === 'failed') {
        console.log(chalk.red('❌ Some tests failed or scores below threshold'));
        process.exit(1);
      } else {
        console.log(chalk.green('✅ All performance tests passed!'));
        process.exit(0);
      }
    })
    .catch(error => {
      console.error(chalk.red('❌ Performance testing failed:'), error);
      process.exit(1);
    });
}

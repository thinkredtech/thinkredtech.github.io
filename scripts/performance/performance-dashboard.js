#!/usr/bin/env node

/**
 * ThinkRED Performance Monitoring Dashboard
 * 
 * Real-time performance monitoring and historical tracking system that integrates
 * with the existing visual reports system.
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class PerformanceMonitoringDashboard {
  constructor(options = {}) {
    this.options = {
      reportsDir: options.reportsDir || path.join(__dirname, '../../reports'),
      performanceDir: options.performanceDir || path.join(__dirname, '../../reports/performance'),
      outputDir: options.outputDir || path.join(__dirname, '../../reports/automated'),
      historicalDataFile: options.historicalDataFile || path.join(__dirname, '../../reports/performance/historical-data.json'),
      maxHistoricalEntries: options.maxHistoricalEntries || 100,
      ...options
    };

    this.performanceData = this.loadHistoricalData();
  }

  /**
   * Load historical performance data
   */
  loadHistoricalData() {
    if (fs.existsSync(this.options.historicalDataFile)) {
      try {
        return JSON.parse(fs.readFileSync(this.options.historicalDataFile, 'utf-8'));
      } catch (error) {
        console.warn('Failed to load historical data, starting fresh:', error.message);
      }
    }

    return {
      entries: [],
      trends: {},
      lastUpdated: null
    };
  }

  /**
   * Save historical performance data
   */
  saveHistoricalData() {
    if (!fs.existsSync(path.dirname(this.options.historicalDataFile))) {
      fs.mkdirSync(path.dirname(this.options.historicalDataFile), { recursive: true });
    }

    fs.writeFileSync(this.options.historicalDataFile, JSON.stringify(this.performanceData, null, 2));
  }

  /**
   * Add new performance entry to historical data
   */
  addPerformanceEntry(entry) {
    this.performanceData.entries.unshift({
      ...entry,
      timestamp: new Date().toISOString()
    });

    // Keep only the most recent entries
    if (this.performanceData.entries.length > this.options.maxHistoricalEntries) {
      this.performanceData.entries = this.performanceData.entries.slice(0, this.options.maxHistoricalEntries);
    }

    this.updateTrends();
    this.performanceData.lastUpdated = new Date().toISOString();
    this.saveHistoricalData();
  }

  /**
   * Update performance trends
   */
  updateTrends() {
    if (this.performanceData.entries.length < 2) return;

    const recent = this.performanceData.entries.slice(0, 10);
    const older = this.performanceData.entries.slice(10, 20);

    if (older.length === 0) return;

    const recentAvg = this.calculateAverageScores(recent);
    const olderAvg = this.calculateAverageScores(older);

    this.performanceData.trends = {
      performance: this.calculateTrend(recentAvg.performance, olderAvg.performance),
      accessibility: this.calculateTrend(recentAvg.accessibility, olderAvg.accessibility),
      bestPractices: this.calculateTrend(recentAvg.bestPractices, olderAvg.bestPractices),
      seo: this.calculateTrend(recentAvg.seo, olderAvg.seo),
      pwa: this.calculateTrend(recentAvg.pwa, olderAvg.pwa),
      bundleSize: this.calculateTrend(recentAvg.bundleSize, olderAvg.bundleSize, true), // Lower is better
      loadTime: this.calculateTrend(recentAvg.loadTime, olderAvg.loadTime, true)
    };
  }

  /**
   * Calculate average scores from entries
   */
  calculateAverageScores(entries) {
    if (entries.length === 0) return {};

    const totals = entries.reduce((acc, entry) => {
      if (entry.lighthouseScores) {
        acc.performance += entry.lighthouseScores.performance || 0;
        acc.accessibility += entry.lighthouseScores.accessibility || 0;
        acc.bestPractices += entry.lighthouseScores.bestPractices || 0;
        acc.seo += entry.lighthouseScores.seo || 0;
        acc.pwa += entry.lighthouseScores.pwa || 0;
      }
      if (entry.bundleSize) acc.bundleSize += entry.bundleSize;
      if (entry.loadTime) acc.loadTime += entry.loadTime;
      return acc;
    }, {
      performance: 0, accessibility: 0, bestPractices: 0, seo: 0, pwa: 0,
      bundleSize: 0, loadTime: 0
    });

    return {
      performance: Math.round(totals.performance / entries.length),
      accessibility: Math.round(totals.accessibility / entries.length),
      bestPractices: Math.round(totals.bestPractices / entries.length),
      seo: Math.round(totals.seo / entries.length),
      pwa: Math.round(totals.pwa / entries.length),
      bundleSize: Math.round(totals.bundleSize / entries.length),
      loadTime: Math.round(totals.loadTime / entries.length)
    };
  }

  /**
   * Calculate trend direction
   */
  calculateTrend(recent, older, lowerIsBetter = false) {
    if (recent === older) return 'stable';
    
    const isImproving = lowerIsBetter ? recent < older : recent > older;
    const change = Math.abs(recent - older);
    
    if (change < 2) return 'stable';
    return isImproving ? 'improving' : 'declining';
  }

  /**
   * Generate performance dashboard
   */
  async generateDashboard() {
    const latestData = this.getLatestPerformanceData();
    const dashboard = this.createDashboardMarkdown(latestData);
    
    const dashboardPath = path.join(this.options.outputDir, 'performance-dashboard.md');
    
    if (!fs.existsSync(this.options.outputDir)) {
      fs.mkdirSync(this.options.outputDir, { recursive: true });
    }
    
    fs.writeFileSync(dashboardPath, dashboard);
    
    console.log(chalk.green(`📊 Performance dashboard generated: ${dashboardPath}`));
    return dashboardPath;
  }

  /**
   * Get latest performance data
   */
  getLatestPerformanceData() {
    const latest = this.performanceData.entries[0];
    const trends = this.performanceData.trends;
    
    return {
      latest,
      trends,
      historicalCount: this.performanceData.entries.length,
      lastUpdated: this.performanceData.lastUpdated
    };
  }

  /**
   * Create dashboard markdown
   */
  createDashboardMarkdown(data) {
    const now = new Date();
    const trendEmoji = (trend) => {
      switch (trend) {
        case 'improving': return '📈';
        case 'declining': return '📉';
        default: return '➡️';
      }
    };

    const scoreEmoji = (score) => {
      if (score >= 90) return '🟢';
      if (score >= 70) return '🟡';
      return '🔴';
    };

    return `# 📊 ThinkRED Performance Dashboard

*Last Updated: ${now.toLocaleString()}*

## 🎯 Current Performance Status

${data.latest ? this.formatLatestPerformance(data.latest) : '⚠️  No performance data available'}

## 📈 Performance Trends

${data.trends ? Object.entries(data.trends).map(([metric, trend]) => 
  `| ${metric.charAt(0).toUpperCase() + metric.slice(1)} | ${trendEmoji(trend)} ${trend.charAt(0).toUpperCase() + trend.slice(1)} |`
).join('\n') : 'No trend data available'}

## 🏆 Performance Metrics Overview

${data.latest?.lighthouseScores ? `
| Category | Score | Status | Trend |
|----------|-------|--------|-------|
| **Performance** | ${data.latest.lighthouseScores.performance}/100 | ${scoreEmoji(data.latest.lighthouseScores.performance)} | ${trendEmoji(data.trends?.performance)} |
| **Accessibility** | ${data.latest.lighthouseScores.accessibility}/100 | ${scoreEmoji(data.latest.lighthouseScores.accessibility)} | ${trendEmoji(data.trends?.accessibility)} |
| **Best Practices** | ${data.latest.lighthouseScores.bestPractices}/100 | ${scoreEmoji(data.latest.lighthouseScores.bestPractices)} | ${trendEmoji(data.trends?.bestPractices)} |
| **SEO** | ${data.latest.lighthouseScores.seo}/100 | ${scoreEmoji(data.latest.lighthouseScores.seo)} | ${trendEmoji(data.trends?.seo)} |
| **PWA** | ${data.latest.lighthouseScores.pwa}/100 | ${scoreEmoji(data.latest.lighthouseScores.pwa)} | ${trendEmoji(data.trends?.pwa)} |
` : 'No lighthouse scores available'}

## 📦 Bundle Analysis

${data.latest?.bundleSize ? `
**Total Bundle Size:** ${this.formatBytes(data.latest.bundleSize)} ${trendEmoji(data.trends?.bundleSize)}

${data.latest.bundleBreakdown ? this.formatBundleBreakdown(data.latest.bundleBreakdown) : ''}
` : 'No bundle data available'}

## ⚡ Core Web Vitals

${data.latest?.coreWebVitals ? this.formatCoreWebVitals(data.latest.coreWebVitals) : 'No Core Web Vitals data available'}

## 🔍 Recent Performance History

${this.formatRecentHistory()}

## 🎯 Performance Recommendations

${this.generatePerformanceRecommendations(data)}

## 📋 Quick Actions

- [🔄 Run Performance Test](../scripts/performance/lighthouse-runner.js)
- [🚀 Pre-Deployment Check](../scripts/performance/pre-deployment-checker.js)
- [📊 View Historical Data](./performance/historical-data.json)
- [🌐 Live Website](https://thinkredtech.github.io)

---

*Generated by ThinkRED Performance Monitoring Dashboard*
*Historical Data Points: ${data.historicalCount}*
*Next Update: Automated on deployment*`;
  }

  /**
   * Format latest performance data
   */
  formatLatestPerformance(latest) {
    if (!latest) return 'No data available';

    const status = this.getOverallStatus(latest);
    const statusEmoji = status === 'excellent' ? '🟢' : status === 'good' ? '🟡' : '🔴';

    return `
**Overall Status:** ${statusEmoji} ${status.toUpperCase()}

**Last Test:** ${new Date(latest.timestamp).toLocaleString()}
**Test Duration:** ${latest.duration ? `${latest.duration}ms` : 'N/A'}
${latest.url ? `**URL Tested:** ${latest.url}` : ''}
`;
  }

  /**
   * Format bundle breakdown
   */
  formatBundleBreakdown(breakdown) {
    return `
| Asset Type | Size | Percentage |
|------------|------|------------|
| JavaScript | ${this.formatBytes(breakdown.js)} | ${breakdown.jsPercentage}% |
| CSS | ${this.formatBytes(breakdown.css)} | ${breakdown.cssPercentage}% |
| Images | ${this.formatBytes(breakdown.images)} | ${breakdown.imagePercentage}% |
| Other | ${this.formatBytes(breakdown.other)} | ${breakdown.otherPercentage}% |
`;
  }

  /**
   * Format Core Web Vitals
   */
  formatCoreWebVitals(vitals) {
    const vitalsData = [
      { name: 'First Contentful Paint', value: vitals.fcp, unit: 'ms', threshold: 1800 },
      { name: 'Largest Contentful Paint', value: vitals.lcp, unit: 'ms', threshold: 2500 },
      { name: 'First Input Delay', value: vitals.fid, unit: 'ms', threshold: 100 },
      { name: 'Cumulative Layout Shift', value: vitals.cls, unit: '', threshold: 0.1 },
      { name: 'Time to Interactive', value: vitals.tti, unit: 'ms', threshold: 3800 }
    ];

    return `
| Metric | Value | Status |
|--------|-------|--------|
${vitalsData.map(vital => {
  const status = vital.value <= vital.threshold ? '🟢 Good' : '🔴 Needs Improvement';
  const displayValue = vital.unit ? `${Math.round(vital.value)}${vital.unit}` : vital.value.toFixed(3);
  return `| ${vital.name} | ${displayValue} | ${status} |`;
}).join('\n')}
`;
  }

  /**
   * Format recent performance history
   */
  formatRecentHistory() {
    const recentEntries = this.performanceData.entries.slice(0, 5);
    
    if (recentEntries.length === 0) {
      return 'No historical data available';
    }

    return `
| Date | Performance | Accessibility | Best Practices | SEO | Bundle Size |
|------|-------------|---------------|----------------|-----|-------------|
${recentEntries.map(entry => {
  const date = new Date(entry.timestamp).toLocaleDateString();
  const scores = entry.lighthouseScores || {};
  const bundleSize = entry.bundleSize ? this.formatBytes(entry.bundleSize) : 'N/A';
  
  return `| ${date} | ${scores.performance || 'N/A'} | ${scores.accessibility || 'N/A'} | ${scores.bestPractices || 'N/A'} | ${scores.seo || 'N/A'} | ${bundleSize} |`;
}).join('\n')}
`;
  }

  /**
   * Generate performance recommendations
   */
  generatePerformanceRecommendations(data) {
    const recommendations = [];

    if (data.latest?.lighthouseScores) {
      const scores = data.latest.lighthouseScores;
      
      if (scores.performance < 90) {
        recommendations.push('🚀 **Improve Performance Score**: Focus on Core Web Vitals optimization');
      }
      
      if (scores.accessibility < 95) {
        recommendations.push('♿ **Enhance Accessibility**: Review color contrast and keyboard navigation');
      }
      
      if (scores.bestPractices < 95) {
        recommendations.push('🛡️ **Update Best Practices**: Review security headers and modern standards');
      }
      
      if (scores.seo < 95) {
        recommendations.push('🔍 **Optimize SEO**: Add meta descriptions and structured data');
      }
    }

    if (data.trends) {
      Object.entries(data.trends).forEach(([metric, trend]) => {
        if (trend === 'declining') {
          recommendations.push(`📉 **Address Declining ${metric}**: Performance is trending downward`);
        }
      });
    }

    if (recommendations.length === 0) {
      recommendations.push('🎉 **Great Job!** All performance metrics are looking good');
    }

    return recommendations.map(rec => `- ${rec}`).join('\n');
  }

  /**
   * Get overall performance status
   */
  getOverallStatus(data) {
    if (!data.lighthouseScores) return 'unknown';
    
    const scores = data.lighthouseScores;
    const avgScore = (scores.performance + scores.accessibility + scores.bestPractices + scores.seo) / 4;
    
    if (avgScore >= 90) return 'excellent';
    if (avgScore >= 75) return 'good';
    return 'needs-improvement';
  }

  /**
   * Process lighthouse report and add to dashboard
   */
  async processLighthouseReport(reportPath) {
    try {
      const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
      
      if (report.results && report.results.length > 0) {
        const result = report.results[0]; // Use first result
        
        const entry = {
          type: 'lighthouse',
          url: result.url,
          duration: result.duration,
          lighthouseScores: result.scores,
          coreWebVitals: {
            fcp: result.metrics?.firstContentfulPaint || 0,
            lcp: result.metrics?.largestContentfulPaint || 0,
            fid: result.metrics?.maxPotentialFID || 0,
            cls: result.metrics?.cumulativeLayoutShift || 0,
            tti: result.metrics?.timeToInteractive || 0
          },
          opportunities: result.opportunities?.slice(0, 5) || []
        };
        
        this.addPerformanceEntry(entry);
        console.log(chalk.green('📊 Lighthouse data added to performance dashboard'));
      }
    } catch (error) {
      console.error(chalk.red('Failed to process lighthouse report:'), error.message);
    }
  }

  /**
   * Process pre-deployment report
   */
  async processPreDeploymentReport(reportPath) {
    try {
      const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
      
      const entry = {
        type: 'pre-deployment',
        bundleSize: report.bundleAnalysis?.totalSize || 0,
        bundleBreakdown: {
          js: report.bundleAnalysis?.jsSize || 0,
          css: report.bundleAnalysis?.cssSize || 0,
          images: report.bundleAnalysis?.imageSize || 0,
          other: report.bundleAnalysis?.otherSize || 0,
          jsPercentage: report.bundleAnalysis?.jsPercentage || '0',
          cssPercentage: report.bundleAnalysis?.cssPercentage || '0',
          imagePercentage: report.bundleAnalysis?.imagePercentage || '0',
          otherPercentage: ((report.bundleAnalysis?.otherSize || 0) / (report.bundleAnalysis?.totalSize || 1) * 100).toFixed(1)
        },
        violations: report.violations?.length || 0,
        status: report.status
      };
      
      // Merge with existing lighthouse data if available
      const latestLighthouse = this.performanceData.entries.find(e => e.type === 'lighthouse');
      if (latestLighthouse) {
        entry.lighthouseScores = latestLighthouse.lighthouseScores;
        entry.coreWebVitals = latestLighthouse.coreWebVitals;
      }
      
      this.addPerformanceEntry(entry);
      console.log(chalk.green('📊 Pre-deployment data added to performance dashboard'));
    } catch (error) {
      console.error(chalk.red('Failed to process pre-deployment report:'), error.message);
    }
  }

  /**
   * Format bytes utility
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Scan for new reports and update dashboard
   */
  async scanAndUpdateDashboard() {
    console.log(chalk.blue('🔍 Scanning for new performance reports...'));
    
    // Scan for lighthouse reports
    const lighthouseReports = this.findRecentReports(this.options.performanceDir, 'lighthouse-report-*.json');
    for (const report of lighthouseReports) {
      await this.processLighthouseReport(report);
    }
    
    // Scan for pre-deployment reports  
    const preDeploymentReports = this.findRecentReports(this.options.performanceDir, 'pre-deployment-report-*.json');
    for (const report of preDeploymentReports) {
      await this.processPreDeploymentReport(report);
    }
    
    // Generate updated dashboard
    await this.generateDashboard();
    
    console.log(chalk.green('✅ Performance dashboard updated'));
  }

  /**
   * Find recent reports matching pattern
   */
  findRecentReports(dir, pattern) {
    if (!fs.existsSync(dir)) return [];
    
    const files = fs.readdirSync(dir);
    const regex = new RegExp(pattern.replace('*', '.*'));
    
    return files
      .filter(file => regex.test(file))
      .map(file => path.join(dir, file))
      .filter(filePath => {
        const stats = fs.statSync(filePath);
        const ageHours = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60);
        return ageHours < 24; // Only process reports from last 24 hours
      })
      .sort((a, b) => fs.statSync(b).mtime - fs.statSync(a).mtime) // Newest first
      .slice(0, 5); // Limit to 5 most recent
  }
}

module.exports = PerformanceMonitoringDashboard;

// CLI usage
if (require.main === module) {
  const dashboard = new PerformanceMonitoringDashboard();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'generate':
      dashboard.generateDashboard();
      break;
    case 'scan':
      dashboard.scanAndUpdateDashboard();
      break;
    case 'process-lighthouse':
      if (process.argv[3]) {
        dashboard.processLighthouseReport(process.argv[3]);
      } else {
        console.error('Please provide lighthouse report path');
      }
      break;
    case 'process-predeploy':
      if (process.argv[3]) {
        dashboard.processPreDeploymentReport(process.argv[3]);
      } else {
        console.error('Please provide pre-deployment report path');
      }
      break;
    default:
      console.log(`
ThinkRED Performance Monitoring Dashboard

Usage:
  node performance-dashboard.js generate           # Generate dashboard
  node performance-dashboard.js scan               # Scan and update
  node performance-dashboard.js process-lighthouse <path>  # Process lighthouse report
  node performance-dashboard.js process-predeploy <path>   # Process pre-deployment report
`);
  }
}

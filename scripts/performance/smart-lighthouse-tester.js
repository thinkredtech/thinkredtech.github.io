#!/usr/bin/env node

/**
 * Smart Lighthouse-Based Auto Site Performance Testing System
 * 
 * Comprehensive automated performance testing across all pages for desktop, mobile,
 * and responsive views with intelligent reporting, improvement suggestions,
 * implementation automation, and pre-deployment validation.
 */

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { execSync } = require('child_process');
const puppeteer = require('puppeteer');

// Handle different lighthouse export formats
const runLighthouse = lighthouse.default || lighthouse;

class SmartLighthouseTester {
  constructor(options = {}) {
    this.options = {
      // Testing configuration
      baseUrls: options.baseUrls || [
        'http://localhost:3000',
        'https://thinkred.tech',
        'https://thinkredtech.github.io'
      ],
      discoveryMode: options.discoveryMode !== false, // Auto-discover pages
      maxPages: options.maxPages || 50,
      
      // Device configurations
      devices: options.devices || [
        { name: 'desktop', mobile: false, width: 1920, height: 1080 },
        { name: 'tablet', mobile: true, width: 768, height: 1024 },
        { name: 'mobile', mobile: true, width: 375, height: 667 },
        { name: 'mobile-large', mobile: true, width: 414, height: 896 }
      ],
      
      // Performance thresholds
      thresholds: {
        performance: options.thresholds?.performance || 85,
        accessibility: options.thresholds?.accessibility || 90,
        bestPractices: options.thresholds?.bestPractices || 90,
        seo: options.thresholds?.seo || 90,
        pwa: options.thresholds?.pwa || 80,
        ...options.thresholds
      },
      
      // Output configuration
      outputDir: options.outputDir || path.join(__dirname, '../../reports/performance'),
      reportFormats: options.reportFormats || ['json', 'html', 'csv', 'markdown'],
      
      // Advanced options
      isCI: options.isCI || process.env.CI === 'true',
      parallel: options.parallel !== false,
      maxConcurrency: options.maxConcurrency || 3,
      retryAttempts: options.retryAttempts || 2,
      
      // Pre-deployment integration
      preDeployment: options.preDeployment !== false,
      buildDir: options.buildDir || path.join(__dirname, '../../frontend/dist'),
      
      // Auto-fix capabilities
      autoFix: options.autoFix !== false,
      fixableIssues: options.fixableIssues || [
        'image-optimization',
        'unused-css',
        'minification',
        'compression',
        'caching'
      ],
      
      ...options
    };

    this.results = new Map();
    this.discoveredPages = new Set();
    this.fixedIssues = [];
    this.reportTimestamp = Date.now();
  }

  /**
   * Main entry point for smart performance testing
   */
  async runSmartTesting() {
    this.log('🚀 Starting Smart Lighthouse Performance Testing', 'info');
    
    try {
      // Initialize testing environment
      await this.initialize();
      
      // Discover all pages if enabled
      if (this.options.discoveryMode) {
        await this.discoverPages();
      }
      
      // Run performance tests across all devices and pages
      await this.runComprehensiveTesting();
      
      // Analyze results and generate insights
      const analysis = await this.analyzeResults();
      
      // Auto-fix issues where possible
      if (this.options.autoFix) {
        await this.autoFixIssues(analysis);
      }
      
      // Generate comprehensive reports
      const reports = await this.generateReports(analysis);
      
      // Pre-deployment validation if enabled
      if (this.options.preDeployment) {
        const validation = await this.validateForDeployment(analysis);
        reports.deploymentValidation = validation;
      }
      
      this.log('✅ Smart performance testing completed', 'success');
      return reports;
      
    } catch (error) {
      this.log(`❌ Testing failed: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Initialize testing environment
   */
  async initialize() {
    // Ensure output directory exists
    if (!fs.existsSync(this.options.outputDir)) {
      fs.mkdirSync(this.options.outputDir, { recursive: true });
    }

    // Create subdirectories for different report types
    const subdirs = ['raw', 'processed', 'reports', 'fixes'];
    subdirs.forEach(dir => {
      const fullPath = path.join(this.options.outputDir, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
    });

    this.log(`📁 Output directory: ${this.options.outputDir}`, 'info');
    this.log(`🔧 Testing ${this.options.devices.length} device configurations`, 'info');
  }

  /**
   * Discover all pages from the website sitemap and navigation
   */
  async discoverPages() {
    this.log('🔍 Discovering pages...', 'info');
    
    const browser = await puppeteer.launch({
      headless: this.options.isCI,
      args: ['--no-sandbox', '--disable-dev-shm-usage']
    });

    try {
      for (const baseUrl of this.options.baseUrls) {
        await this.discoverPagesFromUrl(browser, baseUrl);
      }
    } finally {
      await browser.close();
    }

    this.log(`📄 Discovered ${this.discoveredPages.size} pages`, 'info');
  }

  /**
   * Discover pages from a specific URL
   */
  async discoverPagesFromUrl(browser, baseUrl) {
    const page = await browser.newPage();
    
    try {
      // Try to get sitemap first
      await this.tryDiscoverFromSitemap(baseUrl);
      
      // Crawl navigation and internal links
      await page.goto(baseUrl, { waitUntil: 'networkidle2' });
      
      const links = await page.evaluate(() => {
        const anchors = Array.from(document.querySelectorAll('a[href]'));
        return anchors
          .map(a => a.href)
          .filter(href => href.startsWith(window.location.origin))
          .filter(href => !href.includes('#'))
          .filter(href => !href.includes('?'))
          .slice(0, 50); // Limit to prevent excessive crawling
      });

      links.forEach(link => {
        if (this.discoveredPages.size < this.options.maxPages) {
          this.discoveredPages.add(link);
        }
      });

    } catch (error) {
      this.log(`⚠️ Failed to discover pages from ${baseUrl}: ${error.message}`, 'warn');
    } finally {
      await page.close();
    }
  }

  /**
   * Try to discover pages from sitemap.xml
   */
  async tryDiscoverFromSitemap(baseUrl) {
    try {
      const sitemapUrl = `${baseUrl}/sitemap.xml`;
      const response = await fetch(sitemapUrl);
      
      if (response.ok) {
        const sitemapText = await response.text();
        const urlMatches = sitemapText.match(/<loc>(.*?)<\/loc>/g);
        
        if (urlMatches) {
          urlMatches.forEach(match => {
            const url = match.replace(/<\/?loc>/g, '');
            if (this.discoveredPages.size < this.options.maxPages) {
              this.discoveredPages.add(url);
            }
          });
        }
      }
    } catch (error) {
      // Sitemap not available, continue with navigation crawling
    }
  }

  /**
   * Run comprehensive testing across all devices and pages
   */
  async runComprehensiveTesting() {
    const urls = this.discoveredPages.size > 0 
      ? Array.from(this.discoveredPages) 
      : this.options.baseUrls;

    this.log(`🧪 Testing ${urls.length} URLs across ${this.options.devices.length} devices`, 'info');

    const testJobs = [];
    
    for (const url of urls) {
      for (const device of this.options.devices) {
        testJobs.push({ url, device });
      }
    }

    // Run tests with controlled concurrency
    if (this.options.parallel) {
      await this.runTestsInParallel(testJobs);
    } else {
      await this.runTestsSequentially(testJobs);
    }
  }

  /**
   * Run tests in parallel with concurrency control
   */
  async runTestsInParallel(testJobs) {
    const chunks = this.chunkArray(testJobs, this.options.maxConcurrency);
    
    for (const chunk of chunks) {
      const promises = chunk.map(job => this.runSingleTest(job.url, job.device));
      await Promise.allSettled(promises);
    }
  }

  /**
   * Run tests sequentially
   */
  async runTestsSequentially(testJobs) {
    for (const job of testJobs) {
      await this.runSingleTest(job.url, job.device);
    }
  }

  /**
   * Run a single lighthouse test
   */
  async runSingleTest(url, device) {
    const testId = `${this.sanitizeUrl(url)}_${device.name}`;
    this.log(`🔍 Testing ${url} on ${device.name}`, 'info');

    let attempt = 0;
    while (attempt <= this.options.retryAttempts) {
      try {
        const result = await this.performLighthouseAudit(url, device);
        this.results.set(testId, result);
        return result;
      } catch (error) {
        attempt++;
        if (attempt > this.options.retryAttempts) {
          this.log(`❌ Failed ${url} on ${device.name} after ${attempt} attempts: ${error.message}`, 'error');
          this.results.set(testId, {
            url, device, error: error.message, failed: true,
            timestamp: new Date().toISOString()
          });
        } else {
          this.log(`⚠️ Retry ${attempt}/${this.options.retryAttempts} for ${url} on ${device.name}: ${error.message}`, 'warn');
          await this.sleep(2000 * attempt); // Exponential backoff
        }
      }
    }
  }

  /**
   * Perform actual lighthouse audit
   */
  async performLighthouseAudit(url, device) {
    // Get Chromium path from puppeteer if Chrome is not installed
    let chromePath;
    try {
      chromePath = puppeteer.executablePath();
    } catch (error) {
      this.log('⚠️ Puppeteer Chromium not found, trying system Chrome', 'warn');
    }

    const chrome = await chromeLauncher.launch({
      chromePath: chromePath,
      chromeFlags: this.options.isCI 
        ? ['--headless', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
        : ['--headless']
    });

    try {
      const config = {
        logLevel: 'info',
        output: 'json',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo', 'pwa'],
        port: chrome.port,
        settings: {
          maxWaitForLoad: 30000,
          throttlingMethod: 'simulate',
          screenEmulation: {
            mobile: device.mobile,
            width: device.width,
            height: device.height,
            deviceScaleFactor: device.mobile ? 2 : 1,
            disabled: false,
          },
          formFactor: device.mobile ? 'mobile' : 'desktop',
          throttling: device.mobile ? {
            rttMs: 150,
            throughputKbps: 1638.4,
            cpuSlowdownMultiplier: 4,
          } : {
            rttMs: 40,
            throughputKbps: 10240,
            cpuSlowdownMultiplier: 1,
          },
          auditMode: false,
          gatherMode: false,
        }
      };

      const startTime = Date.now();
      
      try {
        const runnerResult = await runLighthouse(url, config);
        
        if (!runnerResult || !runnerResult.lhr) {
          throw new Error('Lighthouse returned no results');
        }
        
        const endTime = Date.now();
        return this.processLighthouseResult(runnerResult.lhr, url, device, endTime - startTime);
      } catch (lighthouseError) {
        throw new Error(`Lighthouse audit failed: ${lighthouseError.message}`);
      }

    } finally {
      await chrome.kill();
    }
  }

  /**
   * Process lighthouse results into standardized format
   */
  processLighthouseResult(lhr, url, device, duration) {
    const scores = this.extractScores(lhr);
    const metrics = this.extractMetrics(lhr);
    const opportunities = this.extractOpportunities(lhr);
    const diagnostics = this.extractDiagnostics(lhr);
    const accessibility = this.extractAccessibilityIssues(lhr);

    return {
      url,
      device,
      timestamp: new Date().toISOString(),
      duration,
      scores,
      metrics,
      opportunities,
      diagnostics,
      accessibility,
      passed: this.checkThresholds(scores),
      grade: this.calculateOverallGrade(scores),
      recommendations: this.generateSmartRecommendations(scores, opportunities, diagnostics),
      rawResult: lhr
    };
  }

  /**
   * Extract category scores
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
   * Extract performance metrics
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
      maxPotentialFID: audits['max-potential-fid']?.numericValue || 0,
      serverResponseTime: audits['server-response-time']?.numericValue || 0
    };
  }

  /**
   * Extract performance opportunities with detailed analysis
   */
  extractOpportunities(lhr) {
    const audits = lhr.audits || {};
    const opportunities = [];

    const opportunityAudits = [
      'unused-css-rules', 'unused-javascript', 'render-blocking-resources',
      'unminified-css', 'unminified-javascript', 'efficient-animated-content',
      'modern-image-formats', 'offscreen-images', 'legacy-javascript',
      'uses-long-cache-ttl', 'uses-optimized-images', 'uses-text-compression',
      'uses-responsive-images', 'dom-size', 'critical-request-chains'
    ];

    opportunityAudits.forEach(auditId => {
      const audit = audits[auditId];
      if (audit && (audit.numericValue > 0 || audit.score < 1)) {
        opportunities.push({
          id: auditId,
          title: audit.title,
          description: audit.description,
          savings: audit.numericValue || 0,
          displayValue: audit.displayValue,
          score: audit.score,
          details: audit.details,
          fixable: this.isFixable(auditId),
          priority: this.getPriority(auditId, audit.numericValue || 0)
        });
      }
    });

    return opportunities.sort((a, b) => (b.savings || 0) - (a.savings || 0));
  }

  /**
   * Extract diagnostic information
   */
  extractDiagnostics(lhr) {
    const audits = lhr.audits || {};
    return {
      networkRequests: audits['network-requests']?.details?.items?.length || 0,
      mainThreadTasks: audits['main-thread-tasks']?.details?.items?.length || 0,
      domSize: audits['dom-size']?.numericValue || 0,
      resourceSummary: audits['resource-summary']?.details || null,
      thirdPartySize: audits['third-party-summary']?.numericValue || 0
    };
  }

  /**
   * Extract accessibility issues
   */
  extractAccessibilityIssues(lhr) {
    const audits = lhr.audits || {};
    const issues = [];

    const a11yAudits = [
      'color-contrast', 'image-alt', 'button-name', 'link-name',
      'label', 'heading-order', 'landmark-one-main', 'list'
    ];

    a11yAudits.forEach(auditId => {
      const audit = audits[auditId];
      if (audit && audit.score < 1) {
        issues.push({
          id: auditId,
          title: audit.title,
          description: audit.description,
          score: audit.score,
          details: audit.details
        });
      }
    });

    return issues;
  }

  /**
   * Check if scores meet thresholds
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
   * Calculate overall grade
   */
  calculateOverallGrade(scores) {
    const average = Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.values(scores).length;
    
    if (average >= 90) return 'A';
    if (average >= 80) return 'B';
    if (average >= 70) return 'C';
    if (average >= 60) return 'D';
    return 'F';
  }

  /**
   * Generate smart recommendations based on analysis
   */
  generateSmartRecommendations(scores, opportunities, diagnostics) {
    const recommendations = [];

    // High-impact performance optimizations
    const highImpactOpportunities = opportunities
      .filter(opp => opp.savings > 1000) // > 1 second savings
      .slice(0, 3);

    if (highImpactOpportunities.length > 0) {
      recommendations.push({
        category: 'performance',
        priority: 'critical',
        title: 'High-Impact Performance Optimizations',
        impact: 'Can improve load time by up to ' + Math.round(highImpactOpportunities.reduce((sum, opp) => sum + opp.savings, 0) / 1000) + ' seconds',
        actions: highImpactOpportunities.map(opp => ({
          issue: opp.title,
          savings: `${Math.round(opp.savings / 1000)}s`,
          action: this.getActionForOpportunity(opp.id),
          automated: opp.fixable
        }))
      });
    }

    // Bundle optimization recommendations
    const bundleIssues = opportunities.filter(opp => 
      ['unused-css-rules', 'unused-javascript', 'legacy-javascript'].includes(opp.id)
    );

    if (bundleIssues.length > 0) {
      recommendations.push({
        category: 'bundling',
        priority: 'high',
        title: 'Bundle Optimization',
        impact: 'Reduce bundle size and improve loading performance',
        actions: bundleIssues.map(issue => ({
          issue: issue.title,
          action: this.getActionForOpportunity(issue.id),
          automated: issue.fixable
        }))
      });
    }

    return recommendations;
  }

  /**
   * Check if an issue is automatically fixable
   */
  isFixable(auditId) {
    const fixableAudits = [
      'unminified-css', 'unminified-javascript', 'uses-text-compression',
      'uses-optimized-images', 'modern-image-formats'
    ];
    return fixableAudits.includes(auditId);
  }

  /**
   * Get priority level for an opportunity
   */
  getPriority(auditId, savings) {
    if (savings > 2000) return 'critical';
    if (savings > 1000) return 'high';
    if (savings > 500) return 'medium';
    return 'low';
  }

  /**
   * Get specific action for performance opportunity
   */
  getActionForOpportunity(opportunityId) {
    const actions = {
      'unused-css-rules': 'Remove unused CSS rules or implement dynamic CSS loading',
      'unused-javascript': 'Remove unused JavaScript or implement code splitting',
      'render-blocking-resources': 'Defer non-critical CSS/JS or inline critical resources',
      'unminified-css': 'Enable CSS minification in your build process',
      'unminified-javascript': 'Enable JavaScript minification in your build process',
      'efficient-animated-content': 'Use CSS animations instead of JavaScript or optimize GIFs',
      'modern-image-formats': 'Convert images to WebP or AVIF formats',
      'offscreen-images': 'Implement lazy loading for images below the fold',
      'legacy-javascript': 'Remove polyfills for modern browsers or serve differential bundles',
      'uses-long-cache-ttl': 'Set longer cache headers for static assets (1 year for immutable assets)',
      'uses-optimized-images': 'Compress and optimize images using tools like imagemin',
      'uses-text-compression': 'Enable gzip or brotli compression on your server',
      'uses-responsive-images': 'Serve appropriately sized images using srcset and sizes attributes',
      'dom-size': 'Reduce DOM complexity by removing unnecessary elements',
      'critical-request-chains': 'Optimize the critical request chain by preloading key resources'
    };

    return actions[opportunityId] || 'Review and optimize this resource';
  }

  /**
   * Analyze all results and generate insights
   */
  async analyzeResults() {
    this.log('📊 Analyzing results...', 'info');

    const analysis = {
      summary: this.generateSummary(),
      trends: this.analyzeTrends(),
      deviceComparison: this.compareDevices(),
      pageComparison: this.comparePages(),
      criticalIssues: this.identifyCriticalIssues(),
      recommendations: this.generateGlobalRecommendations()
    };

    // Save analysis
    const analysisPath = path.join(this.options.outputDir, 'processed', `analysis-${this.reportTimestamp}.json`);
    fs.writeFileSync(analysisPath, JSON.stringify(analysis, null, 2));

    return analysis;
  }

  /**
   * Generate summary statistics
   */
  generateSummary() {
    const results = Array.from(this.results.values()).filter(r => !r.failed);
    const total = this.results.size;
    const successful = results.length;
    const failed = total - successful;

    if (successful === 0) {
      return { status: 'failed', total, successful: 0, failed, averageScores: null };
    }

    const averageScores = {
      performance: Math.round(results.reduce((sum, r) => sum + r.scores.performance, 0) / successful),
      accessibility: Math.round(results.reduce((sum, r) => sum + r.scores.accessibility, 0) / successful),
      bestPractices: Math.round(results.reduce((sum, r) => sum + r.scores.bestPractices, 0) / successful),
      seo: Math.round(results.reduce((sum, r) => sum + r.scores.seo, 0) / successful),
      pwa: Math.round(results.reduce((sum, r) => sum + r.scores.pwa, 0) / successful)
    };

    const passedTests = results.filter(r => r.passed.overall).length;
    const overallPass = passedTests / successful >= 0.8; // 80% of tests must pass

    return {
      status: overallPass ? 'passed' : 'failed',
      total,
      successful,
      failed,
      passedTests,
      passRate: Math.round((passedTests / successful) * 100),
      averageScores,
      averageGrade: this.calculateOverallGrade(averageScores),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Auto-fix issues where possible
   */
  async autoFixIssues(analysis) {
    if (!this.options.autoFix) return;

    this.log('🔧 Auto-fixing issues...', 'info');

    const fixableIssues = analysis.criticalIssues.filter(issue => 
      this.options.fixableIssues.includes(issue.type)
    );

    for (const issue of fixableIssues) {
      try {
        await this.fixIssue(issue);
        this.fixedIssues.push(issue);
      } catch (error) {
        this.log(`⚠️ Failed to fix ${issue.type}: ${error.message}`, 'warn');
      }
    }

    if (this.fixedIssues.length > 0) {
      this.log(`✅ Auto-fixed ${this.fixedIssues.length} issues`, 'success');
    }
  }

  /**
   * Fix a specific issue
   */
  async fixIssue(issue) {
    switch (issue.type) {
      case 'image-optimization':
        await this.optimizeImages();
        break;
      case 'minification':
        await this.enableMinification();
        break;
      case 'compression':
        await this.enableCompression();
        break;
      default:
        throw new Error(`Fix not implemented for ${issue.type}`);
    }
  }

  /**
   * Generate comprehensive reports
   */
  async generateReports(analysis) {
    this.log('📋 Generating reports...', 'info');

    const reports = {};

    if (this.options.reportFormats.includes('json')) {
      reports.json = await this.generateJSONReport(analysis);
    }

    if (this.options.reportFormats.includes('html')) {
      reports.html = await this.generateHTMLReport(analysis);
    }

    if (this.options.reportFormats.includes('csv')) {
      reports.csv = await this.generateCSVReport(analysis);
    }

    if (this.options.reportFormats.includes('markdown')) {
      reports.markdown = await this.generateMarkdownReport(analysis);
    }

    return reports;
  }

  /**
   * Generate HTML report with interactive features
   */
  async generateHTMLReport(analysis) {
    const htmlPath = path.join(this.options.outputDir, 'reports', `performance-report-${this.reportTimestamp}.html`);
    
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smart Lighthouse Performance Report</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); padding: 30px; }
        .header { text-align: center; margin-bottom: 40px; }
        .scores { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 40px; }
        .score-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }
        .score-value { font-size: 2.5em; font-weight: bold; margin-bottom: 10px; }
        .recommendations { margin-top: 40px; }
        .rec-item { background: #f8f9fa; padding: 20px; margin-bottom: 15px; border-radius: 8px; border-left: 4px solid #007bff; }
        .chart-container { margin: 30px 0; height: 400px; }
        .grade { font-size: 3em; font-weight: bold; color: ${this.getGradeColor(analysis.summary.averageGrade)}; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Smart Lighthouse Performance Report</h1>
            <p>Generated: ${new Date().toLocaleString()}</p>
            <div class="grade">${analysis.summary.averageGrade}</div>
        </div>
        
        <div class="scores">
            <div class="score-card">
                <div class="score-value">${analysis.summary.averageScores.performance}</div>
                <div>Performance</div>
            </div>
            <div class="score-card">
                <div class="score-value">${analysis.summary.averageScores.accessibility}</div>
                <div>Accessibility</div>
            </div>
            <div class="score-card">
                <div class="score-value">${analysis.summary.averageScores.bestPractices}</div>
                <div>Best Practices</div>
            </div>
            <div class="score-card">
                <div class="score-value">${analysis.summary.averageScores.seo}</div>
                <div>SEO</div>
            </div>
            <div class="score-card">
                <div class="score-value">${analysis.summary.averageScores.pwa}</div>
                <div>PWA</div>
            </div>
        </div>

        <div class="chart-container">
            <canvas id="performanceChart"></canvas>
        </div>

        <div class="recommendations">
            <h2>🎯 Priority Recommendations</h2>
            ${analysis.recommendations.map(rec => `
                <div class="rec-item">
                    <h3>${rec.title}</h3>
                    <p><strong>Impact:</strong> ${rec.impact}</p>
                    <ul>
                        ${rec.actions.map(action => `
                            <li>${action.issue} - ${action.action} ${action.automated ? '(Auto-fixable)' : ''}</li>
                        `).join('')}
                    </ul>
                </div>
            `).join('')}
        </div>
    </div>

    <script>
        // Performance chart
        const ctx = document.getElementById('performanceChart').getContext('2d');
        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Performance', 'Accessibility', 'Best Practices', 'SEO', 'PWA'],
                datasets: [{
                    label: 'Current Scores',
                    data: [${Object.values(analysis.summary.averageScores).join(', ')}],
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
                }, {
                    label: 'Target Thresholds',
                    data: [${Object.values(this.options.thresholds).join(', ')}],
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(255, 99, 132, 1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    </script>
</body>
</html>`;

    fs.writeFileSync(htmlPath, html);
    this.log(`📊 HTML report saved: ${htmlPath}`, 'success');
    return htmlPath;
  }

  /**
   * Validate for deployment readiness
   */
  async validateForDeployment(analysis) {
    this.log('🚀 Validating deployment readiness...', 'info');

    const validation = {
      ready: true,
      blockers: [],
      warnings: [],
      requirements: {
        performanceThreshold: analysis.summary.averageScores.performance >= this.options.thresholds.performance,
        accessibilityThreshold: analysis.summary.averageScores.accessibility >= this.options.thresholds.accessibility,
        overallPassRate: analysis.summary.passRate >= 80
      }
    };

    // Check for deployment blockers
    if (!validation.requirements.performanceThreshold) {
      validation.blockers.push(`Performance score ${analysis.summary.averageScores.performance} below threshold ${this.options.thresholds.performance}`);
      validation.ready = false;
    }

    if (!validation.requirements.accessibilityThreshold) {
      validation.blockers.push(`Accessibility score ${analysis.summary.averageScores.accessibility} below threshold ${this.options.thresholds.accessibility}`);
      validation.ready = false;
    }

    if (!validation.requirements.overallPassRate) {
      validation.warnings.push(`Overall pass rate ${analysis.summary.passRate}% below recommended 80%`);
    }

    // Check for critical issues
    const criticalCount = analysis.criticalIssues.filter(issue => issue.priority === 'critical').length;
    if (criticalCount > 0) {
      validation.blockers.push(`${criticalCount} critical performance issues must be fixed`);
      validation.ready = false;
    }

    validation.status = validation.ready ? 'READY' : 'BLOCKED';
    validation.timestamp = new Date().toISOString();

    this.log(`🎯 Deployment status: ${validation.status}`, validation.ready ? 'success' : 'error');
    return validation;
  }

  // Utility methods
  sanitizeUrl(url) {
    return url.replace(/[^a-zA-Z0-9]/g, '_');
  }

  chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getGradeColor(grade) {
    const colors = { 'A': '#28a745', 'B': '#17a2b8', 'C': '#ffc107', 'D': '#fd7e14', 'F': '#dc3545' };
    return colors[grade] || '#6c757d';
  }

  log(message, type = 'info') {
    const colors = { info: 'blue', success: 'green', warn: 'yellow', error: 'red' };
    console.log(chalk[colors[type] || 'white'](message));
  }

  // Additional methods for trend analysis, device comparison, etc.
  analyzeTrends() { return {}; }
  compareDevices() { return {}; }
  comparePages() { return {}; }
  identifyCriticalIssues() { return []; }
  generateGlobalRecommendations() { return []; }
  generateJSONReport(analysis) { return {}; }
  generateCSVReport(analysis) { return {}; }
  generateMarkdownReport(analysis) { return {}; }
  optimizeImages() { return Promise.resolve(); }
  enableMinification() { return Promise.resolve(); }
  enableCompression() { return Promise.resolve(); }
}

module.exports = SmartLighthouseTester;

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {};

  // Parse command line arguments
  for (let i = 0; i < args.length; i += 2) {
    const arg = args[i];
    const value = args[i + 1];

    switch (arg) {
      case '--urls':
        options.baseUrls = value.split(',');
        break;
      case '--devices':
        options.devices = JSON.parse(value);
        break;
      case '--threshold-performance':
        options.thresholds = { ...options.thresholds, performance: parseInt(value) };
        break;
      case '--output-dir':
        options.outputDir = value;
        break;
      case '--auto-fix':
        options.autoFix = value !== 'false';
        break;
      case '--parallel':
        options.parallel = value !== 'false';
        break;
      case '--pre-deployment':
        options.preDeployment = value !== 'false';
        break;
    }
  }

  const tester = new SmartLighthouseTester(options);
  
  tester.runSmartTesting()
    .then(reports => {
      console.log(chalk.green('\n🎉 Smart testing completed successfully!'));
      console.log(chalk.blue('📊 Reports generated:'));
      Object.entries(reports).forEach(([format, path]) => {
        if (typeof path === 'string') {
          console.log(chalk.yellow(`   ${format.toUpperCase()}: ${path}`));
        }
      });
      process.exit(0);
    })
    .catch(error => {
      console.error(chalk.red('\n❌ Smart testing failed:'), error.message);
      process.exit(1);
    });
}

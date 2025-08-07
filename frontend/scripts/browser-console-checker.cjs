#!/usr/bin/env node

/**
 * Browser Console Error Checker
 * Uses Puppeteer to load pages and detect console errors/warnings
 * 
 * Features:
 * - Load pages in headless browser
 * - Capture all console messages
 * - Detect JavaScript errors
 * - Check for CSP violations
 * - Monitor network failures
 * - Performance warnings detection
 * 
 * @author ThinkRED Technologies
 * @version 1.0.0
 */

/* eslint-env node */
/* eslint no-console: "off" */

const fs = require('fs');
const path = require('path');

class BrowserConsoleChecker {
  constructor(options = {}) {
    this.options = {
      headless: true,
      timeout: 30000,
      viewport: { width: 1280, height: 720 },
      ...options
    };
    
    this.results = {
      errors: [],
      warnings: [],
      cspViolations: [],
      networkErrors: [],
      performanceWarnings: [],
      consoleMessages: []
    };
  }

  async checkPuppeteerAvailability() {
    try {
      // Try to require puppeteer
      require.resolve('puppeteer');
      return true;
    } catch (error) {
      console.log('⚠️  Puppeteer not found. Installing...');
      return await this.installPuppeteer();
    }
  }

  async installPuppeteer() {
    const { spawn } = require('child_process');
    
    return new Promise((resolve, reject) => {
      console.log('📦 Installing Puppeteer...');
      const npm = spawn('npm', ['install', 'puppeteer', '--save-dev'], {
        stdio: 'inherit',
        cwd: process.cwd()
      });
      
      npm.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Puppeteer installed successfully');
          resolve(true);
        } else {
          console.log('❌ Failed to install Puppeteer');
          resolve(false);
        }
      });
      
      npm.on('error', (error) => {
        console.log(`❌ Error installing Puppeteer: ${error.message}`);
        resolve(false);
      });
    });
  }

  async checkPages(urls) {
    const puppeteerAvailable = await this.checkPuppeteerAvailability();
    
    if (!puppeteerAvailable) {
      console.log('❌ Puppeteer not available. Skipping browser console checks.');
      return {
        skipped: true,
        reason: 'Puppeteer not available'
      };
    }

    const puppeteer = require('puppeteer');
    let browser = null;
    
    try {
      console.log('🚀 Launching browser for console error checking...');
      browser = await puppeteer.launch({
        headless: this.options.headless,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      });

      for (const url of urls) {
        await this.checkSinglePage(browser, url);
      }

      return this.generateBrowserReport();

    } catch (error) {
      console.log(`❌ Browser checking failed: ${error.message}`);
      return {
        error: error.message,
        results: this.results
      };
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  async checkSinglePage(browser, url) {
    console.log(`🔍 Checking page: ${url}`);
    
    const page = await browser.newPage();
    
    try {
      // Set viewport
      await page.setViewport(this.options.viewport);
      
      // Listen for console messages
      page.on('console', (msg) => {
        const type = msg.type();
        const text = msg.text();
        
        this.results.consoleMessages.push({
          type,
          text,
          url,
          timestamp: new Date().toISOString()
        });
        
        // Categorize console messages
        if (type === 'error') {
          this.results.errors.push({
            message: text,
            url,
            type: 'console_error'
          });
        } else if (type === 'warning') {
          this.results.warnings.push({
            message: text,
            url,
            type: 'console_warning'
          });
        }
      });
      
      // Listen for page errors
      page.on('pageerror', (error) => {
        this.results.errors.push({
          message: error.message,
          stack: error.stack,
          url,
          type: 'page_error'
        });
      });
      
      // Listen for request failures
      page.on('requestfailed', (request) => {
        const failure = request.failure();
        this.results.networkErrors.push({
          url: request.url(),
          method: request.method(),
          errorText: failure ? failure.errorText : 'Unknown error',
          pageUrl: url
        });
      });
      
      // Listen for response errors
      page.on('response', (response) => {
        const status = response.status();
        if (status >= 400) {
          this.results.networkErrors.push({
            url: response.url(),
            status,
            statusText: response.statusText(),
            pageUrl: url
          });
        }
      });
      
      // Navigate to page
      const response = await page.goto(url, {
        waitUntil: 'networkidle0',
        timeout: this.options.timeout
      });
      
      if (!response.ok()) {
        this.results.errors.push({
          message: `Failed to load page: ${response.status()} ${response.statusText()}`,
          url,
          type: 'navigation_error'
        });
        return;
      }
      
      // Wait for page to be fully interactive
      await page.waitForLoadState?.('networkidle') || new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check for specific error patterns in page content
      await this.checkPageContent(page, url);
      
      // Check for CSP violations
      await this.checkCSPViolations(page, url);
      
      // Check for performance issues
      await this.checkPerformanceIssues(page, url);
      
      console.log(`✅ Page check completed: ${url}`);
      
    } catch (error) {
      this.results.errors.push({
        message: `Error checking page: ${error.message}`,
        url,
        type: 'check_error'
      });
    } finally {
      await page.close();
    }
  }

  async checkPageContent(page, url) {
    try {
      // Check if page loaded properly
      const bodyContent = await page.evaluate(() => document.body.innerHTML);
      
      if (!bodyContent || bodyContent.length < 100) {
        this.results.errors.push({
          message: 'Page appears to be empty or very minimal',
          url,
          type: 'content_error'
        });
      }
      
      // Check for error messages in the page
      const errorTexts = [
        'Uncaught SyntaxError',
        'Uncaught ReferenceError',
        'Uncaught TypeError',
        'Invalid regular expression',
        'Script error',
        'Network Error',
        'Failed to load'
      ];
      
      for (const errorText of errorTexts) {
        if (bodyContent.includes(errorText)) {
          this.results.errors.push({
            message: `Error text found in page content: "${errorText}"`,
            url,
            type: 'content_error'
          });
        }
      }
      
      // Check for React/JavaScript framework errors
      const hasReactError = await page.evaluate(() => {
        return window.console && window.console.error && 
               document.body.innerHTML.includes('React') && 
               document.body.innerHTML.includes('error');
      });
      
      if (hasReactError) {
        this.results.errors.push({
          message: 'React error detected in page content',
          url,
          type: 'react_error'
        });
      }
      
    } catch (error) {
      console.log(`Warning: Could not check page content for ${url}: ${error.message}`);
    }
  }

  async checkCSPViolations(page, url) {
    try {
      // Check for CSP violation reports
      const cspViolations = await page.evaluate(() => {
        const violations = [];
        
        // Listen for CSP violations (if any were recorded)
        if (window.cspViolations) {
          violations.push(...window.cspViolations);
        }
        
        // Check for common CSP violation indicators in console
        const consoleEntries = window.console._entries || [];
        for (const entry of consoleEntries) {
          if (entry.includes('Content Security Policy') || 
              entry.includes('CSP') || 
              entry.includes('blocked by policy')) {
            violations.push(entry);
          }
        }
        
        return violations;
      });
      
      if (cspViolations.length > 0) {
        this.results.cspViolations.push({
          url,
          violations: cspViolations
        });
      }
      
    } catch (error) {
      console.log(`Warning: Could not check CSP violations for ${url}: ${error.message}`);
    }
  }

  async checkPerformanceIssues(page, url) {
    try {
      // Get performance metrics
      const metrics = await page.metrics();
      
      // Check for performance warnings
      const performanceIssues = [];
      
      if (metrics.JSEventListeners > 50) {
        performanceIssues.push(`High number of JS event listeners: ${metrics.JSEventListeners}`);
      }
      
      if (metrics.Nodes > 1500) {
        performanceIssues.push(`High DOM node count: ${metrics.Nodes}`);
      }
      
      if (metrics.LayoutCount > 30) {
        performanceIssues.push(`High layout count: ${metrics.LayoutCount}`);
      }
      
      // Get timing data
      const timing = await page.evaluate(() => {
        const perf = performance.timing;
        return {
          loadTime: perf.loadEventEnd - perf.navigationStart,
          domContentLoaded: perf.domContentLoadedEventEnd - perf.navigationStart,
          firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0
        };
      });
      
      if (timing.loadTime > 5000) {
        performanceIssues.push(`Slow page load time: ${timing.loadTime}ms`);
      }
      
      if (timing.domContentLoaded > 3000) {
        performanceIssues.push(`Slow DOM content loaded: ${timing.domContentLoaded}ms`);
      }
      
      if (performanceIssues.length > 0) {
        this.results.performanceWarnings.push({
          url,
          issues: performanceIssues,
          metrics: { ...metrics, timing }
        });
      }
      
    } catch (error) {
      console.log(`Warning: Could not check performance for ${url}: ${error.message}`);
    }
  }

  generateBrowserReport() {
    const errorCount = this.results.errors.length;
    const warningCount = this.results.warnings.length;
    const cspViolationCount = this.results.cspViolations.length;
    const networkErrorCount = this.results.networkErrors.length;
    const performanceWarningCount = this.results.performanceWarnings.length;
    
    console.log('\n' + '='.repeat(60));
    console.log('🌐 BROWSER CONSOLE CHECK REPORT');
    console.log('='.repeat(60));
    console.log(`❌ Console Errors: ${errorCount}`);
    console.log(`⚠️  Console Warnings: ${warningCount}`);
    console.log(`🔒 CSP Violations: ${cspViolationCount}`);
    console.log(`🌐 Network Errors: ${networkErrorCount}`);
    console.log(`⚡ Performance Warnings: ${performanceWarningCount}`);
    
    // Detailed error reporting
    if (errorCount > 0) {
      console.log('\n❌ CONSOLE ERRORS:');
      this.results.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. [${error.type}] ${error.message}`);
        if (error.url) console.log(`      URL: ${error.url}`);
      });
    }
    
    if (warningCount > 0) {
      console.log('\n⚠️  CONSOLE WARNINGS:');
      this.results.warnings.forEach((warning, index) => {
        console.log(`   ${index + 1}. [${warning.type}] ${warning.message}`);
        if (warning.url) console.log(`      URL: ${warning.url}`);
      });
    }
    
    if (networkErrorCount > 0) {
      console.log('\n🌐 NETWORK ERRORS:');
      this.results.networkErrors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error.url} - ${error.status || error.errorText}`);
      });
    }
    
    console.log('\n' + '='.repeat(60));
    
    return {
      passed: errorCount === 0 && cspViolationCount === 0 && networkErrorCount === 0,
      errors: this.results.errors,
      warnings: this.results.warnings,
      cspViolations: this.results.cspViolations,
      networkErrors: this.results.networkErrors,
      performanceWarnings: this.results.performanceWarnings,
      summary: {
        errorCount,
        warningCount,
        cspViolationCount,
        networkErrorCount,
        performanceWarningCount
      }
    };
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const serverUrl = args[0] || 'http://localhost:4173';
  
  // Default URLs to check
  const urlsToCheck = [
    serverUrl,
    `${serverUrl}/about`,
    `${serverUrl}/services`,
    `${serverUrl}/contact`,
    `${serverUrl}/portfolio`
  ];
  
  console.log(`🔍 Checking console errors for: ${serverUrl}`);
  console.log(`📄 Pages to check: ${urlsToCheck.length}`);
  
  const checker = new BrowserConsoleChecker();
  const result = await checker.checkPages(urlsToCheck);
  
  if (result.skipped) {
    console.log(`⏭️  Browser check skipped: ${result.reason}`);
    process.exit(0);
  }
  
  if (result.error) {
    console.log(`❌ Browser check failed: ${result.error}`);
    process.exit(1);
  }
  
  if (result.passed) {
    console.log('🎉 No console errors detected!');
    process.exit(0);
  } else {
    console.log('💥 Console errors detected!');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { BrowserConsoleChecker };

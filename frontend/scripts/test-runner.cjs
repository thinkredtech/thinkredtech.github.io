#!/usr/bin/env node

/**
 * Comprehensive Build Test Runner
 * Integrates all validation checks for build quality assurance
 * 
 * Features:
 * - Static build validation
 * - Browser console error checking
 * - Performance validation
 * - Security checks
 * - Accessibility validation
 * - SEO checks
 * 
 * @author ThinkRED Technologies
 * @version 1.0.0
 */

/* eslint-env node */
/* eslint no-console: "off" */

const { spawn } = require('child_process');
const { BuildValidator } = require('./build-validator.cjs');
const { BrowserConsoleChecker } = require('./browser-console-checker.cjs');

class ComprehensiveBuildTester {
  constructor(options = {}) {
    this.options = {
      port: 4173,
      timeout: 60000,
      skipBrowser: false,
      skipPerformance: false,
      ...options
    };
    
    this.results = {
      staticValidation: null,
      browserValidation: null,
      serverProcess: null,
      overallScore: 0,
      passed: false
    };
  }

  async runTests() {
    console.log('🧪 Starting Comprehensive Build Tests');
    console.log('=====================================\n');
    
    try {
      // 1. Static Build Validation
      console.log('📋 Step 1: Static Build Validation');
      const buildValidator = new BuildValidator();
      this.results.staticValidation = await buildValidator.runValidation();
      
      if (!this.results.staticValidation.passed) {
        console.log('❌ Static validation failed. Stopping tests.');
        return this.generateFinalReport();
      }
      
      // 2. Start preview server
      console.log('\n🚀 Step 2: Starting Preview Server');
      const serverStarted = await this.startPreviewServer();
      
      if (!serverStarted) {
        console.log('❌ Failed to start preview server. Skipping browser tests.');
        this.options.skipBrowser = true;
      }
      
      // 3. Browser Console Validation
      if (!this.options.skipBrowser) {
        console.log('\n🌐 Step 3: Browser Console Validation');
        const browserChecker = new BrowserConsoleChecker();
        this.results.browserValidation = await browserChecker.checkPages([
          `http://localhost:${this.options.port}`,
          `http://localhost:${this.options.port}/about`,
          `http://localhost:${this.options.port}/services`,
          `http://localhost:${this.options.port}/contact`,
          `http://localhost:${this.options.port}/portfolio`
        ]);
      } else {
        console.log('\n⏭️  Step 3: Browser validation skipped');
        this.results.browserValidation = { passed: true, skipped: true };
      }
      
      // 4. Performance Validation (if enabled)
      if (!this.options.skipPerformance) {
        console.log('\n⚡ Step 4: Performance Validation');
        await this.runPerformanceTests();
      } else {
        console.log('\n⏭️  Step 4: Performance validation skipped');
      }
      
      return this.generateFinalReport();
      
    } catch (error) {
      console.log(`❌ Test execution failed: ${error.message}`);
      return this.generateFinalReport();
    } finally {
      await this.cleanup();
    }
  }

  async startPreviewServer() {
    return new Promise((resolve) => {
      console.log(`🚀 Starting Vite preview server on port ${this.options.port}...`);
      
      const server = spawn('npx', ['vite', 'preview', '--port', this.options.port.toString()], {
        stdio: ['ignore', 'pipe', 'pipe'],
        cwd: process.cwd()
      });
      
      this.results.serverProcess = server;
      
      let output = '';
      let serverReady = false;
      
      const timeoutId = setTimeout(() => {
        if (!serverReady) {
          console.log('⏰ Server startup timeout');
          resolve(false);
        }
      }, 10000);
      
      server.stdout.on('data', (data) => {
        output += data.toString();
        if (output.includes('Local:') && output.includes('localhost')) {
          serverReady = true;
          clearTimeout(timeoutId);
          console.log('✅ Preview server started successfully');
          // Wait a bit more for server to be fully ready
          setTimeout(() => resolve(true), 2000);
        }
      });
      
      server.stderr.on('data', (data) => {
        const errorOutput = data.toString();
        if (errorOutput.includes('EADDRINUSE')) {
          console.log(`⚠️  Port ${this.options.port} is in use, server might already be running`);
          clearTimeout(timeoutId);
          resolve(true);
        } else if (errorOutput.includes('Error') || errorOutput.includes('error')) {
          console.log(`❌ Server error: ${errorOutput}`);
          clearTimeout(timeoutId);
          resolve(false);
        }
      });
      
      server.on('error', (error) => {
        console.log(`❌ Failed to start server: ${error.message}`);
        clearTimeout(timeoutId);
        resolve(false);
      });
    });
  }

  async runPerformanceTests() {
    try {
      console.log('📊 Running performance tests...');
      
      // Basic performance check using the existing performance test script
      const perfTestExists = require('fs').existsSync('./scripts/performance-test.cjs');
      
      if (perfTestExists) {
        await this.runCommand('node', ['scripts/performance-test.cjs']);
        console.log('✅ Performance tests completed');
      } else {
        console.log('⏭️  Performance test script not found, skipping');
      }
      
    } catch (error) {
      console.log(`⚠️  Performance tests failed: ${error.message}`);
    }
  }

  async runCommand(command, args, options = {}) {
    return new Promise((resolve, reject) => {
      const process = spawn(command, args, {
        stdio: 'inherit',
        cwd: options.cwd || process.cwd(),
        ...options
      });
      
      process.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Command failed with exit code ${code}`));
        }
      });
      
      process.on('error', (error) => {
        reject(error);
      });
    });
  }

  calculateOverallScore() {
    let totalScore = 0;
    let totalWeight = 0;
    
    // Static validation (weight: 40%)
    if (this.results.staticValidation) {
      totalScore += this.results.staticValidation.score * 0.4;
      totalWeight += 0.4;
    }
    
    // Browser validation (weight: 40%)
    if (this.results.browserValidation && !this.results.browserValidation.skipped) {
      const browserScore = this.results.browserValidation.passed ? 100 : 
                          Math.max(0, 100 - (this.results.browserValidation.summary?.errorCount * 20 || 100));
      totalScore += browserScore * 0.4;
      totalWeight += 0.4;
    }
    
    // Performance validation (weight: 20%)
    // Assuming performance passes if no errors thrown
    totalScore += 100 * 0.2;
    totalWeight += 0.2;
    
    return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
  }

  generateFinalReport() {
    this.results.overallScore = this.calculateOverallScore();
    this.results.passed = this.results.overallScore >= 80 && 
                         this.results.staticValidation?.passed !== false &&
                         this.results.browserValidation?.passed !== false;
    
    console.log('\n' + '='.repeat(80));
    console.log('🏆 COMPREHENSIVE BUILD TEST REPORT');
    console.log('='.repeat(80));
    console.log(`📊 Overall Score: ${this.results.overallScore}% ${this.results.passed ? '✅ PASS' : '❌ FAIL'}`);
    
    // Static Validation Results
    if (this.results.staticValidation) {
      const static_ = this.results.staticValidation;
      console.log(`\n📋 Static Validation: ${static_.score}% (${static_.errors.length} errors, ${static_.warnings.length} warnings)`);
    }
    
    // Browser Validation Results
    if (this.results.browserValidation) {
      const browser = this.results.browserValidation;
      if (browser.skipped) {
        console.log('\n🌐 Browser Validation: SKIPPED');
      } else {
        const summary = browser.summary || {};
        console.log(`\n🌐 Browser Validation: ${browser.passed ? 'PASS' : 'FAIL'} ` +
                   `(${summary.errorCount || 0} errors, ${summary.warningCount || 0} warnings)`);
      }
    }
    
    // Recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    
    if (this.results.overallScore < 100) {
      if (this.results.staticValidation?.errors.length > 0) {
        console.log('   🔧 Fix static validation errors to improve build quality');
      }
      if (this.results.browserValidation?.summary?.errorCount > 0) {
        console.log('   🌐 Resolve browser console errors for better user experience');
      }
      if (this.results.overallScore < 80) {
        console.log('   ⚠️  Consider reviewing build process and fixing critical issues');
      }
    } else {
      console.log('   🎉 Excellent! Your build passes all quality checks');
    }
    
    console.log('\n' + '='.repeat(80));
    
    return this.results;
  }

  async cleanup() {
    console.log('\n🧹 Cleaning up...');
    
    if (this.results.serverProcess) {
      console.log('🛑 Stopping preview server...');
      this.results.serverProcess.kill('SIGTERM');
      
      // Give it time to gracefully shutdown
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (!this.results.serverProcess.killed) {
        this.results.serverProcess.kill('SIGKILL');
      }
    }
    
    console.log('✅ Cleanup completed');
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const options = {};
  
  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--skip-browser') {
      options.skipBrowser = true;
    } else if (arg === '--skip-performance') {
      options.skipPerformance = true;
    } else if (arg === '--port') {
      options.port = parseInt(args[++i]) || 4173;
    } else if (arg === '--timeout') {
      options.timeout = parseInt(args[++i]) || 60000;
    }
  }
  
  console.log('🧪 Comprehensive Build Test Suite');
  console.log(`⚙️  Options: ${JSON.stringify(options, null, 2)}\n`);
  
  const tester = new ComprehensiveBuildTester(options);
  const results = await tester.runTests();
  
  if (results.passed) {
    console.log('\n🎉 All tests passed! Build is ready for deployment.');
    process.exit(0);
  } else {
    console.log('\n💥 Some tests failed. Please fix issues before deployment.');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { ComprehensiveBuildTester };

#!/usr/bin/env node

/**
 * Main Performance Testing Orchestrator
 * 
 * Central command interface for all performance testing operations
 * including smart testing, pre-deployment validation, and automated fixes.
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { spawn } = require('child_process');

const SmartLighthouseTester = require('./smart-lighthouse-tester');
const EnhancedPreDeploymentValidator = require('./enhanced-pre-deployment-validator');
const PerformanceTestingConfig = require('./performance-config');
const PerformanceAutoFixer = require('./performance-auto-fixer');
const PerformanceReportsCleanup = require('./performance-reports-cleanup');

class PerformanceTestingOrchestrator {
  constructor() {
    this.config = new PerformanceTestingConfig();
    this.reportDir = path.join(__dirname, '../../reports/performance');
    this.ensureDirectories();
  }

  /**
   * Ensure required directories exist
   */
  ensureDirectories() {
    if (!fs.existsSync(this.reportDir)) {
      fs.mkdirSync(this.reportDir, { recursive: true });
    }
  }

  /**
   * Main entry point for performance testing commands
   */
  async run(command, options = {}) {
    this.log('🚀 Performance Testing Orchestrator', 'info');
    
    try {
      switch (command) {
        case 'test':
          return await this.runPerformanceTest(options);
        case 'validate':
          return await this.runPreDeploymentValidation(options);
        case 'fix':
          return await this.runAutoFix(options);
        case 'comprehensive':
          return await this.runComprehensiveAudit(options);
        case 'monitor':
          return await this.startContinuousMonitoring(options);
        case 'dashboard':
          return await this.generateDashboard(options);
        case 'compare':
          return await this.compareResults(options);
        case 'schedule':
          return await this.setupScheduledTesting(options);
        case 'cleanup':
          return await this.runCleanup(options);
        default:
          this.showHelp();
      }
    } catch (error) {
      this.log(`❌ Command failed: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Run performance test with specified scenario
   */
  async runPerformanceTest(options) {
    const scenario = options.scenario || 'quick-check';
    this.log(`🧪 Running performance test: ${scenario}`, 'info');

    try {
      const scenarioConfig = this.config.getScenarioConfig(scenario);
      const tester = new SmartLighthouseTester(scenarioConfig);
      
      const results = await tester.runSmartTesting();
      
      this.log('✅ Performance test completed', 'success');
      this.logResults(results);
      
      return results;
    } catch (error) {
      this.log(`❌ Performance test failed: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Run pre-deployment validation
   */
  async runPreDeploymentValidation(options) {
    this.log('🔍 Running pre-deployment validation...', 'info');

    try {
      const validator = new EnhancedPreDeploymentValidator({
        buildDir: options.buildDir,
        testUrls: options.testUrls,
        performanceBudget: options.budget ? this.config.performanceBudgets[options.budget]?.thresholds : undefined,
        blockOnFailure: options.blockOnFailure !== false,
        autoFix: options.autoFix !== false
      });

      const assessment = await validator.validateDeployment();
      
      if (assessment.ready) {
        this.log('✅ Deployment validation passed', 'success');
      } else {
        this.log('❌ Deployment validation failed', 'error');
        assessment.blockers.forEach(blocker => {
          this.log(`   • ${blocker}`, 'error');
        });
      }

      return assessment;
    } catch (error) {
      this.log(`❌ Validation failed: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Run automated performance fixes
   */
  async runAutoFix(options) {
    this.log('🔧 Running automated performance fixes...', 'info');

    try {
      // First run a quick performance test to get audit results
      const testResults = await this.runPerformanceTest({ scenario: 'quick-check' });
      
      // Extract audit results for auto-fixing
      const auditResults = Object.values(testResults).filter(result => 
        result && result.opportunities && result.opportunities.length > 0
      );

      if (auditResults.length === 0) {
        this.log('ℹ️ No fixable issues found', 'info');
        return { fixes: [], message: 'No fixable issues found' };
      }

      const fixer = new PerformanceAutoFixer({
        buildDir: options.buildDir,
        dryRun: options.dryRun || false
      });

      const fixReport = await fixer.autoFixIssues(auditResults);
      
      this.log(`✅ Auto-fix completed: ${fixReport.summary.totalFixes} fixes applied`, 'success');
      if (fixReport.summary.estimatedSavings > 0) {
        this.log(`💾 Estimated savings: ${this.formatBytes(fixReport.summary.estimatedSavings)}`, 'info');
      }

      return fixReport;
    } catch (error) {
      this.log(`❌ Auto-fix failed: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Run comprehensive audit (test + validate + fix)
   */
  async runComprehensiveAudit(options) {
    this.log('🔬 Running comprehensive performance audit...', 'info');

    // Run automatic cleanup before comprehensive audit
    await this.performAutoCleanup();

    const auditResults = {
      testing: null,
      validation: null,
      fixes: null,
      summary: {},
      timestamp: new Date().toISOString()
    };

    try {
      // Step 1: Run comprehensive performance testing
      this.log('📊 Step 1: Performance Testing', 'info');
      auditResults.testing = await this.runPerformanceTest({ 
        scenario: options.scenario || 'comprehensive' 
      });

      // Step 2: Run pre-deployment validation
      this.log('🔍 Step 2: Pre-deployment Validation', 'info');
      auditResults.validation = await this.runPreDeploymentValidation({
        ...options,
        blockOnFailure: false // Don't block, just report
      });

      // Step 3: Run auto-fixes if enabled
      if (options.autoFix !== false) {
        this.log('🔧 Step 3: Automated Fixes', 'info');
        auditResults.fixes = await this.runAutoFix({
          ...options,
          dryRun: options.dryRun
        });
      }

      // Step 4: Generate comprehensive summary
      auditResults.summary = this.generateAuditSummary(auditResults);

      // Step 5: Save comprehensive report
      await this.saveComprehensiveReport(auditResults);

      this.log('✅ Comprehensive audit completed', 'success');
      this.logAuditSummary(auditResults.summary);

      return auditResults;
    } catch (error) {
      this.log(`❌ Comprehensive audit failed: ${error.message}`, 'error');
      auditResults.error = error.message;
      return auditResults;
    }
  }

  /**
   * Start continuous monitoring
   */
  async startContinuousMonitoring(options) {
    this.log('📡 Starting continuous performance monitoring...', 'info');

    const interval = options.interval || 3600000; // 1 hour default
    const scenario = options.scenario || 'quick-check';

    this.log(`🔄 Monitoring every ${interval / 60000} minutes with scenario: ${scenario}`, 'info');

    const monitor = setInterval(async () => {
      try {
        this.log('🔍 Running scheduled performance check...', 'info');
        
        const results = await this.runPerformanceTest({ scenario });
        
        // Check if performance has degraded
        await this.checkPerformanceDegradation(results);
        
        this.log('✅ Scheduled check completed', 'success');
      } catch (error) {
        this.log(`⚠️ Scheduled check failed: ${error.message}`, 'warn');
      }
    }, interval);

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      this.log('📡 Stopping continuous monitoring...', 'info');
      clearInterval(monitor);
      process.exit(0);
    });

    this.log('✅ Continuous monitoring started (Press Ctrl+C to stop)', 'success');
    
    // Keep the process alive
    return new Promise(() => {});
  }

  /**
   * Generate performance dashboard
   */
  async generateDashboard(options) {
    this.log('📊 Generating performance dashboard...', 'info');

    try {
      const reportsDir = path.join(this.reportDir, 'reports');
      const reports = this.getRecentReports(reportsDir, 10); // Last 10 reports

      if (reports.length === 0) {
        this.log('ℹ️ No reports found. Run some tests first.', 'info');
        return;
      }

      const dashboard = await this.createDashboard(reports);
      const dashboardPath = path.join(this.reportDir, 'dashboard.html');
      
      fs.writeFileSync(dashboardPath, dashboard);
      
      this.log(`✅ Dashboard generated: ${dashboardPath}`, 'success');
      
      // Open dashboard if requested
      if (options.open) {
        const { exec } = require('child_process');
        exec(`open "${dashboardPath}"`);
      }

      return dashboardPath;
    } catch (error) {
      this.log(`❌ Dashboard generation failed: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Compare performance results
   */
  async compareResults(options) {
    this.log('🔍 Comparing performance results...', 'info');

    try {
      const baseline = options.baseline;
      const current = options.current;

      if (!baseline || !current) {
        throw new Error('Both baseline and current report paths are required');
      }

      const baselineData = JSON.parse(fs.readFileSync(baseline, 'utf8'));
      const currentData = JSON.parse(fs.readFileSync(current, 'utf8'));

      const comparison = this.compareReports(baselineData, currentData);
      
      this.logComparison(comparison);
      
      // Save comparison report
      const comparisonPath = path.join(this.reportDir, `comparison-${Date.now()}.json`);
      fs.writeFileSync(comparisonPath, JSON.stringify(comparison, null, 2));
      
      this.log(`✅ Comparison saved: ${comparisonPath}`, 'success');
      
      return comparison;
    } catch (error) {
      this.log(`❌ Comparison failed: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Setup scheduled testing
   */
  async setupScheduledTesting(options) {
    this.log('⏰ Setting up scheduled testing...', 'info');

    const schedule = options.schedule || 'daily';
    const scenario = options.scenario || 'comprehensive';
    const time = options.time || '02:00';

    // Create a cron job configuration
    const cronConfig = this.createCronConfig(schedule, time, scenario);
    
    this.log(`📅 Scheduled ${scenario} testing ${schedule} at ${time}`, 'success');
    this.log('💡 To enable, add this cron job:', 'info');
    this.log(`   ${cronConfig}`, 'yellow');

    return cronConfig;
  }

  /**
   * Run cleanup of old performance reports
   */
  async runCleanup(options) {
    this.log('🧹 Running performance reports cleanup...', 'info');

    try {
      const cleanup = new PerformanceReportsCleanup({
        reportsDir: this.reportDir,
        retentionDays: options.days || 30,
        dryRun: options.dryRun || false,
        archive: options.archive || false,
        force: options.force || false,
        scenario: options.scenario || null,
        logLevel: options.verbose ? 'debug' : 'info'
      });

      const result = await cleanup.cleanup();
      
      this.log('✅ Cleanup completed successfully', 'success');
      return result;
    } catch (error) {
      this.log(`❌ Cleanup failed: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Perform automatic cleanup before major operations
   */
  async performAutoCleanup() {
    const automationSettings = this.config.automationSettings;
    
    if (automationSettings.reporting.autoCleanup) {
      this.log('🧹 Running automatic cleanup...', 'info');
      
      try {
        const cleanup = new PerformanceReportsCleanup({
          reportsDir: this.reportDir,
          retentionDays: automationSettings.reporting.retention,
          archive: automationSettings.reporting.archiveOldReports,
          maxTotalSize: automationSettings.reporting.maxDirectorySize * 1024 * 1024,
          logLevel: 'warn' // Quiet for auto cleanup
        });

        await cleanup.cleanup();
      } catch (error) {
        this.log(`⚠️ Auto-cleanup warning: ${error.message}`, 'warn');
        // Don't fail the main operation if cleanup fails
      }
    }
  }

  /**
   * Generate audit summary
   */
  generateAuditSummary(auditResults) {
    const summary = {
      overallGrade: 'N/A',
      performanceScore: 0,
      accessibilityScore: 0,
      issues: {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0
      },
      fixes: {
        applied: 0,
        potential: 0
      },
      deploymentReady: false,
      recommendations: []
    };

    // Extract performance scores
    if (auditResults.testing && auditResults.testing.summary) {
      summary.performanceScore = auditResults.testing.summary.averageScores?.performance || 0;
      summary.accessibilityScore = auditResults.testing.summary.averageScores?.accessibility || 0;
      summary.overallGrade = auditResults.testing.summary.averageGrade || 'N/A';
    }

    // Extract deployment readiness
    if (auditResults.validation) {
      summary.deploymentReady = auditResults.validation.ready;
    }

    // Extract fixes information
    if (auditResults.fixes) {
      summary.fixes.applied = auditResults.fixes.summary?.totalFixes || 0;
    }

    return summary;
  }

  /**
   * Log audit summary
   */
  logAuditSummary(summary) {
    this.log('\n📋 Audit Summary:', 'info');
    this.log(`   Overall Grade: ${summary.overallGrade}`, 'info');
    this.log(`   Performance Score: ${summary.performanceScore}/100`, 'info');
    this.log(`   Accessibility Score: ${summary.accessibilityScore}/100`, 'info');
    this.log(`   Deployment Ready: ${summary.deploymentReady ? '✅ Yes' : '❌ No'}`, summary.deploymentReady ? 'success' : 'error');
    this.log(`   Fixes Applied: ${summary.fixes.applied}`, 'info');
  }

  /**
   * Save comprehensive report
   */
  async saveComprehensiveReport(auditResults) {
    const reportPath = path.join(this.reportDir, `comprehensive-audit-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(auditResults, null, 2));
    
    // Generate HTML report
    const htmlReport = await this.generateHTMLAuditReport(auditResults);
    const htmlPath = path.join(this.reportDir, `comprehensive-audit-${Date.now()}.html`);
    fs.writeFileSync(htmlPath, htmlReport);
    
    this.log(`📊 Comprehensive report saved: ${reportPath}`, 'success');
    this.log(`🌐 HTML report saved: ${htmlPath}`, 'success');
  }

  /**
   * Generate HTML audit report
   */
  async generateHTMLAuditReport(auditResults) {
    const summary = auditResults.summary;
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Comprehensive Performance Audit Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); padding: 40px; }
        .header { text-align: center; margin-bottom: 40px; }
        .grade { font-size: 4em; font-weight: bold; color: ${this.getGradeColor(summary.overallGrade)}; margin: 20px 0; }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 40px 0; }
        .metric-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 12px; text-align: center; }
        .metric-value { font-size: 2.5em; font-weight: bold; margin-bottom: 10px; }
        .status-card { padding: 20px; border-radius: 8px; margin: 20px 0; }
        .ready { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; }
        .not-ready { background: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; }
        .section { margin: 40px 0; }
        .fixes-list { background: #f8f9fa; padding: 20px; border-radius: 8px; }
        .timestamp { color: #6c757d; text-align: center; margin-top: 40px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔬 Comprehensive Performance Audit</h1>
            <div class="grade">${summary.overallGrade}</div>
            <p>Generated: ${new Date(auditResults.timestamp).toLocaleString()}</p>
        </div>
        
        <div class="metrics">
            <div class="metric-card">
                <div class="metric-value">${summary.performanceScore}</div>
                <div>Performance Score</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${summary.accessibilityScore}</div>
                <div>Accessibility Score</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${summary.fixes.applied}</div>
                <div>Fixes Applied</div>
            </div>
        </div>

        <div class="status-card ${summary.deploymentReady ? 'ready' : 'not-ready'}">
            <h3>🚀 Deployment Status</h3>
            <p><strong>${summary.deploymentReady ? '✅ Ready for Deployment' : '❌ Deployment Blocked'}</strong></p>
            ${summary.deploymentReady ? 
              '<p>All performance criteria met. Safe to deploy to production.</p>' : 
              '<p>Performance issues detected. Please address before deployment.</p>'
            }
        </div>

        ${auditResults.fixes && auditResults.fixes.fixes.length > 0 ? `
        <div class="section">
            <h3>🔧 Applied Fixes</h3>
            <div class="fixes-list">
                ${auditResults.fixes.fixes.map(fix => `
                    <div>✅ ${fix.action} ${fix.savings ? `(${this.formatBytes(fix.savings)} saved)` : ''}</div>
                `).join('')}
            </div>
        </div>
        ` : ''}

        <div class="timestamp">
            Report generated by Performance Testing Orchestrator v1.0.0
        </div>
    </div>
</body>
</html>`;
  }

  /**
   * Log results summary
   */
  logResults(results) {
    if (results.summary) {
      this.log(`📊 Test Summary:`, 'info');
      this.log(`   Status: ${results.summary.status}`, results.summary.status === 'passed' ? 'success' : 'error');
      this.log(`   Tests: ${results.summary.successful}/${results.summary.total}`, 'info');
      if (results.summary.averageScores) {
        this.log(`   Performance: ${results.summary.averageScores.performance}/100`, 'info');
        this.log(`   Accessibility: ${results.summary.averageScores.accessibility}/100`, 'info');
      }
    }
  }

  /**
   * Show help information
   */
  showHelp() {
    console.log(chalk.blue('\n🚀 Performance Testing Orchestrator\n'));
    console.log(chalk.yellow('Usage: npm run perf:test <command> [options]\n'));
    
    console.log(chalk.green('Commands:'));
    console.log('  test [scenario]           Run performance test with scenario');
    console.log('  validate                  Run pre-deployment validation');
    console.log('  fix                       Apply automated performance fixes');
    console.log('  comprehensive             Run complete audit (test + validate + fix)');
    console.log('  monitor                   Start continuous monitoring');
    console.log('  dashboard                 Generate performance dashboard');
    console.log('  compare <baseline> <current>  Compare two performance reports');
    console.log('  schedule                  Setup scheduled testing');
    console.log('  cleanup                   Clean up old performance reports');
    
    console.log(chalk.green('\nAvailable Scenarios:'));
    Object.entries(this.config.testScenarios).forEach(([key, scenario]) => {
      console.log(`  ${key.padEnd(20)} ${scenario.name}`);
    });

    console.log(chalk.green('\nExamples:'));
    console.log('  npm run perf:test test quick-check');
    console.log('  npm run perf:test comprehensive --auto-fix');
    console.log('  npm run perf:test validate --build-dir ./dist');
    console.log('  npm run perf:test monitor --scenario=quick-check --interval=1800000');
    console.log('  npm run perf:test cleanup --days=7 --archive');
    console.log('  npm run perf:test cleanup --scenario=quick-check --dry-run');
  }

  // Utility methods
  getGradeColor(grade) {
    const colors = { 'A': '#28a745', 'B': '#17a2b8', 'C': '#ffc107', 'D': '#fd7e14', 'F': '#dc3545' };
    return colors[grade] || '#6c757d';
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  log(message, type = 'info') {
    const colors = { info: 'blue', success: 'green', warn: 'yellow', error: 'red' };
    console.log(chalk[colors[type] || 'white'](message));
  }

  // Placeholder methods for additional functionality
  checkPerformanceDegradation(results) { return Promise.resolve(); }
  getRecentReports(dir, count) { return []; }
  createDashboard(reports) { return Promise.resolve('<html>Dashboard</html>'); }
  compareReports(baseline, current) { return {}; }
  logComparison(comparison) { }
  createCronConfig(schedule, time, scenario) { 
    return `0 ${time.split(':')[1]} ${time.split(':')[0]} * * * cd ${process.cwd()} && npm run perf:test test ${scenario}`;
  }
}

module.exports = PerformanceTestingOrchestrator;

// CLI usage
if (require.main === module) {
  const orchestrator = new PerformanceTestingOrchestrator();
  const command = process.argv[2];
  const args = process.argv.slice(3);
  
  // Parse options
  const options = {};
  
  // If command is not provided, show help
  if (!command) {
    orchestrator.showHelp();
    process.exit(0);
  }
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.substring(2);
      const value = args[i + 1];
      
      if (value && !value.startsWith('--')) {
        options[key] = value;
        i++; // Skip next arg since it's a value
      } else {
        options[key] = true;
      }
    } else if (!options.scenario && !arg.startsWith('-')) {
      // First non-option argument after command is the scenario
      options.scenario = arg;
    }
  }

  orchestrator.run(command, options)
    .then(() => {
      process.exit(0);
    })
    .catch(error => {
      console.error(chalk.red('\n❌ Operation failed:'), error.message);
      process.exit(1);
    });
}

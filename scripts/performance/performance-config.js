#!/usr/bin/env node

/**
 * Performance Testing Configuration Manager
 * 
 * Centralized configuration management for all performance testing scenarios
 * including device profiles, test environments, and automation settings.
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class PerformanceTestingConfig {
  constructor() {
    this.configDir = path.join(__dirname, '../../config/performance');
    this.reportsDir = path.join(__dirname, '../../reports/performance');
    
    this.ensureDirectories();
    this.loadConfigurations();
  }

  /**
   * Ensure required directories exist
   */
  ensureDirectories() {
    [this.configDir, this.reportsDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  /**
   * Load all performance testing configurations
   */
  loadConfigurations() {
    this.devices = this.getDeviceProfiles();
    this.environments = this.getEnvironmentProfiles();
    this.testScenarios = this.getTestScenarios();
    this.performanceBudgets = this.getPerformanceBudgets();
    this.automationSettings = this.getAutomationSettings();
  }

  /**
   * Get comprehensive device profiles for testing
   */
  getDeviceProfiles() {
    return {
      // Desktop configurations
      desktop: {
        name: 'Desktop',
        mobile: false,
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1
        },
        viewport: { width: 1920, height: 1080 }
      },

      'desktop-mid': {
        name: 'Mid-range Desktop',
        mobile: false,
        width: 1366,
        height: 768,
        deviceScaleFactor: 1,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        throttling: {
          rttMs: 100,
          throughputKbps: 5120,
          cpuSlowdownMultiplier: 2
        },
        viewport: { width: 1366, height: 768 }
      },

      // Mobile configurations
      'mobile-premium': {
        name: 'Premium Mobile (iPhone 14 Pro)',
        mobile: true,
        width: 393,
        height: 852,
        deviceScaleFactor: 3,
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
        throttling: {
          rttMs: 70,
          throughputKbps: 1638.4,
          cpuSlowdownMultiplier: 2
        },
        viewport: { width: 393, height: 852 }
      },

      mobile: {
        name: 'Standard Mobile (iPhone 12)',
        mobile: true,
        width: 390,
        height: 844,
        deviceScaleFactor: 3,
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
        throttling: {
          rttMs: 150,
          throughputKbps: 1638.4,
          cpuSlowdownMultiplier: 4
        },
        viewport: { width: 390, height: 844 }
      },

      'mobile-low': {
        name: 'Budget Mobile (Android)',
        mobile: true,
        width: 375,
        height: 667,
        deviceScaleFactor: 2,
        userAgent: 'Mozilla/5.0 (Linux; Android 10; SM-A205U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
        throttling: {
          rttMs: 300,
          throughputKbps: 400,
          cpuSlowdownMultiplier: 6
        },
        viewport: { width: 375, height: 667 }
      },

      // Tablet configurations
      'tablet-landscape': {
        name: 'Tablet Landscape (iPad)',
        mobile: true,
        width: 1024,
        height: 768,
        deviceScaleFactor: 2,
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
        throttling: {
          rttMs: 100,
          throughputKbps: 1638.4,
          cpuSlowdownMultiplier: 2
        },
        viewport: { width: 1024, height: 768 }
      },

      'tablet-portrait': {
        name: 'Tablet Portrait (iPad)',
        mobile: true,
        width: 768,
        height: 1024,
        deviceScaleFactor: 2,
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
        throttling: {
          rttMs: 100,
          throughputKbps: 1638.4,
          cpuSlowdownMultiplier: 2
        },
        viewport: { width: 768, height: 1024 }
      }
    };
  }

  /**
   * Get environment profiles for different testing contexts
   */
  getEnvironmentProfiles() {
    return {
      development: {
        name: 'Development',
        baseUrls: ['http://localhost:3000'],
        description: 'Local development server testing',
        discoveryMode: false,
        maxPages: 5,
        retryAttempts: 1,
        timeout: 30000
      },

      staging: {
        name: 'Staging',
        baseUrls: ['https://staging.thinkred.tech'],
        description: 'Staging environment testing',
        discoveryMode: true,
        maxPages: 20,
        retryAttempts: 2,
        timeout: 45000
      },

      production: {
        name: 'Production',
        baseUrls: [
          'https://thinkred.tech',
          'https://thinkredtech.github.io'
        ],
        description: 'Production environment testing',
        discoveryMode: true,
        maxPages: 50,
        retryAttempts: 3,
        timeout: 60000
      },

      'ci-pipeline': {
        name: 'CI Pipeline',
        baseUrls: ['http://localhost:3000'],
        description: 'Continuous integration testing',
        discoveryMode: false,
        maxPages: 3,
        retryAttempts: 1,
        timeout: 30000,
        headless: true,
        parallel: true,
        maxConcurrency: 2
      }
    };
  }

  /**
   * Get predefined test scenarios
   */
  getTestScenarios() {
    return {
      'quick-check': {
        name: 'Quick Performance Check',
        description: 'Fast validation for development',
        devices: ['desktop', 'mobile'],
        environment: 'development',
        categories: ['performance'],
        reportFormats: ['json'],
        autoFix: false
      },

      'comprehensive': {
        name: 'Comprehensive Testing',
        description: 'Full performance audit across all devices',
        devices: ['desktop', 'desktop-mid', 'mobile-premium', 'mobile', 'mobile-low', 'tablet-landscape'],
        environment: 'production',
        categories: ['performance', 'accessibility', 'best-practices', 'seo', 'pwa'],
        reportFormats: ['json', 'html', 'markdown'],
        autoFix: true
      },

      'pre-deployment': {
        name: 'Pre-deployment Validation',
        description: 'Deployment readiness check',
        devices: ['desktop', 'mobile'],
        environment: 'staging',
        categories: ['performance', 'accessibility', 'best-practices'],
        reportFormats: ['json', 'html', 'markdown'],
        autoFix: true,
        blockOnFailure: true
      },

      'accessibility-focus': {
        name: 'Accessibility Audit',
        description: 'Focused accessibility testing',
        devices: ['desktop', 'mobile', 'tablet-portrait'],
        environment: 'production',
        categories: ['accessibility'],
        reportFormats: ['json', 'html'],
        autoFix: false
      },

      'mobile-optimization': {
        name: 'Mobile Performance Optimization',
        description: 'Mobile-focused performance testing',
        devices: ['mobile-premium', 'mobile', 'mobile-low'],
        environment: 'production',
        categories: ['performance'],
        reportFormats: ['json', 'html'],
        autoFix: true
      }
    };
  }

  /**
   * Get performance budgets for different environments
   */
  getPerformanceBudgets() {
    return {
      strict: {
        name: 'Strict Budget',
        description: 'High-performance requirements',
        thresholds: {
          performance: 95,
          accessibility: 95,
          bestPractices: 95,
          seo: 95,
          pwa: 90
        },
        metrics: {
          firstContentfulPaint: 1500,
          largestContentfulPaint: 2500,
          totalBlockingTime: 200,
          cumulativeLayoutShift: 0.05,
          speedIndex: 3000
        }
      },

      standard: {
        name: 'Standard Budget',
        description: 'Balanced performance requirements',
        thresholds: {
          performance: 85,
          accessibility: 90,
          bestPractices: 90,
          seo: 90,
          pwa: 80
        },
        metrics: {
          firstContentfulPaint: 2000,
          largestContentfulPaint: 4000,
          totalBlockingTime: 300,
          cumulativeLayoutShift: 0.1,
          speedIndex: 4000
        }
      },

      relaxed: {
        name: 'Relaxed Budget',
        description: 'Minimum acceptable performance',
        thresholds: {
          performance: 70,
          accessibility: 85,
          bestPractices: 80,
          seo: 85,
          pwa: 70
        },
        metrics: {
          firstContentfulPaint: 3000,
          largestContentfulPaint: 6000,
          totalBlockingTime: 500,
          cumulativeLayoutShift: 0.2,
          speedIndex: 6000
        }
      }
    };
  }

  /**
   * Get automation settings
   */
  getAutomationSettings() {
    return {
      scheduling: {
        enabled: false,
        frequency: 'daily', // daily, weekly, on-push
        time: '02:00', // 2 AM UTC
        scenarios: ['comprehensive']
      },

      notifications: {
        enabled: true,
        channels: ['console'], // console, email, slack, webhook
        onFailure: true,
        onSuccess: false,
        threshold: 'standard'
      },

      reporting: {
        retention: 30, // days
        formats: ['json', 'html'],
        dashboard: true,
        trends: true,
        comparisons: true,
        autoCleanup: true,
        maxDirectorySize: 100, // MB
        archiveOldReports: true
      },

      integration: {
        cicd: {
          enabled: true,
          blockOnFailure: true,
          scenario: 'pre-deployment'
        },
        monitoring: {
          enabled: false,
          alerting: true,
          metrics: ['performance', 'availability']
        }
      }
    };
  }

  /**
   * Get configuration for a specific scenario
   */
  getScenarioConfig(scenarioName) {
    const scenario = this.testScenarios[scenarioName];
    if (!scenario) {
      throw new Error(`Unknown test scenario: ${scenarioName}`);
    }

    const environment = this.environments[scenario.environment];
    const budget = this.performanceBudgets.standard; // Default budget

    const config = {
      scenario: scenario.name,
      description: scenario.description,
      baseUrls: environment.baseUrls,
      devices: scenario.devices.map(deviceName => ({
        ...this.devices[deviceName],
        name: deviceName
      })),
      thresholds: budget.thresholds,
      criticalMetrics: budget.metrics,
      categories: scenario.categories,
      reportFormats: scenario.reportFormats,
      autoFix: scenario.autoFix,
      blockOnFailure: scenario.blockOnFailure,
      discoveryMode: environment.discoveryMode,
      maxPages: environment.maxPages,
      retryAttempts: environment.retryAttempts,
      timeout: environment.timeout,
      parallel: environment.parallel !== false,
      maxConcurrency: environment.maxConcurrency || 3,
      outputDir: path.join(this.reportsDir, scenarioName)
    };

    return config;
  }

  /**
   * Save configuration to file
   */
  saveConfiguration(name, config) {
    const configPath = path.join(this.configDir, `${name}.json`);
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(chalk.green(`✅ Configuration saved: ${configPath}`));
  }

  /**
   * Load configuration from file
   */
  loadConfiguration(name) {
    const configPath = path.join(this.configDir, `${name}.json`);
    if (!fs.existsSync(configPath)) {
      throw new Error(`Configuration file not found: ${configPath}`);
    }

    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }

  /**
   * List available configurations
   */
  listConfigurations() {
    console.log(chalk.blue('📋 Available Test Scenarios:'));
    Object.entries(this.testScenarios).forEach(([key, scenario]) => {
      console.log(chalk.yellow(`  ${key}: ${scenario.name}`));
      console.log(chalk.gray(`    ${scenario.description}`));
    });

    console.log(chalk.blue('\n🖥️  Available Devices:'));
    Object.entries(this.devices).forEach(([key, device]) => {
      console.log(chalk.yellow(`  ${key}: ${device.name} (${device.width}x${device.height})`));
    });

    console.log(chalk.blue('\n🌍 Available Environments:'));
    Object.entries(this.environments).forEach(([key, env]) => {
      console.log(chalk.yellow(`  ${key}: ${env.name}`));
      console.log(chalk.gray(`    ${env.description}`));
    });

    console.log(chalk.blue('\n💰 Available Performance Budgets:'));
    Object.entries(this.performanceBudgets).forEach(([key, budget]) => {
      console.log(chalk.yellow(`  ${key}: ${budget.name}`));
      console.log(chalk.gray(`    ${budget.description}`));
    });
  }

  /**
   * Validate configuration
   */
  validateConfiguration(config) {
    const errors = [];

    // Validate required fields
    if (!config.baseUrls || config.baseUrls.length === 0) {
      errors.push('baseUrls is required and must not be empty');
    }

    if (!config.devices || config.devices.length === 0) {
      errors.push('devices is required and must not be empty');
    }

    if (!config.thresholds) {
      errors.push('thresholds is required');
    }

    // Validate URLs
    config.baseUrls?.forEach(url => {
      try {
        new URL(url);
      } catch {
        errors.push(`Invalid URL: ${url}`);
      }
    });

    // Validate device configurations
    config.devices?.forEach(device => {
      if (!device.name || !device.width || !device.height) {
        errors.push(`Invalid device configuration: ${JSON.stringify(device)}`);
      }
    });

    if (errors.length > 0) {
      throw new Error(`Configuration validation failed:\n${errors.join('\n')}`);
    }

    return true;
  }

  /**
   * Create custom configuration wizard
   */
  async createCustomConfiguration() {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));

    try {
      console.log(chalk.blue('🧙 Custom Configuration Wizard'));
      console.log(chalk.gray('Create a custom performance testing configuration\n'));

      const name = await question('Configuration name: ');
      const description = await question('Description: ');
      
      console.log(chalk.yellow('\nAvailable devices:'));
      Object.keys(this.devices).forEach(key => console.log(`  - ${key}`));
      const devicesInput = await question('Select devices (comma-separated): ');
      const devices = devicesInput.split(',').map(d => d.trim());

      console.log(chalk.yellow('\nAvailable environments:'));
      Object.keys(this.environments).forEach(key => console.log(`  - ${key}`));
      const environment = await question('Select environment: ');

      console.log(chalk.yellow('\nAvailable budgets:'));
      Object.keys(this.performanceBudgets).forEach(key => console.log(`  - ${key}`));
      const budget = await question('Select performance budget: ');

      const autoFix = (await question('Enable auto-fix? (y/n): ')).toLowerCase() === 'y';

      const customConfig = {
        name,
        description,
        devices,
        environment,
        budget,
        autoFix,
        categories: ['performance', 'accessibility', 'best-practices', 'seo'],
        reportFormats: ['json', 'html'],
        created: new Date().toISOString()
      };

      this.saveConfiguration(name, customConfig);
      console.log(chalk.green(`\n✅ Custom configuration '${name}' created successfully!`));

    } finally {
      rl.close();
    }
  }
}

module.exports = PerformanceTestingConfig;

// CLI usage
if (require.main === module) {
  const config = new PerformanceTestingConfig();
  const command = process.argv[2];

  switch (command) {
    case 'list':
      config.listConfigurations();
      break;

    case 'scenario':
      const scenarioName = process.argv[3];
      if (!scenarioName) {
        console.error(chalk.red('❌ Please specify a scenario name'));
        process.exit(1);
      }
      try {
        const scenarioConfig = config.getScenarioConfig(scenarioName);
        console.log(JSON.stringify(scenarioConfig, null, 2));
      } catch (error) {
        console.error(chalk.red(`❌ ${error.message}`));
        process.exit(1);
      }
      break;

    case 'create':
      config.createCustomConfiguration();
      break;

    case 'validate':
      const configName = process.argv[3];
      if (!configName) {
        console.error(chalk.red('❌ Please specify a configuration name'));
        process.exit(1);
      }
      try {
        const testConfig = config.loadConfiguration(configName);
        config.validateConfiguration(testConfig);
        console.log(chalk.green('✅ Configuration is valid'));
      } catch (error) {
        console.error(chalk.red(`❌ ${error.message}`));
        process.exit(1);
      }
      break;

    default:
      console.log(chalk.blue('🔧 Performance Testing Configuration Manager'));
      console.log(chalk.yellow('\nUsage:'));
      console.log('  node performance-config.js list                 - List all configurations');
      console.log('  node performance-config.js scenario <name>      - Get scenario configuration');
      console.log('  node performance-config.js create               - Create custom configuration');
      console.log('  node performance-config.js validate <name>      - Validate configuration');
      break;
  }
}

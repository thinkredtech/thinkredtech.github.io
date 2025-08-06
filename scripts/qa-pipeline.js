#!/usr/bin/env node

/**
 * ThinkRED Comprehensive Quality Assurance Pipeline
 * Runs all lint, test, performance, security, and quality checks across the entire monorepo
 * 
 * @author ThinkRED Technologies
 * @version 1.0.0
 */

/* eslint-env node */
/* eslint no-console: "off" */

const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  colors: {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    bright: '\x1b[1m'
  },
  emoji: {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
    rocket: '🚀',
    gear: '⚙️',
    shield: '🛡️',
    speed: '⚡',
    magnify: '🔍',
    clean: '🧹',
    build: '🏗️',
    test: '🧪',
    lint: '📝',
    format: '💅',
    security: '🔒',
    performance: '📊'
  }
};

class QARunner {
  constructor() {
    this.results = {
      passed: [],
      failed: [],
      warnings: [],
      skipped: []
    };
    this.startTime = Date.now();
  }

  log(message, level = 'info') {
    const timestamp = new Date().toISOString().slice(11, 19);
    const colors = config.colors;
    const emoji = config.emoji;
    
    let prefix, color;
    switch (level) {
      case 'success':
        prefix = emoji.success;
        color = colors.green;
        break;
      case 'error':
        prefix = emoji.error;
        color = colors.red;
        break;
      case 'warning':
        prefix = emoji.warning;
        color = colors.yellow;
        break;
      case 'info':
        prefix = emoji.info;
        color = colors.blue;
        break;
      default:
        prefix = emoji.gear;
        color = colors.white;
    }

    console.log(`${color}[${timestamp}] ${prefix} ${message}${colors.reset}`);
  }

  async runCommand(command, cwd = process.cwd(), description = '') {
    return new Promise((resolve) => {
      this.log(`Running: ${description || command}`, 'info');
      
      const child = spawn('bash', ['-c', command], {
        cwd,
        stdio: 'pipe'
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        const result = {
          command,
          description,
          code,
          stdout,
          stderr,
          success: code === 0
        };

        if (result.success) {
          this.results.passed.push(result);
          this.log(`${description || command} - PASSED`, 'success');
        } else {
          this.results.failed.push(result);
          this.log(`${description || command} - FAILED (exit code: ${code})`, 'error');
          if (stderr) {
            console.log(`${config.colors.red}${stderr}${config.colors.reset}`);
          }
        }

        resolve(result);
      });
    });
  }

  async checkDependencies() {
    this.log('🔍 Checking dependencies...', 'info');
    
    const commands = [
      { cmd: 'npm --version', desc: 'NPM version check' },
      { cmd: 'node --version', desc: 'Node.js version check' }
    ];

    for (const { cmd, desc } of commands) {
      await this.runCommand(cmd, process.cwd(), desc);
    }
  }

  async runInstallChecks() {
    this.log('📦 Checking package installations...', 'info');
    
    // Check root dependencies
    await this.runCommand('npm list --depth=0', process.cwd(), 'Root dependencies check');
    
    // Check frontend dependencies
    const frontendPath = path.join(process.cwd(), 'frontend');
    if (fs.existsSync(frontendPath)) {
      await this.runCommand('npm list --depth=0', frontendPath, 'Frontend dependencies check');
    }

    // Check backend dependencies
    const backendPath = path.join(process.cwd(), 'backend');
    if (fs.existsSync(backendPath)) {
      await this.runCommand('npm list --depth=0', backendPath, 'Backend dependencies check');
    }
  }

  async runLinting() {
    this.log('📝 Running linting checks...', 'info');
    
    const frontendPath = path.join(process.cwd(), 'frontend');
    const backendPath = path.join(process.cwd(), 'backend');

    // Frontend linting
    if (fs.existsSync(frontendPath)) {
      await this.runCommand('npm run lint', frontendPath, 'Frontend ESLint check');
      await this.runCommand('npm run lint:md', frontendPath, 'Markdown linting check');
      await this.runCommand('npm run lint:links:readme', frontendPath, 'README link validation');
    }

    // Backend linting
    if (fs.existsSync(backendPath)) {
      await this.runCommand('npm run lint', backendPath, 'Backend linting check');
    }
  }

  async runFormatting() {
    this.log('💅 Running formatting checks...', 'info');
    
    const frontendPath = path.join(process.cwd(), 'frontend');

    if (fs.existsSync(frontendPath)) {
      await this.runCommand('npm run format:check', frontendPath, 'Code formatting check');
    }
  }

  async runTypeChecking() {
    this.log('🔤 Running type checking...', 'info');
    
    const frontendPath = path.join(process.cwd(), 'frontend');

    if (fs.existsSync(frontendPath)) {
      await this.runCommand('npm run type-check', frontendPath, 'TypeScript type checking');
    }
  }

  async runTests() {
    this.log('🧪 Running tests...', 'info');
    
    const frontendPath = path.join(process.cwd(), 'frontend');
    const backendPath = path.join(process.cwd(), 'backend');

    // Frontend tests
    if (fs.existsSync(frontendPath)) {
      await this.runCommand('npm run test', frontendPath, 'Frontend tests');
    }

    // Backend tests (if available)
    if (fs.existsSync(backendPath)) {
      const backendPackage = path.join(backendPath, 'package.json');
      if (fs.existsSync(backendPackage)) {
        const pkg = JSON.parse(fs.readFileSync(backendPackage, 'utf8'));
        if (pkg.scripts && pkg.scripts.test) {
          await this.runCommand('npm run test', backendPath, 'Backend tests');
        }
      }
    }
  }

  async runSecurityChecks() {
    this.log('🛡️ Running security checks...', 'info');
    
    const frontendPath = path.join(process.cwd(), 'frontend');

    // Security audit
    await this.runCommand('npm audit --audit-level=moderate', process.cwd(), 'Root NPM security audit');
    
    if (fs.existsSync(frontendPath)) {
      await this.runCommand('npm audit --audit-level=moderate', frontendPath, 'Frontend NPM security audit');
      await this.runCommand('npm run security:validate', frontendPath, 'Security validation');
      await this.runCommand('npm run security:scan', frontendPath, 'Sensitive data scan');
    }
  }

  async runPerformanceChecks() {
    this.log('📊 Running performance checks...', 'info');
    
    const frontendPath = path.join(process.cwd(), 'frontend');

    if (fs.existsSync(frontendPath)) {
      // Build first for performance testing
      await this.runCommand('npm run build', frontendPath, 'Production build for performance testing');
      
      // GTMetrix optimization and validation
      await this.runCommand('npm run perf:gtmetrix', frontendPath, 'GTMetrix optimization and validation');
      
      // Performance testing (skip if lighthouse not available)
      try {
        await this.runCommand('node -e "require(\'lighthouse\')"', process.cwd(), 'Check Lighthouse availability');
        await this.runCommand('npm run perf:test', process.cwd(), 'Lighthouse performance testing');
      } catch (error) {
        this.log('Lighthouse not available, skipping performance testing', 'warning');
        this.results.skipped.push({
          command: 'npm run perf:test',
          description: 'Lighthouse performance testing',
          reason: 'Lighthouse module not found'
        });
      }
    }
  }

  async runQualityChecks() {
    this.log('🔍 Running additional quality checks...', 'info');
    
    const frontendPath = path.join(process.cwd(), 'frontend');

    if (fs.existsSync(frontendPath)) {
      await this.runCommand('npm run docs:quality', frontendPath, 'Documentation quality check');
      await this.runCommand('npm run reports:health', frontendPath, 'Health report generation');
    }

    // Git repository checks
    await this.runCommand('git status --porcelain', process.cwd(), 'Git working directory status');
    await this.runCommand('git log --oneline -5', process.cwd(), 'Recent commit history');
  }

  async runBuildValidation() {
    this.log('🏗️ Running build validation...', 'info');
    
    const frontendPath = path.join(process.cwd(), 'frontend');

    if (fs.existsSync(frontendPath)) {
      await this.runCommand('npm run build', frontendPath, 'Production build validation');
      
      // Check build output
      const distPath = path.join(frontendPath, 'dist');
      if (fs.existsSync(distPath)) {
        await this.runCommand('ls -la dist/', frontendPath, 'Build output verification');
        await this.runCommand('du -sh dist/', frontendPath, 'Build size analysis');
      }
    }
  }

  generateReport() {
    const endTime = Date.now();
    const duration = ((endTime - this.startTime) / 1000).toFixed(2);
    
    console.log('\n' + '='.repeat(80));
    console.log(`${config.colors.bright}${config.colors.cyan}🎯 THINKRED QUALITY ASSURANCE REPORT${config.colors.reset}`);
    console.log('='.repeat(80));
    
    console.log(`${config.colors.blue}📅 Timestamp: ${new Date().toISOString()}${config.colors.reset}`);
    console.log(`${config.colors.blue}⏱️  Duration: ${duration}s${config.colors.reset}`);
    console.log(`${config.colors.blue}🖥️  Node.js: ${process.version}${config.colors.reset}`);
    console.log(`${config.colors.blue}📦 NPM: ${execSync('npm --version', { encoding: 'utf8' }).trim()}${config.colors.reset}`);
    
    console.log('\n📊 SUMMARY:');
    console.log(`${config.colors.green}${config.emoji.success} Passed: ${this.results.passed.length}${config.colors.reset}`);
    console.log(`${config.colors.red}${config.emoji.error} Failed: ${this.results.failed.length}${config.colors.reset}`);
    console.log(`${config.colors.yellow}${config.emoji.warning} Warnings: ${this.results.warnings.length}${config.colors.reset}`);
    console.log(`${config.colors.blue}${config.emoji.info} Skipped: ${this.results.skipped.length}${config.colors.reset}`);

    if (this.results.failed.length > 0) {
      console.log(`\n${config.colors.red}❌ FAILED CHECKS:${config.colors.reset}`);
      this.results.failed.forEach((result, index) => {
        console.log(`${index + 1}. ${result.description || result.command}`);
        if (result.stderr) {
          console.log(`   Error: ${result.stderr.slice(0, 200)}...`);
        }
      });
    }

    if (this.results.passed.length > 0) {
      console.log(`\n${config.colors.green}✅ PASSED CHECKS:${config.colors.reset}`);
      this.results.passed.forEach((result, index) => {
        console.log(`${index + 1}. ${result.description || result.command}`);
      });
    }

    const successRate = ((this.results.passed.length / (this.results.passed.length + this.results.failed.length)) * 100).toFixed(1);
    
    console.log(`\n${config.colors.bright}🎯 OVERALL QUALITY SCORE: ${successRate}%${config.colors.reset}`);
    
    if (successRate >= 90) {
      console.log(`${config.colors.green}🚀 EXCELLENT! Ready for production deployment.${config.colors.reset}`);
    } else if (successRate >= 75) {
      console.log(`${config.colors.yellow}⚠️  GOOD! Some issues need attention before deployment.${config.colors.reset}`);
    } else {
      console.log(`${config.colors.red}❌ NEEDS WORK! Significant issues require fixing.${config.colors.reset}`);
    }

    console.log('='.repeat(80));
    
    return this.results.failed.length === 0;
  }

  async run() {
    console.log(`${config.colors.bright}${config.colors.magenta}`);
    console.log('████████╗██╗  ██╗██╗███╗   ██╗██╗  ██╗██████╗ ███████╗██████╗ ');
    console.log('╚══██╔══╝██║  ██║██║████╗  ██║██║ ██╔╝██╔══██╗██╔════╝██╔══██╗');
    console.log('   ██║   ███████║██║██╔██╗ ██║█████╔╝ ██████╔╝█████╗  ██║  ██║');
    console.log('   ██║   ██╔══██║██║██║╚██╗██║██╔═██╗ ██╔══██╗██╔══╝  ██║  ██║');
    console.log('   ██║   ██║  ██║██║██║ ╚████║██║  ██╗██║  ██║███████╗██████╔╝');
    console.log('   ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═════╝ ');
    console.log(`${config.colors.reset}`);
    console.log(`${config.colors.cyan}🎯 Comprehensive Quality Assurance Pipeline${config.colors.reset}`);
    console.log(`${config.colors.yellow}⚡ Running all lint, test, security, performance, and quality checks...${config.colors.reset}\n`);

    try {
      await this.checkDependencies();
      await this.runInstallChecks();
      await this.runLinting();
      await this.runFormatting();
      await this.runTypeChecking();
      await this.runTests();
      await this.runSecurityChecks();
      await this.runBuildValidation();
      await this.runPerformanceChecks();
      await this.runQualityChecks();

      const success = this.generateReport();
      process.exit(success ? 0 : 1);

    } catch (error) {
      this.log(`Unexpected error: ${error.message}`, 'error');
      process.exit(1);
    }
  }
}

// CLI interface
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
${config.colors.cyan}ThinkRED Quality Assurance Pipeline${config.colors.reset}

Usage: npm run qa [options]

Options:
  --help, -h     Show this help message
  --version, -v  Show version information

This script runs comprehensive quality checks across the entire monorepo:
  📦 Dependency validation
  📝 Code linting (ESLint, Markdown, Links)
  💅 Code formatting (Prettier)
  🔤 Type checking (TypeScript)
  🧪 Unit tests
  🛡️  Security audits and scans
  🏗️  Build validation
  📊 Performance testing (GTMetrix, Lighthouse)
  🔍 Quality and health checks

Exit codes:
  0 - All checks passed
  1 - One or more checks failed
`);
  process.exit(0);
}

if (args.includes('--version') || args.includes('-v')) {
  console.log('ThinkRED QA Pipeline v1.0.0');
  process.exit(0);
}

// Run the QA pipeline
const runner = new QARunner();
runner.run().catch(error => {
  console.error(`Fatal error: ${error.message}`);
  process.exit(1);
});

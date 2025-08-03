#!/usr/bin/env node

/**
 * Performance Reports Cleanup Script
 * 
 * Manages retention and cleanup of performance testing reports to prevent
 * repository bloat while maintaining important historical data.
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { execSync } = require('child_process');

class PerformanceReportsCleanup {
  constructor(options = {}) {
    this.options = {
      reportsDir: options.reportsDir || path.join(__dirname, '../../reports/performance'),
      retentionDays: options.retentionDays || 30,
      dryRun: options.dryRun || false,
      archive: options.archive || false,
      force: options.force || false,
      scenario: options.scenario || null,
      logLevel: options.logLevel || 'info',
      maxTotalSize: options.maxTotalSize || 100 * 1024 * 1024, // 100MB
      ...options
    };

    this.stats = {
      filesDeleted: 0,
      filesArchived: 0,
      bytesFreed: 0,
      directoriesProcessed: 0,
      errors: 0
    };

    this.archiveDir = path.join(this.options.reportsDir, 'archived');
  }

  /**
   * Main cleanup execution
   */
  async cleanup() {
    this.log('🧹 Starting performance reports cleanup...', 'info');
    this.log(`📁 Reports directory: ${this.options.reportsDir}`, 'info');
    this.log(`⏰ Retention period: ${this.options.retentionDays} days`, 'info');
    
    if (this.options.dryRun) {
      this.log('🔍 DRY RUN MODE - No files will be actually deleted/moved', 'warn');
    }

    try {
      // Ensure directories exist
      await this.ensureDirectories();

      // Get current directory size
      const initialSize = await this.getDirectorySize(this.options.reportsDir);
      this.log(`📊 Current directory size: ${this.formatBytes(initialSize)}`, 'info');

      // Process cleanup based on options
      if (this.options.scenario) {
        await this.cleanupScenario(this.options.scenario);
      } else {
        await this.cleanupAllScenarios();
      }

      // Check total size and compress if needed
      await this.checkSizeLimits();

      // Generate cleanup report
      await this.generateCleanupReport();

      const finalSize = await this.getDirectorySize(this.options.reportsDir);
      const sizeSaved = initialSize - finalSize;

      this.log('✅ Cleanup completed successfully!', 'success');
      this.logStats(sizeSaved);

    } catch (error) {
      this.log(`❌ Cleanup failed: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Ensure required directories exist
   */
  async ensureDirectories() {
    if (this.options.archive && !fs.existsSync(this.archiveDir)) {
      if (!this.options.dryRun) {
        fs.mkdirSync(this.archiveDir, { recursive: true });
      }
      this.log(`📂 Created archive directory: ${this.archiveDir}`, 'info');
    }
  }

  /**
   * Clean up all scenarios
   */
  async cleanupAllScenarios() {
    const scenarios = this.getScenarios();
    
    this.log(`🎯 Found ${scenarios.length} scenarios to process`, 'info');

    for (const scenario of scenarios) {
      await this.cleanupScenario(scenario);
    }
  }

  /**
   * Clean up a specific scenario
   */
  async cleanupScenario(scenarioName) {
    const scenarioPath = path.join(this.options.reportsDir, scenarioName);
    
    if (!fs.existsSync(scenarioPath)) {
      this.log(`⚠️ Scenario directory not found: ${scenarioName}`, 'warn');
      return;
    }

    this.log(`🧹 Processing scenario: ${scenarioName}`, 'info');
    this.stats.directoriesProcessed++;

    const subdirs = ['raw', 'processed', 'reports', 'fixes'];
    
    for (const subdir of subdirs) {
      const subdirPath = path.join(scenarioPath, subdir);
      if (fs.existsSync(subdirPath)) {
        await this.cleanupDirectory(subdirPath, scenarioName, subdir);
      }
    }
  }

  /**
   * Clean up files in a directory
   */
  async cleanupDirectory(dirPath, scenario, subdir) {
    const files = fs.readdirSync(dirPath).filter(file => 
      file.endsWith('.json') || file.endsWith('.html') || file.endsWith('.csv')
    );

    if (files.length === 0) {
      this.log(`📂 No report files found in ${scenario}/${subdir}`, 'debug');
      return;
    }

    this.log(`📄 Found ${files.length} files in ${scenario}/${subdir}`, 'debug');

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.options.retentionDays);

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      
      if (this.shouldCleanupFile(filePath, stats, cutoffDate)) {
        await this.processFile(filePath, stats, scenario, subdir);
      }
    }
  }

  /**
   * Check if a file should be cleaned up
   */
  shouldCleanupFile(filePath, stats, cutoffDate) {
    // Force cleanup overrides all checks
    if (this.options.force) {
      return true;
    }

    // Check file age
    if (stats.mtime < cutoffDate) {
      return true;
    }

    // Check if it's a temporary/failed file
    const fileName = path.basename(filePath);
    if (fileName.includes('temp') || fileName.includes('failed')) {
      return true;
    }

    return false;
  }

  /**
   * Process a single file (delete or archive)
   */
  async processFile(filePath, stats, scenario, subdir) {
    const fileName = path.basename(filePath);
    const fileSize = stats.size;

    try {
      if (this.options.archive) {
        await this.archiveFile(filePath, scenario, subdir);
        this.stats.filesArchived++;
      } else {
        await this.deleteFile(filePath);
        this.stats.filesDeleted++;
      }
      
      this.stats.bytesFreed += fileSize;
      this.log(`${this.options.archive ? '📦' : '🗑️'} ${fileName} (${this.formatBytes(fileSize)})`, 'debug');

    } catch (error) {
      this.stats.errors++;
      this.log(`❌ Failed to process ${fileName}: ${error.message}`, 'error');
    }
  }

  /**
   * Archive a file
   */
  async archiveFile(filePath, scenario, subdir) {
    if (this.options.dryRun) return;

    const fileName = path.basename(filePath);
    const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const archiveSubdir = path.join(this.archiveDir, timestamp, scenario, subdir);
    
    if (!fs.existsSync(archiveSubdir)) {
      fs.mkdirSync(archiveSubdir, { recursive: true });
    }

    const archivePath = path.join(archiveSubdir, fileName);
    fs.renameSync(filePath, archivePath);
  }

  /**
   * Delete a file
   */
  async deleteFile(filePath) {
    if (this.options.dryRun) return;
    fs.unlinkSync(filePath);
  }

  /**
   * Check size limits and compress if needed
   */
  async checkSizeLimits() {
    const currentSize = await this.getDirectorySize(this.options.reportsDir);
    
    if (currentSize > this.options.maxTotalSize) {
      this.log(`⚠️ Directory size (${this.formatBytes(currentSize)}) exceeds limit (${this.formatBytes(this.options.maxTotalSize)})`, 'warn');
      
      if (!this.options.dryRun) {
        await this.compressOldReports();
      }
    }
  }

  /**
   * Compress old reports
   */
  async compressOldReports() {
    this.log('🗜️ Compressing old reports...', 'info');
    
    try {
      const archiveName = `performance-reports-${new Date().toISOString().split('T')[0]}.tar.gz`;
      const archivePath = path.join(this.archiveDir, archiveName);
      
      // Create compressed archive of old reports
      execSync(`tar -czf "${archivePath}" -C "${this.options.reportsDir}" --exclude="archived" --exclude=".gitkeep" --exclude="README.md" .`, 
        { stdio: 'pipe' });
      
      this.log(`✅ Created compressed archive: ${archiveName}`, 'success');
      
    } catch (error) {
      this.log(`❌ Failed to compress reports: ${error.message}`, 'error');
    }
  }

  /**
   * Get list of scenario directories
   */
  getScenarios() {
    if (!fs.existsSync(this.options.reportsDir)) {
      return [];
    }

    return fs.readdirSync(this.options.reportsDir)
      .filter(item => {
        const itemPath = path.join(this.options.reportsDir, item);
        return fs.statSync(itemPath).isDirectory() && 
               item !== 'archived' && 
               !item.startsWith('.');
      });
  }

  /**
   * Get directory size recursively
   */
  async getDirectorySize(dirPath) {
    if (!fs.existsSync(dirPath)) {
      return 0;
    }

    let totalSize = 0;
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory()) {
        totalSize += await this.getDirectorySize(itemPath);
      } else {
        totalSize += stats.size;
      }
    }

    return totalSize;
  }

  /**
   * Generate cleanup report
   */
  async generateCleanupReport() {
    const report = {
      timestamp: new Date().toISOString(),
      options: this.options,
      stats: this.stats,
      summary: {
        totalActions: this.stats.filesDeleted + this.stats.filesArchived,
        spaceSaved: this.formatBytes(this.stats.bytesFreed),
        directoriesProcessed: this.stats.directoriesProcessed,
        errors: this.stats.errors
      }
    };

    if (!this.options.dryRun) {
      const reportPath = path.join(this.options.reportsDir, `cleanup-report-${Date.now()}.json`);
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      this.log(`📊 Cleanup report saved: ${reportPath}`, 'info');
    }

    return report;
  }

  /**
   * Log cleanup statistics
   */
  logStats(sizeSaved) {
    this.log('\n📊 Cleanup Statistics:', 'info');
    this.log(`   Files deleted: ${this.stats.filesDeleted}`, 'info');
    this.log(`   Files archived: ${this.stats.filesArchived}`, 'info');
    this.log(`   Space freed: ${this.formatBytes(sizeSaved)}`, 'success');
    this.log(`   Directories processed: ${this.stats.directoriesProcessed}`, 'info');
    
    if (this.stats.errors > 0) {
      this.log(`   Errors: ${this.stats.errors}`, 'error');
    }
  }

  /**
   * Format bytes to human readable
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Log message with color
   */
  log(message, level = 'info') {
    if (this.options.logLevel === 'debug' || level !== 'debug') {
      const colors = { 
        info: chalk.blue, 
        success: chalk.green, 
        warn: chalk.yellow, 
        error: chalk.red,
        debug: chalk.gray 
      };
      console.log(colors[level](message));
    }
  }
}

module.exports = PerformanceReportsCleanup;

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {};

  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];
    
    switch (arg) {
      case '--days':
        options.retentionDays = parseInt(nextArg);
        i++; // Skip next argument since it's the value
        break;
      case '--scenario':
        options.scenario = nextArg;
        i++; // Skip next argument since it's the value
        break;
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--archive':
        options.archive = true;
        break;
      case '--force':
        options.force = true;
        break;
      case '--log-level':
        options.logLevel = nextArg;
        i++; // Skip next argument since it's the value
        break;
      case '--max-size':
        options.maxTotalSize = parseInt(nextArg) * 1024 * 1024; // Convert MB to bytes
        i++; // Skip next argument since it's the value
        break;
    }
  }

  const cleanup = new PerformanceReportsCleanup(options);
  
  cleanup.cleanup()
    .then(() => {
      console.log(chalk.green('\n🎉 Cleanup completed successfully!'));
      process.exit(0);
    })
    .catch(error => {
      console.error(chalk.red('\n❌ Cleanup failed:'), error.message);
      process.exit(1);
    });
}

#!/usr/bin/env node

/**
 * Performance Auto-Fix Implementation System
 * 
 * Automatically implements performance optimizations based on
 * Lighthouse audit results and best practices.
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { execSync } = require('child_process');
const sharp = require('sharp'); // For image optimization

class PerformanceAutoFixer {
  constructor(options = {}) {
    this.options = {
      buildDir: options.buildDir || path.join(__dirname, '../../frontend/dist'),
      sourceDir: options.sourceDir || path.join(__dirname, '../../frontend/src'),
      backupDir: options.backupDir || path.join(__dirname, '../../reports/performance/backups'),
      dryRun: options.dryRun || false,
      ...options
    };

    this.fixes = [];
    this.errors = [];
    this.backupCreated = false;
  }

  /**
   * Auto-fix performance issues based on audit results
   */
  async autoFixIssues(auditResults) {
    this.log('🔧 Starting auto-fix implementation...', 'info');

    try {
      // Create backup before making changes
      if (!this.options.dryRun) {
        await this.createBackup();
      }

      // Process each audit result
      for (const result of auditResults) {
        if (result.opportunities) {
          await this.processOpportunities(result.opportunities);
        }
      }

      // Apply build-level optimizations
      await this.applyBuildOptimizations();

      // Generate fix report
      const report = await this.generateFixReport();

      this.log(`✅ Auto-fix completed: ${this.fixes.length} fixes applied`, 'success');
      return report;

    } catch (error) {
      this.log(`❌ Auto-fix failed: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Create backup of current build
   */
  async createBackup() {
    if (this.backupCreated) return;

    this.log('💾 Creating backup...', 'info');

    const timestamp = Date.now();
    const backupPath = path.join(this.options.backupDir, `backup-${timestamp}`);

    if (!fs.existsSync(this.options.backupDir)) {
      fs.mkdirSync(this.options.backupDir, { recursive: true });
    }

    // Copy build directory to backup
    execSync(`cp -r "${this.options.buildDir}" "${backupPath}"`, { stdio: 'pipe' });

    this.backupCreated = true;
    this.log(`✅ Backup created: ${backupPath}`, 'success');
  }

  /**
   * Process performance opportunities and apply fixes
   */
  async processOpportunities(opportunities) {
    for (const opportunity of opportunities) {
      try {
        switch (opportunity.id) {
          case 'unused-css-rules':
            await this.fixUnusedCSS(opportunity);
            break;
          case 'unused-javascript':
            await this.fixUnusedJavaScript(opportunity);
            break;
          case 'unminified-css':
            await this.fixUnminifiedCSS(opportunity);
            break;
          case 'unminified-javascript':
            await this.fixUnminifiedJavaScript(opportunity);
            break;
          case 'modern-image-formats':
            await this.fixImageFormats(opportunity);
            break;
          case 'uses-optimized-images':
            await this.optimizeImages(opportunity);
            break;
          case 'uses-text-compression':
            await this.enableTextCompression(opportunity);
            break;
          case 'render-blocking-resources':
            await this.fixRenderBlockingResources(opportunity);
            break;
          case 'uses-long-cache-ttl':
            await this.fixCacheHeaders(opportunity);
            break;
          case 'offscreen-images':
            await this.implementLazyLoading(opportunity);
            break;
          default:
            this.log(`⚠️ No auto-fix available for: ${opportunity.id}`, 'warn');
        }
      } catch (error) {
        this.errors.push({
          opportunity: opportunity.id,
          error: error.message
        });
        this.log(`❌ Failed to fix ${opportunity.id}: ${error.message}`, 'error');
      }
    }
  }

  /**
   * Fix unused CSS rules
   */
  async fixUnusedCSS(opportunity) {
    this.log('🎨 Removing unused CSS...', 'info');

    if (this.options.dryRun) {
      this.fixes.push({
        type: 'unused-css',
        action: 'Would remove unused CSS rules',
        savings: opportunity.savings
      });
      return;
    }

    // Install and run PurgeCSS
    try {
      const { PurgeCSS } = require('purgecss');

      const purgeCSSResult = await new PurgeCSS().purge({
        content: [
          path.join(this.options.buildDir, '**/*.html'),
          path.join(this.options.buildDir, '**/*.js')
        ],
        css: [path.join(this.options.buildDir, '**/*.css')],
        safelist: [
          // Preserve utility classes that might be added dynamically
          /^(is-|has-|js-)/,
          /^(hover|focus|active|disabled):/,
          /^(sm|md|lg|xl):/,
          'sr-only',
          'visually-hidden'
        ]
      });

      // Write purged CSS back to files
      for (const result of purgeCSSResult) {
        if (result.file) {
          fs.writeFileSync(result.file, result.css);
        }
      }

      this.fixes.push({
        type: 'unused-css',
        action: 'Removed unused CSS rules',
        savings: opportunity.savings,
        files: purgeCSSResult.length
      });

    } catch (error) {
      // Fallback: Use a simple regex-based approach
      await this.basicCSSCleanup();
    }
  }

  /**
   * Basic CSS cleanup (fallback)
   */
  async basicCSSCleanup() {
    const cssFiles = this.findFiles(this.options.buildDir, '.css');

    for (const cssFile of cssFiles) {
      let content = fs.readFileSync(cssFile, 'utf8');
      const originalSize = content.length;

      // Remove comments
      content = content.replace(/\/\*[\s\S]*?\*\//g, '');

      // Remove empty rules
      content = content.replace(/[^}]+\{\s*\}/g, '');

      // Minify whitespace
      content = content.replace(/\s+/g, ' ').trim();

      if (content.length < originalSize) {
        fs.writeFileSync(cssFile, content);
        this.fixes.push({
          type: 'css-cleanup',
          action: `Cleaned CSS file: ${path.basename(cssFile)}`,
          savings: originalSize - content.length
        });
      }
    }
  }

  /**
   * Fix unminified CSS
   */
  async fixUnminifiedCSS(opportunity) {
    this.log('🗜️ Minifying CSS...', 'info');

    if (this.options.dryRun) {
      this.fixes.push({
        type: 'css-minify',
        action: 'Would minify CSS files',
        savings: opportunity.savings
      });
      return;
    }

    const cssFiles = this.findFiles(this.options.buildDir, '.css');

    for (const cssFile of cssFiles) {
      try {
        let content = fs.readFileSync(cssFile, 'utf8');
        const originalSize = content.length;

        // Simple minification
        content = content
          .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
          .replace(/\s+/g, ' ') // Collapse whitespace
          .replace(/;\s*}/g, '}') // Remove unnecessary semicolons
          .replace(/,\s+/g, ',') // Remove spaces after commas
          .replace(/:\s+/g, ':') // Remove spaces after colons
          .replace(/;\s+/g, ';') // Remove spaces after semicolons
          .trim();

        fs.writeFileSync(cssFile, content);

        this.fixes.push({
          type: 'css-minify',
          action: `Minified CSS: ${path.basename(cssFile)}`,
          savings: originalSize - content.length
        });

      } catch (error) {
        this.errors.push({
          file: cssFile,
          error: error.message
        });
      }
    }
  }

  /**
   * Fix unminified JavaScript
   */
  async fixUnminifiedJavaScript(opportunity) {
    this.log('📦 Minifying JavaScript...', 'info');

    if (this.options.dryRun) {
      this.fixes.push({
        type: 'js-minify',
        action: 'Would minify JavaScript files',
        savings: opportunity.savings
      });
      return;
    }

    const jsFiles = this.findFiles(this.options.buildDir, '.js')
      .filter(file => !file.includes('.min.js')); // Skip already minified files

    for (const jsFile of jsFiles) {
      try {
        let content = fs.readFileSync(jsFile, 'utf8');
        const originalSize = content.length;

        // Basic minification (for production, use a proper minifier)
        content = content
          .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
          .replace(/\/\/.*$/gm, '') // Remove line comments
          .replace(/\s+/g, ' ') // Collapse whitespace
          .replace(/;\s*}/g, '}') // Clean up syntax
          .trim();

        fs.writeFileSync(jsFile, content);

        this.fixes.push({
          type: 'js-minify',
          action: `Minified JavaScript: ${path.basename(jsFile)}`,
          savings: originalSize - content.length
        });

      } catch (error) {
        this.errors.push({
          file: jsFile,
          error: error.message
        });
      }
    }
  }

  /**
   * Convert images to modern formats
   */
  async fixImageFormats(opportunity) {
    this.log('🖼️ Converting images to modern formats...', 'info');

    if (this.options.dryRun) {
      this.fixes.push({
        type: 'image-formats',
        action: 'Would convert images to WebP/AVIF',
        savings: opportunity.savings
      });
      return;
    }

    const imageFiles = this.findFiles(this.options.buildDir, ['.jpg', '.jpeg', '.png']);

    for (const imagePath of imageFiles) {
      try {
        const ext = path.extname(imagePath);
        const baseName = path.basename(imagePath, ext);
        const dir = path.dirname(imagePath);

        // Convert to WebP
        const webpPath = path.join(dir, `${baseName}.webp`);
        await sharp(imagePath)
          .webp({ quality: 80 })
          .toFile(webpPath);

        // Convert to AVIF (next-gen format)
        const avifPath = path.join(dir, `${baseName}.avif`);
        await sharp(imagePath)
          .avif({ quality: 75 })
          .toFile(avifPath);

        this.fixes.push({
          type: 'image-format',
          action: `Converted ${path.basename(imagePath)} to WebP and AVIF`,
          files: [webpPath, avifPath]
        });

        // Update HTML to use picture element with fallbacks
        await this.updateImageReferences(imagePath, baseName, dir);

      } catch (error) {
        this.errors.push({
          file: imagePath,
          error: error.message
        });
      }
    }
  }

  /**
   * Optimize images
   */
  async optimizeImages(opportunity) {
    this.log('🗜️ Optimizing images...', 'info');

    if (this.options.dryRun) {
      this.fixes.push({
        type: 'image-optimize',
        action: 'Would optimize images',
        savings: opportunity.savings
      });
      return;
    }

    const imageFiles = this.findFiles(this.options.buildDir, ['.jpg', '.jpeg', '.png', '.gif']);

    for (const imagePath of imageFiles) {
      try {
        const originalStats = fs.statSync(imagePath);
        const originalSize = originalStats.size;

        // Optimize based on format
        const ext = path.extname(imagePath).toLowerCase();
        
        if (['.jpg', '.jpeg'].includes(ext)) {
          await sharp(imagePath)
            .jpeg({ quality: 85, progressive: true })
            .toFile(imagePath + '.tmp');
        } else if (ext === '.png') {
          await sharp(imagePath)
            .png({ quality: 85, compressionLevel: 9 })
            .toFile(imagePath + '.tmp');
        } else {
          continue; // Skip unsupported formats
        }

        // Replace original with optimized version
        fs.renameSync(imagePath + '.tmp', imagePath);

        const newStats = fs.statSync(imagePath);
        const savings = originalSize - newStats.size;

        if (savings > 0) {
          this.fixes.push({
            type: 'image-optimize',
            action: `Optimized ${path.basename(imagePath)}`,
            savings: savings
          });
        }

      } catch (error) {
        this.errors.push({
          file: imagePath,
          error: error.message
        });
      }
    }
  }

  /**
   * Enable text compression by creating compressed versions
   */
  async enableTextCompression(opportunity) {
    this.log('🗜️ Creating compressed text files...', 'info');

    if (this.options.dryRun) {
      this.fixes.push({
        type: 'text-compression',
        action: 'Would create gzip and brotli compressed files',
        savings: opportunity.savings
      });
      return;
    }

    const textFiles = [
      ...this.findFiles(this.options.buildDir, '.css'),
      ...this.findFiles(this.options.buildDir, '.js'),
      ...this.findFiles(this.options.buildDir, '.html'),
      ...this.findFiles(this.options.buildDir, '.json'),
      ...this.findFiles(this.options.buildDir, '.svg')
    ];

    const zlib = require('zlib');

    for (const filePath of textFiles) {
      try {
        const content = fs.readFileSync(filePath);

        // Create gzip version
        const gzipContent = zlib.gzipSync(content, { level: 9 });
        fs.writeFileSync(filePath + '.gz', gzipContent);

        // Create brotli version (if available)
        try {
          const brotliContent = zlib.brotliCompressSync(content, {
            params: {
              [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
              [zlib.constants.BROTLI_PARAM_SIZE_HINT]: content.length
            }
          });
          fs.writeFileSync(filePath + '.br', brotliContent);
        } catch (brotliError) {
          // Brotli not available, skip
        }

        this.fixes.push({
          type: 'text-compression',
          action: `Compressed ${path.basename(filePath)}`,
          savings: content.length - gzipContent.length
        });

      } catch (error) {
        this.errors.push({
          file: filePath,
          error: error.message
        });
      }
    }

    // Create .htaccess for Apache servers
    await this.createCompressionConfig();
  }

  /**
   * Fix render-blocking resources
   */
  async fixRenderBlockingResources(opportunity) {
    this.log('⚡ Fixing render-blocking resources...', 'info');

    if (this.options.dryRun) {
      this.fixes.push({
        type: 'render-blocking',
        action: 'Would optimize render-blocking resources',
        savings: opportunity.savings
      });
      return;
    }

    const htmlFiles = this.findFiles(this.options.buildDir, '.html');

    for (const htmlFile of htmlFiles) {
      try {
        let content = fs.readFileSync(htmlFile, 'utf8');
        let modified = false;

        // Add async/defer to non-critical scripts
        content = content.replace(
          /<script(?![^>]*(?:async|defer))([^>]*src="[^"]*"[^>]*)><\/script>/gi,
          (match, attributes) => {
            // Skip if it's a critical script (you might want to customize this)
            if (attributes.includes('critical') || attributes.includes('inline')) {
              return match;
            }
            modified = true;
            return `<script${attributes} defer></script>`;
          }
        );

        // Add preload for critical CSS and fonts
        const head = content.match(/<head[^>]*>[\s\S]*?<\/head>/i);
        if (head) {
          let headContent = head[0];
          
          // Add font preloads
          const fontPreloads = `
    <link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="/fonts/heading.woff2" as="font" type="font/woff2" crossorigin>`;

          headContent = headContent.replace('</head>', `${fontPreloads}\n  </head>`);
          content = content.replace(head[0], headContent);
          modified = true;
        }

        if (modified) {
          fs.writeFileSync(htmlFile, content);
          this.fixes.push({
            type: 'render-blocking',
            action: `Optimized render-blocking resources in ${path.basename(htmlFile)}`
          });
        }

      } catch (error) {
        this.errors.push({
          file: htmlFile,
          error: error.message
        });
      }
    }
  }

  /**
   * Implement lazy loading for offscreen images
   */
  async implementLazyLoading(opportunity) {
    this.log('🖼️ Implementing lazy loading...', 'info');

    if (this.options.dryRun) {
      this.fixes.push({
        type: 'lazy-loading',
        action: 'Would implement lazy loading for images',
        savings: opportunity.savings
      });
      return;
    }

    const htmlFiles = this.findFiles(this.options.buildDir, '.html');

    for (const htmlFile of htmlFiles) {
      try {
        let content = fs.readFileSync(htmlFile, 'utf8');
        let modified = false;

        // Add lazy loading to images (except the first few)
        let imgCount = 0;
        content = content.replace(
          /<img([^>]*src="[^"]*"[^>]*)>/gi,
          (match, attributes) => {
            imgCount++;
            
            // Skip first 2 images (above the fold)
            if (imgCount <= 2) {
              return match;
            }

            // Skip if already has loading attribute
            if (attributes.includes('loading=')) {
              return match;
            }

            modified = true;
            return `<img${attributes} loading="lazy">`;
          }
        );

        if (modified) {
          fs.writeFileSync(htmlFile, content);
          this.fixes.push({
            type: 'lazy-loading',
            action: `Added lazy loading to images in ${path.basename(htmlFile)}`
          });
        }

      } catch (error) {
        this.errors.push({
          file: htmlFile,
          error: error.message
        });
      }
    }
  }

  /**
   * Apply build-level optimizations
   */
  async applyBuildOptimizations() {
    this.log('⚙️ Applying build optimizations...', 'info');

    // Create optimized .htaccess for caching
    await this.createCacheConfig();

    // Create service worker for caching
    await this.createServiceWorker();

    // Optimize bundle splitting suggestions
    await this.generateBundleSplitSuggestions();
  }

  /**
   * Create compression configuration
   */
  async createCompressionConfig() {
    const htaccessPath = path.join(this.options.buildDir, '.htaccess');
    
    const compressionConfig = `
# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
    AddOutputFilterByType DEFLATE image/svg+xml
</IfModule>

# Enable Brotli compression
<IfModule mod_brotli.c>
    AddOutputFilterByType BROTLI_COMPRESS text/plain
    AddOutputFilterByType BROTLI_COMPRESS text/html
    AddOutputFilterByType BROTLI_COMPRESS text/xml
    AddOutputFilterByType BROTLI_COMPRESS text/css
    AddOutputFilterByType BROTLI_COMPRESS application/xml
    AddOutputFilterByType BROTLI_COMPRESS application/xhtml+xml
    AddOutputFilterByType BROTLI_COMPRESS application/rss+xml
    AddOutputFilterByType BROTLI_COMPRESS application/javascript
    AddOutputFilterByType BROTLI_COMPRESS application/x-javascript
    AddOutputFilterByType BROTLI_COMPRESS image/svg+xml
</IfModule>
`;

    let existingContent = '';
    if (fs.existsSync(htaccessPath)) {
      existingContent = fs.readFileSync(htaccessPath, 'utf8');
    }

    if (!existingContent.includes('mod_deflate') && !existingContent.includes('mod_brotli')) {
      fs.writeFileSync(htaccessPath, existingContent + compressionConfig);
      this.fixes.push({
        type: 'compression-config',
        action: 'Created compression configuration (.htaccess)'
      });
    }
  }

  /**
   * Create cache configuration
   */
  async createCacheConfig() {
    const htaccessFile = path.join(this.options.buildDir, '.htaccess');
    
    const cacheConfig = `
# Enable caching
<IfModule mod_expires.c>
    ExpiresActive on
    
    # Images
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType image/avif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    
    # CSS and JavaScript
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType application/x-javascript "access plus 1 year"
    
    # Fonts
    ExpiresByType font/woff "access plus 1 year"
    ExpiresByType font/woff2 "access plus 1 year"
    ExpiresByType application/font-woff "access plus 1 year"
    ExpiresByType application/font-woff2 "access plus 1 year"
    
    # HTML
    ExpiresByType text/html "access plus 1 hour"
</IfModule>

# Cache-Control headers
<IfModule mod_headers.c>
    <FilesMatch "\\.(css|js|png|jpg|jpeg|gif|webp|avif|svg|woff|woff2)$">
        Header set Cache-Control "public, max-age=31536000, immutable"
    </FilesMatch>
    
    <FilesMatch "\\.(html|htm)$">
        Header set Cache-Control "public, max-age=3600"
    </FilesMatch>
</IfModule>
`;

    let existingContent = '';
    if (fs.existsSync(htaccessFile)) {
      existingContent = fs.readFileSync(htaccessFile, 'utf8');
    }

    if (!existingContent.includes('mod_expires')) {
      fs.writeFileSync(htaccessFile, existingContent + cacheConfig);
      this.fixes.push({
        type: 'cache-config',
        action: 'Created cache configuration (.htaccess)'
      });
    }
  }

  /**
   * Generate fix report
   */
  async generateFixReport() {
    const reportPath = path.join(this.options.backupDir, `auto-fix-report-${Date.now()}.json`);
    
    const report = {
      timestamp: new Date().toISOString(),
      dryRun: this.options.dryRun,
      summary: {
        totalFixes: this.fixes.length,
        totalErrors: this.errors.length,
        estimatedSavings: this.fixes.reduce((sum, fix) => sum + (fix.savings || 0), 0)
      },
      fixes: this.fixes,
      errors: this.errors,
      recommendations: this.generateRecommendations()
    };

    if (!fs.existsSync(this.options.backupDir)) {
      fs.mkdirSync(this.options.backupDir, { recursive: true });
    }

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    this.log(`📊 Fix report saved: ${reportPath}`, 'success');

    return report;
  }

  /**
   * Generate additional recommendations
   */
  generateRecommendations() {
    return [
      {
        category: 'build-process',
        title: 'Integrate with Build Process',
        description: 'Add these optimizations to your build pipeline for automated application',
        actions: [
          'Add image optimization to build script',
          'Enable minification in bundler configuration',
          'Configure compression at server level',
          'Implement code splitting in bundler'
        ]
      },
      {
        category: 'monitoring',
        title: 'Performance Monitoring',
        description: 'Set up continuous performance monitoring',
        actions: [
          'Add performance budgets to CI/CD',
          'Monitor Core Web Vitals in production',
          'Set up automated lighthouse testing',
          'Track performance metrics over time'
        ]
      }
    ];
  }

  // Utility methods
  findFiles(directory, extensions) {
    const files = [];
    const exts = Array.isArray(extensions) ? extensions : [extensions];

    const walkDir = (dir) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          walkDir(fullPath);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          if (exts.includes(ext)) {
            files.push(fullPath);
          }
        }
      }
    };

    if (fs.existsSync(directory)) {
      walkDir(directory);
    }

    return files;
  }

  async updateImageReferences(originalPath, baseName, dir) {
    // Update HTML files to use picture elements with multiple formats
    const htmlFiles = this.findFiles(this.options.buildDir, '.html');
    
    for (const htmlFile of htmlFiles) {
      let content = fs.readFileSync(htmlFile, 'utf8');
      const originalSrc = path.relative(path.dirname(htmlFile), originalPath);
      
      if (content.includes(originalSrc)) {
        const webpSrc = path.relative(path.dirname(htmlFile), path.join(dir, `${baseName}.webp`));
        const avifSrc = path.relative(path.dirname(htmlFile), path.join(dir, `${baseName}.avif`));
        
        const pictureElement = `
<picture>
  <source srcset="${avifSrc}" type="image/avif">
  <source srcset="${webpSrc}" type="image/webp">
  <img src="${originalSrc}" alt="`;

        content = content.replace(
          new RegExp(`<img([^>]*src=["']${originalSrc}["'][^>]*alt=["'])`, 'gi'),
          `${pictureElement}`
        );

        content = content.replace(
          new RegExp(`(alt=["'][^"']*["'][^>]*)>`, 'gi'),
          '$1></picture>'
        );

        fs.writeFileSync(htmlFile, content);
      }
    }
  }

  log(message, type = 'info') {
    const colors = { info: 'blue', success: 'green', warn: 'yellow', error: 'red' };
    console.log(chalk[colors[type] || 'white'](message));
  }
}

module.exports = PerformanceAutoFixer;

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {};

  // Parse command line arguments
  for (let i = 0; i < args.length; i += 2) {
    const arg = args[i];
    const value = args[i + 1];

    switch (arg) {
      case '--build-dir':
        options.buildDir = value;
        break;
      case '--dry-run':
        options.dryRun = true;
        i -= 1; // No value for this flag
        break;
      case '--audit-file':
        options.auditFile = value;
        break;
    }
  }

  const fixer = new PerformanceAutoFixer(options);
  
  if (options.auditFile && fs.existsSync(options.auditFile)) {
    const auditResults = JSON.parse(fs.readFileSync(options.auditFile, 'utf8'));
    
    fixer.autoFixIssues([auditResults])
      .then(report => {
        console.log(chalk.green(`\n🎉 Auto-fix completed: ${report.summary.totalFixes} fixes applied`));
        if (report.summary.estimatedSavings > 0) {
          console.log(chalk.blue(`💾 Estimated savings: ${report.summary.estimatedSavings} bytes`));
        }
        process.exit(0);
      })
      .catch(error => {
        console.error(chalk.red('\n❌ Auto-fix failed:'), error.message);
        process.exit(1);
      });
  } else {
    console.log(chalk.yellow('Usage: node performance-auto-fixer.js --audit-file <path> [--build-dir <path>] [--dry-run]'));
    process.exit(1);
  }
}

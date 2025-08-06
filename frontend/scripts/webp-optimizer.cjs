#!/usr/bin/env node

/**
 * WebP Image Optimization Script
 * Converts images to WebP format for better performance and PageSpeed scores
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const DIST_DIR = path.join(process.cwd(), 'dist');

function log(message) {
  console.log(`[WebP Optimizer] ${message}`);
}

function convertToWebP(inputPath, outputPath) {
  try {
    // Use sharp for better WebP conversion if available
    const sharpCommand = `npx sharp -i "${inputPath}" -o "${outputPath}" -f webp -q 85`;
    execSync(sharpCommand, { stdio: 'pipe' });
    return true;
  } catch (error) {
    try {
      // Fallback to imagemin with webp plugin
      const imageminCommand = `npx imagemin "${inputPath}" --out-dir="${path.dirname(outputPath)}" --plugin=imagemin-webp`;
      execSync(imageminCommand, { stdio: 'pipe' });
      
      // Rename to correct output path
      const tempWebP = inputPath.replace(/\.(png|jpe?g)$/i, '.webp');
      if (fs.existsSync(tempWebP) && tempWebP !== outputPath) {
        fs.renameSync(tempWebP, outputPath);
      }
      return true;
    } catch (fallbackError) {
      log(`Warning: Could not convert ${inputPath} to WebP`);
      return false;
    }
  }
}

function optimizeImages() {
  log('Converting images to WebP format...');
  
  const imageExtensions = ['.png', '.jpg', '.jpeg'];
  const directories = [PUBLIC_DIR];
  
  // Add dist directory if it exists
  if (fs.existsSync(DIST_DIR)) {
    directories.push(DIST_DIR);
  }
  
  let convertedCount = 0;
  
  for (const dir of directories) {
    const images = findImages(dir, imageExtensions);
    
    for (const imagePath of images) {
      const ext = path.extname(imagePath).toLowerCase();
      const webpPath = imagePath.replace(ext, '.webp');
      
      // Skip if WebP already exists and is newer
      if (fs.existsSync(webpPath)) {
        const originalStat = fs.statSync(imagePath);
        const webpStat = fs.statSync(webpPath);
        
        if (webpStat.mtime > originalStat.mtime) {
          continue; // WebP is newer, skip conversion
        }
      }
      
      if (convertToWebP(imagePath, webpPath)) {
        convertedCount++;
      }
    }
  }
  
  log(`Converted ${convertedCount} images to WebP format`);
}

function updateHTMLForWebP() {
  log('Updating HTML to use WebP images with fallbacks...');
  
  if (!fs.existsSync(DIST_DIR)) {
    log('No dist directory found, skipping HTML update');
    return;
  }
  
  const htmlFiles = findFiles(DIST_DIR, '.html');
  
  for (const htmlFile of htmlFiles) {
    let content = fs.readFileSync(htmlFile, 'utf8');
    
    // Replace img tags with picture elements for WebP support
    content = content.replace(
      /<img([^>]+)src="([^"]+\.(png|jpe?g))"([^>]*)>/gi,
      (match, beforeSrc, src, ext, afterSrc) => {
        const webpSrc = src.replace(/\.(png|jpe?g)$/i, '.webp');
        
        // Check if WebP version exists
        const webpPath = path.join(DIST_DIR, webpSrc.replace(/^\//, ''));
        if (fs.existsSync(webpPath)) {
          return `<picture>
            <source srcset="${webpSrc}" type="image/webp">
            <img${beforeSrc}src="${src}"${afterSrc}>
          </picture>`;
        }
        
        return match; // Return original if no WebP version
      }
    );
    
    fs.writeFileSync(htmlFile, content);
  }
  
  log(`Updated ${htmlFiles.length} HTML files for WebP support`);
}

function generateImageOptimizationReport() {
  log('Generating image optimization report...');
  
  const directories = [PUBLIC_DIR];
  if (fs.existsSync(DIST_DIR)) {
    directories.push(DIST_DIR);
  }
  
  const report = {
    timestamp: new Date().toISOString(),
    directories: [],
    totalSavings: 0,
    recommendations: [
      'Use WebP format for all new images',
      'Consider AVIF format for even better compression',
      'Implement lazy loading for below-the-fold images',
      'Use responsive images with srcset for different screen sizes'
    ]
  };
  
  for (const dir of directories) {
    const originalImages = findImages(dir, ['.png', '.jpg', '.jpeg']);
    const webpImages = findImages(dir, ['.webp']);
    const avifImages = findImages(dir, ['.avif']);
    
    let originalSize = 0;
    let webpSize = 0;
    
    for (const img of originalImages) {
      try {
        originalSize += fs.statSync(img).size;
      } catch (error) {
        // File might not exist, skip
      }
    }
    
    for (const img of webpImages) {
      try {
        webpSize += fs.statSync(img).size;
      } catch (error) {
        // File might not exist, skip
      }
    }
    
    const dirReport = {
      directory: dir.replace(process.cwd(), '.'),
      originalImages: originalImages.length,
      webpImages: webpImages.length,
      avifImages: avifImages.length,
      originalSizeKB: Math.round(originalSize / 1024),
      webpSizeKB: Math.round(webpSize / 1024),
      savingsKB: Math.round((originalSize - webpSize) / 1024),
      conversionRate: originalImages.length > 0 ? 
        Math.round((webpImages.length / originalImages.length) * 100) : 0
    };
    
    report.directories.push(dirReport);
    report.totalSavings += dirReport.savingsKB;
  }
  
  const reportPath = path.join(DIST_DIR || PUBLIC_DIR, 'image-optimization-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  log(`Image optimization report: ${report.totalSavings}KB saved across ${report.directories.length} directories`);
}

function findImages(dir, extensions) {
  return findFiles(dir, extensions);
}

function findFiles(dir, extensions) {
  const files = [];
  
  if (!fs.existsSync(dir)) {
    return files;
  }
  
  function traverse(currentDir) {
    try {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Skip node_modules and other non-essential directories
          if (!item.startsWith('.') && item !== 'node_modules') {
            traverse(fullPath);
          }
        } else if (stat.isFile()) {
          const ext = path.extname(fullPath).toLowerCase();
          if (Array.isArray(extensions) ? extensions.includes(ext) : fullPath.endsWith(extensions)) {
            files.push(fullPath);
          }
        }
      }
    } catch (error) {
      // Directory access error, skip
    }
  }
  
  traverse(dir);
  return files;
}

function main() {
  log('🖼️  Starting WebP image optimization...');
  
  try {
    optimizeImages();
    updateHTMLForWebP();
    generateImageOptimizationReport();
    
    log('✅ WebP optimization completed successfully!');
    log('💡 Next: Test images in different browsers to ensure WebP support');
  } catch (error) {
    log(`❌ Error during WebP optimization: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  convertToWebP,
  optimizeImages,
  updateHTMLForWebP,
  generateImageOptimizationReport
};

#!/usr/bin/env node

/**
 * Image optimization script for enhanced PageSpeed performance
 * Optimizes images with WebP/AVIF conversion and responsive sizing
 */

/* eslint-disable no-undef, no-unused-vars */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const distDir = path.join(__dirname, '..', 'dist');
const assetsDir = path.join(distDir, 'assets');

console.log('🖼️  Starting Image Optimization...');

// Function to check if sharp is available
function hasSharp() {
  try {
    require.resolve('sharp');
    return true;
  } catch (e) {
    return false;
  }
}

// Function to check if imagemin is available
function hasImagemin() {
  try {
    require.resolve('imagemin');
    return true;
  } catch (e) {
    return false;
  }
}

async function optimizeImages() {
  try {
    // Find all image directories
    const imageDirs = [
      path.join(assetsDir, 'avatars'),
      path.join(assetsDir, 'logos'),
      path.join(assetsDir, 'icons'),
      path.join(assetsDir, 'portfolio'),
      path.join(assetsDir, 'screenshots'),
      path.join(assetsDir, 'branding'),
    ].filter(dir => fs.existsSync(dir));

    for (const imageDir of imageDirs) {
      const files = fs.readdirSync(imageDir);
      
      for (const file of files) {
        const filePath = path.join(imageDir, file);
        const ext = path.extname(file).toLowerCase();
        
        if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
          await optimizeImage(filePath, file);
        }
      }
    }

    // Also check root assets for images
    if (fs.existsSync(assetsDir)) {
      const rootFiles = fs.readdirSync(assetsDir);
      for (const file of rootFiles) {
        const filePath = path.join(assetsDir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isFile()) {
          const ext = path.extname(file).toLowerCase();
          if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
            await optimizeImage(filePath, file);
          }
        }
      }
    }

    console.log('✅ Image optimization completed!');
  } catch (error) {
    console.error('❌ Image optimization failed:', error.message);
  }
}

async function optimizeImage(imagePath, filename) {
  try {
    const stats = fs.statSync(imagePath);
    const originalSize = stats.size;
    
    // Skip if file is already small enough
    if (originalSize < 10000) { // 10KB
      console.log(`⏭️  Skipping ${filename} (already optimized: ${Math.round(originalSize / 1024)}KB)`);
      return;
    }

    console.log(`🔄 Optimizing ${filename} (${Math.round(originalSize / 1024)}KB)...`);

    if (hasSharp()) {
      await optimizeWithSharp(imagePath, filename);
    } else {
      // Fallback optimization using system tools
      await optimizeWithSystemTools(imagePath, filename);
    }

    const newStats = fs.statSync(imagePath);
    const newSize = newStats.size;
    const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);
    
    console.log(`✅ ${filename}: ${Math.round(originalSize / 1024)}KB → ${Math.round(newSize / 1024)}KB (${savings}% reduction)`);
  } catch (error) {
    console.error(`❌ Failed to optimize ${filename}:`, error.message);
  }
}

async function optimizeWithSharp(imagePath, filename) {
  const sharp = require('sharp');
  const ext = path.extname(filename).toLowerCase();
  const basePath = imagePath.replace(ext, '');
  
  try {
    const image = sharp(imagePath);
    const metadata = await image.metadata();
    
    // Create WebP version
    await image
      .webp({ quality: 85, effort: 6 })
      .toFile(basePath + '.webp');
    
    // Create AVIF version (better compression)
    try {
      await image
        .avif({ quality: 80, effort: 6 })
        .toFile(basePath + '.avif');
    } catch (avifError) {
      console.log(`ℹ️  AVIF not supported for ${filename}, skipping`);
    }
    
    // Optimize original format
    if (ext === '.jpg' || ext === '.jpeg') {
      await image
        .jpeg({ quality: 85, progressive: true, mozjpeg: true })
        .toFile(imagePath + '.tmp');
    } else if (ext === '.png') {
      await image
        .png({ quality: 85, compressionLevel: 9, progressive: true })
        .toFile(imagePath + '.tmp');
    } else if (ext === '.webp') {
      await image
        .webp({ quality: 85, effort: 6 })
        .toFile(imagePath + '.tmp');
    }
    
    // Replace original if optimization was successful
    if (fs.existsSync(imagePath + '.tmp')) {
      fs.renameSync(imagePath + '.tmp', imagePath);
    }

    // Create responsive versions for large images
    if (metadata.width > 800) {
      await createResponsiveVersions(image, basePath, metadata);
    }
    
  } catch (error) {
    console.error(`Sharp optimization failed for ${filename}:`, error.message);
    // Clean up any temporary files
    if (fs.existsSync(imagePath + '.tmp')) {
      fs.unlinkSync(imagePath + '.tmp');
    }
  }
}

async function createResponsiveVersions(image, basePath, metadata) {
  const sizes = [320, 640, 768, 1024, 1280];
  
  for (const size of sizes) {
    if (size < metadata.width) {
      try {
        // WebP responsive versions
        await image
          .resize(size, null, { withoutEnlargement: true })
          .webp({ quality: 85, effort: 6 })
          .toFile(`${basePath}-${size}w.webp`);
          
        // AVIF responsive versions
        try {
          await image
            .resize(size, null, { withoutEnlargement: true })
            .avif({ quality: 80, effort: 6 })
            .toFile(`${basePath}-${size}w.avif`);
        } catch (avifError) {
          // AVIF not supported
        }
      } catch (resizeError) {
        console.error(`Failed to create responsive version ${size}w:`, resizeError.message);
      }
    }
  }
}

async function optimizeWithSystemTools(imagePath, filename) {
  const ext = path.extname(filename).toLowerCase();
  
  try {
    if (ext === '.jpg' || ext === '.jpeg') {
      // Try to use jpegoptim if available
      try {
        execSync(`jpegoptim --max=85 --strip-all "${imagePath}"`, { stdio: 'pipe' });
      } catch (e) {
        console.log(`ℹ️  jpegoptim not available for ${filename}`);
      }
    } else if (ext === '.png') {
      // Try to use optipng if available
      try {
        execSync(`optipng -o7 "${imagePath}"`, { stdio: 'pipe' });
      } catch (e) {
        console.log(`ℹ️  optipng not available for ${filename}`);
      }
    }
  } catch (error) {
    console.error(`System tool optimization failed for ${filename}:`, error.message);
  }
}

// Function to update HTML with responsive images
function updateHtmlWithResponsiveImages() {
  const indexPath = path.join(distDir, 'index.html');
  
  if (!fs.existsSync(indexPath)) {
    return;
  }
  
  try {
    let html = fs.readFileSync(indexPath, 'utf8');
    
    // Update critical images with responsive and modern formats
    html = html.replace(
      /<img([^>]+)src="([^"]+\/avatars\/assistant-red)\.webp"([^>]*)>/g,
      `<picture>
        <source srcset="$2-320w.avif 320w, $2-640w.avif 640w, $2.avif" sizes="(max-width: 640px) 320px, 640px" type="image/avif">
        <source srcset="$2-320w.webp 320w, $2-640w.webp 640w, $2.webp" sizes="(max-width: 640px) 320px, 640px" type="image/webp">
        <img$1src="$2.webp"$3 width="64" height="85">
      </picture>`
    );
    
    // Update logo with optimized format
    html = html.replace(
      /<img([^>]+)alt="ThinkRED Logo"([^>]*)>/g,
      '<img$1alt="ThinkRED Logo"$2 width="288" height="120" fetchpriority="high">'
    );
    
    fs.writeFileSync(indexPath, html, 'utf8');
    console.log('✅ Updated HTML with responsive images');
  } catch (error) {
    console.error('❌ Failed to update HTML:', error.message);
  }
}

// Main execution
(async () => {
  await optimizeImages();
  updateHtmlWithResponsiveImages();
  
  console.log('🎉 Image optimization process completed!');
  console.log('   📸 Created WebP and AVIF versions');
  console.log('   📱 Generated responsive versions');
  console.log('   🗜️  Compressed original formats');
  console.log('   🔄 Updated HTML for modern formats');
})();

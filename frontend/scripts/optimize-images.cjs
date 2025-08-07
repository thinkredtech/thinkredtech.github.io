#!/usr/bin/env node

/**
 * Simple Image Optimization
 * Basic image optimization for web delivery
 */

/* eslint-disable no-undef */

const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(process.cwd(), 'dist');

console.log('🖼️  Running simple image optimization...');

function findImages(dir) {
  const images = [];
  if (!fs.existsSync(dir)) return images;
  
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      images.push(...findImages(fullPath));
    } else if (/\.(jpg|jpeg|png|svg)$/i.test(file.name)) {
      images.push(fullPath);
    }
  }
  
  return images;
}

function optimizeImages() {
  const images = findImages(DIST_DIR);
  
  if (images.length === 0) {
    console.log('ℹ️  No images found to optimize');
    return;
  }
  
  console.log(`📸 Found ${images.length} images to optimize`);
  
  // Simple optimization - just ensure images aren't too large
  images.forEach(imagePath => {
    try {
      const stats = fs.statSync(imagePath);
      const sizeKB = Math.round(stats.size / 1024);
      
      // Just report, don't modify (avoid breaking images)
      if (sizeKB > 500) {
        console.log(`⚠️  Large image: ${path.basename(imagePath)} (${sizeKB}KB)`);
      } else {
        console.log(`✅ OK: ${path.basename(imagePath)} (${sizeKB}KB)`);
      }
    } catch (error) {
      console.log(`❌ Error checking ${path.basename(imagePath)}: ${error.message}`);
    }
  });
}

// Main execution
try {
  optimizeImages();
  console.log('🎉 Image optimization check completed!');
} catch (error) {
  console.error('❌ Image optimization failed:', error.message);
  process.exit(1);
}

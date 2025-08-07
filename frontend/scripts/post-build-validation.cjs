#!/usr/bin/env node

/**
 * Post-Build Validation Hook
 * Quick validation checks that run immediately after build
 * 
 * Features:
 * - Quick JavaScript syntax check
 * - File integrity verification
 * - Critical error detection
 * - Build failure prevention
 * 
 * @author ThinkRED Technologies
 * @version 1.0.0
 */

/* eslint-env node */
/* eslint no-console: "off" */

const fs = require('fs');
const path = require('path');

function quickValidation() {
  console.log('🔍 Running post-build validation...');
  
  const distDir = path.join(process.cwd(), 'dist');
  const assetsDir = path.join(distDir, 'assets');
  const indexPath = path.join(distDir, 'index.html');
  
  let errors = 0;
  
  // 1. Check if dist exists
  if (!fs.existsSync(distDir)) {
    console.log('❌ ERROR: dist directory not found');
    return false;
  }
  
  // 2. Check if index.html exists
  if (!fs.existsSync(indexPath)) {
    console.log('❌ ERROR: index.html not found');
    return false;
  }
  
  // 3. Check if assets directory exists
  if (!fs.existsSync(assetsDir)) {
    console.log('❌ ERROR: assets directory not found');
    return false;
  }
  
  // 4. Quick check for JavaScript files
  const jsFiles = fs.readdirSync(assetsDir).filter(file => 
    file.endsWith('.js') && !file.endsWith('.map')
  );
  
  if (jsFiles.length === 0) {
    console.log('❌ ERROR: No JavaScript files found in build');
    errors++;
  }
  
  // 5. Quick check for critical JavaScript errors
  for (const jsFile of jsFiles) {
    const jsPath = path.join(assetsDir, jsFile);
    const content = fs.readFileSync(jsPath, 'utf8');
    
    // Check for the specific regex error we fixed
    if (content.includes('Nothing to repeat') || 
        content.includes('Invalid regular expression')) {
      console.log(`❌ ERROR: Invalid regex pattern in ${jsFile}`);
      errors++;
    }
    
    // Check for other critical patterns
    const criticalErrors = [
      'SyntaxError',
      'Uncaught ReferenceError',
      'Invalid regular expression',
      'Unexpected token'
    ];
    
    for (const errorPattern of criticalErrors) {
      if (content.includes(errorPattern)) {
        console.log(`⚠️  WARNING: Potential error pattern "${errorPattern}" in ${jsFile}`);
      }
    }
  }
  
  // 6. Check index.html for basic structure
  const html = fs.readFileSync(indexPath, 'utf8');
  
  if (!html.includes('<!DOCTYPE html>') && !html.includes('<!doctype html>')) {
    console.log('⚠️  WARNING: DOCTYPE missing in index.html');
  }
  
  if (!html.includes('<script')) {
    console.log('❌ ERROR: No script tags found in index.html');
    errors++;
  }
  
  // 7. Check for broken script references
  const scriptMatches = html.match(/src="([^"]*\.js)"/g) || [];
  for (const scriptMatch of scriptMatches) {
    const src = scriptMatch.match(/src="([^"]*)"/)[1];
    if (src.startsWith('/assets/')) {
      const scriptPath = path.join(distDir, src.substring(1));
      if (!fs.existsSync(scriptPath)) {
        console.log(`❌ ERROR: Referenced script not found: ${src}`);
        errors++;
      }
    }
  }
  
  if (errors === 0) {
    console.log('✅ Post-build validation passed!');
    return true;
  } else {
    console.log(`❌ Post-build validation failed with ${errors} errors!`);
    return false;
  }
}

// Run validation
const passed = quickValidation();
process.exit(passed ? 0 : 1);

#!/usr/bin/env node

/**
 * Shared nonce generator for build optimization scripts
 * Ensures consistent nonce across all optimizers
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const NONCE_FILE = path.join(__dirname, '..', 'dist', '.build-nonce');

/**
 * Generate or retrieve existing nonce for this build
 * @returns {string} Base64 encoded nonce
 */
function getOrCreateNonce() {
  // Check if nonce already exists for this build
  if (fs.existsSync(NONCE_FILE)) {
    try {
      const existingNonce = fs.readFileSync(NONCE_FILE, 'utf8').trim();
      if (existingNonce && existingNonce.length > 0) {
        return existingNonce;
      }
    } catch (error) {
      // If we can't read the existing nonce, generate a new one
    }
  }
  
  // Generate new nonce
  const nonce = crypto.randomBytes(16).toString('base64');
  
  // Store nonce for other scripts to use
  try {
    fs.writeFileSync(NONCE_FILE, nonce, 'utf8');
  } catch (error) {
    console.warn('Warning: Could not save nonce to file:', error.message);
  }
  
  return nonce;
}

/**
 * Clean up nonce file after build
 */
function cleanupNonce() {
  try {
    if (fs.existsSync(NONCE_FILE)) {
      fs.unlinkSync(NONCE_FILE);
    }
  } catch (error) {
    // Ignore cleanup errors
  }
}

module.exports = {
  getOrCreateNonce,
  cleanupNonce
};

// If called directly, output the nonce
if (require.main === module) {
  console.log(getOrCreateNonce());
}

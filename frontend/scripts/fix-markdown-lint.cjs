#!/usr/bin/env node

/**
 * Markdown Lint Fix Script
 * Fixes common markdown linting issues automatically
 */

const fs = require('fs');
const path = require('path');

// Function to fix common markdown issues
function fixMarkdownIssues(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix MD041 - First line in file should be a top level header
    if (!content.startsWith('#')) {
      // Skip if file is empty or already starts with header
      if (content.trim() && !content.match(/^#+\s/)) {
        const firstLine = content.split('\n')[0];
        if (firstLine && !firstLine.startsWith('#')) {
          // Don't modify if it's already a title
          console.log(`Skipping ${filePath} - manual review needed for first line`);
        }
      }
    }

    // Fix MD025 - Multiple top level headers
    const lines = content.split('\n');
    let h1Count = 0;
    const fixedLines = lines.map(line => {
      if (line.match(/^#\s/)) {
        h1Count++;
        if (h1Count > 1) {
          // Convert additional H1s to H2s
          return line.replace(/^#\s/, '## ');
        }
      }
      return line;
    });

    if (h1Count > 1) {
      content = fixedLines.join('\n');
      modified = true;
    }

    // Fix MD032 - Lists should be surrounded by blank lines
    content = content.replace(/([^\n])\n([*-+]\s)/g, '$1\n\n$2');
    content = content.replace(/([*-+]\s[^\n]*)\n([^*-+\s\n])/g, '$1\n\n$2');

    // Fix MD012 - Multiple consecutive blank lines
    content = content.replace(/\n{3,}/g, '\n\n');

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed markdown issues in: ${filePath}`);
    }

  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Find and process markdown files
function processMarkdownFiles(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and build directories
      if (!['node_modules', 'dist', 'build', '.git'].includes(file)) {
        processMarkdownFiles(filePath);
      }
    } else if (file.endsWith('.md')) {
      fixMarkdownIssues(filePath);
    }
  }
}

// Main execution
console.log('🔧 Fixing markdown lint issues...');

// Process markdown files in current directory and subdirectories
processMarkdownFiles(process.cwd());

// Also process root level markdown files
const rootDir = path.join(process.cwd(), '..');
const rootMarkdownFiles = ['README.md', 'CHANGELOG.md', 'CODE_OF_CONDUCT.md', 'LICENSE.md', 'SECURITY_RESOLUTION_SUMMARY.md'];

for (const file of rootMarkdownFiles) {
  const filePath = path.join(rootDir, file);
  if (fs.existsSync(filePath)) {
    fixMarkdownIssues(filePath);
  }
}

console.log('✅ Markdown lint fixes completed');

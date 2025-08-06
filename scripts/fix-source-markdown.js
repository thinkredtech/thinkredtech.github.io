#!/usr/bin/env node

/**
 * Source Markdown Table Fixer
 * Fixes MD058 table spacing issues in source markdown files
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Fixing markdown table spacing in source files...');

function fixMarkdownTables(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Split into lines
  const lines = content.split('\n');
  const newLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const prevLine = i > 0 ? lines[i - 1] : '';
    const nextLine = i < lines.length - 1 ? lines[i + 1] : '';
    
    // Check if this line contains a table (has | and is not a separator)
    const isTableRow = line.includes('|') && line.trim() !== '' && !line.includes('---');
    const isTableSeparator = line.includes('|') && line.includes('---');
    const isTable = isTableRow || isTableSeparator;
    
    if (isTable) {
      // Add blank line before table if missing
      if (prevLine.trim() !== '' && !prevLine.includes('|')) {
        newLines.push('');
        modified = true;
      }
      
      newLines.push(line);
      
      // Add blank line after table if this is the last table row and next line is not table/empty
      const nextIsNotTable = nextLine && !nextLine.includes('|') && nextLine.trim() !== '';
      if (nextIsNotTable) {
        newLines.push('');
        modified = true;
      }
    } else {
      newLines.push(line);
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, newLines.join('\n'));
    console.log(`✅ Fixed tables in: ${filePath}`);
    return true;
  }
  
  return false;
}

// Fix markdown files in docs directory
const docsDir = path.join(process.cwd(), 'docs');
if (fs.existsSync(docsDir)) {
  const files = execSync(`find "${docsDir}" -name "*.md" -type f`, { encoding: 'utf8' })
    .trim()
    .split('\n')
    .filter(Boolean);

  let totalFixed = 0;
  files.forEach(file => {
    if (fixMarkdownTables(file)) totalFixed++;
  });

  console.log(`🎉 Fixed ${totalFixed} source markdown files`);
} else {
  console.log('⚠️  No docs directory found');
}

console.log('✅ Source markdown fixing completed!');

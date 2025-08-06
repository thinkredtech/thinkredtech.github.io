#!/usr/bin/env node

/**
 * Comprehensive Markdown Fixer
 * Fixes MD058 table spacing and MD051 link fragment issues
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Comprehensive markdown fixing...');

function fixMarkdownFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  let modified = false;

  // Fix MD058: Tables should be surrounded by blank lines
  const lines = content.split('\n');
  const newLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const prevLine = i > 0 ? lines[i - 1].trim() : '';
    const nextLine = i < lines.length - 1 ? lines[i + 1].trim() : '';
    
    // Detect table rows (contains | but exclude inline code)
    const isTableRow = line.includes('|') && !line.startsWith('```') && !line.includes('`|`');
    const isTableHeader = isTableRow && (nextLine.includes('---') || nextLine.includes('==='));
    const isTableSeparator = line.includes('---') && line.includes('|');
    
    if (isTableRow || isTableSeparator) {
      // Add blank line before table start
      if (isTableHeader && prevLine !== '' && !prevLine.includes('|')) {
        newLines.push('');
        modified = true;
      }
      
      newLines.push(lines[i]); // Keep original line with spacing
      
      // Add blank line after table end
      if (isTableRow && !nextLine.includes('|') && !nextLine.includes('---') && nextLine !== '') {
        // Check if this is the last row of the table
        const nextNextLine = i < lines.length - 2 ? lines[i + 2].trim() : '';
        if (!nextLine.includes('|') && !nextNextLine.includes('|')) {
          newLines.push('');
          modified = true;
        }
      }
    } else {
      newLines.push(lines[i]);
    }
  }
  
  content = newLines.join('\n');

  // Fix MD051: Link fragments should be valid
  content = content.replace(/\[([^\]]+)\]\(#([^)]+)\)/g, (match, text, fragment) => {
    // Create valid anchor fragment
    const validFragment = text.toLowerCase()
      .replace(/[^a-z0-9\s-&]/g, '') // Remove invalid chars but keep &
      .replace(/&/g, '') // Remove & specifically
      .replace(/\s+/g, '-') // Replace spaces with dashes
      .replace(/-+/g, '-') // Collapse multiple dashes
      .replace(/^-|-$/g, ''); // Remove leading/trailing dashes
    
    if (fragment !== validFragment) {
      console.log(`  🔗 Fixed link: [${text}](#${fragment}) -> [${text}](#${validFragment})`);
      modified = true;
      return `[${text}](#${validFragment})`;
    }
    return match;
  });

  // Additional table spacing fixes for specific patterns
  content = content.replace(/(\*\*[^*]+\*\*:)\n(\|[^|\n]+\|)/g, '$1\n\n$2');
  content = content.replace(/(\|[^|\n]+\|)\n([^|\n\s][^|\n]*[^|\n\s])/g, '$1\n\n$2');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed: ${path.relative(process.cwd(), filePath)}`);
    return true;
  }
  
  return false;
}

// Fix all markdown files in dist/docs
const docsDir = path.join(process.cwd(), 'frontend/dist/docs');
if (fs.existsSync(docsDir)) {
  const files = execSync(`find "${docsDir}" -name "*.md" -type f`, { encoding: 'utf8' })
    .trim()
    .split('\n')
    .filter(Boolean);

  let totalFixed = 0;
  files.forEach(file => {
    if (fixMarkdownFile(file)) {
      totalFixed++;
    }
  });

  console.log(`🎉 Fixed ${totalFixed} markdown files`);
} else {
  console.log('⚠️  No dist/docs directory found');
}

console.log('✅ Comprehensive markdown fixing completed!');

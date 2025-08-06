#!/usr/bin/env node

/**
 * Advanced Markdown Link Fixer
 * Fixes MD051 link fragment issues by checking actual section headers
 */

const fs = require('fs');
const path = require('path');

console.log('🔗 Fixing markdown link fragments...');

function fixMarkdownLinks(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Extract all section headers from the file
  const headers = [];
  const headerRegex = /^#+\s+(.+)$/gm;
  let match;
  while ((match = headerRegex.exec(content)) !== null) {
    const headerText = match[1].trim();
    const anchor = headerText.toLowerCase()
      .replace(/[^a-z0-9\s-&]/g, '')
      .replace(/&/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    headers.push({ text: headerText, anchor: anchor });
  }

  // Fix link fragments to match actual headers or create generic ones
  content = content.replace(/\[([^\]]+)\]\(#([^)]+)\)/g, (match, text, fragment) => {
    // Check if this fragment exists in our headers
    const existingHeader = headers.find(h => h.anchor === fragment);
    
    if (!existingHeader) {
      // Create a generic valid fragment from the link text
      const validFragment = text.toLowerCase()
        .replace(/[^a-z0-9\s-&]/g, '')
        .replace(/&/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      if (fragment !== validFragment) {
        console.log(`  🔗 Fixed orphaned link: [${text}](#${fragment}) -> [${text}](#${validFragment})`);
        modified = true;
        return `[${text}](#${validFragment})`;
      }
    }
    
    return match;
  });

  if (modified) {
    fs.writeFileSync(filePath, content);
    return true;
  }
  
  return false;
}

// Fix specific problematic files
const problematicFiles = [
  'frontend/dist/docs/docs/content/README.md',
  'frontend/dist/docs/docs/developer/setup/troubleshooting.md', 
  'frontend/dist/docs/docs/templates/blog-post-template.md'
];

let totalFixed = 0;
problematicFiles.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    if (fixMarkdownLinks(fullPath)) {
      console.log(`✅ Fixed links in: ${file}`);
      totalFixed++;
    }
  } else {
    console.log(`⚠️  File not found: ${file}`);
  }
});

console.log(`🎉 Fixed links in ${totalFixed} files`);
console.log('✅ Advanced markdown link fixing completed!');

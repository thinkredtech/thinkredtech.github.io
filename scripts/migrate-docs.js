#!/usr/bin/env node

/**
 * Documentation Migration Script
 * 
 * This script migrates existing documentation from various locations
 * into the new unified documentation structure while maintaining
 * backward compatibility through symlinks and redirects.
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = process.cwd();
const DOCS_ROOT = path.join(PROJECT_ROOT, 'docs');

// Migration mapping: source -> destination
const MIGRATION_MAP = {
  // Legacy docs to new structure
  'docs/ARCHITECTURE.md': 'docs/developer/architecture/system-overview.md',
  'docs/DEVELOPMENT.md': 'docs/developer/guides/development.md',
  'docs/API.md': 'docs/developer/apis/backend-apis.md',
  'docs/DEPLOYMENT.md': 'docs/developer/deployment/production.md',
  'docs/CONTRIBUTING.md': 'docs/developer/guides/contributing.md',
  'docs/SETUP.md': 'docs/developer/setup/installation.md',
  'docs/ENVIRONMENT.md': 'docs/developer/setup/environment.md',
  'docs/TROUBLESHOOTING.md': 'docs/developer/setup/troubleshooting.md',
  'docs/CONFIGURATION.md': 'docs/developer/guides/configuration.md',
  'docs/SECURITY.md': 'docs/operations/security/README.md',
  'docs/PERFORMANCE_TESTING.md': 'docs/operations/performance/testing.md',
  'docs/HEALTH_REPORTS.md': 'docs/operations/monitoring/health-checks.md',
  
  // Frontend docs to content management
  'frontend/docs/content-management.md': 'docs/content/pages/content-management.md',
  'frontend/docs/blog-management.md': 'docs/content/blog/management.md',
  'frontend/docs/seo-guidelines.md': 'docs/content/pages/seo-guidelines.md',
  
  // Reports to operations
  'reports/operational/performance-reports.md': 'docs/operations/performance/reports.md',
  'reports/security/security-reports.md': 'docs/operations/security/reports.md',
  'reports/incidents/incident-reports.md': 'docs/operations/monitoring/incidents.md',
};

// Content that needs to be merged into new documents
const MERGE_CONTENT = {
  'docs/developer/README.md': [
    'docs/DEVELOPMENT.md',
    'frontend/docs/development-setup.md'
  ],
  'docs/operations/README.md': [
    'docs/PERFORMANCE_TESTING.md',
    'docs/HEALTH_REPORTS.md'
  ]
};

/**
 * Ensures a directory exists, creating it if necessary
 */
function ensureDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

/**
 * Copies a file from source to destination
 */
function copyFile(src, dest) {
  try {
    if (fs.existsSync(src)) {
      ensureDirectory(path.dirname(dest));
      fs.copyFileSync(src, dest);
      console.log(`Migrated: ${src} -> ${dest}`);
      return true;
    } else {
      console.warn(`Source file not found: ${src}`);
      return false;
    }
  } catch (error) {
    console.error(`Error migrating ${src} to ${dest}:`, error.message);
    return false;
  }
}

/**
 * Creates a symlink for backward compatibility
 */
function createBackwardCompatibilityLink(oldPath, newPath) {
  try {
    const relativePath = path.relative(path.dirname(oldPath), newPath);
    
    // Create a redirect file instead of symlink for better cross-platform compatibility
    const redirectContent = `# Moved

This document has been moved to [${path.basename(newPath)}](${relativePath}).

Please update your bookmarks and links to point to the new location.

---

*This is an automated redirect generated during documentation restructuring.*
`;

    fs.writeFileSync(oldPath, redirectContent);
    console.log(`Created redirect: ${oldPath} -> ${newPath}`);
  } catch (error) {
    console.error(`Error creating redirect for ${oldPath}:`, error.message);
  }
}

/**
 * Merges multiple markdown files into a single document
 */
function mergeMarkdownFiles(sources, destination) {
  let mergedContent = '';
  let hasContent = false;

  for (const source of sources) {
    if (fs.existsSync(source)) {
      const content = fs.readFileSync(source, 'utf8');
      mergedContent += `\n\n<!-- Content from ${source} -->\n\n${content}`;
      hasContent = true;
    }
  }

  if (hasContent) {
    ensureDirectory(path.dirname(destination));
    fs.writeFileSync(destination, mergedContent.trim());
    console.log(`Merged content into: ${destination}`);
  }
}

/**
 * Updates internal links in markdown files
 */
function updateInternalLinks(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;

    // Update links based on migration map
    for (const [oldPath, newPath] of Object.entries(MIGRATION_MAP)) {
      const oldRelative = path.relative(path.dirname(filePath), oldPath);
      const newRelative = path.relative(path.dirname(filePath), newPath);
      
      const oldLinkPattern = new RegExp(`\\[([^\\]]+)\\]\\(${oldRelative.replace(/\./g, '\\.')}\\)`, 'g');
      if (oldLinkPattern.test(content)) {
        content = content.replace(oldLinkPattern, `[$1](${newRelative})`);
        updated = true;
      }
    }

    if (updated) {
      fs.writeFileSync(filePath, content);
      console.log(`Updated links in: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error updating links in ${filePath}:`, error.message);
  }
}

/**
 * Main migration function
 */
function migrate() {
  console.log('🚀 Starting documentation migration...\n');

  // 1. Migrate individual files
  console.log('📁 Migrating individual files...');
  for (const [source, destination] of Object.entries(MIGRATION_MAP)) {
    const sourcePath = path.join(PROJECT_ROOT, source);
    const destPath = path.join(PROJECT_ROOT, destination);
    
    if (copyFile(sourcePath, destPath)) {
      // Create backward compatibility redirect
      createBackwardCompatibilityLink(sourcePath, destPath);
    }
  }

  // 2. Merge content files
  console.log('\n📝 Merging content files...');
  for (const [destination, sources] of Object.entries(MERGE_CONTENT)) {
    const destPath = path.join(PROJECT_ROOT, destination);
    const sourcePaths = sources.map(src => path.join(PROJECT_ROOT, src));
    mergeMarkdownFiles(sourcePaths, destPath);
  }

  // 3. Update internal links
  console.log('\n🔗 Updating internal links...');
  const markdownFiles = [];
  
  function findMarkdownFiles(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        findMarkdownFiles(filePath);
      } else if (file.endsWith('.md')) {
        markdownFiles.push(filePath);
      }
    }
  }

  findMarkdownFiles(DOCS_ROOT);
  
  for (const filePath of markdownFiles) {
    updateInternalLinks(filePath);
  }

  // 4. Create index files for better navigation
  console.log('\n📚 Creating navigation index files...');
  
  // Create legacy documentation index
  const legacyIndexContent = `# Legacy Documentation

This section contains documentation that is being migrated to the new unified structure.

## 📖 Available Documents

${Object.keys(MIGRATION_MAP)
  .filter(key => key.startsWith('docs/'))
  .map(key => {
    const filename = path.basename(key, '.md');
    const newPath = MIGRATION_MAP[key];
    return `- [${filename}](${key}) → [New Location](${newPath})`;
  })
  .join('\n')}

## 🔄 Migration Status

This documentation is being restructured for better organization and discoverability.
Please refer to the [main documentation hub](README.md) for the new structure.

## 📚 New Structure

- [Developer Documentation](developer/README.md)
- [Content Documentation](content/README.md)
- [Operations Documentation](operations/README.md)
`;

  fs.writeFileSync(path.join(DOCS_ROOT, 'legacy.md'), legacyIndexContent);

  console.log('\n✅ Documentation migration completed!');
  console.log('\n📋 Summary:');
  console.log(`- Migrated ${Object.keys(MIGRATION_MAP).length} individual files`);
  console.log(`- Merged ${Object.keys(MERGE_CONTENT).length} content groups`);
  console.log(`- Updated links in ${markdownFiles.length} markdown files`);
  console.log('- Created backward compatibility redirects');
  console.log('- Generated navigation index files');
  
  console.log('\n🎯 Next Steps:');
  console.log('1. Review migrated content for accuracy');
  console.log('2. Update DocsPage component to use new structure');
  console.log('3. Test documentation navigation');
  console.log('4. Update CI/CD to use new documentation paths');
  console.log('5. Announce changes to team');
}

// Run migration if called directly
if (require.main === module) {
  migrate();
}

module.exports = { migrate };

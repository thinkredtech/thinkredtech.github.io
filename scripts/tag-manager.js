#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');

const VALID_COMPONENTS = ['frontend', 'backend'];

function execCommand(command, options = {}) {
  try {
    const result = execSync(command, { 
      stdio: 'pipe', 
      encoding: 'utf8',
      ...options 
    });
    return result.trim();
  } catch (error) {
    throw new Error(`Command failed: ${command}\n${error.message}`);
  }
}

function getCurrentVersion(component) {
  const packagePath = path.join(__dirname, '..', component, 'package.json');
  const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  return packageData.version;
}

function createGitTag(component) {
  console.log(chalk.blue(`🏷️ Creating Git tag for ${component}...`));
  
  const version = getCurrentVersion(component);
  const tagName = `${component}-v${version}`;
  const tagMessage = `Release ${component} version ${version}`;
  
  // Check if tag already exists
  try {
    execCommand(`git tag -l "${tagName}"`);
    const existingTag = execCommand(`git tag -l "${tagName}"`);
    if (existingTag) {
      console.log(chalk.yellow(`⚠️ Tag ${tagName} already exists. Skipping tag creation.`));
      return tagName;
    }
  } catch (error) {
    // Tag doesn't exist, continue
  }
  
  // Create the tag
  console.log(chalk.yellow(`📝 Creating tag: ${tagName}`));
  execCommand(`git tag -a "${tagName}" -m "${tagMessage}"`);
  
  // Push the tag
  console.log(chalk.yellow(`☁️ Pushing tag to remote...`));
  execCommand(`git push origin "${tagName}"`);
  
  console.log(chalk.green(`✅ Successfully created and pushed tag: ${tagName}`));
  
  return tagName;
}

function listTags(component) {
  console.log(chalk.blue(`📋 Listing tags for ${component}...`));
  
  try {
    const tags = execCommand(`git tag -l "${component}-v*" --sort=-version:refname`);
    if (tags) {
      console.log(chalk.cyan(`Recent ${component} tags:`));
      tags.split('\n').slice(0, 10).forEach(tag => {
        console.log(chalk.cyan(`  ${tag}`));
      });
    } else {
      console.log(chalk.yellow(`No tags found for ${component}`));
    }
  } catch (error) {
    console.error(chalk.red(`❌ Error listing tags: ${error.message}`));
  }
}

function showTagHistory() {
  console.log(chalk.blue('📋 Tag History:'));
  
  VALID_COMPONENTS.forEach(component => {
    try {
      const version = getCurrentVersion(component);
      console.log(chalk.cyan(`\n${component} (current: v${version}):`));
      
      const tags = execCommand(`git tag -l "${component}-v*" --sort=-version:refname`);
      if (tags) {
        tags.split('\n').slice(0, 5).forEach(tag => {
          console.log(chalk.gray(`  ${tag}`));
        });
      } else {
        console.log(chalk.yellow(`  No tags found`));
      }
    } catch (error) {
      console.log(chalk.red(`  Error: ${error.message}`));
    }
  });
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    showTagHistory();
    return;
  }
  
  const component = args[0];
  const action = args[1] || 'create';
  
  if (!VALID_COMPONENTS.includes(component)) {
    console.error(chalk.red(`❌ Invalid component: ${component}`));
    console.error(chalk.yellow(`Valid components: ${VALID_COMPONENTS.join(', ')}`));
    process.exit(1);
  }
  
  try {
    // Ensure we're in a git repository
    execCommand('git rev-parse --is-inside-work-tree');
    
    switch (action) {
      case 'create':
        createGitTag(component);
        break;
      case 'list':
        listTags(component);
        break;
      default:
        console.error(chalk.red(`❌ Invalid action: ${action}`));
        console.error(chalk.yellow(`Valid actions: create, list`));
        process.exit(1);
    }
    
  } catch (error) {
    console.error(chalk.red(`❌ Error: ${error.message}`));
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  createGitTag,
  listTags,
  showTagHistory
};

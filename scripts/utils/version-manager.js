#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const semver = require('semver');
const chalk = require('chalk');

const VALID_COMPONENTS = ['frontend', 'backend'];
const VALID_RELEASE_TYPES = ['patch', 'minor', 'major'];

function getPackageJsonPath(component) {
  return path.join(__dirname, '..', component, 'package.json');
}

function readPackageJson(component) {
  const packagePath = getPackageJsonPath(component);
  if (!fs.existsSync(packagePath)) {
    throw new Error(`Package.json not found for ${component} at ${packagePath}`);
  }
  return JSON.parse(fs.readFileSync(packagePath, 'utf8'));
}

function writePackageJson(component, packageData) {
  const packagePath = getPackageJsonPath(component);
  fs.writeFileSync(packagePath, JSON.stringify(packageData, null, 2) + '\n');
}

function getCurrentVersion(component) {
  const packageData = readPackageJson(component);
  return packageData.version;
}

function updateVersion(component, releaseType = 'patch') {
  console.log(chalk.blue(`📦 Updating ${component} version...`));
  
  const packageData = readPackageJson(component);
  const currentVersion = packageData.version;
  
  if (!semver.valid(currentVersion)) {
    throw new Error(`Invalid version format in ${component}: ${currentVersion}`);
  }
  
  const newVersion = semver.inc(currentVersion, releaseType);
  
  console.log(chalk.yellow(`Current version: ${currentVersion}`));
  console.log(chalk.green(`New version: ${newVersion}`));
  
  packageData.version = newVersion;
  writePackageJson(component, packageData);
  
  console.log(chalk.green(`✅ Successfully updated ${component} version to ${newVersion}`));
  
  return newVersion;
}

function showCurrentVersions() {
  console.log(chalk.blue('📋 Current versions:'));
  
  VALID_COMPONENTS.forEach(component => {
    try {
      const version = getCurrentVersion(component);
      console.log(chalk.cyan(`  ${component}: ${version}`));
    } catch (error) {
      console.log(chalk.red(`  ${component}: Error reading version - ${error.message}`));
    }
  });
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    showCurrentVersions();
    return;
  }
  
  const component = args[0];
  const releaseType = args[1] || 'patch';
  
  if (!VALID_COMPONENTS.includes(component)) {
    console.error(chalk.red(`❌ Invalid component: ${component}`));
    console.error(chalk.yellow(`Valid components: ${VALID_COMPONENTS.join(', ')}`));
    process.exit(1);
  }
  
  if (!VALID_RELEASE_TYPES.includes(releaseType)) {
    console.error(chalk.red(`❌ Invalid release type: ${releaseType}`));
    console.error(chalk.yellow(`Valid release types: ${VALID_RELEASE_TYPES.join(', ')}`));
    process.exit(1);
  }
  
  try {
    const newVersion = updateVersion(component, releaseType);
    
    // Update root package.json timestamp
    const rootPackagePath = path.join(__dirname, '..', 'package.json');
    const rootPackage = JSON.parse(fs.readFileSync(rootPackagePath, 'utf8'));
    rootPackage.lastModified = new Date().toISOString();
    fs.writeFileSync(rootPackagePath, JSON.stringify(rootPackage, null, 2) + '\n');
    
    console.log(chalk.green(`🎉 Version update completed successfully!`));
    
  } catch (error) {
    console.error(chalk.red(`❌ Error updating version: ${error.message}`));
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  getCurrentVersion,
  updateVersion,
  showCurrentVersions
};

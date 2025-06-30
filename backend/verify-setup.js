#!/usr/bin/env node

/**
 * Backend Setup Verification Script
 * Checks if all required files and configurations are in place
 */

const fs = require("fs");
const path = require("path");
const os = require("os");
const { execSync } = require("child_process");

const colors = {
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  reset: "\x1b[0m",
  bright: "\x1b[1m",
};

const log = {
  info: (msg) => console.log(`${colors.green}${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
};

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    log.success(`${description} exists`);
    return true;
  } else {
    log.error(`❌ ${description} missing`);
    return false;
  }
}

function checkCommand(command, description) {
  try {
    execSync(`${command} --version`, { stdio: "pipe" });
    log.success(`${description} is installed`);
    return true;
  } catch {
    log.error(`❌ ${description} not found`);
    return false;
  }
}

function main() {
  log.info("🔍 ThinkRED Backend Setup Verification");
  console.log("=====================================");

  let allGood = true;

  // Check required files
  const requiredFiles = [
    [".env.example", "Environment template"],
    [".gitignore", "Git ignore file"],
    ["deploy.js", "Node.js deployment script"],
    ["deploy.sh", "Bash deployment script"],
    ["README.md", "Documentation with deployment guide"],
    ["package.json", "Package configuration"],
    ["thinkREDBot.js", "Main backend script"],
  ];

  requiredFiles.forEach(([file, desc]) => {
    if (!checkFile(file, desc)) allGood = false;
  });

  // Check if .env exists
  if (fs.existsSync(".env")) {
    log.success(".env file exists");

    // Check if it has required variables
    const envContent = fs.readFileSync(".env", "utf8");
    if (
      envContent.includes(
        "CLASP_SCRIPT_ID=1lxhn-Siz6ThM7rWHveiEVE1HlyA7fimu4LMifyFLXbaXRmEbT5lVL78J",
      )
    ) {
      log.success("Script ID configured in .env");
    } else {
      log.warn("⚠️  Please configure CLASP_SCRIPT_ID in .env file");
      allGood = false;
    }
  } else {
    log.warn('⚠️  .env file not found. Run "npm run setup" to create it.');
  }

  // Check deploy script permissions
  try {
    const stats = fs.statSync("deploy.sh");
    if (stats.mode & parseInt("111", 8)) {
      log.success("deploy.sh is executable");
    } else {
      log.warn('⚠️  deploy.sh is not executable. Run "chmod +x deploy.sh"');
    }
  } catch {
    log.error("❌ Could not check deploy.sh permissions");
  }

  // Check required commands
  const requiredCommands = [
    ["node", "Node.js"],
    ["npm", "NPM"],
    ["clasp", "Google Apps Script CLI"],
  ];

  requiredCommands.forEach(([cmd, desc]) => {
    if (!checkCommand(cmd, desc)) allGood = false;
  });

  // Check clasp login status
  const clasprcPath = path.join(os.homedir(), ".clasprc.json");
  if (fs.existsSync(clasprcPath)) {
    log.success("Logged in to Google Apps Script");
  } else {
    log.warn(
      '⚠️  Not logged in to clasp. Run "clasp login" before deployment.',
    );
  }

  console.log("\n" + "=".repeat(40));

  if (allGood) {
    log.success("🎉 Backend setup is ready for deployment!");
    console.log("\nNext steps:");
    console.log("1. Ensure .env file is configured");
    console.log('2. Run "clasp login" if not already logged in');
    console.log('3. Deploy with "npm run deploy"');
  } else {
    log.error("❌ Setup incomplete. Please fix the issues above.");
    process.exit(1);
  }
}

main();

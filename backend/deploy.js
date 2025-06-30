#!/usr/bin/env node

/**
 * ThinkRED Backend Deployment Script (Node.js version)
 * Cross-platform deployment script for Google Apps Script backend
 */

const fs = require("fs");
const path = require("path");
const os = require("os");
const { execSync, spawn } = require("child_process");
const readline = require("readline");

// Colors for console output
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

async function askQuestion(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function loadEnvironmentVariables() {
  const envPath = path.join(__dirname, ".env");
  const envExamplePath = path.join(__dirname, ".env.example");

  if (!fs.existsSync(envPath)) {
    log.warn("⚠️  .env file not found. Creating from template...");
    if (fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envPath);
      log.warn(
        "📝 Please edit .env file with your configuration before running again.",
      );
      process.exit(1);
    } else {
      log.error("❌ .env.example not found. Cannot create .env file.");
      process.exit(1);
    }
  }

  // Load environment variables
  const envContent = fs.readFileSync(envPath, "utf8");
  const envVars = {};

  envContent.split("\n").forEach((line) => {
    line = line.trim();
    if (line && !line.startsWith("#")) {
      const [key, ...valueParts] = line.split("=");
      const value = valueParts.join("=");
      envVars[key] = value;
    }
  });

  return envVars;
}

function runCommand(command, description, inheritStdio = false) {
  try {
    log.info(`🔄 ${description}...`);
    const options = inheritStdio
      ? { encoding: "utf8", stdio: "inherit", env: process.env }
      : { encoding: "utf8", stdio: "pipe", env: process.env };
    const output = execSync(command, options);
    return output;
  } catch (error) {
    log.error(`❌ Failed: ${description}`);
    log.error(error.message);
    process.exit(1);
  }
}

function runClaspCommand(command, description) {
  return new Promise((resolve, reject) => {
    log.info(`🔄 ${description}...`);
    const [cmd, ...args] = command.split(" ");
    const child = spawn(cmd, args, {
      stdio: "inherit",
      env: process.env,
      shell: true,
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        log.error(`❌ Failed: ${description}`);
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on("error", (err) => {
      log.error(`❌ Failed: ${description}`);
      reject(err);
    });
  });
}

function checkCommandExists(command) {
  try {
    execSync(`${command} --version`, { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

async function main() {
  log.info("🚀 ThinkRED Backend Deployment Script");
  console.log("=======================================");

  // Load environment variables
  const env = await loadEnvironmentVariables();

  // Validate required environment variables
  if (!env.CLASP_SCRIPT_ID) {
    log.error("❌ CLASP_SCRIPT_ID not set in .env file");
    process.exit(1);
  }

  log.info("📋 Configuration:");
  console.log(`   Script ID: ${env.CLASP_SCRIPT_ID}`);
  console.log(
    `   Description: ${env.DEPLOYMENT_DESCRIPTION || "Backend deployment"}`,
  );

  // Check if clasp is installed
  if (!checkCommandExists("clasp")) {
    log.error(
      "❌ clasp is not installed. Install it with: npm install -g @google/clasp",
    );
    process.exit(1);
  }

  // Check if user is logged in to clasp
  const clasprcPath = path.join(os.homedir(), ".clasprc.json");
  if (!fs.existsSync(clasprcPath)) {
    log.warn('⚠️  Not logged in to clasp. Please run "clasp login" first.');
    process.exit(1);
  }

  // Generate .clasp.json with the script ID from environment
  let needsUpdate = true;
  if (fs.existsSync(".clasp.json")) {
    try {
      const existingConfig = JSON.parse(fs.readFileSync(".clasp.json", "utf8"));
      if (existingConfig.scriptId === env.CLASP_SCRIPT_ID) {
        needsUpdate = false;
        log.success(".clasp.json already configured correctly");
      }
    } catch {
      // If we can't parse the existing file, we'll recreate it
    }
  }

  if (needsUpdate) {
    log.info("🔧 Updating .clasp.json configuration...");
    const claspConfig = {
      scriptId: env.CLASP_SCRIPT_ID,
      rootDir: "",
      scriptExtensions: [".js", ".gs"],
      htmlExtensions: [".html"],
      jsonExtensions: [".json"],
      filePushOrder: [],
      skipSubdirectories: false,
    };

    fs.writeFileSync(".clasp.json", JSON.stringify(claspConfig, null, 2));
    log.success(".clasp.json updated successfully");
  }

  // Check for uncommitted changes (if in git repo)
  const gitDir = path.join("..", ".git");
  if (fs.existsSync(gitDir)) {
    try {
      const gitStatus = execSync("git status --porcelain .", {
        encoding: "utf8",
        stdio: "pipe",
      });
      if (gitStatus.trim()) {
        log.warn(
          "⚠️  Warning: There are uncommitted changes in the backend directory.",
        );
        log.warn("   Consider committing your changes before deployment.");
        const answer = await askQuestion("Continue with deployment? (y/N): ");
        if (!["y", "Y", "yes", "Yes"].includes(answer.trim())) {
          log.warn("🛑 Deployment cancelled by user.");
          process.exit(0);
        }
      }
    } catch {
      // Git not available or not in git repo, continue
    }
  }

  // Push the code
  await runClaspCommand(
    "clasp push --force",
    "Pushing code to Google Apps Script",
  );
  log.success("Code pushed successfully");

  // Deploy the script
  const deployDescription = env.DEPLOYMENT_DESCRIPTION || "Backend deployment";
  await runClaspCommand(
    `clasp deploy --description "${deployDescription}"`,
    "Creating new deployment",
  );

  log.success("Deployment successful!");
  log.info("🔗 Deployment Details:");
  console.log(`   Script ID: ${env.CLASP_SCRIPT_ID}`);
  console.log(`   Description: ${deployDescription}`);

  // Ask if user wants to open script in browser
  const openAnswer = await askQuestion(
    "Open Google Apps Script in browser? (y/N): ",
  );
  if (["y", "Y", "yes", "Yes"].includes(openAnswer.trim())) {
    await runClaspCommand("clasp open", "Opening Google Apps Script");
  }

  log.success("🎉 Backend deployment completed successfully!");
  log.warn(
    "💡 Don't forget to test the contact form and job application forms.",
  );
}

// Run the deployment script
main().catch((error) => {
  log.error(`❌ Deployment failed: ${error.message}`);
  process.exit(1);
});

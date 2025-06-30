#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const chalk = require("chalk");

const VALID_COMPONENTS = ["frontend", "backend", "all"];

function execCommand(command, options = {}) {
  try {
    console.log(chalk.blue(`🔧 Executing: ${command}`));
    const result = execSync(command, {
      stdio: "inherit",
      encoding: "utf8",
      ...options,
    });
    return result;
  } catch (error) {
    console.error(chalk.red(`❌ Command failed: ${command}`));
    throw error;
  }
}

function deployFrontend() {
  console.log(chalk.blue("🚀 Deploying Frontend..."));

  const frontendPath = path.join(__dirname, "..", "frontend");

  // Install dependencies
  console.log(chalk.yellow("📦 Installing frontend dependencies..."));
  execCommand("npm install", { cwd: frontendPath });

  // Run type checking
  console.log(chalk.yellow("🔍 Running type checking..."));
  execCommand("npm run type-check", { cwd: frontendPath });

  // Run linting
  console.log(chalk.yellow("🔧 Running linting..."));
  execCommand("npm run lint", { cwd: frontendPath });

  // Build the project
  console.log(chalk.yellow("🏗️ Building frontend..."));
  execCommand("npm run build", { cwd: frontendPath });

  // Deploy to GitHub Pages
  console.log(chalk.yellow("🌐 Deploying to GitHub Pages..."));
  execCommand("npm run deploy:github", { cwd: frontendPath });

  // Also deploy to Hostinger if script exists
  const hostingerScript = path.join(frontendPath, "deploy-hostinger.sh");
  if (fs.existsSync(hostingerScript)) {
    console.log(chalk.yellow("🏢 Deploying to Hostinger..."));
    execCommand("npm run deploy:hostinger", { cwd: frontendPath });
  }

  console.log(chalk.green("✅ Frontend deployment completed successfully!"));
}

function deployBackend() {
  console.log(chalk.blue("🚀 Deploying Backend..."));

  const backendPath = path.join(__dirname, "..", "backend");

  // Check if clasp is configured
  const clasprcPath = path.join(backendPath, ".clasp.json");
  if (!fs.existsSync(clasprcPath)) {
    console.log(
      chalk.yellow(
        '⚠️ clasp not configured. Please run "clasp login" and "clasp create" first.',
      ),
    );
    console.log(chalk.yellow("💡 Setting up clasp configuration..."));

    // Create a basic .clasp.json template
    const claspConfig = {
      scriptId: "YOUR_SCRIPT_ID_HERE",
      rootDir: ".",
    };

    fs.writeFileSync(clasprcPath, JSON.stringify(claspConfig, null, 2));
    console.log(
      chalk.yellow(
        "📝 Created .clasp.json template. Please update with your actual script ID.",
      ),
    );

    return;
  }

  // Install dependencies
  console.log(chalk.yellow("📦 Installing backend dependencies..."));
  execCommand("npm install", { cwd: backendPath });

  // Push to Google Apps Script
  console.log(chalk.yellow("☁️ Pushing to Google Apps Script..."));
  execCommand("npm run push", { cwd: backendPath });

  // Create a new deployment
  console.log(chalk.yellow("🚀 Creating deployment..."));
  try {
    execCommand("npm run deploy", { cwd: backendPath });
  } catch (error) {
    console.log(chalk.yellow("💡 Creating initial deployment..."));
    execCommand('clasp deploy --description "Automated deployment"', {
      cwd: backendPath,
    });
  }

  console.log(chalk.green("✅ Backend deployment completed successfully!"));
}

function deployAll() {
  console.log(chalk.blue("🚀 Deploying All Components..."));

  try {
    deployFrontend();
    deployBackend();
    console.log(chalk.green("🎉 All deployments completed successfully!"));
  } catch (error) {
    console.error(chalk.red("❌ Deployment failed:"), error.message);
    process.exit(1);
  }
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(
      chalk.yellow("🤔 No component specified. Deploying all components..."),
    );
    deployAll();
    return;
  }

  const component = args[0];

  if (!VALID_COMPONENTS.includes(component)) {
    console.error(chalk.red(`❌ Invalid component: ${component}`));
    console.error(
      chalk.yellow(`Valid components: ${VALID_COMPONENTS.join(", ")}`),
    );
    process.exit(1);
  }

  try {
    switch (component) {
      case "frontend":
        deployFrontend();
        break;
      case "backend":
        deployBackend();
        break;
      case "all":
        deployAll();
        break;
    }
  } catch (error) {
    console.error(chalk.red("❌ Deployment failed:"), error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  deployFrontend,
  deployBackend,
  deployAll,
};

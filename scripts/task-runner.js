#!/usr/bin/env node

/**
 * ThinkRED Monorepo Task Runner
 * 
 * Unified script management system that simplifies running tasks across
 * the monorepo while maintaining modularity and scalability.
 * 
 * Usage:
 *   npm run task [command] [target?] [options?]
 *   
 * Examples:
 *   npm run task dev                    # Start frontend dev server
 *   npm run task dev:all                # Start all dev servers in parallel
 *   npm run task build                  # Build frontend
 *   npm run task build:all              # Build all packages
 *   npm run task lint frontend          # Lint frontend only
 *   npm run task test:watch frontend    # Run tests in watch mode
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// Configuration
const WORKSPACES = {
  frontend: {
    name: 'Frontend (React)',
    path: 'frontend',
    icon: '⚛️',
    color: chalk.cyan,
    packageFile: 'frontend/package.json'
  },
  backend: {
    name: 'Backend (Google Apps Script)',
    path: 'backend', 
    icon: '🔧',
    color: chalk.yellow,
    packageFile: 'backend/package.json'
  },
  root: {
    name: 'Root (Monorepo)',
    path: '.',
    icon: '🌳',
    color: chalk.green,
    packageFile: 'package.json'
  }
};

// Task definitions with workspace mappings
const TASKS = {
  // Development tasks
  'dev': {
    description: 'Start development server',
    workspaces: ['frontend'],
    parallel: false,
    script: 'dev'
  },
  'dev:all': {
    description: 'Start all development servers',
    workspaces: ['frontend', 'backend'],
    parallel: true,
    scripts: {
      frontend: 'dev',
      backend: 'logs --follow'
    }
  },
  'start': {
    description: 'Alias for dev',
    alias: 'dev'
  },

  // Build tasks
  'build': {
    description: 'Build production bundle',
    workspaces: ['frontend'],
    parallel: false,
    script: 'build'
  },
  'build:all': {
    description: 'Build all packages',
    workspaces: ['frontend', 'backend'],
    parallel: false,
    scripts: {
      frontend: 'build',
      backend: 'push'
    }
  },

  // Linting and formatting
  'lint': {
    description: 'Lint code',
    workspaces: ['frontend', 'backend'],
    parallel: true,
    script: 'lint'
  },
  'lint:fix': {
    description: 'Lint and fix code issues',
    workspaces: ['frontend'],
    parallel: false,
    script: 'lint:fix'
  },
  'format': {
    description: 'Format code',
    workspaces: ['frontend'],
    parallel: false,
    script: 'format:all'
  },
  'format:check': {
    description: 'Check code formatting',
    workspaces: ['frontend'],
    parallel: false,
    script: 'format:check'
  },

  // Testing
  'test': {
    description: 'Run tests',
    workspaces: ['frontend'],
    parallel: false,
    script: 'test'
  },
  'test:watch': {
    description: 'Run tests in watch mode',
    workspaces: ['frontend'],
    parallel: false,
    script: 'test -- --watch'
  },

  // Type checking
  'type-check': {
    description: 'Type check TypeScript',
    workspaces: ['frontend'],
    parallel: false,
    script: 'type-check'
  },

  // Installation and setup
  'install': {
    description: 'Install dependencies',
    workspaces: ['root'],
    parallel: false,
    script: 'install:all'
  },
  'install:clean': {
    description: 'Clean install all dependencies',
    workspaces: ['root'],
    parallel: false,
    customCommand: async () => {
      await runCommand('Clean installing dependencies...', 'npm run clean && npm run install:all');
    }
  },

  // Cleaning
  'clean': {
    description: 'Clean build artifacts and dependencies',
    workspaces: ['root'],
    parallel: false,
    script: 'clean'
  },
  'clean:git': {
    description: 'Clean git build artifacts',
    workspaces: ['root'],
    parallel: false,
    script: 'clean:git'
  },

  // Deployment
  'deploy': {
    description: 'Deploy to production',
    workspaces: ['root'],
    parallel: false,
    script: 'deploy'
  },
  'deploy:frontend': {
    description: 'Deploy frontend only',
    workspaces: ['frontend'],
    parallel: false,
    script: 'deploy:ssh'
  },
  'deploy:backend': {
    description: 'Deploy backend only',
    workspaces: ['backend'],
    parallel: false,
    script: 'deploy'
  },

  // Backend specific
  'backend:push': {
    description: 'Push backend code to Google Apps Script',
    workspaces: ['backend'],
    parallel: false,
    script: 'push'
  },
  'backend:open': {
    description: 'Open backend in Google Apps Script editor',
    workspaces: ['backend'],
    parallel: false,
    script: 'open'
  },
  'backend:logs': {
    description: 'View backend logs',
    workspaces: ['backend'],
    parallel: false,
    script: 'logs'
  },

  // Security and reports
  'security:scan': {
    description: 'Run security scans',
    workspaces: ['frontend'],
    parallel: false,
    script: 'security:scan'
  },
  'reports:health': {
    description: 'Generate health reports',
    workspaces: ['frontend'],
    parallel: false,
    script: 'reports:health'
  },
  'reports:status': {
    description: 'Generate status dashboard',
    workspaces: ['root'],
    parallel: false,
    customCommand: async () => {
      await runCommand('Generating status dashboard...', 'echo "Status dashboard generation would run here - integrate with monitoring system"');
    }
  },
  'reports:generate': {
    description: 'Generate all reports',
    workspaces: ['frontend'],
    parallel: false,
    script: 'reports:generate'
  }
};

// Utility functions
function logHeader(title) {
  console.log('\n' + chalk.bold.blue('=' .repeat(60)));
  console.log(chalk.bold.white(`  🚀 ThinkRED Task Runner - ${title}`));
  console.log(chalk.bold.blue('=' .repeat(60)) + '\n');
}

function logWorkspace(workspace, action) {
  const ws = WORKSPACES[workspace];
  console.log(ws.color(`${ws.icon} ${ws.name} - ${action}`));
}

function logError(message) {
  console.error(chalk.red(`❌ Error: ${message}`));
}

function logSuccess(message) {
  console.log(chalk.green(`✅ ${message}`));
}

function logWarning(message) {
  console.log(chalk.yellow(`⚠️  ${message}`));
}

function getWorkspacePackageJson(workspace) {
  const ws = WORKSPACES[workspace];
  if (!ws) return null;
  
  try {
    const packagePath = path.resolve(ws.packageFile);
    return JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  } catch (error) {
    return null;
  }
}

function hasScript(workspace, scriptName) {
  const pkg = getWorkspacePackageJson(workspace);
  return pkg && pkg.scripts && pkg.scripts[scriptName];
}

async function runCommand(description, command, workspace = 'root', options = {}) {
  const ws = WORKSPACES[workspace];
  logWorkspace(workspace, description);
  
  return new Promise((resolve, reject) => {
    const child = spawn('sh', ['-c', command], {
      cwd: path.resolve(ws.path),
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options
    });

    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', reject);
  });
}

async function runParallelCommands(commands) {
  const promises = commands.map(({ description, command, workspace, options }) =>
    runCommand(description, command, workspace, options)
  );
  
  try {
    await Promise.all(promises);
    logSuccess('All parallel tasks completed successfully');
  } catch (error) {
    logError(`One or more parallel tasks failed: ${error.message}`);
    throw error;
  }
}

function showHelp() {
  logHeader('Available Commands');
  
  console.log(chalk.bold('Usage:'));
  console.log('  npm run task [command] [workspace?] [options?]\n');
  
  console.log(chalk.bold('Available Tasks:\n'));
  
  const categories = {
    'Development': ['dev', 'dev:all', 'start'],
    'Building': ['build', 'build:all'],
    'Code Quality': ['lint', 'lint:fix', 'format', 'format:check', 'type-check'],
    'Testing': ['test', 'test:watch'],
    'Setup': ['install', 'install:clean', 'clean', 'clean:git'],
    'Deployment': ['deploy', 'deploy:frontend', 'deploy:backend'],
    'Backend': ['backend:push', 'backend:open', 'backend:logs'],
    'Security': ['security:scan', 'reports:health', 'reports:status', 'reports:generate']
  };

  Object.entries(categories).forEach(([category, tasks]) => {
    console.log(chalk.bold.cyan(`${category}:`));
    tasks.forEach(taskName => {
      const task = TASKS[taskName];
      if (task && !task.alias) {
        const workspaces = task.workspaces.map(ws => WORKSPACES[ws].icon).join(' ');
        console.log(`  ${chalk.green(taskName.padEnd(20))} ${workspaces} ${task.description}`);
      }
    });
    console.log();
  });

  console.log(chalk.bold('Workspace Icons:'));
  Object.entries(WORKSPACES).forEach(([key, ws]) => {
    console.log(`  ${ws.icon} ${ws.name}`);
  });
  console.log();

  console.log(chalk.bold('Examples:'));
  console.log('  npm run task dev                 # Start frontend development');
  console.log('  npm run task dev:all              # Start all development servers');
  console.log('  npm run task lint frontend        # Lint only frontend');
  console.log('  npm run task build:all            # Build all packages');
  console.log('  npm run task deploy               # Deploy to production');
  console.log();
}

function showWorkspaceStatus() {
  logHeader('Workspace Status');
  
  Object.entries(WORKSPACES).forEach(([key, ws]) => {
    console.log(ws.color(`${ws.icon} ${ws.name}`));
    
    const pkg = getWorkspacePackageJson(key);
    if (pkg) {
      console.log(`   Version: ${pkg.version || 'N/A'}`);
      console.log(`   Scripts: ${Object.keys(pkg.scripts || {}).length} available`);
    } else {
      console.log(chalk.red('   ❌ Package.json not found'));
    }
    console.log();
  });
}

// Main execution logic
async function executeTask(taskName, targetWorkspace = null, options = {}) {
  const task = TASKS[taskName];
  
  if (!task) {
    logError(`Unknown task: ${taskName}`);
    console.log('\nRun "npm run task help" to see available tasks.\n');
    process.exit(1);
  }

  // Handle aliases
  if (task.alias) {
    return executeTask(task.alias, targetWorkspace, options);
  }

  // Handle custom commands
  if (task.customCommand) {
    logHeader(`Running ${taskName}`);
    try {
      await task.customCommand();
      logSuccess(`Task ${taskName} completed successfully`);
    } catch (error) {
      logError(`Task ${taskName} failed: ${error.message}`);
      process.exit(1);
    }
    return;
  }

  logHeader(`Running ${taskName}`);

  try {
    // Determine workspaces to run on
    let workspaces = targetWorkspace ? [targetWorkspace] : task.workspaces;
    
    // Validate target workspace
    if (targetWorkspace && !WORKSPACES[targetWorkspace]) {
      logError(`Unknown workspace: ${targetWorkspace}`);
      console.log('\nAvailable workspaces:', Object.keys(WORKSPACES).join(', '));
      process.exit(1);
    }

    if (task.parallel) {
      // Run in parallel
      const commands = workspaces.map(workspace => {
        const script = task.scripts ? task.scripts[workspace] : task.script;
        if (!script) {
          logWarning(`No script defined for ${workspace} in task ${taskName}`);
          return null;
        }
        
        if (!hasScript(workspace, script)) {
          logWarning(`Script '${script}' not found in ${workspace} package.json`);
          return null;
        }

        return {
          description: `Running ${script}`,
          command: `npm run ${script}`,
          workspace,
          options: {}
        };
      }).filter(Boolean);

      if (commands.length > 0) {
        await runParallelCommands(commands);
      }
    } else {
      // Run sequentially
      for (const workspace of workspaces) {
        const script = task.scripts ? task.scripts[workspace] : task.script;
        if (!script) {
          logWarning(`No script defined for ${workspace} in task ${taskName}`);
          continue;
        }
        
        if (!hasScript(workspace, script)) {
          logWarning(`Script '${script}' not found in ${workspace} package.json`);
          continue;
        }

        await runCommand(`Running ${script}`, `npm run ${script}`, workspace);
      }
    }

    logSuccess(`Task ${taskName} completed successfully`);
  } catch (error) {
    logError(`Task ${taskName} failed: ${error.message}`);
    process.exit(1);
  }
}

// CLI handling
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === 'help' || args[0] === '-h' || args[0] === '--help') {
    showHelp();
    return;
  }

  if (args[0] === 'status') {
    showWorkspaceStatus(); 
    return;
  }

  const taskName = args[0];
  const targetWorkspace = args[1];
  const options = {};

  // Parse flags
  for (let i = 2; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=');
      options[key] = value || true;
    }
  }

  await executeTask(taskName, targetWorkspace, options);
}

// Error handling
process.on('unhandledRejection', (error) => {
  logError(`Unhandled error: ${error.message}`);
  process.exit(1);
});

if (require.main === module) {
  main().catch((error) => {
    logError(`Fatal error: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { executeTask, TASKS, WORKSPACES };

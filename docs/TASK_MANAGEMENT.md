# 🚀 ThinkRED Monorepo - Unified Task Management

## Overview

The ThinkRED monorepo now features a **unified task management system** that simplifies running scripts
across all workspaces while maintaining modularity and scalability. No more confusion about which directory
you're in or which npm scripts to run!

## 🎯 Key Benefits

- **🎯 Single Entry Point**: All tasks run from the root directory
- **🧠 Context Aware**: Automatically runs tasks in the correct workspace
- **⚡ Parallel Execution**: Run multiple tasks simultaneously when possible
- **🔍 Clear Visibility**: See exactly what's running where
- **📊 Status Monitoring**: Check workspace status at a glance
- **🛡️ Error Handling**: Graceful error handling with clear messages

## 📋 Quick Start

```bash
# Show all available commands
npm run help

# Show workspace status  
npm run status

# Start frontend development
npm run dev

# Start all development servers
npm run dev:all

# Build everything
npm run build:all

# Run linting across all workspaces
npm run lint

# Deploy to production
npm run deploy
```

## 🎛️ Task Runner Commands

### Development Tasks

```bash
npm run dev                # Start frontend dev server
npm run dev:all            # Start all dev servers in parallel
npm run start             # Alias for 'dev'
```

### Building Tasks

```bash
npm run build             # Build frontend for production
npm run build:all         # Build all packages
```

### Code Quality Tasks

```bash
npm run lint              # Lint all workspaces
npm run lint:fix          # Lint and fix issues (frontend)
npm run format            # Format all code
npm run format:check      # Check code formatting
npm run type-check        # TypeScript type checking
```

### Testing Tasks

```bash
npm run test              # Run tests
npm run test:watch        # Run tests in watch mode
```

### Setup & Maintenance

```bash
npm run install:clean     # Clean install all dependencies
npm run clean             # Clean build artifacts
npm run clean:git         # Clean git build artifacts
```

### Deployment Tasks

```bash
npm run deploy            # Full production deployment
npm run deploy:frontend   # Deploy frontend only
npm run deploy:backend    # Deploy backend only
```

### Backend Specific Tasks

```bash
npm run backend:push      # Push to Google Apps Script
npm run backend:open      # Open in GAS editor
npm run backend:logs      # View backend logs
```

### Security & Reports

```bash
npm run security:scan     # Run security scans
npm run reports:health    # Generate health reports
```

## 🎯 Advanced Usage

### Target Specific Workspaces

You can run tasks on specific workspaces:

```bash
npm run task lint frontend        # Lint only frontend
npm run task build backend        # Build only backend
npm run task test frontend        # Test only frontend
```

### Available Workspaces

- **frontend** ⚛️ - React frontend application
- **backend** 🔧 - Google Apps Script backend
- **root** 🌳 - Monorepo root (for cross-workspace tasks)

### Get Help

```bash
npm run task help         # Show detailed help
npm run task status       # Show workspace status
npm run help             # Quick help
npm run status           # Quick status
```

## 🔧 Task Runner Features

### Parallel Execution

Some tasks run in parallel for efficiency:

```bash
npm run dev:all           # Starts frontend dev + backend logs simultaneously
npm run lint              # Lints all workspaces in parallel
```

### Sequential Execution

Other tasks run sequentially for safety:

```bash
npm run build:all         # Builds frontend, then backend
npm run deploy            # Runs deployment steps in order
```

### Workspace Detection

The task runner automatically:
- ✅ Detects which workspace has the required script
- ✅ Warns if a script is missing
- ✅ Runs commands in the correct directory
- ✅ Shows clear progress indicators

### Error Handling

- **Graceful Failures**: Tasks fail gracefully with clear error messages
- **Parallel Safety**: If one parallel task fails, others continue
- **Exit Codes**: Proper exit codes for CI/CD integration

## 🎨 Visual Indicators

The system uses color-coded output to show workspace activity:

- 🌳 **Root** (Green): Monorepo-level tasks
- ⚛️ **Frontend** (Cyan): React application tasks  
- 🔧 **Backend** (Yellow): Google Apps Script tasks

## 📊 Examples

### Starting Development

```bash
# Old way - confusing and error-prone
cd frontend && npm run dev     # Had to remember the right directory

# New way - simple and clear
npm run dev                   # Works from anywhere in the repo
```

### Running Multiple Tasks

```bash
# Old way - manual coordination
cd frontend && npm run lint &
cd ../backend && npm run lint &
wait

# New way - automatic parallel execution
npm run lint                  # Runs everywhere automatically
```

### Checking Status

```bash
# Old way - manual checking
cd frontend && npm list
cd ../backend && npm list

# New way - unified status
npm run status               # Shows everything at once
```

## 🔄 Migration Guide

If you have existing scripts or muscle memory:

### Common Commands Still Work

```bash
npm start                    # Still starts frontend dev
npm run build               # Still builds frontend
npm run deploy              # Still deploys to production
```

### New Powerful Commands

```bash
npm run dev:all             # Start everything
npm run build:all           # Build everything
npm run task [command]      # Direct task runner access
```

### Workspace-Specific Tasks

```bash
# Target specific workspace
npm run task [command] [workspace]

# Examples
npm run task lint frontend
npm run task deploy backend
npm run task test frontend
```

## 🚀 Benefits for Development

### For Daily Development

- **One command to rule them all**: `npm run dev:all`
- **Quick status checks**: `npm run status`
- **Easy task discovery**: `npm run help`

### For CI/CD

- **Consistent commands**: Same commands work everywhere
- **Proper exit codes**: Reliable for automation
- **Parallel optimization**: Faster build times

### For New Team Members

- **Self-documenting**: Commands show what they do
- **No directory confusion**: Always run from root
- **Clear feedback**: Visual indicators show progress

## 🛠️ Troubleshooting

### Task Not Found

```bash
npm run task help           # See all available tasks
npm run status             # Check workspace status
```

### Script Missing in Workspace

The task runner will warn you if a script doesn't exist in a workspace and continue with other workspaces.

### Parallel Task Issues

Use sequential execution for tasks that might conflict:

```bash
npm run task build:all      # Sequential builds
npm run task deploy        # Sequential deployment
```

## 📝 Adding New Tasks

To add new tasks, edit `scripts/task-runner.js` and add to the `TASKS` object:

```javascript
'my-task': {
  description: 'My custom task',
  workspaces: ['frontend'],
  parallel: false,
  script: 'my-script'
}
```

Then add the convenience script to root `package.json`:

```json
{
  "scripts": {
    "my-task": "npm run task my-task"
  }
}
```

---

## 🎉 Happy Developing

The unified task system makes development smoother, clearer, and more efficient. No more directory confusion,
no more forgotten scripts, no more manual coordination of multiple tasks.

**Remember**: All commands work from the root directory, and the system will guide you with clear feedback and helpful error messages.

For questions or suggestions, check out the task runner code in `scripts/task-runner.js` or create an issue in the repository.

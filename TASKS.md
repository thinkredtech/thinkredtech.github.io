# 🚀 ThinkRED Task Quick Reference

## Most Common Commands

```bash
npm run help              # Show all available commands
npm run dev               # Start frontend development
npm run dev:all           # Start all servers
npm run build             # Build frontend
npm run build:all         # Build everything
npm run lint              # Lint all code
npm run deploy            # Deploy to production
npm run status            # Check workspace status
```

## Development Workflow

```bash
# 1. Start development
npm run dev:all

# 2. Make changes, then check code quality
npm run lint
npm run format

# 3. Build and test
npm run build:all
npm run test

# 4. Deploy
npm run deploy
```

## Workspace Targets

```bash
npm run task [command] [workspace]

# Examples:
npm run task lint frontend
npm run task build backend
npm run task test frontend
```

## Workspaces

- **frontend** ⚛️ - React app
- **backend** 🔧 - Google Apps Script  
- **root** 🌳 - Monorepo

---

📖 **Full Guide**: [docs/TASK_MANAGEMENT.md](./TASK_MANAGEMENT.md)

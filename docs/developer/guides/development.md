# 🛠️ ThinkRED Development Workflow

_Welcome to the ThinkRED development methodology - where creativity meets technical excellence!_ ✨

## 📋 Prerequisites

Before diving into the ThinkRED development adventure, let's make sure you're equipped with the right tools! 🎯

### ✅ Required Software

- **Node.js** 18+ (LTS recommended) - The foundation of our stack 🟢
- **npm** 8+ for package management - Our dependency wizard 📦
- **Git** for version control - Time travel for code! ⏰
- **Code Editor** (VS Code recommended with our suggested extensions) 💻

### 🎭 Optional (For Backend Development)

- **Google Account** (for Google Apps Script development) - Your backstage pass 🎫
- **Google CLASP** (for backend deployment) - The deployment magic wand ✨

### 🔍 Version Check

_Let's make sure everything is in perfect harmony!_

```bash
node --version    # Should be v18.0.0 or higher
npm --version     # Should be 8.0.0 or higher
git --version     # Any recent version
```

## 🏗️ Monorepo Setup

_The ThinkRED monorepo is designed for developer happiness - one command to rule them all!_ 🎪

### 1️⃣ Clone Repository

_Get the ThinkRED universe on your machine!_

```bash
git clone https://github.com/thinkredtech/thinkredtech.github.io.git
cd thinkredtech.github.io
```

### 2️⃣ Install All Dependencies

_One command, all the magic!_ ⚡

```bash
# Installs dependencies for all workspaces
npm install
```

### 3️⃣ Start Development

_Time to bring your ideas to life!_ 🚀

```bash
# Start frontend development server
npm run dev

# Or start all development services
npm run dev:all
```

The application will be available at `http://localhost:3000`

### 4. Available Development Commands

- `npm run dev` - Start frontend development server
- `npm run dev:all` - Start all development servers in parallel
- `npm run build` - Build frontend for production
- `npm run build:all` - Build all components
- `npm run lint` - Run ESLint across all workspaces
- `npm run lint:fix` - Fix linting issues automatically
- `npm run test` - Run test suites
- `npm run type-check` - Run TypeScript compiler check

## Task Management System

The monorepo uses a unified task management system. All tasks can be run from the root directory:

```bash
# Show all available tasks
npm run task --help

# Show workspace status
npm run status

# Run specific tasks
npm run task dev frontend     # Start frontend dev server
npm run task build:all        # Build all components
npm run task lint backend     # Lint backend only
```

## Frontend Development

### Technology Stack

- **React 19** with TypeScript
- **Vite** for build tooling and development server
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Markdown** for documentation

### Development Workflow

1. **Start the dev server**: `npm run dev`
2. **Make changes** to files in `frontend/src/`
3. **View changes** at `http://localhost:3000` (auto-reload)
4. **Run tests**: `npm run test`
5. **Lint code**: `npm run lint`

### Directory Structure

```
frontend/
├── src/                   # Source code
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   ├── styles/           # Global styles
│   └── types/            # TypeScript types
├── public/               # Static assets
├── docs/                 # Public documentation
└── scripts/              # Build and optimization scripts
```

## Backend Setup (Optional)

The backend runs on Google Apps Script and doesn't require local setup for most development tasks.

### For Backend Development

1. **Install CLASP globally:**

   ```bash
   npm install -g @google/clasp
   ```

2. **Login to Google Apps Script:**

   ```bash
   clasp login
   ```

3. **Navigate to backend directory:**

   ```bash
   cd backend
   ```

4. **Available Scripts:**
   - `npm run push` - Push code to Google Apps Script
   - `npm run deploy` - Deploy to Google Apps Script
   - `npm run logs` - View execution logs

## Project Structure

```
thinkred-monorepo/
├── frontend/           # React frontend application
│   ├── src/           # Source code
│   ├── public/        # Static assets
│   ├── docs/          # User-facing documentation
│   └── package.json   # Frontend dependencies
├── backend/           # Google Apps Script backend
│   ├── thinkREDBot.js # Main backend logic
│   └── package.json   # Backend dependencies
├── docs/              # Developer documentation
└── README.md          # Project overview
```

## Development Workflow

### 1. Creating New Features

1. Create a feature branch: `git checkout -b feature/feature-name`
2. Make your changes in the appropriate directory
3. Test locally using `npm run dev`
4. Commit changes: `git commit -m "Add feature description"`
5. Push branch: `git push origin feature/feature-name`
6. Create pull request

### 2. Frontend Development

- All React components are in `frontend/src/components/`
- Pages are in `frontend/src/pages/`
- Styles use Tailwind CSS classes
- TypeScript is enforced for type safety

### 3. Backend Development

- Main logic is in `backend/thinkREDBot.js`
- Uses Google Apps Script environment
- Test changes using `clasp push` and Google Apps Script editor
- Deploy using `npm run deploy`

## Environment Configuration

### Frontend Environment

Create a `.env` file in the `frontend/` directory if needed:

```env
VITE_API_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

### Backend Environment

Backend configuration is handled through Google Apps Script Properties Service.

## Testing

### Frontend Testing

```bash
cd frontend
npm test
```

### Manual Testing

1. Start the development server
2. Test all form submissions
3. Check responsive design on different screen sizes
4. Verify all routes work correctly

## Deployment

### Frontend Deployment

**GitHub Pages (Automatic):**

- Push to main branch triggers automatic deployment
- Site is available at `https://thinkredtech.github.io`

**Manual Deployment:**

```bash
cd frontend
npm run build
npm run deploy
```

### Backend Deployment

```bash
cd backend
npm run deploy
```

## Common Issues

### Node Version Issues

If you encounter Node.js version issues:

```bash
# Using nvm (recommended)
nvm install 18
nvm use 18
```

### Permission Issues

If you get permission errors:

```bash
# For npm global installs
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

### Build Issues

If the build fails:

1. Clear node_modules: `rm -rf node_modules`
2. Clear package-lock: `rm package-lock.json`
3. Reinstall: `npm install`

## IDE Setup

### VS Code Extensions (Recommended)

- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- ESLint

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## Getting Help

### Resources

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Google Apps Script Documentation](https://developers.google.com/apps-script)

### Support

For development questions or issues:

1. Check existing documentation in `/docs/`
2. Search closed issues on GitHub
3. Create a new issue with detailed description
4. Contact the development team

## Contributing

Please read [CONTRIBUTING.md](../CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

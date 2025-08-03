# ThinkRED Development Setup

## Prerequisites

Before setting up the development environment, ensure you have the following installed:

### Required Software

- **Node.js** 18+ (LTS recommended)
- **npm** 8+ or **yarn** 1.22+
- **Git** for version control
- **Code Editor** (VS Code recommended)

### Optional (For Backend Development)

- **Google Account** (for Google Apps Script development)
- **Google CLASP** (for backend deployment)

### Version Check

```bash
node --version    # Should be v18.0.0 or higher
npm --version     # Should be 8.0.0 or higher
git --version     # Any recent version
```

## Frontend Setup

### 1. Clone Repository

```bash
git clone https://github.com/thinkredtech/thinkred-monorepo.git
cd thinkred-monorepo
```

### 2. Install Dependencies

```bash
cd frontend
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 4. Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check

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

Please read [CONTRIBUTING.md](contributing.md) for details on our code of conduct and the process for submitting pull requests.

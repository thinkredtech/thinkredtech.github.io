# ThinkRED Monorepo

A unified repository containing both frontend and backend components of the ThinkRED website with separate versioning and deployment capabilities.

## Structure

```text
thinkred-monorepo/
├── frontend/          # React 19 + Vite frontend application
├── backend/           # Google Apps Script backend
├── scripts/           # Deployment and versioning utilities
└── package.json       # Root package with unified commands
```

## Quick Start

1. Install all dependencies:

   ```bash
   npm run install:all
   ```

2. Start development:

   ```bash
   npm run dev
   ```

3. Build and deploy:

   ```bash
   npm run deploy:all
   ```

## Package Management

### Frontend (@thinkred/frontend)
React 19 application with Vite, deployed to GitHub Pages and Hostinger with independent versioning.

### Backend (@thinkred/backend)
Google Apps Script for form handling, deployed via Google CLASP with independent versioning.

## Versioning

Each component maintains its own semantic version.

### Check Current Versions

```bash
npm run version:frontend
npm run version:backend
```

### Update Versions

```bash
# Patch versions (1.0.0 → 1.0.1)
npm run version:patch:frontend
npm run version:patch:backend

# Minor versions (1.0.0 → 1.1.0)
npm run version:minor:frontend
npm run version:minor:backend

# Major versions (1.0.0 → 2.0.0)
npm run version:major:frontend
npm run version:major:backend
```

## Deployment

### Individual Components

```bash
npm run deploy:frontend
npm run deploy:backend
```

### All Components

```bash
npm run deploy:all
```

### Complete Release Process

```bash
# Patch releases
npm run release:frontend
npm run release:backend

# Minor releases
npm run release:minor:frontend
npm run release:minor:backend

# Major releases
npm run release:major:frontend
npm run release:major:backend
```

## Git Tags

The system automatically creates and manages Git tags with separate versioning:

- **Frontend tags**: `frontend-v1.0.4`, `frontend-v1.0.5`, etc.
- **Backend tags**: `backend-v1.0.0`, `backend-v1.0.1`, etc.

### View Tag History

```bash
npm run tag:frontend list
npm run tag:backend list
```

## Verification

### Check Git History
```bash
git log --oneline -10                    # Shows all commits
git log --follow frontend/src/App.tsx    # Shows file history for moved files
```

### Test Setup
```bash
npm run version:frontend                 # Shows current frontend version
npm run version:backend                  # Shows current backend version
npm run dev                             # Start development server
```

## Development Commands

### Frontend Development

```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run type-check   # TypeScript checking
```

### Backend Development

```bash
cd backend
npm run push         # Push to Google Apps Script
npm run deploy       # Deploy new version
npm run logs         # View execution logs
```

## Configuration

### Frontend Configuration
Standard React + Vite setup configured for GitHub Pages and Hostinger deployment.

### Backend Configuration

1. Install Google CLASP globally: `npm install -g @google/clasp`
2. Login to Google: `clasp login`
3. Copy the configuration template:
   ```bash
   cd backend
   cp .clasp.json.template .clasp.json
   # Edit .clasp.json with your actual Google Apps Script ID
   ```
4. Configure script properties in Google Apps Script console

### Required Script Properties (Google Apps Script)

```javascript
CONTACT_FORM_SHEET_ID=your_contact_sheet_id
JOB_APPLICATION_SHEET_ID=your_job_sheet_id
RESUME_PARENT_FOLDER_ID=your_drive_folder_id
EMAIL_TO=your_notification_email
EMAIL_CC_CONTACT_FORM=cc_email_for_contact
EMAIL_CC_JOB_APPLY=cc_email_for_jobs
```

## Available Scripts

### Root Level

- `npm run install:all` - Install all dependencies
- `npm run dev` - Start frontend development
- `npm run build` - Build frontend
- `npm run deploy` - Deploy all components
- `npm run release:frontend` - Complete frontend release
- `npm run release:backend` - Complete backend release

### Version Management

- `npm run version:patch:frontend` - Increment frontend patch version
- `npm run version:minor:frontend` - Increment frontend minor version
- `npm run version:major:frontend` - Increment frontend major version
- Similar commands available for backend

### Tag Management

- `npm run tag:frontend` - Create and push frontend tag
- `npm run tag:backend` - Create and push backend tag

## Monitoring

### Frontend Monitoring
GitHub Pages deployment status, build logs via GitHub Actions, and Hostinger deployment logs.

### Backend Monitoring
Google Apps Script execution logs via `cd backend && npm run logs` and Google Cloud Console for advanced monitoring.

## Contributing

1. Clone this repository
2. Run `npm run install:all`
3. Make your changes in the appropriate component
4. Test your changes
5. Use the appropriate release command

## License

MIT License - see individual component licenses for details.

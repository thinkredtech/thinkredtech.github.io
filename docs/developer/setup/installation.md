# ThinkRED Setup Guide

## Quick Start

This guide will help you set up the ThinkRED Technologies website for local development.

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 16.0.0 or higher)
- **npm** (version 8.0.0 or higher)
- **Git** (for version control)
- **Code Editor** (VS Code recommended)

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/thinkredtech/thinkredtech.github.io.git
   cd thinkredtech.github.io
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   Copy the environment example file:

   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file with your configuration:

   ```env
   VITE_API_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
   VITE_ENVIRONMENT=development
   ```

4. **Start Development Server**

   ```bash
   npm run dev
   ```

   The website will be available at `http://localhost:5173`

## Frontend Setup

### Development Environment

1. **Install Frontend Dependencies**

   ```bash
   cd frontend
   npm install
   ```

2. **Available Scripts**
   - `npm run dev` - Start development server
   - `npm run build` - Build for production
   - `npm run preview` - Preview production build
   - `npm run lint` - Run ESLint
   - `npm run format` - Format code with Prettier
   - `npm run type-check` - Run TypeScript type checking

3. **Development Features**
   - Hot module replacement (HMR)
   - TypeScript support
   - Tailwind CSS with live reload
   - ESLint and Prettier integration
   - Automated testing setup

## Backend Setup

### Google Apps Script Configuration

1. **Install Google Apps Script CLI**

   ```bash
   npm install -g @google/clasp
   ```

2. **Login to Google Apps Script**

   ```bash
   clasp login
   ```

3. **Backend Environment Setup**

   ```bash
   cd backend
   cp .env.example .env
   ```

   Configure your `.env` file:

   ```env
   SCRIPT_ID=your_google_apps_script_id
   CONTACT_FORM_SHEET_ID=your_contact_form_sheet_id
   JOB_APPLICATION_SHEET_ID=your_job_application_sheet_id
   RESUME_PARENT_FOLDER_ID=your_google_drive_folder_id
   EMAIL_TO=hello@thinkred.tech
   ```

4. **Deploy Backend**

   ```bash
   npm run deploy
   ```

### Backend Configuration

The backend requires several Google Cloud services:

- **Google Sheets**: For storing form submissions
- **Google Drive**: For storing resume files
- **Gmail**: For sending email notifications

## IDE Setup

### VS Code Configuration

Recommended VS Code extensions:

- **ES7+ React/Redux/React-Native snippets**
- **Prettier - Code formatter**
- **ESLint**
- **TypeScript Importer**
- **Tailwind CSS IntelliSense**
- **GitLens**

### VS Code Settings

Add to your workspace settings (`.vscode/settings.json`):

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## Database Setup

### Google Sheets Configuration

1. **Create Contact Form Sheet**
   - Column headers: Timestamp, Name, Email, Phone, Company, Project Type, Budget, Timeline, Message
   - Share with your Google Apps Script service account

2. **Create Job Application Sheet**
   - Column headers: Timestamp, Job ID, Name, Email, Phone, Experience, Skills, Portfolio, Cover
     Letter, Resume URL
   - Share with your Google Apps Script service account

## Deployment Setup

### GitHub Pages (Frontend)

1. **Configure GitHub Repository**
   - Enable GitHub Pages in repository settings
   - Set source to GitHub Actions

2. **Environment Secrets**

   Add the following secrets to your GitHub repository:
   - `VITE_API_URL`: Your Google Apps Script deployment URL

### Google Apps Script (Backend)

1. **Create New Google Apps Script Project**

2. **Configure Project Settings**
   - Set project name: "ThinkRED Website Backend"
   - Enable necessary Google Cloud services

3. **Deploy as Web App**
   - Execute as: Me
   - Who has access: Anyone

## Verification

### Frontend Verification

1. **Check Development Server**

   ```bash
   npm run dev
   ```

   Verify the site loads at `http://localhost:5173`

2. **Check Build Process**

   ```bash
   npm run build
   ```

   Verify build completes without errors

3. **Run Tests**

   ```bash
   npm run test
   ```

### Backend Verification

1. **Test Backend Setup**

   ```bash
   cd backend
   node verify-setup.js
   ```

2. **Test Form Submission**
   - Submit a test contact form
   - Check Google Sheets for new entry
   - Verify email notification

## Troubleshooting

### Common Issues

**Port Already in Use**

```bash
# Kill process using port 5173
npx kill-port 5173
```

**Permission Denied**

```bash
# Fix npm permissions
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

**Google Apps Script Login Issues**

```bash
# Clear clasp credentials and re-login
clasp logout
clasp login
```

**Build Failures**

```bash
# Clear node modules and reinstall
rm -rf node_modules
npm install
```

### Getting Help

For additional support:

1. Check the [Troubleshooting Guide](./TROUBLESHOOTING.md)
2. Review the [FAQ](./FAQ.md)
3. Check the [Architecture Documentation](./ARCHITECTURE.md)
4. Create an issue in the repository

## Next Steps

After completing the setup:

1. **Review Architecture**: Read [ARCHITECTURE.md](./ARCHITECTURE.md) to understand the system
2. **Understand Workflow**: Check [WORKFLOW.md](./WORKFLOW.md) for development process
3. **Follow Style Guide**: Review [STYLE_GUIDE.md](./STYLE_GUIDE.md) for coding standards
4. **API Documentation**: Familiarize yourself with [API.md](./API.md)

---

**Setup Complete!** You're ready to start developing with the ThinkRED Technologies website.

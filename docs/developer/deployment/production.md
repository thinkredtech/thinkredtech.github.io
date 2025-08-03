# ThinkRED Deployment Guide

## Overview

This guide covers the deployment processes for both the frontend and backend components of the ThinkRED website.

## Frontend Deployment

### Primary Deployment - GitHub Pages

The frontend is automatically deployed to GitHub Pages whenever changes are pushed to the main branch.

**Deployment URL**: `https://thinkredtech.github.io`

**Process**:

1. Push changes to the main branch
2. GitHub Actions workflow is triggered
3. Application is built using `npm run build`
4. Built files are deployed to the `gh-pages` branch
5. GitHub Pages serves the application

### Manual Deployment - Hostinger

For production hosting on Hostinger:

```bash
cd frontend
npm run deploy:hostinger
```

This runs the deployment script that:

1. Builds the application
2. Uploads files to Hostinger via FTP/SFTP
3. Updates the production website

### Build Process

The frontend build process:

```bash
cd frontend
npm run build
```

This command:

- Compiles TypeScript to JavaScript
- Bundles and minifies assets
- Copies documentation from `docs/` to `build/docs/`
- Generates optimized production files in `build/` directory

## Backend Deployment

### Google Apps Script Deployment

The backend is deployed to Google Apps Script using CLASP (Command Line Apps Script Projects).

**Prerequisites**:

- Google account with Apps Script access
- CLASP CLI tool installed globally
- Authentication with Google Apps Script

### Deployment Steps

1. **Install CLASP globally**:

   ```bash
   npm install -g @google/clasp
   ```

2. **Login to Google Apps Script**:

   ```bash
   clasp login
   ```

3. **Deploy the backend**:
   ```bash
   cd backend
   npm run deploy
   ```

### Backend Deployment Script

The deployment script (`backend/deploy.sh`) performs:

1. Pushes code to Google Apps Script
2. Creates a new deployment
3. Configures the web app permissions
4. Returns the deployment URL

### Manual Deployment Options

**Using CLASP directly**:

```bash
cd backend
clasp push
clasp deploy
```

**Using Node.js script**:

```bash
cd backend
npm run deploy:node
```

## Environment Configuration

### Frontend Environment Variables

Create `.env` in the frontend directory:

```env
VITE_API_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

### Backend Configuration

Backend configuration is managed through Google Apps Script Properties:

- `CONTACT_FORM_SHEET_ID`: Google Sheets ID for contact forms
- `JOB_APPLICATION_SHEET_ID`: Google Sheets ID for job applications
- `RESUME_PARENT_FOLDER_ID`: Google Drive folder ID for resumes
- `EMAIL_TO`: Primary notification email
- `EMAIL_CC_CONTACT_FORM`: CC email for contact forms
- `EMAIL_CC_JOB_APPLY`: CC email for job applications

## Continuous Integration/Continuous Deployment (CI/CD)

### GitHub Actions Workflow

The repository includes GitHub Actions for automated deployment:

**Workflow File**: `.github/workflows/deploy.yml`

**Triggers**:

- Push to main branch
- Manual workflow dispatch

**Process**:

1. Checkout code
2. Setup Node.js environment
3. Install dependencies
4. Run tests (if configured)
5. Build application
6. Deploy to GitHub Pages

### Deployment Monitoring

**Frontend Monitoring**:

- GitHub Actions provides build status
- GitHub Pages provides hosting status
- Browser console for runtime errors

**Backend Monitoring**:

- Google Apps Script execution logs
- Email delivery confirmations
- Google Sheets data validation

## Rollback Procedures

### Frontend Rollback

**GitHub Pages**:

1. Identify the previous working commit
2. Revert the problematic commit
3. Push the revert to trigger a new deployment

**Hostinger**:

1. Access the hosting control panel
2. Restore from the previous backup
3. Or manually upload the previous build files

### Backend Rollback

**Google Apps Script**:

1. Access the Google Apps Script dashboard
2. Select a previous version from the version history
3. Deploy the previous version
4. Update the web app deployment

## Troubleshooting

### Common Frontend Issues

**Build Failures**:

- Check Node.js version compatibility
- Verify all dependencies are installed
- Review build logs for specific errors

**Deployment Failures**:

- Verify GitHub Actions permissions
- Check repository settings for GitHub Pages
- Ensure `gh-pages` branch exists and is configured

### Common Backend Issues

**CLASP Authentication**:

```bash
clasp login --creds credentials.json
```

**Permission Errors**:

- Verify Google Apps Script API is enabled
- Check project permissions in Google Cloud Console
- Ensure proper OAuth scopes are configured

**Deployment Timeouts**:

- Large projects may need to be deployed in parts
- Use `clasp push --force` if necessary
- Check file size limits (Google Apps Script has limits)

## Security Considerations

### Frontend Security

- HTTPS enforcement on all hosting platforms
- CSP headers configured for security
- No sensitive data in frontend code
- Environment variables for configuration

### Backend Security

- OAuth2 authentication for Google Apps Script
- Proper CORS configuration
- Input validation and sanitization
- Secure file storage in Google Drive

## Performance Optimization

### Frontend Optimization

- Code splitting for faster loading
- Image optimization and lazy loading
- Asset minification and compression
- CDN usage for static assets

### Backend Optimization

- Efficient Google Sheets operations
- Batch processing for multiple requests
- Caching strategies where appropriate
- Minimal execution time for Apps Script functions

## Monitoring and Alerts

### Frontend Monitoring

- GitHub Actions notifications for build status
- Uptime monitoring for hosted applications
- Performance monitoring through browser tools

### Backend Monitoring

- Google Apps Script execution logs
- Email delivery confirmations
- Google Sheets audit logs
- Error tracking and notification

## Best Practices

### Development Workflow

1. Test all changes locally before deployment
2. Use feature branches for new development
3. Review all pull requests before merging
4. Maintain separate staging and production environments
5. Document all deployment procedures

### Security Practices

1. Never commit sensitive data to the repository
2. Use environment variables for configuration
3. Regularly update dependencies
4. Monitor for security vulnerabilities
5. Implement proper access controls

### Performance Practices

1. Optimize images and assets before deployment
2. Monitor application performance after deployment
3. Use caching strategies appropriately
4. Minimize bundle sizes
5. Test on various devices and connection speeds

---

## 🚀 **Quick Deployment**

### **⚡ One-Command Deploy**

```bash
# Deploy everything (recommended)
npm run deploy

# This automatically:
# 1. Builds frontend for production
# 2. Deploys backend to Google Apps Script
# 3. Updates frontend with new API endpoint
# 4. Deploys frontend to GitHub Pages
# 5. Runs health checks
```

### **🎯 Individual Component Deployment**

```bash
# Deploy only frontend
npm run deploy:frontend

# Deploy only backend
npm run deploy:backend

# Deploy to specific environment
npm run deploy:staging
npm run deploy:production
```

---

## 🎨 **Frontend Deployment**

### **🌐 GitHub Pages (Automatic)**

GitHub Pages deployment is **fully automated** via GitHub Actions:

```yaml
# .github/workflows/deploy-frontend.yml
name: Deploy Frontend
on:
  push:
    branches: [main]
    paths: ["frontend/**"]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "18"
      - name: Install and Build
        run: |
          cd frontend
          npm ci
          npm run build
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./frontend/build
```

### **🏢 Hostinger Deployment (Manual)**

```bash
# Navigate to frontend
cd frontend

# Build for production
npm run build

# Deploy to Hostinger (Zero-downtime deployment)
npm run deploy:hostinger

# Alternative: Use legacy deployment (if needed)
npm run deploy:hostinger-legacy
```

### **⚡ Vercel Deployment (Optional)**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
cd frontend
vercel --prod

# Or use one-command deploy
npm run deploy:vercel
```

---

## ⚙️ **Backend Deployment**

### **🤖 Google Apps Script Deployment**

Our backend deployment is **intelligent and automated**:

```bash
# Quick backend deployment
cd backend
npm run deploy

# Manual deployment with custom message
clasp push -f
clasp deploy --description "New feature: enhanced file upload"

# Verify deployment
npm run verify
```

### **🔄 Automated Deployment Flow**

1. **Code Push** → Triggers GitHub Actions
2. **Backend Build** → Prepares Google Apps Script
3. **Deploy to GAS** → Creates new deployment
4. **Extract ID** → Gets new deployment ID automatically
5. **Update Frontend** → Updates API configuration
6. **Frontend Deploy** → Deploys with new configuration
7. **Health Check** → Verifies everything works

### **📋 Deployment Scripts**

```bash
# Backend deployment script
./backend/deploy.sh

# With environment selection
./scripts/deployment-manager.sh deploy production

# Update deployment ID across all files
./scripts/update-deployment-id.sh AKfycby...
```

---

## 🔧 **Multi-Environment Management**

### **🌍 Environment Configuration**

```json
// .deployment-config.json
{
  "environments": {
    "development": {
      "name": "Development",
      "frontend_url": "http://localhost:5173",
      "backend_deployment_id": "development-id",
      "description": "Local development environment"
    },
    "staging": {
      "name": "Staging",
      "frontend_url": "https://staging.thinkred.tech",
      "backend_deployment_id": "staging-deployment-id",
      "description": "Staging environment for testing"
    },
    "production": {
      "name": "Production",
      "frontend_url": "https://thinkred.tech",
      "backend_deployment_id": "production-deployment-id",
      "description": "Production environment"
    }
  },
  "current_environment": "production"
}
```

### **�️ Environment Manager Commands**

```bash
# Show current environment
./scripts/deployment-manager.sh show

# List all environments
./scripts/deployment-manager.sh list

# Switch environment
./scripts/deployment-manager.sh switch staging

# Deploy to specific environment
./scripts/deployment-manager.sh deploy production

# Create new environment
./scripts/deployment-manager.sh create testing
```

---

## 🤖 **GitHub Actions CI/CD**

### **🔄 Backend Deployment Workflow**

```yaml
# .github/workflows/deploy-backend.yml
name: Deploy Backend
on:
  push:
    branches: [main]
    paths: ["backend/**"]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "18"

      - name: Install CLASP
        run: npm install -g @google/clasp

      - name: Setup CLASP credentials
        run: echo "$CLASP_CREDENTIALS" > ~/.clasprc.json
        env:
          CLASP_CREDENTIALS: ${{ secrets.CLASP_CREDENTIALS }}

      - name: Deploy to Google Apps Script
        run: |
          cd backend
          clasp push -f
          deployment_id=$(clasp deploy --description "Auto-deploy from GitHub Actions" | grep -oP 'AK[a-zA-Z0-9_-]+')
          echo "DEPLOYMENT_ID=$deployment_id" >> $GITHUB_ENV

      - name: Update frontend configuration
        run: |
          ./scripts/update-deployment-id.sh $DEPLOYMENT_ID

      - name: Commit configuration updates
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add .
          git commit -m "ci: update deployment ID to $DEPLOYMENT_ID" || exit 0
          git push
```

### **🎨 Frontend Deployment Workflow**

```yaml
# .github/workflows/deploy-frontend.yml
name: Deploy Frontend
on:
  push:
    branches: [main]
    paths: ["frontend/**", ".env"]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "18"
          cache: "npm"
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        run: |
          cd frontend
          npm ci

      - name: Build frontend
        run: |
          cd frontend
          npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./frontend/build

      - name: Health check
        run: |
          sleep 30
          curl -f https://thinkredtech.github.io || exit 1
```

---

## 🛡️ **Deployment Security**

### **🔐 Secrets Management**

All sensitive data is stored securely in GitHub Secrets:

```bash
# Required GitHub Secrets
CLASP_CREDENTIALS           # Google Apps Script authentication
GOOGLE_APPS_SCRIPT_ID      # Project ID
HOSTINGER_FTP_HOST         # Hostinger deployment
HOSTINGER_FTP_USER         # FTP credentials
HOSTINGER_FTP_PASS         # FTP password
```

### **🛡️ Security Best Practices**

- **No hardcoded secrets** in repository
- **Environment-specific configurations**
- **Secure credential storage** via GitHub Secrets
- **Access control** with proper permissions
- **Audit logging** for all deployments

---

## 📊 **Deployment Monitoring**

### **🔍 Health Checks**

```bash
# Test API connectivity
./test-cors-api.sh

# Test file upload functionality
./test-file-sizes.sh

# Frontend health check
curl -f https://thinkredtech.github.io/api/health

# Backend health check
curl -f "https://script.google.com/macros/s/$DEPLOYMENT_ID/exec?action=health"
```

### **📈 Monitoring Commands**

```bash
# Check deployment status
./scripts/deployment-manager.sh status

# View recent deployments
clasp deployments

# Check frontend build status
cd frontend && npm run build --verbose

# View GitHub Actions logs
gh run list --workflow=deploy-backend.yml
```

---

## 🚨 **Rollback Procedures**

### **⏪ Quick Rollback**

```bash
# Rollback to previous deployment
./scripts/deployment-manager.sh rollback

# Rollback to specific deployment ID
./scripts/update-deployment-id.sh PREVIOUS_DEPLOYMENT_ID

# Emergency rollback (production)
./scripts/deployment-manager.sh emergency-rollback
```

### **🔄 Deployment Recovery**

```bash
# If deployment fails:

# 1. Check logs
./scripts/deployment-manager.sh logs

# 2. Verify environment
./scripts/env-manager.sh validate

# 3. Manual recovery
cd backend
clasp pull  # Get latest from Google Apps Script
npm run verify

# 4. Redeploy
npm run deploy
```

---

## 🐛 **Troubleshooting Deployments**

### **❌ Common Issues**

#### **Backend Deployment Fails**

```bash
# Check CLASP authentication
clasp login

# Verify project settings
cd backend
cat .clasp.json

# Check Google Apps Script console
# https://script.google.com/home
```

#### **Frontend Build Fails**

```bash
# Clear cache and rebuild
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build

# Check for TypeScript errors
npm run type-check

# Verify environment variables
../scripts/env-manager.sh validate
```

#### **GitHub Actions Fail**

```bash
# Check secrets configuration
gh secret list

# View action logs
gh run view --log

# Re-trigger deployment
gh workflow run deploy-backend.yml
```

### **🔧 Debug Commands**

```bash
# Verbose deployment
./scripts/deployment-manager.sh deploy production --verbose

# Test deployment configuration
./scripts/deployment-manager.sh test

# Validate all environments
./scripts/deployment-manager.sh validate-all

# Show deployment history
./scripts/deployment-manager.sh history
```

---

## 📋 **Deployment Checklist**

### **✅ Pre-Deployment**

- [ ] All tests pass locally
- [ ] Environment variables configured
- [ ] No hardcoded secrets in code
- [ ] Build succeeds without warnings
- [ ] TypeScript compilation clean
- [ ] ESLint passes
- [ ] Documentation updated

### **✅ During Deployment**

- [ ] Monitor deployment logs
- [ ] Watch for error messages
- [ ] Verify health checks pass
- [ ] Test critical functionality
- [ ] Check frontend loads correctly
- [ ] Verify API endpoints work

### **✅ Post-Deployment**

- [ ] Run full test suite
- [ ] Check application performance
- [ ] Verify all features work
- [ ] Monitor error rates
- [ ] Update deployment documentation
- [ ] Notify team of successful deployment

---

## 🎯 **Advanced Deployment Strategies**

### **🚀 Blue-Green Deployment**

```bash
# Deploy to staging environment
./scripts/deployment-manager.sh deploy staging

# Test staging thoroughly
./test-cors-api.sh staging
./test-file-sizes.sh staging

# Switch to production when ready
./scripts/deployment-manager.sh promote staging production
```

### **🎯 Canary Deployment**

```bash
# Deploy to canary environment (10% traffic)
./scripts/deployment-manager.sh deploy canary

# Monitor performance and errors
./scripts/deployment-manager.sh monitor canary

# Gradually increase traffic
./scripts/deployment-manager.sh scale canary 50

# Full rollout when confident
./scripts/deployment-manager.sh promote canary production
```

### **📊 A/B Testing Deployment**

```bash
# Deploy variant B
./scripts/deployment-manager.sh deploy variant-b

# Configure traffic split
./scripts/deployment-manager.sh split production:50 variant-b:50

# Analyze results
./scripts/deployment-manager.sh analyze variant-b

# Promote winner
./scripts/deployment-manager.sh promote variant-b production
```

---

## 🔄 **Continuous Integration Best Practices**

### **📝 Commit Message Conventions**

```bash
# Use conventional commits for automated processing
git commit -m "feat: add new deployment strategy"
git commit -m "fix: resolve CORS issue in production"
git commit -m "docs: update deployment guide"
git commit -m "ci: optimize GitHub Actions workflow"
```

### **🔀 Branch Strategy**

```text
main                    # Production-ready code
├── develop            # Integration branch
├── feature/xyz        # Feature branches
├── hotfix/abc         # Emergency fixes
└── release/v1.0.0     # Release preparation
```

### **🧪 Automated Testing**

```bash
# Run before deployment
npm run test:unit       # Unit tests
npm run test:integration # Integration tests
npm run test:e2e        # End-to-end tests
npm run test:performance # Performance tests
```

---

## 🏆 **Deployment Success Metrics**

### **📊 Key Metrics**

- **Deployment Frequency**: How often we deploy
- **Lead Time**: Time from commit to production
- **Mean Time to Recovery**: Time to fix issues
- **Change Failure Rate**: Percentage of failed deployments

### **🎯 Goals**

- **Daily Deployments**: At least one deployment per day
- **Sub-10 Minute Builds**: Keep CI/CD pipeline fast
- **99.9% Uptime**: Minimize service disruption
- **Zero Rollbacks**: Get deployments right the first time

---

<div align="center">

### 🎉 **Deploy with Confidence! Ship with Style! ⚡**

_"Great deployments are not accidents, they are the result of great preparation and automation!"_

[![Back to Main](https://img.shields.io/badge/←%20Back%20to%20Main-README-blue?style=for-the-badge)](../README.md)
[![Setup Guide](https://img.shields.io/badge/Setup%20Guide-→-green?style=for-the-badge)](./SETUP.md)

</div>

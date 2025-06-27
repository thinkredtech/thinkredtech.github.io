# Environment Configuration Guide

This guide explains how to set up and manage environment variables for the ThinkRED monorepo.

## 📋 Overview

The ThinkRED monorepo uses a centralized environment configuration system that:
- Stores all environment variables in a single root `.env` file
- Provides type-safe access to configuration in the frontend
- Automatically syncs critical settings between frontend and backend
- Includes validation and management utilities

## 🚀 Quick Setup

### 1. Initialize Environment

```bash
# From the root directory
./scripts/env-manager.sh init
```

This creates a `.env` file from the template with all necessary variables.

### 2. Configure Required Variables

Edit the `.env` file and set these critical values:

```bash
# Required for API functionality
GOOGLE_APPS_SCRIPT_ID=your-google-apps-script-project-id
GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID=your-current-deployment-id

# Required for admin access
REACT_APP_ADMIN_PASSWORD=your-secure-password

# Email configuration (set in Google Apps Script Properties)
EMAIL_TO=your-email@example.com
```

### 3. Validate Configuration

```bash
./scripts/env-manager.sh validate
```

## 📚 Environment Variables Reference

### Google Apps Script Configuration

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `GOOGLE_APPS_SCRIPT_ID` | Project ID from script.google.com | Yes | `1lxhn-Siz6ThM7rWHveiEVE1...` |
| `GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID` | Current deployment ID (changes with each deploy) | Yes | `AKfycbzjcTdSJp9sQYs3...` |
| `GOOGLE_APPS_SCRIPT_BASE_URL` | Base URL for Google Apps Script | No | `https://script.google.com/macros/s` |

### Google Sheets Configuration

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `CONTACT_FORM_SHEET_ID` | Sheet ID for contact form submissions | No* | `1BxQ2r3...` |
| `JOB_APPLICATION_SHEET_ID` | Sheet ID for job applications | No* | `1CyR3s4...` |

*Set these in Google Apps Script Properties instead of .env

### Email Configuration

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `EMAIL_TO` | Primary notification email | No* | `notifications@company.com` |
| `EMAIL_CC_CONTACT_FORM` | CC for contact form emails | No* | `contact@company.com` |
| `EMAIL_CC_JOB_APPLY` | CC for job application emails | No* | `hr@company.com` |

*Set these in Google Apps Script Properties instead of .env

### Frontend Configuration

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment mode | No | `development` |
| `REACT_APP_ADMIN_PASSWORD` | Admin panel password | Yes | None |
| `FRONTEND_BASE_URL` | Base URL for the frontend | No | `https://thinkredtech.github.io` |
| `API_TIMEOUT` | API request timeout (ms) | No | `30000` |

### Feature Flags

| Variable | Description | Default |
|----------|-------------|---------|
| `ENABLE_JOB_APPLICATIONS` | Enable job application feature | `true` |
| `ENABLE_CONTACT_FORM` | Enable contact form feature | `true` |
| `ENABLE_BLOG` | Enable blog feature | `true` |
| `ENABLE_PORTFOLIO` | Enable portfolio feature | `true` |

### Security Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `ENABLE_HONEYPOT` | Enable spam protection | `true` |
| `ENABLE_RATE_LIMITING` | Enable rate limiting | `true` |
| `RATE_LIMIT_COOLDOWN` | Rate limit cooldown (ms) | `5000` |
| `ALLOWED_ORIGINS` | Comma-separated allowed origins | See example |

## 🛠️ Management Tools

### Environment Manager Script

The `scripts/env-manager.sh` script provides utilities for managing environment configuration:

```bash
# Initialize environment from template
./scripts/env-manager.sh init

# Validate current configuration
./scripts/env-manager.sh validate

# Update API endpoint after backend deployment
./scripts/env-manager.sh update-api --deployment-id NEW_ID

# Show current configuration
./scripts/env-manager.sh show

# Show help
./scripts/env-manager.sh help
```

### Frontend Configuration Access

Use the centralized configuration system in your React components:

```typescript
import { config, googleAppsScript, features } from '../config/environment';

// Access API endpoint
const apiUrl = config.googleAppsScript.apiEndpoint;

// Check feature flags
if (features.contactForm) {
  // Render contact form
}

// Access individual sections
const deploymentId = googleAppsScript.deploymentId;
```

## 🔄 Deployment Workflow

### Backend Deployment

When deploying the backend:

1. Deploy using the standard script:
   ```bash
   cd backend
   ./deploy.sh
   ```

2. Note the new deployment ID from the output

3. Update the environment configuration:
   ```bash
   ./scripts/env-manager.sh update-api --deployment-id NEW_DEPLOYMENT_ID
   ```

4. Rebuild and deploy the frontend:
   ```bash
   cd frontend
   npm run build
   git add .
   git commit -m "Update API endpoint"
   git push
   ```

### Frontend Deployment

Frontend deployment is automatic via GitHub Actions when you push to the main branch.

## 🔍 Troubleshooting

### Common Issues

#### 1. "CORS preflight errors"
- **Cause**: Outdated deployment ID in environment configuration
- **Solution**: Update the deployment ID after backend changes
  ```bash
  ./scripts/env-manager.sh update-api --deployment-id LATEST_ID
  ```

#### 2. "Environment validation failed"
- **Cause**: Missing or invalid environment variables
- **Solution**: Run validation and fix reported issues
  ```bash
  ./scripts/env-manager.sh validate
  ```

#### 3. "Admin panel not accessible"
- **Cause**: Missing or incorrect admin password
- **Solution**: Set `REACT_APP_ADMIN_PASSWORD` in .env file

#### 4. "API endpoint not found"
- **Cause**: Google Apps Script deployment issues
- **Solution**: 
  1. Verify Google Apps Script is deployed correctly
  2. Check deployment ID matches environment configuration
  3. Ensure Google Apps Script permissions are set correctly

### Validation Commands

```bash
# Validate environment configuration
./scripts/env-manager.sh validate

# Check current configuration
./scripts/env-manager.sh show

# Test API endpoint
curl -X GET "$(grep GOOGLE_APPS_SCRIPT_BASE_URL .env | cut -d'=' -f2)/$(grep GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID .env | cut -d'=' -f2)/exec"
```

### Debug Mode

Enable debug logging by setting:

```bash
ENABLE_DEV_LOGGING=true
ENABLE_API_DEBUG=true
```

## 🔒 Security Best Practices

1. **Never commit .env files**: The `.env` file is in `.gitignore` and should never be committed
2. **Use strong passwords**: Set a strong admin password
3. **Rotate deployment IDs**: Update deployment IDs regularly for security
4. **Limit CORS origins**: Only include necessary origins in `ALLOWED_ORIGINS`
5. **Use environment-specific configs**: Use different .env files for different environments

## 📁 File Structure

```
thinkred-monorepo/
├── .env                     # Main environment file (not in git)
├── .env.example            # Template file (in git)
├── scripts/
│   └── env-manager.sh      # Environment management utility
├── frontend/
│   └── src/
│       ├── config/
│       │   └── environment.ts  # Centralized config access
│       └── vite-env.d.ts   # TypeScript environment types
└── backend/
    └── deploy.sh           # Updated to use root .env
```

## 🔄 Migration Guide

If you're upgrading from the old environment system:

1. **Backup existing configuration**:
   ```bash
   cp frontend/.env.local .env.backup
   ```

2. **Initialize new system**:
   ```bash
   ./scripts/env-manager.sh init
   ```

3. **Migrate your values** from the backup to the new `.env` file

4. **Update your code** to use the new configuration system:
   ```typescript
   // Old way
   const apiEndpoint = 'https://script.google.com/macros/s/HARDCODED_ID/exec';
   
   // New way
   import { config } from '../config/environment';
   const apiEndpoint = config.googleAppsScript.apiEndpoint;
   ```

5. **Validate and test**:
   ```bash
   ./scripts/env-manager.sh validate
   ```

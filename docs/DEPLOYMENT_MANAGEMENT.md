# Deployment Management System

This document describes the automated deployment management system for ThinkRED, which ensures that frontend configurations are automatically updated when the backend Google Apps Script is deployed.

## 🎯 Problem Solved

Previously, when the backend was deployed to Google Apps Script, a new deployment ID was generated, but the frontend configuration wasn't automatically updated. This led to:
- Manual configuration updates required after each backend deployment
- Risk of frontend pointing to outdated backend endpoints
- Inconsistency between GitHub Pages and Hostinger deployments
- Potential downtime if configurations weren't updated promptly

## 🔧 Solution Overview

The new system provides:
1. **Automated backend-frontend synchronization**
2. **Multi-environment deployment management**
3. **GitHub Actions integration for CI/CD**
4. **Manual override capabilities for different deployment targets**

## 📁 System Components

### 1. GitHub Actions Workflow (`deploy-backend.yml`)

- Automatically captures new deployment IDs from Google Apps Script
- Updates frontend configuration files
- Commits and pushes changes to trigger frontend rebuild
- Provides deployment status and endpoint information

### 2. Local Deployment Scripts

#### `scripts/update-deployment-id.sh`

Updates deployment ID across all configuration files:
```bash
# Update to specific deployment ID
./scripts/update-deployment-id.sh AKfycby...

# Interactive mode
./scripts/update-deployment-id.sh
```

#### `scripts/deployment-manager.sh`

Manages multiple deployment environments:
```bash
# Show current configuration
./scripts/deployment-manager.sh show

# List available environments
./scripts/deployment-manager.sh list

# Update environment
./scripts/deployment-manager.sh update production AKfycby...

# Apply environment configuration
./scripts/deployment-manager.sh apply production

# Sync from latest backend deployment
./scripts/deployment-manager.sh sync-from-backend AKfycby...
```

#### Enhanced `backend/deploy.sh`

- Automatically extracts deployment ID from `clasp deploy` output
- Calls update scripts to synchronize frontend configuration
- Provides deployment status and testing instructions

### 3. Frontend Configuration (`frontend/src/config/environment.ts`)

Enhanced to support environment-specific deployment IDs:
```typescript
// Environment-specific deployment IDs
GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID_PRODUCTION=AKfycby...
GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID_STAGING=AKfycby...
GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID_DEVELOPMENT=AKfycby...

// Fallback general deployment ID
GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID=AKfycby...
```

### 4. Environment Configuration (`.deployment-config.json`)

Stores deployment IDs for different environments:
```json
{
  "environments": {
    "production": {
      "name": "GitHub Pages",
      "deploymentId": "AKfycby...",
      "description": "Production deployment on GitHub Pages"
    },
    "hostinger": {
      "name": "Hostinger", 
      "deploymentId": "AKfycby...",
      "description": "Production deployment on Hostinger"
    }
  }
}
```

## 🚀 Deployment Workflows

### Automated Backend Deployment (Recommended)

1. **Push backend changes** to the `backend/` directory
2. **GitHub Actions triggers** automatically:
   - Deploys to Google Apps Script
   - Captures new deployment ID
   - Updates frontend configuration
   - Commits changes
   - Triggers frontend rebuild

3. **Frontend deploys automatically** with updated configuration

### Manual Backend Deployment

1. **Deploy backend locally**:
   ```bash
   cd backend
   ./deploy.sh
   ```

2. **Script automatically**:
   - Extracts deployment ID
   - Updates frontend configuration
   - Provides next steps

3. **Push changes** (if not done automatically):
   ```bash
   git add .
   git commit -m "Update API endpoint"
   git push
   ```

### Environment-Specific Deployments

1. **Update specific environment**:
   ```bash
   ./scripts/deployment-manager.sh update hostinger AKfycby...
   ```

2. **Apply environment configuration**:
   ```bash
   ./scripts/deployment-manager.sh apply hostinger
   ```

3. **Deploy to specific target**:
   ```bash
   # For Hostinger
   cd frontend
   ./deploy-hostinger.sh
   
   # For GitHub Pages
   git push origin main
   ```

## 🧪 Testing

### Automated Testing

The `test-cors-api.sh` script is automatically updated with new deployment IDs:
```bash
./test-cors-api.sh
```

### Manual Testing

1. **Check endpoint status**:
   ```bash
   curl "https://script.google.com/macros/s/AKfycby.../exec?action=test"
   ```

2. **Test job application flow**:
   - Visit: <https://thinkredtech.github.io/apply/ui-ux-designer>
   - Submit test application
   - Verify in Google Sheets

## 🔧 Configuration Files Updated

The system automatically updates these files:
- `frontend/src/config/environment.ts` - Frontend API configuration
- `test-cors-api.sh` - Testing script endpoint
- `.env` - Environment variables
- `.deployment-config.json` - Multi-environment configuration

## 🚨 Troubleshooting

### Frontend Still Points to Old Endpoint

1. Check if GitHub Actions deployment completed successfully
2. Verify frontend rebuild was triggered
3. Manually update using: `./scripts/update-deployment-id.sh NEW_ID`

### Backend Deployment ID Not Captured

1. Check `clasp deploy` output format
2. Verify regex pattern in deployment script
3. Manually extract ID from Google Apps Script console

### Environment Configuration Issues

1. Check `.deployment-config.json` exists and is valid JSON
2. Verify `jq` is installed for JSON manipulation
3. Reset configuration: `rm .deployment-config.json && ./scripts/deployment-manager.sh`

## 🎉 Benefits

1. **Zero Downtime**: Frontend automatically points to latest backend
2. **Multi-Environment Support**: Different deployment targets can use different backend endpoints
3. **Automated CI/CD**: Full automation from backend changes to frontend deployment
4. **Manual Override**: Ability to manually manage configurations when needed
5. **Testing Integration**: Test scripts automatically updated with current endpoints
6. **Audit Trail**: Git history tracks all deployment ID changes

## 📝 Best Practices

1. **Use Automated Deployment**: Let GitHub Actions handle the synchronization
2. **Test After Deployment**: Always run `./test-cors-api.sh` after backend changes
3. **Environment Isolation**: Use different deployment IDs for staging vs production
4. **Monitor Deployments**: Check GitHub Actions status for deployment failures
5. **Backup Configuration**: Keep `.deployment-config.json` in version control

This system ensures that your frontend and backend stay in sync across all deployment environments, reducing manual work and preventing configuration drift.

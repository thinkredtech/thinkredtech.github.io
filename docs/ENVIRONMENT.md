# 🔧 ThinkRED Environment Configuration Guide

Welcome to the **environment mastery dojo** of ThinkRED! Configure like a sage, deploy like a ninja! 🥷

<div align="center">

![Environment](https://img.shields.io/badge/Environment-Master%20Config-blue?style=for-the-badge&logo=gear)
![Automation](https://img.shields.io/badge/Automation-Ultra%20Level-green?style=for-the-badge&logo=robot)
![Security](https://img.shields.io/badge/Security-Fortress%20Mode-red?style=for-the-badge&logo=shield)

</div>

---

## 🌟 **Environment System Overview**

ThinkRED uses a **legendary environment management system** that automatically handles configuration across all components,
ensuring your secrets stay secret and your deployments stay smooth! ⚡

### **🎯 Key Features**

- **🔐 Secure Secret Management**: No hardcoded credentials anywhere
- **🔄 Automatic Synchronization**: Environment changes propagate automatically
- **🌍 Multi-Environment Support**: Development, staging, and production
- **✅ Built-in Validation**: Catch configuration errors before they cause issues
- **🛡️ Type-Safe Configuration**: TypeScript integration for better DX

---

## 📁 **Environment Architecture**

```text
Environment System/
├── 🔑 .env                          # Root environment variables
├── 🌍 .deployment-config.json       # Multi-environment settings
├── 🎨 frontend/src/config/
│   ├── environment.ts               # Frontend environment access
│   └── deployment.config.ts         # Deployment-specific config
├── ⚙️ backend/
│   ├── .clasp.json                  # Google Apps Script config
│   └── script-properties.md         # GAS environment variables
├── �️ scripts/
│   ├── env-manager.sh              # Environment management CLI
│   ├── deployment-manager.sh       # Multi-environment deployment
│   └── update-deployment-id.sh     # Sync deployment IDs
└── 🧪 templates/
    ├── .env.template               # Environment template
    └── .deployment-config.template  # Deployment template
```

---

## 🚀 **Quick Setup**

### **⚡ Lightning-Fast Environment Setup**

```bash
# 🎯 Step 1: Initialize environment from template
./scripts/env-manager.sh init

# 🎯 Step 2: Edit your configuration
nano .env  # or code .env, vim .env

# 🎯 Step 3: Validate your setup
./scripts/env-manager.sh validate

# 🎯 Step 4: Apply configuration
./scripts/env-manager.sh apply

# 🎯 Step 5: Verify everything works
npm start
```

### **🔧 Manual Setup (Advanced Users)**

```bash
# Copy template files
cp .env.template .env
cp .deployment-config.template .deployment-config.json

# Edit with your actual values
nano .env
nano .deployment-config.json

# Validate configuration
./scripts/env-manager.sh validate
```

---

## 🔑 **Environment Variables Reference**

### **📋 Required Variables**

| Variable | Description | Required | Example | Where Used |
|----------|-------------|----------|---------|------------|
| `GOOGLE_APPS_SCRIPT_ID` | Google Apps Script project ID | ✅ | `1lxhn-Siz6ThM7r...` | Backend deployment |
| `GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID` | Current deployment ID | ✅ | `AKfycbzjcTdSJp...` | Frontend API calls |
| `REACT_APP_ADMIN_PASSWORD` | Admin panel access password | ✅ | `super-secret-password` | Frontend admin |

### **🔶 Optional Variables**

| Variable | Description | Required | Example | Where Used |
|----------|-------------|----------|---------|------------|
| `EMAIL_TO` | Default notification email | 🔶 | `hello@thinkred.tech` | Backend notifications |
| `WEBHOOK_URL` | Webhook endpoint for notifications | 🔶 | `https://hooks.slack.com/...` | Backend webhooks |
| `DEBUG_MODE` | Enable debug logging | 🔶 | `true` or `false` | All components |
| `RATE_LIMIT_ENABLED` | Enable API rate limiting | 🔶 | `true` or `false` | Backend API |

### **🌍 Environment-Specific Variables**

```bash
# Development Environment
GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID_DEV=AKfycby...dev...
FRONTEND_URL_DEV=http://localhost:5173
DEBUG_MODE_DEV=true

# Staging Environment  
GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID_STAGING=AKfycby...staging...
FRONTEND_URL_STAGING=https://staging.thinkred.tech
DEBUG_MODE_STAGING=false

# Production Environment
GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID_PROD=AKfycby...prod...
FRONTEND_URL_PROD=https://thinkred.tech
DEBUG_MODE_PROD=false
```

---

## 🛠️ **Environment Manager CLI**

The **env-manager.sh** script is your best friend for environment management!

### **📋 Available Commands**

```bash
# Initialize environment from template
./scripts/env-manager.sh init

# Validate current configuration
./scripts/env-manager.sh validate

# Show current environment status
./scripts/env-manager.sh show

# Update API endpoint after backend deployment
./scripts/env-manager.sh update-api --deployment-id NEW_ID

# Switch between environments
./scripts/env-manager.sh switch production

# Export environment for debugging
./scripts/env-manager.sh export

# Reset to template (destructive!)
./scripts/env-manager.sh reset

# Show help
./scripts/env-manager.sh help
```

### **🎯 Detailed Command Examples**

#### **Initialize Environment**

```bash
./scripts/env-manager.sh init

# Output:
# ✅ Created .env from template
# ✅ Created .deployment-config.json from template
# 📝 Please edit .env with your actual values
# 🔄 Run 'validate' command when ready
```

#### **Validate Configuration**

```bash
./scripts/env-manager.sh validate

# Output:
# ✅ All required variables present
# ✅ Google Apps Script ID format valid
# ✅ Deployment ID format valid
# ✅ Email format valid
# ⚡ Configuration is ready!
```

#### **Update API Endpoint**

```bash
./scripts/env-manager.sh update-api --deployment-id AKfycby...new...

# Output:
# 🔄 Updating deployment ID in all configuration files...
# ✅ Updated .env
# ✅ Updated frontend/src/config/environment.ts
# ✅ Updated test-cors-api.sh
# ✅ Updated .deployment-config.json
# 🎉 All files updated successfully!
```

#### **Show Environment Status**

```bash
./scripts/env-manager.sh show

# Output:
# 🌍 Environment Configuration Status
# ═══════════════════════════════════
# Current Environment: production
# Google Apps Script ID: 1lxhn-Siz6ThM7r*** (valid)
# Deployment ID: AKfycbzjcTdSJp*** (valid)
# Admin Password: ********** (configured)
# Email Notifications: hello@thinkred.tech
# Debug Mode: disabled
# ═══════════════════════════════════
```

---

## 🌍 **Multi-Environment Management**

### **🔧 Deployment Configuration**

The `.deployment-config.json` file manages multiple environments:

```json
{
  "environments": {
    "development": {
      "name": "Development",
      "frontend_url": "http://localhost:5173",
      "backend_deployment_id": "AKfycby...dev...",
      "database_sheets": {
        "contact_form": "1ABC...dev",
        "job_applications": "2DEF...dev"
      },
      "features": {
        "debug_mode": true,
        "rate_limiting": false,
        "file_upload_limit": "5MB"
      },
      "description": "Local development environment"
    },
    "staging": {
      "name": "Staging",
      "frontend_url": "https://staging.thinkred.tech",
      "backend_deployment_id": "AKfycby...staging...",
      "database_sheets": {
        "contact_form": "1ABC...staging",
        "job_applications": "2DEF...staging"
      },
      "features": {
        "debug_mode": false,
        "rate_limiting": true,
        "file_upload_limit": "10MB"
      },
      "description": "Staging environment for testing"
    },
    "production": {
      "name": "Production",
      "frontend_url": "https://thinkred.tech",
      "backend_deployment_id": "AKfycby...prod...",
      "database_sheets": {
        "contact_form": "1ABC...prod",
        "job_applications": "2DEF...prod"
      },
      "features": {
        "debug_mode": false,
        "rate_limiting": true,
        "file_upload_limit": "10MB"
      },
      "description": "Production environment"
    }
  },
  "current_environment": "production",
  "last_updated": "2024-01-15T10:30:00.000Z"
}
```

### **🔄 Environment Switching**

```bash
# List available environments
./scripts/deployment-manager.sh list

# Switch to staging
./scripts/deployment-manager.sh switch staging

# Deploy to specific environment
./scripts/deployment-manager.sh deploy production

# Show current environment
./scripts/deployment-manager.sh show
```

---

## 🎨 **Frontend Environment Configuration**

### **⚛️ TypeScript Environment Access**

```typescript
// frontend/src/config/environment.ts
interface EnvironmentConfig {
  googleAppsScriptId: string;
  deploymentId: string;
  adminPassword: string;
  apiBaseUrl: string;
  debugMode: boolean;
  environment: 'development' | 'staging' | 'production';
}

class Environment {
  private static instance: Environment;
  private config: EnvironmentConfig;

  private constructor() {
    this.config = {
      googleAppsScriptId: import.meta.env.VITE_GOOGLE_APPS_SCRIPT_ID || '',
      deploymentId: import.meta.env.VITE_GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID || '',
      adminPassword: import.meta.env.VITE_REACT_APP_ADMIN_PASSWORD || '',
      apiBaseUrl: this.buildApiUrl(),
      debugMode: import.meta.env.VITE_DEBUG_MODE === 'true',
      environment: this.detectEnvironment()
    };

    this.validateConfig();
  }

  static getInstance(): Environment {
    if (!Environment.instance) {
      Environment.instance = new Environment();
    }
    return Environment.instance;
  }

  getConfig(): EnvironmentConfig {
    return { ...this.config };
  }

  private buildApiUrl(): string {
    const deploymentId = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID;
    return `https://script.google.com/macros/s/${deploymentId}/exec`;
  }

  private detectEnvironment(): 'development' | 'staging' | 'production' {
    const hostname = window.location.hostname;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'development';
    } else if (hostname.includes('staging')) {
      return 'staging';
    } else {
      return 'production';
    }
  }

  private validateConfig(): void {
    const errors: string[] = [];

    if (!this.config.googleAppsScriptId) {
      errors.push('Google Apps Script ID is missing');
    }

    if (!this.config.deploymentId) {
      errors.push('Deployment ID is missing');
    }

    if (!this.config.adminPassword) {
      errors.push('Admin password is missing');
    }

    if (errors.length > 0) {
      console.error('Environment configuration errors:', errors);
      throw new Error(`Environment validation failed: ${errors.join(', ')}`);
    }
  }
}

// Usage throughout the application
export const env = Environment.getInstance().getConfig();
export default Environment;
```

### **🔧 Vite Configuration**

```typescript
// vite.config.ts
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // Expose environment variables to the client
      'import.meta.env.VITE_GOOGLE_APPS_SCRIPT_ID': JSON.stringify(env.GOOGLE_APPS_SCRIPT_ID),
      'import.meta.env.VITE_GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID': JSON.stringify(env.GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID),
      'import.meta.env.VITE_REACT_APP_ADMIN_PASSWORD': JSON.stringify(env.REACT_APP_ADMIN_PASSWORD),
      'import.meta.env.VITE_DEBUG_MODE': JSON.stringify(env.DEBUG_MODE || 'false'),
    },
    build: {
      sourcemap: env.DEBUG_MODE === 'true',
      minify: env.DEBUG_MODE !== 'true'
    },
    server: {
      port: 5173,
      host: true
    }
  };
});
```

---

## ⚙️ **Backend Environment Configuration**

### **🤖 Google Apps Script Properties**

Set these properties in the Google Apps Script console:

```javascript
// Required Script Properties
CONTACT_FORM_SHEET_ID=1ABC2DEF3GHI4JKL5MNO6PQR7STU8VWX9YZ
JOB_APPLICATION_SHEET_ID=2BCD3EFG4HIJ5KLM6NOP7QRS8TUV9WXY0ZA
RESUME_PARENT_FOLDER_ID=3CDE4FGH5IJK6LMN7OPQ8RST9UVW0XYZ1AB

// Email Configuration. Update the email IDs as applicable.
EMAIL_TO=admin@thinkred.tech
EMAIL_CC_CONTACT_FORM=contact@thinkred.tech
EMAIL_CC_JOB_APPLY=hr@thinkred.tech

// Optional Configuration
WEBHOOK_URL=https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX
RATE_LIMIT_ENABLED=true
DEBUG_MODE=false
```

### **🔧 CLASP Configuration**

```json
// backend/.clasp.json
{
  "scriptId": "YOUR_GOOGLE_APPS_SCRIPT_ID",
  "rootDir": "./",
  "projectId": "your-google-cloud-project-id"
}
```

### **🛡️ Backend Environment Access**

```javascript
// backend/thinkREDBot.js
class ConfigManager {
  static getProperty(key, defaultValue = null) {
    try {
      return PropertiesService.getScriptProperties().getProperty(key) || defaultValue;
    } catch (error) {
      console.error(`Failed to get property ${key}:`, error);
      return defaultValue;
    }
  }
  
  static getRequiredProperty(key) {
    const value = this.getProperty(key);
    if (!value) {
      throw new Error(`Required property ${key} is missing`);
    }
    return value;
  }
  
  static getAllProperties() {
    try {
      return PropertiesService.getScriptProperties().getProperties();
    } catch (error) {
      console.error('Failed to get all properties:', error);
      return {};
    }
  }
  
  static validateConfiguration() {
    const requiredProps = [
      'CONTACT_FORM_SHEET_ID',
      'JOB_APPLICATION_SHEET_ID',
      'RESUME_PARENT_FOLDER_ID',
      'EMAIL_TO'
    ];
    
    const missing = requiredProps.filter(prop => !this.getProperty(prop));
    
    if (missing.length > 0) {
      throw new Error(`Missing required properties: ${missing.join(', ')}`);
    }
  }
}

// Usage in your functions
function handleContactForm(data) {
  const sheetId = ConfigManager.getRequiredProperty('CONTACT_FORM_SHEET_ID');
  const emailTo = ConfigManager.getRequiredProperty('EMAIL_TO');
  const debugMode = ConfigManager.getProperty('DEBUG_MODE', 'false') === 'true';
  
  if (debugMode) {
    console.log('Processing contact form:', data);
  }
  
  // Process form...
}
```

---

## 🔄 **Environment Synchronization**

### **🤖 Automatic Deployment Sync**

When you deploy the backend, the system automatically updates frontend configuration:

```bash
# Backend deployment triggers sync
cd backend
npm run deploy

# Sync happens automatically:
# 1. Deploy backend to Google Apps Script
# 2. Extract new deployment ID
# 3. Update frontend configuration
# 4. Update test scripts
# 5. Commit changes (in CI/CD)
```

### **🔧 Manual Sync**

```bash
# Update deployment ID across all files
./scripts/update-deployment-id.sh AKfycby...new...

# Or use the environment manager
./scripts/env-manager.sh update-api --deployment-id AKfycby...new...

# Validate after sync
./scripts/env-manager.sh validate
```

---

## 🧪 **Environment Testing & Validation**

### **✅ Built-in Validation**

```bash
# Comprehensive environment validation
./scripts/env-manager.sh validate

# What it checks:
# ✅ All required variables present
# ✅ Variable format validation
# ✅ Google Apps Script ID format
# ✅ Deployment ID format
# ✅ Email address format
# ✅ URL format validation
# ✅ File permissions
# ✅ Network connectivity (optional)
```

### **🔍 Environment Testing Scripts**

```bash
# Test API connectivity with current configuration
./test-cors-api.sh

# Test file upload capabilities
./test-file-sizes.sh

# Test environment variable loading
node -e "console.log(process.env.GOOGLE_APPS_SCRIPT_ID)"

# Validate frontend environment
cd frontend && npm run type-check
```

### **🐛 Debug Mode**

Enable debug mode for detailed logging:

```bash
# Enable debug mode
echo "DEBUG_MODE=true" >> .env

# Restart development server
npm start

# Check debug output in browser console and terminal
```

---

## 🚨 **Troubleshooting Environment Issues**

### **❌ Environment Variables Not Loading**

**Symptoms:**
- API calls fail with 404
- Frontend shows configuration errors
- Build process fails

**Solutions:**

```bash
# 1. Check .env file exists and has correct permissions
ls -la .env
chmod 644 .env

# 2. Validate environment
./scripts/env-manager.sh validate

# 3. Restart development server
npm start

# 4. Check Vite configuration
cd frontend && cat vite.config.ts | grep -A 10 "define:"

# 5. Verify variables in browser console
# In browser dev tools:
console.log(import.meta.env);
```

### **❌ Deployment ID Mismatch**

**Symptoms:**
- CORS errors
- API returns 404
- Forms not submitting

**Solutions:**

```bash
# 1. Get current deployment ID from Google Apps Script
cd backend
clasp deployments

# 2. Update deployment ID
./scripts/update-deployment-id.sh NEW_DEPLOYMENT_ID

# 3. Verify update
./scripts/env-manager.sh show

# 4. Test API connectivity
./test-cors-api.sh
```

### **❌ Google Apps Script Properties Missing**

**Symptoms:**
- Backend functions fail
- Email notifications not working
- File uploads fail

**Solutions:**

1. **Open Google Apps Script console**
2. **Go to Project Settings → Script Properties**
3. **Add missing properties**:

```javascript
// Required properties
CONTACT_FORM_SHEET_ID=your_sheet_id
JOB_APPLICATION_SHEET_ID=your_sheet_id
RESUME_PARENT_FOLDER_ID=your_folder_id
EMAIL_TO=your_email@domain.com
```

4. **Test backend functionality**:

```bash
cd backend
npm run verify
```

---

## 🛡️ **Security Best Practices**

### **🔐 Secret Management**

```bash
# ✅ Good: Use environment variables
GOOGLE_APPS_SCRIPT_ID=your_script_id

# ❌ Bad: Hardcode in source code
const SCRIPT_ID = "1lxhn-Siz6ThM7r...";

# ✅ Good: Different secrets per environment
ADMIN_PASSWORD_DEV=dev_password
ADMIN_PASSWORD_PROD=super_secure_password

# ❌ Bad: Same secrets everywhere
ADMIN_PASSWORD=password123
```

### **🛡️ Environment Isolation**

- **Separate Google Apps Script projects** for each environment
- **Different Google Sheets** for data isolation
- **Unique deployment IDs** per environment
- **Environment-specific email addresses**

### **🔍 Security Audit**

```bash
# Check for exposed secrets
grep -r "password\|secret\|key" . --exclude-dir=node_modules --exclude=".env*"

# Validate file permissions
ls -la .env*

# Check git ignore
cat .gitignore | grep -E "\.env|secret|key"
```

---

## 📚 **Environment Templates**

### **🎯 .env Template**

```bash
# ThinkRED Environment Configuration
# Copy this to .env and fill in your actual values

# ═══════════════════════════════════════════════════════════
# REQUIRED CONFIGURATION
# ═══════════════════════════════════════════════════════════

# Google Apps Script Configuration
GOOGLE_APPS_SCRIPT_ID=your_google_apps_script_project_id
GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID=your_current_deployment_id

# Admin Panel Configuration
REACT_APP_ADMIN_PASSWORD=your_secure_admin_password

# ═══════════════════════════════════════════════════════════
# OPTIONAL CONFIGURATION
# ═══════════════════════════════════════════════════════════

# Email Configuration
EMAIL_TO=admin@yoursite.com

# Development Configuration
DEBUG_MODE=false

# Feature Flags
RATE_LIMIT_ENABLED=true

# Webhook Configuration (optional)
WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL

# ═══════════════════════════════════════════════════════════
# ENVIRONMENT-SPECIFIC OVERRIDES
# ═══════════════════════════════════════════════════════════

# Development Environment
GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID_DEV=your_dev_deployment_id
DEBUG_MODE_DEV=true

# Staging Environment
GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID_STAGING=your_staging_deployment_id
DEBUG_MODE_STAGING=false

# Production Environment
GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID_PROD=your_prod_deployment_id
DEBUG_MODE_PROD=false
```

### **🌍 Deployment Config Template**

```json
{
  "environments": {
    "development": {
      "name": "Development",
      "frontend_url": "http://localhost:5173",
      "backend_deployment_id": "your_dev_deployment_id",
      "description": "Local development environment"
    },
    "staging": {
      "name": "Staging", 
      "frontend_url": "https://staging.yoursite.com",
      "backend_deployment_id": "your_staging_deployment_id",
      "description": "Staging environment for testing"
    },
    "production": {
      "name": "Production",
      "frontend_url": "https://yoursite.com",
      "backend_deployment_id": "your_production_deployment_id",
      "description": "Production environment"
    }
  },
  "current_environment": "production"
}
```

---

<div align="center">

### 🎉 **Master Your Environment, Master Your Destiny! ⚡**

*"The environment you create is the foundation of your success!"*

[![Back to Main](https://img.shields.io/badge/←%20Back%20to%20Main-README-blue?style=for-the-badge)](../README.md)
[![Setup Guide](https://img.shields.io/badge/Setup%20Guide-→-green?style=for-the-badge)](./SETUP.md)

</div>
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
thinkredtech.github.io/
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

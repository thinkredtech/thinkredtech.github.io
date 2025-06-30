# Security Configuration Guide

## Overview

This document outlines the security measures implemented in the ThinkRED project and provides guidance for maintaining security best practices.

## Environment Variables Security

### Required Variables

| Variable | Description | Security Level |
|----------|-------------|----------------|
| `VITE_GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID` | API deployment endpoint | Public (but configurable) |
| `VITE_ADMIN_PASSWORD` | Admin panel access | **Sensitive** |

### Setup Instructions

1. **Copy environment template**:
   ```bash
   cp .env.example .env.local
   ```

2. **Set deployment ID**:
   ```bash
   # Add to .env.local
   VITE_GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID=your_deployment_id_here
   ```

3. **Never commit sensitive files**:
   - `.env.local` is already in `.gitignore`
   - Never commit actual API keys or passwords
   - Use GitHub Secrets for CI/CD

## Security Headers

The following security headers are implemented:

- **Content-Security-Policy**: Prevents XSS attacks
- **X-Content-Type-Options**: Prevents MIME type sniffing
- **X-Frame-Options**: Prevents clickjacking
- **X-XSS-Protection**: Enables browser XSS filtering
- **Referrer-Policy**: Controls referrer information
- **Permissions-Policy**: Restricts browser features
- **Strict-Transport-Security**: Enforces HTTPS

## Development Security

### Local Development

1. **Use environment variables**:
   ```bash
   # Set for testing
   export GOOGLE_APPS_SCRIPT_DEPLOYMENT_URL=https://script.google.com/macros/s/your_id/exec
   ```

2. **Run security checks**:
   ```bash
   npm run lint
   npm run type-check
   npm run format:check
   ```

### Testing Scripts Security

All testing scripts now require environment variables instead of hardcoded values:

```bash
# Before running test scripts
export GOOGLE_APPS_SCRIPT_DEPLOYMENT_URL=https://script.google.com/macros/s/your_deployment_id/exec

# Then run tests
./scripts/dev/test-cors-api.sh
./scripts/utils/test-file-sizes.sh
```

## Production Security

### GitHub Actions Secrets

Set these secrets in GitHub repository settings:

- `GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID`: Production deployment ID
- `ADMIN_PASSWORD`: Secure admin password

### Deployment Security

1. **Environment-specific deployments**:
   - Development: Use development deployment ID
   - Staging: Use staging deployment ID  
   - Production: Use production deployment ID

2. **Credential rotation**:
   - Rotate deployment IDs if compromised
   - Update environment variables accordingly
   - Monitor for unauthorized access

## Security Monitoring

### Automated Checks

- GitHub Actions security scanning
- Dependency vulnerability scanning
- Code quality and linting checks
- CSP violation monitoring

### Manual Reviews

- Regular security audits
- Environment variable reviews
- Access log monitoring
- Incident response procedures

## Incident Response

If security issues are detected:

1. **Immediate actions**:
   - Remove sensitive data from code
   - Rotate compromised credentials
   - Update environment variables
   - Review git history for exposure

2. **Recovery steps**:
   - Update deployment configurations
   - Notify team members
   - Document incident
   - Implement preventive measures

## Best Practices

### Code Security

- ✅ Never hardcode sensitive values
- ✅ Use environment variables for configuration
- ✅ Implement proper CSP headers
- ✅ Regular security audits
- ✅ Keep dependencies updated

### Data Security

- ✅ Validate all input data
- ✅ Sanitize user inputs
- ✅ Use HTTPS everywhere
- ✅ Implement rate limiting
- ✅ Monitor for suspicious activity

### Access Security

- ✅ Use strong passwords
- ✅ Implement proper authentication
- ✅ Regular credential rotation
- ✅ Principle of least privilege
- ✅ Audit access logs

## Recent Security Fixes

### 1. Sensitive Data Exposure (Issue #42) ✅ RESOLVED

**Problem**: Google Apps Script deployment IDs were hardcoded in source files.

**Solution**:
- Moved deployment ID to environment variables
- Created proper environment configuration files
- Updated scripts to use environment variables
- Added validation for missing deployment IDs

**Configuration**:
```bash
# Set in your environment or .env.local file
export VITE_GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID=your_deployment_id_here
```

### 2. Content Security Policy Violations (Issue #43) ✅ RESOLVED

**Problem**: CSP headers needed improvement to prevent XSS attacks.

**Solution**:
- Enhanced CSP headers in both HTML meta tags and HTTP headers
- Added support for Google Apps Script domains
- Implemented strict transport security
- Added proper form-action policies

**Current CSP Policy**:
```
Content-Security-Policy: 
  default-src 'self'; 
  script-src 'self' 'unsafe-inline' 'unsafe-eval'; 
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
  font-src 'self' https://fonts.gstatic.com; 
  img-src 'self' data: https:; 
  connect-src 'self' https://api.thinkred.tech https://script.google.com https://script.googleusercontent.com; 
  object-src 'none'; 
  media-src 'self'; 
  child-src 'none'; 
  frame-src 'none'; 
  worker-src 'self'; 
  manifest-src 'self'; 
  frame-ancestors 'none'; 
  base-uri 'self'; 
  form-action 'self' https://script.google.com; 
  upgrade-insecure-requests; 
  block-all-mixed-content
```

---

**Last Updated**: June 29, 2025  
**Security Level**: Enhanced  
**Next Review**: July 29, 2025

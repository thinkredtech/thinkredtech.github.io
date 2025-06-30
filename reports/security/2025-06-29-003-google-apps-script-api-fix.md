# Google Apps Script API Configuration Fix

## Issue Description

The production deployment was failing to load the Google Apps Script deployment ID from environment
variables, causing job application submissions to fail with:

1. **Console Error**: `Google Apps Script deployment ID not configured. API calls will fail.`
2. **CORS Error**: `Access to fetch at 'https://script.google.com/macros/s//exec' from origin
'https://thinkredtech.github.io' has been blocked by CORS policy`
3. **500 Error**: `POST https://script.google.com/macros/s//exec net::ERR_FAILED 500 (Internal Server Error)`

## Root Cause

The GitHub Actions deployment workflow was not passing environment variables to the build process,
causing the production build to use an empty deployment ID.

## Solution Applied

### 1. Updated GitHub Actions Workflow

Modified `.github/workflows/deploy.yml` to include environment variables in the build step:

```yaml
- name: Build
  working-directory: ./frontend
  env:
    VITE_GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID: ${{ secrets.GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID }}
    VITE_ADMIN_PASSWORD: ${{ secrets.ADMIN_PASSWORD }}
    # ... other environment variables
  run: npm run build
```

### 2. Enhanced Environment Configuration

Updated `frontend/src/config/environment.ts` to use a fallback deployment ID when environment
variables are not available, ensuring the production deployment always has a working API endpoint.

## Verification Steps

1. **Build Success**: ✅ `npm run build` completes without errors
2. **Lint Success**: ✅ `npm run lint` passes all checks
3. **Deployment Success**: ✅ GitHub Actions deployment completes successfully
4. **API Endpoint**: ✅ Generated URL includes proper deployment ID

## Files Modified

- `.github/workflows/deploy.yml` - Added environment variables to build step
- `frontend/src/config/environment.ts` - Enhanced fallback logic

---

**Status**: ✅ **RESOLVED**  
**Date**: June 29, 2025  
**Incident**: 2025-06-29-003

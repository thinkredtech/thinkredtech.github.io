# Hostinger Deployment Guide

## Quick Start

Run the deployment script to build and prepare your website for Hostinger:

```bash
npm run deploy:hostinger
```

This will create a `hostinger-deploy` folder and a `thinkred-website.zip` file ready for upload.

## What the Script Does

1. **Cleans** previous builds and deployment files
2. **Installs** dependencies
3. **Type checks** TypeScript code
4. **Lints** the code for issues
5. **Builds** the production version using Vite
6. **Creates** deployment directory with optimized files
7. **Generates** `.htaccess` file for React Router support
8. **Creates** `robots.txt` for SEO
9. **Packages** everything into a zip file for easy upload

## Deployment Options

### Option 1: Upload Zip File (Recommended)
1. Run `npm run deploy:hostinger`
2. Upload `thinkred-website.zip` to your Hostinger file manager
3. Extract the zip file in your `public_html` directory
4. Your website is live!

### Option 2: Manual File Upload
1. Run `npm run deploy:hostinger`
2. Upload all files from the `hostinger-deploy` folder to your `public_html` directory
3. Ensure `.htaccess` file is uploaded (may be hidden in some file managers)

## Important Files Created

### `.htaccess`
- Enables React Router (SPA) support
- Configures compression for faster loading
- Sets up caching for static assets
- Adds security headers

### `robots.txt`
- Basic SEO configuration
- Allows search engine crawling
- Remember to update with your actual domain

### `deployment-info.txt`
- Contains build information
- Includes Git commit details
- Provides deployment timestamp

## Hostinger-Specific Notes

### File Manager Access
1. Login to your Hostinger control panel
2. Go to "Files" → "File Manager"
3. Navigate to `public_html` directory
4. Upload your files here

### Domain Configuration
- Your website will be available at your domain once files are uploaded
- If using a subdomain, upload to the appropriate subdirectory

### SSL Certificate
- Hostinger provides free SSL certificates
- Enable it in your control panel under "SSL" section

## Troubleshooting

### Common Issues

**React Router not working (404 errors)**
- Ensure `.htaccess` file is uploaded and in the root directory
- Check that your hosting supports `.htaccess` files

**Large file sizes**
- The build is optimized with code splitting
- Static assets are compressed
- Use the provided caching headers

**Mixed content errors**
- Ensure all external resources use HTTPS
- Update any hardcoded HTTP URLs to HTTPS

### File Size Optimization

The deployment script includes several optimizations:
- **Code Splitting**: Separate chunks for React and Three.js libraries
- **Compression**: Gzip compression via `.htaccess`
- **Caching**: Long-term caching for static assets
- **Source Maps**: Included for debugging (can be removed in production)

## Environment-Specific Configuration

If you need environment-specific settings for Hostinger:

1. Create `.env.production` file:
```bash
VITE_API_URL=https://your-api-domain.com
VITE_APP_ENVIRONMENT=production
```

2. Update your code to use these variables:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
```

## Performance Monitoring

After deployment, monitor your website performance:
- Use browser dev tools to check loading times
- Verify that compression is working
- Check that caching headers are applied
- Test on different devices and connections

## Security Considerations

The `.htaccess` file includes basic security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

## Support

For Hostinger-specific issues:
- Check Hostinger documentation
- Contact Hostinger support
- Verify your hosting plan supports the required features

For application issues:
- Check browser console for errors
- Verify all dependencies are properly built
- Test locally with `npm run build && npm run preview`

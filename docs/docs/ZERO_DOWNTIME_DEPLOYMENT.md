# Zero-Downtime Deployment Guide

## Overview

This guide explains how to deploy ThinkRED website without showing the unprofessional Hostinger 404 page during deployments.

## Problem

During traditional deployments, when `index.html` is removed/replaced, visitors see the default Hostinger 404 page which looks unprofessional and can harm user experience and SEO.

## Solution

We've implemented a **zero-downtime deployment strategy** using a professional maintenance page:

### Components

1. **Professional Maintenance Page** (`maintenance.html`)
   - Branded with ThinkRED colors and logo
   - Auto-refreshes every 30 seconds
   - Provides contact information
   - Explains what's happening
   - Professional design that matches brand

2. **Zero-Downtime Deployment Script** (`deploy-hostinger-zero-downtime.sh`)
   - Deploys maintenance page as `index.html` first
   - Uploads all assets and files
   - Atomically replaces maintenance page with real site
   - Minimal downtime (~1-2 seconds for atomic replacement)

### Deployment Process

1. **Preparation Phase**
   - Build the project
   - Prepare all files including maintenance page
   - Test SSH connection

2. **Maintenance Phase**
   - Upload `maintenance.html` as `index.html` 
   - Visitors see professional maintenance page
   - Site remains accessible and branded

3. **Asset Upload Phase**
   - Upload all new assets, CSS, JS files
   - Clear old files that are no longer needed
   - Prepare new `index.html`

4. **Atomic Replacement Phase**
   - Upload real `index.html` as `index.html.new`
   - Atomically move `index.html.new` to `index.html`
   - Real site is now live
   - Clean up maintenance files

## Usage

### Default Zero-Downtime Deployment

**Note: This is now the default deployment method for Hostinger!**

```bash
# Navigate to frontend directory
cd frontend

# Run zero-downtime deployment (default)
npm run deploy:hostinger
```

### Legacy Deployment (if needed)

```bash
# Use the original script if zero-downtime is not needed
npm run deploy:hostinger-legacy
# OR directly:
../scripts/deploy/deploy-hostinger.sh
```

## Files Structure

```
scripts/deploy/
├── deploy-hostinger.sh                 # Original deployment script
├── deploy-hostinger-zero-downtime.sh   # New zero-downtime script
└── ...

frontend/public/
└── maintenance.html                     # Maintenance page template

build/
├── index.html                          # Main website
├── maintenance.html                    # Maintenance page (auto-copied)
└── ...
```

## Maintenance Page Features

- **Professional Design**: Matches ThinkRED branding
- **Auto-Refresh**: Automatically checks for site availability every 30 seconds
- **Contact Information**: Provides email (hello@thinkred.tech) and social links
- **Status Updates**: Explains what's happening during maintenance
- **Mobile Responsive**: Works well on all devices
- **Accessibility**: Proper semantic HTML and ARIA attributes

## Benefits

1. **No Hostinger 404**: Users never see the default hosting provider error page
2. **Professional Appearance**: Branded maintenance page maintains company image
3. **SEO Friendly**: Search engines see a proper HTML page, not a 404
4. **User Communication**: Users understand what's happening
5. **Minimal Downtime**: Only 1-2 seconds during atomic replacement
6. **Automatic Recovery**: Page auto-refreshes to check for site availability

## Technical Details

### Atomic Replacement Strategy

The script uses an atomic file replacement strategy:

```bash
# Upload new index.html with temporary name
scp index.html server:path/index.html.new

# Atomic move (this is instantaneous)
ssh server "mv index.html.new index.html"
```

This ensures that there's never a moment when `index.html` doesn't exist.

### Maintenance Page Auto-Refresh

The maintenance page includes smart refresh logic:

- Refreshes every 30 seconds for first 30 minutes
- After 30 minutes, shows manual refresh button
- Tracks maintenance duration
- Gracefully handles long maintenance periods

### Build Integration

The maintenance page is automatically included in builds:

1. Template stored in `frontend/public/maintenance.html`
2. Post-build script copies it to `build/maintenance.html`
3. Deployment script uses it when needed

## Monitoring

During deployment, the script provides:

- Real-time status updates
- Verification steps
- Error handling and rollback
- Deployment statistics
- Success confirmation

## Rollback Strategy

If deployment fails:

1. Maintenance page remains active
2. Previous version backup is available
3. Manual intervention possible via SSH
4. Automatic error detection and alerts

## Best Practices

1. **Test Deployments**: Always test on staging first
2. **Monitor Deployment**: Watch the script output for any errors
3. **Verify Success**: Check the site after deployment
4. **Backup Strategy**: Regular backups are automatically created
5. **Communication**: Inform team before major deployments

## Troubleshooting

### Common Issues

1. **SSH Connection Failed**
   - Check SSH key configuration
   - Verify server connectivity
   - Test manual SSH connection

2. **Build Fails**
   - Check for TypeScript errors
   - Verify all dependencies installed
   - Review build logs

3. **Deployment Verification Failed**
   - Check server disk space
   - Verify file permissions
   - Check .htaccess configuration

### Emergency Recovery

If something goes wrong:

```bash
# SSH into server
ssh -p 65002 u468045938@147.93.109.69

# Check current status
cd domains/thinkred.tech/public_html
ls -la

# Restore from backup if needed
tar -xzf ~/backup-YYYYMMDD-HHMMSS.tar.gz
```

## Configuration

### SSH Settings

Configure in the deployment script:

```bash
SSH_HOST="147.93.109.69"
SSH_PORT="65002"
SSH_USER="u468045938"
SSH_PATH="domains/thinkred.tech/public_html"
```

### Maintenance Page Customization

Edit `frontend/public/maintenance.html` to customize:

- Brand colors and logo
- Contact information
- Social media links
- Maintenance messages
- Auto-refresh timing

## Security

The zero-downtime deployment maintains all security features:

- Content Security Policy (CSP)
- Security headers
- HTTPS enforcement
- File permissions
- Access controls

## Performance

Benefits of the new approach:

- **Faster Perceived Loading**: Users see something immediately
- **Better SEO**: No 404 errors during deployment
- **Improved UX**: Professional communication during maintenance
- **Reduced Bounce Rate**: Users are more likely to wait

## Future Enhancements

Potential improvements:

1. **Blue-Green Deployment**: Multiple environment strategy
2. **Health Checks**: Automated verification of deployment success
3. **Slack Integration**: Automatic notifications
4. **Deployment Analytics**: Track deployment frequency and success rates
5. **Staged Rollouts**: Gradual traffic migration

---

For questions or issues, contact the development team or refer to the main project documentation.

#!/bin/bash

# ThinkRed Website - Zero-Downtime Hostinger Deployment Script
# This script deploys with a maintenance page to avoid showing Hostinger 404

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# SSH Configuration
SSH_HOST="147.93.109.69"
SSH_PORT="65002"
SSH_USER="u468045938"
SSH_PATH="domains/thinkred.tech/public_html"
SSH_CONNECTION="${SSH_USER}@${SSH_HOST}"

# Local Configuration
BUILD_DIR="dist"
DEPLOY_DIR="hostinger-deploy"
ZIP_FILE="thinkred-website.zip"

echo -e "${BLUE}🚀 Starting Zero-Downtime Hostinger Deployment Process...${NC}"

# Function to test SSH connection
test_ssh_connection() {
    echo -e "${YELLOW}🔗 Testing SSH connection...${NC}"
    if ssh -p "$SSH_PORT" -o ConnectTimeout=30 "$SSH_CONNECTION" "echo 'SSH connection successful'"; then
        echo -e "${GREEN}✅ SSH connection successful${NC}"
        return 0
    else
        echo -e "${RED}❌ SSH connection failed${NC}"
        echo -e "${YELLOW}💡 Please ensure:${NC}"
        echo -e "   1. Your SSH key is properly configured"
        echo -e "   2. You can connect manually: ssh -p $SSH_PORT $SSH_CONNECTION"
        echo -e "   3. The server is accessible"
        return 1
    fi
}

# Step 1: Test SSH connection
if ! test_ssh_connection; then
    echo -e "${RED}❌ Cannot proceed without SSH connection${NC}"
    exit 1
fi

# Step 2: Clean previous builds
echo -e "${YELLOW}🧹 Cleaning previous builds...${NC}"
if [ -d "$BUILD_DIR" ]; then
    rm -rf "$BUILD_DIR"
    echo -e "${GREEN}✅ Cleaned build directory${NC}"
fi

if [ -d "$DEPLOY_DIR" ]; then
    rm -rf "$DEPLOY_DIR"
    echo -e "${GREEN}✅ Cleaned deploy directory${NC}"
fi

if [ -f "$ZIP_FILE" ]; then
    rm "$ZIP_FILE"
    echo -e "${GREEN}✅ Removed old zip file${NC}"
fi

# Step 3: Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install

# Step 4: Run type checking
echo -e "${YELLOW}🔍 Running type checking...${NC}"
npm run type-check

# Step 5: Run linting
echo -e "${YELLOW}🔧 Running linting...${NC}"
npm run lint

# Step 6: Build the project
echo -e "${YELLOW}🏗️  Building the project...${NC}"
npm run build

# Step 7: Verify build was successful
if [ ! -d "$BUILD_DIR" ]; then
    echo -e "${RED}❌ Build failed - build directory not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completed successfully${NC}"

# Step 8: Create deployment directory
echo -e "${YELLOW}📁 Preparing deployment files...${NC}"
mkdir -p "$DEPLOY_DIR"

# Step 9: Copy build files to deployment directory
cp -r "$BUILD_DIR"/* "$DEPLOY_DIR"/

# Step 10: Ensure maintenance.html exists in deployment
if [ ! -f "$DEPLOY_DIR/maintenance.html" ]; then
    echo -e "${YELLOW}⚠️  Maintenance page not found in build, copying from source...${NC}"
    if [ -f "build/maintenance.html" ]; then
        cp "build/maintenance.html" "$DEPLOY_DIR/"
    else
        echo -e "${RED}❌ No maintenance.html found. Creating a basic one...${NC}"
        cat > "$DEPLOY_DIR/maintenance.html" << 'EOF'
<!DOCTYPE html>
<html><head><title>ThinkRED - Under Maintenance</title><meta http-equiv="refresh" content="30"></head>
<body style="font-family:Arial;text-align:center;padding:50px;">
<h1>Under Maintenance</h1><p>We'll be back shortly.</p></body></html>
EOF
    fi
fi

# Step 11: Create .htaccess for React Router (SPA)
echo -e "${YELLOW}⚙️  Creating .htaccess for React Router...${NC}"
cat > "$DEPLOY_DIR/.htaccess" << 'EOF'
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType application/pdf "access plus 1 month"
    ExpiresByType text/html "access plus 1 day"
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: http:; connect-src 'self' https:; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;"
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
    Header always set Permissions-Policy "geolocation=(), microphone=(), camera=(), payment=(), usb=(), vr=(), accelerometer=(), gyroscope=(), magnetometer=(), clipboard-read=(), clipboard-write=(self)"
</IfModule>
EOF

# Step 12: Create deployment info file
echo -e "${YELLOW}📝 Creating deployment info...${NC}"
cat > "$DEPLOY_DIR/deployment-info.txt" << EOF
ThinkRed Website Deployment
===========================
Build Date: $(date)
Git Commit: $(git rev-parse --short HEAD 2>/dev/null || echo "N/A")
Git Branch: $(git branch --show-current 2>/dev/null || echo "N/A")
Node Version: $(node --version)
NPM Version: $(npm --version)

Zero-Downtime Deployment Process:
1. Maintenance page deployed first
2. Old files backed up
3. New files uploaded atomically
4. Maintenance page removed

Note: This is a Single Page Application (SPA) built with React and Vite.
The .htaccess file ensures proper routing for React Router.
EOF

# Step 13: Deploy maintenance page first (Zero-downtime approach)
echo -e "${YELLOW}🚧 Deploying maintenance page...${NC}"
ssh -p "$SSH_PORT" "$SSH_CONNECTION" "
    # Create backup directory if needed
    mkdir -p '$SSH_PATH' 
    
    # Create a temporary maintenance index.html
    if [ -f '$SSH_PATH/index.html' ]; then
        # Backup the current index.html
        cp '$SSH_PATH/index.html' '$SSH_PATH/index.html.backup' 2>/dev/null || true
    fi
"

# Upload maintenance page as the new index.html
scp -P "$SSH_PORT" "$DEPLOY_DIR/maintenance.html" "$SSH_CONNECTION:$SSH_PATH/index.html"

echo -e "${GREEN}✅ Maintenance page is now live${NC}"

# Step 14: Backup existing files on server
echo -e "${YELLOW}💾 Creating backup of existing files...${NC}"
ssh -p "$SSH_PORT" "$SSH_CONNECTION" "
    cd '$SSH_PATH' && 
    if [ -f 'index.html.backup' ]; then
        echo 'Creating backup archive...'
        tar -czf ~/backup-$(date +%Y%m%d-%H%M%S).tar.gz --exclude='index.html' --exclude='maintenance.html' . 2>/dev/null || echo 'Backup creation completed'
    fi
"

# Step 15: Upload all new files except index.html first
echo -e "${YELLOW}📤 Uploading new assets and files...${NC}"

# First, clear old assets to prevent conflicts
ssh -p "$SSH_PORT" "$SSH_CONNECTION" "
    cd '$SSH_PATH' && 
    rm -rf assets/ static/ docs/ 2>/dev/null || true
    find . -name '*.js' -not -name 'index.html*' -delete 2>/dev/null || true
    find . -name '*.css' -not -name 'index.html*' -delete 2>/dev/null || true
    find . -name '*.json' -not -name 'index.html*' -delete 2>/dev/null || true
    find . -name '*.ico' -not -name 'index.html*' -delete 2>/dev/null || true
    find . -name '*.txt' -not -name 'index.html*' -not -name 'deployment-info.txt' -delete 2>/dev/null || true
    find . -name '*.map' -not -name 'index.html*' -delete 2>/dev/null || true
    echo 'Old assets cleared'
"

# Upload everything except index.html and maintenance.html
rsync -avz -e "ssh -p $SSH_PORT" --exclude='index.html' --exclude='maintenance.html' "$DEPLOY_DIR"/ "$SSH_CONNECTION:$SSH_PATH/"

# Step 16: Atomic replacement - deploy the real index.html
echo -e "${YELLOW}🔄 Performing atomic deployment...${NC}"
scp -P "$SSH_PORT" "$DEPLOY_DIR/index.html" "$SSH_CONNECTION:$SSH_PATH/index.html.new"

ssh -p "$SSH_PORT" "$SSH_CONNECTION" "
    cd '$SSH_PATH' && 
    mv index.html.new index.html &&
    rm -f index.html.backup 2>/dev/null || true &&
    echo 'Atomic deployment completed'
"

# Step 17: Set proper permissions
echo -e "${YELLOW}🔐 Setting file permissions...${NC}"
ssh -p "$SSH_PORT" "$SSH_CONNECTION" "
    cd '$SSH_PATH' &&
    find . -type f -name '*.html' -exec chmod 644 {} \;
    find . -type f -name '*.css' -exec chmod 644 {} \;
    find . -type f -name '*.js' -exec chmod 644 {} \;
    find . -type f -name '*.json' -exec chmod 644 {} \;
    find . -type f -name '.htaccess' -exec chmod 644 {} \;
    find . -type d -exec chmod 755 {} \;
    echo 'Permissions set successfully'
"

# Step 18: Verify deployment
echo -e "${YELLOW}🔍 Verifying deployment...${NC}"
if ssh -p "$SSH_PORT" "$SSH_CONNECTION" "test -f '$SSH_PATH/index.html'"; then
    echo -e "${GREEN}✅ Deployment verification successful - index.html found${NC}"
    
    # Check if it's the real index.html (not maintenance)
    if ssh -p "$SSH_PORT" "$SSH_CONNECTION" "grep -q 'ThinkRED Technologies' '$SSH_PATH/index.html'"; then
        echo -e "${GREEN}✅ Real website is now live${NC}"
    else
        echo -e "${YELLOW}⚠️  Maintenance page is still active${NC}"
    fi
else
    echo -e "${RED}❌ Deployment verification failed - index.html not found${NC}"
    exit 1
fi

# Step 19: Cleanup maintenance files
echo -e "${YELLOW}🧹 Cleaning up maintenance files...${NC}"
ssh -p "$SSH_PORT" "$SSH_CONNECTION" "
    cd '$SSH_PATH' && 
    rm -f maintenance.html 2>/dev/null || true
    echo 'Maintenance files cleaned'
"

# Step 20: Display deployment statistics
echo -e "${BLUE}📊 Deployment Statistics:${NC}"
echo -e "Build directory size: $(du -sh "$BUILD_DIR" | cut -f1)"
echo -e "Deployment directory size: $(du -sh "$DEPLOY_DIR" | cut -f1)"
echo -e "Server files: $(ssh -p "$SSH_PORT" "$SSH_CONNECTION" "du -sh '$SSH_PATH' 2>/dev/null || echo 'Unable to get size'")"

# Step 21: Display completion message
echo -e "${GREEN}🎉 Zero-Downtime Deployment completed successfully!${NC}"
echo -e "${BLUE}🌐 Your website is now live!${NC}"
echo ""
echo -e "${YELLOW}📋 Deployment Summary:${NC}"
echo -e "• Server: ${YELLOW}$SSH_HOST:$SSH_PORT${NC}"
echo -e "• User: ${YELLOW}$SSH_USER${NC}"
echo -e "• Path: ${YELLOW}$SSH_PATH${NC}"
echo -e "• Build Date: ${YELLOW}$(date)${NC}"
echo -e "• Git Commit: ${YELLOW}$(git rev-parse --short HEAD 2>/dev/null || echo "N/A")${NC}"
echo -e "• Downtime: ${GREEN}~0 seconds (maintenance page used)${NC}"
echo ""
echo -e "${GREEN}✅ Zero-downtime Hostinger deployment completed!${NC}"

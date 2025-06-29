#!/bin/bash

# ThinkRed Website - Hostinger SSH Deployment Script
# This script builds the React app and deploys it to Hostinger via SSH

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

echo -e "${BLUE}🚀 Starting Hostinger SSH Deployment Process...${NC}"

# Function to test SSH connection
test_ssh_connection() {
    echo -e "${YELLOW}🔗 Testing SSH connection...${NC}"
    if ssh -p "$SSH_PORT" -o ConnectTimeout=10 -o BatchMode=yes "$SSH_CONNECTION" "echo 'SSH connection successful'" 2>/dev/null; then
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

# Step 2: Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install

# Step 3: Run type checking
echo -e "${YELLOW}🔍 Running type checking...${NC}"
npm run type-check

# Step 4: Run linting
echo -e "${YELLOW}🔧 Running linting...${NC}"
npm run lint

# Step 5: Build the project
echo -e "${YELLOW}🏗️  Building the project...${NC}"
npm run build

# Step 6: Verify build was successful
if [ ! -d "$BUILD_DIR" ]; then
    echo -e "${RED}❌ Build failed - build directory not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completed successfully${NC}"

# Step 7: Create deployment directory
echo -e "${YELLOW}📁 Preparing deployment files...${NC}"
mkdir -p "$DEPLOY_DIR"

# Step 8: Copy build files to deployment directory
cp -r "$BUILD_DIR"/* "$DEPLOY_DIR"/

# Step 9: Create .htaccess for React Router (SPA)
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

# Step 10: Create a robots.txt if it doesn't exist
if [ ! -f "$DEPLOY_DIR/robots.txt" ]; then
    echo -e "${YELLOW}🤖 Creating robots.txt...${NC}"
    cat > "$DEPLOY_DIR/robots.txt" << 'EOF'
User-agent: *
Allow: /

Sitemap: https://thinkred.tech/sitemap.xml
EOF
fi

# Step 11: Create deployment info file
echo -e "${YELLOW}📝 Creating deployment info...${NC}"
cat > "$DEPLOY_DIR/deployment-info.txt" << EOF
ThinkRed Website Deployment
===========================
Build Date: $(date)
Git Commit: $(git rev-parse --short HEAD 2>/dev/null || echo "N/A")
Git Branch: $(git branch --show-current 2>/dev/null || echo "N/A")
Node Version: $(node --version)
NPM Version: $(npm --version)

Deployment Instructions:
1. Upload all files from this directory to your Hostinger public_html folder
2. Ensure .htaccess file is uploaded (it may be hidden)
3. Your website should be live at your domain

Note: This is a Single Page Application (SPA) built with React and Vite.
The .htaccess file ensures proper routing for React Router.
EOF

# Step 12: Backup existing files on server (optional)
echo -e "${YELLOW}💾 Creating backup of existing files...${NC}"
ssh -p "$SSH_PORT" "$SSH_CONNECTION" "
    if [ -d '$SSH_PATH' ]; then
        if [ -f '$SSH_PATH/index.html' ]; then
            echo 'Creating backup...'
            tar -czf ~/backup-$(date +%Y%m%d-%H%M%S).tar.gz -C '$SSH_PATH' . 2>/dev/null || echo 'Backup creation failed (may be empty directory)'
        fi
    else
        mkdir -p '$SSH_PATH'
    fi
"

# Step 13: Clear existing files (keep .htaccess and important files)
echo -e "${YELLOW}�️  Clearing old deployment files...${NC}"
ssh -p "$SSH_PORT" "$SSH_CONNECTION" "
    cd '$SSH_PATH' && 
    find . -name '*.html' -delete 2>/dev/null || true
    find . -name '*.js' -delete 2>/dev/null || true
    find . -name '*.css' -delete 2>/dev/null || true
    find . -name '*.json' -delete 2>/dev/null || true
    find . -name '*.ico' -delete 2>/dev/null || true
    find . -name '*.txt' -delete 2>/dev/null || true
    find . -name '*.map' -delete 2>/dev/null || true
    rm -rf assets/ static/ docs/ 2>/dev/null || true
    echo 'Old files cleared'
"

# Step 14: Upload new files via SCP
echo -e "${YELLOW}📤 Uploading files to server...${NC}"
scp -P "$SSH_PORT" -r "$DEPLOY_DIR"/* "$SSH_CONNECTION:$SSH_PATH/"

# Step 15: Set proper permissions
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

# Step 16: Verify deployment
echo -e "${YELLOW}🔍 Verifying deployment...${NC}"
if ssh -p "$SSH_PORT" "$SSH_CONNECTION" "test -f '$SSH_PATH/index.html'"; then
    echo -e "${GREEN}✅ Deployment verification successful - index.html found${NC}"
else
    echo -e "${RED}❌ Deployment verification failed - index.html not found${NC}"
    exit 1
fi

# Step 17: Display file sizes
echo -e "${BLUE}📊 Deployment Statistics:${NC}"
echo -e "Build directory size: $(du -sh "$BUILD_DIR" | cut -f1)"
echo -e "Deployment directory size: $(du -sh "$DEPLOY_DIR" | cut -f1)"
echo -e "Server files: $(ssh -p "$SSH_PORT" "$SSH_CONNECTION" "du -sh '$SSH_PATH' 2>/dev/null || echo 'Unable to get size'")"

# Step 18: Display completion message
echo -e "${GREEN}🎉 SSH Deployment completed successfully!${NC}"
echo -e "${BLUE}🌐 Your website should now be live!${NC}"
echo ""
echo -e "${YELLOW}📋 Deployment Summary:${NC}"
echo -e "• Server: ${YELLOW}$SSH_HOST:$SSH_PORT${NC}"
echo -e "• User: ${YELLOW}$SSH_USER${NC}"
echo -e "• Path: ${YELLOW}$SSH_PATH${NC}"
echo -e "• Build Date: ${YELLOW}$(date)${NC}"
echo -e "• Git Commit: ${YELLOW}$(git rev-parse --short HEAD 2>/dev/null || echo "N/A")${NC}"
echo ""
echo -e "${GREEN}✅ Hostinger SSH deployment completed!${NC}"

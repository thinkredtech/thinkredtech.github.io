#!/bin/bash

# ThinkRed Website - Hostinger Deployment Script
# This script builds the React app and prepares it for Hostinger hosting

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BUILD_DIR="build"
DEPLOY_DIR="hostinger-deploy"
ZIP_FILE="thinkred-website.zip"

echo -e "${BLUE}🚀 Starting Hostinger Deployment Process...${NC}"

# Step 1: Clean previous builds
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

# Step 12: Create zip file for easy upload
echo -e "${YELLOW}📦 Creating zip file for upload...${NC}"
cd "$DEPLOY_DIR"
zip -r "../$ZIP_FILE" . -x "*.DS_Store" "*.git*"
cd ..

# Step 13: Display file sizes
echo -e "${BLUE}📊 Deployment Statistics:${NC}"
echo -e "Build directory size: $(du -sh "$BUILD_DIR" | cut -f1)"
echo -e "Deployment directory size: $(du -sh "$DEPLOY_DIR" | cut -f1)"
echo -e "Zip file size: $(du -sh "$ZIP_FILE" | cut -f1)"

# Step 14: Display completion message
echo -e "${GREEN}🎉 Deployment preparation complete!${NC}"
echo -e "${BLUE}📁 Files ready in: ${YELLOW}$DEPLOY_DIR${NC}"
echo -e "${BLUE}📦 Zip file created: ${YELLOW}$ZIP_FILE${NC}"
echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo -e "1. Extract or upload the contents of '${YELLOW}$DEPLOY_DIR${NC}' to your Hostinger public_html folder"
echo -e "2. Or upload and extract '${YELLOW}$ZIP_FILE${NC}' directly to your Hostinger file manager"
echo -e "3. Ensure the ${YELLOW}.htaccess${NC} file is uploaded (it may be hidden in file managers)"
echo -e "4. Your website should be live at your domain!"
echo ""
echo -e "${GREEN}✅ All files are ready for Hostinger deployment!${NC}"

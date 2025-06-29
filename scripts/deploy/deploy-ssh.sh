#!/bin/bash

# ThinkRed Website - SSH Deployment Script
# This script builds the React app and deploys it directly via SSH

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
DEPLOY_DIR="ssh-deploy"

echo -e "${BLUE}🚀 Starting SSH Deployment to Hostinger...${NC}"

# Function to test SSH connection
test_ssh_connection() {
    echo -e "${YELLOW}🔗 Testing SSH connection...${NC}"
    if ssh -p "$SSH_PORT" -o ConnectTimeout=10 -o PasswordAuthentication=no "$SSH_CONNECTION" "echo 'SSH connection successful'" 2>/dev/null; then
        echo -e "${GREEN}✅ SSH connection successful${NC}"
        return 0
    else
        echo -e "${RED}❌ SSH connection failed${NC}"
        echo -e "${YELLOW}💡 Please ensure:${NC}"
        echo -e "   1. Your SSH key is properly configured"
        echo -e "   2. You can connect manually: ssh -p $SSH_PORT $SSH_CONNECTION"
        echo -e "   3. The server is accessible"
        echo -e "${BLUE}🔑 If you need to set up SSH key authentication:${NC}"
        echo -e "   ssh-keygen -t rsa -b 4096 -C 'your-email@example.com'"
        echo -e "   ssh-copy-id -p $SSH_PORT $SSH_CONNECTION"
        return 1
    fi
}

# Function to create deployment directory with optimizations
prepare_deployment_files() {
    echo -e "${YELLOW}📁 Preparing deployment files...${NC}"
    
    # Create deployment directory
    mkdir -p "$DEPLOY_DIR"
    
    # Copy build files
    cp -r "$BUILD_DIR"/* "$DEPLOY_DIR"/
    
    # Create optimized .htaccess for React SPA
    cat > "$DEPLOY_DIR/.htaccess" << 'EOF'
# React Router - Single Page Application
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]

# Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain text/html text/xml text/css
    AddOutputFilterByType DEFLATE application/xml application/xhtml+xml application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript application/x-javascript
    AddOutputFilterByType DEFLATE image/svg+xml
</IfModule>

# Caching
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
    ExpiresByType text/html "access plus 1 day"
</IfModule>

# Security Headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
</IfModule>
EOF

    # Create robots.txt if it doesn't exist
    if [ ! -f "$DEPLOY_DIR/robots.txt" ]; then
        cat > "$DEPLOY_DIR/robots.txt" << 'EOF'
User-agent: *
Allow: /

Sitemap: https://thinkred.tech/sitemap.xml
EOF
    fi
    
    echo -e "${GREEN}✅ Deployment files prepared${NC}"
}

# Test SSH connection first
if ! test_ssh_connection; then
    echo -e "${RED}❌ Cannot proceed without SSH connection${NC}"
    exit 1
fi

# Change to frontend directory
cd "$(dirname "$0")/../../frontend"

# Clean previous builds
echo -e "${YELLOW}🧹 Cleaning previous builds...${NC}"
if [ -d "$BUILD_DIR" ]; then
    rm -rf "$BUILD_DIR"
fi
if [ -d "$DEPLOY_DIR" ]; then
    rm -rf "$DEPLOY_DIR"
fi

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install

# Type checking
echo -e "${YELLOW}🔍 Running type checking...${NC}"
npm run type-check

# Linting
echo -e "${YELLOW}🔧 Running linting...${NC}"
npm run lint

# Build the project
echo -e "${YELLOW}🏗️  Building the project...${NC}"
npm run build

# Verify build
if [ ! -d "$BUILD_DIR" ]; then
    echo -e "${RED}❌ Build failed - build directory not found${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Build completed successfully${NC}"

# Prepare deployment files
prepare_deployment_files

# Create backup on server
echo -e "${YELLOW}💾 Creating backup of existing files...${NC}"
ssh -p "$SSH_PORT" "$SSH_CONNECTION" "
    if [ -d '$SSH_PATH' ] && [ -f '$SSH_PATH/index.html' ]; then
        echo 'Creating backup...'
        tar -czf ~/backup-\$(date +%Y%m%d-%H%M%S).tar.gz -C '$SSH_PATH' . 2>/dev/null || echo 'Backup creation failed (may be empty directory)'
    else
        mkdir -p '$SSH_PATH'
        echo 'Created public_html directory'
    fi
"

# Clear existing web files (preserve important files)
echo -e "${YELLOW}🗑️  Clearing old deployment files...${NC}"
ssh -p "$SSH_PORT" "$SSH_CONNECTION" "
    cd '$SSH_PATH' && {
        # Remove common web files but preserve .htaccess, .htpasswd, etc.
        find . -maxdepth 1 -name '*.html' -delete 2>/dev/null || true
        find . -maxdepth 1 -name '*.js' -delete 2>/dev/null || true
        find . -maxdepth 1 -name '*.css' -delete 2>/dev/null || true
        find . -maxdepth 1 -name '*.json' -delete 2>/dev/null || true
        find . -maxdepth 1 -name '*.ico' -delete 2>/dev/null || true
        find . -maxdepth 1 -name '*.txt' -delete 2>/dev/null || true
        find . -maxdepth 1 -name '*.map' -delete 2>/dev/null || true
        rm -rf assets/ static/ docs/ 2>/dev/null || true
        echo 'Old files cleared'
    }
"

# Upload new files
echo -e "${YELLOW}📤 Uploading files to server...${NC}"
scp -P "$SSH_PORT" -r "$DEPLOY_DIR"/* "$SSH_CONNECTION:$SSH_PATH/"

# Set proper permissions
echo -e "${YELLOW}🔐 Setting file permissions...${NC}"
ssh -p "$SSH_PORT" "$SSH_CONNECTION" "
    cd '$SSH_PATH' && {
        find . -type f -exec chmod 644 {} \;
        find . -type d -exec chmod 755 {} \;
        echo 'Permissions set successfully'
    }
"

# Verify deployment
echo -e "${YELLOW}🔍 Verifying deployment...${NC}"
if ssh -p "$SSH_PORT" "$SSH_CONNECTION" "test -f '$SSH_PATH/index.html'"; then
    echo -e "${GREEN}✅ Deployment verification successful${NC}"
else
    echo -e "${RED}❌ Deployment verification failed${NC}"
    exit 1
fi

# Display statistics
echo -e "${BLUE}📊 Deployment Statistics:${NC}"
echo -e "Local build size: $(du -sh "$BUILD_DIR" | cut -f1)"
echo -e "Deployment size: $(du -sh "$DEPLOY_DIR" | cut -f1)"
echo -e "Server files: $(ssh -p "$SSH_PORT" "$SSH_CONNECTION" "du -sh '$SSH_PATH' 2>/dev/null | cut -f1 || echo 'Unable to get size'")"

# Cleanup local deployment files
rm -rf "$DEPLOY_DIR"

# Success message
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
echo -e "${GREEN}✅ SSH deployment to Hostinger completed!${NC}"

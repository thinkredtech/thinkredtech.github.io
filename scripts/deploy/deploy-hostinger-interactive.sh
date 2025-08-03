#!/bin/bash

# ThinkRed Website - Interactive Hostinger Deployment Script
# This script allows password authentication for SSH

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

echo -e "${BLUE}🚀 Starting Interactive Hostinger Deployment Process...${NC}"

# Function to test SSH connection (interactive mode)
test_ssh_connection() {
    echo -e "${YELLOW}🔗 Testing SSH connection...${NC}"
    echo -e "${YELLOW}💡 You may be prompted for your SSH key passphrase or server password${NC}"
    if ssh -p "$SSH_PORT" -o ConnectTimeout=30 "$SSH_CONNECTION" "echo 'SSH connection successful'"; then
        echo -e "${GREEN}✅ SSH connection successful${NC}"
        return 0
    else
        echo -e "${RED}❌ SSH connection failed${NC}"
        echo -e "${YELLOW}💡 Please check:${NC}"
        echo -e "   1. Your SSH credentials are correct"
        echo -e "   2. The server is accessible"
        echo -e "   3. You have the correct permissions"
        return 1
    fi
}

# Step 1: Test SSH connection
if ! test_ssh_connection; then
    echo -e "${RED}❌ Cannot proceed without SSH connection${NC}"
    exit 1
fi

# Step 2: Check if build directory exists
if [ ! -d "$BUILD_DIR" ]; then
    echo -e "${RED}❌ Build directory '$BUILD_DIR' not found${NC}"
    echo -e "${YELLOW}💡 Please run 'npm run build' first${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Preparing deployment package...${NC}"

# Step 3: Create deployment directory
mkdir -p "$DEPLOY_DIR"

# Step 4: Copy build files
cp -r "$BUILD_DIR"/* "$DEPLOY_DIR"/

# Step 5: Create maintenance page backup
cat > "$DEPLOY_DIR/maintenance.html" << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ThinkRED - Maintenance</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
            padding: 2rem;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
        }
        .container {
            max-width: 600px;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            backdrop-filter: blur(10px);
        }
        h1 { font-size: 2.5rem; margin-bottom: 1rem; }
        p { font-size: 1.2rem; margin-bottom: 2rem; opacity: 0.9; }
        .spinner {
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top: 4px solid white;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
            margin: 0 auto 2rem;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="spinner"></div>
        <h1>🚀 ThinkRED</h1>
        <p>We're updating our website with exciting new features!</p>
        <p>We'll be back shortly. Thank you for your patience.</p>
    </div>
    <script>
        // Auto-refresh every 30 seconds
        setTimeout(() => location.reload(), 30000);
    </script>
</body>
</html>
EOF

# Step 6: Create zip file for faster upload
echo -e "${YELLOW}📁 Creating deployment package...${NC}"
cd "$DEPLOY_DIR"
zip -r "../$ZIP_FILE" . > /dev/null
cd ..

echo -e "${YELLOW}⬆️ Uploading to server...${NC}"
echo -e "${YELLOW}💡 You may be prompted for authentication again${NC}"

# Step 7: Upload maintenance page first
echo -e "${YELLOW}🔧 Setting maintenance mode...${NC}"
scp -P "$SSH_PORT" "$DEPLOY_DIR/maintenance.html" "$SSH_CONNECTION:$SSH_PATH/maintenance-temp.html"

# Step 8: Backup current site and enable maintenance
ssh -p "$SSH_PORT" "$SSH_CONNECTION" << 'ENDSSH'
cd domains/thinkred.tech/public_html
if [ -f "index.html" ]; then
    cp index.html index.html.backup
fi
cp maintenance-temp.html index.html
echo "Maintenance mode enabled"
ENDSSH

# Step 9: Upload new files
echo -e "${YELLOW}📤 Uploading new website files...${NC}"
scp -P "$SSH_PORT" "$ZIP_FILE" "$SSH_CONNECTION:$SSH_PATH/"

# Step 10: Extract and deploy on server
echo -e "${YELLOW}🔄 Extracting and deploying...${NC}"
ssh -p "$SSH_PORT" "$SSH_CONNECTION" << ENDSSH
cd $SSH_PATH
echo "Extracting files..."
unzip -o $ZIP_FILE > /dev/null
rm $ZIP_FILE maintenance-temp.html
echo "Deployment complete!"
ENDSSH

# Step 11: Cleanup local files
echo -e "${YELLOW}🧹 Cleaning up local files...${NC}"
rm -rf "$DEPLOY_DIR" "$ZIP_FILE"

echo -e "${GREEN}🎉 Deployment successful!${NC}"
echo -e "${GREEN}✅ Website updated at: https://thinkred.tech${NC}"
echo -e "${YELLOW}💡 It may take a few minutes for changes to propagate${NC}"

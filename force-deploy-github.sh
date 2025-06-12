#!/bin/bash

# Force GitHub Pages Deployment
# This script forces a fresh deployment to GitHub Pages

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 Force GitHub Pages Deployment${NC}"
echo ""

# Check if we're on main branch
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    echo -e "${YELLOW}⚠️  Switching to main branch...${NC}"
    git checkout main
fi

# Ensure we have the latest changes
echo -e "${YELLOW}📥 Pulling latest changes...${NC}"
git pull origin main

# Clean build directory
echo -e "${YELLOW}🧹 Cleaning build directory...${NC}"
rm -rf build

# Fresh build
echo -e "${YELLOW}🏗️  Building project...${NC}"
npm run build

# Force deploy to gh-pages branch (this will overwrite completely)
echo -e "${YELLOW}🚀 Force deploying to gh-pages branch...${NC}"
npx gh-pages -d build -b gh-pages -f

echo -e "${GREEN}✅ Force deployment completed!${NC}"
echo ""
echo -e "${BLUE}📋 Next steps:${NC}"
echo "1. Check GitHub repository settings → Pages"
echo "2. Ensure source is set to 'Deploy from a branch: gh-pages'"
echo "3. Wait 5-10 minutes for GitHub Pages to update"
echo "4. Clear browser cache or use incognito mode"
echo "5. Visit: ${YELLOW}https://thinkredtech.github.io${NC}"
echo ""
echo -e "${YELLOW}💡 If the site still shows old content:${NC}"
echo "• Try hard refresh (Ctrl+F5 / Cmd+Shift+R)"
echo "• Use browser's developer tools to disable cache"
echo "• Check GitHub Actions tab for any deployment issues"
echo "• Verify GitHub Pages settings in repository"

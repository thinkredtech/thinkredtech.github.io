#!/bin/bash

# GitHub Pages Deployment Debug Script
# This script helps debug GitHub Pages deployment issues

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 GitHub Pages Deployment Debug${NC}"
echo ""

# Check git configuration
echo -e "${YELLOW}📋 Git Configuration:${NC}"
echo "Repository: $(git config --get remote.origin.url)"
echo "Current branch: $(git branch --show-current)"
echo "Last commit: $(git log -1 --oneline)"
echo ""

# Check if we're in a clean state
if ! git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}⚠️  Warning: You have uncommitted changes${NC}"
    git status --porcelain
    echo ""
fi

# Check package.json homepage
echo -e "${YELLOW}🏠 Homepage Configuration:${NC}"
homepage=$(grep -o '"homepage": "[^"]*"' package.json | cut -d'"' -f4)
echo "Homepage: $homepage"
echo ""

# Check for gh-pages package
echo -e "${YELLOW}📦 Dependencies:${NC}"
if npm list gh-pages > /dev/null 2>&1; then
    echo -e "${GREEN}✅ gh-pages package installed${NC}"
    gh_pages_version=$(npm list gh-pages --depth=0 | grep gh-pages | sed 's/.*@//')
    echo "Version: $gh_pages_version"
else
    echo -e "${RED}❌ gh-pages package not found${NC}"
    echo "Run: npm install --save-dev gh-pages"
    exit 1
fi
echo ""

# Check build directory
echo -e "${YELLOW}🏗️  Build Check:${NC}"
if [ -d "build" ]; then
    echo -e "${GREEN}✅ Build directory exists${NC}"
    echo "Build size: $(du -sh build | cut -f1)"
    echo "Files in build: $(find build -type f | wc -l | tr -d ' ')"
    
    # Check for index.html
    if [ -f "build/index.html" ]; then
        echo -e "${GREEN}✅ index.html found${NC}"
    else
        echo -e "${RED}❌ index.html not found in build${NC}"
    fi
    
    # Check for assets
    if [ -d "build/assets" ]; then
        echo -e "${GREEN}✅ Assets directory found${NC}"
        echo "Assets: $(find build/assets -type f | wc -l | tr -d ' ') files"
    else
        echo -e "${YELLOW}⚠️  No assets directory found${NC}"
    fi
else
    echo -e "${RED}❌ Build directory not found${NC}"
    echo "Run: npm run build"
fi
echo ""

# GitHub Pages status check
echo -e "${YELLOW}🌐 GitHub Pages Status:${NC}"
repo_name=$(basename $(git config --get remote.origin.url) .git)
owner=$(git config --get remote.origin.url | sed -n 's/.*github\.com[:/]\([^/]*\)\/.*/\1/p')

echo "Repository: $owner/$repo_name"
echo "Expected URL: https://$owner.github.io$([ "$repo_name" != "$owner.github.io" ] && echo "/$repo_name" || echo "")"
echo ""

# Check for common issues
echo -e "${YELLOW}🔧 Common Issues Check:${NC}"

# Check if CNAME file exists and might conflict
if [ -f "public/CNAME" ]; then
    echo -e "${YELLOW}⚠️  CNAME file found in public/$(cat public/CNAME)${NC}"
    echo "This might override GitHub Pages domain settings"
elif [ -f "build/CNAME" ]; then
    echo -e "${YELLOW}⚠️  CNAME file found in build/: $(cat build/CNAME)${NC}"
fi

# Check for 404.html
if [ -f "public/404.html" ]; then
    echo -e "${GREEN}✅ Custom 404.html found${NC}"
elif [ -f "build/404.html" ]; then
    echo -e "${GREEN}✅ Custom 404.html in build${NC}"
else
    echo -e "${YELLOW}ℹ️  No custom 404.html (will use default)${NC}"
fi

echo ""
echo -e "${BLUE}🚀 Next Steps:${NC}"
echo "1. Ensure all changes are committed and pushed to main/master"
echo "2. Run deployment:"
echo "   ${YELLOW}npm run deploy:github${NC} (manual deployment)"
echo "   or push to trigger GitHub Actions workflow"
echo "3. Check GitHub repository settings > Pages"
echo "4. Verify GitHub Pages is enabled and set to deploy from gh-pages branch"
echo "5. Wait 5-10 minutes for deployment to complete"
echo "6. Visit your site: https://$owner.github.io$([ "$repo_name" != "$owner.github.io" ] && echo "/$repo_name" || echo "")"
echo ""
echo -e "${GREEN}💡 Pro Tips:${NC}"
echo "• Check GitHub Actions tab for deployment status"
echo "• Browser cache might show old version - try incognito/private mode"
echo "• GitHub Pages deployment can take up to 10 minutes"
echo "• Check repository Settings > Pages for any error messages"

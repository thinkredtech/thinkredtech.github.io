#!/bin/bash

# ThinkRED Backend Deployment Script
# This script securely deploys the Google Apps Script backend using clasp

set -e  # Exit on any error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 ThinkRED Backend Deployment Script${NC}"
echo "======================================="

# Check if root .env file exists
if [ ! -f "../.env" ]; then
    echo -e "${YELLOW}⚠️  Root .env file not found. Creating from template...${NC}"
    if [ -f "../.env.example" ]; then
        cp ../.env.example ../.env
        echo -e "${YELLOW}📝 Please edit .env file with your configuration before running again.${NC}"
        exit 1
    else
        echo -e "${RED}❌ .env.example not found. Cannot create .env file.${NC}"
        exit 1
    fi
fi

# Load environment variables from root
source ../.env

# Validate required environment variables
if [ -z "$GOOGLE_APPS_SCRIPT_ID" ]; then
    echo -e "${RED}❌ GOOGLE_APPS_SCRIPT_ID not set in .env file${NC}"
    exit 1
fi

echo -e "${GREEN}📋 Configuration:${NC}"
echo "   Script ID: $GOOGLE_APPS_SCRIPT_ID"
echo "   Description: ${DEPLOYMENT_DESCRIPTION:-'Backend deployment'}"

# Check if clasp is installed
if ! command -v clasp &> /dev/null; then
    echo -e "${RED}❌ clasp is not installed. Install it with: npm install -g @google/clasp${NC}"
    exit 1
fi

# Check if user is logged in to clasp
if [ ! -f "$HOME/.clasprc.json" ]; then
    echo -e "${YELLOW}⚠️  Not logged in to clasp. Please run 'clasp login' first.${NC}"
    exit 1
fi

# Generate .clasp.json with the script ID from environment
echo -e "${GREEN}🔧 Updating .clasp.json configuration...${NC}"
cat > .clasp.json << EOF
{
  "scriptId": "$GOOGLE_APPS_SCRIPT_ID",
  "rootDir": "",
  "scriptExtensions": [
    ".js",
    ".gs"
  ],
  "htmlExtensions": [
    ".html"
  ],
  "jsonExtensions": [
    ".json"
  ],
  "filePushOrder": [],
  "skipSubdirectories": false
}
EOF

echo -e "${GREEN}✅ .clasp.json updated successfully${NC}"

# Check if there are any uncommitted changes (optional warning)
if command -v git &> /dev/null && [ -d ../.git ]; then
    if ! git diff --quiet HEAD -- . 2>/dev/null; then
        echo -e "${YELLOW}⚠️  Warning: There are uncommitted changes in the backend directory.${NC}"
        echo -e "${YELLOW}   Consider committing your changes before deployment.${NC}"
        read -p "Continue with deployment? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo -e "${YELLOW}🛑 Deployment cancelled by user.${NC}"
            exit 0
        fi
    fi
fi

# Push the code
echo -e "${GREEN}📤 Pushing code to Google Apps Script...${NC}"
if clasp push --force; then
    echo -e "${GREEN}✅ Code pushed successfully${NC}"
else
    echo -e "${RED}❌ Failed to push code${NC}"
    exit 1
fi

# Deploy the script (create a new deployment)
echo -e "${GREEN}🚀 Creating new deployment...${NC}"
if clasp deploy --description "${DEPLOYMENT_DESCRIPTION:-'Backend deployment'}"; then
    echo -e "${GREEN}✅ Deployment successful!${NC}"
    echo -e "${GREEN}🔗 Deployment Details:${NC}"
    echo "   Script ID: $CLASP_SCRIPT_ID"
    echo "   Description: ${DEPLOYMENT_DESCRIPTION:-'Backend deployment'}"
    
    # Open the script in browser (optional)
    read -p "Open Google Apps Script in browser? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${GREEN}🌐 Opening Google Apps Script...${NC}"
        echo "   Visit: https://script.google.com/d/$CLASP_SCRIPT_ID/edit"
        if command -v open &> /dev/null; then
            open "https://script.google.com/d/$CLASP_SCRIPT_ID/edit"
        elif command -v xdg-open &> /dev/null; then
            xdg-open "https://script.google.com/d/$CLASP_SCRIPT_ID/edit"
        fi
    fi
    
    echo -e "${GREEN}🎉 Backend deployment completed successfully!${NC}"
    echo -e "${YELLOW}💡 Don't forget to test the contact form and job application forms.${NC}"
else
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi

#!/bin/bash

# Script to update the Google Apps Script deployment ID across the project
# Usage: ./update-deployment-id.sh [NEW_DEPLOYMENT_ID]

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔄 Google Apps Script Deployment ID Updater${NC}"
echo "=================================================="

# Get deployment ID from parameter or prompt
if [ -n "$1" ]; then
    NEW_DEPLOYMENT_ID="$1"
else
    echo -e "${YELLOW}📝 Enter the new Google Apps Script deployment ID:${NC}"
    read -r NEW_DEPLOYMENT_ID
fi

# Validate deployment ID format
if [[ ! $NEW_DEPLOYMENT_ID =~ ^AK[a-zA-Z0-9_-]+$ ]]; then
    echo -e "${RED}❌ Invalid deployment ID format. Should start with 'AK' followed by alphanumeric characters.${NC}"
    exit 1
fi

echo -e "${GREEN}🎯 Updating deployment ID to: ${NEW_DEPLOYMENT_ID}${NC}"

# Project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# Create backup directory in temp
BACKUP_DIR="/tmp/thinkred-backups-$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Files to update
FILES_TO_UPDATE=(
    "frontend/src/config/environment.ts"
    "test-cors-api.sh"
    ".env"
)

# Backup files to temp directory
echo -e "${YELLOW}📋 Creating backups in $BACKUP_DIR...${NC}"
for file in "${FILES_TO_UPDATE[@]}"; do
    if [ -f "$file" ]; then
        cp "$file" "$BACKUP_DIR/$(basename "$file").backup"
        echo "   ✓ Backed up $file"
    fi
done

# Update frontend configuration
echo -e "${YELLOW}🔧 Updating frontend configuration...${NC}"
if [ -f "frontend/src/config/environment.ts" ]; then
    # Update the deployment ID in environment.ts
    sed -i.tmp "s/AK[a-zA-Z0-9_-]*/$NEW_DEPLOYMENT_ID/g" frontend/src/config/environment.ts
    rm -f frontend/src/config/environment.ts.tmp
    echo "   ✓ Updated frontend/src/config/environment.ts"
else
    echo -e "${RED}   ❌ frontend/src/config/environment.ts not found${NC}"
fi

# Update test script
echo -e "${YELLOW}🧪 Updating test script...${NC}"
if [ -f "test-cors-api.sh" ]; then
    sed -i.tmp "s/AK[a-zA-Z0-9_-]*/$NEW_DEPLOYMENT_ID/g" test-cors-api.sh
    rm -f test-cors-api.sh.tmp
    echo "   ✓ Updated test-cors-api.sh"
else
    echo -e "${RED}   ❌ test-cors-api.sh not found${NC}"
fi

# Update .env file
echo -e "${YELLOW}⚙️  Updating environment file...${NC}"
if [ -f ".env" ]; then
    # Update or add GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID
    if grep -q "GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID" .env; then
        sed -i.tmp "s/GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID=.*/GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID=$NEW_DEPLOYMENT_ID/" .env
    else
        echo "GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID=$NEW_DEPLOYMENT_ID" >> .env
    fi
    rm -f .env.tmp
    echo "   ✓ Updated .env"
else
    echo -e "${YELLOW}   ⚠️  .env file not found, skipping${NC}"
fi

# Show what was changed
echo -e "${GREEN}📋 Summary of changes:${NC}"
for file in "${FILES_TO_UPDATE[@]}"; do
    if [ -f "$file" ]; then
        if grep -q "$NEW_DEPLOYMENT_ID" "$file"; then
            echo -e "   ${GREEN}✓${NC} $file - Updated"
        else
            echo -e "   ${YELLOW}?${NC} $file - No changes made"
        fi
    else
        echo -e "   ${RED}✗${NC} $file - File not found"
    fi
done

# Test the new endpoint
echo -e "${GREEN}🧪 Testing new endpoint...${NC}"
NEW_ENDPOINT="https://script.google.com/macros/s/$NEW_DEPLOYMENT_ID/exec"
echo "   Endpoint: $NEW_ENDPOINT"

if command -v curl &> /dev/null; then
    echo "   Testing connectivity..."
    if curl -s --max-time 10 "$NEW_ENDPOINT?action=test" > /dev/null; then
        echo -e "   ${GREEN}✓${NC} Endpoint is accessible"
    else
        echo -e "   ${YELLOW}⚠️${NC}  Endpoint test failed (this might be normal if the script requires specific parameters)"
    fi
else
    echo -e "   ${YELLOW}⚠️${NC}  curl not available, skipping connectivity test"
fi

# Offer to commit changes
echo ""
echo -e "${YELLOW}🔄 Would you like to commit these changes? (y/N):${NC}"
read -r COMMIT_CHOICE

if [[ $COMMIT_CHOICE =~ ^[Yy]$ ]]; then
    if command -v git &> /dev/null && [ -d .git ]; then
        echo -e "${GREEN}📝 Committing changes...${NC}"
        
        git add .
        git commit -m "chore(deploy): update API endpoint to deployment $NEW_DEPLOYMENT_ID

- Updated frontend configuration with new Google Apps Script deployment ID
- Updated test script with new endpoint
- Updated environment configuration

Deployment ID: $NEW_DEPLOYMENT_ID
Endpoint: $NEW_ENDPOINT"
        
        echo -e "${GREEN}✅ Changes committed successfully!${NC}"
        
        echo -e "${YELLOW}🚀 Would you like to push to remote? (y/N):${NC}"
        read -r PUSH_CHOICE
        
        if [[ $PUSH_CHOICE =~ ^[Yy]$ ]]; then
            git push
            echo -e "${GREEN}✅ Changes pushed to remote repository!${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  Not a git repository or git not available${NC}"
    fi
fi

echo ""
echo -e "${GREEN}🎉 Deployment ID update completed!${NC}"
echo -e "${GREEN}📋 New deployment ID: ${NEW_DEPLOYMENT_ID}${NC}"
echo -e "${GREEN}🌐 New endpoint: ${NEW_ENDPOINT}${NC}"
echo -e "${BLUE}💾 Backups stored in: ${BACKUP_DIR}${NC}"
echo ""
echo -e "${YELLOW}💡 Next steps:${NC}"
echo "   1. Test the application: npm run dev (in frontend directory)"
echo "   2. Run the test script: ./test-cors-api.sh"
echo "   3. Deploy to production if everything works"
echo ""
echo -e "${YELLOW}🗑️  Clean up backups when satisfied: rm -rf ${BACKUP_DIR}${NC}"

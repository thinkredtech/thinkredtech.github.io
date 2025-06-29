#!/bin/bash

# =============================================================================
# ThinkRED Environment Management Script
# =============================================================================
# This script helps manage environment variables across the monorepo
# =============================================================================

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

echo -e "${GREEN}🔧 ThinkRED Environment Management${NC}"
echo "======================================"

# Function to show usage
show_usage() {
    echo "Usage: $0 [command] [options]"
    echo ""
    echo "Commands:"
    echo "  init          Initialize environment from template"
    echo "  validate      Validate current environment configuration"
    echo "  update-api    Update API endpoint across all configurations"
    echo "  sync          Sync environment variables between frontend and backend"
    echo "  show          Show current environment configuration"
    echo "  help          Show this help message"
    echo ""
    echo "Options:"
    echo "  --deployment-id [ID]    Set new Google Apps Script deployment ID"
    echo "  --force                 Force operation without confirmation"
    echo ""
    echo "Examples:"
    echo "  $0 init                                    # Initialize .env from template"
    echo "  $0 update-api --deployment-id NEW_ID      # Update API endpoint"
    echo "  $0 validate                                # Validate configuration"
}

# Function to initialize environment
init_env() {
    echo -e "${BLUE}📝 Initializing environment configuration...${NC}"
    
    if [ -f "$ROOT_DIR/.env" ] && [ "$1" != "--force" ]; then
        echo -e "${YELLOW}⚠️  .env file already exists. Use --force to overwrite.${NC}"
        return 1
    fi
    
    if [ ! -f "$ROOT_DIR/.env.example" ]; then
        echo -e "${RED}❌ .env.example not found${NC}"
        return 1
    fi
    
    cp "$ROOT_DIR/.env.example" "$ROOT_DIR/.env"
    echo -e "${GREEN}✅ Created .env from template${NC}"
    echo -e "${YELLOW}📝 Please edit .env with your actual values${NC}"
}

# Function to validate environment
validate_env() {
    echo -e "${BLUE}🔍 Validating environment configuration...${NC}"
    
    if [ ! -f "$ROOT_DIR/.env" ]; then
        echo -e "${RED}❌ .env file not found. Run '$0 init' first.${NC}"
        return 1
    fi
    
    # Source the environment file
    source "$ROOT_DIR/.env"
    
    # Check required variables
    local errors=0
    
    if [ -z "$GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID" ]; then
        echo -e "${RED}❌ GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID is required${NC}"
        errors=$((errors + 1))
    fi
    
    if [ -z "$GOOGLE_APPS_SCRIPT_ID" ]; then
        echo -e "${YELLOW}⚠️  GOOGLE_APPS_SCRIPT_ID is not set${NC}"
    fi
    
    if [ -z "$EMAIL_TO" ]; then
        echo -e "${YELLOW}⚠️  EMAIL_TO is not set${NC}"
    fi
    
    if [ $errors -eq 0 ]; then
        echo -e "${GREEN}✅ Environment configuration is valid${NC}"
        return 0
    else
        echo -e "${RED}❌ Found $errors error(s) in environment configuration${NC}"
        return 1
    fi
}

# Function to update API endpoint
update_api_endpoint() {
    local deployment_id="$1"
    
    if [ -z "$deployment_id" ]; then
        echo -e "${RED}❌ Deployment ID is required${NC}"
        echo "Usage: $0 update-api --deployment-id NEW_DEPLOYMENT_ID"
        return 1
    fi
    
    echo -e "${BLUE}🔄 Updating API endpoint with deployment ID: $deployment_id${NC}"
    
    # Update .env file
    if [ -f "$ROOT_DIR/.env" ]; then
        sed -i.bak "s/GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID=.*/GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID=$deployment_id/" "$ROOT_DIR/.env"
        echo -e "${GREEN}✅ Updated .env${NC}"
    fi
    
    # Update .env.example with a placeholder comment
    if [ -f "$ROOT_DIR/.env.example" ]; then
        sed -i.bak "s/GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID=.*/GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID=your-current-deployment-id/" "$ROOT_DIR/.env.example"
        echo -e "${GREEN}✅ Updated .env.example${NC}"
    fi
    
    echo -e "${YELLOW}📝 Don't forget to rebuild and redeploy the frontend!${NC}"
    echo -e "${BLUE}💡 Run: cd frontend && npm run build${NC}"
}

# Function to show current configuration
show_config() {
    echo -e "${BLUE}📋 Current Environment Configuration${NC}"
    echo "====================================="
    
    if [ ! -f "$ROOT_DIR/.env" ]; then
        echo -e "${RED}❌ .env file not found${NC}"
        return 1
    fi
    
    source "$ROOT_DIR/.env"
    
    echo -e "${GREEN}Google Apps Script:${NC}"
    echo "  Project ID: ${GOOGLE_APPS_SCRIPT_ID:-'Not set'}"
    echo "  Deployment ID: ${GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID:-'Not set'}"
    echo "  API Endpoint: ${GOOGLE_APPS_SCRIPT_BASE_URL}/${GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID}/exec"
    echo ""
    
    echo -e "${GREEN}Application:${NC}"
    echo "  Environment: ${NODE_ENV:-'development'}"
    echo "  Frontend URL: ${FRONTEND_BASE_URL:-'Not set'}"
    echo ""
    
    echo -e "${GREEN}Features:${NC}"
    echo "  Contact Form: ${ENABLE_CONTACT_FORM:-'true'}"
    echo "  Job Applications: ${ENABLE_JOB_APPLICATIONS:-'true'}"
    echo "  Blog: ${ENABLE_BLOG:-'true'}"
    echo "  Portfolio: ${ENABLE_PORTFOLIO:-'true'}"
}

# Function to sync environments
sync_env() {
    echo -e "${BLUE}🔄 Syncing environment variables...${NC}"
    
    # This function would sync critical env vars between frontend and backend
    # For now, just validate that both are consistent
    validate_env
}

# Parse command line arguments
case "$1" in
    "init")
        init_env "$2"
        ;;
    "validate")
        validate_env
        ;;
    "update-api")
        if [ "$2" = "--deployment-id" ] && [ -n "$3" ]; then
            update_api_endpoint "$3"
        else
            echo -e "${RED}❌ Invalid arguments for update-api${NC}"
            show_usage
            exit 1
        fi
        ;;
    "sync")
        sync_env
        ;;
    "show")
        show_config
        ;;
    "help"|"--help"|"-h")
        show_usage
        ;;
    "")
        echo -e "${RED}❌ No command specified${NC}"
        show_usage
        exit 1
        ;;
    *)
        echo -e "${RED}❌ Unknown command: $1${NC}"
        show_usage
        exit 1
        ;;
esac

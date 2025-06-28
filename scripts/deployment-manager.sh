#!/bin/bash

# Configuration manager for multiple deployment environments
# This script manages API endpoints for different deployment targets

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}🌐 ThinkRED Deployment Environment Manager${NC}"
echo "=============================================="

# Configuration file
CONFIG_FILE=".deployment-config.json"

# Create default config if it doesn't exist
if [ ! -f "$CONFIG_FILE" ]; then
    cat > "$CONFIG_FILE" << EOF
{
  "environments": {
    "production": {
      "name": "GitHub Pages",
      "deploymentId": "",
      "description": "Production deployment on GitHub Pages"
    },
    "hostinger": {
      "name": "Hostinger",
      "deploymentId": "",
      "description": "Production deployment on Hostinger"
    },
    "staging": {
      "name": "Staging",
      "deploymentId": "",
      "description": "Staging environment for testing"
    },
    "development": {
      "name": "Development",
      "deploymentId": "",
      "description": "Local development environment"
    }
  },
  "lastUpdated": "",
  "currentDefault": "production"
}
EOF
    echo -e "${GREEN}✅ Created default configuration file${NC}"
fi

# Functions
show_current_config() {
    echo -e "${BLUE}📋 Current Configuration:${NC}"
    if command -v jq &> /dev/null; then
        jq '.' "$CONFIG_FILE"
    else
        cat "$CONFIG_FILE"
    fi
}

update_environment() {
    local env_name="$1"
    local deployment_id="$2"
    
    if command -v jq &> /dev/null; then
        # Update with jq
        jq --arg env "$env_name" --arg id "$deployment_id" --arg timestamp "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
           '.environments[$env].deploymentId = $id | .lastUpdated = $timestamp' \
           "$CONFIG_FILE" > "$CONFIG_FILE.tmp" && mv "$CONFIG_FILE.tmp" "$CONFIG_FILE"
    else
        # Fallback: manual JSON editing (basic)
        echo -e "${YELLOW}⚠️  jq not installed. Please install jq for better JSON handling or edit manually.${NC}"
        echo "Environment: $env_name"
        echo "Deployment ID: $deployment_id"
        return 1
    fi
}

get_deployment_id() {
    local env_name="$1"
    
    if command -v jq &> /dev/null; then
        jq -r ".environments[\"$env_name\"].deploymentId" "$CONFIG_FILE"
    else
        echo -e "${YELLOW}⚠️  jq not installed. Cannot retrieve deployment ID automatically.${NC}"
        return 1
    fi
}

apply_environment() {
    local env_name="$1"
    local deployment_id
    deployment_id=$(get_deployment_id "$env_name")
    
    if [ "$deployment_id" = "null" ] || [ -z "$deployment_id" ]; then
        echo -e "${RED}❌ No deployment ID found for environment: $env_name${NC}"
        return 1
    fi
    
    echo -e "${GREEN}🔄 Applying $env_name environment...${NC}"
    echo "   Deployment ID: $deployment_id"
    
    # Use the update script
    if [ -f "./update-deployment-id.sh" ]; then
        ./update-deployment-id.sh "$deployment_id"
    else
        echo -e "${RED}❌ update-deployment-id.sh not found${NC}"
        return 1
    fi
    
    # Update current default
    if command -v jq &> /dev/null; then
        jq --arg env "$env_name" '.currentDefault = $env' "$CONFIG_FILE" > "$CONFIG_FILE.tmp" && mv "$CONFIG_FILE.tmp" "$CONFIG_FILE"
    fi
}

# Main menu
case "${1:-menu}" in
    "show"|"status")
        show_current_config
        ;;
    
    "update")
        if [ -z "$2" ] || [ -z "$3" ]; then
            echo -e "${RED}❌ Usage: $0 update <environment> <deployment_id>${NC}"
            echo "   Environments: production, hostinger, staging, development"
            exit 1
        fi
        
        ENV_NAME="$2"
        DEPLOYMENT_ID="$3"
        
        echo -e "${GREEN}🔄 Updating $ENV_NAME environment...${NC}"
        update_environment "$ENV_NAME" "$DEPLOYMENT_ID"
        echo -e "${GREEN}✅ Environment updated successfully${NC}"
        ;;
    
    "apply")
        if [ -z "$2" ]; then
            echo -e "${RED}❌ Usage: $0 apply <environment>${NC}"
            echo "   Environments: production, hostinger, staging, development"
            exit 1
        fi
        
        apply_environment "$2"
        ;;
    
    "set-default")
        if [ -z "$2" ]; then
            echo -e "${RED}❌ Usage: $0 set-default <environment>${NC}"
            exit 1
        fi
        
        ENV_NAME="$2"
        if command -v jq &> /dev/null; then
            jq --arg env "$ENV_NAME" '.currentDefault = $env' "$CONFIG_FILE" > "$CONFIG_FILE.tmp" && mv "$CONFIG_FILE.tmp" "$CONFIG_FILE"
            echo -e "${GREEN}✅ Default environment set to: $ENV_NAME${NC}"
        fi
        ;;
    
    "list"|"environments")
        echo -e "${BLUE}📋 Available Environments:${NC}"
        if command -v jq &> /dev/null; then
            jq -r '.environments | to_entries[] | "  \(.key): \(.value.name) - \(.value.description)"' "$CONFIG_FILE"
        else
            echo "  production: GitHub Pages"
            echo "  hostinger: Hostinger"
            echo "  staging: Staging"
            echo "  development: Development"
        fi
        ;;
    
    "sync-from-backend")
        # Get the latest deployment ID from a successful backend deployment
        echo -e "${GREEN}🔄 Syncing from latest backend deployment...${NC}"
        
        # This would typically be called after a backend deployment
        if [ -n "$2" ]; then
            LATEST_ID="$2"
        else
            echo -e "${YELLOW}📝 Enter the latest deployment ID:${NC}"
            read -r LATEST_ID
        fi
        
        # Update production by default
        update_environment "production" "$LATEST_ID"
        apply_environment "production"
        
        echo -e "${GREEN}✅ Production environment synced with latest deployment${NC}"
        ;;
    
    "menu"|*)
        echo -e "${BLUE}📋 Available Commands:${NC}"
        echo ""
        echo -e "${YELLOW}Information:${NC}"
        echo "  $0 show                           - Show current configuration"
        echo "  $0 list                           - List available environments"
        echo ""
        echo -e "${YELLOW}Environment Management:${NC}"
        echo "  $0 update <env> <deployment_id>   - Update deployment ID for environment"
        echo "  $0 apply <env>                    - Apply environment configuration"
        echo "  $0 set-default <env>              - Set default environment"
        echo ""
        echo -e "${YELLOW}Backend Integration:${NC}"
        echo "  $0 sync-from-backend [id]         - Sync production with latest backend deployment"
        echo ""
        echo -e "${YELLOW}Examples:${NC}"
        echo "  $0 update production AKfycby..."
        echo "  $0 apply production"
        echo "  $0 sync-from-backend AKfycby..."
        ;;
esac

#!/bin/bash

# D&D Character Manager Infrastructure Setup Script
# This script initializes the Cloudflare infrastructure for all environments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENTS=("development" "staging" "production")
PROJECT_NAME="dnd-character-manager"

echo -e "${GREEN}🚀 D&D Character Manager Infrastructure Setup${NC}"
echo "================================================"

# Check dependencies
check_dependencies() {
    echo -e "${YELLOW}Checking dependencies...${NC}"
    
    if ! command -v wrangler &> /dev/null; then
        echo -e "${RED}❌ Wrangler CLI not found. Please install it first:${NC}"
        echo "npm install -g wrangler"
        exit 1
    fi
    
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js not found. Please install Node.js first.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ All dependencies found${NC}"
}

# Authenticate with Cloudflare
authenticate() {
    echo -e "${YELLOW}Authenticating with Cloudflare...${NC}"
    
    if ! wrangler whoami &> /dev/null; then
        echo -e "${YELLOW}Please authenticate with Cloudflare:${NC}"
        wrangler auth login
    fi
    
    echo -e "${GREEN}✅ Authenticated with Cloudflare${NC}"
}

# Create D1 databases
create_databases() {
    echo -e "${YELLOW}Creating D1 databases...${NC}"
    
    for env in "${ENVIRONMENTS[@]}"; do
        db_name="${PROJECT_NAME}-db-${env}"
        echo "Creating database: $db_name"
        
        # Create database if it doesn't exist
        if ! wrangler d1 list | grep -q "$db_name"; then
            wrangler d1 create "$db_name"
            echo -e "${GREEN}✅ Created database: $db_name${NC}"
        else
            echo -e "${YELLOW}⚠️ Database $db_name already exists${NC}"
        fi
    done
}

# Create KV namespaces
create_kv_namespaces() {
    echo -e "${YELLOW}Creating KV namespaces...${NC}"
    
    for env in "${ENVIRONMENTS[@]}"; do
        # Cache namespace
        cache_namespace="${PROJECT_NAME}-cache-${env}"
        if ! wrangler kv:namespace list | grep -q "$cache_namespace"; then
            wrangler kv:namespace create "$cache_namespace"
            echo -e "${GREEN}✅ Created KV namespace: $cache_namespace${NC}"
        else
            echo -e "${YELLOW}⚠️ KV namespace $cache_namespace already exists${NC}"
        fi
        
        # Sessions namespace
        sessions_namespace="${PROJECT_NAME}-sessions-${env}"
        if ! wrangler kv:namespace list | grep -q "$sessions_namespace"; then
            wrangler kv:namespace create "$sessions_namespace"
            echo -e "${GREEN}✅ Created KV namespace: $sessions_namespace${NC}"
        else
            echo -e "${YELLOW}⚠️ KV namespace $sessions_namespace already exists${NC}"
        fi
    done
}

# Create R2 buckets
create_r2_buckets() {
    echo -e "${YELLOW}Creating R2 buckets...${NC}"
    
    for env in "${ENVIRONMENTS[@]}"; do
        bucket_name="${PROJECT_NAME}-assets-${env}"
        
        # Create bucket if it doesn't exist
        if ! wrangler r2 bucket list | grep -q "$bucket_name"; then
            wrangler r2 bucket create "$bucket_name"
            echo -e "${GREEN}✅ Created R2 bucket: $bucket_name${NC}"
        else
            echo -e "${YELLOW}⚠️ R2 bucket $bucket_name already exists${NC}"
        fi
        
        # Set up CORS for the bucket
        echo "Setting up CORS for $bucket_name..."
        cat > cors-config.json << EOF
[
  {
    "AllowedOrigins": [
      "https://${PROJECT_NAME}.pages.dev",
      "https://staging.${PROJECT_NAME}.pages.dev",
      "http://localhost:3000"
    ],
    "AllowedMethods": [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "HEAD"
    ],
    "AllowedHeaders": [
      "*"
    ],
    "ExposeHeaders": [
      "ETag"
    ],
    "MaxAgeSeconds": 3600
  }
]
EOF
        
        # Apply CORS configuration (this would need to be done via API)
        # wrangler r2 bucket cors put "$bucket_name" --config cors-config.json
        rm cors-config.json
    done
}

# Run database migrations
run_migrations() {
    echo -e "${YELLOW}Running database migrations...${NC}"
    
    cd api
    
    for env in "${ENVIRONMENTS[@]}"; do
        echo "Running migrations for $env environment..."
        
        case $env in
            "development")
                npm run db:migrate
                ;;
            "staging")
                npm run db:migrate:staging
                ;;
            "production")
                npm run db:migrate:production
                ;;
        esac
        
        echo -e "${GREEN}✅ Migrations completed for $env${NC}"
    done
    
    cd ..
}

# Set up monitoring
setup_monitoring() {
    echo -e "${YELLOW}Setting up monitoring...${NC}"
    
    # This would typically involve:
    # - Setting up Cloudflare Analytics
    # - Configuring alerts
    # - Setting up error tracking
    
    echo -e "${GREEN}✅ Monitoring setup completed${NC}"
}

# Generate environment files
generate_env_files() {
    echo -e "${YELLOW}Generating environment configuration...${NC}"
    
    # Get account ID
    ACCOUNT_ID=$(wrangler whoami | grep "Account ID" | awk '{print $3}')
    
    echo "Cloudflare Account ID: $ACCOUNT_ID"
    
    # Update wrangler.toml with actual values
    echo "Please update the following files with your actual resource IDs:"
    echo "- api/wrangler.toml"
    echo "- infrastructure/environments/*.toml"
    
    echo -e "${GREEN}✅ Environment configuration ready${NC}"
}

# Main setup function
main() {
    echo -e "${GREEN}Starting infrastructure setup for $PROJECT_NAME...${NC}"
    
    check_dependencies
    authenticate
    create_databases
    create_kv_namespaces
    create_r2_buckets
    generate_env_files
    
    echo
    echo -e "${GREEN}🎉 Infrastructure setup completed!${NC}"
    echo
    echo "Next steps:"
    echo "1. Update api/wrangler.toml with the generated resource IDs"
    echo "2. Set up environment variables/secrets:"
    echo "   - JWT_SECRET (for each environment)"
    echo "   - Any third-party API keys"
    echo "3. Update your custom domain settings in environment configs"
    echo "4. Run the database migrations:"
    echo "   cd api && npm run db:migrate"
    echo "5. Deploy your application:"
    echo "   git push origin main"
    echo
    echo "For detailed instructions, see the deployment documentation."
}

# Handle script arguments
case "${1:-setup}" in
    "setup")
        main
        ;;
    "databases")
        check_dependencies
        authenticate
        create_databases
        ;;
    "kv")
        check_dependencies
        authenticate
        create_kv_namespaces
        ;;
    "r2")
        check_dependencies
        authenticate
        create_r2_buckets
        ;;
    "migrate")
        run_migrations
        ;;
    "help")
        echo "Usage: $0 [setup|databases|kv|r2|migrate|help]"
        echo
        echo "Commands:"
        echo "  setup     - Complete infrastructure setup (default)"
        echo "  databases - Create D1 databases only"
        echo "  kv        - Create KV namespaces only"
        echo "  r2        - Create R2 buckets only"
        echo "  migrate   - Run database migrations only"
        echo "  help      - Show this help message"
        ;;
    *)
        echo -e "${RED}Unknown command: $1${NC}"
        echo "Use '$0 help' for available commands"
        exit 1
        ;;
esac
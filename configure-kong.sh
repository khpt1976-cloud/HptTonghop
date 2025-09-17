#!/bin/bash

# Kong Configuration Script for shell-config-service
# This script configures Kong API Gateway to route requests to shell-config-service

set -e

echo "🚀 Configuring Kong API Gateway for shell-config-service..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
KONG_ADMIN_URL="http://localhost:8002"
KONG_PROXY_URL="http://localhost:8000"
SERVICE_NAME="shell-config-service"
SERVICE_URL="http://shell-config-service:8000"

# Function to check if Kong is ready
check_kong_ready() {
    echo "📋 Checking Kong Admin API..."
    if curl -s -f "$KONG_ADMIN_URL/status" > /dev/null; then
        echo -e "${GREEN}✅ Kong Admin API is ready${NC}"
        return 0
    else
        echo -e "${RED}❌ Kong Admin API is not ready${NC}"
        return 1
    fi
}

# Function to check if service exists
service_exists() {
    curl -s "$KONG_ADMIN_URL/services/$SERVICE_NAME" > /dev/null 2>&1
}

# Function to create Kong service
create_service() {
    echo "🔧 Creating Kong Service: $SERVICE_NAME"
    
    if service_exists; then
        echo -e "${YELLOW}⚠️  Service '$SERVICE_NAME' already exists, skipping...${NC}"
        return 0
    fi
    
    response=$(curl -s -w "%{http_code}" -X POST "$KONG_ADMIN_URL/services" \
        --data "name=$SERVICE_NAME" \
        --data "url=$SERVICE_URL")
    
    http_code="${response: -3}"
    if [ "$http_code" = "201" ]; then
        echo -e "${GREEN}✅ Service created successfully${NC}"
    else
        echo -e "${RED}❌ Failed to create service (HTTP $http_code)${NC}"
        exit 1
    fi
}

# Function to check if route exists
route_exists() {
    local route_name=$1
    curl -s "$KONG_ADMIN_URL/routes/$route_name" > /dev/null 2>&1
}

# Function to create Kong route
create_route() {
    local route_name=$1
    local route_path=$2
    
    echo "🛣️  Creating Kong Route: $route_name"
    
    if route_exists "$route_name"; then
        echo -e "${YELLOW}⚠️  Route '$route_name' already exists, skipping...${NC}"
        return 0
    fi
    
    response=$(curl -s -w "%{http_code}" -X POST "$KONG_ADMIN_URL/services/$SERVICE_NAME/routes" \
        --data "name=$route_name" \
        --data "paths[]=$route_path")
    
    http_code="${response: -3}"
    if [ "$http_code" = "201" ]; then
        echo -e "${GREEN}✅ Route '$route_name' created successfully${NC}"
    else
        echo -e "${RED}❌ Failed to create route '$route_name' (HTTP $http_code)${NC}"
        exit 1
    fi
}

# Function to test configuration
test_configuration() {
    echo "🧪 Testing Kong configuration..."
    
    # Test health endpoint
    echo "Testing health endpoint..."
    if curl -s -f "$KONG_PROXY_URL/api/shell-config/health" > /dev/null; then
        echo -e "${GREEN}✅ Health endpoint working${NC}"
    else
        echo -e "${RED}❌ Health endpoint failed${NC}"
    fi
    
    # Test navigation items endpoint
    echo "Testing navigation items endpoint..."
    if curl -s -f "$KONG_PROXY_URL/api/navigation-items/" > /dev/null; then
        echo -e "${GREEN}✅ Navigation items endpoint working${NC}"
    else
        echo -e "${RED}❌ Navigation items endpoint failed${NC}"
    fi
}

# Function to display configuration summary
show_summary() {
    echo ""
    echo "📊 Kong Configuration Summary:"
    echo "================================"
    echo "Kong Admin API: $KONG_ADMIN_URL"
    echo "Kong Proxy: $KONG_PROXY_URL"
    echo "Service Name: $SERVICE_NAME"
    echo "Service URL: $SERVICE_URL"
    echo ""
    echo "Available endpoints:"
    echo "• Health Check: $KONG_PROXY_URL/api/shell-config/health"
    echo "• Navigation Items: $KONG_PROXY_URL/api/navigation-items/"
    echo "• All Shell Config APIs: $KONG_PROXY_URL/api/shell-config/*"
    echo ""
    echo "Management:"
    echo "• Kong Admin API: $KONG_ADMIN_URL"
    echo "• Konga GUI: http://localhost:1337"
    echo ""
}

# Main execution
main() {
    echo "🔧 Kong Configuration Script"
    echo "============================"
    
    # Check if Kong is ready
    if ! check_kong_ready; then
        echo -e "${RED}Please ensure Kong is running and accessible at $KONG_ADMIN_URL${NC}"
        exit 1
    fi
    
    # Create service
    create_service
    
    # Create routes
    create_route "shell-config-route" "/api/shell-config"
    create_route "navigation-items-route" "/api/navigation-items"
    
    # Test configuration
    test_configuration
    
    # Show summary
    show_summary
    
    echo -e "${GREEN}🎉 Kong configuration completed successfully!${NC}"
}

# Run main function
main "$@"
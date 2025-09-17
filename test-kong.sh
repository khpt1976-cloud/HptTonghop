#!/bin/bash

# Kong Testing Script
# This script tests Kong API Gateway configuration for shell-config-service

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
KONG_ADMIN_URL="http://localhost:8002"
KONG_PROXY_URL="http://localhost:8000"
DIRECT_SERVICE_URL="http://localhost:8001"

# Function to print test header
print_test_header() {
    local test_name=$1
    echo ""
    echo -e "${BLUE}🧪 Testing: $test_name${NC}"
    echo "----------------------------------------"
}

# Function to test endpoint
test_endpoint() {
    local url=$1
    local description=$2
    local expected_status=${3:-200}
    
    echo -n "Testing $description... "
    
    response=$(curl -s -w "%{http_code}" "$url" 2>/dev/null || echo "000")
    http_code="${response: -3}"
    body="${response%???}"
    
    if [ "$http_code" = "$expected_status" ]; then
        echo -e "${GREEN}✅ OK (HTTP $http_code)${NC}"
        if [ -n "$body" ] && [ "$body" != "null" ]; then
            echo "Response: $body" | head -c 100
            if [ ${#body} -gt 100 ]; then
                echo "..."
            fi
            echo ""
        fi
        return 0
    else
        echo -e "${RED}❌ FAILED (HTTP $http_code)${NC}"
        if [ -n "$body" ]; then
            echo "Error: $body"
        fi
        return 1
    fi
}

# Function to test Kong admin API
test_kong_admin() {
    print_test_header "Kong Admin API"
    
    test_endpoint "$KONG_ADMIN_URL/status" "Kong status"
    test_endpoint "$KONG_ADMIN_URL/services" "Kong services list"
    test_endpoint "$KONG_ADMIN_URL/routes" "Kong routes list"
    test_endpoint "$KONG_ADMIN_URL/services/shell-config-service" "Shell config service details"
}

# Function to test direct service access
test_direct_service() {
    print_test_header "Direct Service Access"
    
    test_endpoint "$DIRECT_SERVICE_URL/health" "Health check (direct)"
    test_endpoint "$DIRECT_SERVICE_URL/api/navigation-items/" "Navigation items (direct)"
    test_endpoint "$DIRECT_SERVICE_URL/" "Root endpoint (direct)"
}

# Function to test Kong proxy
test_kong_proxy() {
    print_test_header "Kong Proxy Routing"
    
    # Test through shell-config route
    test_endpoint "$KONG_PROXY_URL/api/shell-config/health" "Health check (via Kong shell-config route)"
    test_endpoint "$KONG_PROXY_URL/api/shell-config/api/navigation-items/" "Navigation items (via Kong shell-config route)"
    test_endpoint "$KONG_PROXY_URL/api/shell-config/" "Root endpoint (via Kong shell-config route)"
    
    # Test through direct navigation-items route
    test_endpoint "$KONG_PROXY_URL/api/navigation-items/" "Navigation items (via Kong direct route)"
    test_endpoint "$KONG_PROXY_URL/api/navigation-items/health" "Health check (via Kong navigation-items route)"
}

# Function to test performance
test_performance() {
    print_test_header "Performance Test"
    
    echo "Testing response times..."
    
    # Direct service
    echo -n "Direct service: "
    time_direct=$(curl -s -w "%{time_total}" -o /dev/null "$DIRECT_SERVICE_URL/health" 2>/dev/null || echo "0")
    echo "${time_direct}s"
    
    # Via Kong
    echo -n "Via Kong: "
    time_kong=$(curl -s -w "%{time_total}" -o /dev/null "$KONG_PROXY_URL/api/shell-config/health" 2>/dev/null || echo "0")
    echo "${time_kong}s"
    
    # Calculate overhead
    if [ "$time_direct" != "0" ] && [ "$time_kong" != "0" ]; then
        overhead=$(echo "scale=3; ($time_kong - $time_direct) * 1000" | bc 2>/dev/null || echo "N/A")
        echo "Kong overhead: ${overhead}ms"
    fi
}

# Function to test load
test_load() {
    print_test_header "Load Test (10 concurrent requests)"
    
    echo "Sending 10 concurrent requests to Kong..."
    
    for i in {1..10}; do
        curl -s "$KONG_PROXY_URL/api/shell-config/health" > /dev/null &
    done
    
    wait
    echo -e "${GREEN}✅ All requests completed${NC}"
}

# Function to show configuration details
show_configuration() {
    print_test_header "Current Configuration"
    
    echo "Kong Services:"
    curl -s "$KONG_ADMIN_URL/services" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    for service in data.get('data', []):
        print(f\"  • {service['name']}: {service['protocol']}://{service['host']}:{service['port']}\")
except:
    print('  Error parsing services')
" 2>/dev/null || echo "  Unable to fetch services"
    
    echo ""
    echo "Kong Routes:"
    curl -s "$KONG_ADMIN_URL/routes" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    for route in data.get('data', []):
        paths = ', '.join(route.get('paths', []))
        print(f\"  • {route['name']}: {paths}\")
except:
    print('  Error parsing routes')
" 2>/dev/null || echo "  Unable to fetch routes"
}

# Function to run all tests
run_all_tests() {
    local failed_tests=0
    
    echo -e "${BLUE}🚀 Kong API Gateway Test Suite${NC}"
    echo "=================================="
    
    # Test Kong admin API
    if ! test_kong_admin; then
        ((failed_tests++))
    fi
    
    # Test direct service
    if ! test_direct_service; then
        ((failed_tests++))
    fi
    
    # Test Kong proxy
    if ! test_kong_proxy; then
        ((failed_tests++))
    fi
    
    # Test performance
    test_performance
    
    # Test load
    test_load
    
    # Show configuration
    show_configuration
    
    # Summary
    echo ""
    echo "📊 Test Summary:"
    echo "================"
    if [ $failed_tests -eq 0 ]; then
        echo -e "${GREEN}🎉 All tests passed!${NC}"
        echo -e "${GREEN}Kong is properly configured and working.${NC}"
    else
        echo -e "${RED}❌ $failed_tests test(s) failed.${NC}"
        echo -e "${YELLOW}Please check the configuration and try again.${NC}"
    fi
    
    echo ""
    echo "Available endpoints:"
    echo "• Health Check: $KONG_PROXY_URL/api/shell-config/health"
    echo "• Navigation Items: $KONG_PROXY_URL/api/navigation-items/"
    echo "• All Shell Config APIs: $KONG_PROXY_URL/api/shell-config/*"
    echo "• Kong Admin: $KONG_ADMIN_URL"
    echo "• Konga GUI: http://localhost:1337"
    
    return $failed_tests
}

# Main execution
main() {
    case "${1:-all}" in
        "admin")
            test_kong_admin
            ;;
        "direct")
            test_direct_service
            ;;
        "proxy")
            test_kong_proxy
            ;;
        "performance")
            test_performance
            ;;
        "load")
            test_load
            ;;
        "config")
            show_configuration
            ;;
        "all"|*)
            run_all_tests
            ;;
    esac
}

# Check if bc is available for calculations
if ! command -v bc &> /dev/null; then
    echo -e "${YELLOW}⚠️  'bc' command not found. Performance calculations will be limited.${NC}"
fi

# Run main function
main "$@"
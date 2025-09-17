#!/bin/bash

# Script test API cho Shell Config Service

BASE_URL="http://localhost:8001"

echo "🧪 Testing Shell Config Service API"
echo "================================================"

# Test health check
echo "1. Testing Health Check..."
curl -s "$BASE_URL/health" | jq '.' || echo "Health check failed"
echo ""

# Test get all navigation items
echo "2. Testing Get All Navigation Items..."
curl -s "$BASE_URL/api/config/navigation" | jq '.' || echo "Get navigation failed"
echo ""

# Test create navigation item
echo "3. Testing Create Navigation Item..."
curl -s -X POST "$BASE_URL/api/config/navigation" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Dashboard",
    "url": "/dashboard",
    "icon": "dashboard",
    "order": 1,
    "is_active": true,
    "role": "user"
  }' | jq '.' || echo "Create navigation failed"
echo ""

# Test create sub-navigation
echo "4. Testing Create Sub-Navigation..."
curl -s -X POST "$BASE_URL/api/config/navigation" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "User Management",
    "url": "/admin/users",
    "icon": "users",
    "order": 1,
    "is_active": true,
    "role": "admin",
    "parent_id": 1
  }' | jq '.' || echo "Create sub-navigation failed"
echo ""

# Test get navigation by role
echo "5. Testing Get Navigation by Role..."
curl -s "$BASE_URL/api/config/navigation/role/user" | jq '.' || echo "Get navigation by role failed"
echo ""

echo "================================================"
echo "✅ API Testing completed!"
echo ""
echo "📝 Manual testing URLs:"
echo "   - API Docs: $BASE_URL/docs"
echo "   - Health: $BASE_URL/health"
echo "   - Navigation: $BASE_URL/api/config/navigation"
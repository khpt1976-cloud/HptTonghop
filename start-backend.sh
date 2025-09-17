#!/bin/bash

# Script khởi chạy hệ thống Backend Shell
# Bao gồm: shell-config-service, PostgreSQL, Kong API Gateway, Konga GUI

echo "🚀 Khởi chạy hệ thống Backend Shell..."
echo "================================================"

# Kiểm tra Docker và Docker Compose
if ! command -v docker &> /dev/null; then
    echo "❌ Docker chưa được cài đặt. Vui lòng cài đặt Docker trước."
    exit 1
fi

if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose chưa được cài đặt. Vui lòng cài đặt Docker Compose trước."
    exit 1
fi

# Dừng và xóa các container cũ (nếu có)
echo "🧹 Dọn dẹp các container cũ..."
docker compose down -v

# Build và khởi chạy các services
echo "🔨 Build và khởi chạy các services..."
docker compose up --build -d

# Chờ các services khởi động
echo "⏳ Chờ các services khởi động..."
sleep 30

# Kiểm tra trạng thái các services
echo "🔍 Kiểm tra trạng thái các services..."
docker compose ps

echo ""
echo "✅ Hệ thống đã được khởi chạy thành công!"
echo "================================================"
echo "📋 Thông tin truy cập:"
echo ""
echo "🗄️  Shell Config Service:"
echo "   - API: http://localhost:8001"
echo "   - Health Check: http://localhost:8001/health"
echo "   - API Docs: http://localhost:8001/docs"
echo ""
echo "🌐 Kong API Gateway:"
echo "   - Proxy: http://localhost:8000"
echo "   - Admin API: http://localhost:8002"
echo "   - Admin GUI: http://localhost:8003"
echo ""
echo "🎛️  Konga (Kong GUI):"
echo "   - Web Interface: http://localhost:1337"
echo ""
echo "🗃️  Databases:"
echo "   - Shell Config DB: localhost:5432 (user/password)"
echo "   - Kong DB: Internal only"
echo ""
echo "================================================"
echo "📝 Lệnh hữu ích:"
echo "   - Xem logs: docker compose logs -f [service_name]"
echo "   - Dừng hệ thống: docker compose down"
echo "   - Dừng và xóa volumes: docker compose down -v"
echo "   - Restart service: docker compose restart [service_name]"
echo ""
echo "🎉 Hệ thống sẵn sàng sử dụng!"
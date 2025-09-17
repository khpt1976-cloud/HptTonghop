#!/bin/bash

# Script dừng hệ thống Backend Shell

echo "🛑 Dừng hệ thống Backend Shell..."
echo "================================================"

# Hiển thị trạng thái hiện tại
echo "📊 Trạng thái hiện tại:"
docker compose ps

echo ""
echo "🔄 Đang dừng các services..."

# Dừng các services
docker compose down

echo ""
echo "✅ Hệ thống đã được dừng thành công!"
echo "================================================"
echo "📝 Lệnh hữu ích:"
echo "   - Khởi động lại: ./start-backend.sh"
echo "   - Dừng và xóa volumes: docker compose down -v"
echo "   - Xem logs: docker compose logs [service_name]"
echo ""
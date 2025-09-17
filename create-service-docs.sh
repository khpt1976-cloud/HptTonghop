#!/bin/bash

# Script tạo README.md cho tất cả các services

SERVICES_DIR="services"

# Định nghĩa mô tả cho từng service
declare -A SERVICE_DESCRIPTIONS=(
    ["cart-service"]="Microservice quản lý giỏ hàng và đơn hàng"
    ["news-service"]="Microservice quản lý tin tức và bài viết"
    ["agent-management-service"]="Microservice quản lý đại lý và nhân viên"
    ["payment-service"]="Microservice xử lý thanh toán và giao dịch"
    ["design-calculation-service"]="Microservice tính toán thiết kế và báo giá"
    ["admin-service"]="Microservice quản trị hệ thống"
    ["communication-log-service"]="Microservice ghi log giao tiếp và audit"
    ["football-service"]="Microservice quản lý thông tin bóng đá"
    ["chatbot-service"]="Microservice chatbot và AI assistant"
    ["agent-policy-service"]="Microservice quản lý chính sách đại lý"
)

# Tạo README.md cho từng service
for service in "${!SERVICE_DESCRIPTIONS[@]}"; do
    service_path="$SERVICES_DIR/$service"
    readme_path="$service_path/README.md"
    
    if [ -d "$service_path" ]; then
        cat > "$readme_path" << EOF
# $(echo $service | sed 's/-/ /g' | sed 's/\b\w/\U&/g')

${SERVICE_DESCRIPTIONS[$service]}

## Chức năng chính
- Quản lý dữ liệu core của service
- API endpoints cho frontend
- Business logic processing
- Database operations
- Integration với các services khác

## Công nghệ sử dụng
- Framework: FastAPI/Django
- Database: PostgreSQL
- Cache: Redis
- Message Queue: RabbitMQ/Kafka
- Authentication: JWT

## Cấu trúc thư mục
\`\`\`
$service/
├── src/                 # Source code
├── tests/              # Unit tests
├── requirements.txt    # Python dependencies
├── Dockerfile         # Docker configuration
├── docker-compose.yml # Local development
└── README.md          # Documentation
\`\`\`

## API Endpoints
- GET /api/$service - Danh sách
- POST /api/$service - Tạo mới
- GET /api/$service/{id} - Chi tiết
- PUT /api/$service/{id} - Cập nhật
- DELETE /api/$service/{id} - Xóa

## Cài đặt và chạy
\`\`\`bash
cd services/$service
pip install -r requirements.txt
python main.py
\`\`\`

## Environment Variables
\`\`\`env
DATABASE_URL=postgresql://user:password@localhost:5432/db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
\`\`\`

## Testing
\`\`\`bash
pytest tests/
\`\`\`
EOF
        echo "✅ Created README.md for $service"
    fi
done

echo "🎉 All service documentation created!"
EOF
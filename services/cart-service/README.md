# Cart Service

Microservice quản lý giỏ hàng và đơn hàng

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
```
cart-service/
├── src/                 # Source code
├── tests/              # Unit tests
├── requirements.txt    # Python dependencies
├── Dockerfile         # Docker configuration
├── docker-compose.yml # Local development
└── README.md          # Documentation
```

## API Endpoints
- GET /api/cart-service - Danh sách
- POST /api/cart-service - Tạo mới
- GET /api/cart-service/{id} - Chi tiết
- PUT /api/cart-service/{id} - Cập nhật
- DELETE /api/cart-service/{id} - Xóa

## Cài đặt và chạy
```bash
cd services/cart-service
pip install -r requirements.txt
python main.py
```

## Environment Variables
```env
DATABASE_URL=postgresql://user:password@localhost:5432/db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
```

## Testing
```bash
pytest tests/
```

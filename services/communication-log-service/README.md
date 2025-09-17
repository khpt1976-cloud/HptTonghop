# Communication Log Service

Microservice ghi log giao tiếp và audit

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
communication-log-service/
├── src/                 # Source code
├── tests/              # Unit tests
├── requirements.txt    # Python dependencies
├── Dockerfile         # Docker configuration
├── docker-compose.yml # Local development
└── README.md          # Documentation
```

## API Endpoints
- GET /api/communication-log-service - Danh sách
- POST /api/communication-log-service - Tạo mới
- GET /api/communication-log-service/{id} - Chi tiết
- PUT /api/communication-log-service/{id} - Cập nhật
- DELETE /api/communication-log-service/{id} - Xóa

## Cài đặt và chạy
```bash
cd services/communication-log-service
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

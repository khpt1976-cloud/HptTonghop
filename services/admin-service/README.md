# Admin Service

Microservice quản trị hệ thống

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
admin-service/
├── src/                 # Source code
├── tests/              # Unit tests
├── requirements.txt    # Python dependencies
├── Dockerfile         # Docker configuration
├── docker-compose.yml # Local development
└── README.md          # Documentation
```

## API Endpoints
- GET /api/admin-service - Danh sách
- POST /api/admin-service - Tạo mới
- GET /api/admin-service/{id} - Chi tiết
- PUT /api/admin-service/{id} - Cập nhật
- DELETE /api/admin-service/{id} - Xóa

## Cài đặt và chạy
```bash
cd services/admin-service
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

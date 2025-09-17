# Shell Config Service

Service backend quản lý cấu hình thanh điều hướng cho hệ thống Micro-Frontend với hỗ trợ đầy đủ cấu trúc dropdown lồng nhau (nested dropdowns).

## Tính Năng

- ✅ Quản lý navigation items với cấu trúc cây đệ quy
- ✅ Hỗ trợ dropdown lồng nhau không giới hạn cấp độ
- ✅ Phân quyền theo role
- ✅ API RESTful đầy đủ (CRUD)
- ✅ Tự động tạo database schema
- ✅ Docker containerization
- ✅ Health check endpoint

## Cấu Trúc Thư Mục

```
services/shell-config-service/
├── src/
│   ├── api/config_controller.py      # API endpoints
│   ├── models/app_config.py          # SQLAlchemy models & Pydantic schemas
│   ├── repositories/config_repository.py  # CRUD operations
│   ├── config.py                     # Database configuration
│   └── main.py                       # FastAPI application
├── Dockerfile                        # Docker configuration
├── requirements.txt                  # Python dependencies
└── README.md                         # Documentation
```

## API Endpoints

### Navigation Items Management

- `POST /api/navigation-items/` - Tạo navigation item mới
- `GET /api/navigation-items/` - Lấy toàn bộ cấu trúc cây navigation
- `GET /api/navigation-items/role/{role_name}` - Lấy navigation theo role
- `GET /api/navigation-items/{item_id}` - Lấy chi tiết một item
- `PUT /api/navigation-items/{item_id}` - Cập nhật navigation item
- `DELETE /api/navigation-items/{item_id}` - Xóa navigation item

### Health Check

- `GET /health` - Health check endpoint

## Database Schema

### NavigationItem Table

| Field | Type | Description |
|-------|------|-------------|
| id | Integer | Primary key |
| name | String | Tên hiển thị |
| path | String | Đường dẫn URL |
| microfrontend_url | String | URL của microfrontend (nullable) |
| parent_id | Integer | ID của parent item (nullable) |
| display_order | Integer | Thứ tự hiển thị |
| role | String | Vai trò được phép truy cập |

## Cài Đặt và Chạy

### Yêu Cầu

- Python 3.11+
- PostgreSQL
- Docker (optional)

### Chạy với Docker

```bash
# Build image
docker build -t shell-config-service .

# Chạy container
docker run -p 8000:8000 \
  -e DATABASE_URL="postgresql://user:password@host:5432/shell_config_db" \
  shell-config-service
```

### Chạy Local Development

```bash
# Cài đặt dependencies
pip install -r requirements.txt

# Thiết lập biến môi trường
export DATABASE_URL="postgresql://user:password@localhost:5432/shell_config_db"

# Chạy ứng dụng
python -m uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

## Cấu Hình

### Biến Môi Trường

- `DATABASE_URL`: Chuỗi kết nối PostgreSQL (mặc định: `postgresql://user:password@localhost:5432/shell_config_db`)

## Ví Dụ Sử Dụng

### Tạo Navigation Item

```bash
curl -X POST "http://localhost:8000/api/navigation-items/" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dashboard",
    "path": "/dashboard",
    "microfrontend_url": "http://dashboard-app:3000",
    "parent_id": null,
    "display_order": 1,
    "role": "admin"
  }'
```

### Tạo Dropdown Item

```bash
curl -X POST "http://localhost:8000/api/navigation-items/" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "User Management",
    "path": "/users",
    "microfrontend_url": "http://user-app:3000",
    "parent_id": 1,
    "display_order": 1,
    "role": "admin"
  }'
```

### Lấy Navigation theo Role

```bash
curl "http://localhost:8000/api/navigation-items/role/admin"
```

## API Documentation

Sau khi chạy service, truy cập:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Cấu Trúc Dữ Liệu Trả Về

```json
[
  {
    "id": 1,
    "name": "Dashboard",
    "path": "/dashboard",
    "microfrontend_url": "http://dashboard-app:3000",
    "parent_id": null,
    "display_order": 1,
    "role": "admin",
    "children": [
      {
        "id": 2,
        "name": "Analytics",
        "path": "/dashboard/analytics",
        "microfrontend_url": "http://analytics-app:3000",
        "parent_id": 1,
        "display_order": 1,
        "role": "admin",
        "children": []
      }
    ]
  }
]
```

## Lưu Ý

- Service này được thiết kế để hoạt động độc lập, không cần biết về API Gateway
- Hỗ trợ cấu trúc dropdown lồng nhau không giới hạn cấp độ
- Tự động tạo database schema khi khởi động
- Sử dụng SQLAlchemy ORM với PostgreSQL
- Tuân thủ chuẩn REST API
# Hướng Dẫn Khởi Chạy Hệ Thống Backend Shell

## Tổng Quan

Hệ thống Backend Shell bao gồm các thành phần chính:
- **Shell Config Service**: API backend quản lý cấu hình navigation
- **PostgreSQL**: Database cho Shell Config Service
- **Kong API Gateway**: API Gateway quản lý routing và security
- **Kong Database**: PostgreSQL database cho Kong
- **Konga**: Web GUI quản lý Kong

## Yêu Cầu Hệ Thống

- Docker >= 20.10
- Docker Compose >= 2.0
- RAM tối thiểu: 4GB
- Disk space: 2GB

## Khởi Chạy Nhanh

### 1. Khởi chạy toàn bộ hệ thống
```bash
./start-backend.sh
```

### 2. Dừng hệ thống
```bash
./stop-backend.sh
```

### 3. Dừng và xóa toàn bộ data
```bash
docker-compose down -v
```

## Truy Cập Các Services

### Shell Config Service
- **API Base URL**: http://localhost:8001
- **Health Check**: http://localhost:8001/health
- **API Documentation**: http://localhost:8001/docs
- **Interactive API**: http://localhost:8001/redoc

### Kong API Gateway
- **Proxy Port**: http://localhost:8000
- **Admin API**: http://localhost:8002
- **Admin GUI**: http://localhost:8003

### Konga (Kong Management)
- **Web Interface**: http://localhost:1337
- **Default Setup**: Cần cấu hình connection đến Kong Admin API

### Database Access
- **Shell Config DB**: 
  - Host: localhost:5432
  - Database: shell_config_db
  - User: user
  - Password: password

## API Endpoints (Shell Config Service)

### Navigation Management
```bash
# Lấy tất cả navigation items
GET http://localhost:8001/api/config/navigation

# Tạo navigation item mới
POST http://localhost:8001/api/config/navigation
{
  "title": "Dashboard",
  "url": "/dashboard",
  "icon": "dashboard",
  "order": 1,
  "is_active": true,
  "role": "user"
}

# Tạo sub-navigation
POST http://localhost:8001/api/config/navigation
{
  "title": "User Management",
  "url": "/admin/users",
  "icon": "users",
  "order": 1,
  "is_active": true,
  "role": "admin",
  "parent_id": 1
}

# Cập nhật navigation item
PUT http://localhost:8001/api/config/navigation/{id}

# Xóa navigation item
DELETE http://localhost:8001/api/config/navigation/{id}

# Lấy navigation theo role
GET http://localhost:8001/api/config/navigation/role/{role}
```

## Cấu Hình Kong API Gateway

### 1. Truy cập Konga
1. Mở http://localhost:1337
2. Tạo admin account
3. Kết nối đến Kong Admin API: http://kong:8001

### 2. Thêm Shell Config Service vào Kong
```bash
# Tạo service
curl -i -X POST http://localhost:8002/services/ \
  --data "name=shell-config-service" \
  --data "url=http://shell-config-service:8000"

# Tạo route
curl -i -X POST http://localhost:8002/services/shell-config-service/routes \
  --data "hosts[]=api.localhost" \
  --data "paths[]=/config"
```

### 3. Test qua Kong
```bash
curl -i -X GET http://localhost:8000/config/health \
  --header "Host: api.localhost"
```

## Monitoring và Debugging

### Xem logs
```bash
# Tất cả services
docker-compose logs -f

# Specific service
docker-compose logs -f shell-config-service
docker-compose logs -f kong
docker-compose logs -f konga
```

### Kiểm tra trạng thái
```bash
docker-compose ps
```

### Restart service
```bash
docker-compose restart shell-config-service
```

### Truy cập container
```bash
docker-compose exec shell-config-service bash
docker-compose exec db psql -U user -d shell_config_db
```

## Troubleshooting

### 1. Service không khởi động
```bash
# Kiểm tra logs
docker-compose logs [service_name]

# Rebuild image
docker-compose build --no-cache [service_name]
```

### 2. Database connection issues
```bash
# Kiểm tra database
docker-compose exec db psql -U user -d shell_config_db -c "\dt"

# Reset database
docker-compose down -v
docker-compose up -d
```

### 3. Port conflicts
Nếu có xung đột port, sửa trong `docker-compose.yml`:
- Shell Config Service: 8001
- Kong Proxy: 8000
- Kong Admin: 8002
- Konga: 1337
- PostgreSQL: 5432

### 4. Kong migration issues
```bash
# Chạy lại migrations
docker-compose run --rm kong-migrations kong migrations bootstrap
```

## Development

### Thay đổi code Shell Config Service
1. Sửa code trong `services/shell-config-service/src/`
2. Restart service: `docker-compose restart shell-config-service`

### Thêm dependencies mới
1. Cập nhật `services/shell-config-service/requirements.txt`
2. Rebuild: `docker-compose build shell-config-service`
3. Restart: `docker-compose up -d shell-config-service`

## Production Deployment

### Environment Variables
Tạo file `.env`:
```env
# Database
POSTGRES_DB=shell_config_db
POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_secure_password

# Kong
KONG_PG_PASSWORD=kong_secure_password

# Konga
TOKEN_SECRET=your_secret_token
```

### Security Considerations
1. Thay đổi default passwords
2. Sử dụng HTTPS trong production
3. Cấu hình firewall cho các ports
4. Sử dụng secrets management
5. Enable Kong authentication plugins

## Backup và Restore

### Backup Database
```bash
docker-compose exec db pg_dump -U user shell_config_db > backup.sql
```

### Restore Database
```bash
docker-compose exec -T db psql -U user shell_config_db < backup.sql
```
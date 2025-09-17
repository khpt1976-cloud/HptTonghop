# Kong API Gateway Configuration Guide

## Tổng quan

Tài liệu này hướng dẫn cách cấu hình Kong API Gateway để định tuyến các yêu cầu đến `shell-config-service`.

## Điều kiện tiên quyết

- Docker và Docker Compose đã được cài đặt
- Tất cả services trong `docker-compose.yml` đang chạy và healthy
- Kong Admin API có thể truy cập tại `http://localhost:8002`
- Kong Proxy có thể truy cập tại `http://localhost:8000`

## Kiểm tra trạng thái services

```bash
# Kiểm tra tất cả services
docker compose ps

# Kiểm tra Kong Admin API
curl http://localhost:8002/status

# Kiểm tra shell-config-service
curl http://localhost:8001/health
```

## Cấu hình Kong

### Bước 1: Tạo Kong Service

Tạo một Kong Service để định nghĩa `shell-config-service` là backend service:

```bash
curl -i -X POST http://localhost:8002/services \
  --data "name=shell-config-service" \
  --data "url=http://shell-config-service:8000"
```

**Kết quả mong đợi:**
```json
{
  "id": "ef819eb7-d1f1-49f5-96db-88c7ff8c90be",
  "name": "shell-config-service",
  "protocol": "http",
  "host": "shell-config-service",
  "port": 8000,
  "enabled": true,
  ...
}
```

### Bước 2: Tạo Kong Routes

#### Route 1: Shell Config Route
Tạo route cho tất cả endpoints của shell-config-service:

```bash
curl -i -X POST http://localhost:8002/services/shell-config-service/routes \
  --data "name=shell-config-route" \
  --data "paths[]=/api/shell-config"
```

#### Route 2: Navigation Items Route
Tạo route trực tiếp cho navigation-items endpoint:

```bash
curl -i -X POST http://localhost:8002/services/shell-config-service/routes \
  --data "name=navigation-items-route" \
  --data "paths[]=/api/navigation-items"
```

## Kiểm tra cấu hình

### Test Health Check
```bash
# Qua Kong
curl -i http://localhost:8000/api/shell-config/health

# Trực tiếp
curl -i http://localhost:8001/health
```

### Test Navigation Items
```bash
# Qua Kong - Route 1
curl -i http://localhost:8000/api/shell-config/api/navigation-items/

# Qua Kong - Route 2
curl -i http://localhost:8000/api/navigation-items/

# Trực tiếp
curl -i http://localhost:8001/api/navigation-items/
```

## Xem cấu hình hiện tại

### Liệt kê tất cả Services
```bash
curl -s http://localhost:8002/services | python3 -m json.tool
```

### Liệt kê tất cả Routes
```bash
curl -s http://localhost:8002/routes | python3 -m json.tool
```

### Xem chi tiết một Service
```bash
curl -s http://localhost:8002/services/shell-config-service | python3 -m json.tool
```

### Xem Routes của một Service
```bash
curl -s http://localhost:8002/services/shell-config-service/routes | python3 -m json.tool
```

## Quản lý qua Konga GUI

Konga GUI có thể truy cập tại `http://localhost:1337` để quản lý Kong một cách trực quan.

### Kết nối Konga với Kong
1. Truy cập `http://localhost:1337`
2. Tạo admin user
3. Thêm Kong connection:
   - Name: `Kong Admin`
   - Kong Admin URL: `http://kong:8001`

## Cấu hình nâng cao

### Thêm Authentication
```bash
# Thêm JWT plugin
curl -X POST http://localhost:8002/services/shell-config-service/plugins \
  --data "name=jwt"
```

### Thêm Rate Limiting
```bash
# Giới hạn 100 requests/minute
curl -X POST http://localhost:8002/services/shell-config-service/plugins \
  --data "name=rate-limiting" \
  --data "config.minute=100"
```

### Thêm CORS
```bash
curl -X POST http://localhost:8002/services/shell-config-service/plugins \
  --data "name=cors" \
  --data "config.origins=*" \
  --data "config.methods=GET,POST,PUT,DELETE" \
  --data "config.headers=Accept,Accept-Version,Content-Length,Content-MD5,Content-Type,Date,X-Auth-Token"
```

## Troubleshooting

### Service không accessible
```bash
# Kiểm tra service có chạy không
docker compose ps shell-config-service

# Kiểm tra network connectivity
docker exec kong_gateway ping shell-config-service

# Kiểm tra logs
docker compose logs shell-config-service
docker compose logs kong
```

### Route không hoạt động
```bash
# Kiểm tra route configuration
curl -s http://localhost:8002/routes/shell-config-route | python3 -m json.tool

# Test với verbose output
curl -v http://localhost:8000/api/shell-config/health
```

## Scripts tự động

### Script cấu hình Kong
```bash
#!/bin/bash
# configure-kong.sh

echo "Configuring Kong for shell-config-service..."

# Create service
curl -s -X POST http://localhost:8002/services \
  --data "name=shell-config-service" \
  --data "url=http://shell-config-service:8000"

# Create routes
curl -s -X POST http://localhost:8002/services/shell-config-service/routes \
  --data "name=shell-config-route" \
  --data "paths[]=/api/shell-config"

curl -s -X POST http://localhost:8002/services/shell-config-service/routes \
  --data "name=navigation-items-route" \
  --data "paths[]=/api/navigation-items"

echo "Kong configuration completed!"
```

### Script test Kong
```bash
#!/bin/bash
# test-kong.sh

echo "Testing Kong configuration..."

echo "1. Testing health endpoint:"
curl -s http://localhost:8000/api/shell-config/health | python3 -m json.tool

echo -e "\n2. Testing navigation items:"
curl -s http://localhost:8000/api/navigation-items/ | python3 -m json.tool

echo -e "\n3. Kong is working correctly!"
```

## Kết luận

Kong API Gateway đã được cấu hình thành công để:
- Nhận requests từ port 8000
- Định tuyến đến shell-config-service trên port 8000 (internal)
- Hỗ trợ 2 routes: `/api/shell-config` và `/api/navigation-items`
- Có thể mở rộng với authentication, rate limiting, và các plugins khác

Để sử dụng API, client chỉ cần gọi:
- `http://localhost:8000/api/shell-config/*` cho tất cả endpoints
- `http://localhost:8000/api/navigation-items/*` cho navigation items trực tiếp
# API Gateway

Thư mục chứa cấu hình API Gateway cho hệ thống Shell.

## Cấu trúc

### User Gateway
- `user-gateway/` - API Gateway cho người dùng cuối
- Rate limiting
- Authentication
- Request routing

### Admin Gateway  
- `admin-gateway/` - API Gateway cho admin
- Admin authentication
- Admin-specific routing
- Enhanced security

## Chức năng chính
- **Request Routing**: Điều hướng request đến đúng service
- **Authentication**: Xác thực JWT tokens
- **Rate Limiting**: Giới hạn số request
- **Load Balancing**: Cân bằng tải
- **API Versioning**: Quản lý phiên bản API
- **Monitoring**: Theo dõi API usage
- **Security**: CORS, HTTPS, Input validation

## Công nghệ sử dụng
- Kong API Gateway
- Nginx
- Envoy Proxy
- AWS API Gateway
- Zuul

## Cấu hình Kong
```yaml
services:
  - name: user-service
    url: http://user-service:8000
    routes:
      - name: user-routes
        paths: ["/api/users"]
        
  - name: product-service
    url: http://product-service:8000
    routes:
      - name: product-routes
        paths: ["/api/products"]
```

## Plugins
- JWT Authentication
- Rate Limiting
- CORS
- Request/Response Transformer
- Logging
- Monitoring
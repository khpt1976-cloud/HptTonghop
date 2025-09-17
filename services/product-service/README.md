# Product Service

Microservice quản lý sản phẩm trong hệ thống Shell.

## Chức năng chính
- CRUD sản phẩm
- Quản lý danh mục sản phẩm
- Tìm kiếm và lọc sản phẩm
- Quản lý inventory
- Pricing và promotion

## Công nghệ sử dụng
- Framework: FastAPI
- Database: PostgreSQL
- Search: Elasticsearch
- Cache: Redis
- File Storage: MinIO/S3

## API Endpoints
- GET /api/products - Danh sách sản phẩm
- POST /api/products - Tạo sản phẩm mới
- GET /api/products/{id} - Chi tiết sản phẩm
- PUT /api/products/{id} - Cập nhật sản phẩm
- DELETE /api/products/{id} - Xóa sản phẩm
- GET /api/categories - Danh mục sản phẩm

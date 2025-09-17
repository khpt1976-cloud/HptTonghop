# User Service

Microservice quản lý người dùng trong hệ thống Shell.

## Chức năng chính
- Đăng ký, đăng nhập người dùng
- Quản lý profile người dùng
- Xác thực và phân quyền
- Quản lý session

## Công nghệ sử dụng
- Framework: FastAPI/Django
- Database: PostgreSQL
- Authentication: JWT
- Cache: Redis

## API Endpoints
- POST /api/users/register - Đăng ký
- POST /api/users/login - Đăng nhập
- GET /api/users/profile - Lấy thông tin profile
- PUT /api/users/profile - Cập nhật profile
- POST /api/users/logout - Đăng xuất

## Cài đặt và chạy
```bash
cd services/user-service
pip install -r requirements.txt
python main.py
```

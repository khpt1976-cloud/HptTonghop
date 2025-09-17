# DuAnTongThe - Microservice Project with Kong API Gateway

## Tổng quan

Dự án này triển khai một hệ thống microservice với Kong API Gateway để quản lý và định tuyến các yêu cầu API. Hệ thống bao gồm:

- **Shell Config Service**: Service chính cung cấp API cho cấu hình shell
- **Kong API Gateway**: API Gateway để định tuyến và quản lý traffic
- **PostgreSQL**: Database cho cả Shell Config Service và Kong
- **Konga**: Web UI để quản lý Kong

## Kiến trúc hệ thống

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│   Client        │───▶│  Kong Gateway    │───▶│ Shell Config Service│
│                 │    │  (Port 8000)     │    │   (Port 8000)       │
└─────────────────┘    └──────────────────┘    └─────────────────────┘
                              │                           │
                              ▼                           ▼
                       ┌──────────────┐           ┌──────────────┐
                       │  Kong DB     │           │ Service DB   │
                       │ (PostgreSQL) │           │ (PostgreSQL) │
                       └──────────────┘           └──────────────┘
                              │
                              ▼
                       ┌──────────────┐
                       │    Konga     │
                       │  (Port 1337) │
                       └──────────────┘
```

## Cấu hình Ports

| Service | Internal Port | External Port | Description |
|---------|---------------|---------------|-------------|
| Kong Proxy | 8000 | 8000 | API Gateway endpoint |
| Kong Admin | 8001 | 8002 | Kong Admin API |
| Kong Admin SSL | 8444 | 8003 | Kong Admin API (SSL) |
| Shell Config Service | 8000 | 8001 | Direct service access |
| Konga | 1337 | 1337 | Kong management UI |
| Service DB | 5432 | 5432 | PostgreSQL for service |
| Kong DB | 5432 | - | PostgreSQL for Kong (internal) |

## Kong API Gateway Configuration

Kong đã được cấu hình với:
- **Service**: `shell-config-service` pointing to `http://shell-config-service:8000`
- **Routes**: 
  - `/api/shell-config` - Route tổng quát cho tất cả endpoints
  - `/api/navigation-items` - Route trực tiếp cho navigation items

### API Endpoints qua Kong

- **Health Check**: `GET http://localhost:8000/api/shell-config/health`
- **Navigation Items**: `GET http://localhost:8000/api/navigation-items/`
- **All Shell Config APIs**: `http://localhost:8000/api/shell-config/*`

## Cấu Trúc Dự Án

### 🔧 Services (Backend Microservices)
- **cart-service**: Dịch vụ giỏ hàng
- **product-service**: Dịch vụ sản phẩm
- **news-service**: Dịch vụ tin tức
- **design-calculation-service**: Dịch vụ tính toán thiết kế
- **football-service**: Dịch vụ bóng đá
- **communication-log-service**: Dịch vụ nhật ký thi công
- **chatbot-service**: Dịch vụ chatbot
- **payment-service**: Dịch vụ thanh toán
- **user-service**: Dịch vụ người dùng
- **shell-config-service**: Dịch vụ cấu hình shell (✅ Đã hoàn thành)
- **admin-service**: Dịch vụ quản trị hệ thống
- **agent-management-service**: Dịch vụ quản lý đại lý
- **agent-policy-service**: Dịch vụ chính sách đại lý

### 🎨 Frontend Applications
- **Shell Apps**: Ứng dụng chính cho người dùng và quản trị viên
- **Service Frontends**: Giao diện người dùng cho từng dịch vụ
- **Service Admins**: Giao diện quản trị cho từng dịch vụ

### 🌐 API Gateway
- **user-gateway**: API Gateway cho người dùng cuối
- **admin-gateway**: API Gateway cho quản trị viên

### 📚 Shared Libraries
- **common-models**: Các định nghĩa model dùng chung
- **utils**: Các tiện ích chung
- **config**: Cấu hình chung

### 🏗️ Infrastructure
- **kubernetes**: Cấu hình Kubernetes
- **terraform**: Mã Terraform quản lý hạ tầng
- **ansible**: Playbook Ansible cấu hình máy chủ
- **monitoring**: Cấu hình giám sát (Prometheus, Grafana)
- **logging**: Cấu hình logging (ELK Stack)

### 📖 Documentation
- **architecture**: Tài liệu kiến trúc
- **deployment**: Tài liệu triển khai

### 🔨 Scripts
- **ci-cd**: Script cho CI/CD pipelines
- **deploy**: Script triển khai
- **setup**: Script cài đặt môi trường

## Tính Năng Đã Hoàn Thành

### ✅ Shell Config Service
- FastAPI backend với PostgreSQL
- Hỗ trợ nested dropdown navigation không giới hạn cấp độ
- API RESTful đầy đủ (CRUD operations)
- Phân quyền theo role
- Docker containerization
- Tự động tạo database schema

## Bắt Đầu

### Yêu Cầu Hệ Thống
- Docker & Docker Compose
- Node.js (cho frontend applications)
- Python/Java/Go (tùy theo backend services)
- Kubernetes (cho production deployment)

### Cài Đặt Môi Trường Phát Triển
```bash
# Clone repository
git clone https://github.com/khpt1976-cloud/HptTonghop.git
cd HptTonghop

# Chạy môi trường phát triển với Docker Compose
docker-compose up -d

# Hoặc chạy từng service riêng lẻ
cd services/shell-config-service
pip install -r requirements.txt
python -m uvicorn src.main:app --reload
```

### Triển Khai
```bash
# Sử dụng script triển khai
./scripts/deploy/deploy.sh

# Hoặc triển khai với Kubernetes
kubectl apply -f infrastructure/kubernetes/
```

## Đóng Góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## Giấy Phép

Dự án này được phân phối dưới giấy phép MIT. Xem file `LICENSE` để biết thêm chi tiết.

## Liên Hệ

- Email: contact@example.com
- Website: https://example.com

# Dự Án Microservice Tổng Thể

Đây là dự án microservice được tổ chức theo kiến trúc phân tán, bao gồm các dịch vụ backend, ứng dụng frontend, và hạ tầng hỗ trợ.

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
- **shell-config-service**: Dịch vụ cấu hình shell
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

## Bắt Đầu

### Yêu Cầu Hệ Thống
- Docker & Docker Compose
- Node.js (cho frontend applications)
- Python/Java/Go (tùy theo backend services)
- Kubernetes (cho production deployment)

### Cài Đặt Môi Trường Phát Triển
```bash
# Clone repository
git clone <repository-url>
cd DuAntongthe

# Chạy môi trường phát triển với Docker Compose
docker-compose up -d

# Hoặc chạy từng service riêng lẻ
cd services/user-service
npm install
npm start
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
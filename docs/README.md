# Tài Liệu Dự Án Microservice

## Mục Lục

1. [Kiến Trúc Hệ Thống](./architecture/)
2. [Hướng Dẫn Triển Khai](./deployment/)
3. [API Documentation](#api-documentation)
4. [Hướng Dẫn Phát Triển](#development-guide)

## Tổng Quan

Dự án này sử dụng kiến trúc microservice để xây dựng một hệ thống phân tán có khả năng mở rộng cao. Hệ thống bao gồm:

- 13 microservices backend
- 27 ứng dụng frontend
- 2 API gateways
- Hạ tầng hỗ trợ (monitoring, logging, deployment)

## API Documentation

Mỗi service có API documentation riêng:

- [User Service API](../services/user-service/docs/api.md)
- [Product Service API](../services/product-service/docs/api.md)
- [Cart Service API](../services/cart-service/docs/api.md)
- [Payment Service API](../services/payment-service/docs/api.md)
- [News Service API](../services/news-service/docs/api.md)
- [Design Calculation Service API](../services/design-calculation-service/docs/api.md)
- [Football Service API](../services/football-service/docs/api.md)
- [Communication Log Service API](../services/communication-log-service/docs/api.md)
- [Chatbot Service API](../services/chatbot-service/docs/api.md)
- [Shell Config Service API](../services/shell-config-service/docs/api.md)
- [Admin Service API](../services/admin-service/docs/api.md)
- [Agent Management Service API](../services/agent-management-service/docs/api.md)
- [Agent Policy Service API](../services/agent-policy-service/docs/api.md)

## Development Guide

### Yêu Cầu Hệ Thống

- Docker & Docker Compose
- Node.js 16+
- Python 3.8+ (cho một số services)
- Java 11+ (cho một số services)
- Go 1.18+ (cho một số services)

### Cài Đặt Môi Trường

```bash
# Clone repository
git clone <repository-url>
cd DuAntongthe

# Cài đặt dependencies cho shared libraries
cd shared/utils
npm install
cd ../common-models
npm install
cd ../config
npm install

# Chạy toàn bộ hệ thống
docker-compose up -d
```

### Phát Triển Service Mới

1. Tạo thư mục service trong `services/`
2. Implement service theo chuẩn API
3. Thêm service vào `docker-compose.yml`
4. Cập nhật API Gateway routing
5. Tạo frontend tương ứng (nếu cần)

### Testing

```bash
# Chạy unit tests cho tất cả services
./scripts/ci-cd/run-tests.sh

# Chạy integration tests
./scripts/ci-cd/run-integration-tests.sh

# Chạy end-to-end tests
./scripts/ci-cd/run-e2e-tests.sh
```

### Deployment

Xem [Hướng Dẫn Triển Khai](./deployment/) để biết chi tiết về việc triển khai lên các môi trường khác nhau.

## Liên Hệ

- Team Lead: team-lead@example.com
- DevOps: devops@example.com
- Support: support@example.com
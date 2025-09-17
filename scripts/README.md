# Scripts

Thư mục chứa các scripts tự động hóa cho hệ thống Shell.

## Cấu trúc

### Deploy Scripts
- `deploy/` - Scripts triển khai
- Production deployment
- Staging deployment
- Rollback scripts

### CI/CD Scripts
- `ci-cd/` - Continuous Integration/Deployment
- Build scripts
- Test automation
- Pipeline configurations

### Setup Scripts
- `setup/` - Environment setup
- Development environment
- Database initialization
- Service configuration

## Scripts có sẵn

### Development
- `start-backend.sh` - Khởi chạy backend services
- `stop-backend.sh` - Dừng backend services
- `test-api.sh` - Test API endpoints
- `create-service-docs.sh` - Tạo documentation

### Database
- `init-db.sh` - Khởi tạo database
- `migrate-db.sh` - Chạy migrations
- `backup-db.sh` - Backup database
- `restore-db.sh` - Restore database

### Deployment
- `deploy-staging.sh` - Deploy to staging
- `deploy-production.sh` - Deploy to production
- `rollback.sh` - Rollback deployment
- `health-check.sh` - Health check services

## Sử dụng
```bash
# Make executable
chmod +x scripts/*.sh

# Run script
./scripts/start-backend.sh
```

## Environment Variables
```bash
export ENVIRONMENT=development
export DATABASE_URL=postgresql://...
export REDIS_URL=redis://...
```
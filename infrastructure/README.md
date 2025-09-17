# Infrastructure

Thư mục chứa tất cả các cấu hình infrastructure và DevOps cho hệ thống Shell.

## Cấu trúc

### Monitoring
- `monitoring/` - Prometheus, Grafana, AlertManager
- Theo dõi hiệu suất hệ thống
- Dashboard và alerting

### Logging
- `logging/` - ELK Stack (Elasticsearch, Logstash, Kibana)
- Centralized logging
- Log analysis và search

### Terraform
- `terraform/` - Infrastructure as Code
- AWS/GCP/Azure resources
- Environment provisioning

### Ansible
- `ansible/` - Configuration Management
- Server provisioning
- Application deployment

### Kubernetes
- `kubernetes/` - Container orchestration
- Deployment manifests
- Service configurations
- Ingress và networking

## Công nghệ sử dụng
- **Container**: Docker, Kubernetes
- **IaC**: Terraform, Ansible
- **Monitoring**: Prometheus, Grafana
- **Logging**: ELK Stack
- **CI/CD**: Jenkins, GitLab CI, GitHub Actions
- **Cloud**: AWS, GCP, Azure

## Setup
```bash
# Terraform
cd infrastructure/terraform
terraform init
terraform plan
terraform apply

# Ansible
cd infrastructure/ansible
ansible-playbook -i inventory site.yml

# Kubernetes
cd infrastructure/kubernetes
kubectl apply -f .
```
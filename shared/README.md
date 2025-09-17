# Shared Components

Thư mục chứa các thành phần dùng chung giữa các services trong hệ thống Shell.

## Cấu trúc

### Common Models
- `common-models/` - Data models dùng chung
- User models
- Product models  
- Response models
- Error models

### Config
- `config/` - Configuration files
- Database configs
- Redis configs
- Environment configs
- Feature flags

### Utils
- `utils/` - Utility functions
- Date/time helpers
- String utilities
- Validation helpers
- Encryption utilities
- File handling

## Chức năng chính
- **Shared Models**: Pydantic models cho API
- **Common Utilities**: Helper functions
- **Configuration**: Centralized config management
- **Constants**: Shared constants và enums
- **Validators**: Input validation logic
- **Decorators**: Common decorators
- **Middleware**: Shared middleware components

## Sử dụng
```python
# Import shared models
from shared.common_models import UserModel, ProductModel

# Import utilities
from shared.utils import hash_password, validate_email

# Import config
from shared.config import get_database_url, get_redis_url
```

## Cài đặt
```bash
# Install as package
pip install -e shared/

# Or add to requirements.txt
-e ./shared
```
# Frontend Applications

Thư mục chứa tất cả các ứng dụng frontend trong hệ thống Shell.

## Cấu trúc

### Admin Frontends
- `shell-app-admin/` - Ứng dụng quản trị chính
- `shell-config-admin-frontend/` - Quản lý cấu hình shell
- `user-service-admin/` - Quản lý người dùng
- `product-service-admin/` - Quản lý sản phẩm
- `cart-service-admin/` - Quản lý đơn hàng
- `news-service-admin/` - Quản lý tin tức
- `payment-service-admin/` - Quản lý thanh toán
- `agent-management-admin/` - Quản lý đại lý
- `admin-service-admin/` - Quản trị hệ thống
- `communication-log-admin/` - Quản lý log giao tiếp
- `football-service-admin/` - Quản lý bóng đá
- `chatbot-service-admin/` - Quản lý chatbot
- `design-calculation-admin/` - Quản lý tính toán thiết kế
- `agent-policy-admin/` - Quản lý chính sách đại lý

### User Frontends
- `shell-app-user/` - Ứng dụng người dùng chính
- `user-service-frontend/` - Giao diện người dùng
- `product-service-frontend/` - Giao diện sản phẩm
- `cart-service-frontend/` - Giao diện giỏ hàng
- `news-service-frontend/` - Giao diện tin tức
- `payment-service-frontend/` - Giao diện thanh toán
- `agent-management-frontend/` - Giao diện đại lý
- `communication-log-frontend/` - Giao diện log giao tiếp
- `football-service-frontend/` - Giao diện bóng đá
- `chatbot-service-frontend/` - Giao diện chatbot
- `design-calculation-frontend/` - Giao diện tính toán thiết kế
- `agent-policy-frontend/` - Giao diện chính sách đại lý

## Công nghệ sử dụng
- React.js / Vue.js / Angular
- TypeScript
- Tailwind CSS / Material-UI
- State Management: Redux / Vuex / NgRx
- Build Tool: Vite / Webpack
- Testing: Jest, Cypress

## Development
```bash
cd frontend/[app-name]
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Deploy
```bash
npm run deploy
```
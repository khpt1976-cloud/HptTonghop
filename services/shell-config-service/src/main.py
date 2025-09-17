from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

try:
    from .config import engine, Base
    from .api.config_controller import router as config_router
except ImportError:
    # For testing when running as standalone module
    from config import engine, Base
    from api.config_controller import router as config_router

# Tạo tất cả bảng trong database
Base.metadata.create_all(bind=engine)

# Khởi tạo ứng dụng FastAPI
app = FastAPI(
    title="Shell Config Service",
    description="Service quản lý cấu hình thanh điều hướng cho hệ thống Micro-Frontend",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Cấu hình CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Trong production nên chỉ định cụ thể các domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Bao gồm router từ config_controller
app.include_router(config_router, tags=["Navigation Items"])

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Shell Config Service is running",
        "version": "1.0.0",
        "docs": "/docs"
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
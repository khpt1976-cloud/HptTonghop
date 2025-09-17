from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..config import get_db
from ..models.app_config import (
    NavigationItemCreate, 
    NavigationItemUpdate, 
    NavigationItemResponse
)
from ..repositories.config_repository import ConfigRepository

router = APIRouter()


def get_repository(db: Session = Depends(get_db)) -> ConfigRepository:
    """Dependency để lấy ConfigRepository instance"""
    return ConfigRepository(db)


@router.post("/api/navigation-items/", response_model=NavigationItemResponse, status_code=status.HTTP_201_CREATED)
async def create_navigation_item(
    item: NavigationItemCreate,
    repository: ConfigRepository = Depends(get_repository)
):
    """Tạo một mục điều hướng mới"""
    try:
        db_item = repository.create_navigation_item(item)
        return NavigationItemResponse.model_validate(db_item)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Không thể tạo navigation item: {str(e)}"
        )


@router.get("/api/navigation-items/", response_model=List[NavigationItemResponse])
async def get_all_navigation_items(
    repository: ConfigRepository = Depends(get_repository)
):
    """Lấy toàn bộ cấu trúc điều hướng dạng cây (bao gồm các cấp dropdown lồng nhau)"""
    try:
        items = repository.get_navigation_items_tree()
        return [NavigationItemResponse.model_validate(item) for item in items]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Không thể lấy danh sách navigation items: {str(e)}"
        )


@router.get("/api/navigation-items/role/{role_name}", response_model=List[NavigationItemResponse])
async def get_navigation_items_by_role(
    role_name: str,
    repository: ConfigRepository = Depends(get_repository)
):
    """Lấy cấu trúc điều hướng dạng cây theo vai trò (bao gồm các cấp dropdown lồng nhau)"""
    try:
        items = repository.get_navigation_items_by_role(role_name)
        return [NavigationItemResponse.model_validate(item) for item in items]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Không thể lấy navigation items cho role {role_name}: {str(e)}"
        )


@router.get("/api/navigation-items/{item_id}", response_model=NavigationItemResponse)
async def get_navigation_item(
    item_id: int,
    repository: ConfigRepository = Depends(get_repository)
):
    """Lấy chi tiết một mục điều hướng"""
    db_item = repository.get_navigation_item(item_id)
    if not db_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Navigation item với ID {item_id} không tồn tại"
        )
    
    return NavigationItemResponse.model_validate(db_item)


@router.put("/api/navigation-items/{item_id}", response_model=NavigationItemResponse)
async def update_navigation_item(
    item_id: int,
    item_update: NavigationItemUpdate,
    repository: ConfigRepository = Depends(get_repository)
):
    """Cập nhật một mục điều hướng"""
    db_item = repository.update_navigation_item(item_id, item_update)
    if not db_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Navigation item với ID {item_id} không tồn tại"
        )
    
    return NavigationItemResponse.model_validate(db_item)


@router.delete("/api/navigation-items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_navigation_item(
    item_id: int,
    repository: ConfigRepository = Depends(get_repository)
):
    """Xóa một mục điều hướng và tất cả children của nó"""
    success = repository.delete_navigation_item(item_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Navigation item với ID {item_id} không tồn tại"
        )


# Health check endpoint
@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "shell-config-service"}
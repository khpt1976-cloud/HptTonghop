from typing import List, Optional
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from pydantic import BaseModel, ConfigDict

try:
    from ..config import Base
except ImportError:
    # For testing when running as standalone module
    from config import Base


class NavigationItem(Base):
    """SQLAlchemy model cho navigation items với hỗ trợ cấu trúc cây"""
    __tablename__ = "navigation_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    path = Column(String, nullable=False)
    microfrontend_url = Column(String, nullable=True)
    parent_id = Column(Integer, ForeignKey("navigation_items.id"), nullable=True)
    display_order = Column(Integer, default=0)
    role = Column(String, nullable=False)

    # Mối quan hệ self-referential để hỗ trợ cấu trúc cây
    children = relationship(
        "NavigationItem",
        back_populates="parent",
        cascade="all, delete-orphan"
    )
    parent = relationship(
        "NavigationItem",
        back_populates="children",
        remote_side=[id]
    )


# Pydantic schemas
class NavigationItemBase(BaseModel):
    """Base schema cho NavigationItem"""
    name: str
    path: str
    microfrontend_url: Optional[str] = None
    parent_id: Optional[int] = None
    display_order: int = 0
    role: str


class NavigationItemCreate(NavigationItemBase):
    """Schema để tạo NavigationItem mới"""
    pass


class NavigationItemUpdate(BaseModel):
    """Schema để cập nhật NavigationItem"""
    name: Optional[str] = None
    path: Optional[str] = None
    microfrontend_url: Optional[str] = None
    parent_id: Optional[int] = None
    display_order: Optional[int] = None
    role: Optional[str] = None


class NavigationItemResponse(NavigationItemBase):
    """Schema response với hỗ trợ cấu trúc cây đệ quy"""
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    children: List["NavigationItemResponse"] = []


# Cập nhật forward reference cho recursive model
NavigationItemResponse.model_rebuild()
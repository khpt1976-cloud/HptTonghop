from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_
from ..models.app_config import NavigationItem, NavigationItemCreate, NavigationItemUpdate


class ConfigRepository:
    """Repository class để thực hiện các thao tác CRUD với NavigationItem"""

    def __init__(self, db: Session):
        self.db = db

    def create_navigation_item(self, item: NavigationItemCreate) -> NavigationItem:
        """Tạo một navigation item mới"""
        db_item = NavigationItem(**item.model_dump())
        self.db.add(db_item)
        self.db.commit()
        self.db.refresh(db_item)
        return db_item

    def get_navigation_item(self, item_id: int) -> Optional[NavigationItem]:
        """Lấy một navigation item theo ID"""
        return self.db.query(NavigationItem).filter(NavigationItem.id == item_id).first()

    def get_all_navigation_items(self) -> List[NavigationItem]:
        """Lấy tất cả navigation items và sắp xếp theo display_order"""
        return self.db.query(NavigationItem).order_by(NavigationItem.display_order).all()

    def get_navigation_items_by_role(self, role: str) -> List[NavigationItem]:
        """
        Lấy cấu trúc cây đệ quy của navigation items theo role
        Trả về chỉ các root items (parent_id = None), 
        các children sẽ được load thông qua relationship
        """
        # Lấy tất cả items của role này
        all_items = (
            self.db.query(NavigationItem)
            .filter(NavigationItem.role == role)
            .order_by(NavigationItem.display_order)
            .all()
        )
        
        # Tạo dictionary để mapping nhanh
        items_dict = {item.id: item for item in all_items}
        
        # Xây dựng cấu trúc cây
        root_items = []
        for item in all_items:
            if item.parent_id is None:
                root_items.append(item)
            else:
                parent = items_dict.get(item.parent_id)
                if parent:
                    # Đảm bảo children list được khởi tạo
                    if not hasattr(parent, '_children_list'):
                        parent._children_list = []
                    parent._children_list.append(item)
        
        # Sắp xếp children theo display_order và gán vào relationship
        for item in all_items:
            if hasattr(item, '_children_list'):
                item._children_list.sort(key=lambda x: x.display_order)
                # Gán vào relationship để Pydantic có thể serialize
                item.children = item._children_list
        
        return sorted(root_items, key=lambda x: x.display_order)

    def get_root_navigation_items(self) -> List[NavigationItem]:
        """Lấy tất cả root navigation items (parent_id = None)"""
        return (
            self.db.query(NavigationItem)
            .filter(NavigationItem.parent_id.is_(None))
            .order_by(NavigationItem.display_order)
            .all()
        )

    def get_children_navigation_items(self, parent_id: int) -> List[NavigationItem]:
        """Lấy tất cả children của một navigation item"""
        return (
            self.db.query(NavigationItem)
            .filter(NavigationItem.parent_id == parent_id)
            .order_by(NavigationItem.display_order)
            .all()
        )

    def update_navigation_item(self, item_id: int, item_update: NavigationItemUpdate) -> Optional[NavigationItem]:
        """Cập nhật một navigation item"""
        db_item = self.get_navigation_item(item_id)
        if not db_item:
            return None
        
        update_data = item_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_item, field, value)
        
        self.db.commit()
        self.db.refresh(db_item)
        return db_item

    def delete_navigation_item(self, item_id: int) -> bool:
        """Xóa một navigation item và tất cả children của nó"""
        db_item = self.get_navigation_item(item_id)
        if not db_item:
            return False
        
        self.db.delete(db_item)
        self.db.commit()
        return True

    def get_navigation_items_tree(self) -> List[NavigationItem]:
        """
        Lấy toàn bộ cấu trúc cây navigation items
        Trả về chỉ các root items, children được load qua relationship
        """
        # Lấy tất cả items
        all_items = self.get_all_navigation_items()
        
        # Tạo dictionary để mapping nhanh
        items_dict = {item.id: item for item in all_items}
        
        # Xây dựng cấu trúc cây
        root_items = []
        for item in all_items:
            if item.parent_id is None:
                root_items.append(item)
            else:
                parent = items_dict.get(item.parent_id)
                if parent:
                    # Đảm bảo children list được khởi tạo
                    if not hasattr(parent, '_children_list'):
                        parent._children_list = []
                    parent._children_list.append(item)
        
        # Sắp xếp children theo display_order và gán vào relationship
        for item in all_items:
            if hasattr(item, '_children_list'):
                item._children_list.sort(key=lambda x: x.display_order)
                # Gán vào relationship để Pydantic có thể serialize
                item.children = item._children_list
        
        return sorted(root_items, key=lambda x: x.display_order)
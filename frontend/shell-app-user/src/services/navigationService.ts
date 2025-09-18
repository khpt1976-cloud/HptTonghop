import apiClient from './api';

export interface NavigationItem {
  id: string;
  name: string;
  path: string;
  icon?: string;
  parentId?: string;
  order: number;
  isActive: boolean;
  roles?: string[];
  children?: NavigationItem[];
}

export interface NavigationResponse {
  success: boolean;
  data: NavigationItem[];
  message?: string;
}

class NavigationService {
  // Lấy danh sách navigation items cho user
  async getUserNavigationItems(): Promise<NavigationItem[]> {
    try {
      const response = await apiClient.get<NavigationResponse>('/api/shell-config/navigation/user');
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to fetch navigation items');
    } catch (error) {
      console.error('Error fetching user navigation items:', error);
      // Trả về navigation mặc định nếu API không khả dụng
      return this.getDefaultNavigationItems();
    }
  }

  // Navigation items mặc định khi API không khả dụng
  private getDefaultNavigationItems(): NavigationItem[] {
    return [
      {
        id: '1',
        name: 'Home',
        path: '/',
        icon: 'HomeOutlined',
        order: 1,
        isActive: true,
      },
      {
        id: '2',
        name: 'Profile',
        path: '/profile',
        icon: 'UserOutlined',
        order: 2,
        isActive: true,
      },
    ];
  }

  // Lọc navigation items dựa trên quyền của user
  filterNavigationByRole(items: NavigationItem[], userRoles: string[]): NavigationItem[] {
    return items.filter(item => {
      if (!item.roles || item.roles.length === 0) {
        return true; // Không có quyền hạn yêu cầu
      }
      return item.roles.some(role => userRoles.includes(role));
    });
  }

  // Xây dựng cây navigation từ danh sách phẳng
  buildNavigationTree(items: NavigationItem[]): NavigationItem[] {
    const itemMap = new Map<string, NavigationItem>();
    const rootItems: NavigationItem[] = [];

    // Tạo map của tất cả items
    items.forEach(item => {
      itemMap.set(item.id, { ...item, children: [] });
    });

    // Xây dựng cây
    items.forEach(item => {
      const currentItem = itemMap.get(item.id)!;
      if (item.parentId && itemMap.has(item.parentId)) {
        const parent = itemMap.get(item.parentId)!;
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(currentItem);
      } else {
        rootItems.push(currentItem);
      }
    });

    // Sắp xếp theo order
    const sortByOrder = (items: NavigationItem[]) => {
      items.sort((a, b) => a.order - b.order);
      items.forEach(item => {
        if (item.children && item.children.length > 0) {
          sortByOrder(item.children);
        }
      });
    };

    sortByOrder(rootItems);
    return rootItems;
  }
}

export default new NavigationService();
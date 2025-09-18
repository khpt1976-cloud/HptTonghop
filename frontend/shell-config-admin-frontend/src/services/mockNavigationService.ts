import { NavigationItem, NavigationFormData, NavigationType } from '../types/navigation';

// Mock data for testing
let mockNavigationItems: NavigationItem[] = [
  {
    id: '1',
    name: 'Dashboard',
    path: '/dashboard',
    icon: 'DashboardOutlined',
    order: 1,
    isVisible: true,
    parentId: undefined,
    type: 'menu' as NavigationType,
    permissions: ['admin', 'user'],
    children: [
      {
        id: '2',
        name: 'Thống kê',
        path: '/dashboard/stats',
        icon: 'BarChartOutlined',
        order: 1,
        isVisible: true,
        parentId: '1',
        type: 'page' as NavigationType,
        permissions: ['admin', 'user'],
        children: []
      },
      {
        id: '3',
        name: 'Báo cáo',
        path: '/dashboard/reports',
        icon: 'FileTextOutlined',
        order: 2,
        isVisible: true,
        parentId: '1',
        type: 'page' as NavigationType,
        permissions: ['admin'],
        children: []
      }
    ]
  },
  {
    id: '4',
    name: 'Quản lý người dùng',
    path: '/users',
    icon: 'UserOutlined',
    order: 2,
    isVisible: true,
    parentId: undefined,
    type: 'menu' as NavigationType,
    permissions: ['admin'],
    children: [
      {
        id: '5',
        name: 'Danh sách người dùng',
        path: '/users/list',
        icon: 'TeamOutlined',
        order: 1,
        isVisible: true,
        parentId: '4',
        type: 'page' as NavigationType,
        permissions: ['admin'],
        children: []
      },
      {
        id: '6',
        name: 'Phân quyền',
        path: '/users/permissions',
        icon: 'SafetyOutlined',
        order: 2,
        isVisible: true,
        parentId: '4',
        type: 'page' as NavigationType,
        permissions: ['admin'],
        children: []
      }
    ]
  },
  {
    id: '7',
    name: 'Cài đặt',
    path: '/settings',
    icon: 'SettingOutlined',
    order: 3,
    isVisible: true,
    parentId: undefined,
    type: 'page' as NavigationType,
    permissions: ['admin', 'user'],
    children: []
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API service
export const mockNavigationService = {
  // Get all navigation items
  async getNavigationItems(): Promise<NavigationItem[]> {
    await delay(500); // Simulate network delay
    return [...mockNavigationItems];
  },

  // Get navigation item by ID
  async getNavigationItem(id: string): Promise<NavigationItem | null> {
    await delay(300);
    const findItem = (items: NavigationItem[]): NavigationItem | null => {
      for (const item of items) {
        if (item.id === id) return item;
        if (item.children) {
          const found = findItem(item.children);
          if (found) return found;
        }
      }
      return null;
    };
    return findItem(mockNavigationItems);
  },

  // Create new navigation item
  async createNavigationItem(data: NavigationFormData): Promise<NavigationItem> {
    console.log('Mock service: Creating navigation item with data:', data);
    await delay(800);
    
    // Simulate validation error
    if (!data.name || !data.path) {
      console.error('Mock service: Missing required fields', { name: data.name, path: data.path });
      throw new Error('Name and Path are required');
    }

    // Parse permissions string to array
    let permissions: string[] = [];
    if (data.permissions && Array.isArray(data.permissions)) {
      permissions = data.permissions;
    } else if (typeof data.permissions === 'string') {
      permissions = (data.permissions as string).split(',').map((p: string) => p.trim()).filter((p: string) => p);
    }

    const newItem: NavigationItem = {
      id: Date.now().toString(),
      name: data.name,
      path: data.path,
      icon: data.icon || 'MenuOutlined',
      order: data.order || 999,
      isVisible: data.isVisible !== undefined ? data.isVisible : true,
      parentId: data.parentId || undefined,
      type: data.type || 'menu',
      permissions: permissions,
      children: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (data.parentId) {
      // Add to parent's children
      const addToParent = (items: NavigationItem[]): boolean => {
        for (const item of items) {
          if (item.id === data.parentId) {
            item.children = item.children || [];
            item.children.push(newItem);
            return true;
          }
          if (item.children && addToParent(item.children)) {
            return true;
          }
        }
        return false;
      };
      addToParent(mockNavigationItems);
    } else {
      // Add as root item
      mockNavigationItems.push(newItem);
    }

    return newItem;
  },

  // Update navigation item
  async updateNavigationItem(id: string, data: Partial<NavigationFormData>): Promise<NavigationItem> {
    await delay(600);

    const updateItem = (items: NavigationItem[]): NavigationItem | null => {
      for (const item of items) {
        if (item.id === id) {
          // Parse permissions if it's a string
          let permissions = item.permissions;
          if (data.permissions) {
            if (Array.isArray(data.permissions)) {
              permissions = data.permissions;
            } else if (typeof data.permissions === 'string') {
              permissions = (data.permissions as string).split(',').map((p: string) => p.trim()).filter((p: string) => p);
            }
          }

          Object.assign(item, {
            ...data,
            permissions,
            updatedAt: new Date().toISOString()
          });
          return item;
        }
        if (item.children) {
          const updated = updateItem(item.children);
          if (updated) return updated;
        }
      }
      return null;
    };

    const updatedItem = updateItem(mockNavigationItems);
    if (!updatedItem) {
      throw new Error('Navigation item not found');
    }

    return updatedItem;
  },

  // Delete navigation item
  async deleteNavigationItem(id: string): Promise<void> {
    await delay(400);

    const deleteItem = (items: NavigationItem[], parentArray: NavigationItem[]): boolean => {
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === id) {
          parentArray.splice(i, 1);
          return true;
        }
        if (items[i].children && deleteItem(items[i].children!, items[i].children!)) {
          return true;
        }
      }
      return false;
    };

    const deleted = deleteItem(mockNavigationItems, mockNavigationItems);
    if (!deleted) {
      throw new Error('Navigation item not found');
    }
  },

  // Validate path uniqueness
  async validatePath(path: string, excludeId?: string): Promise<boolean> {
    await delay(200);
    
    const checkPath = (navItems: NavigationItem[]): boolean => {
      for (const item of navItems) {
        if (item.id !== excludeId && item.path === path) {
          return false; // Path already exists
        }
        if (item.children && !checkPath(item.children)) {
          return false;
        }
      }
      return true;
    };

    return checkPath(mockNavigationItems);
  },

  // Get navigation items by role (mock implementation)
  async getNavigationItemsByRole(role: string): Promise<NavigationItem[]> {
    await delay(400);
    // For testing, return all items for admin, limited for user
    if (role === 'admin') {
      return [...mockNavigationItems];
    } else {
      return mockNavigationItems.filter(item => item.id !== '4'); // Hide user management for non-admin
    }
  }
};

export default mockNavigationService;
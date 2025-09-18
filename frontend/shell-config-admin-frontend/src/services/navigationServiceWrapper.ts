import NavigationService from './navigationService';
import mockNavigationService from './mockNavigationService';
import {
  NavigationItem,
  NavigationFormData,
  NavigationListResponse,
  NavigationQueryParams,
} from '../types/navigation';

// Check if we should use mock service (when backend is not available)
const USE_MOCK_SERVICE = import.meta.env.VITE_USE_MOCK_API === 'true' || 
                        import.meta.env.DEV; // Use mock in development by default

// Adapter to convert between different data formats
const adaptNavigationFormData = (data: NavigationFormData) => ({
  name: data.name,
  path: data.path,
  icon: data.icon,
  order: data.order,
  isVisible: data.isVisible,
  parentId: data.parentId,
  type: data.type,
  permissions: data.permissions,
});

export class NavigationServiceWrapper {
  /**
   * Get all navigation items with optional filtering
   */
  static async getNavigationItems(
    params?: NavigationQueryParams
  ): Promise<NavigationListResponse> {
    if (USE_MOCK_SERVICE) {
      const items = await mockNavigationService.getNavigationItems();
      return {
        items,
        total: items.length,
        page: 1,
        pageSize: items.length,
        hasMore: false,
      };
    }
    return NavigationService.getNavigationItems(params);
  }

  /**
   * Get navigation items in tree structure
   */
  static async getNavigationTree(): Promise<NavigationItem[]> {
    if (USE_MOCK_SERVICE) {
      return mockNavigationService.getNavigationItems();
    }
    return NavigationService.getNavigationTree();
  }

  /**
   * Get a single navigation item by ID
   */
  static async getNavigationItem(id: string): Promise<NavigationItem> {
    if (USE_MOCK_SERVICE) {
      const item = await mockNavigationService.getNavigationItem(id);
      if (!item) {
        throw new Error('Navigation item not found');
      }
      return item;
    }
    return NavigationService.getNavigationItem(id);
  }

  /**
   * Create a new navigation item
   */
  static async createNavigationItem(
    data: NavigationFormData
  ): Promise<NavigationItem> {
    if (USE_MOCK_SERVICE) {
      return mockNavigationService.createNavigationItem(data);
    }
    return NavigationService.createNavigationItem(data);
  }

  /**
   * Update an existing navigation item
   */
  static async updateNavigationItem(
    id: string,
    data: Partial<NavigationFormData>
  ): Promise<NavigationItem> {
    if (USE_MOCK_SERVICE) {
      return mockNavigationService.updateNavigationItem(id, data);
    }
    return NavigationService.updateNavigationItem(id, data);
  }

  /**
   * Delete a navigation item
   */
  static async deleteNavigationItem(id: string): Promise<void> {
    if (USE_MOCK_SERVICE) {
      return mockNavigationService.deleteNavigationItem(id);
    }
    return NavigationService.deleteNavigationItem(id);
  }

  /**
   * Bulk delete navigation items
   */
  static async bulkDeleteNavigationItems(ids: string[]): Promise<void> {
    if (USE_MOCK_SERVICE) {
      // Mock bulk delete by deleting one by one
      for (const id of ids) {
        await mockNavigationService.deleteNavigationItem(id);
      }
      return;
    }
    return NavigationService.bulkDeleteNavigationItems(ids);
  }

  /**
   * Reorder navigation items
   */
  static async reorderNavigationItems(
    items: Array<{ id: string; order: number }>
  ): Promise<void> {
    if (USE_MOCK_SERVICE) {
      // Mock reorder - update order for each item
      for (const item of items) {
        await mockNavigationService.updateNavigationItem(item.id, { order: item.order });
      }
      return;
    }
    return NavigationService.reorderNavigationItems(items);
  }

  /**
   * Get available parent navigation items (for dropdown)
   */
  static async getParentOptions(excludeId?: string): Promise<NavigationItem[]> {
    if (USE_MOCK_SERVICE) {
      const items = await mockNavigationService.getNavigationItems();
      // Filter out the excluded item and return only root items
      return items.filter(item => item.id !== excludeId && !item.parentId);
    }
    return NavigationService.getParentOptions(excludeId);
  }

  /**
   * Validate navigation path
   */
  static async validatePath(path: string, excludeId?: string): Promise<boolean> {
    if (USE_MOCK_SERVICE) {
      // Mock validation - check if path already exists
      const items = await mockNavigationService.getNavigationItems();
      const checkPath = (navItems: NavigationItem[]): boolean => {
        for (const item of navItems) {
          if (item.id !== excludeId && item.url === path) {
            return false; // Path already exists
          }
          if (item.children && !checkPath(item.children)) {
            return false;
          }
        }
        return true;
      };
      return checkPath(items);
    }
    return NavigationService.validatePath(path, excludeId);
  }

  /**
   * Get navigation items by role (mock only for now)
   */
  static async getNavigationItemsByRole(role: string): Promise<NavigationItem[]> {
    if (USE_MOCK_SERVICE) {
      return mockNavigationService.getNavigationItemsByRole(role);
    }
    // For real API, this would be implemented in the backend
    return this.getNavigationTree();
  }
}

export default NavigationServiceWrapper;
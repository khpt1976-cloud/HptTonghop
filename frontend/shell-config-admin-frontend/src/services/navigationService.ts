import apiClient from './api';
import {
  NavigationItem,
  NavigationFormData,
  NavigationListResponse,
  NavigationQueryParams,
  ApiResponse,
} from '../types/navigation';

const NAVIGATION_ENDPOINT = '/shell-config/navigation-items';

export class NavigationService {
  /**
   * Get all navigation items with optional filtering
   */
  static async getNavigationItems(
    params?: NavigationQueryParams
  ): Promise<NavigationListResponse> {
    try {
      const response = await apiClient.get(NAVIGATION_ENDPOINT, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching navigation items:', error);
      throw error;
    }
  }

  /**
   * Get navigation items in tree structure
   */
  static async getNavigationTree(): Promise<NavigationItem[]> {
    try {
      const response = await apiClient.get(`${NAVIGATION_ENDPOINT}/tree`);
      return response.data.items || [];
    } catch (error) {
      console.error('Error fetching navigation tree:', error);
      throw error;
    }
  }

  /**
   * Get a single navigation item by ID
   */
  static async getNavigationItem(id: string): Promise<NavigationItem> {
    try {
      const response = await apiClient.get(`${NAVIGATION_ENDPOINT}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching navigation item:', error);
      throw error;
    }
  }

  /**
   * Create a new navigation item
   */
  static async createNavigationItem(
    data: NavigationFormData
  ): Promise<NavigationItem> {
    try {
      const response = await apiClient.post(NAVIGATION_ENDPOINT, data);
      return response.data;
    } catch (error) {
      console.error('Error creating navigation item:', error);
      throw error;
    }
  }

  /**
   * Update an existing navigation item
   */
  static async updateNavigationItem(
    id: string,
    data: Partial<NavigationFormData>
  ): Promise<NavigationItem> {
    try {
      const response = await apiClient.put(`${NAVIGATION_ENDPOINT}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating navigation item:', error);
      throw error;
    }
  }

  /**
   * Delete a navigation item
   */
  static async deleteNavigationItem(id: string): Promise<void> {
    try {
      await apiClient.delete(`${NAVIGATION_ENDPOINT}/${id}`);
    } catch (error) {
      console.error('Error deleting navigation item:', error);
      throw error;
    }
  }

  /**
   * Bulk delete navigation items
   */
  static async bulkDeleteNavigationItems(ids: string[]): Promise<void> {
    try {
      await apiClient.delete(NAVIGATION_ENDPOINT, {
        data: { ids },
      });
    } catch (error) {
      console.error('Error bulk deleting navigation items:', error);
      throw error;
    }
  }

  /**
   * Reorder navigation items
   */
  static async reorderNavigationItems(
    items: Array<{ id: string; order: number }>
  ): Promise<void> {
    try {
      await apiClient.patch(`${NAVIGATION_ENDPOINT}/reorder`, { items });
    } catch (error) {
      console.error('Error reordering navigation items:', error);
      throw error;
    }
  }

  /**
   * Get available parent navigation items (for dropdown)
   */
  static async getParentOptions(excludeId?: string): Promise<NavigationItem[]> {
    try {
      const params = excludeId ? { exclude: excludeId } : {};
      const response = await apiClient.get(`${NAVIGATION_ENDPOINT}/parents`, {
        params,
      });
      return response.data.items || [];
    } catch (error) {
      console.error('Error fetching parent options:', error);
      throw error;
    }
  }

  /**
   * Validate navigation path
   */
  static async validatePath(path: string, excludeId?: string): Promise<boolean> {
    try {
      const params = { path, ...(excludeId && { exclude: excludeId }) };
      const response = await apiClient.get(`${NAVIGATION_ENDPOINT}/validate-path`, {
        params,
      });
      return response.data.isValid;
    } catch (error) {
      console.error('Error validating path:', error);
      return false;
    }
  }
}

export default NavigationService;
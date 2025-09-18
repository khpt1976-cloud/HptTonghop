export interface NavigationItem {
  id: string;
  name: string;
  path: string;
  url?: string;
  icon?: string;
  order: number;
  isVisible: boolean;
  parentId?: string;
  type: NavigationType;
  permissions?: string[];
  children?: NavigationItem[];
  createdAt?: string;
  updatedAt?: string;
}

export type NavigationType = 'menu' | 'page' | 'link' | 'divider';

export interface NavigationFormData {
  name: string;
  path: string;
  icon?: string;
  order: number;
  isVisible: boolean;
  parentId?: string;
  type: NavigationType;
  permissions?: string[];
}

export interface NavigationTreeNode extends NavigationItem {
  key: string;
  title: string;
  children?: NavigationTreeNode[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface NavigationListResponse {
  items: NavigationItem[];
  total: number;
  page?: number;
  pageSize?: number;
  hasMore?: boolean;
}

export interface NavigationQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  parentId?: string;
  type?: NavigationType;
  isVisible?: boolean;
}
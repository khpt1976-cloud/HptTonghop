import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/${API_VERSION}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: any) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add request timestamp
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url} at ${new Date().toISOString()}`);
    
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`[API Response] ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('[API Response Error]', error);
    
    // Handle common error cases
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Forbidden
      console.error('Access forbidden');
    } else if (error.response?.status >= 500) {
      // Server error
      console.error('Server error occurred');
    }
    
    return Promise.reject(error);
  }
);

// API service methods
export const apiService = {
  // Generic methods
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.get(url, config),
  
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.post(url, data, config),
  
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.put(url, data, config),
  
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.patch(url, data, config),
  
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    apiClient.delete(url, config),

  // Specific API endpoints
  auth: {
    login: (credentials: { username: string; password: string }) =>
      apiService.post('/auth/login', credentials),
    
    logout: () =>
      apiService.post('/auth/logout'),
    
    refresh: () =>
      apiService.post('/auth/refresh'),
    
    profile: () =>
      apiService.get('/auth/profile'),
  },

  users: {
    list: (params?: any) =>
      apiService.get('/users', { params }),
    
    get: (id: string) =>
      apiService.get(`/users/${id}`),
    
    create: (userData: any) =>
      apiService.post('/users', userData),
    
    update: (id: string, userData: any) =>
      apiService.put(`/users/${id}`, userData),
    
    delete: (id: string) =>
      apiService.delete(`/users/${id}`),
  },

  config: {
    list: () =>
      apiService.get('/config'),
    
    get: (key: string) =>
      apiService.get(`/config/${key}`),
    
    update: (key: string, value: any) =>
      apiService.put(`/config/${key}`, { value }),
  },

  // Health check
  health: () =>
    apiService.get('/health'),
};

export default apiClient;
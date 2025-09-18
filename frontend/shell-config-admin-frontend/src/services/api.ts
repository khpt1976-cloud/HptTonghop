import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { message } from 'antd';

// API Base Configuration
// const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000';
const KONG_GATEWAY_URL = (import.meta as any).env?.VITE_KONG_GATEWAY_URL || 'http://localhost:8000';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: KONG_GATEWAY_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add authentication token if available
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add language header
    const language = localStorage.getItem('shell-config-language') || 'vi';
    config.headers['Accept-Language'] = language;

    console.log('API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      data: config.data,
    });

    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('Response Error:', error);

    // Handle common error cases
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          message.error('Unauthorized access. Please login again.');
          // Redirect to login or clear auth token
          localStorage.removeItem('auth-token');
          break;
        case 403:
          message.error('Access forbidden. You do not have permission.');
          break;
        case 404:
          message.error('Resource not found.');
          break;
        case 500:
          message.error('Internal server error. Please try again later.');
          break;
        default:
          message.error(data?.message || `Error: ${status}`);
      }
    } else if (error.request) {
      message.error('Network error. Please check your connection.');
    } else {
      message.error('An unexpected error occurred.');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
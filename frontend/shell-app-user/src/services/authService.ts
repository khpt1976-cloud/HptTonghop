import apiClient from './api';

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  roles: string[];
  avatar?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
    refreshToken: string;
  };
  message?: string;
}

class AuthService {
  // Đăng nhập
  async login(credentials: LoginRequest): Promise<{ user: User; token: string }> {
    try {
      const response = await apiClient.post<LoginResponse>('/api/auth/login', credentials);
      if (response.data.success) {
        const { user, token, refreshToken } = response.data.data;
        
        // Lưu thông tin vào localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        
        return { user, token };
      }
      throw new Error(response.data.message || 'Login failed');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Đăng xuất
  async logout(): Promise<void> {
    try {
      await apiClient.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Xóa thông tin khỏi localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  // Lấy thông tin user hiện tại
  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  // Kiểm tra xem user đã đăng nhập chưa
  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  // Lấy token hiện tại
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Refresh token
  async refreshToken(): Promise<string> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post<LoginResponse>('/api/auth/refresh', {
        refreshToken,
      });

      if (response.data.success) {
        const { token } = response.data.data;
        localStorage.setItem('authToken', token);
        return token;
      }
      throw new Error(response.data.message || 'Token refresh failed');
    } catch (error) {
      console.error('Token refresh error:', error);
      this.logout();
      throw error;
    }
  }

  // Kiểm tra quyền hạn
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.roles?.includes(role) || false;
  }

  // Kiểm tra có ít nhất một trong các quyền hạn
  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    if (!user?.roles) return false;
    return roles.some(role => user.roles.includes(role));
  }
}

export default new AuthService();
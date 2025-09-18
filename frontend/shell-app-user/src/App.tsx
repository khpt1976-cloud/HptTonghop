import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import enUS from 'antd/locale/en_US';
import { useTranslation } from 'react-i18next';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import authService from './services/authService';
import './i18n';

const App: React.FC = () => {
  const { i18n } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập khi ứng dụng khởi động
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Xác định locale cho Ant Design dựa trên ngôn ngữ hiện tại
  const getAntdLocale = () => {
    return i18n.language === 'vi' ? viVN : enUS;
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        Đang tải...
      </div>
    );
  }

  return (
    <ConfigProvider locale={getAntdLocale()}>
      <Router>
        <Routes>
          {!isAuthenticated ? (
            <>
              <Route
                path="/login"
                element={<LoginPage onLogin={handleLogin} />}
              />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            <Route
              path="/"
              element={<MainLayout onLogout={handleLogout} />}
            >
              <Route index element={<HomePage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          )}
        </Routes>
      </Router>
    </ConfigProvider>
  );
};

export default App;

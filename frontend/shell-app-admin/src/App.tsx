import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { useTranslation } from 'react-i18next';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Settings from './pages/Settings';
import MicroFrontendContainer from './pages/MicroFrontendContainer';
import './i18n';

// Ant Design locale
import enUS from 'antd/locale/en_US';
import viVN from 'antd/locale/vi_VN';

const App: React.FC = () => {
  const { i18n } = useTranslation();
  
  // Get Ant Design locale based on current language
  const getAntdLocale = () => {
    return i18n.language === 'vi' ? viVN : enUS;
  };

  return (
    <ConfigProvider locale={getAntdLocale()}>
      <Router>
        <Routes>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="settings" element={<Settings />} />
            <Route 
              path="config" 
              element={
                <MicroFrontendContainer 
                  name="shell-config-admin-frontend"
                  title="Configuration Management"
                  url="http://localhost:12009"
                />
              } 
            />
            <Route 
              path="reports" 
              element={
                <MicroFrontendContainer 
                  name="reports-frontend"
                  title="Reports & Analytics"
                  url="http://localhost:3002"
                />
              } 
            />
            {/* Redirect any unknown routes to dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </ConfigProvider>
  );
};

export default App;

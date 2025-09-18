import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { useTranslation } from 'react-i18next';
import viVN from 'antd/locale/vi_VN';
import enUS from 'antd/locale/en_US';
import AppLayout from './components/layout/AppLayout';
import NavigationManagement from './pages/navigation';
import EmbeddedModeUtils from './utils/embeddedMode';
import './i18n';

const App: React.FC = () => {
  const { i18n } = useTranslation();

  // Get Ant Design locale based on current language
  const getAntdLocale = () => {
    switch (i18n.language) {
      case 'vi':
        return viVN;
      case 'en':
        return enUS;
      default:
        return viVN;
    }
  };

  useEffect(() => {
    // Set up embedded mode listeners
    const cleanup = EmbeddedModeUtils.listenToParentMessages((type, data) => {
      switch (type) {
        case 'language-change':
          if (data.language && i18n.language !== data.language) {
            i18n.changeLanguage(data.language);
          }
          break;
        case 'theme-change':
          if (data.theme) {
            document.documentElement.setAttribute('data-theme', data.theme);
          }
          break;
        case 'navigation-request':
          // Handle navigation requests from parent
          if (data.path) {
            window.history.pushState(null, '', data.path);
          }
          break;
      }
    });

    // Notify parent that app is ready
    EmbeddedModeUtils.notifyAppReady();

    return cleanup;
  }, [i18n]);

  // Handle language change
  useEffect(() => {
    const handleLanguageChange = () => {
      // Force re-render to update Ant Design locale
      // This is handled by ConfigProvider's locale prop
    };

    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  return (
    <ConfigProvider
      locale={getAntdLocale()}
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
          wireframe: false,
        },
        components: {
          Layout: {
            bodyBg: '#f5f5f5',
            headerBg: '#ffffff',
            siderBg: '#ffffff',
          },
          Card: {
            borderRadiusLG: 8,
          },
          Button: {
            borderRadius: 6,
          },
          Input: {
            borderRadius: 6,
          },
          Select: {
            borderRadius: 6,
          },
        },
      }}
    >
      <Router basename={EmbeddedModeUtils.isEmbedded() ? '/shell-config-admin' : '/'}>
        <AppLayout>
          <Routes>
            {/* Default route - redirect to navigation management */}
            <Route path="/" element={<Navigate to="/navigation" replace />} />
            
            {/* Navigation management routes */}
            <Route path="/navigation" element={<NavigationManagement />} />
            <Route path="/navigation/*" element={<NavigationManagement />} />
            
            {/* Catch all route - redirect to navigation */}
            <Route path="*" element={<Navigate to="/navigation" replace />} />
          </Routes>
        </AppLayout>
      </Router>
    </ConfigProvider>
  );
};

export default App;
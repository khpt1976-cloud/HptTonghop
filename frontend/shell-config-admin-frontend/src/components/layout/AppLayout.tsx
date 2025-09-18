import React, { useEffect, useState } from 'react';
import { Layout, Typography, Space, Breadcrumb } from 'antd';
import { HomeOutlined, SettingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import EmbeddedModeUtils from '../../utils/embeddedMode';
import { EmbeddedModeConfig } from '../../types/common';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [embeddedConfig, setEmbeddedConfig] = useState<EmbeddedModeConfig>({});
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Get embedded mode configuration
    const config = EmbeddedModeUtils.getEmbeddedConfig();
    setEmbeddedConfig(config);

    // Set up responsive listeners
    const cleanupResize = EmbeddedModeUtils.setupResponsiveListeners(setDimensions);

    // Listen for parent messages
    const cleanupMessages = EmbeddedModeUtils.listenToParentMessages((type, data) => {
      switch (type) {
        case 'language-change':
          // Handle language change from parent
          if (data.language) {
            // This will be handled by i18n.ts
          }
          break;
        case 'theme-change':
          // Handle theme change from parent
          if (data.theme) {
            document.documentElement.setAttribute('data-theme', data.theme);
          }
          break;
        case 'resize':
          // Handle resize from parent
          if (data.width && data.height) {
            setDimensions({ width: data.width, height: data.height });
          }
          break;
      }
    });

    // Notify parent that app is ready
    EmbeddedModeUtils.notifyAppReady();

    return () => {
      cleanupResize();
      cleanupMessages();
    };
  }, []);

  useEffect(() => {
    // Notify parent about navigation changes
    EmbeddedModeUtils.notifyNavigationChange(location.pathname);
  }, [location.pathname]);

  const getBreadcrumbItems = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const items = [
      {
        title: (
          <span>
            <HomeOutlined />
            <span className="ml-1">{t('navigation.title')}</span>
          </span>
        ),
      },
    ];

    // Add dynamic breadcrumb items based on current path
    if (pathSegments.length > 0) {
      pathSegments.forEach((segment, index) => {
        const isLast = index === pathSegments.length - 1;
        items.push({
          title: isLast ? (
            <span className="capitalize">{segment.replace('-', ' ')}</span>
          ) : (
            <a href={`/${pathSegments.slice(0, index + 1).join('/')}`} className="capitalize">
              {segment.replace('-', ' ')}
            </a>
          ),
        });
      });
    }

    return items;
  };

  const layoutStyle: React.CSSProperties = {
    minHeight: embeddedConfig.hideHeader && embeddedConfig.hideFooter ? '100vh' : 'auto',
    height: EmbeddedModeUtils.isEmbedded() ? '100vh' : 'auto',
  };

  const contentStyle: React.CSSProperties = {
    padding: EmbeddedModeUtils.isEmbedded() ? '16px' : '24px',
    margin: 0,
    minHeight: 'auto',
    background: '#fff',
  };

  return (
    <Layout style={layoutStyle}>
      {!embeddedConfig.hideHeader && (
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Space align="center">
            <SettingOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
            <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
              {t('navigation.title')}
            </Title>
          </Space>
          
          <Space>
            <LanguageSwitcher size="small" />
          </Space>
        </Header>
      )}

      <Content style={contentStyle}>
        {!embeddedConfig.hideNavigation && (
          <div style={{ marginBottom: '16px' }}>
            <Breadcrumb items={getBreadcrumbItems()} />
          </div>
        )}
        
        <div
          style={{
            background: '#fff',
            minHeight: EmbeddedModeUtils.isEmbedded() 
              ? `calc(100vh - ${embeddedConfig.hideHeader ? 0 : 64}px - ${embeddedConfig.hideFooter ? 0 : 69}px - 32px)`
              : '280px',
            borderRadius: '8px',
            padding: EmbeddedModeUtils.isEmbedded() ? '16px' : '24px',
          }}
        >
          {children}
        </div>
      </Content>

      {!embeddedConfig.hideFooter && (
        <Footer style={{ textAlign: 'center', background: '#f0f2f5' }}>
          Shell Config Admin Frontend ©2024 - Micro Frontend Architecture
        </Footer>
      )}
    </Layout>
  );
};

export default AppLayout;
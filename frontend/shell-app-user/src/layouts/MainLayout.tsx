import React, { useState } from 'react';
import { Layout, Button } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const { Content } = Layout;

interface MainLayoutProps {
  onLogout: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar collapsed={collapsed} />
      <Layout>
        <Header onLogout={onLogout} />
        <Layout style={{ padding: '0' }}>
          <div
            style={{
              padding: '16px 24px 0',
              background: '#f5f5f5',
              borderBottom: '1px solid #f0f0f0',
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={toggleSidebar}
              style={{
                fontSize: '16px',
                width: 40,
                height: 40,
              }}
            />
          </div>
          <Content
            style={{
              margin: '16px 24px',
              padding: '24px',
              background: '#fff',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
              minHeight: 'calc(100vh - 200px)',
            }}
          >
            <Outlet />
          </Content>
        </Layout>
        <Footer />
      </Layout>
    </Layout>
  );
};

export default MainLayout;
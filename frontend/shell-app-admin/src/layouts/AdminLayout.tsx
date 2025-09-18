import React, { useState } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const { Content } = Layout;

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.2s' }}>
        <Header collapsed={collapsed} />
        <Content
          style={{
            margin: '24px 16px 0',
            overflow: 'initial',
            minHeight: 'calc(100vh - 64px - 70px)', // Subtract header and footer height
          }}
        >
          <div
            style={{
              padding: 24,
              background: '#fff',
              borderRadius: 6,
              minHeight: '100%',
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
import React, { useEffect, useState } from 'react';
import { Layout, Menu, Spin } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  ShoppingCartOutlined,
  MessageOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import navigationService, { NavigationItem } from '../services/navigationService';
import authService from '../services/authService';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
}

// Icon mapping
const iconMap: Record<string, React.ReactNode> = {
  HomeOutlined: <HomeOutlined />,
  UserOutlined: <UserOutlined />,
  SettingOutlined: <SettingOutlined />,
  AppstoreOutlined: <AppstoreOutlined />,
  FileTextOutlined: <FileTextOutlined />,
  ShoppingCartOutlined: <ShoppingCartOutlined />,
  MessageOutlined: <MessageOutlined />,
  BarChartOutlined: <BarChartOutlined />,
};

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNavigationItems();
  }, []);

  const loadNavigationItems = async () => {
    try {
      setLoading(true);
      const items = await navigationService.getUserNavigationItems();
      const user = authService.getCurrentUser();
      
      // Lọc navigation items dựa trên quyền của user
      const filteredItems = user?.roles 
        ? navigationService.filterNavigationByRole(items, user.roles)
        : items;
      
      // Xây dựng cây navigation
      const navigationTree = navigationService.buildNavigationTree(filteredItems);
      setNavigationItems(navigationTree);
    } catch (error) {
      console.error('Error loading navigation items:', error);
      // Sử dụng navigation mặc định nếu có lỗi
      setNavigationItems([
        {
          id: '1',
          name: t('sidebar.home'),
          path: '/',
          icon: 'HomeOutlined',
          order: 1,
          isActive: true,
        },
        {
          id: '2',
          name: t('sidebar.profile'),
          path: '/profile',
          icon: 'UserOutlined',
          order: 2,
          isActive: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const convertToMenuItems = (items: NavigationItem[]): any[] => {
    return items
      .filter(item => item.isActive)
      .map(item => {
        const menuItem: any = {
          key: item.path,
          icon: item.icon ? iconMap[item.icon] || <AppstoreOutlined /> : <AppstoreOutlined />,
          label: item.name,
          onClick: () => navigate(item.path),
        };

        if (item.children && item.children.length > 0) {
          menuItem.children = convertToMenuItems(item.children);
        }

        return menuItem;
      });
  };

  const getSelectedKeys = () => {
    return [location.pathname];
  };

  const getOpenKeys = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const openKeys: string[] = [];
    
    for (let i = 1; i <= pathSegments.length; i++) {
      const path = '/' + pathSegments.slice(0, i).join('/');
      openKeys.push(path);
    }
    
    return openKeys;
  };

  if (loading) {
    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          background: '#fff',
          borderRight: '1px solid #f0f0f0',
        }}
      >
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <Spin />
        </div>
      </Sider>
    );
  }

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      style={{
        background: '#fff',
        borderRight: '1px solid #f0f0f0',
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={getSelectedKeys()}
        defaultOpenKeys={getOpenKeys()}
        style={{
          height: '100%',
          borderRight: 0,
        }}
        items={convertToMenuItems(navigationItems)}
      />
    </Sider>
  );
};

export default Sidebar;
import React from 'react';
import { Layout, Space, Dropdown, Avatar, Typography, Button } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import authService from '../services/authService';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const { t } = useTranslation();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    onLogout();
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: t('header.profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: t('header.settings'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('header.logout'),
      onClick: handleLogout,
    },
  ];

  return (
    <AntHeader
      style={{
        background: '#fff',
        padding: '0 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #f0f0f0',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
      }}
    >
      {/* Logo và tên ứng dụng */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div
          style={{
            width: 32,
            height: 32,
            background: '#1890ff',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: '16px' }}>
            H
          </Text>
        </div>
        <Text strong style={{ fontSize: '18px', color: '#262626' }}>
          {t('header.appName')}
        </Text>
      </div>

      {/* Các thành phần bên phải */}
      <Space size="middle">
        <LanguageSwitcher />
        
        {user ? (
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            trigger={['click']}
          >
            <Button
              type="text"
              style={{
                display: 'flex',
                alignItems: 'center',
                height: 'auto',
                padding: '4px 8px',
              }}
            >
              <Avatar
                size="small"
                icon={<UserOutlined />}
                src={user.avatar}
                style={{ marginRight: 8 }}
              />
              <Text style={{ color: '#262626' }}>{user.fullName || user.username}</Text>
            </Button>
          </Dropdown>
        ) : (
          <Button type="primary" onClick={() => window.location.href = '/login'}>
            {t('auth.login')}
          </Button>
        )}
      </Space>
    </AntHeader>
  );
};

export default Header;
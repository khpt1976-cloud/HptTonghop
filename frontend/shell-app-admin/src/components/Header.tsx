import React from 'react';
import { Layout, Space, Dropdown, Avatar, Typography } from 'antd';
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import type { MenuProps } from 'antd';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

interface HeaderProps {
  collapsed?: boolean;
}

const Header: React.FC<HeaderProps> = ({ collapsed }) => {
  const { t } = useTranslation();

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: t('header.user.profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: t('header.user.settings'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('header.user.logout'),
      danger: true,
    },
  ];

  const handleUserMenuClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case 'profile':
        console.log('Navigate to profile');
        break;
      case 'settings':
        console.log('Navigate to settings');
        break;
      case 'logout':
        console.log('Logout user');
        break;
    }
  };

  return (
    <AntHeader
      style={{
        padding: '0 24px',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #f0f0f0',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
          {t('header.title')}
        </Title>
      </div>

      <Space size="middle">
        <LanguageSwitcher />
        <Dropdown
          menu={{
            items: userMenuItems,
            onClick: handleUserMenuClick,
          }}
          placement="bottomRight"
          arrow
        >
          <Space style={{ cursor: 'pointer' }}>
            <Avatar size="small" icon={<UserOutlined />} />
            <span>Admin User</span>
          </Space>
        </Dropdown>
      </Space>
    </AntHeader>
  );
};

export default Header;
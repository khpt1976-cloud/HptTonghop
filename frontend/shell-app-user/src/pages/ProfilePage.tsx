import React from 'react';
import { Typography, Card, Descriptions, Avatar, Space, Button, Tag } from 'antd';
import { UserOutlined, EditOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import authService from '../services/authService';

const { Title } = Typography;

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const user = authService.getCurrentUser();

  if (!user) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <UserOutlined style={{ fontSize: '48px', color: '#ccc' }} />
          <Title level={4} style={{ marginTop: '16px', color: '#999' }}>
            Không tìm thấy thông tin người dùng
          </Title>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={2}>{t('pages.profile.title')}</Title>
        </div>

        <Card
          title={t('pages.profile.personalInfo')}
          extra={
            <Button type="primary" icon={<EditOutlined />}>
              Chỉnh sửa
            </Button>
          }
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
            <Avatar
              size={120}
              icon={<UserOutlined />}
              src={user.avatar}
              style={{ flexShrink: 0 }}
            />
            
            <div style={{ flex: 1 }}>
              <Descriptions column={1} size="middle">
                <Descriptions.Item label="ID">
                  {user.id}
                </Descriptions.Item>
                <Descriptions.Item label="Tên đăng nhập">
                  {user.username}
                </Descriptions.Item>
                <Descriptions.Item label="Họ và tên">
                  {user.fullName || 'Chưa cập nhật'}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  <Space>
                    <MailOutlined />
                    {user.email || 'Chưa cập nhật'}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Quyền hạn">
                  <Space wrap>
                    {user.roles && user.roles.length > 0 ? (
                      user.roles.map(role => (
                        <Tag key={role} color="blue">
                          {role}
                        </Tag>
                      ))
                    ) : (
                      <Tag color="default">Không có quyền</Tag>
                    )}
                  </Space>
                </Descriptions.Item>
              </Descriptions>
            </div>
          </div>
        </Card>

        <Card title="Thông tin hệ thống">
          <Descriptions column={2} size="middle">
            <Descriptions.Item label="Phiên bản ứng dụng">
              1.0.0
            </Descriptions.Item>
            <Descriptions.Item label="Ngôn ngữ hiện tại">
              {localStorage.getItem('i18nextLng') === 'vi' ? 'Tiếng Việt' : 'English'}
            </Descriptions.Item>
            <Descriptions.Item label="Trình duyệt">
              {navigator.userAgent.split(' ').pop()}
            </Descriptions.Item>
            <Descriptions.Item label="Múi giờ">
              {Intl.DateTimeFormat().resolvedOptions().timeZone}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Space>
    </div>
  );
};

export default ProfilePage;
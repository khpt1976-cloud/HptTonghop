import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import authService, { LoginRequest } from '../services/authService';
import LanguageSwitcher from '../components/LanguageSwitcher';

const { Title, Text } = Typography;

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values: LoginRequest) => {
    try {
      setLoading(true);
      await authService.login(values);
      message.success(t('auth.loginSuccess'));
      onLogin();
      navigate('/');
    } catch (error: any) {
      console.error('Login error:', error);
      message.error(error.message || t('auth.loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 400,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            style={{
              width: 64,
              height: 64,
              background: '#1890ff',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: '24px' }}>
              H
            </Text>
          </div>
          <Title level={3} style={{ margin: 0 }}>
            {t('header.appName')}
          </Title>
          <Text type="secondary">
            Đăng nhập để tiếp tục
          </Text>
        </div>

        <Form
          name="login"
          onFinish={handleLogin}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập tên đăng nhập!',
              },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder={t('auth.username')}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập mật khẩu!',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder={t('auth.password')}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ width: '100%' }}
            >
              {t('auth.login')}
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Space>
            <Text type="secondary">Ngôn ngữ:</Text>
            <LanguageSwitcher />
          </Space>
        </div>

        {/* Demo credentials */}
        <div
          style={{
            marginTop: 24,
            padding: 16,
            background: '#f5f5f5',
            borderRadius: 8,
          }}
        >
          <Text type="secondary" style={{ fontSize: '12px' }}>
            <strong>Demo:</strong><br />
            Username: admin<br />
            Password: admin123
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
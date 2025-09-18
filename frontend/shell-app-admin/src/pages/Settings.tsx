import React from 'react';
import { Typography, Card, Form, Input, Switch, Button, Space, Divider } from 'antd';
import { SaveOutlined, ReloadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph } = Typography;

const Settings: React.FC = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Settings saved:', values);
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <div>
      <Title level={2}>{t('pages.settings.title')}</Title>
      <Paragraph>{t('pages.settings.description')}</Paragraph>

      <Card title="General Settings" style={{ marginBottom: 24 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            siteName: 'Shell App Admin',
            siteDescription: 'Main administration application',
            enableNotifications: true,
            enableAnalytics: false,
            maintenanceMode: false,
          }}
        >
          <Form.Item
            label="Site Name"
            name="siteName"
            rules={[{ required: true, message: 'Please input site name!' }]}
          >
            <Input placeholder="Enter site name" />
          </Form.Item>

          <Form.Item
            label="Site Description"
            name="siteDescription"
          >
            <Input.TextArea rows={3} placeholder="Enter site description" />
          </Form.Item>

          <Divider />

          <Form.Item
            label="Enable Notifications"
            name="enableNotifications"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="Enable Analytics"
            name="enableAnalytics"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="Maintenance Mode"
            name="maintenanceMode"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
              >
                {t('common.save')}
              </Button>
              <Button
                onClick={onReset}
                icon={<ReloadOutlined />}
              >
                Reset
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card title="API Configuration">
        <Form layout="vertical">
          <Form.Item label="API Gateway URL">
            <Input placeholder="http://localhost:8000" disabled />
          </Form.Item>
          <Form.Item label="API Version">
            <Input placeholder="v1" disabled />
          </Form.Item>
          <Paragraph type="secondary">
            API configuration is managed through environment variables.
          </Paragraph>
        </Form>
      </Card>
    </div>
  );
};

export default Settings;
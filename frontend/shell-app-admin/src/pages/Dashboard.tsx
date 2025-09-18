import React from 'react';
import { Typography, Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, SettingOutlined, FileTextOutlined, BarChartOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph } = Typography;

const Dashboard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <Title level={2}>{t('pages.dashboard.title')}</Title>
      <Paragraph>{t('pages.dashboard.description')}</Paragraph>
      
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={1128}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Active Sessions"
              value={93}
              prefix={<SettingOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Documents"
              value={456}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Reports"
              value={78}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title={t('pages.dashboard.welcome')} style={{ marginTop: 24 }}>
        <Paragraph>
          {t('pages.dashboard.description')}
        </Paragraph>
        <Paragraph>
          This is a Micro-Frontend Host Application built with React, TypeScript, and Ant Design.
          It supports multiple languages and can embed other micro-frontend applications.
        </Paragraph>
      </Card>
    </div>
  );
};

export default Dashboard;
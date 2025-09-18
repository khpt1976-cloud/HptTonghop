import React from 'react';
import { Typography, Card, Row, Col, Statistic, Space } from 'antd';
import { UserOutlined, AppstoreOutlined, BarChartOutlined, MessageOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph } = Typography;

const HomePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={2}>{t('pages.home.title')}</Title>
          <Paragraph type="secondary">
            {t('pages.home.welcome')}
          </Paragraph>
        </div>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Tổng người dùng"
                value={1128}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Ứng dụng"
                value={24}
                prefix={<AppstoreOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Báo cáo"
                value={156}
                prefix={<BarChartOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Tin nhắn"
                value={89}
                prefix={<MessageOutlined />}
                valueStyle={{ color: '#eb2f96' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Welcome Card */}
        <Card title="Chào mừng đến với hệ thống" style={{ marginTop: 16 }}>
          <Paragraph>
            Đây là ứng dụng Shell (Host Application) cho kiến trúc Micro-Frontend. 
            Ứng dụng này cung cấp:
          </Paragraph>
          <ul>
            <li>Bố cục chính với Header, Sidebar, Content Area và Footer</li>
            <li>Hỗ trợ đa ngôn ngữ (Tiếng Việt và English)</li>
            <li>Tích hợp với shell-config-service để lấy navigation items</li>
            <li>Cơ chế xác thực và ủy quyền</li>
            <li>Routing hỗ trợ tích hợp Micro-Frontend</li>
          </ul>
          <Paragraph>
            Sử dụng menu bên trái để điều hướng đến các trang khác nhau trong hệ thống.
          </Paragraph>
        </Card>
      </Space>
    </div>
  );
};

export default HomePage;
import React from 'react';
import { Layout, Typography, Space } from 'antd';
import { useTranslation } from 'react-i18next';

const { Footer: AntFooter } = Layout;
const { Text } = Typography;

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <AntFooter
      style={{
        textAlign: 'center',
        background: '#f5f5f5',
        borderTop: '1px solid #f0f0f0',
        padding: '12px 24px',
      }}
    >
      <Space direction="vertical" size="small">
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {t('footer.copyright').replace('2024', currentYear.toString())}
        </Text>
        <Text type="secondary" style={{ fontSize: '11px' }}>
          {t('footer.version')} 1.0.0
        </Text>
      </Space>
    </AntFooter>
  );
};

export default Footer;
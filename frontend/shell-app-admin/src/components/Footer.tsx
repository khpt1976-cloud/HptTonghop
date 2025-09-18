import React from 'react';
import { Layout, Typography, Space } from 'antd';
import { useTranslation } from 'react-i18next';

const { Footer: AntFooter } = Layout;
const { Text } = Typography;

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <AntFooter
      style={{
        textAlign: 'center',
        background: '#f0f2f5',
        borderTop: '1px solid #d9d9d9',
        padding: '12px 24px',
      }}
    >
      <Space direction="vertical" size="small">
        <Text type="secondary">
          {t('footer.copyright')}
        </Text>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {t('footer.version')} 1.0.0
        </Text>
      </Space>
    </AntFooter>
  );
};

export default Footer;
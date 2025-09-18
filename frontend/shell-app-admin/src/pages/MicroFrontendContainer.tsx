import React, { useEffect, useRef } from 'react';
import { Typography, Spin, Alert } from 'antd';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

interface MicroFrontendContainerProps {
  name: string;
  url?: string;
  title?: string;
}

const MicroFrontendContainer: React.FC<MicroFrontendContainerProps> = ({
  name,
  url,
  title,
}) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const loadMicroFrontend = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simulate micro-frontend loading
        // In a real implementation, this would load the actual micro-frontend
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (containerRef.current) {
          // For demonstration, we'll just show a placeholder
          containerRef.current.innerHTML = `
            <div style="padding: 24px; border: 2px dashed #d9d9d9; border-radius: 6px; text-align: center;">
              <h3>Micro-Frontend: ${name}</h3>
              <p>This is where the ${name} micro-frontend would be loaded.</p>
              <p>URL: ${url || 'Not specified'}</p>
              <p style="color: #666; font-size: 12px;">
                In a real implementation, this would use single-spa, qiankun, or a custom solution
                to load and render the micro-frontend application.
              </p>
            </div>
          `;
        }

        setLoading(false);
      } catch (err) {
        setError(`Failed to load micro-frontend: ${name}`);
        setLoading(false);
      }
    };

    loadMicroFrontend();

    // Cleanup function
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [name, url]);

  if (error) {
    return (
      <div>
        {title && <Title level={2}>{title}</Title>}
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div>
      {title && <Title level={2}>{title}</Title>}
      <Spin spinning={loading} tip={t('common.loading')}>
        <div
          ref={containerRef}
          style={{
            minHeight: '400px',
            width: '100%',
          }}
        />
      </Spin>
    </div>
  );
};

export default MicroFrontendContainer;
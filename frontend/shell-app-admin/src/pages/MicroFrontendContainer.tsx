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
  const { t, i18n } = useTranslation();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const loadMicroFrontend = () => {
      try {
        setLoading(true);
        setError(null);

        if (!url) {
          setError(`URL not specified for micro-frontend: ${name}`);
          setLoading(false);
          return;
        }

        // Build URL with embedded mode parameters
        const embeddedUrl = new URL(url);
        embeddedUrl.searchParams.set('embedded', 'true');
        embeddedUrl.searchParams.set('hideHeader', 'true');
        embeddedUrl.searchParams.set('hideFooter', 'true');
        embeddedUrl.searchParams.set('hideNavigation', 'false');
        embeddedUrl.searchParams.set('parentOrigin', window.location.origin);
        embeddedUrl.searchParams.set('language', i18n.language);

        if (iframeRef.current) {
          iframeRef.current.src = embeddedUrl.toString();
        }

      } catch (err) {
        setError(`Failed to load micro-frontend: ${name}`);
        setLoading(false);
      }
    };

    loadMicroFrontend();
  }, [name, url, i18n.language]);

  // Handle iframe load event
  const handleIframeLoad = () => {
    setLoading(false);
    
    // Send initial language to micro-frontend
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const message = {
        type: 'shell-config-language-change',
        data: { language: i18n.language },
        timestamp: Date.now(),
      };
      iframeRef.current.contentWindow.postMessage(message, '*');
    }
  };

  const handleIframeError = () => {
    setError(`Failed to load micro-frontend: ${name}`);
    setLoading(false);
  };

  // Listen for language changes and notify micro-frontend
  useEffect(() => {
    const handleLanguageChange = () => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        const message = {
          type: 'shell-config-language-change',
          data: { language: i18n.language },
          timestamp: Date.now(),
        };
        iframeRef.current.contentWindow.postMessage(message, '*');
      }
    };

    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  // Listen for messages from micro-frontend
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && typeof event.data === 'object' && event.data.type) {
        const { type, data } = event.data;
        
        switch (type) {
          case 'shell-config-app-ready':
            console.log(`Micro-frontend ${name} is ready:`, data);
            break;
          case 'shell-config-navigation-change':
            console.log(`Navigation changed in ${name}:`, data.path);
            break;
          case 'shell-config-language-change':
            // Handle language change from micro-frontend
            if (data.language && i18n.language !== data.language) {
              i18n.changeLanguage(data.language);
            }
            break;
          default:
            // Handle other messages
            break;
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [name, i18n]);

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
          style={{
            minHeight: '600px',
            width: '100%',
            border: '1px solid #d9d9d9',
            borderRadius: '6px',
            overflow: 'hidden',
          }}
        >
          <iframe
            ref={iframeRef}
            title={`Micro-frontend: ${name}`}
            style={{
              width: '100%',
              height: '600px',
              border: 'none',
              display: loading ? 'none' : 'block',
            }}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
          />
        </div>
      </Spin>
    </div>
  );
};

export default MicroFrontendContainer;
import React from 'react';
import { Select } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import EmbeddedModeUtils from '../../utils/embeddedMode';

const { Option } = Select;

interface LanguageSwitcherProps {
  className?: string;
  size?: 'small' | 'middle' | 'large';
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className,
  size = 'middle',
}) => {
  const { i18n, t } = useTranslation();

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    
    // Notify parent app if in embedded mode
    EmbeddedModeUtils.notifyLanguageChange(language);
  };

  const languages = [
    {
      code: 'vi',
      name: t('layout.vietnamese'),
      flag: '🇻🇳',
    },
    {
      code: 'en',
      name: t('layout.english'),
      flag: '🇺🇸',
    },
  ];

  return (
    <Select
      value={i18n.language}
      onChange={handleLanguageChange}
      size={size}
      className={className}
      suffixIcon={<GlobalOutlined />}
      style={{ minWidth: 120 }}
      dropdownMatchSelectWidth={false}
    >
      {languages.map((lang) => (
        <Option key={lang.code} value={lang.code}>
          <span className="flex items-center gap-2">
            <span>{lang.flag}</span>
            <span>{lang.name}</span>
          </span>
        </Option>
      ))}
    </Select>
  );
};

export default LanguageSwitcher;
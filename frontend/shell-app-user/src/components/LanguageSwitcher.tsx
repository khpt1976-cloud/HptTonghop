import React from 'react';
import { Select } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
  };

  return (
    <Select
      value={i18n.language}
      onChange={handleLanguageChange}
      style={{ width: 120 }}
      suffixIcon={<GlobalOutlined />}
      size="small"
    >
      <Option value="vi">Tiếng Việt</Option>
      <Option value="en">English</Option>
    </Select>
  );
};

export default LanguageSwitcher;
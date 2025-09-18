import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import viTranslation from '../locales/vi/translation.json';
import enTranslation from '../locales/en/translation.json';

const resources = {
  vi: {
    translation: viTranslation,
  },
  en: {
    translation: enTranslation,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'vi',
    debug: process.env.NODE_ENV === 'development',

    interpolation: {
      escapeValue: false, // React already does escaping
    },

    detection: {
      order: ['localStorage', 'cookie', 'navigator', 'htmlTag'],
      caches: ['localStorage', 'cookie'],
      lookupLocalStorage: 'shell-config-language',
      lookupCookie: 'shell-config-language',
    },

    react: {
      useSuspense: false,
    },
  });

// Listen for language change events from parent shell app
window.addEventListener('shell-language-change', (event: any) => {
  const { language } = event.detail;
  if (language && i18n.language !== language) {
    i18n.changeLanguage(language);
  }
});

// Notify parent shell app when language changes
i18n.on('languageChanged', (lng) => {
  // Save to localStorage
  localStorage.setItem('shell-config-language', lng);
  
  // Dispatch event to parent shell app
  window.dispatchEvent(
    new CustomEvent('shell-config-language-change', {
      detail: { language: lng },
    })
  );
});

export default i18n;
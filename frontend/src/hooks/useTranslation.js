import { useState, useEffect } from 'react';
import { translations } from '../i18n/translations';
import { APP_CONFIG } from '../config/app';

export const useTranslation = () => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || APP_CONFIG.defaultLanguage;
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    
    // Set document direction for RTL languages
    if (APP_CONFIG.rtlLanguages.includes(language)) {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = language;
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = language;
    }
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || key;
  };

  const changeLanguage = (lang) => {
    if (APP_CONFIG.languages.includes(lang)) {
      setLanguage(lang);
    }
  };

  const isRTL = APP_CONFIG.rtlLanguages.includes(language);

  return { t, language, changeLanguage, isRTL };
};
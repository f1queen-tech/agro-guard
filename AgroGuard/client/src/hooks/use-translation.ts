import { useState, useEffect } from 'react';
import { translations, type Language, type TranslationKey, getTranslation } from '@/lib/translations';

export function useTranslation() {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    
    // Trigger a custom event so other components can react
    window.dispatchEvent(new CustomEvent('languagechange', { detail: { language: lang } }));
  };

  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    return getTranslation(language, key, params);
  };

  useEffect(() => {
    document.documentElement.lang = language;
    
    // Listen for language changes from other components
    const handleLanguageChange = (e: CustomEvent) => {
      const newLang = e.detail.language;
      if (newLang !== language) {
        setLanguage(newLang);
      }
    };
    
    window.addEventListener('languagechange', handleLanguageChange as EventListener);
    return () => window.removeEventListener('languagechange', handleLanguageChange as EventListener);
  }, [language]);

  return { language, changeLanguage, t };
}

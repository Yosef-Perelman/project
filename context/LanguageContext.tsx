import React, { createContext, useContext, useState } from 'react';
import { I18nManager } from 'react-native';
import { translations } from '@/constants/translations';

type Language = 'en' | 'he';

interface LanguageContextType {
  language: Language;
  t: (key: keyof typeof translations.en) => string;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('he');

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    I18nManager.forceRTL(lang === 'he');
  };

  const t = (key: keyof typeof translations.en) => {
    return translations[language][key];
  };

  return (
    <LanguageContext.Provider value={{ language, t, setLanguage: changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 
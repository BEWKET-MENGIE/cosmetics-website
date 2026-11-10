// src/context/LanguageContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language, TranslationKey } from '@/lib/dictionary';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('ifaa-lang') as Language;
    if (saved && (saved === 'en' || saved === 'am')) {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('ifaa-lang', newLang);
  };

  const t = (key: TranslationKey): string => {
    return translations[lang][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
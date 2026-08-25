"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, Translations, TRANSLATIONS } from "@/lib/i18n/translations";

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  toggleLanguage: () => void;
}

const I18nContext = createContext<I18nContextType>({
  language: "en",
  setLanguage: () => {},
  t: TRANSLATIONS.en,
  toggleLanguage: () => {},
});

const LANGUAGE_STORAGE_KEY = "bhushakti_language";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;
      if (saved && (saved === "en" || saved === "hi")) {
        setLanguageState(saved);
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    }
  };

  const toggleLanguage = () => {
    const nextLang = language === "en" ? "hi" : "en";
    setLanguage(nextLang);
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import enMessages from "@/messages/en.json";
import npMessages from "@/messages/np.json";

type Language = "en" | "np";
type Messages = typeof enMessages;

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

const messages: Record<Language, Messages> = {
  en: enMessages,
  np: npMessages,
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const getNestedValue = (source: Record<string, any>, key: string) => {
  return key.split(".").reduce<any>((current, part) => current?.[part], source);
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("nikeLanguage");
    if (savedLanguage === "np" || savedLanguage === "en") {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    localStorage.setItem("nikeLanguage", nextLanguage);
    document.documentElement.lang = nextLanguage === "np" ? "ne" : "en";
  };

  useEffect(() => {
    document.documentElement.lang = language === "np" ? "ne" : "en";
  }, [language]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      t: (key: string) => {
        const translated = getNestedValue(messages[language], key);
        const fallback = getNestedValue(messages.en, key);

        return typeof translated === "string"
          ? translated
          : typeof fallback === "string"
            ? fallback
            : key;
      },
    }),
    [language],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
}

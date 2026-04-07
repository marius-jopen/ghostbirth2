"use client";

import { createContext, useContext, useState, useEffect } from "react";
import en from "@/content/i18n/en";
import de from "@/content/i18n/de";
import th from "@/content/i18n/th";
import type { Translations } from "@/content/i18n/en";

const translations: Record<string, Translations> = { en, de, th };

type LangContextType = {
  t: Translations;
  lang: string;
  setLang: (lang: string) => void;
};

const LangContext = createContext<LangContextType>({
  t: en,
  lang: "en",
  setLang: () => {},
});

function detectLang(): string {
  if (typeof navigator === "undefined") return "en";
  const browserLang = navigator.language?.toLowerCase() || "";
  if (browserLang.startsWith("th")) return "th";
  if (browserLang.startsWith("de")) return "de";
  return "en";
}

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState("en");
  const t = translations[lang] || en;

  // Detect browser language on mount
  useEffect(() => {
    setLang(detectLang());
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-lang", lang);
  }, [lang]);

  return (
    <LangContext.Provider value={{ t, lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}

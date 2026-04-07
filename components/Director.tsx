"use client";

import { useLang } from "./LangContext";

export default function Director() {
  const { t } = useLang();
  return (
    <section id="director" className="section">
      <h2 className="section-title">{t.director.title}</h2>
      <div className="section-text-wrap section-text">
        {t.director.text}
      </div>
    </section>
  );
}

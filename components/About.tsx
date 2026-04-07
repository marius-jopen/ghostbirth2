"use client";

import { useLang } from "./LangContext";

export default function About() {
  const { t } = useLang();
  return (
    <section id="about" className="section">
      <h2 className="section-title">{t.about.title}</h2>
      <div className="section-text-wrap">
        {t.about.paragraphs.map((p, i) => (
          <p key={i} className="section-text">{p}</p>
        ))}
      </div>
    </section>
  );
}

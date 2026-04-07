"use client";

import { useLang } from "./LangContext";

export default function Story() {
  const { t } = useLang();
  return (
    <section id="story" className="section">
      <h2 className="section-title">{t.story.title}</h2>
      <div className="section-text-wrap">
        {t.story.paragraphs.map((p, i) => (
          <p key={i} className="section-text">{p}</p>
        ))}
      </div>
    </section>
  );
}

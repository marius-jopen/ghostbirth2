"use client";

import { useLang } from "./LangContext";
import styles from "./LangSwitcher.module.css";

const langs = [
  { code: "en", label: "EN" },
  { code: "de", label: "DE" },
  { code: "th", label: "TH" },
];

export default function LangSwitcher() {
  const { lang, setLang } = useLang();

  return (
    <div className={styles.switcher}>
      {langs.map((l, i) => (
        <span key={l.code}>
          <button
            className={`${styles.btn} ${lang === l.code ? styles.active : ""}`}
            onClick={() => setLang(l.code)}
          >
            {l.label}
          </button>
          {i < langs.length - 1 && <span className={styles.sep}>/</span>}
        </span>
      ))}
    </div>
  );
}

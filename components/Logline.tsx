"use client";

import { useLang } from "./LangContext";
import styles from "./Logline.module.css";

export default function Logline() {
  const { t } = useLang();
  return (
    <section id="logline" className={styles.logline}>
      <p className={styles.text}>{t.logline}</p>
    </section>
  );
}

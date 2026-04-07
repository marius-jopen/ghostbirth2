"use client";

import { useLang } from "./LangContext";
import styles from "./Footer.module.css";

export default function Footer() {
  const { t } = useLang();
  return (
    <footer id="contact" className={styles.footer}>
      <h2 className="section-title">{t.footer.title}</h2>
      <p className={styles.credit}>{t.footer.credit}</p>
      <p className={styles.email}>
        <a href="mailto:kontakt@thepeople.de">kontakt@thepeople.de</a>
      </p>
      <div id="newsletter">{/* Substack embed goes here */}</div>
      <p className={styles.copyright}>{t.footer.copyright}</p>
    </footer>
  );
}

"use client";

import { useState } from "react";
import { useLang } from "./LangContext";
import styles from "./Footer.module.css";

export default function Footer() {
  const { t } = useLang();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          role: data.get("role"),
          message: data.get("message"),
        }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    }
  };

  return (
    <footer id="contact" className={styles.footer}>
      <h2 className="section-title">{t.footer.title}</h2>

      <div className={styles.links}>
        <a href="mailto:ghostbirth2@thepeople.world" className={styles.link}>
          ghostbirth2@thepeople.world
        </a>
        <a
          href="https://instagram.com/ghostbirth2"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          <svg
            className={styles.icon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
          Instagram
        </a>
      </div>

      {!submitted ? (
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            required
            className={styles.input}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className={styles.input}
          />
          <select name="role" required className={styles.select} defaultValue="">
            <option value="" disabled>
              I am a...
            </option>
            <option value="Producer">Producer</option>
            <option value="Sales Agent">Sales Agent</option>
            <option value="Distributor">Distributor</option>
            <option value="Press">Press</option>
            <option value="Actor">Actor</option>
            <option value="Fan">Fan</option>
            <option value="Other">Other</option>
          </select>
          <textarea
            name="message"
            placeholder="Message"
            rows={4}
            className={styles.textarea}
          />
          <button type="submit" className={styles.submit}>
            Sacrifice your email
          </button>
        </form>
      ) : (
        <p className={styles.thanks}>Message sent.</p>
      )}

      <div className={styles.substack}>
        <p className={styles.substackLabel}>Ghostly News</p>
        <div className={styles.substackWrap}>
          <iframe
            src="https://ghostbirth2.substack.com/embed"
            width="480"
            height="320"
            className={styles.substackEmbed}
            frameBorder="0"
            scrolling="no"
          />
        </div>
      </div>

      <p className={styles.credit}>{t.footer.credit}</p>
      <p className={styles.copyright}>{t.footer.copyright}</p>
    </footer>
  );
}

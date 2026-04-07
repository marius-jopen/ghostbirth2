import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.credit}>
        A film by Marius Jopen &middot; Produced by THE PEOPLE
      </p>
      <p className={styles.email}>
        <a href="mailto:kontakt@thepeople.de">kontakt@thepeople.de</a>
      </p>
      <div id="newsletter">{/* Substack embed goes here */}</div>
      <p className={styles.copyright}>&copy; 2026 THE PEOPLE</p>
    </footer>
  );
}

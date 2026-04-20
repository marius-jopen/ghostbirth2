import styles from "./Logline.module.css";

export default function Logline({ text }: { text: string }) {
  return (
    <section id="logline" className={styles.logline}>
      <p className={styles.text}>{text}</p>
    </section>
  );
}

import styles from "./VideoBreak.module.css";

export default function VideoBreak() {
  return (
    <section className={styles.wrapper}>
      <video
        className={styles.video}
        src="/video-1.mov"
        autoPlay
        loop
        muted
        playsInline
      />
    </section>
  );
}

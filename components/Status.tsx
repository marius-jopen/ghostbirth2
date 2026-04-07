import styles from "./Status.module.css";

const items = [
  { label: "Story & Treatment", status: "Complete", done: true },
  { label: "Test Shoot Bangkok", status: "Complete", done: true },
  { label: "140 Casting Sessions", status: "Complete", done: true },
  { label: "Market Submissions 2026", status: "In Progress", done: false },
  {
    label: "Principal Photography",
    status: "Bangkok, Oct/Nov 2026",
    done: false,
  },
  { label: "Post-Production", status: "Early 2027", done: false },
];

export default function Status() {
  return (
    <section className="section">
      <h2 className="section-title">Status</h2>
      <div className={styles.timeline}>
        {items.map((item, i) => (
          <div
            key={item.label}
            className={`${styles.step} ${item.done ? styles.done : styles.upcoming}`}
          >
            <div className={styles.marker}>
              <div className={styles.dot} />
              {i < items.length - 1 && <div className={styles.line} />}
            </div>
            <div className={styles.content}>
              <span className={styles.label}>{item.label}</span>
              <span className={styles.status}>{item.status}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

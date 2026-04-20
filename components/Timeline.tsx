import { emph } from "@/lib/emph";

type Step = {
  when: string;
  what: string;
  detail: string;
  state: "done" | "now" | "";
};

type TimelineContent = {
  sectionLabelNum: string;
  sectionLabel: string;
  title: string;
  steps: readonly Step[];
};

export default function Timeline({ timeline }: { timeline: TimelineContent }) {
  return (
    <section className="timeline">
      <div className="wrap">
        <div className="section-label">
          <span className="num">{timeline.sectionLabelNum}</span>
          <span>{timeline.sectionLabel}</span>
          <span className="bar" />
        </div>
        <h2 className="big">{emph(timeline.title)}</h2>
        <div className="timeline-list">
          {timeline.steps.map((s, i) => (
            <div key={i} className={`tl-step ${s.state}`}>
              <div className="when">{s.when}</div>
              <div className="dot" />
              <div className="what">{s.what}</div>
              {s.detail && <div className="detail">{s.detail}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

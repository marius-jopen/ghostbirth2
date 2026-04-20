import { emph } from "@/lib/emph";

type StatusContent = {
  sectionLabelNum: string;
  sectionLabel: string;
  title: string;
  cards: readonly { heading: string; body: string }[];
  seekingTitle: string;
  seekingBody: string;
};

export default function Status({ status }: { status: StatusContent }) {
  return (
    <section id="status">
      <div className="wrap">
        <div className="section-label">
          <span className="num">{status.sectionLabelNum}</span>
          <span>{status.sectionLabel}</span>
          <span className="bar" />
        </div>
        <h2 className="big">{emph(status.title)}</h2>
        <div className="status-grid">
          {status.cards.map((card, i) => (
            <div className="status-card" key={i}>
              <h4>{card.heading}</h4>
              <p>{emph(card.body)}</p>
            </div>
          ))}
          <div className="status-card wide">
            <div className="seeking">{emph(status.seekingTitle)}</div>
            <p style={{ maxWidth: 640, marginTop: 16 }}>{emph(status.seekingBody)}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

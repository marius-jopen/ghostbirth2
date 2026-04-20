import { emph } from "@/lib/emph";

type SynopsisContent = {
  sectionLabelNum: string;
  sectionLabel: string;
  title: string;
  spoilerTag: string;
  paragraphs: readonly string[];
  endCard: string;
  sizzleNote: string;
};

export default function Synopsis({ synopsis }: { synopsis: SynopsisContent }) {
  return (
    <section className="synopsis">
      <div className="wrap">
        <div className="section-label">
          <span className="num">{synopsis.sectionLabelNum}</span>
          <span>{synopsis.sectionLabel}</span>
          <span className="bar" />
        </div>
        <div className="synopsis-grid">
          <div>
            <h2 className="big">{emph(synopsis.title)}</h2>
          </div>
          <div className="synopsis-body">
            {synopsis.spoilerTag && (
              <span className="spoiler-tag">{synopsis.spoilerTag}</span>
            )}
            {synopsis.paragraphs.map((p, i) => (
              <p key={i}>{emph(p)}</p>
            ))}
            {synopsis.endCard && <div className="end">{emph(synopsis.endCard)}</div>}
            {synopsis.sizzleNote && (
              <p className="sizzle-note">{synopsis.sizzleNote}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

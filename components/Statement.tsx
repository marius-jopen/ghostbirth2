import { emph } from "@/lib/emph";

type StatementContent = {
  sectionLabelNum: string;
  sectionLabel: string;
  title: string;
  meta: string;
  pdfLabel: string;
  pdfHref: string;
  body: string;
};

export default function Statement({ statement }: { statement: StatementContent }) {
  const paragraphs = statement.body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  return (
    <section id="statement" className="statement">
      <div className="wrap">
        <div className="section-label">
          <span className="num">{statement.sectionLabelNum}</span>
          <span>{statement.sectionLabel}</span>
          <span className="bar" />
        </div>
        <div className="statement-grid">
          <div className="statement-head">
            <h2 className="big">{emph(statement.title)}</h2>
            <div className="meta">{statement.meta}</div>
            {statement.pdfHref ? (
              <a className="pdf" href={statement.pdfHref} download>
                {statement.pdfLabel}
              </a>
            ) : statement.pdfLabel ? (
              <span className="pdf" style={{ opacity: 0.5, cursor: "default" }}>
                {statement.pdfLabel}
              </span>
            ) : null}
          </div>
          <div className="statement-body">
            {paragraphs.map((p, i) => (
              <p key={i}>{emph(p)}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import { emph } from "@/lib/emph";

type StatementContent = {
  sectionLabelNum: string;
  sectionLabel: string;
  title: string;
  meta: string;
  pdfLabel: string;
  pdfHref: string;
  paragraphs: readonly string[];
  signature: string;
};

export default function Statement({ statement }: { statement: StatementContent }) {
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
            {statement.paragraphs.map((p, i) => (
              <p key={i}>{emph(p)}</p>
            ))}
            {statement.signature && (
              <div className="statement-sig">{statement.signature}</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

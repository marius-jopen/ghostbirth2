import { emph } from "@/lib/emph";

type Ref = { name: string; works: string };

type VisualContent = {
  sectionLabelNum: string;
  sectionLabel: string;
  title: string;
  leftHeading: string;
  leftBody: string;
  refs: readonly Ref[];
  rightHeading: string;
  rightBody: string;
  vetoes: readonly string[];
};

export default function Visual({ visual }: { visual: VisualContent }) {
  return (
    <section className="visual">
      <div className="wrap">
        <div className="section-label">
          <span className="num">{visual.sectionLabelNum}</span>
          <span>{visual.sectionLabel}</span>
          <span className="bar" />
        </div>
        <h2 className="big">{emph(visual.title)}</h2>
        <div className="visual-grid">
          <div className="visual-col">
            <h3>{visual.leftHeading}</h3>
            <p>{emph(visual.leftBody)}</p>
            <div className="refs-list">
              {visual.refs.map((r, i) => (
                <span key={i}>
                  {r.name} <em>{r.works}</em>
                </span>
              ))}
            </div>
          </div>
          <div className="visual-col">
            <h3>{visual.rightHeading}</h3>
            <p>{emph(visual.rightBody)}</p>
            <div className="vetoes">
              {visual.vetoes.map((v, i) => (
                <span key={i}>{v}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

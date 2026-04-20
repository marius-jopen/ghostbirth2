import { emph } from "@/lib/emph";

type DirectorContent = {
  sectionLabelNum: string;
  sectionLabel: string;
  title: string;
  portraitImage: string | null;
  paragraphs: readonly string[];
  stats: readonly { value: string; label: string }[];
};

export default function Director({ director }: { director: DirectorContent }) {
  return (
    <section id="director">
      <div className="wrap">
        <div className="section-label">
          <span className="num">{director.sectionLabelNum}</span>
          <span>{director.sectionLabel}</span>
          <span className="bar" />
        </div>
        <div className="director-grid">
          <div className={`director-img ${director.portraitImage ? "has-image" : ""}`}>
            {director.portraitImage ? (
              <img src={director.portraitImage} alt="" />
            ) : (
              <span className="ml">PORTRAIT · PLACEHOLDER</span>
            )}
          </div>
          <div>
            <h2 className="big">{emph(director.title)}</h2>
            <div className="director-copy" style={{ marginTop: 28 }}>
              {director.paragraphs.map((p, i) => (
                <p key={i}>{emph(p)}</p>
              ))}
            </div>
            <div className="director-stats">
              {director.stats.map((s, i) => (
                <div className="ds-cell" key={i}>
                  <div className="n">{s.value}</div>
                  <div className="l">{emph(s.label)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

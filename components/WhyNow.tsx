import { emph } from "@/lib/emph";

type WhyNowContent = {
  sectionLabelNum: string;
  sectionLabel: string;
  title: string;
  body: string;
};

export default function WhyNow({ whyNow }: { whyNow: WhyNowContent }) {
  const paragraphs = whyNow.body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  return (
    <section className="why-now">
      <div className="wrap">
        <div className="section-label">
          <span className="num">{whyNow.sectionLabelNum}</span>
          <span>{whyNow.sectionLabel}</span>
          <span className="bar" />
        </div>
        <h2 className="big">{emph(whyNow.title)}</h2>
        <div className="why-now-body">
          {paragraphs.map((p, i) => (
            <p key={i}>{emph(p)}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

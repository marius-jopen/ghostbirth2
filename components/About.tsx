import React from "react";
import { emph } from "@/lib/emph";

type AboutContent = {
  sectionLabelNum: string;
  sectionLabel: string;
  title: string;
  paragraphs: readonly string[];
  pullQuote: string;
  lineageHeading: string;
  lineage: readonly { label: string; value: string }[];
  methodHeading: string;
  materials: readonly { text: string; hot: boolean }[];
};

export default function About({ about }: { about: AboutContent }) {
  return (
    <section id="about">
      <div className="wrap">
        <div className="section-label">
          <span className="num">{about.sectionLabelNum}</span>
          <span>{about.sectionLabel}</span>
          <span className="bar" />
        </div>
        <div className="about-grid">
          <div>
            <h2 className="big">{emph(about.title)}</h2>
            <div className="about-lede" style={{ marginTop: 36 }}>
              {about.paragraphs.map((p, i) => (
                <React.Fragment key={i}>
                  <p>{emph(p)}</p>
                  {i === 0 && about.pullQuote && (
                    <blockquote className="pull-quote">
                      {emph(about.pullQuote)}
                    </blockquote>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
          <aside className="about-side">
            <div className="note">
              <strong>{about.lineageHeading}</strong>
              <dl className="lineage">
                {about.lineage.map((r, i) => (
                  <div className="lineage-row" key={i}>
                    <dt>{r.label}</dt>
                    <dd>{r.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="note">
              <strong>{about.methodHeading}</strong>
              <div className="materials">
                {about.materials.map((m, i) => (
                  <span key={i} className={m.hot ? "hot" : ""}>
                    {m.text}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

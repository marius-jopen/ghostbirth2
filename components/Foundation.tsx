import React from "react";
import { emph } from "@/lib/emph";

type MetaCell = { label: string; value: string };

type FoundationContent = {
  marquee: readonly string[];
  sectionLabelNum: string;
  sectionLabel: string;
  year: string;
  hookLine: string;
  hookPrize: string;
  sub: string;
  plateImage: string | null;
  plateLabel: string;
  plateCorner: string;
  col1Kicker: string;
  col1Body: string;
  col2Kicker: string;
  col2Body: string;
  meta: readonly MetaCell[];
};

export default function Foundation({
  foundation,
}: {
  foundation: FoundationContent;
}) {
  // Build one lane with enough repetitions to cover any viewport, then
  // duplicate for the seamless -50% wrap.
  const LANE_REPEATS = 6;
  const lane: React.ReactNode[] = [];
  for (let r = 0; r < LANE_REPEATS; r++) {
    foundation.marquee.forEach((item, i) => {
      lane.push(<span key={`l-${r}-${i}`}>{item}</span>);
      lane.push(<span key={`l-${r}-${i}-sep`}>·</span>);
    });
  }
  const marquee: React.ReactNode[] = [
    ...lane.map((el, i) =>
      React.cloneElement(el as React.ReactElement, { key: `a-${i}` })
    ),
    ...lane.map((el, i) =>
      React.cloneElement(el as React.ReactElement, { key: `b-${i}` })
    ),
  ];

  const hasPlate = Boolean(foundation.plateImage);

  return (
    <section className="foundation" id="foundation">
      <div className="foundation-marquee" aria-hidden="true">
        {marquee}
      </div>
      <div className="wrap">
        <div className="section-label">
          <span className="num">{foundation.sectionLabelNum}</span>
          <span>{foundation.sectionLabel}</span>
          <span className="bar" />
        </div>

        <div className="foundation-lede">
          <div className="fd-year">{foundation.year}</div>
          <h2 className="foundation-hook">
            {emph(foundation.hookLine)}
            <br />
            <span className="fd-prize">{foundation.hookPrize}</span>
          </h2>
          <p className="fd-sub">{foundation.sub}</p>
        </div>

        <div className={`foundation-plate ${hasPlate ? "has-image" : "placeholder-red"}`}>
          {hasPlate ? (
            <img src={foundation.plateImage as string} alt="" />
          ) : (
            <span className="ph-label">{foundation.plateLabel}</span>
          )}
          <span className="fd-plate-corner">{foundation.plateCorner}</span>
        </div>

        <div className="foundation-cols">
          <div className="fd-col">
            <div className="fd-kicker">{foundation.col1Kicker}</div>
            <p>{emph(foundation.col1Body)}</p>
          </div>
          <div className="fd-col">
            <div className="fd-kicker">{foundation.col2Kicker}</div>
            <p>{emph(foundation.col2Body)}</p>
          </div>
        </div>

        <div className="foundation-meta">
          {foundation.meta.map((cell, i) => (
            <div className="fm-cell" key={i}>
              <div className="fm-l">{cell.label}</div>
              <div className="fm-v">{emph(cell.value)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

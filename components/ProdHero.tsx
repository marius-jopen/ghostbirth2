import { emph } from "@/lib/emph";

type ProdHeroContent = {
  tag: string;
  titleLine1: string;
  titleLine2: string;
  oneliner: readonly { label: string; value: string }[];
};

export default function ProdHero({ hero }: { hero: ProdHeroContent }) {
  return (
    <section className="prod-hero">
      <div className="wrap">
        <div className="tag">{hero.tag}</div>
        <h1>
          {hero.titleLine1}
          <br />
          <em>{hero.titleLine2}</em>
        </h1>
        <div className="oneliner">
          {hero.oneliner.map((c, i) => (
            <div className="c" key={i}>
              <div className="l">{c.label}</div>
              <div className="v">{emph(c.value)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { emph } from "@/lib/emph";

type HeroContent = {
  tag: string;
  titleLine1: string;
  titleLine2Primary: string;
  titleLine2Accent: string;
  sub: string;
  lede: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaGhostLabel: string;
  ctaGhostHref: string;
  posterImage: string | null;
  stats: readonly { label: string; value: string }[];
};

export default function Hero({ hero }: { hero: HeroContent }) {
  const poster = hero.posterImage ?? "/poster-background.jpg";
  return (
    <header className="hero" id="top">
      <div className="hero-bg">
        <div className="poster" style={{ backgroundImage: `url(${poster})` }} />
        <div className="veil" />
      </div>
      <div className="wrap hero-inner">
        <div className="hero-meta">
          <div className="hero-tag">
            <span className="dot" />
            {hero.tag}
          </div>
          <h1>
            {hero.titleLine1}
            <br />
            {hero.titleLine2Primary} <span className="two">{hero.titleLine2Accent}</span>
          </h1>
          {hero.sub && <div className="hero-sub">{hero.sub}</div>}
          {hero.lede && <p className="hero-lede">{emph(hero.lede)}</p>}
          <div className="cta-row">
            {hero.ctaPrimaryLabel && (
              <Link href={hero.ctaPrimaryHref} className="cta primary">
                {hero.ctaPrimaryLabel} <span className="arrow">→</span>
              </Link>
            )}
            {hero.ctaGhostLabel && (
              <a href={hero.ctaGhostHref} className="cta ghost">
                {hero.ctaGhostLabel}
              </a>
            )}
          </div>
        </div>
        {hero.stats?.length > 0 && (
          <div className="hero-stats">
            {hero.stats.map((s, i) => (
              <div className="row" key={i}>
                <span>{s.label}</span>
                <b>{s.value}</b>
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

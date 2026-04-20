"use client";

import { usePathname } from "next/navigation";

type FooterBlock = {
  heading: string;
  lines: readonly { text: string; href: string | null }[];
};

type FooterContent = {
  wordmarkLine1: string;
  wordmarkLine2Primary: string;
  wordmarkLine2Accent: string;
  side: string;
  blocks: readonly FooterBlock[];
  bottomLines: readonly string[];
};

export default function Footer({ footer }: { footer: FooterContent }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/keystatic")) return null;

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-top">
          <div className="wordmark">
            {footer.wordmarkLine1}
            <br />
            {footer.wordmarkLine2Primary} <em>{footer.wordmarkLine2Accent}</em>
          </div>
          <div className="side">{footer.side}</div>
        </div>
        <div className="foot-grid">
          {footer.blocks.map((block, i) => (
            <div className="block" key={i}>
              <h4>{block.heading}</h4>
              {block.lines.map((line, j) =>
                line.href ? (
                  <a
                    key={j}
                    href={line.href}
                    target={line.href.startsWith("http") ? "_blank" : undefined}
                    rel={line.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                    {line.text}
                  </a>
                ) : (
                  <p key={j}>{line.text}</p>
                )
              )}
            </div>
          ))}
        </div>
        <div className="foot-bottom">
          {footer.bottomLines.map((l, i) => (
            <span key={i}>{l}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}

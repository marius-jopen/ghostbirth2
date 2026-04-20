"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

type NavLink = { label: string; href: string };
type NavContent = {
  brandPrimary: string;
  brandAccent: string;
  links: readonly NavLink[];
  producersLabel: string;
  producersHref: string;
};

function parseHref(href: string) {
  const idx = href.indexOf("#");
  const path = idx === -1 ? href : href.slice(0, idx) || "/";
  const hash = idx === -1 ? "" : href.slice(idx + 1);
  return { path, hash };
}

export default function Nav({ nav }: { nav: NavContent }) {
  const pathname = usePathname();
  const [activeHash, setActiveHash] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  useEffect(() => {
    const sectionIds = nav.links
      .map((l) => parseHref(l.href))
      .filter(({ path, hash }) => path === pathname && hash)
      .map(({ hash }) => hash);
    if (sectionIds.length === 0) {
      setActiveHash("");
      return;
    }
    const onScroll = () => {
      const threshold = window.innerHeight * 0.35;
      let current = "";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= threshold) current = id;
      }
      setActiveHash(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname, nav.links]);

  if (pathname?.startsWith("/keystatic")) return null;

  const producersActive = pathname === parseHref(nav.producersHref).path;

  const matchingIndices = nav.links
    .map((l, i) => ({ l, i, parsed: parseHref(l.href) }))
    .filter((x) => x.parsed.path === pathname);
  let activeIdx = -1;
  if (activeHash) {
    const match = matchingIndices.find((x) => x.parsed.hash === activeHash);
    if (match) activeIdx = match.i;
  }
  if (activeIdx === -1 && matchingIndices.length > 0) {
    const exact = matchingIndices.find((x) => !x.parsed.hash);
    activeIdx = exact ? exact.i : matchingIndices[0].i;
  }

  return (
    <>
      <nav className="nav">
        <Link href="/" className="brand">
          {nav.brandPrimary} <em>{nav.brandAccent}</em>
        </Link>
        <div className="links">
          {nav.links.map((l, i) => {
            const isActive = i === activeIdx;
            const n = String(i + 1).padStart(2, "0");
            return (
              <Link
                key={i}
                href={l.href}
                data-n={n}
                className={`nl ${isActive ? "on" : ""}`}
              >
                {l.label}
              </Link>
            );
          })}
          <Link
            href={nav.producersHref}
            className={`producers ${producersActive ? "on" : ""}`}
          >
            {nav.producersLabel}
          </Link>
        </div>
        <button
          type="button"
          className={`burger ${menuOpen ? "on" : ""}`}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {menuOpen && (
        <div className="mobile-menu" onClick={() => setMenuOpen(false)}>
          <div className="mobile-menu-inner" onClick={(e) => e.stopPropagation()}>
            {nav.links.map((l, i) => {
              const isActive = i === activeIdx;
              const n = String(i + 1).padStart(2, "0");
              return (
                <Link
                  key={i}
                  href={l.href}
                  className={`mm-link ${isActive ? "on" : ""}`}
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="mm-num">{n}</span>
                  <span>{l.label}</span>
                </Link>
              );
            })}
            <Link
              href={nav.producersHref}
              className={`mm-pill ${producersActive ? "on" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {nav.producersLabel}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

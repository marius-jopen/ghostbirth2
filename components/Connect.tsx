"use client";

import { useState } from "react";
import { emph } from "@/lib/emph";

type ConnectContent = {
  sectionLabelNum: string;
  sectionLabel: string;
  title: string;
  lede: string;
  formTitle: string;
  formSub: string;
  roleLabel: string;
  emailLabel: string;
  emailPlaceholder: string;
  submitLabel: string;
  submitDoneLabel: string;
  roles: readonly string[];
};

type ContactInfo = {
  email: string;
  phone: string;
  phoneDigits: string;
  instagramHandle: string;
  instagramUrl: string | null;
};

export default function Connect({
  body,
  contact,
}: {
  body: ConnectContent;
  contact: ContactInfo;
}) {
  const [role, setRole] = useState(body.roles[0] ?? "Fan");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "", email, role, message: "" }),
      });
    } catch {
      /* swallow */
    }
    setSent(true);
  };

  return (
    <section id="contact" className="contact">
      <div className="wrap">
        <div className="section-label">
          <span className="num">{body.sectionLabelNum}</span>
          <span>{body.sectionLabel}</span>
          <span className="bar" />
        </div>
        <div className="contact-grid">
          <div className="contact-side">
            <h2 className="big">{emph(body.title)}</h2>
            <p className="lede">{body.lede}</p>
            <div className="contact-row">
              <a href={`mailto:${contact.email}`}>
                <span>
                  <span className="l">Email</span>
                  {contact.email}
                </span>
                <span className="arrow">→</span>
              </a>
              <a href={`tel:${contact.phoneDigits}`}>
                <span>
                  <span className="l">Phone</span>
                  {contact.phone}
                </span>
                <span className="arrow">→</span>
              </a>
              {contact.instagramUrl && (
                <a
                  href={contact.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>
                    <span className="l">Instagram</span>
                    {contact.instagramHandle}
                  </span>
                  <span className="arrow">→</span>
                </a>
              )}
            </div>
          </div>

          <form className="form" onSubmit={submit}>
            <div className="form-title">{body.formTitle}</div>
            <div className="form-sub">{body.formSub}</div>
            <div className="field">
              <label>{body.roleLabel}</label>
              <div className="roles">
                {body.roles.map((r) => (
                  <button
                    key={r}
                    type="button"
                    className={`role ${role === r ? "on" : ""}`}
                    onClick={() => setRole(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div className="field">
              <label>{body.emailLabel}</label>
              <input
                type="email"
                placeholder={body.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button type="submit" className={`submit ${sent ? "done" : ""}`}>
              {sent ? body.submitDoneLabel : body.submitLabel}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

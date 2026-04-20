"use client";

import { useEffect, useState } from "react";

type ScriptCard = {
  type: string;
  name: string;
  detail: string;
  file: string | null;
};

const PASSWORD = "ilovethepeople";
const STORAGE_KEY = "gb2_script_unlocked";

export default function ProtectedScript({ sc }: { sc: ScriptCard }) {
  const [open, setOpen] = useState(false);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") setUnlocked(true);
    } catch {
      /* storage unavailable */
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => {
    setOpen(false);
    setPw("");
    setErr(false);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.trim().toLowerCase() !== PASSWORD) {
      setErr(true);
      return;
    }
    setUnlocked(true);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    close();
  };

  const disabled = !sc.file;

  // Unlocked: render as a real download link, dark/black variant.
  if (unlocked && sc.file) {
    return (
      <a
        href={sc.file}
        download={`${sc.name}.pdf`}
        className="dl script unlocked"
        style={{ gridColumn: "span 4", textAlign: "left" }}
      >
        <span className="icon">↓</span>
        <div className="type">{sc.type} · UNLOCKED</div>
        <div className="name">{sc.name}</div>
        <div className="detail">Click to download</div>
      </a>
    );
  }

  return (
    <>
      <button
        type="button"
        className={`dl script ${disabled ? "disabled" : ""}`}
        style={{ gridColumn: "span 4", textAlign: "left", border: "none", font: "inherit", cursor: disabled ? "not-allowed" : "pointer" }}
        onClick={() => !disabled && setOpen(true)}
      >
        <span className="icon">🔒</span>
        <div className="type">{sc.type}</div>
        <div className="name">{sc.name}</div>
        <div className="detail">{sc.detail}</div>
      </button>

      {open && (
        <div className="pw-modal" onClick={close}>
          <form
            className="pw-box"
            onClick={(e) => e.stopPropagation()}
            onSubmit={onSubmit}
          >
            <div className="pw-title">Enter password</div>
            <p className="pw-sub">Full script is password protected.</p>
            <input
              type="password"
              autoFocus
              value={pw}
              onChange={(e) => {
                setPw(e.target.value);
                setErr(false);
              }}
              placeholder="•••••••••"
              className="pw-input"
            />
            {err && <div className="pw-err">Wrong password.</div>}
            <div className="pw-actions">
              <button
                type="button"
                className="pw-btn pw-btn-ghost"
                onClick={close}
              >
                Cancel
              </button>
              <button type="submit" className="pw-btn pw-btn-primary">
                Unlock
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

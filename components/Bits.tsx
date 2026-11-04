"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LOC_TYPES, type Lang, type Location, type LocType } from "@/lib/data";
import { svNow, openStatus, type SvNow } from "@/lib/time";
import { Icon } from "./Icon";

export function TypeBadge({ type, lang }: { type: LocType; lang: Lang }) {
  const T = LOC_TYPES[type];
  return (
    <span className={`pill ${T.cls}`}>
      {T.icon && <Icon name={T.icon} />}
      {T.label[lang]}
    </span>
  );
}

/** El Salvador "now", only after mount, so server and client HTML match. */
export function useSvNow(): SvNow | null {
  const [now, setNow] = useState<SvNow | null>(null);
  useEffect(() => {
    setNow(svNow());
    const id = setInterval(() => setNow(svNow()), 60_000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function OpenStatus({ loc, lang, style }: { loc: Location; lang: Lang; style?: React.CSSProperties }) {
  const now = useSvNow();
  if (!now) return <span className="status" style={{ visibility: "hidden", ...style }}>·</span>;
  const st = openStatus(loc, lang, now);
  return <span className={`status ${st.open ? "open" : ""}`} style={style}>{st.text}</span>;
}

export function toast(html: string) {
  window.dispatchEvent(new CustomEvent("micarro:toast", { detail: html }));
}

export function Toast() {
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    let tm: ReturnType<typeof setTimeout>;
    const on = (e: Event) => {
      setMsg((e as CustomEvent<string>).detail);
      clearTimeout(tm);
      tm = setTimeout(() => setMsg(null), 3200);
    };
    window.addEventListener("micarro:toast", on);
    return () => window.removeEventListener("micarro:toast", on);
  }, []);
  return <div className={`toast ${msg ? "show" : ""}`} role="status" aria-live="polite" dangerouslySetInnerHTML={{ __html: msg || "" }} />;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

/** A link/button for pages that come in a later phase. */
export function SoonLink({ name, suffix, className, children, asButton }: { name: string; suffix: string; className?: string; children: React.ReactNode; asButton?: boolean }) {
  const onClick = (e: React.MouseEvent) => { e.preventDefault(); toast(`<b>${esc(name)}</b> ${esc(suffix)}`); };
  return asButton
    ? <button type="button" className={className} onClick={onClick}>{children}</button>
    : <a href="#" className={className} onClick={onClick}>{children}</a>;
}

export { Link };

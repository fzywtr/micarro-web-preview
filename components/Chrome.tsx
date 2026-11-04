"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Lang } from "@/lib/data";
import { href, t } from "@/lib/i18n";
import { Icon } from "./Icon";
import { SoonLink } from "./Bits";

function Logo({ lang, big }: { lang: Lang; big?: boolean }) {
  return (
    <Link className="logo" href={href(lang, "/")} aria-label={t(lang).nav.home} style={big ? { fontSize: 30 } : undefined}>
      <span className="mi">Mi</span>Carro
    </Link>
  );
}

export function Ribbon({ lang }: { lang: Lang }) {
  const [a, b] = t(lang).ribbon;
  return (
    <div className="ribbon"><div className="wrap"><span><b>{a}</b> {b}</span></div></div>
  );
}

export function Header({ lang }: { lang: Lang }) {
  const T = t(lang).nav;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = usePathname();
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const home = href(lang, "/");
  const close = () => setOpen(false);
  return (
    <header className={`hdr ${scrolled ? "scrolled" : ""}`}>
      <div className="wrap">
        <Logo lang={lang} />
        <nav className={`nav ${open ? "open" : ""}`} id="nav" aria-label="Main">
          <Link href={`${home}#mapa`} onClick={close}>{T.locations}</Link>
          <Link href={`${home}#servicios`} onClick={close}>{T.services}</Link>
          <SoonLink name={T.agua} suffix={t(lang).soon}>{T.agua}</SoonLink>
          <Link href={`${home}#unete`} onClick={close}>{T.join}</Link>
          <Link className="btn btn-dark btn-sm" href={href(lang, "/reservar")} onClick={close}>{T.book}</Link>
        </nav>
        <button className="menu-btn" aria-label={T.openMenu} aria-expanded={open} aria-controls="nav" onClick={() => setOpen((o) => !o)}>
          <Icon name={open ? "x" : "menu"} />
        </button>
      </div>
    </header>
  );
}

export function Footer({ lang }: { lang: Lang }) {
  const D = t(lang);
  const home = href(lang, "/");
  return (
    <footer>
      <div className="wrap">
        <div className="foot">
          <div>
            <Logo lang={lang} big />
            <p>{D.footer.tagline}</p>
          </div>
          <nav aria-label="Footer">
            <Link href={`${home}#mapa`}>{D.nav.locations}</Link>
            <Link href={`${home}#servicios`}>{D.nav.services}</Link>
            <Link href={href(lang, "/reservar")}>{D.nav.book}</Link>
          </nav>
          <nav aria-label="Company">
            <SoonLink name={D.nav.agua} suffix={D.soon}>{D.nav.agua}</SoonLink>
            <Link href={`${home}#unete`}>{D.nav.join}</Link>
            <SoonLink name={D.nav.contact} suffix={D.soon}>{D.nav.contact}</SoonLink>
          </nav>
        </div>
        <div className="legal">
          <span>{D.footer.made}</span>
          <span>{D.footer.sample}</span>
        </div>
      </div>
    </footer>
  );
}

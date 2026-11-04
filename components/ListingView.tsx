"use client";

import Link from "next/link";
import { useState } from "react";
import { LOCATIONS, LOC_TYPES, SERVICES, VEHICLES, getLocation, money, type Lang, type VehId } from "@/lib/data";
import { href, t } from "@/lib/i18n";
import { WEEK_ORDER, fmtTime } from "@/lib/time";
import { Icon } from "./Icon";
import { OpenStatus, TypeBadge, useSvNow } from "./Bits";
import { LocationCard } from "./LocationCard";
import { MiniMap } from "./Finder";

export function ListingView({ slug, lang }: { slug: string; lang: Lang }) {
  const D = t(lang);
  const L = D.listing;
  const loc = getLocation(slug)!;
  const T = LOC_TYPES[loc.type];
  const now = useSvNow();
  const [veh, setVeh] = useState<VehId>("compacto");
  const from = Math.min(...loc.services.map((s) => SERVICES.find((x) => x.id === s)!.price[veh]));
  const bookHref = (svc?: string) => href(lang, `/reservar/${loc.slug}`) + `?vehiculo=${veh}${svc ? `&servicio=${svc}` : ""}`;
  const others = LOCATIONS.filter((o) => o !== loc)
    .sort((a, b) => Math.hypot(a.lat - loc.lat, a.lng - loc.lng) - Math.hypot(b.lat - loc.lat, b.lng - loc.lng))
    .slice(0, 3);
  const home = href(lang, "/");

  return (
    <div data-view="listing" className="has-mbar">
      <nav className="crumbs" aria-label={L.crumbs}>
        <Link href={home}>{L.home}</Link><span>/</span>
        <Link href={`${home}#mapa`}>{D.nav.locations}</Link><span>/</span>
        <span aria-current="page">{loc.name[lang]}</span>
      </nav>
      <header className="l-head">
        <div className="badges"><TypeBadge type={loc.type} lang={lang} /><span className="tag-ej">{D.sample}</span></div>
        <h1>{loc.name[lang]}</h1>
        <div className="meta"><span><Icon name="pin" />{loc.city}</span><OpenStatus loc={loc} lang={lang} /></div>
      </header>

      <div className="l-grid">
        <div>
          <figure className="l-photo">
            <img src={loc.img} alt={L.photoAlt(loc.name[lang])} style={{ objectPosition: loc.pos }} />
            <span className="credit">{D.illusImg}</span>
          </figure>

          <section className="l-sec" id="servicios-lista">
            <h2>{L.services}</h2>
            <div className="seg" role="group" aria-label={L.vehAria} style={{ marginBottom: 12, maxWidth: 420 }}>
              {VEHICLES.map((v) => (
                <button key={v.id} type="button" aria-pressed={veh === v.id} onClick={() => setVeh(v.id)}>{v.name[lang]}</button>
              ))}
            </div>
            <div className="svc">
              {SERVICES.map((s) => {
                const ok = loc.services.includes(s.id);
                return (
                  <div key={s.id} className={`svc-row ${ok ? "" : "na"}`}>
                    <div>
                      <h3>{s.name[lang]}</h3>
                      <p>{s.desc[lang]}</p>
                      <div className="facts">
                        <span><Icon name="clock" />~{s.mins} min · {L.sampleLc}</span>
                        {!ok && <span>{L.notHere}</span>}
                      </div>
                    </div>
                    <div className="price">
                      <span className="amt">{money(s.price[veh])}</span>
                      {ok && <Link className="btn btn-dark btn-sm" href={bookHref(s.id)}>{L.book}</Link>}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="l-sec">
            <h2>{L.visit}</h2>
            <ol className="steps4">
              {L.visitSteps.map(([b, s], i) => <li key={b}><span className="n">{i + 1}</span><b>{b}</b><span>{s}</span></li>)}
            </ol>
          </section>

          <section className="l-sec">
            <h2>{L.hours}</h2>
            <div className="hours">
              {WEEK_ORDER.map((d) => {
                const h = loc.hours[d];
                const today = now?.dow === d;
                const name = D.time.days[d];
                return (
                  <div key={d} className={`${today ? "today" : ""} ${h ? "" : "closed"}`}>
                    <span>{name.charAt(0).toUpperCase() + name.slice(1)}{today ? ` · ${L.today}` : ""}</span>
                    <span>{h ? `${fmtTime(h[0], lang)} – ${fmtTime(h[1], lang)}` : L.closed}</span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="l-sec">
            <div className="explain">
              <span className="ico"><Icon name={loc.type === "socio" ? "shield" : loc.type === "aliado" ? "store" : "checkc"} /></span>
              <div><h3>{T.explainTitle[lang]}</h3><p>{T.explain[lang]}</p></div>
            </div>
          </section>
        </div>

        <aside className="side">
          <div className="bookcard">
            <h2>{L.bookTitle}</h2>
            <div className="from">
              <span className="price"><span className="amt"><small>{L.from}</small>{money(from)}</span></span>
              <span className="tag-ej">{D.samplePrice}</span>
            </div>
            <p style={{ color: "var(--ink-2)", fontSize: 14.5 }}>{loc.about[lang]}</p>
            <Link className="btn btn-lime btn-block" href={bookHref()}>{L.chooseTime} <Icon name="arrow" /></Link>
            <p className="fine">{L.bookFine}</p>
          </div>
          <div className="minimap">
            <MiniMap slug={loc.slug} lang={lang} />
            <div className="in">
              <div className="li"><Icon name="pin" /><span>{loc.addr[lang]}</span></div>
              <a className="link-arrow" href={`https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`} target="_blank" rel="noopener noreferrer">
                <Icon name="nav" /> {L.directions}
              </a>
            </div>
          </div>
        </aside>
      </div>

      <section className="sec">
        <div className="sec-head">
          <h2>{L.nearby}</h2>
          <Link className="link-arrow" href={`${home}#mapa`}>{L.seeMap} <Icon name="arrow" /></Link>
        </div>
        <div className="cards">{others.map((o) => <LocationCard key={o.slug} loc={o} lang={lang} />)}</div>
      </section>

      <div className="mbar">
        <div className="t">{L.from} <b>{money(from)}</b>{L.mbarSample}</div>
        <Link className="btn btn-lime" href={bookHref()}>{L.mbarCta}</Link>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { LOCATIONS, SERVICES, getLocation, minPrice, money, type Lang } from "@/lib/data";
import { href, t } from "@/lib/i18n";
import { HOME_CENTER, fitViewBox, project } from "@/lib/map";
import { Icon } from "./Icon";
import { MapSvg } from "./MapSvg";
import { OpenStatus, TypeBadge } from "./Bits";

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

export function useSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, size] as const;
}

export function Finder({ lang }: { lang: Lang }) {
  const D = t(lang);
  const F = D.finder;
  const [wrapRef, size] = useSize<HTMLDivElement>();
  const baseH = size.w ? Math.max(440, (560 * size.h) / size.w) : 440;
  const [view, setView] = useState<{ cx: number; cy: number; h: number | null }>({ ...HOME_CENTER, h: null });
  const vb = fitViewBox(size, view.cx, view.cy, view.h ?? baseH);

  const [q, setQ] = useState("");
  const [svc, setSvc] = useState("");
  const [current, setCurrent] = useState(LOCATIONS.map((l) => l.slug));
  const [pop, setPop] = useState<string | null>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const [popPos, setPopPos] = useState<{ left: number; top: number; below: boolean } | null>(null);

  const pins = useMemo(
    () => LOCATIONS.map((l) => { const [x, y] = project(l.lng, l.lat); return { slug: l.slug, x, y, label: `${l.name[lang]}, ${l.city}` }; }),
    [lang],
  );
  const dim = useMemo(() => new Set(LOCATIONS.filter((l) => !current.includes(l.slug)).map((l) => l.slug)), [current]);
  const sheet = size.w > 0 && size.w < 600;

  // Position the popup above (or below) its pin, in screen pixels.
  useLayoutEffect(() => {
    if (!pop || sheet || !size.w) { setPopPos(null); return; }
    const p = pins.find((x) => x.slug === pop)!;
    const sx = ((p.x - vb.x) / vb.w) * size.w;
    const sy = ((p.y - vb.y) / vb.h) * size.h;
    const pinH = (40 * vb.pinScale * size.h) / vb.h;
    const popH = popRef.current?.offsetHeight ?? 260;
    const left = Math.max(143, Math.min(size.w - 143, sx));
    const below = sy - pinH - 8 - popH < 8;
    setPopPos({ left, top: below ? sy + 8 : sy - pinH - 8, below });
  }, [pop, sheet, size.w, size.h, vb.x, vb.y, vb.w, vb.h, vb.pinScale, pins]);

  function openPop(slug: string) {
    setPop(slug);
    const p = pins.find((x) => x.slug === slug)!;
    if (p.x < vb.x + vb.w * 0.06 || p.x > vb.x + vb.w * 0.94 || p.y < vb.y + vb.h * 0.1 || p.y > vb.y + vb.h * 0.95) {
      setView((v) => ({ ...v, cx: p.x, cy: p.y }));
    }
  }

  function search(e: React.FormEvent) {
    e.preventDefault();
    setPop(null);
    const nq = norm(q);
    const res = LOCATIONS.filter((l) =>
      (!nq || norm(`${l.city} ${l.name.es} ${l.name.en} ${l.addr.es}`).includes(nq)) &&
      (!svc || l.services.includes(svc as never)));
    setCurrent(res.map((l) => l.slug));
    if (!res.length) return;
    if (res.length === LOCATIONS.length) { setView({ ...HOME_CENTER, h: null }); return; }
    const xs = res.map((l) => project(l.lng, l.lat));
    const cx = xs.reduce((a, p) => a + p[0], 0) / xs.length;
    const cy = xs.reduce((a, p) => a + p[1], 0) / xs.length;
    const span = Math.max(...xs.map((p) => p[0])) - Math.min(...xs.map((p) => p[0]));
    setView({ cx, cy, h: res.length === 1 ? 260 : Math.max(300, Math.min(baseH, span * 0.75 + 160)) });
    if (res.length === 1) setPop(res[0].slug);
  }

  const zoom = (f: number) => setView((v) => ({ ...v, h: Math.max(150, Math.min(620, (v.h ?? baseH) * f)) }));
  const shown = LOCATIONS.filter((l) => current.includes(l.slug));
  const popLoc = pop ? getLocation(pop)! : null;

  return (
    <section className="finder" id="mapa" aria-labelledby="finderTitle">
      <h2 id="finderTitle" className="sr">{F.title}</h2>
      <form className="finder-bar" onSubmit={search} noValidate>
        <span className="pinbadge"><Icon name="pin" /></span>
        <div className="field">
          <label htmlFor="q">{F.loc}</label>
          <input className="input" id="q" placeholder={F.placeholder} autoComplete="off" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="svcSel">{F.svc}</label>
          <select className="select" id="svcSel" value={svc} onChange={(e) => setSvc(e.target.value)}>
            <option value="">{F.all}</option>
            {SERVICES.map((s) => <option key={s.id} value={s.id}>{s.name[lang]}</option>)}
          </select>
        </div>
        <button className="btn btn-lime" type="submit"><Icon name="search" /> {F.search}</button>
      </form>
      <div className="finder-body">
        <div className="map-wrap" ref={wrapRef} onClick={() => setPop(null)}>
          <MapSvg vb={vb} pins={pins} labels={D.mapLabels} aria={D.mapAria} dim={dim} active={pop} onPin={openPop} />
          <div className="map-zoom" onClick={(e) => e.stopPropagation()}>
            <button type="button" aria-label={F.zoomIn} onClick={() => zoom(0.75)}>+</button>
            <button type="button" aria-label={F.zoomOut} onClick={() => zoom(1.33)}>−</button>
          </div>
          <span className="map-note">{D.illusMap}</span>
          {popLoc && (
            <div
              ref={popRef}
              className={`map-pop ${sheet ? "sheet" : ""} ${popPos?.below ? "below" : ""}`}
              style={sheet ? undefined : { left: popPos?.left ?? -9999, top: popPos?.top ?? -9999 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="x" type="button" aria-label={F.close} onClick={() => setPop(null)}><Icon name="x" /></button>
              <img src={popLoc.img} alt="" style={{ objectPosition: popLoc.pos }} />
              <div className="in">
                <TypeBadge type={popLoc.type} lang={lang} />
                <h4>{popLoc.name[lang]}</h4>
                <OpenStatus loc={popLoc} lang={lang} />
                <div className="row">
                  <Link className="btn btn-line btn-sm" href={href(lang, `/ubicaciones/${popLoc.slug}`)}>{F.details}</Link>
                  <Link className="btn btn-lime btn-sm" href={href(lang, `/reservar/${popLoc.slug}`)}>{F.book}</Link>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="results" aria-live="polite">
          <div className="results-head"><b>{shown.length === 1 ? F.one : F.many(shown.length)}</b><span className="tag-ej">{D.sample}</span></div>
          <div className="results-list">
            {shown.length ? shown.map((l) => (
              <button key={l.slug} className={`res ${pop === l.slug ? "active" : ""}`} type="button" onClick={() => openPop(l.slug)}>
                <img src={l.img} alt="" style={{ objectPosition: l.pos }} />
                <div>
                  <h4>{l.name[lang]}</h4>
                  <div className="meta">
                    <span>{l.city}</span>
                    <OpenStatus loc={l} lang={lang} />
                    <span>{F.from} {money(minPrice(l))} · {F.sampleLc}</span>
                  </div>
                </div>
              </button>
            )) : (
              <div className="empty">{F.empty[0]} <b>San Salvador</b>, <b>Santa Tecla</b> {F.empty[1]} <b>Soyapango</b>.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function MiniMap({ slug, lang }: { slug: string; lang: Lang }) {
  const D = t(lang);
  const l = getLocation(slug)!;
  const [ref, size] = useSize<HTMLDivElement>();
  const [x, y] = project(l.lng, l.lat);
  const vb = fitViewBox(size, x, y - 20, 170);
  return (
    <div className="map-wrap" ref={ref}>
      <MapSvg vb={vb} pins={[{ slug, x, y, label: l.name[lang] }]} labels={D.mapLabels} aria={D.mapAria} />
      <span className="map-note">{D.illusMap}</span>
    </div>
  );
}

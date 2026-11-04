"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  FIRST_VISIT_DISCOUNT, LOCATIONS, SERVICES, VEHICLES, getLocation, getService, money,
  type Lang, type Location, type SvcId, type VehId,
} from "@/lib/data";
import { href, t } from "@/lib/i18n";
import { dateLabel, dayList, fmtTime, slotsFor, type SvNow } from "@/lib/time";
import { Icon, VehicleIcon } from "./Icon";
import { OpenStatus, TypeBadge, useSvNow } from "./Bits";

interface Props { lang: Lang; slug: string | null; initialService?: SvcId; initialVehicle?: VehId }

function firstAvailableDay(loc: Location, now: SvNow) {
  const d = dayList(loc, now).find((x) => x.avail);
  return d ? d.i : null;
}

export function BookingFlow({ lang, slug: initialSlug, initialService, initialVehicle }: Props) {
  const D = t(lang);
  const B = D.booking;
  const now = useSvNow();
  const [slug, setSlug] = useState(initialSlug);
  const [pickedHere, setPickedHere] = useState(false);
  const [step, setStep] = useState(initialSlug ? 1 : 0);
  const [svc, setSvc] = useState<SvcId>(initialService ?? "exterior");
  const [veh, setVeh] = useState<VehId>(initialVehicle ?? "compacto");
  const [day, setDay] = useState<number | null>(null);
  const [time, setTime] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [plate, setPlate] = useState("");
  const [promo, setPromo] = useState(true);
  const [errors, setErrors] = useState<{ time?: string; name?: string; phone?: string }>({});
  const [done, setDone] = useState<string | null>(null);
  const loc = slug ? getLocation(slug)! : null;
  const topRef = useRef<HTMLDivElement>(null);

  // pick the first day with free times once we know "now" in El Salvador
  useEffect(() => { if (now && loc && day === null) setDay(firstAvailableDay(loc, now)); }, [now, loc, day]);

  const toTop = () => window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });

  const service = getService(svc)!;
  const base = service.price[veh];
  const disc = promo ? Math.round(base * FIRST_VISIT_DISCOUNT * 100) / 100 : 0;
  const total = base - disc;

  function chooseLocation(s: string) {
    const L = getLocation(s)!;
    setSlug(s);
    setPickedHere(true);
    if (!L.services.includes(svc)) setSvc("exterior");
    setDay(now ? firstAvailableDay(L, now) : null);
    setTime(null);
    window.history.replaceState(null, "", href(lang, `/reservar/${s}`));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    if (step === 2 && time == null) { setErrors({ time: B.errTime }); return; }
    if (step === 3) {
      const errs: typeof errors = {};
      if (name.trim().length < 2) errs.name = B.errName;
      if (phone.replace(/\D/g, "").length !== 8) errs.phone = B.errPhone;
      if (Object.keys(errs).length) {
        setErrors(errs);
        setTimeout(() => (document.querySelector('[aria-invalid="true"]') as HTMLElement | null)?.focus(), 0);
        return;
      }
      setDone("MC-" + Math.random().toString(36).slice(2, 6).toUpperCase());
      toTop();
      return;
    }
    setStep(step + 1);
    toTop();
  }

  const home = href(lang, "/");

  if (done && loc && day != null && time != null && now) {
    const first = name.trim().split(/\s+/)[0];
    return (
      <div data-view="booking">
        <div className="done" style={{ marginTop: 12 }}>
          <section className="done-main">
            <span className="ok"><Icon name="check" /></span>
            <h1>{B.doneTitle(first)}</h1>
            <p>{B.doneBody(loc.name[lang])}</p>
            <dl>
              <div><dt>{B.dLoc}</dt><dd>{loc.name[lang]}<br /><span style={{ fontWeight: 400, color: "#C9CCC3" }}>{loc.city}</span></dd></div>
              <div><dt>{B.dWhen}</dt><dd>{dateLabel(now, day, lang)}, {fmtTime(time, lang)}</dd></div>
              <div><dt>{B.dSvc}</dt><dd>{service.name[lang]} · {VEHICLES.find((v) => v.id === veh)!.name[lang]}</dd></div>
              <div><dt>{B.dTotal}</dt><dd>{money(total)}{disc ? B.dIncl : ""}</dd></div>
            </dl>
            <div className="water"><Icon name="drop" /><span>{B.water}</span></div>
            <div className="row">
              <Link className="btn btn-lime" href={href(lang, `/ubicaciones/${loc.slug}`)}>{B.viewLoc}</Link>
              <Link className="btn btn-ghost" href={home}>{B.backHome}</Link>
            </div>
          </section>
          <aside className="qrcard">
            <p className="eyebrow">{B.qrTitle}</p>
            <div className="qr"><QRCodeSVG value={`MICARRO|${done}|${loc.slug}|${day}|${time}`} size={160} fgColor="#0B0B0B" bgColor="#FFFFFF" /></div>
            <div className="code">{done}</div>
            <p className="fine">{B.qrFine}</p>
          </aside>
        </div>
      </div>
    );
  }

  const canBack = step > (initialSlug && !pickedHere ? 1 : 0);

  return (
    <div data-view="booking" ref={topRef}>
      <nav className="crumbs" aria-label={D.listing.crumbs}>
        <Link href={home}>{D.listing.home}</Link><span>/</span>
        {loc && <><Link href={href(lang, `/ubicaciones/${loc.slug}`)}>{loc.name[lang]}</Link><span>/</span></>}
        <span aria-current="page">{B.crumb}</span>
      </nav>
      <div className="bk-head"><h1>{B.title}</h1></div>
      <ol className="stepper" aria-label={B.stepsAria}>
        {B.steps.map((n, i) => (
          <li key={n} className={i === step ? "cur" : i < step ? "done" : ""} aria-current={i === step ? "step" : undefined}>
            <span className="n">{i < step ? "✓" : i + 1}</span>{n}
          </li>
        ))}
      </ol>
      <div className="bk-grid">
        <form className="panel" onSubmit={submit} noValidate>
          {step === 0 && (
            <>
              <div><h2>{B.whereTitle}</h2><p className="sub">{B.whereSub}</p></div>
              <div className="pickloc" role="radiogroup" aria-label={B.locAria}>
                {LOCATIONS.map((o) => (
                  <label key={o.slug} className="opt">
                    <input type="radio" name="loc" value={o.slug} checked={slug === o.slug} onChange={() => chooseLocation(o.slug)} />
                    <img src={o.img} alt="" style={{ objectPosition: o.pos }} />
                    <span>
                      <b style={{ fontSize: 15 }}>{o.name[lang]}</b>
                      <div className="d">{o.city}</div>
                      <div className="d"><OpenStatus loc={o} lang={lang} style={{ fontSize: 12.5 }} /></div>
                    </span>
                    <span className="radio" />
                  </label>
                ))}
              </div>
            </>
          )}

          {step === 1 && loc && (
            <>
              <div><h2>{B.vehTitle}</h2><p className="sub">{B.vehSub}</p></div>
              <div className="veh" role="radiogroup" aria-label={B.vehTitle}>
                {VEHICLES.map((v) => (
                  <label key={v.id} className="opt">
                    <input type="radio" name="veh" value={v.id} checked={veh === v.id} onChange={() => setVeh(v.id)} />
                    <VehicleIcon id={v.id} /><b>{v.name[lang]}</b>
                  </label>
                ))}
              </div>
              <div><h2>{B.svcTitle}</h2><p className="sub">{B.svcSub(VEHICLES.find((v) => v.id === veh)!.name[lang])}</p></div>
              <div className="opts" role="radiogroup" aria-label={B.svcTitle}>
                {SERVICES.map((s) => {
                  const ok = loc.services.includes(s.id);
                  return (
                    <label key={s.id} className="opt">
                      <input type="radio" name="svc" value={s.id} checked={svc === s.id} disabled={!ok} onChange={() => setSvc(s.id)} />
                      <span className="radio" />
                      <span><b>{s.name[lang]}</b><div className="d">{ok ? `${s.desc[lang]} ~${s.mins} min.` : B.notHere}</div></span>
                      <span className="p">{money(s.price[veh])}</span>
                    </label>
                  );
                })}
              </div>
            </>
          )}

          {step === 2 && loc && <DateTimeStep loc={loc} lang={lang} now={now} day={day} time={time} error={errors.time}
            onDay={(d) => { setDay(d); setTime(null); setErrors({}); }} onTime={(m) => { setTime(m); setErrors({}); }} />}

          {step === 3 && (
            <>
              <div><h2>{B.detailsTitle}</h2><p className="sub">{B.detailsSub}</p></div>
              <div className="form">
                <div className="full">
                  <label htmlFor="fName">{B.name}</label>
                  <input className="input" id="fName" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)}
                    aria-invalid={errors.name ? true : undefined} aria-describedby={errors.name ? "eName" : undefined} />
                  {errors.name && <p className="err" id="eName">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="fPhone">{B.phone}</label>
                  <div className="phone">
                    <span>+503</span>
                    <input className="input" id="fPhone" inputMode="tel" autoComplete="tel-national" placeholder="7000-0000" value={phone}
                      onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 8); setPhone(v.length > 4 ? v.slice(0, 4) + "-" + v.slice(4) : v); }}
                      aria-invalid={errors.phone ? true : undefined} aria-describedby={errors.phone ? "ePhone" : undefined} />
                  </div>
                  {errors.phone ? <p className="err" id="ePhone">{errors.phone}</p> : <p className="hint">{B.phoneHint}</p>}
                </div>
                <div>
                  <label htmlFor="fPlate">{B.plate} <span style={{ fontWeight: 500, color: "var(--ink-2)" }}>{B.optional}</span></label>
                  <input className="input" id="fPlate" placeholder="P 123-456" value={plate} onChange={(e) => setPlate(e.target.value.toUpperCase())} />
                  <p className="hint">{B.plateHint}</p>
                </div>
              </div>
              <label className="toggle">
                <input type="checkbox" checked={promo} onChange={(e) => setPromo(e.target.checked)} />
                <span><b>{B.firstVisit}</b><div className="d">{B.firstVisitSub}</div></span>
              </label>
              <div>
                <h2 style={{ fontSize: 17 }}>{B.pay}</h2>
                <div className="opts" style={{ marginTop: 10 }}>
                  <label className="opt">
                    <input type="radio" name="pay" defaultChecked /><span className="radio" />
                    <span><b style={{ fontSize: 15 }}>{B.payOnSite}</b><div className="d">{B.payOnSiteSub}</div></span><Icon name="cash" />
                  </label>
                  <label className="opt">
                    <input type="radio" name="pay" disabled /><span className="radio" />
                    <span><b style={{ fontSize: 15 }}>{B.payOnline}</b><div className="d">{B.payOnlineSub}</div></span><span className="tag-ej">{B.soon}</span>
                  </label>
                </div>
              </div>
            </>
          )}

          <div className="nav-row">
            {canBack
              ? <button type="button" className="btn btn-line" onClick={() => { setErrors({}); setStep(step - 1); toTop(); }}><Icon name="back" /> {B.back}</button>
              : <span />}
            <button type="submit" className={`btn ${step === 3 ? "btn-lime" : "btn-dark"}`} disabled={step === 0 && !slug}>
              {step === 3 ? B.confirm : B.next} <Icon name="arrow" />
            </button>
          </div>
        </form>

        <Summary lang={lang} loc={loc} step={step} svc={svc} veh={veh} now={now} day={day} time={time} base={base} disc={disc} total={total} />
      </div>
    </div>
  );
}

function DateTimeStep({ loc, lang, now, day, time, error, onDay, onTime }: {
  loc: Location; lang: Lang; now: SvNow | null; day: number | null; time: number | null; error?: string;
  onDay: (d: number) => void; onTime: (m: number) => void;
}) {
  const B = t(lang).booking;
  const T = t(lang).time;
  const days = useMemo(() => (now ? dayList(loc, now) : []), [loc, now]);
  const slots = now && day != null ? slotsFor(loc, now, day) : [];
  const am = slots.filter((s) => s.m < 720), pm = slots.filter((s) => s.m >= 720);
  const SlotGrid = ({ list }: { list: typeof slots }) => (
    <div className="slots">
      {list.map((s) => (
        <button key={s.m} type="button" className="slot" aria-pressed={time === s.m} disabled={s.taken} onClick={() => onTime(s.m)}>{fmtTime(s.m, lang)}</button>
      ))}
    </div>
  );
  return (
    <>
      <div><h2>{B.dayTitle}</h2><p className="sub">{B.daySub}</p></div>
      <div className="days" role="group" aria-label={B.dayAria}>
        {days.map((d) => (
          <button key={d.i} type="button" className="day" aria-pressed={day === d.i} disabled={!d.avail} onClick={() => onDay(d.i)}>
            <small>{d.i === 0 ? T.today : d.i === 1 ? T.tomorrow : T.dsh[d.dow]}</small><b>{d.dd}</b><small>{T.mon[d.mon]}</small>
          </button>
        ))}
      </div>
      <div>
        <h2>{B.timeTitle}</h2>
        {error && <p className="err" style={{ color: "var(--danger)", fontSize: 13.5, marginTop: 4 }}>{error}</p>}
      </div>
      {slots.length ? (
        <>
          {am.length > 0 && <div><p className="eyebrow" style={{ marginBottom: 8 }}>{B.morning}</p><SlotGrid list={am} /></div>}
          {pm.length > 0 && <div><p className="eyebrow" style={{ marginBottom: 8 }}>{B.afternoon}</p><SlotGrid list={pm} /></div>}
          <p className="legend">{B.legend}</p>
        </>
      ) : now ? <p className="sub">{B.closedDay}</p> : null}
    </>
  );
}

function Summary({ lang, loc, step, svc, veh, now, day, time, base, disc, total }: {
  lang: Lang; loc: Location | null; step: number; svc: SvcId; veh: VehId; now: SvNow | null;
  day: number | null; time: number | null; base: number; disc: number; total: number;
}) {
  const B = t(lang).booking;
  if (!loc) {
    return (
      <aside className="summary"><div className="in"><h3>{B.summary}</h3><p className="fine" style={{ fontSize: 14 }}>{B.summaryEmpty}</p></div></aside>
    );
  }
  const when = now && day != null && time != null ? `${dateLabel(now, day, lang)}, ${fmtTime(time, lang)}` : B.tbd;
  return (
    <aside className="summary" aria-label={B.summaryAria}>
      <div className="ph"><img src={loc.img} alt="" style={{ objectPosition: loc.pos }} /><TypeBadge type={loc.type} lang={lang} /></div>
      <div className="in">
        <div><h3>{loc.name[lang]}</h3><p className="fine" style={{ fontSize: 13.5 }}>{loc.city}</p></div>
        <dl>
          <div><dt>{B.sService}</dt><dd>{step >= 1 ? getService(svc)!.name[lang] : "—"}</dd></div>
          <div><dt>{B.sVehicle}</dt><dd>{VEHICLES.find((v) => v.id === veh)!.name[lang]}</dd></div>
          <div><dt>{B.sDate}</dt><dd>{when}</dd></div>
          <div><dt>{B.sPrice}</dt><dd>{money(base)}</dd></div>
          {disc > 0 && <div className="disc"><dt>{B.sFirst}</dt><dd>−{money(disc)}</dd></div>}
        </dl>
        <div className="tot"><span>{B.sTotal}</span><b>{money(total)}</b></div>
        <p className="fine">{B.sFine}</p>
      </div>
    </aside>
  );
}

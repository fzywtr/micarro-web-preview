import Link from "next/link";
import { LOCATIONS } from "@/lib/data";
import { href, isLang, t } from "@/lib/i18n";
import { Icon } from "@/components/Icon";
import { Finder } from "@/components/Finder";
import { LocationCard } from "@/components/LocationCard";
import { SoonLink } from "@/components/Bits";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: l } = await params;
  const lang = isLang(l) ? l : "es";
  const D = t(lang);
  return (
    <div data-view="home">
      <section className="hero" aria-labelledby="h1">
        <div className="hero-copy">
          <h1 id="h1">{D.hero.title}</h1>
          <p>{D.hero.body}</p>
          <div className="hero-cta">
            <Link className="btn btn-lime" href={href(lang, "/reservar")}>{D.hero.cta} <Icon name="arrow" /></Link>
            <a className="btn btn-ghost" href="#servicios">{D.hero.cta2}</a>
          </div>
        </div>
        <div className="hero-photo"><img src="/img/hero.webp" alt={D.hero.alt} fetchPriority="high" /></div>
      </section>

      <Finder lang={lang} />

      <section className="promo" aria-label={D.promo.aria}>
        <div className="promo-card pc-lime">
          <span className="pill">{D.promo.tag}</span>
          <h3>{D.promo.title}</h3>
          <p>{D.promo.body}</p>
          <img src="/img/3d-dollar.webp" alt="" />
          <Link className="btn btn-dark" href={href(lang, "/reservar")}>{D.promo.cta}</Link>
        </div>
        <div className="promo-card pc-dark" id="servicios">
          <span className="pill">{D.promo.vTag}</span>
          <h3>VaporClean™</h3>
          <p>{D.promo.vBody}</p>
          <img src="/img/3d-steam.webp" alt="" />
          <Link className="btn btn-white" href={href(lang, "/ubicaciones/escalon") + "#servicios-lista"}>{D.promo.vCta}</Link>
        </div>
      </section>

      <section className="sec" aria-labelledby="howT">
        <div className="sec-head"><h2 id="howT">{D.how.title}</h2></div>
        <ol className="how">
          {D.how.steps.map(([title, body], i) => (
            <li key={title}><span className="n">{i + 1}</span><h3>{title}</h3><p>{body}</p></li>
          ))}
        </ol>
      </section>

      <section className="sec" aria-labelledby="featT">
        <div className="sec-head">
          <h2 id="featT">{D.featured.title}</h2>
          <a className="link-arrow" href="#mapa">{D.featured.all} <Icon name="arrow" /></a>
        </div>
        <div className="cards">{LOCATIONS.slice(0, 3).map((loc) => <LocationCard key={loc.slug} loc={loc} lang={lang} />)}</div>
      </section>

      <section className="sec appband" id="app" aria-labelledby="appT">
        <div className="art"><img src="/img/app-miko.webp" width={820} height={1029} alt={D.app.alt} /></div>
        <div className="copy">
          <span className="pill b-lime">{D.app.soon}</span>
          <h2 id="appT">{D.app.title}</h2>
          <p>{D.app.body}</p>
          <div className="stores">
            <div className="store">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.4 12.6c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.1-1.2 2.9-2.4.9-1.4 1.3-2.7 1.3-2.8-.1 0-2.4-.9-2.4-3.9zM14 5.3c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1 .1 2.1-.6 2.8-1.4z" /></svg>
              <div><small>{D.app.storeSmall}</small><b>App Store</b></div>
            </div>
            <div className="store">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 2.6c-.3.3-.4.7-.4 1.2v16.4c0 .5.1.9.4 1.2l9.3-9.4L4 2.6zm10.6 10.7 2.6 2.6-11 6.3 8.4-8.9zm0-2.6L6.2 1.8l11 6.3-2.6 2.6zm4-1.8 3 1.7c.9.5.9 1.3 0 1.8l-3 1.7-2.8-2.6 2.8-2.6z" /></svg>
              <div><small>{D.app.storeSmall}</small><b>Google Play</b></div>
            </div>
          </div>
          <div className="hand">
            {D.app.hand[0]}<br />{D.app.hand[1]}
            <svg viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden="true"><path d="M3 10C60 3 140 2 197 7" stroke="#A6FF00" strokeWidth="5" fill="none" strokeLinecap="round" /></svg>
          </div>
        </div>
      </section>

      <section className="sec partner" id="unete" aria-labelledby="joinT">
        <div>
          <span className="eyebrow">{D.partner.eyebrow}</span>
          <h2 id="joinT">{D.partner.title}</h2>
          <p>{D.partner.body}</p>
          <div className="cta"><SoonLink asButton className="btn btn-dark" name={D.partner.soonName} suffix={D.soon}>{D.partner.cta}</SoonLink></div>
        </div>
        <ul className="checks">
          {D.partner.points.map((p) => <li key={p}><span className="tick"><Icon name="check" /></span>{p}</li>)}
        </ul>
      </section>
    </div>
  );
}

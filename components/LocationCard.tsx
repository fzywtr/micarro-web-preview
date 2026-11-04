import Link from "next/link";
import type { Lang, Location } from "@/lib/data";
import { href, t } from "@/lib/i18n";
import { hoursSummary } from "@/lib/time";
import { Icon } from "./Icon";
import { TypeBadge } from "./Bits";

export function LocationCard({ loc, lang }: { loc: Location; lang: Lang }) {
  const D = t(lang);
  return (
    <Link className="card" href={href(lang, `/ubicaciones/${loc.slug}`)}>
      <div className="ph">
        <img src={loc.img} alt={D.featured.cardAlt(loc.city)} style={{ objectPosition: loc.pos }} />
        <TypeBadge type={loc.type} lang={lang} />
      </div>
      <div className="bd">
        <div className="top"><h3>{loc.name[lang]}</h3><span className="tag-ej">{D.sample}</span></div>
        <div className="li"><Icon name="pin" />{loc.city}</div>
        <div className="li"><Icon name="clock" />{hoursSummary(loc, lang)}</div>
      </div>
    </Link>
  );
}

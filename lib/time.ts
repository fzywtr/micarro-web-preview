import type { Lang, Location } from "./data";
import { t } from "./i18n";

/** Monday-first display order of weekday indexes (0 = Sunday). */
export const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];
const DAY_MS = 864e5;

export interface SvNow { dow: number; min: number; date: Date }

/** Current time in El Salvador (UTC-6, no daylight saving). */
export function svNow(): SvNow {
  const d = new Date(Date.now() - 6 * 3600e3);
  return {
    dow: d.getUTCDay(),
    min: d.getUTCHours() * 60 + d.getUTCMinutes(),
    date: new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())),
  };
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function fmtTime(min: number, lang: Lang) {
  const T = t(lang).time;
  const h = Math.floor(min / 60), m = min % 60;
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? T.am : T.pm}`;
}

export function hoursSummary(l: Location, lang: Lang) {
  const T = t(lang).time;
  const groups: { k: string; h: [number, number] | null; days: number[] }[] = [];
  WEEK_ORDER.forEach((d) => {
    const h = l.hours[d];
    const k = h ? h.join("-") : "x";
    const g = groups[groups.length - 1];
    if (g && g.k === k) g.days.push(d);
    else groups.push({ k, h, days: [d] });
  });
  return groups
    .filter((g) => g.h)
    .map((g) => {
      const a = cap(T.dsh[g.days[0]]), b = T.dsh[g.days[g.days.length - 1]];
      const days = g.days.length > 1 ? a + T.dayRangeSep + b : a;
      return `${days}, ${fmtTime(g.h![0], lang)}${T.rangeSep}${fmtTime(g.h![1], lang)}`;
    })
    .join(" · ");
}

export function openStatus(l: Location, lang: Lang, now: SvNow) {
  const T = t(lang).time;
  const h = l.hours[now.dow];
  if (h && now.min >= h[0] && now.min < h[1]) return { open: true, text: `${T.open} ${fmtTime(h[1], lang)}` };
  if (h && now.min < h[0]) return { open: false, text: `${T.closedOpensToday} ${fmtTime(h[0], lang)}` };
  for (let i = 1; i <= 7; i++) {
    const d = (now.dow + i) % 7;
    const hh = l.hours[d];
    if (hh) return { open: false, text: `${T.closedOpens} ${i === 1 ? T.tomorrow : T.days[d]} ${fmtTime(hh[0], lang)}` };
  }
  return { open: false, text: T.closed };
}

export const dayDate = (now: SvNow, i: number) => new Date(now.date.getTime() + i * DAY_MS);

export function dateLabel(now: SvNow, i: number, lang: Lang) {
  const T = t(lang).time;
  const d = dayDate(now, i);
  const name = i === 0 ? T.Today : i === 1 ? T.Tomorrow : cap(T.days[d.getUTCDay()]);
  return lang === "en"
    ? `${name}, ${T.mon[d.getUTCMonth()]} ${d.getUTCDate()}`
    : `${name} ${d.getUTCDate()} ${T.mon[d.getUTCMonth()]}`;
}

export interface Slot { m: number; taken: boolean }

/** Sample availability: deterministic "booked" slots so the demo looks realistic. */
export function slotsFor(l: Location, now: SvNow, dayIdx: number): Slot[] {
  const d = dayDate(now, dayIdx);
  const h = l.hours[d.getUTCDay()];
  if (!h) return [];
  const out: Slot[] = [];
  for (let m = h[0]; m <= h[1] - 60; m += 30) {
    if (dayIdx === 0 && m < now.min + 45) continue; // hide times that have passed
    const seed = (d.getUTCDate() * 31 + m + l.slug.length * 7) % 11;
    out.push({ m, taken: seed === 0 || seed === 4 || seed === 7 });
  }
  return out;
}

export function dayList(l: Location, now: SvNow) {
  return Array.from({ length: 10 }, (_, i) => {
    const d = dayDate(now, i);
    return { i, dow: d.getUTCDay(), dd: d.getUTCDate(), mon: d.getUTCMonth(), avail: slotsFor(l, now, i).some((s) => !s.taken) };
  });
}

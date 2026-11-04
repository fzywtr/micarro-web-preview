// Illustrative SVG map of the San Salvador metro area (preview only).
// Production plan: Leaflet + Esri Light Gray tiles, as on the staging site.

export const MAP_W = 1000, MAP_H = 420;
const B = { w: -89.34, e: -89.06, n: 13.749, s: 13.635 };
export const project = (lng: number, lat: number): [number, number] => [
  ((lng - B.w) / (B.e - B.w)) * MAP_W,
  ((B.n - lat) / (B.n - B.s)) * MAP_H,
];
/** Default center that frames all sample locations. */
export const HOME_CENTER = { cx: 455, cy: 215 };

function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const cache = new Map<string, string>();

export function mapBackground(labels: { volcano: string; lake: string }) {
  const key = labels.volcano;
  const hit = cache.get(key);
  if (hit) return hit;
  const P = project;
  const r = rng(503);
  let s = `<rect x="-800" y="-600" width="2600" height="1620" fill="#E8E9E4"/>`;
  const [vx, vy] = P(-89.292, 13.742);
  for (let i = 6; i >= 1; i--) s += `<ellipse cx="${vx}" cy="${vy}" rx="${i * 26}" ry="${i * 19}" fill="none" stroke="#DDDED8" stroke-width="1.2"/>`;
  const cities: [number, number, number, number, number, number][] = [
    [-89.2797, 13.6769, 95, 70, 0.12, 38], [-89.205, 13.698, 150, 85, 0.05, 70], [-89.145, 13.71, 85, 60, -0.08, 34],
    [-89.245, 13.706, 80, 45, 0.1, 28], [-89.253, 13.672, 60, 40, 0.2, 22], [-89.213, 13.722, 65, 45, 0, 24],
    [-89.11, 13.7, 60, 45, 0.05, 20], [-89.18, 13.66, 55, 40, 0, 18],
  ];
  cities.forEach(([lng, lat, rx, ry]) => { const [x, y] = P(lng, lat); s += `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#F1F2EE"/>`; });
  let minor = "";
  cities.forEach(([lng, lat, rx, ry, ang, n]) => {
    const [cx, cy] = P(lng, lat);
    for (let i = 0; i < n; i++) {
      const a = r() * Math.PI * 2, d = Math.sqrt(r());
      let x = cx + Math.cos(a) * rx * d, y = cy + Math.sin(a) * ry * d;
      let dir = ang + (r() < 0.5 ? 0 : Math.PI / 2) + (r() < 0.5 ? 0 : Math.PI);
      let pts = `M${x.toFixed(1)} ${y.toFixed(1)}`;
      const steps = 2 + Math.floor(r() * 3);
      for (let k = 0; k < steps; k++) {
        const L = 12 + r() * 26; dir += (r() - 0.5) * 0.35;
        if (r() < 0.3) dir += (Math.PI / 2) * (r() < 0.5 ? 1 : -1);
        x += Math.cos(dir) * L; y += Math.sin(dir) * L; pts += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
      }
      minor += pts + " ";
    }
  });
  for (let i = 0; i < 22; i++) {
    let x = -150 + r() * 1300, y = -60 + r() * 540, dir = r() * Math.PI * 2, pts = `M${x.toFixed(0)} ${y.toFixed(0)}`;
    for (let k = 0; k < 5; k++) { dir += (r() - 0.5) * 0.9; x += Math.cos(dir) * 40; y += Math.sin(dir) * 40; pts += ` L${x.toFixed(0)} ${y.toFixed(0)}`; }
    minor += pts + " ";
  }
  s += `<path d="${minor}" fill="none" stroke="#FFFFFF" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" opacity=".75"/>`;
  const [lx, ly] = P(-89.045, 13.672);
  let lake = "";
  for (let i = 0; i <= 36; i++) {
    const a = (i / 36) * Math.PI * 2, rr = 1 + 0.08 * Math.sin(a * 3 + 1) + 0.05 * Math.cos(a * 5);
    lake += (i ? "L" : "M") + (lx + Math.cos(a) * 175 * rr).toFixed(1) + " " + (ly + Math.sin(a) * 95 * rr).toFixed(1);
  }
  s += `<path d="${lake}Z" fill="#D3DADB"/>`;
  const roads = [
    [[-89.4, 13.668], [-89.33, 13.672], [-89.3, 13.675], [-89.28, 13.677], [-89.255, 13.681], [-89.226, 13.69], [-89.2, 13.7], [-89.17, 13.703], [-89.145, 13.707], [-89.11, 13.705], [-89.08, 13.712], [-89.0, 13.72]],
    [[-89.285, 13.677], [-89.29, 13.655], [-89.3, 13.62]],
    [[-89.255, 13.681], [-89.232, 13.671], [-89.205, 13.674], [-89.183, 13.66], [-89.16, 13.64], [-89.14, 13.6]],
    [[-89.196, 13.7], [-89.192, 13.725], [-89.186, 13.76]],
    [[-89.272, 13.703], [-89.245, 13.705], [-89.222, 13.704], [-89.198, 13.699]],
    [[-89.245, 13.705], [-89.226, 13.716], [-89.21, 13.735], [-89.205, 13.77]],
    [[-89.145, 13.707], [-89.15, 13.735], [-89.16, 13.77]],
  ].map((pts) => "M" + pts.map((p) => P(p[0], p[1]).map((v) => v.toFixed(1)).join(" ")).join(" L")).join(" ");
  s += `<path d="${roads}" fill="none" stroke="#D6D8D0" stroke-width="7.5" stroke-linecap="round" stroke-linejoin="round"/>`;
  s += `<path d="${roads}" fill="none" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>`;
  const lab = (lng: number, lat: number, txt: string, o: { size?: number; w?: number; c?: string; it?: boolean } = {}) => {
    const [x, y] = P(lng, lat);
    return `<text x="${x}" y="${y}" text-anchor="middle" font-family="Figtree, system-ui, sans-serif" font-size="${o.size || 13}" font-weight="${o.w || 500}" fill="${o.c || "#74776E"}" ${o.it ? 'font-style="italic"' : ""} paint-order="stroke" stroke="#F1F2EE" stroke-width="3">${txt}</text>`;
  };
  s += lab(-89.205, 13.688, "San Salvador", { size: 17, w: 600, c: "#5E6158" });
  s += lab(-89.29, 13.664, "Santa Tecla");
  s += lab(-89.142, 13.696, "Soyapango");
  s += lab(-89.258, 13.66, "Antiguo Cuscatlán", { size: 12 });
  s += lab(-89.213, 13.731, "Mejicanos", { size: 12 });
  s += lab(-89.106, 13.69, "Ilopango", { size: 12 });
  s += lab(-89.178, 13.65, "San Marcos", { size: 12 });
  s += lab(-89.292, 13.744, labels.volcano, { size: 11.5, it: true, c: "#93968C" });
  s += lab(-89.072, 13.668, labels.lake, { size: 11.5, it: true, c: "#8A979A" });
  cache.set(key, s);
  return s;
}

export interface ViewBox { x: number; y: number; w: number; h: number; pinScale: number }

/** Fit a viewBox matching the container's aspect ratio, centered on (cx, cy), showing `h0` map units tall. */
export function fitViewBox(size: { w: number; h: number }, cx: number, cy: number, h0: number): ViewBox {
  if (!size.w || !size.h) return { x: 0, y: 0, w: MAP_W, h: MAP_H, pinScale: 1 };
  const a = size.w / size.h;
  let h = h0, w = h * a;
  if (w < 380) { w = 380; h = w / a; }
  const k = h / size.h;
  return { x: cx - w / 2, y: cy - h / 2, w, h, pinScale: Math.max(0.7, Math.min(1.5, k)) };
}

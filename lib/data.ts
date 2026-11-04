// Sample content for the CEO preview. Per the brand guide, every business name,
// address, hour, price and promotion here is an EXAMPLE and is labeled as such in the UI.
// In the next stage this moves to the database (Supabase) and the admin backend.

export type Lang = "es" | "en";
export type LocType = "socio" | "aliado" | "micarro";
export type VehId = "compacto" | "suv" | "pickup";
export type SvcId = "exterior" | "llantas" | "interior";
/** Opening hours per weekday, index 0 = Sunday, values in minutes after midnight. */
export type Hours = ([number, number] | null)[];
type L10n = Record<Lang, string>;

export interface Location {
  slug: string;
  type: LocType;
  name: L10n;
  city: string;
  addr: L10n;
  about: L10n;
  lat: number;
  lng: number;
  img: string;
  /** CSS object-position for the photo crop */
  pos: string;
  hours: Hours;
  services: SvcId[];
}

const h = (o: number, c: number): [number, number] => [o * 60, c * 60];
const every = (o: number, c: number): Hours => Array.from({ length: 7 }, () => h(o, c));

const ABOUT_SOCIO: L10n = {
  es: "Autolavado independiente con su propio local y equipo, certificado para lavar con el proceso VaporClean™.",
  en: "Independent car wash with its own site and team, certified to wash with the VaporClean™ process.",
};
const ABOUT_ALIADO: L10n = {
  es: "Punto MiCarro bajo carpa dentro de un sitio aliado. Lavado exterior mientras haces tus compras o cargas combustible.",
  en: "A MiCarro tent station inside a partner site. Exterior wash while you shop or fill up.",
};

export const LOCATIONS: Location[] = [
  {
    slug: "santa-tecla", type: "socio",
    name: { es: "Autolavado Ejemplo", en: "Sample Car Wash" },
    city: "Santa Tecla, La Libertad",
    addr: { es: "Dirección de ejemplo, Santa Tecla", en: "Sample address, Santa Tecla" },
    about: ABOUT_SOCIO, lat: 13.6769, lng: -89.2797,
    img: "/img/loc-garage.webp", pos: "center",
    hours: every(8, 18), services: ["exterior", "llantas", "interior"],
  },
  {
    slug: "san-salvador", type: "aliado",
    name: { es: "MiCarro Ejemplo", en: "MiCarro Sample" },
    city: "San Salvador",
    addr: { es: "Estacionamiento de ejemplo, San Salvador", en: "Sample parking lot, San Salvador" },
    about: ABOUT_ALIADO, lat: 13.699, lng: -89.224,
    img: "/img/loc-parking.webp", pos: "center",
    hours: [null, h(7, 17), h(7, 17), h(7, 17), h(7, 17), h(7, 17), h(7, 17)],
    services: ["exterior", "llantas"],
  },
  {
    slug: "soyapango", type: "socio",
    name: { es: "Autolavado Ejemplo 2", en: "Sample Car Wash 2" },
    city: "Soyapango, San Salvador",
    addr: { es: "Dirección de ejemplo, Soyapango", en: "Sample address, Soyapango" },
    about: ABOUT_SOCIO, lat: 13.71, lng: -89.145,
    img: "/img/loc-shade.webp", pos: "center",
    hours: every(8, 17), services: ["exterior", "llantas", "interior"],
  },
  {
    slug: "escalon", type: "micarro",
    name: { es: "MiCarro Ejemplo Escalón", en: "MiCarro Sample Escalón" },
    city: "Col. Escalón, San Salvador",
    addr: { es: "Dirección de ejemplo, Col. Escalón", en: "Sample address, Col. Escalón" },
    about: {
      es: "Ubicación operada directamente por MiCarro. Es también donde se capacita a los equipos de la red.",
      en: "Operated directly by MiCarro. It is also where teams across the network are trained.",
    },
    lat: 13.706, lng: -89.245, img: "/img/hero.webp", pos: "55% center",
    hours: [h(8, 14), h(7, 19), h(7, 19), h(7, 19), h(7, 19), h(7, 19), h(7, 19)],
    services: ["exterior", "llantas", "interior"],
  },
  {
    slug: "merliot", type: "aliado",
    name: { es: "MiCarro Ejemplo Merliot", en: "MiCarro Sample Merliot" },
    city: "Antiguo Cuscatlán, La Libertad",
    addr: { es: "Centro comercial de ejemplo, Antiguo Cuscatlán", en: "Sample shopping center, Antiguo Cuscatlán" },
    about: ABOUT_ALIADO, lat: 13.672, lng: -89.253,
    img: "/img/loc-parking.webp", pos: "30% center",
    hours: every(9, 18), services: ["exterior", "llantas"],
  },
];

export interface Service {
  id: SvcId;
  name: L10n;
  desc: L10n;
  mins: number;
  price: Record<VehId, number>;
}

export const SERVICES: Service[] = [
  {
    id: "exterior",
    name: { es: "Lavado exterior VaporClean™", en: "VaporClean™ exterior wash" },
    desc: {
      es: "Lavado a mano con vapor: carrocería, vidrios, espejos y secado con microfibra.",
      en: "Hand wash with steam: body, windows, mirrors and microfiber dry.",
    },
    mins: 25, price: { compacto: 8, suv: 10, pickup: 12 },
  },
  {
    id: "llantas",
    name: { es: "Exterior + llantas y rines", en: "Exterior + tires and rims" },
    desc: {
      es: "Todo el lavado exterior, más llantas y rines a vapor y abrillantador de llantas.",
      en: "The full exterior wash, plus steam-cleaned tires and rims and tire shine.",
    },
    mins: 35, price: { compacto: 11, suv: 13, pickup: 15 },
  },
  {
    id: "interior",
    name: { es: "Exterior + interior express", en: "Exterior + express interior" },
    desc: {
      es: "Lavado exterior, aspirado, tablero y vidrios por dentro.",
      en: "Exterior wash, vacuum, dashboard and inside windows.",
    },
    mins: 50, price: { compacto: 16, suv: 19, pickup: 21 },
  },
];

export const VEHICLES: { id: VehId; name: L10n }[] = [
  { id: "compacto", name: { es: "Sedán o compacto", en: "Sedan or compact" } },
  { id: "suv", name: { es: "SUV o camioneta", en: "SUV or van" } },
  { id: "pickup", name: { es: "Pickup", en: "Pickup" } },
];

export const LOC_TYPES: Record<LocType, { label: L10n; explainTitle: L10n; explain: L10n; cls: string; icon?: string }> = {
  socio: {
    label: { es: "Socio Certificado MiCarro", en: "MiCarro Certified Partner" },
    explainTitle: { es: "¿Qué es un Socio Certificado?", en: "What is a Certified Partner?" },
    explain: {
      es: "Un Socio Certificado es un autolavado local que mantiene a su dueño y se suma al sistema MiCarro: equipo a vapor aprobado, capacitación, estándares de calidad y reservas en línea.",
      en: "A Certified Partner is a local car wash that keeps its owner and joins the MiCarro system: approved steam equipment, training, quality standards and online booking.",
    },
    cls: "b-lime", icon: "checkc",
  },
  aliado: {
    label: { es: "MiCarro en sitio aliado", en: "MiCarro at a partner site" },
    explainTitle: { es: "¿Qué es un sitio aliado?", en: "What is a partner site?" },
    explain: {
      es: "MiCarro instala un punto de lavado en el estacionamiento de un negocio aliado, como una gasolinera o centro comercial. Ofrece lavado exterior.",
      en: "MiCarro sets up a wash station in the parking lot of a partner business, such as a gas station or shopping center. It offers exterior washes.",
    },
    cls: "b-black",
  },
  micarro: {
    label: { es: "MiCarro", en: "MiCarro" },
    explainTitle: { es: "¿Qué es una ubicación MiCarro?", en: "What is a MiCarro location?" },
    explain: {
      es: "Ubicación operada directamente por MiCarro, con el proceso completo y todos los servicios.",
      en: "Operated directly by MiCarro, with the full process and every service.",
    },
    cls: "b-white",
  },
};

export const FIRST_VISIT_DISCOUNT = 0.15;

export const getLocation = (slug: string) => LOCATIONS.find((l) => l.slug === slug);
export const getService = (id: string) => SERVICES.find((s) => s.id === id);
export const minPrice = (l: Location, veh: VehId = "compacto") =>
  Math.min(...l.services.map((s) => getService(s)!.price[veh]));
export const money = (n: number) => "$" + n.toFixed(2);

import type { Lang } from "./data";

export const LANGS: Lang[] = ["es", "en"];
export const isLang = (v: string): v is Lang => v === "es" || v === "en";

/** Build a URL for a language. Spanish has no prefix; English lives under /en. */
export function href(lang: Lang, path: string) {
  if (lang === "es") return path;
  return path === "/" ? "/en" : "/en" + path;
}

const es = {
  ribbon: ["Descarga la app MiCarro", "y acumula puntos para lavados gratis."],
  nav: { locations: "Ubicaciones", services: "Servicios", agua: "MiCarro Agua", join: "Únete a MiCarro", book: "Reservar lavado", contact: "Contacto", openMenu: "Abrir menú", home: "MiCarro, inicio" },
  soon: "se diseña en la siguiente fase.",
  footer: { tagline: "Tu carro en buenas manos.", made: "© 2026 MiCarro. Hecho en El Salvador.", sample: "Diseño de muestra: ubicaciones, horarios, precios y promociones son de ejemplo." },
  sample: "Ejemplo",
  samplePrice: "Precio de ejemplo",
  illusImg: "Imagen ilustrativa",
  illusMap: "Mapa ilustrativo",
  mapAria: "Mapa ilustrativo de ubicaciones MiCarro en el área metropolitana de San Salvador",
  mapLabels: { volcano: "Volcán de San Salvador", lake: "Lago de Ilopango" },
  hero: {
    title: "Más brillo, menos agua",
    body: "Lavado a mano con vapor y mucho menos agua, en ubicaciones MiCarro y autolavados certificados de El Salvador.",
    cta: "Reservar lavado", cta2: "Conoce VaporClean™",
    alt: "Técnico de MiCarro lavando una SUV con vapor bajo una carpa negra MiCarro, con el volcán al fondo",
  },
  finder: {
    title: "Encuentra tu lavado más cercano", loc: "Ubicación", placeholder: "Ciudad o colonia, p. ej. Santa Tecla",
    svc: "Servicio", all: "Todos los servicios", search: "Buscar", zoomIn: "Acercar", zoomOut: "Alejar",
    one: "1 ubicación", many: (n: number) => `${n} ubicaciones`, from: "Desde", sampleLc: "ejemplo",
    empty: ["No encontramos ubicaciones para esa búsqueda. Prueba con", "o"],
    close: "Cerrar", details: "Ver detalles", book: "Reservar",
  },
  promo: {
    aria: "Promociones", tag: "Promoción de ejemplo", title: "15% de descuento en tu primera visita",
    body: "Reserva tu primer lavado MiCarro en línea y paga menos.", cta: "Reservar ahora",
    vTag: "Lavado a vapor", vBody: "Brillo increíble, sin desperdiciar agua. El vapor afloja la suciedad y se retira a mano con microfibra.", vCta: "Ver servicios y precios",
  },
  how: {
    title: "Así funciona",
    steps: [
      ["Reserva en línea", "Elige ubicación, servicio y hora. Sin filas y con precio claro desde el inicio."],
      ["Llega y muestra tu QR", "Tu código QR hace el check-in. El equipo ya sabe qué lavado pediste."],
      ["Lavado a mano con vapor", "Usamos mucho menos agua que un lavado con manguera y revisamos tu carro antes de entregarlo."],
    ],
  },
  featured: { title: "Ubicaciones destacadas", all: "Ver todas las ubicaciones", cardAlt: (c: string) => `Lavado a mano en ${c} (imagen ilustrativa)` },
  app: {
    soon: "Próximamente", title: "La app de MiCarro", body: "Reserva tu lavado, guarda tu historial y acumula puntos, todo desde tu teléfono.",
    storeSmall: "Pronto en", hand: ["Miko te acompaña", "en el camino"],
    alt: "Teléfono con la app de MiCarro y Miko, la rana mascota de MiCarro",
  },
  partner: {
    eyebrow: "Para dueños de autolavados", title: "Conserva tu negocio. Súmate a una marca nacional.",
    body: "Los Socios Certificados MiCarro mantienen su local y su equipo de trabajo, y reciben lo que es difícil construir solo.",
    cta: "Quiero ser socio", soonName: "El formulario para socios",
    points: ["Equipo de lavado a vapor que usa mucho menos agua", "Reservas y pagos en línea con la app de MiCarro", "Capacitación, uniformes y estándares de calidad", "Marca, señalización y marketing nacional", "Opciones de financiamiento para la conversión"],
  },
  listing: {
    crumbs: "Ruta", home: "Inicio", photoAlt: (n: string) => `Lavado a mano con vapor en ${n} (imagen ilustrativa)`,
    services: "Servicios", vehAria: "Tipo de vehículo", sampleLc: "ejemplo", notHere: "No disponible en esta ubicación", book: "Reservar",
    visit: "Cómo es tu visita",
    visitSteps: [["Check-in con QR", "Muestra el código de tu reserva al llegar."], ["Lavado a mano", "Vapor y microfibra, con mucho menos agua."], ["Revisión final", "Revisamos el carro contigo antes de entregarlo."], ["Pagas y listo", "Efectivo o tarjeta en el lugar."]],
    hours: "Horario", today: "hoy", closed: "Cerrado",
    bookTitle: "Reserva tu lavado", from: "Desde", chooseTime: "Elegir fecha y hora",
    bookFine: "15% de descuento en tu primera visita (promoción de ejemplo). Pagas en el lugar.",
    directions: "Cómo llegar", nearby: "Otras ubicaciones cerca", seeMap: "Ver mapa", mbarSample: "precio de ejemplo", mbarCta: "Reservar lavado",
  },
  booking: {
    title: "Reserva tu lavado", stepsAria: "Pasos de la reserva", steps: ["Ubicación", "Servicio", "Fecha y hora", "Tus datos"], crumb: "Reservar",
    whereTitle: "¿Dónde quieres lavar tu carro?", whereSub: "Elige una ubicación. Todas son de ejemplo en esta vista previa.", locAria: "Ubicación",
    vehTitle: "Tipo de vehículo", vehSub: "El precio depende del tamaño.",
    svcTitle: "Servicio", svcSub: (v: string) => `Precios de ejemplo para ${v.toLowerCase()}.`, notHere: "No disponible en esta ubicación.",
    dayTitle: "Elige el día", daySub: "Hora de El Salvador.", dayAria: "Día", timeTitle: "Elige la hora", morning: "Mañana", afternoon: "Tarde",
    legend: "Los horarios tachados ya están ocupados (disponibilidad de ejemplo).", closedDay: "Esta ubicación está cerrada ese día.",
    detailsTitle: "Tus datos", detailsSub: "Para confirmar tu reserva y avisarte si algo cambia.",
    name: "Nombre", phone: "Teléfono (WhatsApp)", phoneHint: "8 dígitos.", plate: "Placa", optional: "(opcional)", plateHint: "Ayuda a identificar tu carro al llegar.",
    firstVisit: "Es mi primera visita", firstVisitSub: "Aplica 15% de descuento (promoción de ejemplo).",
    pay: "Pago", payOnSite: "Pagar en el lugar", payOnSiteSub: "Efectivo o tarjeta al terminar el lavado.", payOnline: "Pagar en línea", payOnlineSub: "Disponible con la app de MiCarro.", soon: "Próximamente",
    back: "Atrás", next: "Continuar", confirm: "Confirmar reserva",
    errTime: "Elige una hora para continuar.", errName: "Escribe tu nombre.", errPhone: "El número debe tener 8 dígitos, p. ej. 7000-0000.",
    summary: "Resumen", summaryAria: "Resumen de la reserva", summaryEmpty: "Elige una ubicación para ver servicios, horarios y precios.",
    sService: "Servicio", sVehicle: "Vehículo", sDate: "Fecha", sPrice: "Precio", sFirst: "Primera visita −15%", sTotal: "Total a pagar en el lugar", tbd: "Por elegir",
    sFine: "Precios y promoción de ejemplo. Cancela sin costo hasta 2 horas antes.",
    doneTitle: (n: string) => `¡Listo, ${n}! Tu lavado está reservado.`,
    doneBody: (l: string) => `Llega unos minutos antes y muestra tu código QR. El equipo de ${l} ya tiene tu reserva.`,
    dLoc: "Ubicación", dWhen: "Fecha y hora", dSvc: "Servicio", dTotal: "Total a pagar en el lugar", dIncl: " (incluye 15% primera visita)",
    water: "Tu lavado con vapor usa mucho menos agua que un lavado con manguera.",
    viewLoc: "Ver ubicación", backHome: "Volver al inicio", qrTitle: "Tu código de check-in",
    qrFine: "Vista previa: no se guarda la reserva ni se envían mensajes. En la versión final recibirás la confirmación por WhatsApp.",
  },
  time: {
    days: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
    dsh: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
    mon: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
    am: "a. m.", pm: "p. m.", rangeSep: " a ", dayRangeSep: " a ",
    open: "Abierto · cierra", closedOpensToday: "Cerrado · abre hoy", closedOpens: "Cerrado · abre", closed: "Cerrado",
    today: "hoy", tomorrow: "mañana", Today: "Hoy", Tomorrow: "Mañana",
  },
};

export type Dict = typeof es;

const en: Dict = {
  ribbon: ["Download the MiCarro app", "and earn points toward free car washes!"],
  nav: { locations: "Locations", services: "Services", agua: "MiCarro Agua", join: "Join MiCarro", book: "Book a wash", contact: "Contact", openMenu: "Open menu", home: "MiCarro, home" },
  soon: "is designed in the next phase.",
  footer: { tagline: "Your car in good hands.", made: "© 2026 MiCarro. Made in El Salvador.", sample: "Sample design: locations, hours, prices and promotions are examples." },
  sample: "Sample",
  samplePrice: "Sample price",
  illusImg: "Illustrative image",
  illusMap: "Illustrative map",
  mapAria: "Illustrative map of MiCarro locations in the San Salvador metro area",
  mapLabels: { volcano: "San Salvador Volcano", lake: "Lake Ilopango" },
  hero: {
    title: "More shine, less water",
    body: "Hand washing with steam and far less water, at MiCarro locations and certified car washes across El Salvador.",
    cta: "Book a wash", cta2: "Discover VaporClean™",
    alt: "MiCarro technician steam-washing an SUV under a black MiCarro tent, with the volcano behind",
  },
  finder: {
    title: "Find your nearest wash", loc: "Location", placeholder: "City or neighborhood, e.g. Santa Tecla",
    svc: "Service", all: "All services", search: "Search", zoomIn: "Zoom in", zoomOut: "Zoom out",
    one: "1 location", many: (n: number) => `${n} locations`, from: "From", sampleLc: "sample",
    empty: ["No locations match that search. Try", "or"],
    close: "Close", details: "View details", book: "Book",
  },
  promo: {
    aria: "Promotions", tag: "Sample promotion", title: "15% off your first visit",
    body: "Book your first MiCarro wash online and pay less.", cta: "Book now",
    vTag: "Steam wash", vBody: "Incredible shine without wasting water. Steam loosens the dirt, and it is wiped off by hand with microfiber.", vCta: "See services and prices",
  },
  how: {
    title: "How it works",
    steps: [
      ["Book online", "Choose a location, service and time. No lines, and a clear price from the start."],
      ["Arrive and show your QR", "Your QR code checks you in. The team already knows which wash you booked."],
      ["Hand wash with steam", "We use far less water than a hose wash, and we check your car before handing it back."],
    ],
  },
  featured: { title: "Featured locations", all: "See all locations", cardAlt: (c: string) => `Hand wash in ${c} (illustrative image)` },
  app: {
    soon: "Coming soon", title: "The MiCarro app", body: "Book your wash, keep your history and earn points, all from your phone.",
    storeSmall: "Coming to", hand: ["Miko rides", "along with you"],
    alt: "Phone showing the MiCarro app, with Miko, the MiCarro frog mascot",
  },
  partner: {
    eyebrow: "For car wash owners", title: "Keep your business. Join a national brand.",
    body: "MiCarro Certified Partners keep their site and their team, and get what is hard to build alone.",
    cta: "Become a partner", soonName: "The partner form",
    points: ["Steam wash equipment that uses far less water", "Online booking and payments with the MiCarro app", "Training, uniforms and quality standards", "Brand, signage and national marketing", "Financing options for the conversion"],
  },
  listing: {
    crumbs: "Breadcrumb", home: "Home", photoAlt: (n: string) => `Steam hand wash at ${n} (illustrative image)`,
    services: "Services", vehAria: "Vehicle type", sampleLc: "sample", notHere: "Not available at this location", book: "Book",
    visit: "What your visit looks like",
    visitSteps: [["QR check-in", "Show your booking code when you arrive."], ["Hand wash", "Steam and microfiber, with far less water."], ["Final check", "We check the car with you before handing it back."], ["Pay and go", "Cash or card on site."]],
    hours: "Hours", today: "today", closed: "Closed",
    bookTitle: "Book your wash", from: "From", chooseTime: "Choose date and time",
    bookFine: "15% off your first visit (sample promotion). Pay on site.",
    directions: "Get directions", nearby: "Other locations nearby", seeMap: "See map", mbarSample: "sample price", mbarCta: "Book a wash",
  },
  booking: {
    title: "Book your wash", stepsAria: "Booking steps", steps: ["Location", "Service", "Date and time", "Your details"], crumb: "Book",
    whereTitle: "Where would you like your car washed?", whereSub: "Choose a location. All of them are samples in this preview.", locAria: "Location",
    vehTitle: "Vehicle type", vehSub: "The price depends on size.",
    svcTitle: "Service", svcSub: (v: string) => `Sample prices for ${v.toLowerCase()}.`, notHere: "Not available at this location.",
    dayTitle: "Choose a day", daySub: "El Salvador time.", dayAria: "Day", timeTitle: "Choose a time", morning: "Morning", afternoon: "Afternoon",
    legend: "Crossed-out times are already booked (sample availability).", closedDay: "This location is closed that day.",
    detailsTitle: "Your details", detailsSub: "To confirm your booking and let you know if anything changes.",
    name: "Name", phone: "Phone (WhatsApp)", phoneHint: "8 digits.", plate: "License plate", optional: "(optional)", plateHint: "Helps the team spot your car when you arrive.",
    firstVisit: "This is my first visit", firstVisitSub: "Applies 15% off (sample promotion).",
    pay: "Payment", payOnSite: "Pay on site", payOnSiteSub: "Cash or card when the wash is done.", payOnline: "Pay online", payOnlineSub: "Available with the MiCarro app.", soon: "Coming soon",
    back: "Back", next: "Continue", confirm: "Confirm booking",
    errTime: "Choose a time to continue.", errName: "Enter your name.", errPhone: "The number must have 8 digits, e.g. 7000-0000.",
    summary: "Summary", summaryAria: "Booking summary", summaryEmpty: "Choose a location to see services, times and prices.",
    sService: "Service", sVehicle: "Vehicle", sDate: "Date", sPrice: "Price", sFirst: "First visit −15%", sTotal: "Total to pay on site", tbd: "To be chosen",
    sFine: "Sample prices and promotion. Cancel free up to 2 hours before.",
    doneTitle: (n: string) => `You're all set, ${n}! Your wash is booked.`,
    doneBody: (l: string) => `Arrive a few minutes early and show your QR code. The team at ${l} already has your booking.`,
    dLoc: "Location", dWhen: "Date and time", dSvc: "Service", dTotal: "Total to pay on site", dIncl: " (includes 15% first-visit discount)",
    water: "Your steam wash uses far less water than a hose wash.",
    viewLoc: "View location", backHome: "Back to home", qrTitle: "Your check-in code",
    qrFine: "Preview: the booking is not saved and no messages are sent. In the final version you will get a WhatsApp confirmation.",
  },
  time: {
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    dsh: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    mon: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    am: "AM", pm: "PM", rangeSep: "–", dayRangeSep: "–",
    open: "Open · closes", closedOpensToday: "Closed · opens today", closedOpens: "Closed · opens", closed: "Closed",
    today: "today", tomorrow: "tomorrow", Today: "Today", Tomorrow: "Tomorrow",
  },
};

export const DICTS: Record<Lang, Dict> = { es, en };
export const t = (lang: Lang) => DICTS[lang];

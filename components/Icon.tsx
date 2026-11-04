const ICONS: Record<string, string> = {
  pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  checkc: '<circle cx="12" cy="12" r="9"/><path d="m8 12.3 2.8 2.7L16 9.6"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  drop: '<path d="M12 3.5s6 6.4 6 10.8A6 6 0 0 1 6 14.3C6 9.9 12 3.5 12 3.5z"/><path d="M9.5 14.5a2.6 2.6 0 0 0 2.5 2.5"/>',
  shield: '<path d="M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6l-7-3z"/><path d="m9 12 2 2 4-4"/>',
  store: '<path d="M4 9.5 5.5 4h13L20 9.5M4 9.5h16M4 9.5V20h16V9.5M9 20v-5h6v5"/>',
  nav: '<path d="M3 11 21 3l-8 18-2-8-8-2z"/>',
  cash: '<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/>',
};

export function Icon({ name, className = "" }: { name: keyof typeof ICONS | string; className?: string }) {
  return <svg className={`ic ${className}`} viewBox="0 0 24 24" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONS[name] }} />;
}

const VEH: Record<string, string> = {
  compacto: '<path d="M3 20v-4l5-6h18l7 6 7 1.5V20"/><path d="M3 20h37"/><circle cx="11" cy="21" r="3"/><circle cx="32" cy="21" r="3"/>',
  suv: '<path d="M3 20V12l4-6h22l6 7 6 1.5V20"/><path d="M3 20h38M3 13h38"/><circle cx="11" cy="21" r="3"/><circle cx="33" cy="21" r="3"/>',
  pickup: '<path d="M3 20v-6h18V7h9l5 7h6v6"/><path d="M3 20h38M21 14h20"/><circle cx="10" cy="21" r="3"/><circle cx="33" cy="21" r="3"/>',
};

export function VehicleIcon({ id }: { id: string }) {
  return <svg className="ic" viewBox="0 0 44 28" aria-hidden="true" dangerouslySetInnerHTML={{ __html: VEH[id] }} />;
}

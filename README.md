# MiCarro web

Public website for MiCarro (El Salvador). This is the **CEO preview** stage: homepage, location page and booking flow, in Spanish (default) and English, with sample data only. There is no database or login yet.

## Run it on your Mac

```bash
cd "~/Documents/Claude/Projects/MiCarro/Digital Development/micarro-web"
npm install
npm run dev
```

Then open:

| Page | Spanish | English |
|---|---|---|
| Home | http://localhost:3000 | http://localhost:3000/en |
| Location page | http://localhost:3000/ubicaciones/santa-tecla | http://localhost:3000/en/ubicaciones/santa-tecla |
| Booking | http://localhost:3000/reservar | http://localhost:3000/en/reservar |

`npm run build` checks that everything compiles, the same way Vercel will.

## Where things live

| What | File |
|---|---|
| Sample locations, services, prices | `lib/data.ts` |
| All text, Spanish and English | `lib/i18n.ts` |
| Brand styles (colors, type, layout) | `app/globals.css` |
| Homepage | `app/[lang]/page.tsx` |
| Location page | `components/ListingView.tsx` |
| Booking flow | `components/BookingFlow.tsx` |
| Map + location finder | `components/Finder.tsx`, `lib/map.ts` |
| Images | `public/img/` |

Spanish URLs have no prefix (`/`, `/ubicaciones/...`). English lives under `/en`. Both are served by `app/[lang]` (see the rewrites in `next.config.ts`).

## Deploy (Vercel)

1. Push this folder to a GitHub repository.
2. On vercel.com, choose **Add New → Project**, import the repository and click **Deploy**. No settings or environment variables are needed.
3. Every later push to `main` redeploys automatically, and every pull request gets its own preview link.

The site sends a `noindex` header so search engines don't index the preview.

## Content rules (brand guide "Calma clara v3")

- Every business name, address, hour, price and promotion is sample content and labeled "Ejemplo" / "Sample".
- No water-saving numbers until pilot data is validated. Use "mucho menos agua" / "far less water".
- No reviews or ratings.

## Next stages

- Listings backend: Supabase (database, login, photo storage) plus an admin area at `/admin`.
- Real map: Leaflet with Esri Light Gray tiles, replacing the illustrative SVG map.
- Customer and operator PWAs on the same data.

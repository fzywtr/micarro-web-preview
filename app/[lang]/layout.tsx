import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { LANGS, isLang } from "@/lib/i18n";
import { Footer, Header, Ribbon } from "@/components/Chrome";
import { Toast } from "@/components/Bits";
import "../globals.css";

export const dynamicParams = false;
export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const en = lang === "en";
  const title = en ? "MiCarro · More shine, less water" : "MiCarro · Más brillo, menos agua";
  const description = en
    ? "Steam hand washing with far less water, at MiCarro locations and certified car washes in El Salvador."
    : "Lavado a mano con vapor y mucho menos agua, en ubicaciones MiCarro y autolavados certificados de El Salvador.";
  const image = {
    url: en ? "/og-en.jpg" : "/og-es.jpg",
    width: 1200,
    height: 630,
    alt: en ? "MiCarro: More shine, less water" : "MiCarro: Más brillo, menos agua",
    type: "image/jpeg",
  };
  return {
    // Absolute base URL for share images. Vercel sets VERCEL_PROJECT_PRODUCTION_URL automatically.
    metadataBase: new URL(
      process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000",
    ),
    title: { default: title, template: "%s · MiCarro" },
    description,
    robots: { index: false, follow: false }, // preview: keep out of search engines
    alternates: { languages: { es: "/", en: "/en" } },
    // Link preview card (WhatsApp, iMessage, Slack, LinkedIn, etc.)
    openGraph: {
      type: "website",
      siteName: "MiCarro",
      title,
      description,
      locale: en ? "en_US" : "es_SV",
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
  };
}

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#F5F6F2" };

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return (
    <html lang={lang}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Caveat:wght@600&family=Figtree:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" />
      </head>
      <body>
        <Ribbon lang={lang} />
        <Header lang={lang} />
        <main className="wrap">{children}</main>
        <Footer lang={lang} />
        <Toast />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LOCATIONS, getLocation } from "@/lib/data";
import { LANGS, isLang } from "@/lib/i18n";
import { ListingView } from "@/components/ListingView";

export const dynamicParams = false;
export function generateStaticParams() {
  return LANGS.flatMap((lang) => LOCATIONS.map((l) => ({ lang, slug: l.slug })));
}

type Params = Promise<{ lang: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang, slug } = await params;
  const loc = getLocation(slug);
  if (!loc || !isLang(lang)) return {};
  return { title: `${loc.name[lang]} · ${loc.city}` };
}

export default async function LocationPage({ params }: { params: Params }) {
  const { lang, slug } = await params;
  if (!isLang(lang) || !getLocation(slug)) notFound();
  return <ListingView slug={slug} lang={lang} />;
}

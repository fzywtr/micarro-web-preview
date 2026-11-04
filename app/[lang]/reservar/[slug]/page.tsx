import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocation, getService, VEHICLES, type SvcId, type VehId } from "@/lib/data";
import { isLang, t } from "@/lib/i18n";
import { BookingFlow } from "@/components/BookingFlow";

type Props = {
  params: Promise<{ lang: string; slug: string }>;
  searchParams: Promise<{ servicio?: string; vehiculo?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const loc = getLocation(slug);
  if (!isLang(lang) || !loc) return {};
  return { title: `${t(lang).booking.title} · ${loc.name[lang]}` };
}

export default async function BookLocationPage({ params, searchParams }: Props) {
  const { lang, slug } = await params;
  const { servicio, vehiculo } = await searchParams;
  const loc = getLocation(slug);
  if (!isLang(lang) || !loc) notFound();
  const svc = servicio && getService(servicio) && loc.services.includes(servicio as SvcId) ? (servicio as SvcId) : undefined;
  const veh = VEHICLES.some((v) => v.id === vehiculo) ? (vehiculo as VehId) : undefined;
  return <BookingFlow lang={lang} slug={slug} initialService={svc} initialVehicle={veh} />;
}

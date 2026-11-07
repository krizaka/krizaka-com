import { OG_SIZE, OG_TYPE, shareImage } from "@/lib/og-card";
import { shareCardOf } from "@/lib/og-pages";

/* The share image of this page, in the Cahier, from its own section and title (lib/og-card.tsx, krizaka-internal#2833). */
export const size = OG_SIZE;
export const contentType = OG_TYPE;
export const alt = "Krizaka";

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return shareImage(shareCardOf("changelog", locale));
}

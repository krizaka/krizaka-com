import { shareImage } from "@/lib/og-card";
import { shareCardOf } from "@/lib/og-pages";

/* The share image of this page, in the Cahier, from its own section and title (lib/og-card.tsx, krizaka-internal#2833). */
export { OG_SIZE as size } from "@/lib/og-card";
export { OG_TYPE as contentType } from "@/lib/og-card";
export const alt = "Krizaka";

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return shareImage(shareCardOf("story", locale));
}

import { OG_SIZE, OG_TYPE, shareImage } from "@/lib/og-card";
import { blockById } from "@/lib/building-blocks";
import { format, getDictionary } from "@/lib/i18n";

/* The share image of a building block's page, in the Cahier (lib/og-card.tsx, krizaka-internal#2833). */
export const size = OG_SIZE;
export const contentType = OG_TYPE;
export const alt = "Krizaka";

export default async function Image({ params }: { params: Promise<{ locale: string; block: string }> }) {
  const { locale, block: id } = await params;
  const { site } = getDictionary(locale);
  const block = blockById(id);
  const name = block ? site.blocks.items[block.id].name : id;
  return shareImage({
    section: site.footer.openSourceColumn,
    title: format(site.blocks.page.metaTitle, { name }),
    address: `www.krizaka.com/${locale}/open-source/${id}`,
  });
}

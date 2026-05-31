import { permanentRedirect } from "next/navigation";

/* /orazaka was a duplicate of /products/orazaka — permanent redirect (308)
   to consolidate SEO authority on a single product URL. */
export default async function OrazakaRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  permanentRedirect(`/${locale}/products/orazaka`);
}

import { permanentRedirect } from "next/navigation";

/* /orasaka was a duplicate of /products/orasaka — permanent redirect (308)
   to consolidate SEO authority on a single product URL. */
export default async function OrasakaRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  permanentRedirect(`/${locale}/products/orasaka`);
}

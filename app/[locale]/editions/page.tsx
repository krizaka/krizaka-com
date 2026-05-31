import { permanentRedirect } from "next/navigation";

/* /editions compared Community vs Cloud. Cloud is not yet offered, so the page
   was removed — permanent redirect (308) to the Orazaka product hub, where the
   Community engine is presented. */
export default async function EditionsRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  permanentRedirect(`/${locale}/products/orazaka`);
}

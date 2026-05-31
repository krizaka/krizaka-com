import { permanentRedirect } from "next/navigation";

export default async function PackagesOldRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  permanentRedirect(`/${locale}/products/orazaka/packages`);
}

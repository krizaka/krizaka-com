import { permanentRedirect } from "next/navigation";

export default async function ArchitectureOldRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  permanentRedirect(`/${locale}/products/orazaka/architecture`);
}

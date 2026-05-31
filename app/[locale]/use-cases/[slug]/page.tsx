import { permanentRedirect } from "next/navigation";

export default async function UseCaseSlugOldRedirect({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  permanentRedirect(`/${locale}/products/orazaka/usecases/${slug}`);
}

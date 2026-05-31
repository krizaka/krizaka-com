import { permanentRedirect } from "next/navigation";

export default async function SolutionsRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  permanentRedirect(`/${locale}/products/orazaka`);
}

import { permanentRedirect } from "next/navigation";

export default async function RoadmapRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  permanentRedirect(`/${locale}/`);
}

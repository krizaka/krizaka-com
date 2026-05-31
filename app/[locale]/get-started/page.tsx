import { redirect } from "next/navigation";

/* The standalone Get Started view was retired — the Orasaka onboarding doc already
   carries the install commands. Keep this route as a permanent redirect so old
   links and bookmarks still land on the right place. */
export default async function GetStartedPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/products/orasaka/getting-started/101`);
}

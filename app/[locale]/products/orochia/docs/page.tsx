import { permanentRedirect } from "next/navigation";

/* Orochia's documentation lives in the one documentation of the site (/docs/orochia, Fumadocs): its pages already
   redirect there (next.config.ts); its overview does too. */
export default async function OrochiaDocsRedirect({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  permanentRedirect(`/${locale}/docs/orochia`);
}

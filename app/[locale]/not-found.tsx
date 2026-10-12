import { ActionBar } from "@krizaka/ui/action-bar";
import { ErrorPage } from "@krizaka/ui/error-page";
import { Mascot } from "@krizaka/ui/mascots";
import Link from "next/link";
import { cookies } from "next/headers";
import TopNavBar from "@/app/components/TopNavBar";
import SiteFooter from "@/app/components/SiteFooter";
import { asLocale, getDictionary } from "@/lib/i18n";

/* A page that is not there — the Error template of @krizaka/ui: the code drawn, the pigeon that lost its way, one
   sentence and the ways back. The locale is the visitor's (the NEXT_LOCALE cookie: the not-found boundary receives no params). */
export default async function NotFound() {
  const locale = asLocale((await cookies()).get("NEXT_LOCALE")?.value ?? "en");
  const t = getDictionary(locale).site.notFound;
  return (
    <main style={{ background: "var(--kz-surface-0)", minHeight: "100dvh", color: "var(--kz-text-primary)" }}>
      <TopNavBar />
      <ErrorPage
        code="404"
        mascot={<Mascot bird="pigeon" mood="empty" size={96} />}
        title={t.title}
        text={t.text}
        actions={
          <ActionBar
            label={t.label}
            primaryFirst
            linkAs={Link}
            actions={[
              { href: `/${locale}`, label: t.home },
              { href: `/${locale}/docs`, label: t.docs },
              { href: `/${locale}/contact`, label: t.contact },
            ]}
          />
        }
      />
      <SiteFooter />
    </main>
  );
}

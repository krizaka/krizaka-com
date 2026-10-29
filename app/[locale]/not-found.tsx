"use client";

import { ActionBar } from "@krizaka/ui/action-bar";
import { ErrorPage } from "@krizaka/ui/error-page";
import { Mascot } from "@krizaka/ui/mascots";
import Link from "next/link";
import SiteBar from "@/app/components/SiteBar";
import { useI18n } from "@/app/components/I18nProvider";

/* A page that is not there — the Error template of @krizaka/ui: the code drawn, the pigeon that lost its way, one
   sentence and the ways back. The locale is the one of the locale layout around it (useI18n): the not-found boundary receives no params, and reading
   a cookie here would make every page of the locale dynamic. */
export default function NotFound() {
  const { locale, t: messages } = useI18n();
  const t = messages.site.notFound;
  return (
    <main style={{ background: "var(--kz-surface-0)", minHeight: "100dvh", color: "var(--kz-text-primary)" }}>
      <SiteBar />
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
    </main>
  );
}

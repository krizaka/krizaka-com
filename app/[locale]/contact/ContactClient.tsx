"use client";

import Link from "next/link";
import { ArrowRight, MessagesSquare, CircleDot, Mail, Sparkles } from "lucide-react";
import PageShell from "../../components/PageShell";
import { useI18n } from "../../components/I18nProvider";
import {
  GITHUB_DISCUSSIONS_URL,
  GITHUB_ISSUES_URL,
  CONTACT_EMAIL,
} from "@/lib/site";

const ICONS: Record<string, typeof Mail> = {
  discussions: MessagesSquare,
  issues: CircleDot,
  email: Mail,
  waitlist: Sparkles,
};

function hrefFor(kind: string): { href: string; external: boolean } {
  switch (kind) {
    case "discussions":
      return { href: GITHUB_DISCUSSIONS_URL, external: true };
    case "issues":
      return { href: GITHUB_ISSUES_URL, external: true };
    case "email":
      return { href: `mailto:${CONTACT_EMAIL}`, external: true };
    default:
      return { href: "/editions#waitlist", external: false };
  }
}

export default function ContactClient() {
  const { t } = useI18n();

  return (
    <PageShell max="4xl">
      <header className="mb-12 max-w-2xl">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--kz-accent)" }}>
          {t.footer.contact}
        </p>
        <h1 className="text-4xl font-bold leading-[1.05] tracking-[-0.02em] sm:text-5xl" style={{ color: "var(--kz-text-primary)" }}>
          {t.contact.heading}
        </h1>
        <p className="mt-6 text-lg leading-relaxed" style={{ color: "var(--kz-text-secondary)" }}>
          {t.contact.intro}
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {t.contact.channels.map((ch) => {
          const Icon = ICONS[ch.kind] ?? Mail;
          const { href, external } = hrefFor(ch.kind);
          const inner = (
            <>
              <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl" style={{ background: "var(--kz-accent-soft)" }}>
                <Icon size={18} strokeWidth={1.6} style={{ color: "var(--kz-accent)" }} />
              </div>
              <h2 className="mb-1.5 text-base font-bold" style={{ color: "var(--kz-text-primary)" }}>
                {ch.title}
              </h2>
              <p className="mb-4 flex-1 text-sm leading-relaxed" style={{ color: "var(--kz-text-muted)" }}>
                {ch.desc}
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: "var(--kz-accent)" }}>
                {ch.cta} <ArrowRight size={14} strokeWidth={2} />
              </span>
            </>
          );
          const className =
            "flex flex-col rounded-2xl border p-6 transition hover:-translate-y-0.5";
          const style = {
            borderColor: "var(--kz-border-subtle)",
            background: "var(--kz-surface-1)",
            textDecoration: "none",
          } as const;
          return external ? (
            <a key={ch.kind} href={href} target={ch.kind === "email" ? undefined : "_blank"} rel="noopener noreferrer" className={className} style={style}>
              {inner}
            </a>
          ) : (
            <Link key={ch.kind} href={href} className={className} style={style}>
              {inner}
            </Link>
          );
        })}
      </div>

      <div className="mt-12">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: "var(--kz-text-muted)" }}>
          ← {t.contact.backHome}
        </Link>
      </div>
    </PageShell>
  );
}

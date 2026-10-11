"use client";

/* Open source at a glance — figures come from the generated repository data and the organisation count read from
   GitHub at build (lib/org-stats.ts), passed by the server page. Under them, every repository slides by in a band
   (@krizaka/ui Marquee: pausable, still under reduced motion, paused off screen). The names are not links: the band
   repeats its items in an aria-hidden copy that @krizaka/ui 2.4 does not make inert, so a link there would be a
   focusable element hidden from assistive technology; every repository is one click away on /open-source. */

import Link from "next/link";
import { ForwardIcon } from "@krizaka/icons";
import { Marquee } from "@krizaka/ui/marquee";
import { NumberTicker } from "@krizaka/ui/number-ticker";
import { useI18n } from "../I18nProvider";
import { format } from "@krizaka/i18n";
import { reveal } from "@/lib/motion";

/** Whole numbers while the figure climbs (NumberTicker formats every frame). */
const WHOLE = { maximumFractionDigits: 0 } as const;

export default function OpenSourceSection({
  orazakaRepos,
  orochiaRepos,
  publicRepositories,
  repositories,
}: {
  orazakaRepos: number;
  orochiaRepos: number;
  publicRepositories: number;
  repositories: readonly { name: string }[];
}) {
  const { t, locale } = useI18n();
  const o = t.site.home.openSource;
  const stats = [
    { value: publicRepositories, label: o.repos },
    { value: "Apache-2.0", label: o.license },
    { value: "CI", label: o.ci },
  ];
  return (
    <section id="open-source" className="kz-section">
      <div className="kz-oss" {...reveal()}>
        <div>
          <p className="kz-eyebrow">{o.eyebrow}</p>
          <h2 className="kz-h2" style={{ marginBottom: 12 }}>
            {o.title}
          </h2>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: "var(--kz-text-secondary)", maxWidth: 520 }}>
            {format(o.body, { orazaka: orazakaRepos, orochia: orochiaRepos })}
          </p>
          <Link href="/open-source" prefetch={false} className="kz-link-strong" style={{ marginTop: 18 }}>
            {o.browse} <ForwardIcon size={15} />
          </Link>
        </div>
        <dl className="kz-oss-stats">
          {stats.map((s, i) => (
            <div key={s.label} {...reveal(i + 1)}>
              <dt>{typeof s.value === "number" ? <NumberTicker value={s.value} locale={locale} align="start" format={WHOLE} /> : s.value}</dt>
              <dd>{s.label}</dd>
            </div>
          ))}
        </dl>
        <div className="kz-oss-band">
          <Marquee label={o.band} pauseLabel={o.bandPause} playLabel={o.bandPlay} speed={32}>
            {repositories.map((r) => (
              <span key={r.name} className="kz-oss-repo">
                <span aria-hidden className="kz-oss-dot" />
                {r.name}
              </span>
            ))}
          </Marquee>
        </div>
      </div>
      <style>{`
        .kz-oss { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr)); gap: 32px; align-items: center;
          padding: 32px; border-radius: 24px; background: var(--kz-surface-1); border: 1px solid var(--kz-border-subtle); overflow: hidden; }
        .kz-oss-stats { display: grid; gap: 18px; margin: 0; }
        .kz-oss-stats dt { font-family: var(--font-display), system-ui, sans-serif; font-size: 28px; font-weight: 800; color: var(--kz-text-primary); }
        .kz-oss-stats dd { margin: 2px 0 0; font-size: 13px; color: var(--kz-text-secondary); }
        .kz-oss-band { grid-column: 1 / -1; margin: 0 -32px -12px; }
        .kz-oss-repo { display: inline-flex; align-items: center; gap: 8px; margin-right: 10px; padding: 8px 14px; border-radius: 999px; white-space: nowrap;
          font-family: var(--font-mono); font-size: 12.5px; font-weight: 600; color: var(--kz-text-primary);
          background: var(--kz-surface-0); border: 1px solid var(--kz-border-subtle); }
        .kz-oss-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--kz-accent); }
      `}</style>
    </section>
  );
}

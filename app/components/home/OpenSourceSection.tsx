"use client";

/* Open source at a glance — figures come from the generated repository data (server-side). */

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useI18n } from "../I18nProvider";

export default function OpenSourceSection({ orazakaRepos, orochiaRepos }: { orazakaRepos: number; orochiaRepos: number }) {
  const { locale } = useI18n();
  const loc = locale === "en" ? "en" : "fr";
  const stats = [
    { value: orazakaRepos + orochiaRepos, label: loc === "fr" ? "dépôts publics" : "public repositories" },
    { value: "Apache-2.0", label: loc === "fr" ? "licence de tous les dépôts" : "license of every repository" },
    { value: "CI", label: loc === "fr" ? "build, tests et règles d'architecture à chaque commit" : "build, tests and architecture rules on every commit" },
  ];
  return (
    <section id="open-source" className="kz-section">
      <div className="kz-oss">
        <div>
          <p className="kz-eyebrow">Open source</p>
          <h2 className="kz-h2" style={{ marginBottom: 12 }}>
            {loc === "fr" ? "Lisez chaque ligne." : "Read every line."}
          </h2>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: "var(--kz-text-secondary)", maxWidth: 520 }}>
            {loc === "fr"
              ? `Orazaka est découpé en ${orazakaRepos} dépôts — prenez seulement les briques dont votre application a besoin. Orochia en compte ${orochiaRepos}.`
              : `Orazaka is split into ${orazakaRepos} repositories — take only the building blocks your application needs. Orochia has ${orochiaRepos}.`}
          </p>
          <Link href="/open-source" className="kz-link-strong" style={{ marginTop: 18 }}>
            {loc === "fr" ? "Parcourir les dépôts" : "Browse the repositories"} <ArrowRight size={14} />
          </Link>
        </div>
        <dl className="kz-oss-stats">
          {stats.map((s) => (
            <div key={s.label}>
              <dt>{s.value}</dt>
              <dd>{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
      <style>{`
        .kz-oss { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr)); gap: 32px; align-items: center;
          padding: 32px; border-radius: 24px; background: var(--kz-surface-1); border: 1px solid var(--kz-border-subtle); }
        .kz-oss-stats { display: grid; gap: 18px; margin: 0; }
        .kz-oss-stats dt { font-family: var(--font-display), system-ui, sans-serif; font-size: 28px; font-weight: 800; color: var(--kz-text-primary); }
        .kz-oss-stats dd { margin: 2px 0 0; font-size: 13px; color: var(--kz-text-secondary); }
      `}</style>
    </section>
  );
}

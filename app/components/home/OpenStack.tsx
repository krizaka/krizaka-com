/* "The stack we open-source" — Krizaka UI (ui.krizaka.com) and Krizaka Java (java.krizaka.com), each on its own site
   (lib/stack.ts). The facts beside them are read at build from npm and Maven Central (lib/registry-versions.ts): the
   published version, how many packages or artifacts — a fact the registries did not give is not shown. */

import Link from "next/link";
import { ForwardIcon, PackIcon, ServerIcon } from "@krizaka/icons";
import { CardGrid } from "@krizaka/ui/card-grid";
import { LinkCard } from "@krizaka/ui/link-card";
import { Facts, Section, type Fact } from "@krizaka/ui/page";
import { format, getDictionary } from "@/lib/i18n";
import { npmPackages, publishedVersion } from "@/lib/registry-versions";
import { STACK, hostOf, type StackId } from "@/lib/stack";

/** The two cards — Krizaka UI and Krizaka Java — each one link to its own site, with its facts. On the home and on
    /open-source. */
export function StackCards({ locale, mavenArtifacts, titleAs = "h3" }: { locale: string; mavenArtifacts: number; titleAs?: "h2" | "h3" }) {
  const site = getDictionary(locale).site;
  const s = site.home.stack;
  const npmCount = npmPackages().length;
  const facts = (id: StackId, coordinate: string): Fact[] => {
    const version = publishedVersion(coordinate);
    const list: (Fact | false)[] = [
      Boolean(version) && { label: `${coordinate.replace(/^com\.krizaka:/, "")} ${version}`, tone: "ok" },
      id === "ui" && { label: s.facts.platforms },
      id === "ui" && npmCount > 0 && { label: format(s.facts.npm, { count: npmCount }) },
      id === "java" && mavenArtifacts > 0 && { label: format(s.facts.maven, { count: mavenArtifacts }) },
      { label: "Apache-2.0" },
    ];
    return list.filter((f): f is Fact => Boolean(f));
  };
  return (
    <CardGrid as="ul" min={320} columns={2}>
      {STACK.map((part) => {
        const Icon = part.id === "ui" ? PackIcon : ServerIcon;
        return (
          <li key={part.id}>
            <LinkCard
              href={part.url}
              title={part.name}
              titleAs={titleAs}
              description={site.stack[part.id].line}
              icon={<Icon size={22} />}
              meta={hostOf(part.url)}
              cta={format(s.visit, { host: hostOf(part.url) })}
              extra={<Facts items={facts(part.id, part.coordinate)} />}
            />
          </li>
        );
      })}
    </CardGrid>
  );
}

export default function OpenStack({ locale, mavenArtifacts }: { locale: string; mavenArtifacts: number }) {
  const s = getDictionary(locale).site.home.stack;
  return (
    <Section
      id="stack"
      eyebrow={s.eyebrow}
      title={s.title}
      lead={s.lead}
      reveal
      divider
      actions={
        <Link href="/open-source" prefetch={false} className="kz-link-strong">
          {s.repositories} <ForwardIcon size={15} />
        </Link>
      }
    >
      <StackCards locale={locale} mavenArtifacts={mavenArtifacts} />
    </Section>
  );
}

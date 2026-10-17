/* "Open source", in brief on the home: Krizaka UI and Krizaka Java, each on its own site (lib/stack.ts), then the way to
   /open-source. The facts on the cards are read at build from npm and Maven Central (lib/registry-versions.ts): the
   published version, how many packages or artifacts — a fact the registries did not give is not shown. */

import { ForwardIcon, PackIcon, ServerIcon } from "@krizaka/icons";
import { CardGrid } from "@krizaka/ui/card-grid";
import { LinkCard } from "@krizaka/ui/link-card";
import { Facts, Section, type Fact } from "@krizaka/ui/page";
import { format, getDictionary } from "@/lib/i18n";
import { npmPackages, publishedVersion } from "@/lib/registry-versions";
import ButtonLink from "@/app/components/ButtonLink";
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
    <CardGrid as="ul" min={320} columns={2} fit="fit" className="kz-home-stack-cards">
      {STACK.map((part) => {
        const Icon = part.id === "ui" ? PackIcon : ServerIcon;
        return (
          <LinkCard
            key={part.id}
            href={part.url}
            title={part.name}
            titleAs={titleAs}
            description={site.stack[part.id].line}
            icon={<Icon size={22} />}
            meta={hostOf(part.url)}
            cta={format(s.visit, { host: hostOf(part.url) })}
            extra={<Facts items={facts(part.id, part.coordinate)} />}
          />
        );
      })}
    </CardGrid>
  );
}

/** The stack in brief, on the home: the two cards and the way to /open-source, where everything we publish is. */
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
        <ButtonLink href="/open-source" variant="primary">
          {s.more} <ForwardIcon size={14} />
        </ButtonLink>
      }
    >
      <StackCards locale={locale} mavenArtifacts={mavenArtifacts} />
    </Section>
  );
}

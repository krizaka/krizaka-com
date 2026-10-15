/* "The stack we open-source" — one open stack builds all four products: the figures of Krizaka UI (read from its
   published registries, lib/ui-facts.ts, and npm), one light visual (the same component in the four identities), the way
   to the live gallery on ui.krizaka.com, then Krizaka UI and Krizaka Java, each on its own site (lib/stack.ts). The facts beside them are read at build from npm and Maven Central (lib/registry-versions.ts): the
   published version, how many packages or artifacts — a fact the registries did not give is not shown. */

import Link from "next/link";
import { ForwardIcon, PackIcon, ServerIcon } from "@krizaka/icons";
import { CardGrid } from "@krizaka/ui/card-grid";
import { LinkCard } from "@krizaka/ui/link-card";
import { Facts, Section, type Fact } from "@krizaka/ui/page";
import { format, getDictionary } from "@/lib/i18n";
import { npmPackages, npmVersion, publishedVersion } from "@/lib/registry-versions";
import { ProductLogo } from "@krizaka/ui";
import FigureTiles, { type FigureTile } from "@/app/components/FigureTiles";
import { Progress } from "@krizaka/ui/progress";
import { isLocale } from "@/lib/locales";
import { PRODUCTS } from "@/lib/products";
import { reveal } from "@/lib/motion";
import { uiFacts } from "@/lib/ui-facts";
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

export default function OpenStack({ locale, mavenArtifacts }: { locale: string; mavenArtifacts: number }) {
  const site = getDictionary(locale).site;
  const s = site.home.stack;
  const lang = isLocale(locale) ? locale : "en";
  const { components, native } = uiFacts();
  const uiVersion = npmVersion("@krizaka/ui");
  const figures = [
    { id: "components", value: components, label: s.figures.components },
    { id: "native", value: native, label: s.figures.native },
    { id: "packages", value: npmPackages().length, label: s.figures.packages },
  ].filter((f) => f.value > 0);
  const tiles: FigureTile[] = [...figures, ...(uiVersion ? [{ id: "version", value: uiVersion, label: s.figures.version }] : [])];

  return (
    <Section
      id="stack"
      eyebrow={s.eyebrow}
      title={s.title}
      lead={s.lead}
      reveal
      divider
      actions={
        <ButtonLink href={STACK[0].url} variant="primary">
          {s.live} <ForwardIcon size={14} />
        </ButtonLink>
      }
    >
      <div {...reveal(1)} className="kz-home-figures">
        <FigureTiles figures={tiles} label={s.figures.label} locale={lang} />
      </div>

      {/* The idea in one glance: the same @krizaka/ui component, worn by each product's identity (.brand-<id>, the same
          treatment for all four). The live gallery is on ui.krizaka.com. */}
      <figure className="kz-home-identities" {...reveal(2, "soft")}>
        <ul>
          {PRODUCTS.map((p, i) => (
            <li key={p.id} className={"brand-" + p.id}>
              <span className="kz-home-identity-name">
                <ProductLogo id={p.id} size={22} animated={false} /> {p.name}
              </span>
              <Progress value={30 + i * 10} label={format(s.visual.progress, { name: p.name })} size="sm" />
            </li>
          ))}
        </ul>
        <figcaption>{s.visual.caption}</figcaption>
      </figure>

      <StackCards locale={locale} mavenArtifacts={mavenArtifacts} />

      <p className="kz-home-stack-more">
        <Link href="/open-source" prefetch={false} className="kz-link-strong">
          {s.repositories} <ForwardIcon size={15} />
        </Link>
      </p>
    </Section>
  );
}

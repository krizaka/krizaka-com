/* The open source, put forward on the home and PLAYABLE (2026-10-20): « Build with our open source » — three tiles, one
   per piece of the stack, each with something to try and its own site:
   - Krizaka UI: real components to play with (UiPlayground) and @krizaka/ui's real npm downloads → ui.krizaka.com;
   - Krizaka Motion: the engine flow in a small frame with the lab's layout and mode → the lab on GitHub Pages;
   - Krizaka Java: the BOM to paste, Maven or Gradle (CodeTabs), at the version Maven Central gives → java.krizaka.com.
   Every version and figure is read at build (lib/registry-versions.ts); one primary action: /open-source.
   `StackCards` (the two link cards) stays for /open-source. */

import type { ReactNode } from "react";
import { AutomationIcon, ForwardIcon, PackIcon, ServerIcon } from "@krizaka/icons";
import { CardGrid } from "@krizaka/ui/card-grid";
import { CodeBlock, CodeTabs } from "@krizaka/ui/code-block";
import { LinkCard } from "@krizaka/ui/link-card";
import { Facts, Section, type Fact } from "@krizaka/ui/page";
import { format, getDictionary } from "@/lib/i18n";
import { mavenVersion, npmDownloads, npmPackages, npmPackagesFrom, publishedVersion } from "@/lib/registry-versions";
import ButtonLink from "@/app/components/ButtonLink";
import { MOTION_LAB, STACK, hostOf, type StackId, type StackPart } from "@/lib/stack";
import MotionPlayground from "./playground/MotionPlayground";
import UiPlayground from "./playground/UiPlayground";

/** The three cards — Krizaka UI, Krizaka Java and Krizaka TS — each one link to its own site, with its facts. On /open-source. */
export function StackCards({
  locale,
  mavenArtifacts,
  titleAs = "h3",
  visuals,
}: {
  locale: string;
  mavenArtifacts: number;
  titleAs?: "h2" | "h3";
  /** /open-source: a still mini-visual per part (StackVisual), above its facts. */
  visuals?: Partial<Record<StackId, ReactNode>>;
}) {
  const site = getDictionary(locale).site;
  const s = site.home.stack;
  const npmCount = npmPackages().length;
  const facts = (part: (typeof STACK)[number]): Fact[] => {
    const { id, coordinate } = part;
    const version = coordinate && publishedVersion(coordinate);
    const tsCount = id === "ts" ? npmPackagesFrom(part.repoUrl).length : 0;
    const list: (Fact | false)[] = [
      Boolean(version) && { label: `${coordinate!.replace(/^com\.krizaka:/, "")} ${version}`, tone: "ok" },
      tsCount > 0 && { label: format(s.facts.npm, { count: tsCount }), tone: "ok" },
      id === "ui" && { label: s.facts.platforms },
      id === "ui" && npmCount > 0 && { label: format(s.facts.npm, { count: npmCount }) },
      id === "java" && mavenArtifacts > 0 && { label: format(s.facts.maven, { count: mavenArtifacts }) },
      { label: "Apache-2.0" },
    ];
    return list.filter((f): f is Fact => Boolean(f));
  };
  return (
    <CardGrid as="ul" min={300} columns={3} fit="fit" className="kz-home-stack-cards">
      {STACK.map((part) => {
        const Icon = { ui: PackIcon, java: ServerIcon, ts: AutomationIcon }[part.id];
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
            extra={
              <>
                {visuals?.[part.id]}
                <Facts items={facts(part)} />
              </>
            }
          />
        );
      })}
    </CardGrid>
  );
}

/** One tile of the section: its name, one line, the thing to try, its facts, the way to its site. */
function Tile({ name, meta, line, children, facts, href, cta }: { name: string; meta: string; line: string; children: ReactNode; facts: Fact[]; href: string; cta: string }) {
  return (
    <li className="kz-build-tile">
      <p className="kz-build-meta">{meta}</p>
      <h3 className="kz-build-name">{name}</h3>
      <p className="kz-build-line">{line}</p>
      <div className="kz-build-try">{children}</div>
      {facts.length > 0 && <Facts items={facts} />}
      <ButtonLink href={href} variant="secondary" size="md" className="kz-build-cta">
        {cta} <ForwardIcon size={14} />
      </ButtonLink>
    </li>
  );
}

const ui = STACK.find((p): p is StackPart & { coordinate: string } => p.id === "ui")!;
const java = STACK.find((p) => p.id === "java")!;

/** « Build with our open source », on the home, after the products. */
export default function OpenStack({ locale }: { locale: string; mavenArtifacts?: number }) {
  const s = getDictionary(locale).site.home.stack;
  const uiVersion = publishedVersion(ui.coordinate);
  const downloads = npmDownloads(ui.coordinate);
  const bom = mavenVersion("krizaka-bom");
  const maven = `<dependency>
  <groupId>com.krizaka</groupId>
  <artifactId>krizaka-bom</artifactId>
  <version>${bom ?? "LATEST"}</version>
  <type>pom</type>
  <scope>import</scope>
</dependency>`;
  const gradle = `dependencies {
  implementation(platform("com.krizaka:krizaka-bom:${bom ?? "+"}"))
}`;
  const fmt = new Intl.NumberFormat(locale);
  return (
    <Section
      id="stack"
      number={s.number}
      margin
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
      <ul className="kz-build">
        <Tile
          name={ui.name}
          meta={hostOf(ui.url)}
          line={s.ui.line}
          href={ui.url}
          cta={s.ui.explore}
          facts={[uiVersion ? { label: `@krizaka/ui ${uiVersion}`, tone: "ok" } : false, { label: s.facts.platforms }].filter((f): f is Fact => Boolean(f))}
        >
          <UiPlayground
            series={downloads.series}
            w={{
              label: s.ui.playground,
              variant: s.ui.variant,
              variants: s.ui.variants,
              button: s.ui.button,
              switch: s.ui.switch,
              theme: s.ui.theme,
              themes: s.ui.themes,
              downloads: downloads.weekly !== undefined ? format(s.ui.downloads, { count: fmt.format(downloads.weekly) }) : undefined,
              trend: s.ui.trend,
            }}
          />
        </Tile>
        <Tile name={MOTION_LAB.name} meta={hostOf(MOTION_LAB.url).replace(/\/orazaka$/, "")} line={s.motion.line} href={MOTION_LAB.url} cta={s.motion.lab} facts={uiVersion ? [{ label: `@krizaka/ui/engine-flow ${uiVersion}`, tone: "ok" }] : []}>
          <MotionPlayground w={{ label: s.motion.label, hint: s.motion.hint, hub: s.motion.hub, app: s.motion.app, layout: s.motion.layout, layouts: s.motion.layouts, mode: s.motion.mode, modes: s.motion.modes }} />
        </Tile>
        <Tile
          name={java.name}
          meta={hostOf(java.url)}
          line={s.java.line}
          href={java.url}
          cta={s.java.explore}
          facts={bom ? [{ label: `krizaka-bom ${bom}`, tone: "ok" }] : []}
        >
          <CodeTabs
            label={s.java.tool}
            tabs={[
              { id: "maven", label: "Maven", content: <CodeBlock code={maven} language="xml" file="pom.xml" copyLabel={s.java.copy} copiedLabel={s.java.copied} /> },
              { id: "gradle", label: "Gradle", content: <CodeBlock code={gradle} language="kotlin" file="build.gradle.kts" copyLabel={s.java.copy} copiedLabel={s.java.copied} /> },
            ]}
          />
        </Tile>
      </ul>
    </Section>
  );
}

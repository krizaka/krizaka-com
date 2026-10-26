/* The open source section — the home's rows and, for /open-source and /story, the full cards.
   The home (Oussama, 2026-10-25, krizaka-com#392): one row per publication of lib/stack.ts, like the products' — the live
   visual on the left, a specimen tag on the right: the library code (KZ-L01…), a stamp with the release read at build,
   the name, one line, the fields site / registry / licence (libraries carry no bird), « Docs » or « Open the lab », and
   « Source ». The rows alternate and fall to one column on a phone; adding a publication is an entry in lib/stack.ts and
   its messages — nothing changes here.
   /open-source and /story: the full cards — the examples, the facts, the copy buttons.
   Versions and figures are read at build (lib/registry-versions.ts); hosts come from lib/stack.ts. */

import type { ReactNode } from "react";
import { ForwardIcon } from "@krizaka/icons";
import { KrizakaLogo } from "@krizaka/ui";
import { CardGrid } from "@krizaka/ui/card-grid";
import { CodeBlock, CodeTabs } from "@krizaka/ui/code-block";
import { Facts, Section, type Fact } from "@krizaka/ui/page";
import { SpecimenTag } from "@krizaka/ui/specimen-tag";
import { format, getDictionary, type TranslationDictionary } from "@/lib/i18n";
import { mavenModuleIds, mavenVersion, npmDownloads, npmPackagesFrom, publishedVersion } from "@/lib/registry-versions";
import ButtonLink from "@/app/components/ButtonLink";
import { GitHubMark } from "../brand/GitHubMark";
import { STACK, STACK_LICENCE, hostOf, stackActionUrl, stackCode, type StackPart } from "@/lib/stack";
import MotionPlayground from "./playground/MotionPlayground";
import UiShowcase from "./playground/UiShowcase";
import StackVisual from "./stack/StackVisual";
import type { StackVisualData } from "./stack/StackVisuals";
import "./stack-tiles.css";

/** The release a publication shows beside its stamp, read at build: `<coordinate> <version>` for a package or the BOM, the
    package count for a set released one by one. `undefined` when the registry could not be read, or while in development. */
function releaseOf(part: Readonly<StackPart>, s: Readonly<TranslationDictionary["site"]["home"]["stack"]>): string | undefined {
  if (part.status !== "released") return undefined;
  if (part.coordinate) {
    const artifact = part.coordinate.split(":")[1] ?? part.coordinate;
    const version = part.registry === "maven" ? mavenVersion(artifact) : publishedVersion(part.coordinate);
    return version ? `${artifact} ${version}` : undefined;
  }
  const count = npmPackagesFrom(part.repoUrl).length;
  return count ? format(s.row.packages, { count }) : undefined;
}

/** The names of a set of packages, read at build — a Maven BOM's modules, or the npm packages of a repository. */
function namesOf(part: StackPart): string[] {
  if (part.registry === "maven") return mavenModuleIds();
  if (part.registry === "npm" && !part.coordinate) return npmPackagesFrom(part.repoUrl);
  return [];
}

/** The snippet of the `code` visual: the install command, never a version typed here. */
function snippetOf(part: Readonly<StackPart>, names: readonly string[]): string {
  if (part.registry === "maven") return `implementation(platform("${part.coordinate}:${mavenVersion(part.coordinate?.split(":")[1] ?? "") ?? "+"}"))`;
  return ["npm install", ...(part.coordinate ? [`  ${part.coordinate}`] : names.map((n) => `  ${n}`))].join(" \\\n");
}

function StackRow({ part, t }: Readonly<{ part: StackPart; t: TranslationDictionary }>) {
  const s = t.site.home.stack;
  const r = s.row;
  const names = namesOf(part);
  const release = releaseOf(part, s);
  const released = part.status === "released";
  const data: StackVisualData = { names, snippet: snippetOf(part, names), ui: s.ui.showcase, motion: s.motion };
  const line = s[part.id].line;
  const action = r[part.action];
  return (
    <li id={`stack-${part.id}`} className="kz-stack-row" data-stack={part.id} data-status={part.status}>
      <figure className="kz-stack-plate">
        <StackVisual visual={part.visual} data={data} />
      </figure>
      <SpecimenTag
        className="kz-stack-tag"
        code={stackCode(part)}
        title={
          <a href={part.url} className="kz-entry-name">
            {part.name}
          </a>
        }
        mark={<KrizakaLogo size={30} animated={false} />}
        status={{ label: release ? `${r.stamps.released} · ${release}` : r.stamps[part.status], tone: released ? "ok" : "wip" }}
        fields={[
          { label: r.fields.site, value: hostOf(part.url) },
          { label: r.fields.registry, value: r.registries[part.registry] },
          { label: r.fields.licence, value: STACK_LICENCE },
        ]}
        footer={
          <>
            <a href={stackActionUrl(part)} aria-label={format(part.action === "docs" ? r.docsAria : r.labAria, { name: part.name })}>
              {action} <ForwardIcon size={13} aria-hidden />
            </a>
            <a href={part.repoUrl} aria-label={format(r.sourceAria, { name: part.name })}>
              <GitHubMark size={14} /> {r.source}
            </a>
          </>
        }
      >
        <p>{line}</p>
      </SpecimenTag>
    </li>
  );
}

/** One tile of the grid (/open-source, /story): its host, its name, one line, the thing to try or to copy, its facts, the
    way to its site. The grid cell stretches it to the row's height; the action sits at the foot. */
function Tile({ name, meta, line, children, facts, href, cta }: { name: string; meta: string; line: string; children: ReactNode; facts: Fact[]; href: string; cta: string }) {
  return (
    <div className="kz-build-tile">
      <p className="kz-build-meta">{meta}</p>
      <h3 className="kz-build-name">{name}</h3>
      <p className="kz-build-line">{line}</p>
      <div className="kz-build-try">{children}</div>
      {facts.length > 0 && <Facts items={facts} />}
      <ButtonLink href={href} variant="secondary" size="md" className="kz-build-cta">
        {cta} <ForwardIcon size={14} />
      </ButtonLink>
    </div>
  );
}

const part = (id: StackPart["id"]) => STACK.find((p) => p.id === id)!;
const ui = part("ui") as StackPart & { coordinate: string };
const motion = part("motion");
const java = part("java");
const ts = part("ts");

/** The four full cards — Krizaka UI, Krizaka Motion, Krizaka Java, Krizaka TypeScript — in a CardGrid (every tile of a row as
    tall as the tallest), with the examples, the facts and the copy buttons (/open-source, /story). */
export function StackTiles({ locale }: { locale: string }) {
  const s = getDictionary(locale).site.home.stack;
  const tsPackages = npmPackagesFrom(ts.repoUrl);
  // One package per line: readable on a phone, and it still pastes as one command.
  const install = ["npm install", ...tsPackages.map((name) => `  ${name}`)].join(" \\\n");
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
    <CardGrid as="ul" className="kz-build" min={420} columns={2} reveal>
      <Tile
        key="ui"
        name={ui.name}
        meta={hostOf(ui.url)}
        line={s.ui.line}
        href={ui.url}
        cta={s.ui.explore}
        facts={[uiVersion ? { label: `@krizaka/ui ${uiVersion}`, tone: "ok" } : false, { label: s.facts.platforms }].filter((f): f is Fact => Boolean(f))}
      >
        <UiShowcase
          w={{
            ...s.ui.showcase,
            downloads: downloads.weekly !== undefined ? format(s.ui.downloads, { count: fmt.format(downloads.weekly) }) : undefined,
          }}
        />
      </Tile>
      <Tile key="motion" name={motion.name} meta={hostOf(motion.url)} line={s.motion.line} href={stackActionUrl(motion)} cta={s.motion.lab} facts={uiVersion ? [{ label: `@krizaka/ui/engine-flow ${uiVersion}`, tone: "ok" }] : []}>
        <MotionPlayground w={{ label: s.motion.label, hint: s.motion.hint, hub: s.motion.hub, app: s.motion.app, layout: s.motion.layout, layouts: s.motion.layouts, mode: s.motion.mode, modes: s.motion.modes }} />
      </Tile>
      <Tile key="java" name={java.name} meta={hostOf(java.url)} line={s.java.line} href={java.url} cta={s.java.explore} facts={bom ? [{ label: `krizaka-bom ${bom}`, tone: "ok" }] : []}>
        <CodeTabs
          label={s.java.tool}
          tabs={[
            { id: "maven", label: "Maven", content: <CodeBlock code={maven} language="xml" file="pom.xml" copyLabel={s.java.copy} copiedLabel={s.java.copied} /> },
            { id: "gradle", label: "Gradle", content: <CodeBlock code={gradle} language="kotlin" file="build.gradle.kts" copyLabel={s.java.copy} copiedLabel={s.java.copied} /> },
          ]}
        />
      </Tile>
      <Tile key="ts" name={ts.name} meta={hostOf(ts.url)} line={s.ts.line} href={ts.url} cta={s.ts.explore} facts={tsPackages.length ? [{ label: format(s.facts.npm, { count: tsPackages.length }), tone: "ok" }, { label: STACK_LICENCE }] : []}>
        {tsPackages.length ? <CodeBlock code={install} language="bash" file="terminal" copyLabel={s.java.copy} copiedLabel={s.java.copied} /> : null}
      </Tile>
    </CardGrid>
  );
}

/** « Build with our open source », on the home, after the engine: one row per publication of lib/stack.ts. */
export default function OpenStack({ locale }: Readonly<{ locale: string; mavenArtifacts?: number }>) {
  const t = getDictionary(locale);
  const s = t.site.home.stack;
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
      <ol className="kz-stack-list" aria-label={s.row.listLabel}>
        {STACK.map((p) => (
          <StackRow key={p.id} part={p} t={t} />
        ))}
      </ol>
    </Section>
  );
}

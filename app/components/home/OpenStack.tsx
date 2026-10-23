/* The open source, put forward on the home and PLAYABLE (2026-10-20): « Build with our open source » — three tiles, one
   per piece of the stack, each with something to try and its own site:
   - Krizaka UI: a composed piece of real components (UiShowcase) and @krizaka/ui's real npm downloads → ui.krizaka.com;
   - Krizaka Motion: the engine flow in a small frame with the lab's layout and mode → the lab on GitHub Pages;
   - Krizaka Java: the BOM to paste, Maven or Gradle (CodeTabs), at the version Maven Central gives → java.krizaka.com.
   - Krizaka TypeScript: the command that installs its packages, as npm lists them at build → its repository (READMEs as docs).
   Every version and figure is read at build (lib/registry-versions.ts). `StackTiles` is the one mechanism of the home and of
   /open-source: every tile has something to try or to copy, its facts, and the way to its site. */

import type { ReactNode } from "react";
import { ForwardIcon } from "@krizaka/icons";
import { CodeBlock, CodeTabs } from "@krizaka/ui/code-block";
import { Facts, Section, type Fact } from "@krizaka/ui/page";
import { format, getDictionary } from "@/lib/i18n";
import { mavenVersion, npmDownloads, npmPackagesFrom, publishedVersion } from "@/lib/registry-versions";
import ButtonLink from "@/app/components/ButtonLink";
import { MOTION_LAB, STACK, hostOf, type StackPart } from "@/lib/stack";
import MotionPlayground from "./playground/MotionPlayground";
import UiShowcase from "./playground/UiShowcase";
import "./stack-tiles.css";

/** One tile of the section: its name, one line, the thing to try, its facts, the way to its site. */
function Tile({ name, meta, line, children, facts, href, cta, compact }: { name: string; meta: string; line: string; children: ReactNode; facts: Fact[]; href: string; cta: string; compact?: boolean }) {
  return (
    <li className="kz-build-tile">
      <p className="kz-build-meta">{meta}</p>
      <h3 className="kz-build-name">{name}</h3>
      <p className="kz-build-line">{line}</p>
      <div className={compact ? "kz-build-still" : "kz-build-try"} aria-hidden={compact || undefined}>
        {children}
      </div>
      {!compact && facts.length > 0 && <Facts items={facts} />}
      <ButtonLink href={href} variant="secondary" size="md" className="kz-build-cta">
        {cta} <ForwardIcon size={14} />
      </ButtonLink>
    </li>
  );
}

const ui = STACK.find((p): p is StackPart & { coordinate: string } => p.id === "ui")!;
const java = STACK.find((p) => p.id === "java")!;
const ts = STACK.find((p) => p.id === "ts")!;

/** The four tiles — Krizaka UI, Krizaka Motion, Krizaka Java, Krizaka TypeScript. `compact` (the home): the name, one line, one
    still visual and one link. Without it (/open-source, /story): the full cards, with examples, facts and copy buttons. */
export function StackTiles({ locale, compact }: { locale: string; compact?: boolean }) {
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
    <ul className={compact ? "kz-build kz-build-compact" : "kz-build"}>
        <Tile
          compact={compact}
          name={ui.name}
          meta={hostOf(ui.url)}
          line={s.ui.line}
          href={ui.url}
          cta={s.ui.explore}
          facts={[uiVersion ? { label: `@krizaka/ui ${uiVersion}`, tone: "ok" } : false, { label: s.facts.platforms }].filter((f): f is Fact => Boolean(f))}
        >
          <UiShowcase
            series={downloads.series}
            w={{
              label: s.ui.showcase.label,
              rows: s.ui.showcase.rows,
              downloads: !compact && downloads.weekly !== undefined ? format(s.ui.downloads, { count: fmt.format(downloads.weekly) }) : undefined,
              trend: s.ui.trend,
            }}
          />
        </Tile>
        <Tile compact={compact} name={MOTION_LAB.name} meta={hostOf(MOTION_LAB.url).replace(/\/orazaka$/, "")} line={s.motion.line} href={MOTION_LAB.url} cta={s.motion.lab} facts={uiVersion ? [{ label: `@krizaka/ui/engine-flow ${uiVersion}`, tone: "ok" }] : []}>
          <MotionPlayground still={compact} w={{ label: s.motion.label, hint: s.motion.hint, hub: s.motion.hub, app: s.motion.app, layout: s.motion.layout, layouts: s.motion.layouts, mode: s.motion.mode, modes: s.motion.modes }} />
        </Tile>
        <Tile
          compact={compact}
          name={java.name}
          meta={hostOf(java.url)}
          line={s.java.line}
          href={java.url}
          cta={s.java.explore}
          facts={bom ? [{ label: `krizaka-bom ${bom}`, tone: "ok" }] : []}
        >
          {compact ? <code className="kz-build-code">com.krizaka:krizaka-bom{bom ? `:${bom}` : ""}</code> : <CodeTabs
            label={s.java.tool}
            tabs={[
              { id: "maven", label: "Maven", content: <CodeBlock code={maven} language="xml" file="pom.xml" copyLabel={s.java.copy} copiedLabel={s.java.copied} /> },
              { id: "gradle", label: "Gradle", content: <CodeBlock code={gradle} language="kotlin" file="build.gradle.kts" copyLabel={s.java.copy} copiedLabel={s.java.copied} /> },
            ]}
          />}
        </Tile>
        <Tile
          compact={compact}
          name={ts.name}
          meta={hostOf(ts.url)}
          line={s.ts.line}
          href={ts.url}
          cta={s.ts.explore}
          facts={tsPackages.length ? [{ label: format(s.facts.npm, { count: tsPackages.length }), tone: "ok" }, { label: "Apache-2.0" }] : []}
        >
          {compact ? <code className="kz-build-code">npm install {tsPackages[0] ?? "@krizaka/…"}</code> : tsPackages.length ? <CodeBlock code={install} language="bash" file="terminal" copyLabel={s.java.copy} copiedLabel={s.java.copied} /> : null}
        </Tile>
      </ul>
  );
}

/** « Build with our open source », on the home, after the products. */
export default function OpenStack({ locale }: { locale: string; mavenArtifacts?: number }) {
  const s = getDictionary(locale).site.home.stack;
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
      <StackTiles locale={locale} compact />
    </Section>
  );
}

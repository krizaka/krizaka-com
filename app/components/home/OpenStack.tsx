/* The open source section — one component wherever the stack is shown (the home, /open-source, /story).
   The home (`compact`, Oussama 2026-10-23): per tile the host, the name, one line, one still picture and one link —
   nothing to copy or set. The code, the versions and the playground's settings live on /open-source only.
   /open-source and /story: the full cards — the examples, the facts, the copy buttons.
   Versions and figures are read at build (lib/registry-versions.ts); hosts come from lib/stack.ts. */

import type { ReactNode } from "react";
import { ForwardIcon } from "@krizaka/icons";
import { Badge } from "@krizaka/ui/badge";
import { CardGrid } from "@krizaka/ui/card-grid";
import { cn } from "@krizaka/ui/cn";
import { CodeBlock, CodeTabs } from "@krizaka/ui/code-block";
import { Facts, Section, type Fact } from "@krizaka/ui/page";
import { format, getDictionary } from "@/lib/i18n";
import { mavenModuleIds, mavenVersion, npmDownloads, npmPackagesFrom, publishedVersion } from "@/lib/registry-versions";
import ButtonLink from "@/app/components/ButtonLink";
import { MOTION_LAB, STACK, hostOf, type StackPart } from "@/lib/stack";
import MotionPlayground from "./playground/MotionPlayground";
import UiShowcase from "./playground/UiShowcase";
import "./stack-tiles.css";

/** One tile of the grid: its host, its name, one line, the picture (or the thing to try), its facts, the way to its site.
    The grid cell stretches it to the row's height; the action sits at the foot. */
function Tile({ name, meta, line, children, facts, href, cta, compact }: { name: string; meta: string; line: string; children: ReactNode; facts: Fact[]; href: string; cta: string; compact?: boolean }) {
  return (
    <div className="kz-build-tile">
      <p className="kz-build-meta">{meta}</p>
      <h3 className="kz-build-name">{name}</h3>
      <p className="kz-build-line">{line}</p>
      <div className={compact ? "kz-build-still" : "kz-build-try"} aria-hidden={compact || undefined} inert={compact || undefined}>
        {children}
      </div>
      {!compact && facts.length > 0 && <Facts items={facts} />}
      <ButtonLink href={href} variant="secondary" size="md" className="kz-build-cta">
        {cta} <ForwardIcon size={14} />
      </ButtonLink>
    </div>
  );
}

/* How many names the still picture of a set of packages shows: what fits its box on two or three lines. */
const CLOUD_MAX = 9;

/** The home's still picture of a set of packages: their real names, read at build — never a version, never a command.
    The quiet marks when the registry could not be read at build. */
function Cloud({ names, mark }: { names: string[]; mark: "java" | "ts" }) {
  if (names.length === 0) {
    return (
      <div className={cn("kz-build-still-mark", mark === "java" ? "kz-build-java-mark" : "kz-build-ts-mark")}>
        <span />
        <span />
        <span />
      </div>
    );
  }
  return (
    <div className="kz-build-cloud">
      {names.slice(0, CLOUD_MAX).map((name) => (
        <Badge key={name} tone="neutral" size="md">
          {name}
        </Badge>
      ))}
    </div>
  );
}

const ui = STACK.find((p): p is StackPart & { coordinate: string } => p.id === "ui")!;
const java = STACK.find((p) => p.id === "java")!;
const ts = STACK.find((p) => p.id === "ts")!;

/** The four tiles — Krizaka UI, Krizaka Motion, Krizaka Java, Krizaka TypeScript — in a CardGrid (every tile of a row as
    tall as the tallest). `compact` (the home): the name, one line, one still picture of one fixed height, one link.
    Without it (/open-source, /story): the full cards, with examples, facts and copy buttons. */
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
    <CardGrid as="ul" className={compact ? "kz-build kz-build-compact" : "kz-build"} min={420} columns={2} reveal={!compact}>
      <Tile
        key="ui"
        compact={compact}
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
            downloads: !compact && downloads.weekly !== undefined ? format(s.ui.downloads, { count: fmt.format(downloads.weekly) }) : undefined,
          }}
        />
      </Tile>
      <Tile key="motion" compact={compact} name={MOTION_LAB.name} meta={hostOf(MOTION_LAB.url)} line={s.motion.line} href={MOTION_LAB.labUrl} cta={s.motion.lab} facts={uiVersion ? [{ label: `@krizaka/ui/engine-flow ${uiVersion}`, tone: "ok" }] : []}>
        <MotionPlayground still={compact} w={{ label: s.motion.label, hint: s.motion.hint, hub: s.motion.hub, app: s.motion.app, layout: s.motion.layout, layouts: s.motion.layouts, mode: s.motion.mode, modes: s.motion.modes }} />
      </Tile>
      <Tile key="java" compact={compact} name={java.name} meta={hostOf(java.url)} line={s.java.line} href={java.url} cta={s.java.explore} facts={bom ? [{ label: `krizaka-bom ${bom}`, tone: "ok" }] : []}>
        {compact ? (
          <Cloud names={mavenModuleIds()} mark="java" />
        ) : (
          <CodeTabs
            label={s.java.tool}
            tabs={[
              { id: "maven", label: "Maven", content: <CodeBlock code={maven} language="xml" file="pom.xml" copyLabel={s.java.copy} copiedLabel={s.java.copied} /> },
              { id: "gradle", label: "Gradle", content: <CodeBlock code={gradle} language="kotlin" file="build.gradle.kts" copyLabel={s.java.copy} copiedLabel={s.java.copied} /> },
            ]}
          />
        )}
      </Tile>
      <Tile key="ts" compact={compact} name={ts.name} meta={hostOf(ts.url)} line={s.ts.line} href={ts.url} cta={s.ts.explore} facts={tsPackages.length ? [{ label: format(s.facts.npm, { count: tsPackages.length }), tone: "ok" }, { label: "Apache-2.0" }] : []}>
        {compact ? <Cloud names={tsPackages} mark="ts" /> : tsPackages.length ? <CodeBlock code={install} language="bash" file="terminal" copyLabel={s.java.copy} copiedLabel={s.java.copied} /> : null}
      </Tile>
    </CardGrid>
  );
}

/** « Build with our open source », on the home, after the engine: the short version, one link per tile. */
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

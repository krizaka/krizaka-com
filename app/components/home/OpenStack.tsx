/* The open-source stack's full cards — Krizaka UI, Krizaka Lab, Krizaka Java, Krizaka TypeScript — on /open-source and
   /story, in a CardGrid, with the examples, the facts and the copy buttons. The home no longer carries the libraries
   (Oussama, 2026-10-26: « merge them with the open source view, it lightens the page »): they live here, one place.
   Versions and figures are read at build (lib/registry-versions.ts); hosts come from lib/stack.ts. */

import type { ReactNode } from "react";
import { ForwardIcon } from "@krizaka/icons";
import { CardGrid } from "@krizaka/ui/card-grid";
import { CodeBlock, CodeTabs } from "@krizaka/ui/code-block";
import { Facts, type Fact } from "@krizaka/ui/page";
import { format, getDictionary } from "@/lib/i18n";
import { mavenVersion, npmDownloads, npmPackagesFrom, publishedVersion } from "@/lib/registry-versions";
import ButtonLink from "@/app/components/ButtonLink";
import { STACK, STACK_LICENCE, hostOf, stackActionUrl, type StackPart } from "@/lib/stack";
import MotionPlayground from "./playground/MotionPlayground";
import UiShowcase from "./playground/UiShowcase";
import "./stack-tiles.css";

/** One tile of the grid (/open-source, /story): its host, its name, one line, the thing to try or to copy, its facts, the
    way to its site. The grid cell stretches it to the row's height; the action sits at the foot. */
function Tile({
  name,
  meta,
  line,
  children,
  facts,
  href,
  cta,
}: {
  name: string;
  meta: string;
  line: string;
  children: ReactNode;
  facts: Fact[];
  href: string;
  cta: string;
}) {
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

/** The four full cards — Krizaka UI, Krizaka Lab, Krizaka Java, Krizaka TypeScript — in a CardGrid (every tile of a row as
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
        facts={[
          uiVersion ? { label: `@krizaka/ui ${uiVersion}`, tone: "ok" } : false,
          { label: s.facts.platforms },
        ].filter((f): f is Fact => Boolean(f))}
      >
        <UiShowcase
          w={{
            ...s.ui.showcase,
            downloads:
              downloads.weekly !== undefined
                ? format(s.ui.downloads, { count: fmt.format(downloads.weekly) })
                : undefined,
          }}
        />
      </Tile>
      <Tile
        key="motion"
        name={motion.name}
        meta={hostOf(motion.url)}
        line={s.motion.line}
        href={stackActionUrl(motion)}
        cta={s.motion.lab}
        facts={uiVersion ? [{ label: `@krizaka/ui/engine-flow ${uiVersion}`, tone: "ok" }] : []}
      >
        <MotionPlayground
          w={{
            label: s.motion.label,
            hint: s.motion.hint,
            hub: s.motion.hub,
            app: s.motion.app,
            layout: s.motion.layout,
            layouts: s.motion.layouts,
            mode: s.motion.mode,
            modes: s.motion.modes,
          }}
        />
      </Tile>
      <Tile
        key="java"
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
            {
              id: "maven",
              label: "Maven",
              content: (
                <CodeBlock
                  code={maven}
                  language="xml"
                  file="pom.xml"
                  copyLabel={s.java.copy}
                  copiedLabel={s.java.copied}
                />
              ),
            },
            {
              id: "gradle",
              label: "Gradle",
              content: (
                <CodeBlock
                  code={gradle}
                  language="kotlin"
                  file="build.gradle.kts"
                  copyLabel={s.java.copy}
                  copiedLabel={s.java.copied}
                />
              ),
            },
          ]}
        />
      </Tile>
      <Tile
        key="ts"
        name={ts.name}
        meta={hostOf(ts.url)}
        line={s.ts.line}
        href={ts.url}
        cta={s.ts.explore}
        facts={
          tsPackages.length
            ? [{ label: format(s.facts.npm, { count: tsPackages.length }), tone: "ok" }, { label: STACK_LICENCE }]
            : []
        }
      >
        {tsPackages.length ? (
          <CodeBlock
            code={install}
            language="bash"
            file="terminal"
            copyLabel={s.java.copy}
            copiedLabel={s.java.copied}
          />
        ) : null}
      </Tile>
    </CardGrid>
  );
}

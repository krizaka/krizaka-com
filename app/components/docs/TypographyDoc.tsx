import type { CSSProperties } from "react";
import type { TOCItemType } from "fumadocs-core/toc";
import { CodeBlock } from "./ExamplePreview";
import { InlineCode } from "./InlineCode";
import { format, getDictionary, type Locale, type TranslationDictionary } from "@/lib/i18n";
import { KRIZAKA_UI_REPO_URL } from "@/lib/site";
import { fonts, rules, typeScale } from "@/lib/ui-foundations";
import { packageVersion } from "@/lib/package-version";

/* /docs/ui/typography, generated from the packages: the families and their words from @krizaka/fonts (`fonts`,
   `rules`), the scale from @krizaka/tokens (`typeScale`). Every sample is set with the tokens themselves
   (var(--kz-font-*), var(--kz-type-*)), so the page shows what an app gets. The chrome and the sample sentences are
   messages. Server Component. */

const ROLE_FONT = { display: "var(--kz-font-display)", text: "var(--kz-font-text)", mono: "var(--kz-font-mono)" } as const;

const WEB_INSTALL = "npm install @krizaka/fonts @krizaka/tokens @krizaka/tailwind";
const WEB_CSS = `@import "tailwindcss";
@import "@krizaka/tailwind";   /* --kz-font-* and text-display-xl, text-body-md… */
@import "@krizaka/fonts/css";  /* the faces and their adjusted fallbacks */`;
const WEB_HTML = `<h1 class="font-display text-display-xl">…</h1>
<p class="font-text text-body-md text-fg-secondary">…</p>
<span class="font-mono text-overline uppercase">…</span>`;
const NEXT = `// app/layout.tsx
import "@krizaka/fonts/css";
import "./globals.css"; // @import "tailwindcss"; @import "@krizaka/tailwind";`;
const NATIVE = `// npx expo install expo-font && npm install @krizaka/fonts @krizaka/tokens
import { useFonts } from "expo-font";
import { fontAssets } from "@krizaka/fonts/native/assets";
import { fontFamily } from "@krizaka/fonts/native";
import { typeScale } from "@krizaka/tokens/native";

const [loaded] = useFonts(fontAssets);
const { role, fontWeight, ...size } = typeScale.displayLg;
<Text style={{ ...size, fontFamily: fontFamily(role, Number(fontWeight)) }}>…</Text>`;

export function typographyToc(t: TranslationDictionary): TOCItemType[] {
  const c = t.docs.foundations;
  return [
    ["families", c.typography.families],
    ["scale", c.typography.scale],
    ["installation", c.installation],
    ["rules", c.typography.rules],
    ["licences", c.typography.licences],
  ].map(([id, title]) => ({ title, url: `#${id}`, depth: 2 }));
}

/** A step of the scale as inline style: the tokens, so the sample follows the package. */
const stepStyle = (name: string, role: keyof typeof ROLE_FONT): CSSProperties => ({
  fontFamily: ROLE_FONT[role],
  fontSize: `var(--kz-type-${name}-size)`,
  lineHeight: `var(--kz-type-${name}-line-height)`,
  fontWeight: `var(--kz-type-${name}-weight)` as CSSProperties["fontWeight"],
  letterSpacing: `var(--kz-type-${name}-tracking)`,
  textTransform: name === "overline" ? "uppercase" : undefined,
});

export function TypographyDoc({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const c = t.docs.foundations;
  const ty = c.typography;
  const sample = (role: keyof typeof ROLE_FONT) => (role === "display" ? ty.headline : role === "mono" ? ty.code : ty.paragraph);

  return (
    <>
      <h2 id="families">{ty.families}</h2>
      <div className="kz-type-families not-prose">
        {fonts.map((font) => (
          <article key={font.role} className="kz-type-family" aria-labelledby={`family-${font.role}`}>
            <header>
              <span className="kz-chip-meta" data-tone="accent">
                {ty.roles[font.role]}
              </span>
              <code>{font.token}</code>
            </header>
            <h3 id={`family-${font.role}`} style={{ fontFamily: ROLE_FONT[font.role] }}>
              {font.family}
            </h3>
            <p className="kz-type-meta">
              {format(ty.meta, { designer: font.designer, min: font.weights.min, max: font.weights.max, version: font.version })}
            </p>
            <p className="kz-type-glyphs" style={{ fontFamily: ROLE_FONT[font.role] }} aria-hidden>
              {ty.glyphs}
            </p>
            <p className="kz-type-sample" style={{ fontFamily: ROLE_FONT[font.role], fontWeight: font.role === "display" ? 800 : 400 }}>
              {sample(font.role)}
            </p>
            <p lang="en">
              <InlineCode text={font.description} />
            </p>
            <dl className="kz-type-dl">
              <dt>{ty.why}</dt>
              <dd lang="en">
                <InlineCode text={font.why} />
              </dd>
              <dt>{ty.use}</dt>
              <dd>
                <ul>
                  {font.use.map((text) => (
                    <li key={text}>
                      <InlineCode text={text} />
                    </li>
                  ))}
                </ul>
              </dd>
              <dt>{ty.avoid}</dt>
              <dd>
                <ul>
                  {font.avoid.map((text) => (
                    <li key={text}>
                      <InlineCode text={text} />
                    </li>
                  ))}
                </ul>
              </dd>
            </dl>
            <p className="kz-type-meta">{format(ty.fallback, { fallback: font.fallback.local[0], size: font.fallback.sizeAdjust })}</p>
          </article>
        ))}
      </div>

      <h2 id="scale">{ty.scale}</h2>
      <ol className="kz-type-scale not-prose">
        {typeScale.map((step) => (
          <li key={step.name}>
            <div className="kz-type-step-meta">
              <code>text-{step.name}</code>
              <span>
                {step.size} / {step.lineHeight} · {step.weight} · {step.tracking}
              </span>
              <span>{ty.roles[step.role]}</span>
            </div>
            <p style={stepStyle(step.name, step.role)}>{step.role === "mono" ? ty.code : step.role === "display" ? ty.headline : ty.paragraph}</p>
            <p className="kz-type-meta" lang="en">
              {step.description}
            </p>
          </li>
        ))}
      </ol>
      <div className="kz-table-scroll not-prose" tabIndex={0} role="region" aria-label={ty.scale}>
        <table className="kz-table">
          <thead>
            <tr>
              <th scope="col">{ty.utility}</th>
              <th scope="col">{ty.family}</th>
              <th scope="col">{ty.values}</th>
            </tr>
          </thead>
          <tbody>
            {typeScale.map((step) => (
              <tr key={step.name}>
                <th scope="row">
                  <code>text-{step.name}</code>
                </th>
                <td>{ty.roles[step.role]}</td>
                <td>
                  {step.size} / {step.lineHeight} · {step.weight} · {step.tracking}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="installation">{c.installation}</h2>
      <h3 id="install-web">{ty.web}</h3>
      <p>{ty.webIntro}</p>
      <CodeBlock code={WEB_INSTALL} lang="bash" />
      <CodeBlock code={WEB_CSS} lang="css" />
      <CodeBlock code={WEB_HTML} lang="html" />
      <h3 id="install-next">{ty.next}</h3>
      <p>{ty.nextIntro}</p>
      <CodeBlock code={NEXT} lang="tsx" />
      <h3 id="install-native">{ty.native}</h3>
      <p>{ty.nativeIntro}</p>
      <CodeBlock code={NATIVE} lang="tsx" />

      <h2 id="rules">{ty.rules}</h2>
      <ul lang="en">
        {rules.map((text) => (
          <li key={text}>
            <InlineCode text={text} />
          </li>
        ))}
      </ul>

      <h2 id="licences">{ty.licences}</h2>
      <p>{ty.licenceIntro}</p>
      <div className="kz-table-scroll not-prose" tabIndex={0} role="region" aria-label={ty.licences}>
        <table className="kz-table">
          <thead>
            <tr>
              <th scope="col">{ty.family}</th>
              <th scope="col">{ty.licence}</th>
              <th scope="col">{ty.files}</th>
              <th scope="col">{ty.upstream}</th>
            </tr>
          </thead>
          <tbody>
            {fonts.map((font) => (
              <tr key={font.role}>
                <th scope="row">{font.family}</th>
                <td>
                  <a href={`${KRIZAKA_UI_REPO_URL}/blob/main/packages/fonts/${font.license.file}`}>{font.license.name}</a>
                </td>
                <td>
                  {format(ty.web_files, {
                    count: font.web.length,
                    size: (font.web.find((w) => w.subset === "latin")!.bytes / 1024).toFixed(1),
                  })}
                  {" · "}
                  {format(ty.native_files, { count: font.native.length })}
                </td>
                <td>
                  <a href={font.upstream.project}>{font.upstream.project.replace("https://github.com/", "")}</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="kz-component-source not-prose">
        <span>{format(c.source, { packages: `@krizaka/fonts@${packageVersion("fonts")} · @krizaka/tokens@${packageVersion("tokens")}` })}</span>
        <a href={`${KRIZAKA_UI_REPO_URL}/tree/main/packages/fonts`}>{c.edit}</a>
      </p>
    </>
  );
}

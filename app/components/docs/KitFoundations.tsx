import type { CSSProperties } from "react";
import type { TOCItemType } from "fumadocs-core/toc";
import { CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@krizaka/ui/badge";
import { Button } from "@krizaka/ui/button";
import { cn } from "@krizaka/ui/cn";
import { format, getDictionary, type Locale, type TranslationDictionary } from "@/lib/i18n";
import { type FoundationContrast, type FoundationRole, getKitFoundations, type ProductKit } from "@/lib/ui-registry";
import { CodeBlock } from "./ExamplePreview";
import { InlineCode } from "./InlineCode";

/* The foundations of a product's kit (/docs/<product>/ui/foundations), generated from its registry/foundations.json —
   itself read from the kit's theme.css and @krizaka/tokens at the kit's build: the palette in both modes (where each
   role comes from), the WCAG contrasts, the named themes drawn live in their own scope, the product tokens, the
   typography, the icons and the product rules quoted from the contracts. The swatches paint the values of that data;
   nothing here is a colour of the site. Server Component. */

const RANK: Record<FoundationRole["source"], number> = { platform: 0, base: 0, brand: 1, kit: 2 };

export function foundationsToc(kit: ProductKit, t: TranslationDictionary): TOCItemType[] {
  const k = t.docs.kit;
  const f = getKitFoundations(kit);
  const entries: [string, string | false][] = [
    ["palette", k.paletteTitle],
    ["contrasts", k.contrastsTitle],
    ["named-themes", f.namedThemes.length > 0 && k.namedTitle],
    ["tokens", k.tokensTitle],
    ["typography", k.typographyTitle],
    ["icons", k.iconsTitle],
    ["rules", k.rulesTitle],
    ["native", k.nativeTitle],
  ];
  return entries.filter(([, title]) => title).map(([id, title]) => ({ title, url: `#${id}`, depth: 2 }));
}

/** A value as painted: its colour (from the kit's data) on a chip, and its text. */
function Swatch({ role }: { role: FoundationRole | undefined }) {
  if (!role) return null;
  return (
    <span className="kz-swatch">
      <span className="kz-swatch-chip" style={{ "--kz-swatch": role.value } as CSSProperties} aria-hidden />
      <code>{role.hex ?? role.value}</code>
    </span>
  );
}

function Verdict({ contrast, t }: { contrast: FoundationContrast | undefined; t: TranslationDictionary }) {
  if (!contrast) return <span aria-hidden>—</span>;
  const ok = contrast.ratio >= contrast.min;
  return (
    <span className="kz-contrast" data-ok={ok}>
      {ok ? <CheckCircle2 size={14} aria-hidden /> : <XCircle size={14} aria-hidden />}
      {contrast.ratio.toFixed(2)}:1
      <span className="sr-only">{ok ? t.docs.kit.pass : t.docs.kit.fail}</span>
    </span>
  );
}

export function KitFoundations({ kit, locale }: { kit: ProductKit; locale: Locale }) {
  const t = getDictionary(locale);
  const k = t.docs.kit;
  const f = getKitFoundations(kit);
  const { dark, light } = f.modes;
  const lightOf = (role: string) => light.roles.find((r) => r.role === role);
  const pairs = dark.contrasts.map((c) => ({ ...c, inLight: light.contrasts.find((l) => l.fg === c.fg && l.bg === c.bg) }));
  const scheme = (id: string) => cn("kz-kit-scope", "kz-kit-" + kit + "-" + id);

  return (
    <>
      <p>
        <strong>{f.theme}.</strong> <InlineCode text={f.summary} />
      </p>

      <h2 id="palette">{k.paletteTitle}</h2>
      <p>{k.paletteLead}</p>
      <div className="kz-table-scroll not-prose" tabIndex={0} role="region" aria-label={k.paletteTitle}>
        <table className="kz-table kz-palette">
          <thead>
            <tr>
              <th scope="col">{k.role}</th>
              <th scope="col">{dark.name}</th>
              <th scope="col">{light.name}</th>
              <th scope="col">{k.setBy}</th>
            </tr>
          </thead>
          <tbody>
            {dark.roles.map((role) => {
              const other = lightOf(role.role);
              // The layer that sets the role in either mode: the kit over the brand over the platform.
              const source = [role.source, other?.source ?? "platform"].sort((a, b) => RANK[b] - RANK[a])[0];
              return (
                <tr key={role.role}>
                  <th scope="row">
                    <code>--kz-{role.role}</code>
                    {(role.note ?? other?.note) && <span className="kz-palette-note">{role.note ?? other?.note}</span>}
                  </th>
                  <td>
                    <Swatch role={role} />
                  </td>
                  <td>
                    <Swatch role={other} />
                  </td>
                  <td>
                    <span className="kz-chip-meta" data-tone={source === "platform" ? undefined : "accent"}>
                      {k.sources[source]}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <h2 id="contrasts">{k.contrastsTitle}</h2>
      <p>{k.contrastsLead}</p>
      <div className="kz-table-scroll not-prose" tabIndex={0} role="region" aria-label={k.contrastsTitle}>
        <table className="kz-table">
          <thead>
            <tr>
              <th scope="col">{k.pair}</th>
              <th scope="col">{k.dark}</th>
              <th scope="col">{k.light}</th>
              <th scope="col">{k.minimum}</th>
            </tr>
          </thead>
          <tbody>
            {pairs.map((pair) => (
              <tr key={`${pair.fg}/${pair.bg}`}>
                <th scope="row">
                  <code>{pair.fg}</code> {k.on} <code>{pair.bg}</code>
                </th>
                <td>
                  <Verdict contrast={pair} t={t} />
                </td>
                <td>
                  <Verdict contrast={pair.inLight} t={t} />
                </td>
                <td>{pair.min}:1</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {f.namedThemes.length > 0 && (
        <>
          <h2 id="named-themes">{k.namedTitle}</h2>
          <p>{k.namedLead}</p>
          <ul className="kz-named-themes not-prose">
            {f.namedThemes.map((theme) => {
              const lowest = Math.min(...theme.contrasts.map((c) => c.ratio));
              const passed = theme.contrasts.filter((c) => c.ratio >= c.min).length;
              return (
                <li key={theme.id}>
                  <div className={scheme(theme.id)}>
                    <div className="kz-named-sample">
                      <span className="kz-named-title">{theme.name}</span>
                      <Badge tone="success" dot>
                        {k.sampleTitle}
                      </Badge>
                      <span className="kz-named-text">{k.sampleText}</span>
                      <span className="kz-named-actions">
                        <Button variant="primary" size="sm">
                          {k.samplePrimary}
                        </Button>
                        <Button variant="secondary" size="sm">
                          {k.sampleSecondary}
                        </Button>
                      </span>
                    </div>
                  </div>
                  <p>
                    <code>.theme-{theme.id}</code> — {theme.use}
                  </p>
                  <p className="kz-docs-note">{format(k.namedPass, { passed, total: theme.contrasts.length, lowest: lowest.toFixed(2) })}</p>
                </li>
              );
            })}
          </ul>
        </>
      )}

      <h2 id="tokens">{k.tokensTitle}</h2>
      <p>{k.tokensLead}</p>
      <div className="kz-table-scroll not-prose" tabIndex={0} role="region" aria-label={k.tokensTitle}>
        <table className="kz-table">
          <thead>
            <tr>
              <th scope="col">{k.token}</th>
              <th scope="col">{k.value}</th>
              <th scope="col">{k.use}</th>
            </tr>
          </thead>
          <tbody>
            {f.productTokens.map((token) => (
              <tr key={token.name}>
                <th scope="row">
                  <code>{token.name}</code>
                </th>
                <td>
                  <code>{token.value}</code>
                </td>
                <td>{token.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {f.typeScale && f.typeScale.length > 0 && (
        <>
          <h3 id="type-scale">{k.typeScaleTitle}</h3>
          <div className="kz-table-scroll not-prose" tabIndex={0} role="region" aria-label={k.typeScaleTitle}>
            <table className="kz-table">
              <tbody>
                {f.typeScale.map((step) => (
                  <tr key={step.name}>
                    <th scope="row">
                      <code>{step.name}</code>
                    </th>
                    <td>
                      <code>{step.value}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <h2 id="typography">{k.typographyTitle}</h2>
      <div className="kz-table-scroll not-prose" tabIndex={0} role="region" aria-label={k.typographyTitle}>
        <table className="kz-table">
          <thead>
            <tr>
              <th scope="col">{k.role}</th>
              <th scope="col">{k.family}</th>
              <th scope="col">{k.token}</th>
              <th scope="col">{k.use}</th>
            </tr>
          </thead>
          <tbody>
            {f.typography.map((face) => (
              <tr key={face.role}>
                <th scope="row">{face.role}</th>
                <td>{face.family}</td>
                <td>
                  <code>{face.token}</code>
                </td>
                <td>
                  <InlineCode text={face.use} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="icons">{k.iconsTitle}</h2>
      <ul>
        {f.icons.map((icon) => (
          <li key={icon.name}>
            <code>{icon.name}</code> ({icon.from}) — <InlineCode text={icon.use} />
          </li>
        ))}
      </ul>

      <h2 id="rules">{k.rulesTitle}</h2>
      <p>{k.rulesLead}</p>
      <ul className="kz-kit-rules not-prose">
        {f.rules.map((rule) => (
          <li key={rule.title}>
            <span className="kz-kit-rule-title">{rule.title}</span>
            <span className="kz-kit-rule-text">
              <InlineCode text={rule.text} />
            </span>
            <a href={rule.source.url} className="kz-kit-rule-source">
              {rule.source.label}
            </a>
          </li>
        ))}
      </ul>

      <h2 id="native">{k.nativeTitle}</h2>
      <p>
        <InlineCode text={f.native.summary} />
      </p>
      <CodeBlock code={f.native.code} lang="tsx" />
    </>
  );
}

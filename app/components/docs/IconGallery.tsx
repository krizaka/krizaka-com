"use client";

import { useId, useMemo, useState } from "react";
import * as Icons from "@krizaka/icons";
import { format } from "@krizaka/i18n";
import type { IconEntry } from "@/lib/ui-foundations";
import { useI18n } from "../I18nProvider";

/* The gallery of /docs/ui/icons: every icon of @krizaka/icons, searchable by name and meaning (the keywords written
   beside each drawing), filtered by group. Choosing one shows it at the four sizes of the guidelines, with its node in
   the text colour or the brand accent, and copies its import for React or React Native. The list comes from the
   server (glyphIndex); the drawings are the package's own components. */

type IconComponent = Icons.Icon;
const SIZES = [16, 20, 24, 32] as const;

const lookup = (component: string) => (Icons as unknown as Record<string, IconComponent | undefined>)[component];

export function IconGallery({ icons, groups }: { icons: IconEntry[]; groups: { id: string; title: string }[] }) {
  const { t } = useI18n();
  const c = t.docs.foundations.icons;
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("all");
  const [selected, setSelected] = useState(icons[0]?.name ?? "");
  const [accent, setAccent] = useState(true);
  const [copied, setCopied] = useState<"react" | "native" | null>(null);
  const searchId = useId();

  const shown = useMemo(() => {
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return icons.filter(
      (icon) =>
        (group === "all" || icon.group === group) &&
        words.every((w) => icon.name.toLowerCase().includes(w) || icon.component.toLowerCase().includes(w) || icon.keywords.includes(w)),
    );
  }, [icons, query, group]);

  // The selected icon, or the first one the search shows: the detail never describes an icon the grid hides.
  const current = shown.find((icon) => icon.name === selected) ?? shown[0];
  const Current = current && lookup(current.component);
  const nodeColor = accent ? "var(--kz-accent)" : undefined;
  const imports = current && {
    react: `import { ${current.component} } from "@krizaka/icons";`,
    native: `import { ${current.component} } from "@krizaka/icons/native";`,
  };

  async function copy(kind: "react" | "native") {
    if (!imports) return;
    try {
      await navigator.clipboard.writeText(imports[kind]);
      setCopied(kind);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      setCopied(null);
    }
  }

  return (
    <section className="kz-icons not-prose" aria-labelledby="icon-set">
      <h2 id="icon-set" className="sr-only">
        {c.set}
      </h2>
      <div className="kz-icons-tools">
        <label htmlFor={searchId} className="sr-only">
          {c.search}
        </label>
        <input
          id={searchId}
          type="search"
          className="kz-icons-search"
          placeholder={format(c.placeholder, { count: icons.length })}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
          spellCheck={false}
        />
        <div className="kz-icons-groups" role="group" aria-label={c.groupsLabel}>
          {[{ id: "all", title: c.all }, ...groups].map((g) => (
            <button key={g.id} type="button" aria-pressed={group === g.id} onClick={() => setGroup(g.id)}>
              {g.title}
            </button>
          ))}
        </div>
      </div>

      <p className="kz-icons-count" aria-live="polite">
        {shown.length ? format(c.count, { count: shown.length }) : format(c.none, { query })}
      </p>

      <div className="kz-icons-layout">
        <ul className="kz-icons-grid">
          {shown.map((icon) => {
            const Icon = lookup(icon.component);
            return (
              <li key={icon.name}>
                <button
                  type="button"
                  aria-pressed={icon.name === current?.name}
                  onClick={() => setSelected(icon.name)}
                  title={icon.keywords}
                >
                  {Icon && <Icon size={24} nodeColor={nodeColor} />}
                  <span>{icon.component.replace(/Icon$/, "")}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {current && Current && imports && (
          <aside className="kz-icons-detail" aria-label={c.selected}>
            <p className="kz-icons-name">
              <code>{current.component}</code>
            </p>
            <p className="kz-icons-keywords" lang="en">
              {current.keywords}
            </p>
            <p className="kz-icons-label">{c.sizes}</p>
            <div className="kz-icons-sizes">
              {SIZES.map((size) => (
                <figure key={size}>
                  <Current size={size} strokeWidth={size >= 32 ? 1.5 : undefined} nodeColor={nodeColor} />
                  <figcaption>{size}</figcaption>
                </figure>
              ))}
            </div>
            <p className="kz-icons-label">{c.node}</p>
            <div className="kz-icons-groups" role="group" aria-label={c.node}>
              <button type="button" aria-pressed={!accent} onClick={() => setAccent(false)}>
                {c.nodeText}
              </button>
              <button type="button" aria-pressed={accent} onClick={() => setAccent(true)}>
                {c.nodeAccent}
              </button>
            </div>
            <pre className="kz-icons-code">
              <code>{imports.react}</code>
            </pre>
            <div className="kz-icons-actions">
              <button type="button" onClick={() => copy("react")}>
                {copied === "react" ? c.copied : c.copyReact}
              </button>
              <button type="button" onClick={() => copy("native")}>
                {copied === "native" ? c.copied : c.copyNative}
              </button>
            </div>
            <span className="sr-only" aria-live="polite">
              {copied ? c.copied : ""}
            </span>
          </aside>
        )}
      </div>
    </section>
  );
}

import path from "node:path";
import { readFileSync } from "node:fs";
import Image from "next/image";
import Link from "next/link";
import { getDictionary, type Locale } from "@/lib/i18n";
import { UI_EXAMPLES, type UiExampleKey } from "@/lib/ui-examples";
import { examplePropsOf } from "@/lib/ui-example-props";
import { getRegistryItem } from "@/lib/ui-registry";
import { MapAssets } from "./MapAssets";

/* The strip under the intro of /docs/ui: real components, rendered by the page — the same code the component pages show —
   so the page opens on what it documents: the signature button, a date picker, a profile card, a chart, a map, and a
   phone. Server-rendered (static first); each one links to its page. The map is its static form (no engine), the phone a
   screenshot of its story in both themes (React Native has no live preview on the web). */
const LIVE: { key: UiExampleKey; component: string }[] = [
  { key: "button/signature", component: "button" },
  { key: "date-picker/day-strip", component: "date-picker" },
  { key: "profile-card/creator", component: "profile-card" },
  { key: "charts/line-chart/creator-earnings", component: "line-chart" },
  { key: "map/static", component: "map" },
  { key: "vertical-video/rail", component: "vertical-video" },
];
const PHONE = { component: "loader", example: "job-wait" };

function pngSize(file: string): { width: number; height: number } {
  const header = readFileSync(file).subarray(16, 24);
  return { width: header.readUInt32BE(0), height: header.readUInt32BE(4) };
}

export async function ComponentHero({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).docs.ia.catalog;
  const live = await Promise.all(
    LIVE.map(async ({ key, component }) => {
      const { default: Example } = await UI_EXAMPLES[key]();
      return { key, component, title: getRegistryItem(component).title, Example };
    }),
  );
  const phone = getRegistryItem(PHONE.component);
  const shot = phone.native?.examples.find((example) => example.name === PHONE.example)?.screenshots;
  const file = (theme: "dark" | "light") => (shot ? shot[theme].replace(/^examples\//, "") : "");
  return (
    <section aria-labelledby="hero-strip-title" className="not-prose">
      <h2 id="hero-strip-title" className="sr-only">
        {t.heroLabel}
      </h2>
      <p className="kz-docs-note">{t.heroLead}</p>
      <ul className="kz-hero-strip">
        {live.map(({ key, component, title, Example }) => (
          <li key={key}>
            <Link href={`/${locale}/docs/ui/${component}`} className="kz-hero-strip-label">
              {title}
            </Link>
            <div className="kz-hero-strip-stage">
              {key.startsWith("map/") ? <MapAssets /> : null}
              <Example {...examplePropsOf(key)} />
            </div>
          </li>
        ))}
        {shot && (
          <li>
            <Link href={`/${locale}/docs/ui/${PHONE.component}`} className="kz-hero-strip-label">
              {phone.title} · {getDictionary(locale).docs.component.platforms.native}
            </Link>
            <div className="kz-hero-strip-stage">
              {(["dark", "light"] as const).map((theme) => (
                <Image
                  key={theme}
                  src={`/ui-examples/${file(theme)}`}
                  alt={theme === "dark" ? `${phone.title}, ${getDictionary(locale).docs.component.platforms.native}` : ""}
                  aria-hidden={theme === "light" ? true : undefined}
                  {...pngSize(path.join(process.cwd(), "public", "ui-examples", file(theme)))}
                  className={theme === "dark" ? "kz-shot kz-shot-dark" : "kz-shot kz-shot-light"}
                  priority={theme === "dark"}
                />
              ))}
            </div>
          </li>
        )}
      </ul>
    </section>
  );
}

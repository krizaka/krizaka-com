// Every page declares its template (lib/page-templates.ts): a page of app/[locale] that is missing from the map — or
// an entry with no page left — fails `npm run lint`. Node's type stripping reads the TypeScript map as it is.
import { readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const APP = join(ROOT, "app", "[locale]");
const { PAGE_TEMPLATES } = await import(join(ROOT, "lib", "page-templates.ts"));

const routes = readdirSync(APP, { recursive: true })
  .filter((file) => file.endsWith(`${sep}page.tsx`) || file === "page.tsx")
  .map((file) => "/" + relative(".", file).split(sep).slice(0, -1).join("/"))
  .map((route) => (route === "/" ? "/" : route.replace(/\/$/, "")))
  .sort();

const declared = new Set(Object.keys(PAGE_TEMPLATES));
const missing = routes.filter((route) => !declared.has(route));
const stale = [...declared].filter((route) => !routes.includes(route));
for (const route of missing) console.error(`✗ ${route}: no template — declare it in lib/page-templates.ts`);
for (const route of stale) console.error(`✗ ${route}: declared in lib/page-templates.ts, but no page`);
if (missing.length || stale.length) process.exit(1);
console.log(`✓ page templates: ${routes.length} pages, each on its template`);

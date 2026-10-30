/**
 * The site's environment — one module. `ENV_VARS` declares every variable krizaka.com and its scripts read: its bounded
 * context, whether production needs it, whether it is a secret, a zod schema and what it does. Names follow the
 * Krizaka convention (krizaka/.github#46): `<CONTEXT>_<THING>`, never a product nor a vendor — a vendor is a value
 * (`MAIL_PROVIDER=mailgun`); `NEXT_PUBLIC_` only where the browser needs it. README's table is generated from this
 * list (`npm run docs:env`, checked by `npm test`); tests/env.test.mjs refuses an undeclared or misnamed variable.
 * The contact form is fail-closed: without a delivery channel it answers 503 (lib/contact.ts).
 */
import { z } from "zod";

export const ENV_CONTEXTS = {
  APP: "Application — links, build",
  MEDIA: "Media — the CDN, the storage zone of the asset scripts",
  MAIL: "E-mail — the contact form",
  ABUSE: "Abuse — bot protection of the public forms",
} as const;
export type EnvContext = keyof typeof ENV_CONTEXTS;
export type EnvNeed = "required" | "recommended" | "optional";

export interface EnvVar {
  name: string;
  context: EnvContext;
  need: EnvNeed;
  secret?: boolean;
  build?: boolean;
  /** Read by a local script (scripts/), never by the site. */
  tooling?: boolean;
  default?: string;
  doc: string;
  schema: z.ZodType;
}

const text = z.string().min(1);
const url = z.string().url();

export const ENV_VARS: readonly EnvVar[] = [
  {
    name: "APP_COMMIT",
    context: "APP",
    need: "optional",
    build: true,
    schema: z.string().regex(/^[0-9a-f]{40}$/i),
    doc: "The commit being built (DigitalOcean binds it to `${_self.COMMIT_HASH}`), served at `/build.json` so the post-deploy workflow knows when the new build is live; a local build says `local`.",
  },
  {
    name: "APP_GITHUB_TOKEN",
    context: "APP",
    need: "optional",
    build: true,
    secret: true,
    schema: text,
    doc: "A read-only token so the organisation figures (`scripts/gen-org-stats.mjs`) are not rate-limited at build; the build never fails without it.",
  },
  {
    name: "NEXT_PUBLIC_MEDIA_CDN_URL",
    context: "MEDIA",
    need: "optional",
    build: true,
    default: "https://krizaka-assets.b-cdn.net",
    schema: url,
    doc: "Where the media (tours, gallery, home backdrop) are served from (`lib/cdn.ts`).",
  },
  {
    name: "MEDIA_STORAGE_API_KEY",
    context: "MEDIA",
    need: "optional",
    secret: true,
    tooling: true,
    schema: text,
    doc: "Storage zone password — PR captures and site media (`scripts/pr-assets.mjs`, `scripts/cdn-assets.mjs`).",
  },
  {
    name: "MEDIA_ACCOUNT_API_KEY",
    context: "MEDIA",
    need: "optional",
    secret: true,
    tooling: true,
    schema: text,
    doc: "Bunny account key (not the storage zone's) — purges by URL of the files that change in place, after `cdn-assets.mjs readme` (`scripts/cdn-assets.mjs`; org Actions secret).",
  },
  {
    name: "MEDIA_STORAGE_ZONE",
    context: "MEDIA",
    need: "optional",
    tooling: true,
    schema: text,
    doc: "Storage zone name of the asset scripts.",
  },
  {
    name: "MEDIA_STORAGE_ENDPOINT",
    context: "MEDIA",
    need: "optional",
    tooling: true,
    default: "storage.bunnycdn.com",
    schema: text,
    doc: "Storage API host of the zone's region.",
  },
  {
    name: "MEDIA_CDN_HOSTNAME",
    context: "MEDIA",
    need: "optional",
    tooling: true,
    schema: text,
    doc: "Pull zone hostname serving the zone (the scripts check the first file answers publicly).",
  },
  {
    name: "MAIL_PROVIDER",
    context: "MAIL",
    need: "recommended",
    schema: z.enum(["mailgun"]),
    doc: "The contact form's e-mail service: `mailgun`. Unset, the e-mail channel is off.",
  },
  {
    name: "MAIL_API_KEY",
    context: "MAIL",
    need: "recommended",
    secret: true,
    schema: text,
    doc: "The provider's private API key (Basic auth `api:<key>`).",
  },
  {
    name: "MAIL_DOMAIN",
    context: "MAIL",
    need: "recommended",
    default: "mg.krizaka.com",
    schema: text,
    doc: "Sending domain verified at the provider.",
  },
  {
    name: "MAIL_API_URL",
    context: "MAIL",
    need: "optional",
    default: "https://api.mailgun.net",
    schema: url,
    doc: "API base (`https://api.eu.mailgun.net` for an EU-region domain).",
  },
  {
    name: "MAIL_FROM",
    context: "MAIL",
    need: "optional",
    default: "Krizaka <contact@<MAIL_DOMAIN>>",
    schema: text,
    doc: "Sender, on `MAIL_DOMAIN`.",
  },
  {
    name: "MAIL_CONTACT_TO",
    context: "MAIL",
    need: "recommended",
    secret: true,
    schema: text,
    doc: "Where the contact messages land (comma-separated recipients).",
  },
  {
    name: "MAIL_CONTACT_WEBHOOK_URL",
    context: "MAIL",
    need: "optional",
    secret: true,
    schema: url,
    doc: "A second channel: JSON POST to Slack, Discord or any relay (`text`, `content` and structured `contact` fields).",
  },
  {
    name: "ABUSE_CAPTCHA_PROVIDER",
    context: "ABUSE",
    need: "recommended",
    schema: z.enum(["turnstile"]),
    doc: "The CAPTCHA service of the public forms: `turnstile`. Unset, the check is off (local dev, tests).",
  },
  {
    name: "NEXT_PUBLIC_ABUSE_CAPTCHA_SITE_KEY",
    context: "ABUSE",
    need: "recommended",
    build: true,
    schema: text,
    doc: "The widget's public site key, read by the browser (inlined at build; `app/components/CaptchaWidget.tsx`).",
  },
  {
    name: "ABUSE_CAPTCHA_SECRET_KEY",
    context: "ABUSE",
    need: "recommended",
    secret: true,
    schema: text,
    doc: "The widget's secret key; `/api/contact` verifies the token with it before any mail is sent (`lib/captcha.ts`). With the provider set, a missing or invalid token answers 400 `contact.captcha_failed`.",
  },
];

/** Problems of an environment — names only, never a value. */
export function checkEnv(env: Record<string, string | undefined> = process.env): string[] {
  const problems: string[] = [];
  for (const e of ENV_VARS) {
    const raw = env[e.name]?.trim();
    if (!raw) continue;
    const parsed = e.schema.safeParse(raw);
    if (!parsed.success) problems.push(`${e.name} ${parsed.error.issues[0]?.message ?? "is invalid"}`);
  }
  return problems;
}

/** README's table, one per context. */
export function envMarkdown(): string {
  const need = { required: "✓", recommended: "recommended", optional: "—" } as const;
  return Object.entries(ENV_CONTEXTS)
    .flatMap(([context, label]) => [
      `#### ${label.split(" — ")[0]} — \`${context}_\``,
      "",
      "| Variable | Production | Secret | Default | What it does |",
      "| :--- | :---: | :---: | :--- | :--- |",
      ...ENV_VARS.filter((e) => e.context === context).map(
        (e) =>
          `| \`${e.name}\`${e.build ? " *(build)*" : ""}${e.tooling ? " *(scripts)*" : ""} | ${need[e.need]} | ${e.secret ? "✓" : ""} | ${e.default ? `\`${e.default}\`` : ""} | ${e.doc} |`,
      ),
      "",
    ])
    .join("\n");
}

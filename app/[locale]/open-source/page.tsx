import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, FileCode2, GitBranch, Package, Plug, Scale, ShieldCheck, Workflow } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { localizedMetadata } from "@/lib/seo";
import { orgRepositories, type Loc, type OrgRepository } from "@/lib/org-data";
import { GITHUB_ORG_URL } from "@/lib/site";
import TopNavBar from "@/app/components/TopNavBar";
import SiteFooter from "@/app/components/SiteFooter";
import ProductLogo from "@/app/components/ProductLogo";

/* /open-source — for developers who want to build with Krizaka's pieces: what can be reused, how
   to take it, and every public repository. The repository list comes from the generated product
   data (lib/org-data.ts), never written here. */

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(locale, {
    path: "/open-source",
    en: {
      title: "Open source — build with Krizaka's building blocks | Krizaka",
      description: "Reuse Krizaka's components in your own application — users, notifications, billing, the AI engine — or run a whole product. Every repository, Apache-2.0.",
    },
    fr: {
      title: "Open source — construisez avec les briques de Krizaka | Krizaka",
      description: "Réutilisez les composants de Krizaka dans votre application — utilisateurs, notifications, facturation, moteur IA — ou déployez un produit entier. Tous les dépôts, Apache-2.0.",
    },
  });
}

const STEPS: { icon: LucideIcon; title: Record<Loc, string>; body: Record<Loc, string> }[] = [
  {
    icon: Package,
    title: { en: "Pick a piece", fr: "Choisissez une brique" },
    body: {
      en: "Each component is its own repository, with its own CI, docs and contract. Take one, or several.",
      fr: "Chaque composant est un dépôt à part, avec sa CI, sa doc et son contrat. Prenez-en un, ou plusieurs.",
    },
  },
  {
    icon: GitBranch,
    title: { en: "Run it", fr: "Faites-le tourner" },
    body: {
      en: "Clone it on its own, or the whole platform at once with the krizaka/orazaka workspace.",
      fr: "Clonez-le seul, ou toute la plateforme d'un coup avec l'espace de travail krizaka/orazaka.",
    },
  },
  {
    icon: Plug,
    title: { en: "Plug it in", fr: "Branchez-le" },
    body: {
      en: "Talk to it through its versioned contract — the *-api modules and typed clients, published as com.orazaka:* on GitHub Packages.",
      fr: "Parlez-lui via son contrat versionné — les modules *-api et clients typés, publiés en com.orazaka:* sur GitHub Packages.",
    },
  },
];

/** The pieces most applications need first — reusable outside Orazaka as they are. */
const FEATURED: { name: string; title: Record<Loc, string>; gives: Record<Loc, string[]> }[] = [
  {
    name: "orazaka-users",
    title: { en: "Users & sign-in", fr: "Utilisateurs & connexion" },
    gives: {
      en: ["Registration and e-mail verification", "Password, Google and GitHub sign-in", "Forgot / reset password, profiles", "API keys, roles, JWT"],
      fr: ["Inscription et vérification d'e-mail", "Connexion mot de passe, Google, GitHub", "Mot de passe oublié, profils", "Clés d'API, rôles, JWT"],
    },
  },
  {
    name: "orazaka-notifications",
    title: { en: "Notifications", fr: "Notifications" },
    gives: {
      en: ["E-mail (SMTP), SMS (Twilio), webhooks", "One delivery port for every channel", "Triggered by events or explicit requests", "Over AMQP, decoupled from your app"],
      fr: ["E-mail (SMTP), SMS (Twilio), webhooks", "Un seul port de livraison pour tous les canaux", "Déclenché par événement ou à la demande", "Via AMQP, découplé de votre app"],
    },
  },
  {
    name: "orazaka-billing",
    title: { en: "Billing & credits", fr: "Facturation & crédits" },
    gives: {
      en: ["Credits, wallets and plans", "Subscriptions and a price book", "Metering: hold → settle → release", "A typed client for your services"],
      fr: ["Crédits, portefeuilles et forfaits", "Abonnements et grille tarifaire", "Mesure : réserver → régler → libérer", "Un client typé pour vos services"],
    },
  },
];

const GROUPS: { id: string; product: "orazaka" | "orochia"; title: Record<Loc, string>; intro: Record<Loc, string> }[] = [
  { id: "workspace", product: "orazaka", title: { fr: "Espace de travail", en: "Workspace" }, intro: { fr: "Le point d'entrée : clone et construit tous les dépôts d'Orazaka.", en: "The entry point: clones and builds every Orazaka repository." } },
  { id: "foundation", product: "orazaka", title: { fr: "Fondations", en: "Foundation" }, intro: { fr: "Build, contrats, edge et kit UI — pour toute application.", en: "Build, contracts, edge and UI kit — for any application." } },
  { id: "domain", product: "orazaka", title: { fr: "Services réutilisables", en: "Reusable services" }, intro: { fr: "Utilisateurs, notifications, facturation.", en: "Users, notifications, billing." } },
  { id: "ai", product: "orazaka", title: { fr: "Moteur IA", en: "AI engine" }, intro: { fr: "Le moteur cognitif, ses services et son worker natif.", en: "The cognitive engine, its services and its native worker." } },
  { id: "apps", product: "orazaka", title: { fr: "Applications & packs", en: "Applications & packs" }, intro: { fr: "Web, administration, mobile, CLI, packs du Studio.", en: "Web, admin, mobile, CLI, Studio packs." } },
  { id: "orochia", product: "orochia", title: { fr: "Plateforme vidéo", en: "Video platform" }, intro: { fr: "L'application, sa console d'administration et son design system.", en: "The app, its admin console and its design system." } },
];

const PROMISES: { icon: LucideIcon; title: Record<Loc, string>; body: Record<Loc, string> }[] = [
  { icon: Scale, title: { en: "Apache-2.0, everywhere", fr: "Apache-2.0, partout" }, body: { en: "Use it, change it, ship it — commercially too.", fr: "Utilisez, modifiez, livrez — commercialement aussi." } },
  { icon: Workflow, title: { en: "Green on every commit", fr: "Vert à chaque commit" }, body: { en: "Build, tests and architecture rules run in CI.", fr: "Build, tests et règles d'architecture tournent en CI." } },
  { icon: FileCode2, title: { en: "Docs from the code", fr: "Docs issues du code" }, body: { en: "API and data references are generated, never stale.", fr: "Références API et données générées, jamais périmées." } },
  { icon: ShieldCheck, title: { en: "Private security reports", fr: "Failles signalées en privé" }, body: { en: "Every repository accepts private vulnerability reports.", fr: "Chaque dépôt accepte les signalements privés." } },
];

/** First sentence of a repository description — the card stays one idea long. */
const short = (d: string) => (d.split(/(?<=[.:])\s/)[0] ?? d).replace(/[:.]$/, "");

function RepoCard({ repo }: { repo: OrgRepository }) {
  return (
    <a href={repo.url} target="_blank" rel="noopener noreferrer" className="os-repo">
      <span className="os-repo-name">
        {repo.name} <ArrowUpRight size={14} aria-hidden />
      </span>
      <span className="os-repo-desc">{short(repo.description)}</span>
    </a>
  );
}

export default async function OpenSourcePage({ params }: Props) {
  const { locale } = await params;
  const loc: Loc = locale === "en" ? "en" : "fr";
  const repositories = orgRepositories();
  const byName = new Map(repositories.map((r) => [r.name, r]));

  return (
    <main style={{ background: "var(--kz-surface-0)", minHeight: "100vh", color: "var(--kz-text-primary)" }}>
      <TopNavBar />

      <header className="os-hero">
        <p className="os-eyebrow">Open source · Apache-2.0</p>
        <h1>{loc === "fr" ? "Construisez avec nos briques." : "Build with our pieces."}</h1>
        <p className="os-lead">
          {loc === "fr"
            ? "Tout ce que nous construisons est public. Cette page est pour les développeurs : prenez la gestion des utilisateurs, les notifications ou la facturation pour votre propre application — ou déployez un produit entier."
            : "Everything we build is public. This page is for developers: take user management, notifications or billing for your own application — or run a whole product."}
        </p>
        <p className="os-count">
          {loc === "fr" ? `${repositories.length} dépôts publics · ` : `${repositories.length} public repositories · `}
          <a href={GITHUB_ORG_URL}>github.com/krizaka</a>
        </p>
      </header>

      <section className="os-section">
        <ol className="os-steps">
          {STEPS.map(({ icon: Icon, title, body }, i) => (
            <li key={title.en}>
              <span className="os-step-n">{String(i + 1).padStart(2, "0")}</span>
              <Icon size={20} aria-hidden />
              <h2>{title[loc]}</h2>
              <p>{body[loc]}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="os-section">
        <p className="os-eyebrow">{loc === "fr" ? "Les plus réutilisées" : "Most reused"}</p>
        <h2 className="os-h2">{loc === "fr" ? "Ce dont chaque application a besoin d'abord." : "What every application needs first."}</h2>
        <div className="os-featured">
          {FEATURED.map((f) => {
            const repo = byName.get(f.name);
            if (!repo) return null;
            return (
              <article key={f.name} className="os-feature">
                <p className="os-feature-repo">{f.name}</p>
                <h3>{f.title[loc]}</h3>
                <ul>
                  {f.gives[loc].map((g) => (
                    <li key={g}>{g}</li>
                  ))}
                </ul>
                <a href={repo.url} target="_blank" rel="noopener noreferrer" className="os-feature-link">
                  {loc === "fr" ? "Voir le dépôt" : "View the repository"} <ArrowUpRight size={14} />
                </a>
              </article>
            );
          })}
        </div>
      </section>

      {(["orazaka", "orochia"] as const).map((product) => (
        <section key={product} className="os-section">
          <div className="os-product-head">
            <ProductLogo id={product} size={40} />
            <div>
              <h2 className="os-h2" style={{ margin: 0 }}>{product === "orazaka" ? "Orazaka" : "Orochia"}</h2>
              <Link href={`/products/${product}`} className="os-product-link">
                {loc === "fr" ? "Découvrir le produit" : "Discover the product"} <ArrowRight size={13} />
              </Link>
            </div>
          </div>
          {GROUPS.filter((g) => g.product === product).map((group) => {
            const repos = repositories.filter((r) => r.group === group.id);
            if (repos.length === 0) return null;
            return (
              <div key={group.id} className="os-group">
                <div className="os-group-head">
                  <h3>{group.title[loc]}</h3>
                  <p>{group.intro[loc]}</p>
                </div>
                <div className="os-repos">
                  {repos.map((r) => (
                    <RepoCard key={r.name} repo={r} />
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      ))}

      <section className="os-section">
        <div className="os-promises">
          {PROMISES.map(({ icon: Icon, title, body }) => (
            <div key={title.en}>
              <Icon size={18} aria-hidden />
              <h3>{title[loc]}</h3>
              <p>{body[loc]}</p>
            </div>
          ))}
        </div>
        <div className="os-contribute">
          <div>
            <h2>{loc === "fr" ? "Envie de contribuer ?" : "Want to contribute?"}</h2>
            <p>
              {loc === "fr"
                ? "Chaque dépôt a son contrat (AGENTS.md) et les mêmes règles de contribution. Une question, un bogue, une idée : ouvrez une discussion ou une issue."
                : "Every repository has its contract (AGENTS.md) and the same contribution rules. A question, a bug, an idea: open a discussion or an issue."}
            </p>
          </div>
          <div className="os-contribute-links">
            <a href="https://github.com/krizaka/.github/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" className="os-btn is-primary">
              <BookOpen size={15} /> {loc === "fr" ? "Guide de contribution" : "Contribution guide"}
            </a>
            <Link href="/contact" className="os-btn">
              {loc === "fr" ? "Poser une question" : "Ask a question"}
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />

      <style>{`
        .os-hero { max-width: 760px; margin: 0 auto; padding: clamp(128px, 16vw, 176px) 20px 40px; text-align: center; }
        .os-eyebrow { font-family: var(--font-mono); font-size: 11px; font-weight: 600; letter-spacing: .18em; text-transform: uppercase; color: var(--kz-accent); margin: 0 0 12px; }
        .os-hero h1 { font-family: var(--font-display), system-ui, sans-serif; font-size: clamp(2.2rem, 6vw, 3.4rem); font-weight: 800; letter-spacing: -.035em; line-height: 1.08; margin: 0; }
        .os-lead { font-size: clamp(15px, 1.9vw, 17.5px); line-height: 1.75; color: var(--kz-text-secondary); margin: 20px auto 0; max-width: 640px; }
        .os-count { margin: 18px 0 0; font-family: var(--font-mono); font-size: 12px; color: var(--kz-text-muted); }
        .os-count a { color: var(--kz-accent); text-decoration: none; }
        .os-section { max-width: 72rem; margin: 0 auto; padding: 56px 20px; }
        .os-h2 { font-family: var(--font-display), system-ui, sans-serif; font-size: clamp(1.5rem, 3.4vw, 2.1rem); font-weight: 800; letter-spacing: -.025em; margin: 0 0 28px; }

        .os-steps { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr)); gap: 1px;
          background: var(--kz-border-subtle); border: 1px solid var(--kz-border-subtle); border-radius: 20px; overflow: hidden; }
        .os-steps li { padding: 26px; background: var(--kz-surface-0); }
        .os-steps svg { color: var(--kz-accent); }
        .os-step-n { display: block; margin-bottom: 14px; font-family: var(--font-mono); font-size: 11px; color: var(--kz-text-muted); }
        .os-steps h2 { margin: 12px 0 6px; font-size: 16px; font-weight: 700; }
        .os-steps p { margin: 0; font-size: 14px; line-height: 1.65; color: var(--kz-text-secondary); }

        .os-featured { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 290px), 1fr)); gap: 16px; }
        .os-feature { display: flex; flex-direction: column; padding: 24px; border-radius: 20px; background: var(--kz-surface-1); border: 1px solid var(--kz-border-subtle); }
        .os-feature-repo { margin: 0; font-family: var(--font-mono); font-size: 12px; color: var(--kz-text-muted); }
        .os-feature h3 { margin: 6px 0 14px; font-size: 18px; font-weight: 700; }
        .os-feature ul { margin: 0 0 18px; padding: 0; list-style: none; display: grid; gap: 8px; }
        .os-feature li { position: relative; padding-left: 16px; font-size: 14px; line-height: 1.5; color: var(--kz-text-secondary); }
        .os-feature li::before { content: ""; position: absolute; left: 0; top: .6em; width: 6px; height: 6px; border-radius: 50%; background: #f59e0b; }
        .os-feature-link { margin-top: auto; display: inline-flex; align-items: center; gap: 6px; font-size: 13.5px; font-weight: 700; color: var(--kz-accent); text-decoration: none; }

        .os-product-head { display: flex; align-items: center; gap: 14px; margin-bottom: 28px; padding-top: 8px; border-top: 1px solid var(--kz-border-subtle); padding-top: 40px; }
        .os-product-link { display: inline-flex; align-items: center; gap: 4px; margin-top: 4px; font-size: 13px; color: var(--kz-text-secondary); text-decoration: none; }
        .os-product-link:hover { color: var(--kz-text-primary); }
        .os-group { display: grid; grid-template-columns: minmax(0, 220px) minmax(0, 1fr); gap: 24px; padding: 18px 0; }
        @media (max-width: 760px) { .os-group { grid-template-columns: 1fr; gap: 12px; } }
        .os-group-head h3 { margin: 0; font-size: 15px; font-weight: 700; }
        .os-group-head p { margin: 4px 0 0; font-size: 13px; line-height: 1.55; color: var(--kz-text-muted); }
        .os-repos { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 250px), 1fr)); gap: 10px; }
        .os-repo { display: flex; flex-direction: column; gap: 6px; padding: 14px 16px; border-radius: 14px; text-decoration: none; color: var(--kz-text-primary);
          background: var(--kz-surface-1); border: 1px solid var(--kz-border-subtle); transition: border-color 150ms ease, transform 150ms ease; }
        .os-repo:hover { border-color: var(--kz-border-strong); transform: translateY(-1px); }
        .os-repo-name { display: flex; justify-content: space-between; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 13px; font-weight: 700; }
        .os-repo-name svg { color: var(--kz-text-muted); flex-shrink: 0; }
        .os-repo-desc { font-size: 13px; line-height: 1.55; color: var(--kz-text-secondary); }
        @media (prefers-reduced-motion: reduce) { .os-repo, .os-repo:hover { transition: none; transform: none; } }

        .os-promises { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr)); gap: 24px; padding-top: 40px; border-top: 1px solid var(--kz-border-subtle); }
        .os-promises svg { color: var(--kz-accent); }
        .os-promises h3 { margin: 10px 0 4px; font-size: 15px; font-weight: 700; }
        .os-promises p { margin: 0; font-size: 13.5px; line-height: 1.6; color: var(--kz-text-secondary); }
        .os-contribute { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 24px; margin-top: 48px; padding: 28px;
          border-radius: 20px; background: var(--kz-surface-1); border: 1px solid var(--kz-border-subtle); }
        .os-contribute h2 { margin: 0 0 6px; font-size: 20px; font-weight: 800; }
        .os-contribute p { margin: 0; max-width: 520px; font-size: 14px; line-height: 1.65; color: var(--kz-text-secondary); }
        .os-contribute-links { display: flex; flex-wrap: wrap; gap: 10px; }
        .os-btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 18px; border-radius: 12px; font-size: 14px; font-weight: 700; text-decoration: none;
          color: var(--kz-text-primary); border: 1px solid var(--kz-border-default); }
        .os-btn.is-primary { background: var(--kz-accent); color: var(--kz-on-accent); border-color: transparent; }
      `}</style>
    </main>
  );
}

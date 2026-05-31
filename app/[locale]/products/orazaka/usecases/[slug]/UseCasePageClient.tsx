"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpRight, 
  ShieldCheck,
  Search,
  Mail,
  Briefcase,
  Clock,
  Lock,
  AlertCircle,
  Sparkles
} from "lucide-react";
import { useI18n } from "../../../../../components/I18nProvider";
import TopNavBar from "../../../../../components/TopNavBar";
import SiteFooter from "../../../../../components/SiteFooter";
import { USE_CASES, getUseCaseBySlug, getLocalizedField, UseCaseActionPlanStep, UseCaseData } from "@/lib/use-cases-data";
import { TranslationDictionary } from "@/lib/i18n";
import MartinFalconSentry from "../../../../../components/illustrations/MartinFalconSentry";

/* ─── Sibling Navigation (Centered) ─── */
function SiblingNav({ currentSlug, locale }: { currentSlug: string; locale: "fr" | "en" }) {
  const idx = USE_CASES.findIndex((uc) => uc.slug === currentSlug);
  const prev = idx > 0 ? USE_CASES[idx - 1] : null;
  const next = idx < USE_CASES.length - 1 ? USE_CASES[idx + 1] : null;

  if (!prev && !next) return null;

  return (
    <div
      className="uc-sibling-nav"
      style={{
        display: "grid",
        gridTemplateColumns: prev && next ? "1fr 1fr" : "1fr",
        gap: "16px",
        marginTop: "56px",
        width: "100%",
        maxWidth: "800px",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      {prev && (
        <Link
          href={`/products/orazaka/usecases/${prev.slug}`}
          className="uc-sibling-link"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "16px 20px",
            borderRadius: "14px",
            background: "var(--kz-surface-1)",
            border: "1px solid var(--kz-border-subtle)",
            textDecoration: "none",
            transition: "border-color 150ms ease, background 150ms ease",
          }}
        >
          <ChevronLeft size={16} style={{ color: "var(--kz-text-muted)", flexShrink: 0 }} />
          <div style={{ minWidth: 0, textAlign: "left" }}>
            <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--kz-text-muted)", fontFamily: "var(--font-mono, monospace)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "4px" }}>
              {locale === "fr" ? "Précédent" : "Previous"}
            </div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--kz-text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {getLocalizedField(prev.title, locale)}
            </div>
          </div>
        </Link>
      )}
      {next && (
        <Link
          href={`/products/orazaka/usecases/${next.slug}`}
          className="uc-sibling-link"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "16px 20px",
            borderRadius: "14px",
            background: "var(--kz-surface-1)",
            border: "1px solid var(--kz-border-subtle)",
            textDecoration: "none",
            justifyContent: "flex-end",
            transition: "border-color 150ms ease, background 150ms ease",
          }}
        >
          <div style={{ minWidth: 0, textAlign: "right" }}>
            <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--kz-text-muted)", fontFamily: "var(--font-mono, monospace)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "4px" }}>
              {locale === "fr" ? "Suivant" : "Next"}
            </div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--kz-text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {getLocalizedField(next.title, locale)}
            </div>
          </div>
          <ChevronRight size={16} style={{ color: "var(--kz-text-muted)", flexShrink: 0 }} />
        </Link>
      )}
    </div>
  );
}

/* ─── Mini Navigation (Centered) ─── */
function UseCaseMiniNav({ currentSlug, locale }: { currentSlug: string; locale: "fr" | "en" }) {
  return (
    <div
      className="uc-mini-nav"
      style={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "8px",
        marginBottom: "40px",
      }}
    >
      <Link
        href="/products/orazaka/usecases"
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "8px 16px",
          borderRadius: "8px",
          fontSize: "12px",
          fontWeight: 600,
          color: "var(--kz-text-muted)",
          background: "var(--kz-surface-2)",
          textDecoration: "none",
          fontFamily: "var(--font-display), system-ui, sans-serif",
          transition: "color 150ms ease, background 150ms ease",
        }}
      >
        {locale === "fr" ? "Tous les cas" : "All cases"}
      </Link>
      {USE_CASES.map((uc) => {
        const isActive = uc.slug === currentSlug;
        return (
          <Link
            key={uc.slug}
            href={`/products/orazaka/usecases/${uc.slug}`}
            className={isActive ? "" : "uc-pill-link"}
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: isActive ? 600 : 500,
              color: isActive ? "var(--kz-accent)" : "var(--kz-text-muted)",
              background: isActive ? "var(--kz-accent-soft)" : "transparent",
              border: isActive ? "1px solid hsla(217, 92%, 60%, 0.15)" : "1px solid transparent",
              textDecoration: "none",
              fontFamily: "var(--font-display), system-ui, sans-serif",
              transition: "color 150ms ease, background 150ms ease",
              whiteSpace: "nowrap",
            }}
          >
            {getLocalizedField(uc.industry, locale)}
          </Link>
        );
      })}
    </div>
  );
}

/* ─── Martin Story Hero Banner (Centered) ─── */
function MartinHero({ title, description, locale }: { title: string; description: string; locale: "fr" | "en" }) {
  return (
    <div className="martin-hero-card">
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
        <MartinFalconSentry size={180} />
      </div>

      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
        <span className="kw-badge accent-badge">Orazaka Sentinelle</span>
        <span className="kw-badge outline-badge">Loi 25 · LCEE</span>
        <span className="kw-badge outline-badge">{locale === "fr" ? "IA Souveraine" : "Sovereign AI"}</span>
      </div>
      
      <h1 className="martin-hero-title">{title}</h1>
      <p className="martin-hero-desc">{description}</p>
      
      <div className="martin-story-box">
        <h3 className="martin-story-heading">
          <span style={{ fontSize: "16px" }}>💡</span> 
          {locale === "fr" ? "Qui est Martin ?" : "Who is Martin?"}
        </h3>
        <p className="martin-story-text">
          {locale === "fr" ? (
            <>
              <strong>Martin</strong> est électricien à Montréal. Comme beaucoup {"d'artisans"}, il veut développer sa clientèle sans passer ses soirées à éplucher les registres publics, et surtout, <strong>sans enfreindre la loi</strong>. Le Québec impose des règles strictes : la <strong>LCEE</strong> interdit les courriels commerciaux froids B2C, et la <strong>Loi 25</strong> interdit {"d'envoyer"} les données personnelles de ses prospects dans des serveurs cloud tiers. Orazaka Sentinelle résout ce casse-tête en exécutant tout le processus localement sur son ordinateur.
            </>
          ) : (
            <>
              <strong>Martin</strong> is an electrician in Montreal. Like many local pros, he wants to grow his business without spending his evenings scanning public registries, and above all, <strong>without breaking the law</strong>. Quebec has strict rules: <strong>CASL</strong> bans cold B2C emails, and <strong>Law 25</strong> bans sending prospect PII to cloud servers. Orazaka Sentinel solves this headache by running everything locally on his computer.
            </>
          )}
        </p>
      </div>
    </div>
  );
}

/* ─── Before vs After Comparison Schema (Centered & Side-by-Side) ─── */
function BeforeAfterSchema({ locale }: { locale: "fr" | "en" }) {
  return (
    <div className="comparison-container">
      <h2 className="section-title">
        {locale === "fr" ? "L'expérience utilisateur réinventée" : "The User Experience Reimagined"}
      </h2>
      <p className="section-desc">
        {locale === "fr" 
          ? "Découvrez comment Orazaka Sentinelle simplifie le quotidien de Martin."
          : "Discover how Orazaka Sentinel simplifies Martin's day-to-day operations."}
      </p>

      {/* Empathy Hook Schema */}
      <div className="empathy-schema">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 2 }}>
          <div className="empathy-question">
            {locale === "fr" ? "Vous vous reconnaissez ?" : "Do you recognize yourself?"}
          </div>
          <p className="empathy-text">
            {locale === "fr" 
              ? "Si vous passez des heures à chercher des clients ou si vous craignez les lourdes amendes de la Loi 25, vous partagez le même quotidien difficile que Martin. Orazaka vous permet de passer de la surcharge à la sérénité :"
              : "If you spend hours chasing leads or worry about heavy Law 25 compliance fines, you share Martin's struggles. Orazaka allows you to transition from overload to peace of mind:"}
          </p>
          
          {/* Visual flow indicator arrow (Before -> After) */}
          <div className="visual-transition-bridge" aria-hidden="true">
            <div className="bridge-indicator indicator-manual">
              {locale === "fr" ? "Surcharge & Risque" : "Overload & Risk"}
            </div>
            <div className="bridge-arrow-container">
              <div className="bridge-line-dashed" />
              <div className="bridge-sparkle" />
              <div className="bridge-engine-node">Orazaka</div>
              <div className="bridge-arrow-head" />
            </div>
            <div className="bridge-indicator indicator-auto">
              {locale === "fr" ? "Souveraineté & Sérénité" : "Sovereignty & Serenity"}
            </div>
          </div>
        </div>
      </div>

      {/* Grid displaying both cards at the same time */}
      <div className="comparison-grid">
        {/* Before Card */}
        <div className="comparison-card before-card">
          <div className="panel-badge before-badge">
            <AlertCircle size={13} style={{ marginRight: "4px" }} />
            {locale === "fr" ? "Avant Orazaka : 10h / semaine" : "Before Orazaka: 10h / week"}
          </div>
          
          <div className="flow-steps">
            <div className="flow-step-item">
              <span className="step-num">1</span>
              <div>
                <h4 className="step-item-title">
                  {locale === "fr" ? "Recherche manuelle harassante" : "Tiresome manual search"}
                </h4>
                <p className="step-item-desc">
                  {locale === "fr" 
                    ? "Martin épluche chaque soir les réseaux sociaux et babillards de chantiers (5h/semaine)."
                    : "Martin spends every evening scanning social networks and local bulletin boards (5h/week)."}
                </p>
              </div>
            </div>

            <div className="flow-step-item">
              <span className="step-num">2</span>
              <div>
                <h4 className="step-item-title">
                  {locale === "fr" ? "Consultation fastidieuse du Registre" : "Tedious Land Registry checks"}
                </h4>
                <p className="step-item-desc">
                  {locale === "fr" 
                    ? "Consultation manuelle du Registre foncier du Québec pour cibler les nouveaux propriétaires (2h/semaine)."
                    : "Manually checking the Quebec Land Registry to target new property owners (2h/week)."}
                </p>
              </div>
            </div>

            <div className="flow-step-item">
              <span className="step-num">3</span>
              <div>
                <h4 className="step-item-title">
                  {locale === "fr" ? "Risque de non-conformité & Fuites" : "Spam risk & Cloud privacy leaks"}
                </h4>
                <p className="step-item-desc">
                  {locale === "fr" 
                    ? "Peur d'enfreindre la LCEE (loi anti-spam) en écrivant en B2C, ou de violer la Loi 25 en mettant des données privées dans le cloud."
                    : "Fear of violating CASL (anti-spam law) writing B2C, or violating Law 25 by putting private prospect data in the cloud."}
                </p>
              </div>
            </div>
          </div>

          <div className="panel-footer-note before-note">
            {locale === "fr" 
              ? "Résultat : Martin est débordé, perd son temps libre et s'expose à de lourdes amendes."
              : "Result: Martin is overloaded, loses free time, and risks heavy regulatory fines."}
          </div>
        </div>

        {/* After Card */}
        <div className="comparison-card after-card">
          <div className="panel-badge after-badge">
            <Sparkles size={13} style={{ marginRight: "4px" }} />
            {locale === "fr" ? "Avec Orazaka : 10 min / semaine" : "With Orazaka: 10 min / week"}
          </div>
          
          <div className="flow-steps">
            <div className="flow-step-item">
              <span className="step-num success-num">1</span>
              <div>
                <h4 className="step-item-title">
                  {locale === "fr" ? "Veille automatisée locale" : "Automated local territorial watch"}
                </h4>
                <p className="step-item-desc">
                  {locale === "fr" 
                    ? "Orazaka Sentinelle scanne en arrière-plan les chantiers et permis publics depuis son ordinateur."
                    : "Orazaka Sentinel silently scans municipal permits and public sales feeds locally in the background."}
                </p>
              </div>
            </div>

            <div className="flow-step-item">
              <span className="step-num success-num">2</span>
              <div>
                <h4 className="step-item-title">
                  {locale === "fr" ? "Tri intelligent et souverain" : "Intelligent, sovereign filtering"}
                </h4>
                <p className="step-item-desc">
                  {locale === "fr" 
                    ? "Un LLM local qualifie l'intention (ex. permis de borne VE) sans jamais envoyer de données dans le cloud."
                    : "A local LLM qualifies target intent (e.g. EV charger permit detection) without sending any data to the cloud."}
                </p>
              </div>
            </div>

            <div className="flow-step-item">
              <span className="step-num success-num">3</span>
              <div>
                <h4 className="step-item-title">
                  {locale === "fr" ? "Actions conformes prêtes à poster" : "Compliant actions ready to mail/send"}
                </h4>
                <p className="step-item-desc">
                  {locale === "fr" 
                    ? "Impression de publipostages postaux pour le B2C (légal hors LCEE) et e-mails ciblés pour le B2B."
                    : "Instant print-ready postcard drafts for B2C (fully CASL-compliant) and business emails for B2B."}
                </p>
              </div>
            </div>
          </div>

          <div className="panel-footer-note after-note">
            {locale === "fr" 
              ? "Résultat : Martin consacre son temps à son métier de manière 100% légale et l'esprit tranquille."
              : "Result: Martin devotes his time to his trade with complete peace of mind and full compliance."}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Simplified Features Grid ─── */
function FeaturesBento({ locale }: { locale: "fr" | "en" }) {
  const cards = [
    {
      icon: <Search size={20} style={{ color: "var(--kz-accent)" }} />,
      title: locale === "fr" ? "Veille automatique" : "Automated monitoring",
      desc: locale === "fr" 
        ? "Scanne automatiquement les permis fonciers locaux sans recherche manuelle." 
        : "Silently scans public regional registries without manual outreach.",
    },
    {
      icon: <Mail size={20} style={{ color: "var(--kz-accent)" }} />,
      title: locale === "fr" ? "Courriers B2C éthiques" : "Ethical B2C Mailers",
      desc: locale === "fr" 
        ? "Génère du publipostage physique légal qui contourne la loi anti-spam électronique." 
        : "Drafts physical direct mail campaigns exempt from electronic anti-spam laws.",
    },
    {
      icon: <Briefcase size={20} style={{ color: "var(--kz-accent)" }} />,
      title: locale === "fr" ? "E-mails B2B ciblés" : "Targeted B2B emails",
      desc: locale === "fr" 
        ? "Rédige des courriels professionnels conformes aux exemptions d'affaires." 
        : "Writes contextual corporate messages adhering to business exemptions.",
    },
    {
      icon: <Lock size={20} style={{ color: "var(--kz-accent)" }} />,
      title: locale === "fr" ? "100% Hors-ligne & Souverain" : "100% Sovereign & Offline",
      desc: locale === "fr" 
        ? "Aucune donnée de vos prospects ne quitte votre ordinateur. Conforme Loi 25." 
        : "Prospect details never leave your hardware. Fully Law 25 compliant.",
    }
  ];

  return (
    <div style={{ marginBottom: "56px", width: "100%" }}>
      <h2 className="section-title">
        {locale === "fr" ? "Ce que fait le package Orazaka Sentinelle" : "What Orazaka Sentinel Does"}
      </h2>
      
      <div className="features-grid">
        {cards.map((card, idx) => (
          <div key={idx} className="feature-item-card">
            <div className="feature-icon-container">{card.icon}</div>
            <h3 className="feature-card-title">{card.title}</h3>
            <p className="feature-card-desc">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Time & ROI Calculator (Centered & Simplified) ─── */
function TimeCalculator({ locale }: { locale: "fr" | "en" }) {
  const [intensity, setIntensity] = useState<"moderate" | "active" | "intense">("active");

  const data = {
    moderate: {
      leads: 3,
      totalManual: 5,
      orazaka: 10, // min
      saved: 4.8,
    },
    active: {
      leads: 6,
      totalManual: 10,
      orazaka: 10,
      saved: 9.8,
    },
    intense: {
      leads: 12,
      totalManual: 17.5,
      orazaka: 10,
      saved: 17.3,
    },
  };

  const current = data[intensity];

  return (
    <div className="roi-calculator-card">
      <div className="roi-calc-header">
        <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "center", width: "100%" }}>
          <Clock size={18} style={{ color: "var(--kz-accent)" }} />
          <h3 className="roi-calc-title">
            {locale === "fr" ? "Calculateur de temps & ROI" : "Time & ROI Calculator"}
          </h3>
        </div>
        
        <div className="roi-selector-group">
          {(["moderate", "active", "intense"] as const).map((lvl) => {
            const isActive = intensity === lvl;
            const label = {
              fr: lvl === "moderate" ? "Modéré" : lvl === "active" ? "Actif" : "Intense",
              en: lvl === "moderate" ? "Moderate" : lvl === "active" ? "Active" : "Intense",
            }[locale];

            return (
              <button
                key={lvl}
                onClick={() => setIntensity(lvl)}
                className={`roi-selector-btn ${isActive ? "active" : ""}`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="roi-calc-content">
        <div className="roi-calc-stat">
          <div style={{ fontSize: "13px", color: "var(--kz-text-muted)", marginBottom: "8px" }}>
            {locale === "fr" ? "Temps passé manuellement" : "Time spent manually"}
          </div>
          <div style={{ fontSize: "24px", fontWeight: 700, color: "var(--kz-text-primary)" }}>
            {current.totalManual}h <span style={{ fontSize: "14px", color: "var(--kz-text-muted)" }}>/ {locale === "fr" ? "semaine" : "week"}</span>
          </div>
        </div>

        <div className="roi-calc-stat-divider" />

        <div className="roi-calc-stat">
          <div style={{ fontSize: "13px", color: "var(--kz-text-muted)", marginBottom: "8px" }}>
            {locale === "fr" ? "Temps avec Orazaka" : "Time with Orazaka"}
          </div>
          <div style={{ fontSize: "24px", fontWeight: 700, color: "var(--kz-accent)" }}>
            10 min <span style={{ fontSize: "14px", color: "var(--kz-text-muted)" }}>/ {locale === "fr" ? "semaine" : "week"}</span>
          </div>
        </div>

        <div className="roi-calc-stat-divider" />

        <div className="roi-calc-stat highlight-stat">
          <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--kz-status-success)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
            {locale === "fr" ? "Temps libéré" : "Time saved"}
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--kz-status-success)" }}>
            +{current.saved.toFixed(1)}h <span style={{ fontSize: "14px", fontWeight: 500 }}>/ {locale === "fr" ? "semaine" : "week"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Quebec Regulatory Context (Centered) ─── */
function QuebecContextCard({ uc, locale, t }: { uc: UseCaseData; locale: "fr" | "en"; t: TranslationDictionary }) {
  return (
    <div className="quebec-context-card">
      <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "center", marginBottom: "16px" }}>
        <ShieldCheck size={20} style={{ color: "var(--kz-accent)" }} />
        <h3 className="section-title" style={{ margin: 0 }}>
          {t.useCasePage.quebecContextTitle}
        </h3>
      </div>
      
      <p className="quebec-context-text">
        {getLocalizedField(uc.quebecContext, locale)}
      </p>

      <div className="quebec-links-container">
        {uc.quebecLinks.map((link: { title: string; url: string }, idx: number) => (
          <a
            key={idx}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="sidebar-link"
          >
            <span>{link.title}</span>
            <ArrowUpRight size={13} />
          </a>
        ))}
      </div>
    </div>
  );
}

/* ─── Deployment Action Plan (Centered) ─── */
function DeploymentPlan({ actionPlan, title, locale }: { actionPlan: UseCaseActionPlanStep[]; title: string; locale: "fr" | "en" }) {
  return (
    <div style={{ marginBottom: "56px", width: "100%" }}>
      <h2 className="section-title">{title}</h2>
      
      <div className="action-plan-timeline">
        {actionPlan.map((step, idx) => (
          <div key={idx} className="action-plan-step">
            <div className="step-badge">{step.phase}</div>
            <div className="step-content">
              <h3 className="step-title">{getLocalizedField(step.title, locale)}</h3>
              <p className="step-desc">{getLocalizedField(step.desc, locale)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Page Client Component ─── */
export default function UseCasePageClient({ slug }: { slug: string }) {
  const { t, locale } = useI18n();
  const uc = getUseCaseBySlug(slug);

  if (!uc) return null;

  return (
    <main className="min-h-screen">
      <TopNavBar />

      <div
        className="usecase-page-container"
        style={{
          maxWidth: "840px",
          margin: "0 auto",
          padding: "120px 24px 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {/* Navigation pills */}
        <UseCaseMiniNav currentSlug={slug} locale={locale} />

        {/* Martin Hero Banner */}
        <MartinHero 
          title={getLocalizedField(uc.title, locale)} 
          description={getLocalizedField(uc.metaDescription, locale)} 
          locale={locale} 
        />

        {/* Before vs After Schema */}
        <BeforeAfterSchema locale={locale} />

        {/* Bento features */}
        <FeaturesBento locale={locale} />

        {/* ROI Calculator */}
        <TimeCalculator locale={locale} />

        {/* Quebec Context */}
        <QuebecContextCard uc={uc} locale={locale} t={t} />

        {/* Deployment Action Plan */}
        <DeploymentPlan 
          actionPlan={uc.actionPlan} 
          title={t.useCasePage.actionPlanTitle} 
          locale={locale} 
        />

        {/* Sibling navigation */}
        <SiblingNav currentSlug={slug} locale={locale} />
      </div>

      {/* ─── CTA ─── */}
      <section
        style={{
          padding: "56px 24px 80px",
          maxWidth: "840px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div className="cta-container">
          <h2 className="cta-title">{t.useCasePage.ctaTitle}</h2>
          <p className="cta-desc">{t.useCasePage.ctaDesc}</p>
          <Link href="/products/orazaka" className="cta-btn">
            {t.useCasePage.ctaButton}
            <ArrowRight size={15} strokeWidth={2} />
          </Link>
        </div>
      </section>

      <SiteFooter />

      <style>{`
        /* Hero Banner Styles */
        .martin-hero-card {
          width: 100%;
          background: var(--kz-surface-1);
          border: 1px solid var(--kz-border-subtle);
          border-radius: 20px;
          padding: 40px;
          margin-bottom: 56px;
          box-shadow: var(--kz-shadow-sm);
          text-align: center;
        }

        .martin-hero-title {
          font-family: var(--font-display), system-ui, sans-serif;
          font-size: clamp(1.6rem, 4vw, 2.2rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          color: var(--kz-text-primary);
          line-height: 1.2;
          margin: 0 0 16px 0;
        }

        .martin-hero-desc {
          font-size: 15px;
          color: var(--kz-text-secondary);
          line-height: 1.6;
          margin: 0 auto 32px;
          max-width: 680px;
        }

        .martin-story-box {
          background: var(--kz-surface-2);
          border-radius: 12px;
          padding: 24px;
          border: 1px solid var(--kz-border-subtle);
          text-align: left;
          max-width: 720px;
          margin: 0 auto;
        }

        .martin-story-heading {
          font-family: var(--font-display), system-ui, sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: var(--kz-text-primary);
          margin: 0 0 10px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .martin-story-text {
          font-size: 13.5px;
          color: var(--kz-text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        /* Titles and descriptions */
        .section-title {
          font-family: var(--font-display), system-ui, sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: var(--kz-text-primary);
          letter-spacing: -0.02em;
          margin: 0 0 8px 0;
        }

        .section-desc {
          font-size: 14px;
          color: var(--kz-text-muted);
          line-height: 1.5;
          margin: 0 0 32px 0;
        }

        /* Before vs After Schema Styles */
        .comparison-container {
          width: 100%;
          margin-bottom: 56px;
        }

        /* Empathy Schema */
        .empathy-schema {
          background: color-mix(in srgb, var(--kz-accent) 4%, var(--kz-surface-1));
          border: 1px solid var(--kz-border-subtle);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 32px;
          text-align: center;
          width: 100%;
          position: relative;
          overflow: hidden;
        }

        .empathy-question {
          font-family: var(--font-display), system-ui, sans-serif;
          font-size: 16px;
          font-weight: 750;
          color: var(--kz-accent);
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .empathy-text {
          font-size: 13.5px;
          color: var(--kz-text-secondary);
          line-height: 1.6;
          max-width: 620px;
          margin: 0 auto 24px;
        }

        .visual-transition-bridge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
        }

        .bridge-indicator {
          font-family: var(--font-mono, monospace);
          font-size: 10.5px;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 6px;
          border: 1px solid var(--kz-border-subtle);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .indicator-manual {
          background: color-mix(in srgb, var(--kz-status-error) 10%, var(--kz-surface-2));
          color: var(--kz-status-error);
          border-color: color-mix(in srgb, var(--kz-status-error) 25%, var(--kz-border-subtle));
        }

        .indicator-auto {
          background: var(--kz-accent-soft);
          color: var(--kz-accent);
          border-color: color-mix(in srgb, var(--kz-accent) 25%, var(--kz-border-subtle));
        }

        .bridge-arrow-container {
          flex: 1;
          display: flex;
          align-items: center;
          position: relative;
          height: 32px;
          min-width: 120px;
        }

        .bridge-line-dashed {
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          height: 2px;
          border-top: 2px dashed var(--kz-border-strong);
          transform: translateY(-50%);
          z-index: 1;
        }

        .bridge-engine-node {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          background: var(--kz-surface-0);
          border: 1.5px solid var(--kz-accent);
          color: var(--kz-text-primary);
          font-family: var(--font-display), system-ui, sans-serif;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 9999px;
          box-shadow: 0 0 10px var(--kz-accent-soft);
          z-index: 3;
        }

        @keyframes bridge-travel {
          0% { left: 0%; opacity: 0; }
          10%, 90% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }

        .bridge-sparkle {
          position: absolute;
          top: 50%;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--kz-accent);
          box-shadow: 0 0 8px var(--kz-accent), 0 0 16px var(--kz-accent);
          transform: translateY(-50%);
          z-index: 2;
          animation: bridge-travel 2.5s linear infinite;
        }

        .bridge-arrow-head {
          position: absolute;
          right: -2px;
          top: 50%;
          width: 6px;
          height: 6px;
          border-top: 2px solid var(--kz-border-strong);
          border-right: 2px solid var(--kz-border-strong);
          transform: translateY(-50%) rotate(45deg);
          z-index: 1;
        }

        /* Side-by-side grid */
        .comparison-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          width: 100%;
        }

        .comparison-card {
          background: var(--kz-surface-1);
          border-radius: 16px;
          padding: 32px;
          text-align: left;
          box-shadow: var(--kz-shadow-sm);
          transition: all 250ms ease;
        }

        .before-card {
          border: 1px solid color-mix(in srgb, var(--kz-status-error) 20%, var(--kz-border-subtle));
        }

        .after-card {
          border: 1px solid color-mix(in srgb, var(--kz-accent) 25%, var(--kz-border-subtle));
          box-shadow: 0 8px 30px rgba(59, 130, 246, 0.02);
        }

        .panel-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 6px;
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 24px;
        }

        .before-badge {
          background: color-mix(in srgb, var(--kz-status-error) 10%, transparent);
          color: var(--kz-status-error);
        }

        .after-badge {
          background: var(--kz-accent-soft);
          color: var(--kz-accent);
        }

        .flow-steps {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 24px;
        }

        .flow-step-item {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }

        .step-num {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: color-mix(in srgb, var(--kz-status-error) 10%, var(--kz-surface-2));
          border: 1.5px solid color-mix(in srgb, var(--kz-status-error) 30%, var(--kz-border-subtle));
          color: var(--kz-status-error);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          font-weight: 700;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .success-num {
          background: var(--kz-accent-soft);
          border-color: color-mix(in srgb, var(--kz-accent) 30%, var(--kz-border-subtle));
          color: var(--kz-accent);
        }

        .step-item-title {
          font-size: 14.5px;
          font-weight: 700;
          color: var(--kz-text-primary);
          margin: 0 0 4px 0;
        }

        .step-item-desc {
          font-size: 13px;
          color: var(--kz-text-secondary);
          line-height: 1.55;
          margin: 0;
        }

        .panel-footer-note {
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 550;
        }

        .before-note {
          background: color-mix(in srgb, var(--kz-status-error) 6%, var(--kz-surface-2));
          color: var(--kz-status-error);
          border-left: 3px solid var(--kz-status-error);
        }

        .after-note {
          background: color-mix(in srgb, var(--kz-status-success) 6%, var(--kz-surface-2));
          color: var(--kz-status-success);
          border-left: 3px solid var(--kz-status-success);
        }

        /* Features Grid Styles */
        .features-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          width: 100%;
        }

        .feature-item-card {
          background: var(--kz-surface-1);
          border: 1px solid var(--kz-border-subtle);
          border-radius: 16px;
          padding: 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: border-color 200ms ease, box-shadow 200ms ease;
        }

        .feature-item-card:hover {
          border-color: var(--kz-accent);
          box-shadow: 0 8px 24px var(--kz-accent-soft);
        }

        .feature-icon-container {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: var(--kz-surface-2);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--kz-border-subtle);
          margin-bottom: 16px;
        }

        .feature-card-title {
          font-family: var(--font-display), system-ui, sans-serif;
          font-size: 14.5px;
          font-weight: 700;
          color: var(--kz-text-primary);
          margin: 0 0 8px 0;
        }

        .feature-card-desc {
          font-size: 12.5px;
          color: var(--kz-text-secondary);
          line-height: 1.5;
          margin: 0;
        }

        /* ROI Calculator Styles */
        .roi-calculator-card {
          width: 100%;
          background: var(--kz-surface-1);
          border: 1px solid var(--kz-border-subtle);
          border-radius: 20px;
          padding: 28px;
          margin-bottom: 56px;
          box-shadow: var(--kz-shadow-sm);
        }

        .roi-calc-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          border-bottom: 1px solid var(--kz-border-subtle);
          padding-bottom: 20px;
          margin-bottom: 20px;
        }

        .roi-calc-title {
          font-family: var(--font-display), system-ui, sans-serif;
          font-size: 15px;
          font-weight: 750;
          color: var(--kz-text-primary);
          margin: 0;
        }

        .roi-selector-group {
          display: flex;
          background: var(--kz-surface-2);
          padding: 4px;
          border-radius: 10px;
          border: 1px solid var(--kz-border-subtle);
        }

        .roi-selector-btn {
          border: none;
          background: transparent;
          color: var(--kz-text-muted);
          padding: 6px 14px;
          border-radius: 7px;
          font-size: 11px;
          font-weight: 550;
          cursor: pointer;
          transition: all 150ms ease;
        }

        .roi-selector-btn:hover {
          color: var(--kz-text-primary);
        }

        .roi-selector-btn.active {
          background: var(--kz-surface-0);
          color: var(--kz-accent);
          box-shadow: var(--kz-shadow-sm);
        }

        .roi-calc-content {
          display: flex;
          justify-content: space-around;
          align-items: center;
          gap: 16px;
        }

        .roi-calc-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
        }

        .roi-calc-stat-divider {
          width: 1px;
          height: 40px;
          background: var(--kz-border-subtle);
        }

        .highlight-stat {
          background: color-mix(in srgb, var(--kz-status-success) 5%, var(--kz-surface-2));
          border: 1px solid color-mix(in srgb, var(--kz-status-success) 12%, var(--kz-border-subtle));
          border-radius: 12px;
          padding: 12px 20px;
        }

        /* Quebec Regulatory Card */
        .quebec-context-card {
          width: 100%;
          background: var(--kz-surface-1);
          border-radius: 20px;
          border: 1px solid var(--kz-border-subtle);
          padding: 32px;
          margin-bottom: 56px;
          text-align: center;
        }

        .quebec-context-text {
          font-size: 13.5px;
          color: var(--kz-text-secondary);
          line-height: 1.65;
          margin: 0 auto 24px;
          max-width: 680px;
        }

        .quebec-links-container {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 12px;
        }

        .sidebar-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 8px;
          background: var(--kz-surface-2);
          border: 1px solid var(--kz-border-subtle);
          font-size: 11.5px;
          font-weight: 500;
          color: var(--kz-text-secondary);
          text-decoration: none;
          transition: all 150ms ease;
        }

        .sidebar-link:hover {
          border-color: var(--kz-border-default);
          color: var(--kz-text-primary);
          background: var(--kz-surface-3);
        }

        /* Timeline Action Plan */
        .action-plan-timeline {
          position: relative;
          padding-left: 20px;
          display: flex;
          flex-direction: column;
          gap: 28px;
          max-width: 720px;
          margin: 0 auto;
          text-align: left;
        }

        .action-plan-timeline::before {
          content: '';
          position: absolute;
          left: 31px;
          top: 14px;
          bottom: 14px;
          width: 2px;
          border-left: 2px dashed var(--kz-border-default);
          z-index: 0;
        }

        .action-plan-step {
          display: flex;
          gap: 20px;
          position: relative;
          z-index: 1;
        }

        .step-badge {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--kz-surface-2);
          border: 2px solid var(--kz-border-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-family: var(--font-mono, monospace);
          font-weight: 700;
          color: var(--kz-accent);
          flex-shrink: 0;
        }

        .step-content {
          padding-top: 2px;
        }

        .step-title {
          font-size: 14px;
          font-weight: 650;
          color: var(--kz-text-primary);
          margin: 0 0 4px 0;
        }

        .step-desc {
          margin: 0;
          font-size: 12.5px;
          color: var(--kz-text-muted);
          line-height: 1.5;
        }

        /* Sibling Nav Hover */
        .uc-sibling-link:hover {
          border-color: var(--kz-border-default);
          background: var(--kz-surface-2);
        }

        .uc-pill-link:hover {
          color: var(--kz-text-primary) !important;
          background: var(--kz-surface-2) !important;
        }

        /* CTA Panel */
        .cta-container {
          padding: 40px 32px;
          border-radius: 20px;
          background: var(--kz-surface-1);
          border: 1px solid var(--kz-border-subtle);
          text-align: center;
          box-shadow: var(--kz-shadow-sm);
        }

        .cta-title {
          font-family: var(--font-display), system-ui, sans-serif;
          font-size: 22px;
          font-weight: 750;
          letter-spacing: -0.02em;
          color: var(--kz-text-primary);
          margin: 0 0 8px 0;
        }

        .cta-desc {
          font-size: 13.5px;
          color: var(--kz-text-muted);
          margin: 0 0 24px 0;
          line-height: 1.6;
        }

        .cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          border-radius: 9999px;
          font-size: 13.5px;
          font-weight: 600;
          background: var(--kz-accent);
          color: var(--kz-on-accent);
          text-decoration: none;
          font-family: var(--font-display), system-ui, sans-serif;
          transition: transform 150ms ease, opacity 150ms ease;
        }

        .cta-btn:hover {
          transform: translateY(-1px);
          opacity: 0.95;
        }

        /* Responsive styling */
        @media (max-width: 768px) {
          .comparison-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .visual-transition-bridge {
            flex-direction: column !important;
            gap: 12px !important;
          }
          .bridge-arrow-container {
            display: none !important;
          }
          .features-grid {
            grid-template-columns: 1fr;
          }
          .roi-calc-content {
            flex-direction: column;
          }
          .roi-calc-stat-divider {
            width: 80%;
            height: 1px;
          }
          .highlight-stat {
            width: 100%;
          }
          .quebec-links-container {
            flex-direction: column;
          }
          .sidebar-link {
            width: 100%;
            justify-content: space-between;
          }
        }

        @media (max-width: 640px) {
          .uc-sibling-nav {
            grid-template-columns: 1fr !important;
          }
          .uc-mini-nav {
            overflow-x: auto;
            flex-wrap: nowrap !important;
            justify-content: flex-start !important;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .uc-mini-nav::-webkit-scrollbar {
            display: none;
          }
        }
      `}</style>
    </main>
  );
}

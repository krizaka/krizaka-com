import type { Metadata } from "next";
import { buildAlternates } from "@/lib/seo";
import Link from "next/link";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  return {
    title: isEn ? "Privacy Policy — Krizaka" : "Politique de confidentialité — Krizaka",
    description: isEn
      ? "Privacy commitment and compliance under Quebec's Law 25 and GDPR for Orazaka, developed by Krizaka."
      : "Engagement de confidentialité et conformité Loi 25 (Québec) et RGPD pour Orazaka par Krizaka.",
    alternates: buildAlternates(locale, `/privacy`),
  };
}

export default function PrivacyPage() {
  return (
    <main style={{ minHeight: "100dvh", padding: "128px 24px 64px" }}>
      <article style={{ maxWidth: "640px", margin: "0 auto" }}>
        <div style={{ marginBottom: "40px" }}>
          <Link
            href="/"
            style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--kz-accent)", textDecoration: "none" }}
          >
            ← Back to home
          </Link>
          <h1 className="font-display" style={{ fontSize: "32px", fontWeight: 700, letterSpacing: "-0.03em", marginTop: "16px" }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: "13px", color: "var(--kz-text-muted)", marginTop: "8px" }}>
            Last updated: June 2026
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "32px", fontSize: "14px", lineHeight: 1.8, color: "var(--kz-text-secondary)" }}>
          <section>
            <h2 className="font-display" style={{ fontSize: "18px", fontWeight: 700, color: "var(--kz-text-primary)", marginBottom: "12px" }}>
              Our commitment
            </h2>
            <p>
              Krizaka builds sovereign AI infrastructure. Privacy is not a feature
              we add — it is the foundation of our architecture. Orazaka runs
              entirely on your hardware. We have no access to your data, your
              models, or your conversations.
            </p>
          </section>

          <section>
            <h2 className="font-display" style={{ fontSize: "18px", fontWeight: 700, color: "var(--kz-text-primary)", marginBottom: "12px" }}>
              Data collection
            </h2>
            <p>
              This website (krizaka.com) does not use cookies, tracking scripts,
              or analytics. We do not collect personal data through this site.
            </p>
          </section>

          <section>
            <h2 className="font-display" style={{ fontSize: "18px", fontWeight: 700, color: "var(--kz-text-primary)", marginBottom: "12px" }}>
              Orazaka software
            </h2>
            <p>
              Orazaka is self-hosted software. All data processing occurs on your
              infrastructure. No telemetry, no phone-home, no usage tracking.
              If you choose to connect external LLM providers (OpenAI, Anthropic,
              Google), your API keys and data are transmitted directly to those
              providers under their respective privacy policies.
            </p>
          </section>

          <section>
            <h2 className="font-display" style={{ fontSize: "18px", fontWeight: 700, color: "var(--kz-text-primary)", marginBottom: "12px" }}>
              Regulatory compliance
            </h2>
            <p>
              Orazaka&apos;s architecture is designed to comply with{" "}
              <a href="https://www.cai.gouv.qc.ca/espace-evolutif-modernisation-lois/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--kz-accent)", textDecoration: "underline", textUnderlineOffset: "3px" }}>
                Quebec&apos;s Loi 25
              </a>{" "}
              and the{" "}
              <a href="https://eur-lex.europa.eu/eli/reg/2016/679/oj" target="_blank" rel="noopener noreferrer" style={{ color: "var(--kz-accent)", textDecoration: "underline", textUnderlineOffset: "3px" }}>
                EU General Data Protection Regulation (GDPR)
              </a>{" "}
              by ensuring that all personal data processing remains on-premise
              under your control.
            </p>
          </section>

          <section>
            <h2 className="font-display" style={{ fontSize: "18px", fontWeight: 700, color: "var(--kz-text-primary)", marginBottom: "12px" }}>
              Contact
            </h2>
            <p>
              For privacy-related inquiries, reach us through our{" "}
              <a href="https://github.com/krizaka" target="_blank" rel="noopener noreferrer" style={{ color: "var(--kz-accent)", textDecoration: "underline", textUnderlineOffset: "3px" }}>
                GitHub organization
              </a>.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}

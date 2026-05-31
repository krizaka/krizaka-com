import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p style={{ fontSize: "13px", color: "var(--kz-text-muted)", marginTop: "8px" }}>
            Last updated: June 2026
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "32px", fontSize: "14px", lineHeight: 1.8, color: "var(--kz-text-secondary)" }}>
          <section>
            <h2 className="font-display" style={{ fontSize: "18px", fontWeight: 700, color: "var(--kz-text-primary)", marginBottom: "12px" }}>
              Software license
            </h2>
            <p>
              Orasaka is open-source software distributed under the terms of its
              repository license. You may use, modify, and distribute the software
              in accordance with that license. See the{" "}
              <a href="https://github.com/krizaka/orasaka" target="_blank" rel="noopener noreferrer" style={{ color: "var(--kz-accent)", textDecoration: "underline", textUnderlineOffset: "3px" }}>
                GitHub repository
              </a>{" "}
              for full license terms.
            </p>
          </section>

          <section>
            <h2 className="font-display" style={{ fontSize: "18px", fontWeight: 700, color: "var(--kz-text-primary)", marginBottom: "12px" }}>
              Self-hosted responsibility
            </h2>
            <p>
              Orasaka is self-hosted software. You are responsible for your own
              infrastructure, data security, and compliance with applicable laws
              in your jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="font-display" style={{ fontSize: "18px", fontWeight: 700, color: "var(--kz-text-primary)", marginBottom: "12px" }}>
              Third-party services
            </h2>
            <p>
              If you connect external LLM providers (OpenAI, Anthropic, Google)
              through your own API keys, your use of those services is governed
              by their respective terms of service.
            </p>
          </section>

          <section>
            <h2 className="font-display" style={{ fontSize: "18px", fontWeight: 700, color: "var(--kz-text-primary)", marginBottom: "12px" }}>
              No warranty
            </h2>
            <p>
              The software is provided &quot;as is&quot; without warranty of any kind.
              Krizaka makes no guarantees regarding uptime, accuracy, or fitness
              for a particular purpose.
            </p>
          </section>

          <section>
            <h2 className="font-display" style={{ fontSize: "18px", fontWeight: 700, color: "var(--kz-text-primary)", marginBottom: "12px" }}>
              Contact
            </h2>
            <p>
              For legal inquiries, reach us through our{" "}
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

"use client";

import { useState } from "react";
import { ArrowRight, Check, Loader2, ShieldCheck } from "lucide-react";
import { useI18n } from "./I18nProvider";
import type { EditionId } from "@/lib/editions-data";

const COPY = {
  fr: {
    title: "Accès anticipé",
    desc: "Laisse ton courriel — on te contacte quand ton édition est prête. Aucune autre donnée demandée.",
    emailLabel: "Adresse courriel",
    emailPlaceholder: "toi@entreprise.ca",
    editionLabel: "Édition",
    editions: { cloud: "Orasaka Cloud", community: "Orasaka Community" },
    submit: "Rejoindre la liste",
    sending: "Envoi…",
    success: "C'est noté. On te revient bientôt.",
    error: "Une erreur est survenue. Réessaie.",
    invalid: "Courriel invalide.",
    privacy: "Courriel seulement. Aucune revente, jamais.",
  },
  en: {
    title: "Early access",
    desc: "Leave your email — we'll reach out when your edition is ready. No other data asked.",
    emailLabel: "Email address",
    emailPlaceholder: "you@company.ca",
    editionLabel: "Edition",
    editions: { cloud: "Orasaka Cloud", community: "Orasaka Community" },
    submit: "Join the list",
    sending: "Sending…",
    success: "Got it. We'll be in touch soon.",
    error: "Something went wrong. Try again.",
    invalid: "Invalid email.",
    privacy: "Email only. Never sold, ever.",
  },
} as const;

export default function WaitlistInline({
  defaultEdition = "cloud",
  hideTitleDesc = false,
}: {
  defaultEdition?: EditionId;
  hideTitleDesc?: boolean;
}) {
  const { locale } = useI18n();
  const c = COPY[locale];
  const [email, setEmail] = useState("");
  const [edition] = useState<EditionId>(defaultEdition);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error" | "invalid">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("invalid");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, edition, locale }),
      });
      setStatus(res.ok ? "ok" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div
      id="waitlist"
      style={{
        background: "transparent",
        border: "none",
        boxShadow: "none",
        padding: 0,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      {!hideTitleDesc && (
        <>
          <div className="mb-4 flex items-center justify-center gap-2">
            <ShieldCheck size={18} strokeWidth={1.6} style={{ color: "var(--kz-accent)" }} />
            <h3 className="text-lg font-bold" style={{ color: "var(--kz-text-primary)" }}>
              {c.title}
            </h3>
          </div>
          <p className="mb-5 text-sm leading-relaxed" style={{ color: "var(--kz-text-secondary)" }}>
            {c.desc}
          </p>
        </>
      )}

      {status === "ok" ? (
        <p
          className="flex items-center justify-center gap-2 rounded-full border px-6 py-3 text-sm font-medium"
          style={{
            borderColor: "var(--kz-accent)",
            color: "var(--kz-accent)",
            background: "var(--kz-accent-soft)",
            maxWidth: "480px",
            width: "100%",
          }}
          role="status"
        >
          <Check size={16} strokeWidth={2} /> {c.success}
        </p>
      ) : (
        <form onSubmit={onSubmit} style={{ width: "100%", maxWidth: "480px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
            <div className="waitlist-form-group">
              <input
                id="waitlist-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status !== "idle") setStatus("idle");
                }}
                placeholder={c.emailPlaceholder}
                aria-invalid={status === "invalid"}
                aria-label={c.emailLabel}
                className="waitlist-email-input"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="waitlist-submit-btn"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 size={15} className="animate-spin" /> {c.sending}
                  </>
                ) : (
                  <>
                    {c.submit} <ArrowRight size={15} />
                  </>
                )}
              </button>
            </div>
          </div>
          <style>{`
            .waitlist-form-group {
              display: flex;
              flex-direction: row;
              align-items: center;
              gap: 8px;
              width: 100%;
              background: var(--kz-surface-1);
              border: 1px solid var(--kz-border-strong);
              border-radius: 9999px;
              padding: 5px 5px 5px 16px;
              transition: border-color 150ms ease, box-shadow 150ms ease;
            }
            .waitlist-form-group:focus-within {
              border-color: var(--kz-accent);
              box-shadow: 0 0 0 3px var(--kz-accent-soft);
            }
            .waitlist-email-input {
              flex: 1;
              background: transparent;
              border: none;
              color: var(--kz-text-primary);
              font-size: 14px;
              outline: none;
              width: 100%;
              height: 38px;
            }
            .waitlist-submit-btn {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              border-radius: 9999px;
              padding: 10px 20px;
              font-size: 13.5px;
              font-weight: 600;
              background: var(--kz-accent);
              color: var(--kz-on-accent);
              border: none;
              cursor: pointer;
              white-space: nowrap;
              transition: background-color 150ms ease, transform 150ms ease;
            }
            .waitlist-submit-btn:hover {
              background-color: var(--kz-accent-hover, #2563eb);
              transform: translateY(-0.5px);
            }
            @media (max-width: 520px) {
              .waitlist-form-group {
                flex-direction: column !important;
                background: transparent !important;
                border: none !important;
                padding: 0 !important;
                border-radius: 0 !important;
                gap: 10px !important;
                box-shadow: none !important;
              }
              .waitlist-email-input {
                background: var(--kz-surface-1) !important;
                border: 1px solid var(--kz-border-strong) !important;
                border-radius: var(--kz-radius-md) !important;
                padding: 12px 16px !important;
                height: 46px !important;
              }
              .waitlist-email-input:focus {
                border-color: var(--kz-accent) !important;
                box-shadow: 0 0 0 3px var(--kz-accent-soft) !important;
              }
              .waitlist-submit-btn {
                width: 100% !important;
                border-radius: var(--kz-radius-md) !important;
                padding: 12px 24px !important;
                font-size: 14px !important;
              }
            }
          `}</style>
        </form>
      )}

      {status === "invalid" && (
        <p className="mt-2 text-xs" style={{ color: "var(--kz-status-error)" }} role="alert">
          {c.invalid}
        </p>
      )}
      {status === "error" && (
        <p className="mt-2 text-xs" style={{ color: "var(--kz-status-error)" }} role="alert">
          {c.error}
        </p>
      )}
      <p className="mt-3 text-[11px]" style={{ color: "var(--kz-text-muted)" }}>
        {c.privacy}
      </p>
    </div>
  );
}

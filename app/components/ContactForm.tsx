"use client";

/* Contact form → POST /api/contact (lib/contact.ts validates and delivers). */

import { useState } from "react";
import { Send, CheckCircle2, AlertTriangle } from "lucide-react";
import { useI18n } from "./I18nProvider";
import { CONTACT_TOPICS, type ContactTopic } from "@/lib/contact";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm({ defaultTopic = "other" }: { defaultTopic?: ContactTopic }) {
  const { t, locale } = useI18n();
  const c = t.site.contactForm;
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<{ text: string; field?: string } | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, locale }),
      });
      if (res.ok) {
        setStatus("sent");
        form.reset();
        return;
      }
      const body = (await res.json().catch(() => ({}))) as { error?: string; field?: string };
      setStatus("error");
      setError({
        text: body.error === "invalid" ? c.errors.invalid : body.error === "rate_limited" ? c.errors.rate_limited : c.errors.other,
        field: body.field,
      });
    } catch {
      setStatus("error");
      setError({ text: c.errors.other });
    }
  }

  const invalid = (field: string) => (error?.field === field ? true : undefined);

  if (status === "sent") {
    return (
      <div className="kz-contact-done" role="status">
        <CheckCircle2 size={22} aria-hidden /> {c.sent}
        <style>{STYLES}</style>
      </div>
    );
  }

  return (
    <form className="kz-contact-form" onSubmit={onSubmit} noValidate={false}>
      <div className="kz-contact-row">
        <label>
          <span>{c.name}</span>
          <input name="name" required minLength={2} maxLength={120} autoComplete="name" aria-invalid={invalid("name")} />
        </label>
        <label>
          <span>{c.email}</span>
          <input name="email" type="email" required maxLength={200} autoComplete="email" aria-invalid={invalid("email")} />
        </label>
      </div>
      <div className="kz-contact-row">
        <label>
          <span>{c.company}</span>
          <input name="company" maxLength={160} autoComplete="organization" />
        </label>
        <label>
          <span>{c.topic}</span>
          <select name="topic" defaultValue={defaultTopic} aria-invalid={invalid("topic")}>
            {CONTACT_TOPICS.map((t) => (
              <option key={t} value={t}>
                {c.topics[t]}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label>
        <span>{c.message}</span>
        <textarea name="message" required minLength={10} maxLength={5000} rows={6} placeholder={c.placeholder} aria-invalid={invalid("message")} />
      </label>
      {/* Honeypot: hidden from people and assistive tech, filled by bots. */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="kz-contact-hp" />

      {error && (
        <p className="kz-contact-error" role="alert">
          <AlertTriangle size={15} aria-hidden /> {error.text}
        </p>
      )}
      <div className="kz-contact-foot">
        <button type="submit" className="kz-contact-submit btn-sheen" disabled={status === "sending"}>
          <Send size={15} aria-hidden /> {status === "sending" ? c.sending : c.send}
        </button>
        <span>{c.privacy}</span>
      </div>
      <style>{STYLES}</style>
    </form>
  );
}

const STYLES = `
  .kz-contact-form { display:grid; gap:14px; padding:24px; border-radius:20px; background:var(--kz-surface-1); border:1px solid var(--kz-border-subtle); text-align:left; }
  .kz-contact-row { display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 220px), 1fr)); gap:14px; }
  .kz-contact-form label { display:grid; gap:6px; font-size:12.5px; font-weight:600; color:var(--kz-text-secondary); }
  .kz-contact-form input, .kz-contact-form select, .kz-contact-form textarea {
    width:100%; padding:11px 12px; border-radius:10px; font:inherit; font-size:14px; font-weight:400;
    color:var(--kz-text-primary); background:var(--kz-surface-0); border:1px solid var(--kz-border-default); }
  .kz-contact-form textarea { resize:vertical; min-height:130px; }
  .kz-contact-form :is(input,select,textarea):focus-visible { outline:2px solid var(--kz-accent); outline-offset:1px; border-color:transparent; }
  .kz-contact-form [aria-invalid="true"] { border-color:var(--kz-status-error); }
  .kz-contact-hp { position:absolute; left:-10000px; width:1px; height:1px; opacity:0; }
  .kz-contact-error { display:flex; gap:8px; align-items:center; margin:0; font-size:13px; color:var(--kz-status-error); }
  .kz-contact-foot { display:flex; flex-wrap:wrap; align-items:center; gap:14px; }
  .kz-contact-foot span { font-size:12px; color:var(--kz-text-muted); }
  .kz-contact-submit { display:inline-flex; align-items:center; gap:8px; padding:12px 20px; border:0; border-radius:12px; cursor:pointer;
    font:inherit; font-size:14px; font-weight:700; background:var(--kz-accent); color:var(--kz-on-accent); }
  .kz-contact-submit:disabled { opacity:.6; cursor:progress; }
  .kz-contact-done { display:flex; gap:10px; align-items:center; padding:22px; border-radius:20px; font-weight:600;
    background:var(--kz-surface-1); border:1px solid var(--kz-border-subtle); color:var(--kz-text-primary); }
  .kz-contact-done svg { color:var(--kz-status-success); flex-shrink:0; }
`;

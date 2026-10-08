"use client";

/* Contact form → POST /api/contact (lib/contact.ts validates and delivers).
   Three short steps on one screen: what it is about (cards), who to answer, the message.
   Fields are checked when they are left, with the same rules as the server. */

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, ArrowRight, Check, Handshake, Loader2, MessageCircle, RotateCcw } from "lucide-react";
import { useI18n } from "./I18nProvider";
import { format } from "@/lib/i18n";
import { CONTACT_TIMELINES, CONTACT_TOPICS, type ContactTimeline, type ContactTopic } from "@/lib/contact";
import { ProductLogo } from "@krizaka/ui";

type Status = "idle" | "sending" | "sent" | "error";
type Field = "name" | "email" | "message";

const MESSAGE_MAX = 5000;
const EMAIL = /^[^\s@<>()]+@[^\s@<>()]+\.[^\s@<>()]{2,}$/;
const RULES: Record<Field, (v: string) => boolean> = {
  name: (v) => v.trim().length >= 2,
  email: (v) => EMAIL.test(v.trim()),
  message: (v) => v.trim().length >= 10,
};

function TopicIcon({ topic }: { topic: ContactTopic }) {
  if (topic === "orazaka" || topic === "orochia") return <ProductLogo id={topic} size={26} animated={false} />;
  const Icon = topic === "partnership" ? Handshake : MessageCircle;
  return <Icon size={22} strokeWidth={1.75} aria-hidden />;
}

/** A product page links here with ?topic=<product>; the static page renders the default until then. */
export default function ContactForm({ defaultTopic = "orazaka" }: { defaultTopic?: ContactTopic }) {
  return (
    <Suspense fallback={<Form defaultTopic={defaultTopic} />}>
      <FromUrl defaultTopic={defaultTopic} />
    </Suspense>
  );
}

function FromUrl({ defaultTopic }: { defaultTopic: ContactTopic }) {
  const requested = useSearchParams().get("topic");
  const topic = CONTACT_TOPICS.includes(requested as ContactTopic) ? (requested as ContactTopic) : defaultTopic;
  return <Form key={topic} defaultTopic={topic} />;
}

function Form({ defaultTopic }: { defaultTopic: ContactTopic }) {
  const { t, locale } = useI18n();
  const c = t.site.contactForm;
  const [topic, setTopic] = useState<ContactTopic>(defaultTopic);
  const [timeline, setTimeline] = useState<ContactTimeline | null>(null);
  const [values, setValues] = useState({ name: "", email: "", company: "", message: "" });
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<{ text: string; field?: string } | null>(null);
  const [sentTo, setSentTo] = useState({ name: "", email: "" });
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "sent") doneRef.current?.focus();
  }, [status]);

  const invalid = (field: Field) => (touched[field] && !RULES[field](values[field])) || serverError?.field === field;
  const set = (field: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [field]: e.target.value }));
  const leave = (field: Field) => () => setTouched((x) => ({ ...x, [field]: true }));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fields: Field[] = ["name", "email", "message"];
    setTouched({ name: true, email: true, message: true });
    const firstInvalid = fields.find((f) => !RULES[f](values[f]));
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    const website = (new FormData(e.currentTarget).get("website") as string) ?? "";
    setStatus("sending");
    setServerError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, topic, timeline, website, locale }),
      });
      if (res.ok) {
        setSentTo({ name: values.name.trim().split(/\s+/)[0], email: values.email.trim() });
        setStatus("sent");
        return;
      }
      const body = (await res.json().catch(() => ({}))) as { error?: string; field?: string };
      setStatus("error");
      setServerError({
        text: body.error === "invalid" ? c.errors.invalid : body.error === "rate_limited" ? c.errors.rate_limited : c.errors.other,
        field: body.field,
      });
    } catch {
      setStatus("error");
      setServerError({ text: c.errors.other });
    }
  }

  const reset = () => {
    setValues({ name: "", email: "", company: "", message: "" });
    setTouched({});
    setTimeline(null);
    setStatus("idle");
  };

  if (status === "sent") {
    return (
      <div className="kz-cf kz-cf-done" role="status" tabIndex={-1} ref={doneRef}>
        <span className="kz-cf-done-mark" aria-hidden>
          <Check size={26} strokeWidth={2.5} />
        </span>
        <h2>{c.sentTitle}</h2>
        <p>{format(c.sentBody, { name: sentTo.name, email: sentTo.email })}</p>
        <button type="button" className="kz-cf-ghost" onClick={reset}>
          <RotateCcw size={14} aria-hidden /> {c.another}
        </button>
        <style>{STYLES}</style>
      </div>
    );
  }

  const count = values.message.length;

  return (
    <form
      ref={formRef}
      className="kz-cf"
      onSubmit={onSubmit}
      noValidate
      onKeyDown={(e) => {
        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) formRef.current?.requestSubmit();
      }}
    >
      <fieldset className="kz-cf-step">
        <legend>
          <span className="kz-cf-num">1</span> {c.stepTopic}
        </legend>
        <div className="kz-cf-topics" role="radiogroup">
          {CONTACT_TOPICS.map((id) => (
            <label key={id} className="kz-cf-topic" data-selected={topic === id || undefined}>
              <input type="radio" name="topic" value={id} checked={topic === id} onChange={() => setTopic(id)} />
              <span className="kz-cf-topic-icon">
                <TopicIcon topic={id} />
              </span>
              <span className="kz-cf-topic-text">
                <strong>{c.topics[id]}</strong>
                <small>{c.topicHints[id]}</small>
              </span>
              <span className="kz-cf-topic-check" aria-hidden>
                <Check size={12} strokeWidth={3} />
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="kz-cf-step">
        <legend>
          <span className="kz-cf-num">2</span> {c.stepDetails}
        </legend>
        <div className="kz-cf-row">
          <label className="kz-cf-field">
            <span>{c.name}</span>
            <input
              name="name"
              value={values.name}
              onChange={set("name")}
              onBlur={leave("name")}
              maxLength={120}
              autoComplete="name"
              aria-invalid={invalid("name") || undefined}
              aria-describedby={invalid("name") ? "cf-name-error" : undefined}
            />
            {invalid("name") && <em id="cf-name-error">{c.fieldErrors.name}</em>}
          </label>
          <label className="kz-cf-field">
            <span>{c.email}</span>
            <input
              name="email"
              type="email"
              inputMode="email"
              value={values.email}
              onChange={set("email")}
              onBlur={leave("email")}
              maxLength={200}
              autoComplete="email"
              aria-invalid={invalid("email") || undefined}
              aria-describedby={invalid("email") ? "cf-email-error" : undefined}
            />
            {invalid("email") && <em id="cf-email-error">{c.fieldErrors.email}</em>}
          </label>
        </div>
        <label className="kz-cf-field">
          <span>
            {c.company} <i>— {c.optional}</i>
          </span>
          <input name="company" value={values.company} onChange={set("company")} maxLength={160} autoComplete="organization" />
        </label>
      </fieldset>

      <fieldset className="kz-cf-step">
        <legend>
          <span className="kz-cf-num">3</span> {c.stepMessage}
        </legend>
        <div className="kz-cf-field">
          <span id="cf-timeline">
            {c.timeline} <i>— {c.optional}</i>
          </span>
          <div className="kz-cf-chips" role="group" aria-labelledby="cf-timeline">
            {CONTACT_TIMELINES.map((id) => (
              <button
                key={id}
                type="button"
                className="kz-cf-chip"
                aria-pressed={timeline === id}
                onClick={() => setTimeline((current) => (current === id ? null : id))}
              >
                {c.timelines[id]}
              </button>
            ))}
          </div>
        </div>
        <label className="kz-cf-field">
          <span>{c.message}</span>
          <textarea
            name="message"
            value={values.message}
            onChange={set("message")}
            onBlur={leave("message")}
            maxLength={MESSAGE_MAX}
            rows={6}
            placeholder={c.placeholders[topic]}
            aria-invalid={invalid("message") || undefined}
            aria-describedby={invalid("message") ? "cf-message-error" : "cf-message-count"}
          />
          <span className="kz-cf-under">
            {invalid("message") ? <em id="cf-message-error">{c.fieldErrors.message}</em> : <span className="kz-cf-hint">{c.shortcut}</span>}
            <span id="cf-message-count" className="kz-cf-count" data-near={count > MESSAGE_MAX * 0.9 || undefined}>
              {format(c.counter, { count: count.toLocaleString(locale), max: MESSAGE_MAX.toLocaleString(locale) })}
            </span>
          </span>
        </label>
      </fieldset>

      {/* Honeypot: hidden from people and assistive tech, filled by bots. */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="kz-cf-hp" />

      {serverError && (
        <p className="kz-cf-error" role="alert">
          <AlertTriangle size={15} aria-hidden /> {serverError.text}
        </p>
      )}

      <div className="kz-cf-foot">
        <button type="submit" className="kz-cf-submit btn-sheen" disabled={status === "sending"}>
          {status === "sending" ? <Loader2 size={16} className="kz-cf-spin" aria-hidden /> : null}
          {status === "sending" ? c.sending : c.send}
          {status !== "sending" && <ArrowRight size={16} aria-hidden />}
        </button>
        <span>{c.privacy}</span>
      </div>
      <style>{STYLES}</style>
    </form>
  );
}

const STYLES = `
  .kz-cf { display:grid; gap:28px; padding:clamp(20px, 3vw, 32px); border-radius:22px; text-align:left;
    background:var(--kz-surface-1); border:1px solid var(--kz-border-subtle); }
  .kz-cf-step { display:grid; gap:14px; margin:0; padding:0; border:0; min-width:0; }
  .kz-cf-step legend { display:flex; align-items:center; gap:10px; padding:0; margin-bottom:14px;
    font-family:var(--font-display), system-ui, sans-serif; font-size:15px; font-weight:700; color:var(--kz-text-primary); }
  .kz-cf-num { display:inline-grid; place-items:center; width:22px; height:22px; border-radius:50%; font-size:11.5px; font-weight:700;
    color:var(--kz-accent); border:1px solid color-mix(in srgb, var(--kz-accent) 45%, transparent); }

  .kz-cf-topics { display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 230px), 1fr)); gap:10px; }
  .kz-cf-topic { position:relative; display:flex; align-items:flex-start; gap:12px; padding:14px; border-radius:14px; cursor:pointer;
    background:var(--kz-surface-0); border:1px solid var(--kz-border-default);
    transition:border-color 160ms ease, background-color 160ms ease, transform 160ms ease; }
  .kz-cf-topic:hover { border-color:color-mix(in srgb, var(--kz-accent) 50%, var(--kz-border-default)); transform:translateY(-1px); }
  .kz-cf-topic input { position:absolute; opacity:0; pointer-events:none; }
  .kz-cf-topic:has(input:focus-visible) { outline:2px solid var(--kz-accent); outline-offset:2px; }
  .kz-cf-topic[data-selected] { border-color:var(--kz-accent); background:color-mix(in srgb, var(--kz-accent) 7%, var(--kz-surface-0)); }
  .kz-cf-topic-icon { display:grid; place-items:center; width:36px; height:36px; flex-shrink:0; border-radius:10px;
    color:var(--kz-text-secondary); background:var(--kz-surface-2); }
  .kz-cf-topic[data-selected] .kz-cf-topic-icon { color:var(--kz-accent); }
  .kz-cf-topic-text { display:grid; gap:3px; min-width:0; padding-right:18px; }
  .kz-cf-topic-text strong { font-size:14px; color:var(--kz-text-primary); }
  .kz-cf-topic-text small { font-size:12.5px; line-height:1.45; color:var(--kz-text-muted); }
  .kz-cf-topic-check { position:absolute; top:10px; right:10px; display:grid; place-items:center; width:18px; height:18px; border-radius:50%;
    color:var(--kz-on-accent); background:var(--kz-accent); opacity:0; transform:scale(.6); transition:opacity 160ms ease, transform 160ms ease; }
  .kz-cf-topic[data-selected] .kz-cf-topic-check { opacity:1; transform:scale(1); }

  .kz-cf-row { display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 220px), 1fr)); gap:14px; }
  .kz-cf-field { display:grid; gap:7px; font-size:12.5px; font-weight:600; color:var(--kz-text-secondary); }
  .kz-cf-field i { font-style:normal; font-weight:400; color:var(--kz-text-muted); }
  .kz-cf input:not([type=radio]), .kz-cf textarea {
    width:100%; padding:12px 14px; border-radius:12px; font:inherit; font-size:15px; font-weight:400;
    color:var(--kz-text-primary); background:var(--kz-surface-0); border:1px solid var(--kz-border-default);
    transition:border-color 160ms ease, box-shadow 160ms ease; }
  .kz-cf textarea { resize:vertical; min-height:150px; line-height:1.6; }
  .kz-cf textarea::placeholder { color:var(--kz-text-muted); }
  .kz-cf :is(input,textarea):focus-visible { outline:none; border-color:var(--kz-accent);
    box-shadow:0 0 0 3px color-mix(in srgb, var(--kz-accent) 22%, transparent); }
  .kz-cf [aria-invalid="true"] { border-color:var(--kz-status-error); }
  .kz-cf-field em, .kz-cf-under em { font-style:normal; font-weight:500; font-size:12.5px; color:var(--kz-status-error); }
  .kz-cf-under { display:flex; justify-content:space-between; gap:12px; font-weight:400; }
  .kz-cf-hint { font-size:12px; color:var(--kz-text-muted); }
  .kz-cf-count { margin-left:auto; font-family:var(--font-mono, monospace); font-size:11.5px; color:var(--kz-text-muted); }
  .kz-cf-count[data-near] { color:var(--kz-status-error); }

  .kz-cf-chips { display:flex; flex-wrap:wrap; gap:8px; }
  .kz-cf-chip { padding:8px 14px; border-radius:999px; font:inherit; font-size:13px; font-weight:500; cursor:pointer;
    color:var(--kz-text-secondary); background:var(--kz-surface-0); border:1px solid var(--kz-border-default);
    transition:border-color 160ms ease, color 160ms ease, background-color 160ms ease; }
  .kz-cf-chip:hover { color:var(--kz-text-primary); }
  .kz-cf-chip[aria-pressed="true"] { color:var(--kz-accent); border-color:var(--kz-accent);
    background:color-mix(in srgb, var(--kz-accent) 8%, var(--kz-surface-0)); }
  .kz-cf-chip:focus-visible { outline:2px solid var(--kz-accent); outline-offset:2px; }

  .kz-cf-hp { position:absolute; left:-10000px; width:1px; height:1px; opacity:0; }
  .kz-cf-error { display:flex; gap:8px; align-items:center; margin:0; font-size:13px; color:var(--kz-status-error); }
  .kz-cf-foot { display:flex; flex-wrap:wrap; align-items:center; gap:14px 18px; padding-top:4px; }
  .kz-cf-foot > span { font-size:12px; color:var(--kz-text-muted); }
  .kz-cf-submit { display:inline-flex; align-items:center; justify-content:center; gap:10px; padding:14px 24px; border:0; border-radius:12px;
    cursor:pointer; font:inherit; font-size:15px; font-weight:700; background:var(--kz-accent); color:var(--kz-on-accent);
    transition:transform 150ms ease; }
  .kz-cf-submit:hover:not(:disabled) { transform:translateY(-1px); }
  .kz-cf-submit:disabled { opacity:.7; cursor:progress; }
  .kz-cf-submit:focus-visible { outline:2px solid var(--kz-accent); outline-offset:3px; }
  .kz-cf-spin { animation:kz-cf-spin 900ms linear infinite; }
  @keyframes kz-cf-spin { to { transform:rotate(360deg); } }
  @media (max-width:560px) { .kz-cf-submit { width:100%; } }

  .kz-cf-done { justify-items:center; text-align:center; gap:12px; padding:clamp(32px, 6vw, 56px) 24px; outline:none; }
  .kz-cf-done h2 { margin:6px 0 0; font-family:var(--font-display), system-ui, sans-serif; font-size:22px; color:var(--kz-text-primary); }
  .kz-cf-done p { margin:0; max-width:420px; font-size:15px; line-height:1.6; color:var(--kz-text-secondary); }
  .kz-cf-done-mark { display:grid; place-items:center; width:56px; height:56px; border-radius:50%;
    color:var(--kz-status-success); background:color-mix(in srgb, var(--kz-status-success) 14%, transparent);
    animation:kz-cf-pop 420ms cubic-bezier(.16,1,.3,1) both; }
  @keyframes kz-cf-pop { from { transform:scale(.5); opacity:0; } to { transform:scale(1); opacity:1; } }
  .kz-cf-ghost { display:inline-flex; align-items:center; gap:8px; margin-top:8px; padding:10px 16px; border-radius:10px; cursor:pointer;
    font:inherit; font-size:13px; font-weight:600; color:var(--kz-text-secondary); background:transparent; border:1px solid var(--kz-border-default); }
  .kz-cf-ghost:hover { color:var(--kz-text-primary); border-color:var(--kz-border-strong); }

  @media (prefers-reduced-motion: reduce) {
    .kz-cf *, .kz-cf-done-mark { animation:none !important; transition:none !important; }
  }
`;

"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Mascot } from "@krizaka/ui/mascots";
import { ChatIcon, FlagIcon } from "@krizaka/icons";
import SiteBar from "../../components/SiteBar";
import { useI18n } from "../../components/I18nProvider";
import ContactForm from "../../components/ContactForm";
import { reveal } from "@/lib/motion";
import { PageHero } from "@krizaka/ui/page-hero";
import { Button } from "@krizaka/ui/button";
import {
  foldFromAddress,
  subscribeToBusinessAnchor,
  subscribeToHash,
  SUPPORT_FALLBACK_PRESET,
} from "@/lib/contact-fold";
import Link from "next/link";
import PublicChannelList from "../../components/PublicChannelList";
import type { ChannelGroup, ChannelKind } from "@/lib/public-channels";

/* ─── Mascots: the owl answers questions, the falcon watches over bugs (@krizaka/ui/mascots, story colours) ─── */
function OwlMascot() {
  return <Mascot bird="owl" mood="welcome" tone="own" size={64} />;
}

function FalconMascot() {
  return <Mascot bird="falcon" mood="thinking" tone="own" size={64} />;
}

/* ─── Where each conversation happens: the products, and the building blocks they share ─── */

/* ─── Channel data ─── */
const CHANNELS = [
  {
    id: "discussions",
    Icon: ChatIcon,
    Mascot: OwlMascot,
    accent: "var(--kz-info-text)",
    glow: "color-mix(in srgb, var(--kz-info) 8%, transparent)",
    kind: "discussions" as ChannelKind,
    anchor: "questions",
  },
  {
    id: "issues",
    Icon: FlagIcon,
    Mascot: FalconMascot,
    accent: "var(--kz-warning-text)",
    glow: "color-mix(in srgb, var(--kz-warning) 8%, transparent)",
    kind: "issues" as ChannelKind,
    anchor: "bugs",
  },
];

export default function ContactClient({ groups }: Readonly<{ groups: ChannelGroup[] }>) {
  const { t } = useI18n();
  const page = t.site.contactPage;
  // Arrival: the address decides (the static page renders folded; the browser's address opens it). A click overrides it.
  const arrivalOpen = useSyncExternalStore(subscribeToHash, foldFromAddress, () => false);
  const [chosen, setChosen] = useState<boolean | null>(null);
  // The form is mounted on the first opening and kept afterwards: what was typed survives a fold.
  const [kept, setKept] = useState(false);
  const [fallback, setFallback] = useState(false);
  const businessTitle = useRef<HTMLHeadingElement>(null);
  const open = chosen ?? arrivalOpen;
  const mounted = open || kept;

  useEffect(() => {
    if (arrivalOpen) {
      businessTitle.current?.focus();
    }
  }, [arrivalOpen]);

  useEffect(
    () =>
      subscribeToBusinessAnchor(() => {
        setChosen(true);
        businessTitle.current?.focus();
      }),
    [],
  );

  const toggle = () => {
    setKept(true);
    setChosen(!open);
  };
  const writeToSupport = () => {
    setFallback(true);
    setChosen(true);
    businessTitle.current?.focus();
  };

  // Only keep the first 2 channels (Questions & Bugs)
  const channels = t.contact.channels.slice(0, 2);

  return (
    <main className="min-h-screen" style={{ background: "var(--kz-surface-0)" }}>
      <SiteBar />

      {/* The first screen of the page language (painted at once, no entrance: LCP); the flamingo answers. */}
      <PageHero
        eyebrow={page.eyebrow}
        title={page.title}
        lead={page.lead}
        aside={<Mascot bird="flamingo" mood="welcome" size={112} />}
        linkAs={Link}
      />

      <div className="kz-frame" style={{ paddingBlock: "32px 80px" }}>
        {/* ─── The sorter: three doors, the first screen at 360 px ─── */}
        <nav aria-label={page.sorterLabel} className="contact-sorter">
          <ul>
            {page.sorter.map((row) => (
              <li key={row.href}>
                <a href={row.href}>
                  <strong>{row.title}</strong>
                  <span>{row.text}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* #public: /open-source's "contribute" lands here — a discussion or an issue, on the right repository. */}
        <h2
          id="public"
          style={{
            scrollMarginTop: "var(--kz-anchor-offset, 96px)",
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "18px",
            fontWeight: 700,
            color: "var(--kz-text-primary)",
            margin: "0 0 6px",
          }}
        >
          {page.publicTitle}
        </h2>
        <p style={{ fontSize: "14px", color: "var(--kz-text-secondary)", margin: "0 0 20px" }}>{page.publicLead}</p>

        {/* ─── Two channels, each a grouped list: Products · Open source ─── */}
        <div
          className="contact-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "20px",
            marginBottom: "48px",
          }}
        >
          {channels.map((ch, index) => {
            const channelDef = CHANNELS[index];
            if (!channelDef) return null;
            const { Mascot, Icon, accent, glow, kind } = channelDef;
            return (
              <div
                key={ch.kind}
                id={channelDef.anchor}
                className="contact-card"
                {...reveal(index)}
                style={{
                  ...reveal(index).style,
                  ["--ch" as string]: accent,
                  ["--ch-glow" as string]: glow,
                  display: "flex",
                  flexDirection: "column",
                  padding: "28px 24px 20px",
                  borderRadius: "0",
                  border: "1px solid var(--kz-border-subtle)",
                  background: "var(--kz-surface-1)",
                  boxShadow: "var(--kz-shadow-md)",
                  minWidth: 0,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
                  <Mascot />
                  <div style={{ minWidth: 0 }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        fontFamily: "var(--font-mono, monospace)",
                        fontSize: "10px",
                        fontWeight: 700,
                        color: "var(--kz-text-secondary)",
                      }}
                    >
                      <span style={{ color: accent, display: "flex" }}>
                        <Icon size={14} aria-hidden />
                      </span>{" "}
                      GitHub
                    </span>
                    <h3
                      style={{
                        fontFamily: "var(--font-display), system-ui, sans-serif",
                        fontSize: "17px",
                        fontWeight: 700,
                        color: "var(--kz-text-primary)",
                        margin: "2px 0 0",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {ch.title}
                    </h3>
                  </div>
                </div>
                <p style={{ fontSize: "13px", color: "var(--kz-text-secondary)", lineHeight: 1.6, margin: "0 0 16px" }}>
                  {ch.desc}
                </p>
                <PublicChannelList groups={groups} kind={kind} words={page} />
              </div>
            );
          })}
        </div>

        <p className="contact-note">{page.publicNote}</p>
        <p className="contact-noaccount">
          {page.noAccountText}{" "}
          <Button type="button" variant="ghost" size="sm" onClick={writeToSupport}>
            {page.noAccountLink}
          </Button>
        </p>

        {/* ─── The business request: folded, opened by one clear step ─── */}
        <section id="business" aria-labelledby="business-title" className="contact-business">
          <h2 id="business-title" ref={businessTitle} tabIndex={-1}>
            {page.businessTitle}
          </h2>
          <p>{page.businessLead}</p>
          <Button type="button" variant="outline" aria-expanded={open} aria-controls="business-panel" onClick={toggle}>
            {page.businessToggle}
          </Button>
          <div id="business-panel" hidden={!open} className="contact-main">
            {mounted && <ContactForm defaultPreset={fallback ? SUPPORT_FALLBACK_PRESET : undefined} />}
            <aside className="contact-next" aria-labelledby="contact-next-title">
              <h3 id="contact-next-title">{page.nextTitle}</h3>
              <ol>
                {page.nextSteps.map((step, i) => (
                  <li key={step.title}>
                    <span className="contact-next-num">{i + 1}</span>
                    <div>
                      <strong>{step.title}</strong>
                      <p>{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <ul className="contact-facts">
                {page.facts.map((fact) => (
                  <li key={fact}>{fact}</li>
                ))}
              </ul>
            </aside>
          </div>
        </section>
      </div>

      <style>{`
        .contact-sorter ul { list-style: none; margin: 0 0 40px; padding: 0; display: grid; gap: 8px; }
        .contact-sorter a { display: grid; gap: 2px; padding: 12px 16px; border: 1px solid var(--kz-border-default); background: var(--kz-surface-1);
          color: var(--kz-text-primary); text-decoration: none; }
        .contact-sorter a:hover { border-color: var(--kz-border-strong); background: var(--kz-surface-2); }
        .contact-sorter strong { font-size: 15px; }
        .contact-sorter span { font-size: 13px; color: var(--kz-text-secondary); }
        @media (min-width: 720px) { .contact-sorter ul { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
        .contact-card, .contact-business { scroll-margin-top: var(--kz-anchor-offset, 96px); }
        .contact-note { margin: 0 0 8px; font-size: 13px; color: var(--kz-text-secondary); }
        .contact-noaccount { margin: 0 0 56px; font-size: 14px; color: var(--kz-text-secondary); }
        .contact-business { border-top: 1px solid var(--kz-border-subtle); padding-top: 40px; display: grid; gap: 14px; justify-items: start; }
        .contact-business h2 { margin: 0; font-family: var(--font-display), system-ui, sans-serif; font-size: 22px; font-weight: 700; color: var(--kz-text-primary); }
        .contact-business > p { margin: 0; max-width: 62ch; font-size: 14px; line-height: 1.6; color: var(--kz-text-secondary); }
        .contact-business .contact-main { justify-self: stretch; margin: 12px 0 0; }
        .contact-business .contact-main[hidden] { display: none; }

        /* The channel cards answer the pointer, and their mascot wakes up (still otherwise: nothing loops by itself). */
        .contact-card { transition: border-color 250ms var(--kz-ease), box-shadow 250ms var(--kz-ease), transform 250ms var(--kz-ease), opacity .8s var(--kz-ease), filter .8s var(--kz-ease); }
        @media (hover: hover) {
          .contact-card:hover { border-color: var(--kz-border-strong) !important; background: var(--kz-surface-2); }
          .contact-card:hover .ct-blink { animation: ct-blink 4s infinite; }
          .contact-card:hover .ct-sway { animation: ct-sway 2.8s ease-in-out infinite; }
          .contact-card:hover .ct-sway-rev, .contact-card:hover .ct-flap-rev { animation-direction: reverse; }
          .contact-card:hover .ct-scan { animation: ct-scan 2.2s ease-in-out infinite; }
          .contact-card:hover .ct-flap { animation: ct-flap 3.2s ease-in-out infinite; }
        }
        @keyframes ct-blink { 0%, 43%, 50%, 100% { opacity: 1; } 46% { opacity: .1; } }
        @keyframes ct-sway { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }
        @keyframes ct-scan { 0%, 100% { opacity: .3; } 50% { opacity: 1; } }
        @keyframes ct-flap { 0%, 100% { transform: rotate(-4deg); } 50% { transform: rotate(4deg); } }
        @media (prefers-reduced-motion: reduce) {
          .contact-card { transition: none; }
          .contact-card :is(.ct-blink, .ct-sway, .ct-scan, .ct-flap) { animation: none !important; }
        }

        .contact-main { display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(260px, 1fr); gap: clamp(24px, 4vw, 48px);
          align-items: start; }
        .contact-next { position: sticky; top: 110px; padding: 8px 0; }
        .contact-next h3 { margin: 0 0 20px; font-family: var(--font-display), system-ui, sans-serif; font-size: 16px; font-weight: 700; color: var(--kz-text-primary); }
        .contact-next ol { position: relative; margin: 0; padding: 0; list-style: none; display: grid; gap: 22px; }
        .contact-next ol::before { content: ""; position: absolute; left: 13px; top: 8px; bottom: 8px; width: 1px; background: var(--kz-border-default); }
        .contact-next li { position: relative; display: flex; gap: 14px; }
        .contact-next-num { position: relative; z-index: 1; display: grid; place-items: center; width: 27px; height: 27px; flex-shrink: 0; border-radius: 50%;
          font-size: 12px; font-weight: 700; color: var(--kz-accent); background: var(--kz-surface-0); border: 1px solid color-mix(in srgb, var(--kz-accent) 45%, transparent); }
        .contact-next strong { display: block; font-size: 14px; color: var(--kz-text-primary); margin: 3px 0 4px; }
        .contact-next p { margin: 0; font-size: 13.5px; line-height: 1.6; color: var(--kz-text-secondary); }
        .contact-facts { margin: 28px 0 0; padding: 18px 0 0; list-style: none; display: grid; gap: 8px; border-top: 1px solid var(--kz-border-subtle); }
        .contact-facts li { font-size: 13px; color: var(--kz-text-secondary); }
        @media (max-width: 900px) {
          .contact-main { grid-template-columns: 1fr; }
          .contact-next { position: static; }
        }

        @media (max-width: 640px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}

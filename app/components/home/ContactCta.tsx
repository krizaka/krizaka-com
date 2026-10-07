"use client";

/* Closing call to action — the same on the home page and every product page: write to the team. */

import { useI18n } from "../I18nProvider";
import ContactForm from "../ContactForm";
import type { ContactTopic } from "@/lib/contact";

export default function ContactCta({ topic = "other" }: { topic?: ContactTopic }) {
  const { locale } = useI18n();
  const fr = locale === "fr";
  return (
    <section id="contact" className="kz-section kz-cta">
      <div className="kz-cta-copy">
        <p className="kz-eyebrow">{fr ? "Travaillons ensemble" : "Work with us"}</p>
        <h2 className="kz-h2">{fr ? "Un projet, une question, un déploiement ?" : "A project, a question, a deployment?"}</h2>
        <p>
          {fr
            ? "Nous déployons et adaptons nos plateformes chez vous, et concevons les briques qui leur manquent. Décrivez votre besoin : un ingénieur vous répond, pas un robot."
            : "We deploy and adapt our platforms on your infrastructure, and build the pieces they are missing. Tell us what you need: an engineer replies, not a bot."}
        </p>
        <ul>
          <li>{fr ? "Réponse sous deux jours ouvrables" : "Reply within two business days"}</li>
          <li>{fr ? "Montréal · Loi 25 · RGPD" : "Montréal · Law 25 · GDPR"}</li>
          <li>{fr ? "Code ouvert, sans enfermement" : "Open code, no lock-in"}</li>
        </ul>
      </div>
      <ContactForm defaultTopic={topic} />
      <style>{`
        .kz-cta { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 380px), 1fr)); gap: clamp(24px, 4vw, 48px); align-items: start; }
        .kz-cta-copy p:not(.kz-eyebrow) { font-size: 15px; line-height: 1.7; color: var(--kz-text-secondary); margin: 0; }
        .kz-cta-copy ul { margin: 18px 0 0; padding: 0; list-style: none; display: grid; gap: 8px; }
        .kz-cta-copy li { position: relative; padding-left: 18px; font-size: 14px; color: var(--kz-text-secondary); }
        .kz-cta-copy li::before { content: ""; position: absolute; left: 0; top: .55em; width: 7px; height: 7px; border-radius: 50%; background: var(--kz-accent); }
      `}</style>
    </section>
  );
}

"use client";

import { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

/* ─── LEGAL CONTENT ─── */

const LEGAL_CONTENT: Record<string, { title: string; body: string }> = {
  terms: {
    title: "TERMS OF SERVICE",
    body: `KRIZAKA CORP — TERMS OF SERVICE

Effective Date: 2025-01-01

1. ACCEPTANCE OF TERMS
By accessing or using any services provided by Krizaka Corp ("Company"), you agree to be bound by these Terms of Service. If you do not agree, you must discontinue use immediately.

2. SERVICE DESCRIPTION
Krizaka Corp operates the Orasaka Core platform — a multi-agent AI orchestration engine. Access is provided on an invitation-only basis during the current deployment phase.

3. ELIGIBILITY
You must be at least 18 years of age and have the legal capacity to enter into binding agreements in your jurisdiction.

4. INTELLECTUAL PROPERTY
All software, designs, documentation, and content are the exclusive property of Krizaka Corp and are protected by international intellectual property laws.

5. LIMITATION OF LIABILITY
The platform is provided "as is" without warranty of any kind. Krizaka Corp shall not be liable for any indirect, incidental, or consequential damages arising from use of the service.

6. MODIFICATIONS
Krizaka Corp reserves the right to modify these terms at any time. Continued use constitutes acceptance of modified terms.

7. GOVERNING LAW
These terms shall be governed by and construed in accordance with applicable international commercial law.`,
  },
  privacy: {
    title: "PRIVACY POLICY",
    body: `KRIZAKA CORP — PRIVACY POLICY

Effective Date: 2025-01-01

1. DATA COLLECTION
We collect only the minimum data necessary to operate our services: email addresses for waitlist registration and anonymized usage telemetry.

2. DATA USE
Collected data is used exclusively for service operation, security monitoring, and communication regarding platform availability.

3. DATA STORAGE
All data is encrypted at rest using AES-256 and in transit using TLS 1.3. Data is stored in sovereign infrastructure with strict access controls.

4. THIRD-PARTY SHARING
We do not sell, rent, or share personal data with third parties. Data may be disclosed only when required by law.

5. DATA RETENTION
Waitlist data is retained until the platform enters general availability or until you request deletion, whichever comes first.

6. YOUR RIGHTS
You may request access to, correction of, or deletion of your personal data at any time by contacting privacy@krizaka.com.

7. COOKIES
Our platform uses only essential technical cookies required for operation. No tracking or advertising cookies are deployed.`,
  },
  encryption: {
    title: "ENCRYPTION MANIFEST",
    body: `KRIZAKA CORP — ENCRYPTION MANIFEST

Protocol Version: 5.0.0

1. TRANSPORT LAYER SECURITY
All communications use TLS 1.3 with forward secrecy. Legacy protocols (TLS 1.0, 1.1, 1.2) are permanently disabled.

2. DATA AT REST
All persistent data is encrypted using AES-256-GCM. Encryption keys are managed through a dedicated HSM (Hardware Security Module) infrastructure.

3. KEY MANAGEMENT
Cryptographic keys are rotated on a 90-day cycle. Key derivation uses HKDF-SHA512 with unique per-session salts.

4. AUTHENTICATION TOKENS
Session tokens use Ed25519 digital signatures. Token lifetime is capped at 3600 seconds with automatic rotation.

5. PASSWORD HASHING
User credentials are hashed using bcrypt with a minimum cost factor of 12. Plain-text passwords are never stored or logged.

6. AUDIT TRAIL
All cryptographic operations are logged to an append-only audit ledger with tamper-evident checksums.

7. COMPLIANCE
Our encryption practices meet or exceed requirements of SOC 2 Type II, ISO 27001, and GDPR Article 32 (Security of Processing).`,
  },
};

/* ─── LEGAL MODAL COMPONENT ─── */

export type LegalDocType = "terms" | "privacy" | "encryption";

interface LegalModalProps {
  docType: LegalDocType | null;
  onClose: () => void;
}

export default function LegalModal({ docType, onClose }: LegalModalProps) {
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  return (
    <AnimatePresence>
      {docType && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="legal-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-2xl max-h-[80vh] border border-kz-technical-line/40 bg-kz-surface-dim overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-kz-technical-line/30">
              <h2
                id="legal-modal-title"
                className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-kz-primary-container"
              >
                {LEGAL_CONTENT[docType].title}
              </h2>
              <button
                onClick={onClose}
                id="legal-modal-close"
                className="font-mono text-[9px] font-bold tracking-[0.15em] uppercase text-kz-technical-line hover:text-kz-primary transition-colors duration-200 flex items-center gap-1.5 cursor-pointer"
              >
                <span>[ CLOSE ]</span>
                <X className="w-3 h-3" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 overflow-y-auto max-h-[calc(80vh-56px)]">
              <pre className="font-mono text-[10px] md:text-[11px] leading-relaxed text-kz-on-surface-variant whitespace-pre-wrap break-words">
                {LEGAL_CONTENT[docType].body}
              </pre>
            </div>

            {/* Tech corner accents */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-kz-primary-container/30" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-kz-primary-container/30" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

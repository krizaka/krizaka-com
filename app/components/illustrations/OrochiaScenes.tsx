"use client";

/* Orochia scenes, cast from the Krizaka mascots (same family as KrizakaComplianceIllustration /
   KrizakaDemosIllustration):
   - SignedDeliveryScene: the carrier pigeon flies a sealed parcel (the signed webhook) from the
     payment gateway to Orochia's ledger — payments are confirmed by the gateway, never the client.
   - ComplianceSentryScene: the falcon sentry guards the 2257 records vault; reports are persisted.
   - WatchPartyScene: the flamingo and the owl in front of a player streaming through signed URLs.
   Motion stops under prefers-reduced-motion (static, readable composition). */

import { useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "framer-motion";
import CarrierPigeonBot from "./CarrierPigeonBot";
import MartinFalconSentry from "./MartinFalconSentry";
import { FlamingoAvatar, OwlAvatar, MascotStyles } from "./MascotAvatars";

const noop = () => () => {};
function useStill() {
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const reduce = useReducedMotion();
  return !mounted || !!reduce;
}

const frame: React.CSSProperties = {
  position: "relative",
  width: "100%",
  height: "100%",
  minHeight: 220,
  overflow: "hidden",
  borderRadius: 18,
  border: "1px solid var(--kz-border-subtle)",
  background: "radial-gradient(ellipse at 50% 120%, color-mix(in srgb, #d946ef 14%, transparent), transparent 60%), var(--kz-surface-1)",
};

const chip = (color: string): React.CSSProperties => ({
  position: "absolute",
  padding: "8px 12px",
  borderRadius: 12,
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  fontWeight: 700,
  color: "var(--kz-text-primary)",
  background: "var(--kz-surface-2)",
  border: `1px solid color-mix(in srgb, ${color} 55%, transparent)`,
  boxShadow: `0 0 24px color-mix(in srgb, ${color} 25%, transparent)`,
});

export function SignedDeliveryScene() {
  const still = useStill();
  return (
    <div style={frame} aria-hidden>
      <svg viewBox="0 0 400 240" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} preserveAspectRatio="none">
        <path d="M70 170 Q200 30 330 170" fill="none" stroke="var(--kz-border-strong)" strokeWidth="1.5" strokeDasharray="5 7" />
      </svg>
      <div style={{ ...chip("#10b981"), left: "6%", bottom: "14%" }}>Gateway</div>
      <div style={{ ...chip("#a855f7"), right: "6%", bottom: "14%" }}>Ledger ✓</div>
      <motion.div
        style={{ position: "absolute", left: "50%", top: "44%", x: "-50%", y: "-50%" }}
        animate={still ? undefined : { left: ["14%", "50%", "84%"], top: ["66%", "18%", "66%"], rotate: [-8, 0, 8] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.6 }}
      >
        <CarrierPigeonBot size={92} />
      </motion.div>
      <motion.div
        style={{ position: "absolute", right: "9%", top: "26%", fontFamily: "var(--font-mono)", fontSize: 10.5, fontWeight: 700, color: "#10b981" }}
        animate={still ? undefined : { opacity: [0, 0, 1, 1, 0], y: [6, 6, 0, 0, -4] }}
        transition={{ duration: 4.8, repeat: Infinity, times: [0, 0.7, 0.8, 0.95, 1] }}
      >
        HMAC ✓ settled once
      </motion.div>
    </div>
  );
}

export function ComplianceSentryScene() {
  const still = useStill();
  return (
    <div style={frame} aria-hidden>
      <div
        style={{
          position: "absolute", right: "12%", top: "18%", width: 120, height: 140, borderRadius: 16,
          background: "linear-gradient(160deg, var(--kz-surface-2), var(--kz-surface-1))", border: "1px solid var(--kz-border-default)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6,
        }}
      >
        <motion.div
          style={{ width: 54, height: 54, borderRadius: "50%", border: "3px solid #f59e0b", display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: 13, color: "#f59e0b" }}
          animate={still ? undefined : { rotate: [0, 90, 90, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          2257
        </motion.div>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--kz-text-muted)" }}>RECORDS VAULT</span>
      </div>
      <div style={{ ...chip("#f43f5e"), left: "8%", top: "12%" }}>18+</div>
      <motion.div
        style={{ position: "absolute", left: "16%", bottom: "4%" }}
        animate={still ? undefined : { y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <MartinFalconSentry size={150} />
      </motion.div>
    </div>
  );
}

export function WatchPartyScene() {
  const still = useStill();
  return (
    <div style={frame} aria-hidden>
      <MascotStyles />
      <div
        style={{
          position: "absolute", left: "50%", top: "16%", transform: "translateX(-50%)", width: "58%", aspectRatio: "16 / 9", borderRadius: 12,
          background: "linear-gradient(135deg, #7c3aed, #d946ef 55%, #f472b6)", boxShadow: "0 0 40px color-mix(in srgb, #d946ef 35%, transparent)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <motion.div
          style={{ width: 0, height: 0, borderTop: "14px solid transparent", borderBottom: "14px solid transparent", borderLeft: "22px solid white", marginLeft: 6 }}
          animate={still ? undefined : { scale: [1, 1.15, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
        <motion.div
          style={{ position: "absolute", left: 0, bottom: 0, height: 4, borderRadius: 4, background: "white", opacity: 0.85 }}
          animate={still ? { width: "40%" } : { width: ["0%", "100%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
        <span style={{ position: "absolute", right: 8, top: 6, fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, color: "white" }}>4K · 300 s</span>
      </div>
      <div style={{ position: "absolute", left: "16%", bottom: "6%", width: 70 }}><FlamingoAvatar /></div>
      <div style={{ position: "absolute", right: "16%", bottom: "6%", width: 64 }}><OwlAvatar /></div>
    </div>
  );
}

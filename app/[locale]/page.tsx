"use client";

import TopNavBar from "../components/TopNavBar";
import HeroSection from "../components/HeroSection";
import MediaMarquee from "../components/MediaMarquee";
import ComplianceSection from "../components/ComplianceSection";
import FeaturePillars from "../components/FeaturePillars";
import CognitiveEngineeringSection from "../components/CognitiveEngineeringSection";
import DemosPreviewSection from "../components/DemosPreviewSection";
import UseCasesSection from "../components/UseCasesSection";
import PackagesSection from "../components/PackagesSection";
import EarlyAccessSection from "../components/EarlyAccessSection";
import FaqSection from "../components/FaqSection";
import SiteFooter from "../components/SiteFooter";

/* ─────────────────────────────────────────────────────────────────────
   HOME PAGE — Krizaka.com, technical site of an emerging GitHub org.
   Hero (Unified Org & Engine Intro) → Media Marquee → Compliance → Feature Pillars →
   Cognitive Engineering → Demos Preview → Use Cases → Packages → Waitlist → FAQ.
   ───────────────────────────────────────────────────────────────────── */

export default function Home() {
  return (
    <main className="min-h-screen">
      <TopNavBar />
      <HeroSection />
      <MediaMarquee />
      <ComplianceSection />
      <FeaturePillars />
      <CognitiveEngineeringSection />
      <DemosPreviewSection />
      <UseCasesSection />
      <PackagesSection />
      <EarlyAccessSection />
      <FaqSection />
      <SiteFooter />
    </main>
  );
}


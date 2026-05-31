"use client";

import { useState } from "react";
import { useI18n } from "./I18nProvider";
import { CheckCircle2, Lock, Play, RefreshCw } from "lucide-react";

const SCENARIOS = [
  {
    id: "martin",
    icon: "⚡",
    labelFr: "Prospection Électricien (B2C)",
    labelEn: "Electrician Outreach (B2C)",
    prompt: "Détecter les opportunités de chantiers à Montréal et préparer le publipostage.",
    promptEn: "Scan Montreal for electrical contracts and prepare CASL-exempt direct mail.",
    steps: [
      { name: "SystemContextInjector", descFr: "Injecte le profil d'électricien et la zone d'activité (Montréal).", descEn: "Enforces electrician specialty and geographic postal constraints." },
      { name: "McpInterceptor", descFr: "Scanne le Registre foncier du Québec et les permis de bornes de recharge VE.", descEn: "Scans building permit logs and public transfers for EV chargers." },
      { name: "RefinerInterceptor", descFr: "Identifie les chantiers nécessitant une augmentation de panneau électrique.", descEn: "Filters deals, flagging panels requiring amp upgrades." },
      { name: "LanguageAlignmentInterceptor", descFr: "Exclut le courriel froid B2C (LCEE), génère un courrier papier conforme.", descEn: "Blocks cold B2C email outreach (CASL) and drafts direct mailers." }
    ],
    outputFr: "📄 1 publipostage postal généré en local (Conforme LCEE)\n📦 0 octet partagé sur des serveurs cloud tiers\n🔒 Statut : Périmètre 100% Souverain",
    outputEn: "📄 1 Local physical mailer drafted (CASL-compliant)\n📦 0 bytes uploaded to external cloud servers\n🔒 Status: 100% Sovereign"
  },
  {
    id: "claims",
    icon: "🛡️",
    labelFr: "Support Client Anonymisé",
    labelEn: "Anonymous Support Claim",
    prompt: "Analyser une réclamation d'accident de voiture contenant des informations personnelles.",
    promptEn: "Analyze a private car insurance claim containing citizen PII.",
    steps: [
      { name: "SystemContextInjector", descFr: "Détecte la présence de renseignements personnels de citoyens.", descEn: "Detects presence of personal identifiable information (PII)." },
      { name: "RefinerInterceptor", descFr: "Masque le VIN, le téléphone et l'adresse de la réclamation en Sandbox.", descEn: "Anonymizes VIN, address, and phone numbers inside local Sandbox." },
      { name: "McpInterceptor", descFr: "Cherche les articles de police correspondants dans la base vectorielle locale.", descEn: "Queries policy terms from the secure local pgvector store." },
      { name: "LanguageAlignmentInterceptor", descFr: "Fait appel au LLM local (Mistral) hors-ligne pour rédiger la réponse.", descEn: "Invokes offline local LLM (Mistral) to draft the reply safely." }
    ],
    outputFr: "✉️ Brouillon rédigé en Sandbox (PII chiffrées/anonymisées)\n📦 Conforme Loi 25 (Aucune fuite cloud sans évaluation ÉFVP)\n🔒 Statut : Sécurisé & Étanche",
    outputEn: "✉️ Support draft written in Sandbox (PII redacted/encrypted)\n📦 Law 25 compliant (Zero cloud transfer without PIA)\n🔒 Status: Sealed & Sovereign"
  },
  {
    id: "supplier",
    icon: "🏭",
    labelFr: "Audit Fournisseur (B2B)",
    labelEn: "Supplier Audit (B2B)",
    prompt: "Auditer un nouveau fournisseur de pièces aéronautiques et valider le NDA.",
    promptEn: "Audit a new aerospace supplier registry and validate NDAs.",
    steps: [
      { name: "SystemContextInjector", descFr: "Applique la charte d'approvisionnement et les règles de conformité.", descEn: "Enforces procurement criteria and audit guidelines." },
      { name: "McpInterceptor", descFr: "Interroge la base ERP locale pour vérifier les certificats actifs.", descEn: "Queries local ERP database for active supplier certificates." },
      { name: "RefinerInterceptor", descFr: "Détecte l'absence d'entente de confidentialité (NDA).", descEn: "Flags lack of active Non-Disclosure Agreement (NDA)." },
      { name: "LanguageAlignmentInterceptor", descFr: "Rédige une alerte interne d'interdiction en français (Loi 101).", descEn: "Drafts French internal warning alert (Bill 101 compliant)." }
    ],
    outputFr: "⚠️ Alerte interne : NDA manquant pour le Fournisseur (Conforme Loi 101)\n📦 Exécuté intégralement sur le serveur physique local\n🔒 Statut : Local uniquement",
    outputEn: "⚠️ Internal alert: Supplier missing NDA (Bill 101 compliant)\n📦 Processed 100% on the local host machine\n🔒 Status: Local only"
  }
];

/* ─── Log Syntax Highlighter ─── */
function renderConsoleLog(log: string) {
  if (log.startsWith("[INGRESS]")) {
    return (
      <>
        <span className="log-tag tag-ingress">[INGRESS]</span>
        <span className="log-content">{log.substring(9)}</span>
      </>
    );
  }
  if (log.startsWith("[CORE]")) {
    const match = log.match(/\[CORE\] ⚙️ Interceptor (\d\/\d) \(([^)]+)\) active: (.*)/);
    if (match) {
      const [, num, name, rest] = match;
      return (
        <>
          <span className="log-tag tag-core">[CORE]</span>
          <span className="log-content">⚙️ Interceptor {num} <span className="log-interceptor-name">({name})</span> active: {rest}</span>
        </>
      );
    }
  }
  if (log.startsWith("[SANDBOX]")) {
    return (
      <>
        <span className="log-tag tag-sandbox">[SANDBOX]</span>
        <span className="log-content">{log.substring(9)}</span>
      </>
    );
  }
  return <>{log}</>;
}

/* ─── Sovereign Pipeline Simulator ─── */
export function SovereignSimulator({ locale }: { locale: "fr" | "en" }) {
  const t = useI18n().t;
  const [activeScenario, setActiveScenario] = useState("martin");
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [showOutput, setShowOutput] = useState(false);

  const scenario = SCENARIOS.find((s) => s.id === activeScenario) || SCENARIOS[0];

  const handleSelectScenario = (id: string) => {
    if (isSimulating) return;
    setActiveScenario(id);
    setCurrentStep(-1);
    setConsoleLogs([]);
    setShowOutput(false);
  };

  const runSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setCurrentStep(0);
    setShowOutput(false);
    
    const promptText = locale === "fr" ? scenario.prompt : scenario.promptEn;
    const initialLogs = [
      `[INGRESS] 📥 Request received: "${promptText}"`,
      `[INGRESS] 🛡️ Sovereignty gate check: local network validation [OK]`,
    ];
    
    setConsoleLogs([initialLogs[0]]);
    setTimeout(() => {
      setConsoleLogs((prev) => [...prev, initialLogs[1]]);
    }, 500);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step <= 4) {
        setCurrentStep(step - 1);
        const currentInterceptor = scenario.steps[step - 1];
        const stepLog = `[CORE] ⚙️ Interceptor ${step}/4 (${currentInterceptor.name}) active: ${locale === "fr" ? currentInterceptor.descFr : currentInterceptor.descEn}`;
        
        setConsoleLogs((prev) => [...prev, stepLog]);
      } else if (step === 5) {
        setCurrentStep(4);
        const finalLog = `[SANDBOX] 🔒 Output generated locally in secure environment.`;
        setConsoleLogs((prev) => [...prev, finalLog]);
        setShowOutput(true);
        setIsSimulating(false);
        clearInterval(interval);
      }
    }, 1200);
  };

  const resetSimulation = () => {
    if (isSimulating) return;
    setCurrentStep(-1);
    setConsoleLogs([]);
    setShowOutput(false);
  };

  return (
    <div className="simulator-section">
      <div className="simulator-header">
        <span className="simulator-badge">Demo Interactive</span>
        <h3 className="simulator-section-title">{t.engineShowcase.simulatorTitle}</h3>
        <p className="simulator-section-desc">{t.engineShowcase.simulatorSubtitle}</p>
      </div>

      <div className="simulator-grid">
        {/* Left Side: Steps pipeline */}
        <div className="simulator-pipeline">
          {/* Scenario Selectors */}
          <div className="scenario-selector-row">
            {SCENARIOS.map((s) => {
              const isActive = activeScenario === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => handleSelectScenario(s.id)}
                  disabled={isSimulating}
                  className={`scenario-btn ${isActive ? "active" : ""}`}
                >
                  <span className="scenario-icon">{s.icon}</span>
                  <span className="scenario-label">
                    {locale === "fr" ? s.labelFr : s.labelEn}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Steps list */}
          <div className="pipeline-steps-list">
            {scenario.steps.map((step, idx) => {
              const isPassed = currentStep > idx;
              const isCurrent = currentStep === idx;
              
              let stepClass = "step-idle";
              if (isCurrent) stepClass = "step-current";
              if (isPassed) stepClass = "step-passed";

              return (
                <div key={idx} className={`pipeline-step-item ${stepClass}`}>
                  <div className="step-num-circle">
                    {isPassed ? <CheckCircle2 size={13} style={{ color: "var(--kz-status-success)" }} /> : `0${idx + 1}`}
                  </div>
                  <div className="step-text-content">
                    <div className="step-name-row">
                      <span className="step-interceptor-name">{step.name}</span>
                      {isCurrent && <span className="pulse-dot" />}
                    </div>
                    <span className="step-desc-text">
                      {locale === "fr" ? step.descFr : step.descEn}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Monospace console output */}
        <div className={`simulator-console-wrapper ${isSimulating ? "computing" : ""}`}>
          <div className="console-titlebar">
            <div className="mac-dots">
              <span className="dot red-dot" />
              <span className="dot yellow-dot" />
              <span className="dot green-dot" />
            </div>
            <div className="console-title">orazaka@local-node:~</div>
          </div>
          
          <div className="console-screen">
            {consoleLogs.length === 0 ? (
              <div className="console-prompt-line">
                <span className="console-caret">&gt;</span>
                <span className="console-placeholder-text">
                  {locale === "fr" 
                    ? "Sélectionnez un scénario et cliquez sur Simuler..." 
                    : "Select a scenario and click Run Simulation..."}
                </span>
              </div>
            ) : (
              <div className="console-logs-list">
                {consoleLogs.map((log, idx) => (
                  <div key={idx} className="console-log-line">
                    <span className="console-caret">&gt;</span> {renderConsoleLog(log)}
                  </div>
                ))}
                
                {/* Visual loading prompt */}
                {isSimulating && (
                  <div className="console-log-line pulse-text">
                    <span className="console-caret">&gt;</span> {t.engineShowcase.simulating}
                  </div>
                )}

                {/* Final Produced Output Card */}
                {showOutput && (
                  <div className="console-output-card">
                    <div className="output-card-header">
                      <Lock size={12} style={{ color: "var(--kz-status-success)" }} />
                      <span className="output-card-title">{t.engineShowcase.simOutput}</span>
                    </div>
                    <pre className="output-card-body">
                      {locale === "fr" ? scenario.outputFr : scenario.outputEn}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="console-footer">
            <button
              onClick={runSimulation}
              disabled={isSimulating}
              className="console-action-btn run-btn"
            >
              <Play size={13} fill="currentColor" />
              {t.engineShowcase.runSim}
            </button>
            <button
              onClick={resetSimulation}
              disabled={isSimulating || consoleLogs.length === 0}
              className="console-action-btn reset-btn"
            >
              <RefreshCw size={13} />
              {t.engineShowcase.simReset}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

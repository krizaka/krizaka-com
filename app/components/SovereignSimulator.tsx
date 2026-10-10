"use client";

import { useState } from "react";
import { useI18n } from "./I18nProvider";
import { CheckCircle2, Lock, Play, RefreshCw } from "lucide-react";

const SCENARIOS = [
  {
    id: "martin",
    icon: "⚡",
    steps: [
      { name: "SystemContextInjector" },
      { name: "McpInterceptor" },
      { name: "RefinerInterceptor" },
      { name: "LanguageAlignmentInterceptor" }
    ],
  },
  {
    id: "claims",
    icon: "🛡️",
    steps: [
      { name: "SystemContextInjector" },
      { name: "RefinerInterceptor" },
      { name: "McpInterceptor" },
      { name: "LanguageAlignmentInterceptor" }
    ],
  },
  {
    id: "supplier",
    icon: "🏭",
    steps: [
      { name: "SystemContextInjector" },
      { name: "McpInterceptor" },
      { name: "RefinerInterceptor" },
      { name: "LanguageAlignmentInterceptor" }
    ],
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
export function SovereignSimulator() {
  const t = useI18n().t;
  const text = t.pages.sovereignSimulator;
  const [activeScenario, setActiveScenario] = useState("martin");
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [showOutput, setShowOutput] = useState(false);

  // Structure here, words in messages → pages.sovereignSimulator.scenarios[i].
  const scenarios = SCENARIOS.map((sc, i) => ({
    ...sc,
    ...text.scenarios[i],
    steps: sc.steps.map((st, j) => ({ ...st, ...text.scenarios[i].steps[j] })),
  }));
  const scenario = scenarios.find((s) => s.id === activeScenario) || scenarios[0];

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
    
    const promptText = scenario.prompt;
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
        const stepLog = `[CORE] ⚙️ Interceptor ${step}/4 (${currentInterceptor.name}) active: ${currentInterceptor.desc}`;
        
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
            {scenarios.map((s) => {
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
                    {s.label}
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
                    {isPassed ? <CheckCircle2 size={13} style={{ color: "var(--kz-success)" }} /> : `0${idx + 1}`}
                  </div>
                  <div className="step-text-content">
                    <div className="step-name-row">
                      <span className="step-interceptor-name">{step.name}</span>
                      {isCurrent && <span className="pulse-dot" />}
                    </div>
                    <span className="step-desc-text">
                      {step.desc}
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
                  {text.selectAScenarioAndClick}
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
                      <Lock size={12} style={{ color: "var(--kz-success)" }} />
                      <span className="output-card-title">{t.engineShowcase.simOutput}</span>
                    </div>
                    <pre className="output-card-body">
                      {scenario.output}
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

/* ═══════════════════════════════════════════════════════════════════
   KRIZAKA — Pipeline Mesh ("Pipeline of Cognition")
   The 15-interceptor pipeline rendered as a hexagonal mesh.
   Positions are percentages of the canvas (x: 0–100, y: 0–100).
   Bilingual content (FR-CA default + EN). Externalized per [ERR-115].
   ═══════════════════════════════════════════════════════════════════ */

export type LocalizedText = { fr: string; en: string };

export interface MeshNode {
  id: string;
  label: LocalizedText;
  desc: LocalizedText;
  /** Position in % of the canvas */
  x: number;
  y: number;
  /** Visual role — input/output get accent treatment */
  role: "input" | "interceptor" | "output";
  /** Icon key resolved in the component */
  icon:
    | "user"
    | "terminal"
    | "activity"
    | "database"
    | "shuffle"
    | "filecode"
    | "wrench"
    | "sliders"
    | "shield"
    | "dollar"
    | "globe"
    | "layers"
    | "grid"
    | "check"
    | "cpu"
    | "message";
}

export interface MeshEdge {
  from: string;
  to: string;
  /** Render an animated flow particle on this edge */
  particle?: boolean;
}

export const MESH_TITLE: LocalizedText = {
  fr: "Maillage du pipeline à 15 intercepteurs",
  en: "Orasaka 15-interceptor pipeline mesh",
};

export const MESH_SUBTITLE: LocalizedText = {
  fr: "Pipeline de cognition — survolez un nœud pour voir son rôle",
  en: "Pipeline of Cognition — hover a node to see its role",
};

export const MESH_NODES: MeshNode[] = [
  {
    id: "user-context",
    label: { fr: "Contexte utilisateur", en: "User Context" },
    desc: {
      fr: "Profil, rôle RBAC et tier de rate-limiting résolus en tête de pipeline.",
      en: "Profile, RBAC role and rate-limit tier resolved at the head of the pipeline.",
    },
    x: 4,
    y: 50,
    role: "input",
    icon: "user",
  },
  {
    id: "system-injection",
    label: { fr: "Injection système", en: "System Injection" },
    desc: {
      fr: "Variables d'environnement, outils disponibles et signaux système injectés.",
      en: "Environment variables, available tools and system signals injected.",
    },
    x: 16,
    y: 22,
    role: "interceptor",
    icon: "terminal",
  },
  {
    id: "semantic-refinement",
    label: { fr: "Raffinement sémantique", en: "Semantic Refinement" },
    desc: {
      fr: "Requête floue transformée en instruction précise avant inférence.",
      en: "Fuzzy query rewritten into a precise instruction before inference.",
    },
    x: 16,
    y: 78,
    role: "interceptor",
    icon: "activity",
  },
  {
    id: "rag",
    label: { fr: "RAG / pgvector", en: "RAG / pgvector" },
    desc: {
      fr: "Récupération vectorielle locale et injection de connaissances métier.",
      en: "Local vector retrieval and domain knowledge injection.",
    },
    x: 30,
    y: 10,
    role: "interceptor",
    icon: "database",
  },
  {
    id: "intent-routing",
    label: { fr: "Routage intentionnel", en: "Intent Routing" },
    desc: {
      fr: "L'intention détectée route vers le modèle optimal (temp. 0.0).",
      en: "Detected intent routes to the optimal model (temp 0.0).",
    },
    x: 30,
    y: 50,
    role: "interceptor",
    icon: "shuffle",
  },
  {
    id: "audit-log",
    label: { fr: "Journal d'audit", en: "Audit Log" },
    desc: {
      fr: "Chaque décision du pipeline est tracée pour l'auditabilité.",
      en: "Every pipeline decision is traced for auditability.",
    },
    x: 30,
    y: 90,
    role: "interceptor",
    icon: "filecode",
  },
  {
    id: "mcp-tools",
    label: { fr: "Outils MCP", en: "MCP Tools" },
    desc: {
      fr: "Sources de connaissances externes via Model Context Protocol.",
      en: "External knowledge sources via the Model Context Protocol.",
    },
    x: 44,
    y: 10,
    role: "interceptor",
    icon: "wrench",
  },
  {
    id: "memory-fifo",
    label: { fr: "Mémoire FIFO", en: "Memory FIFO" },
    desc: {
      fr: "Fenêtre glissante de 50 messages — le contexte pertinent sans surcharge.",
      en: "Sliding 50-message window — relevant context without overload.",
    },
    x: 44,
    y: 36,
    role: "interceptor",
    icon: "sliders",
  },
  {
    id: "guardrails",
    label: { fr: "Garde-fous", en: "Safety Guardrails" },
    desc: {
      fr: "Contraintes de sécurité appliquées avant et après l'inférence.",
      en: "Safety constraints enforced before and after inference.",
    },
    x: 44,
    y: 64,
    role: "interceptor",
    icon: "shield",
  },
  {
    id: "cost-shield",
    label: { fr: "Bouclier de coûts", en: "Cost Shield" },
    desc: {
      fr: "Budgets de tokens et plafonds MLX — aucune dérive de ressources.",
      en: "Token budgets and MLX caps — no resource runaway.",
    },
    x: 44,
    y: 90,
    role: "interceptor",
    icon: "dollar",
  },
  {
    id: "multimodal",
    label: { fr: "Assemblage multimodal", en: "Multimodal Assembly" },
    desc: {
      fr: "Extraction et assemblage des médias base64 — texte, image, audio, vidéo.",
      en: "Base64 media extraction and assembly — text, image, audio, video.",
    },
    x: 58,
    y: 18,
    role: "interceptor",
    icon: "layers",
  },
  {
    id: "context-enrichment",
    label: { fr: "Enrichissement contextuel", en: "Context Enrichment" },
    desc: {
      fr: "Fusion du profil, de l'historique et du RAG en un contexte unifié.",
      en: "Profile, history and RAG fused into a unified context.",
    },
    x: 58,
    y: 50,
    role: "interceptor",
    icon: "grid",
  },
  {
    id: "translation",
    label: { fr: "Traduction", en: "Translation" },
    desc: {
      fr: "Normalisation linguistique FR ↔ EN au fil du pipeline.",
      en: "FR ↔ EN linguistic normalization through the pipeline.",
    },
    x: 58,
    y: 82,
    role: "interceptor",
    icon: "globe",
  },
  {
    id: "validation",
    label: { fr: "Validation en boucle", en: "Validation Loop" },
    desc: {
      fr: "JSON Schema, sandbox MCP, débat multi-agents — avant livraison.",
      en: "JSON Schema, MCP sandbox, multi-agent debate — before delivery.",
    },
    x: 72,
    y: 66,
    role: "interceptor",
    icon: "check",
  },
  {
    id: "orchestration-core",
    label: { fr: "Cœur d'orchestration", en: "Orchestration Core" },
    desc: {
      fr: "Le moteur stateless qui séquence les intercepteurs et les modèles.",
      en: "The stateless engine sequencing interceptors and models.",
    },
    x: 72,
    y: 32,
    role: "interceptor",
    icon: "cpu",
  },
  {
    id: "final-response",
    label: { fr: "Réponse finale", en: "Final Response" },
    desc: {
      fr: "Réponse validée, enrichie et traçable — livrée à l'utilisateur.",
      en: "A validated, enriched and traceable response — delivered to the user.",
    },
    x: 90,
    y: 50,
    role: "output",
    icon: "message",
  },
];

export const MESH_EDGES: MeshEdge[] = [
  { from: "user-context", to: "system-injection", particle: true },
  { from: "user-context", to: "semantic-refinement", particle: true },
  { from: "system-injection", to: "rag" },
  { from: "system-injection", to: "intent-routing" },
  { from: "semantic-refinement", to: "intent-routing" },
  { from: "semantic-refinement", to: "audit-log" },
  { from: "rag", to: "mcp-tools", particle: true },
  { from: "rag", to: "memory-fifo" },
  { from: "intent-routing", to: "memory-fifo" },
  { from: "intent-routing", to: "guardrails", particle: true },
  { from: "audit-log", to: "cost-shield" },
  { from: "mcp-tools", to: "multimodal" },
  { from: "memory-fifo", to: "context-enrichment", particle: true },
  { from: "guardrails", to: "translation" },
  { from: "cost-shield", to: "translation" },
  { from: "multimodal", to: "orchestration-core" },
  { from: "context-enrichment", to: "orchestration-core", particle: true },
  { from: "context-enrichment", to: "validation" },
  { from: "translation", to: "validation" },
  { from: "validation", to: "final-response", particle: true },
  { from: "orchestration-core", to: "final-response", particle: true },
];

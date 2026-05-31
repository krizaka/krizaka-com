---
title: Orazaka — Master Feature Matrix
description: Documentation for Orazaka — Master Feature Matrix
category: Core Features
order: 10
---
# Orazaka — Master Feature Matrix

> Single source of truth for feature delivery status across the Orazaka platform. Organized by technology pillar, updated continuously as features ship.

---

## 1. Core Engine

| ID | Feature | Description | Status |
|:---|:---|:---|:---|
| **CORE-01** | Interceptor Pipeline | Dynamic chain of 15 prompt context interceptor filters, configured via AutoConfig SPI. Rich contextual decoupling via `SovereignWorkflowContext` port contract. | 🟢 **COMPLETED & LOCKED** |
| **CORE-02** | Spring AI Abstraction | Unified integration of Spring AI through local `AiClient` facade — zero cloud dependencies. | 🟢 **COMPLETED & LOCKED** |
| **CORE-03** | Virtual Threads Concurrency | All blocking I/O operations execute on Java 21 Virtual Threads. | 🟢 **COMPLETED & LOCKED** |
| **CORE-04** | Hexagonal Architecture | Strict domain isolation (Core, Gateway, Identity) validated by ArchUnit ring rules. System Layer Governance enforces Business ("What") vs. Core ("How") structural separation. | 🟢 **COMPLETED & LOCKED** |

---

## 2. Sovereign Compliance (Loi 25 / GDPR)

| ID | Feature | Description | Status |
|:---|:---|:---|:---|
| **COMP-01** | On-Premise AI Execution | Total isolation of LLM executions (Ollama) with local provider verification by default. | 🟢 **COMPLETED & LOCKED** |
| **COMP-02** | Sovereign DNS Resolution | Ollama network destination control — localhost, RFC 1918 private subnets, Docker internal whitelist. | 🟢 **COMPLETED & LOCKED** |
| **COMP-03** | Quantum Validation | Closed-loop 4-tier validation matrix — JSON Schema → MCP Sandbox → Multi-Agent Debate → Test-Driven Response. | 🛠️ **IN PROGRESS** |
| **COMP-04** | MLX Frame Clamping & CostShield | Apple Silicon MLX memory management with intelligent cloud fallback (7–28 frame cap). | 🛠️ **IN PROGRESS** |
| **COMP-05** | Session Encryption at Rest | AES-GCM encryption of all local SQL databases. | 📅 **ROADMAP** |

---

## 3. Infrastructure & Topology

| ID | Feature | Description | Status |
|:---|:---|:---|:---|
| **INF-01** | Persistent PGVector | Hardened PostgreSQL instance with pgvector extension and persistent storage. | 🟢 **COMPLETED & LOCKED** |
| **INF-02** | Isolated Redis | Cache and rate-limiter isolated within the internal Docker network. | 🟢 **COMPLETED & LOCKED** |
| **INF-03** | RabbitMQ Broker | Asynchronous message broker with secure internal queues and AMQP exchange routing. | 🟢 **COMPLETED & LOCKED** |
| **INF-04** | Hermetic Docker Network | Hardened deployment — only the BFF Gateway exposes port 8080 externally. | 🟢 **COMPLETED & LOCKED** |

---

## 4. CLI Developer Tooling

| ID | Feature | Description | Status |
|:---|:---|:---|:---|
| **CLI-01** | Interactive Installer | Setup wizard for topology adaptation — Apple Silicon, Linux Production, BYO-Infra. | 🟢 **COMPLETED & LOCKED** |
| **CLI-02** | Doctor Diagnostics | Global system health check — ports, models, memory, workspace structure. | 🟢 **COMPLETED & LOCKED** |
| **CLI-03** | Config Manager | Interactive terminal editor for local environment variables (`.env`). | 🟢 **COMPLETED & LOCKED** |
| **CLI-04** | Local SQLite Cache | Persistent offline queue to synchronize local agent tasks with 15-second heartbeat. | 🟢 **COMPLETED & LOCKED** |
| **CLI-05** | Full-Stack Dev Orchestrator | `npx orazaka dev` — parallel-spawns Gateway, Web Client, Admin Console, and Mobile App with `--skip-*` flags. | 🟢 **COMPLETED & LOCKED** |

---

## 5. UI / User Experience

| ID | Feature | Description | Status |
|:---|:---|:---|:---|
| **UI-01** | Next.js 16 HUD Dashboard | Premium agentic execution console with App Router, React 19, and cinematic dark mode. | 🟢 **COMPLETED & LOCKED** |
| **UI-02** | Cinematic Dark Theme | Glassmorphism panels, `backdrop-filter: blur(16px)`, HSL variable system. | 🟢 **COMPLETED & LOCKED** |
| **UI-03** | UI Input Blocking | Interactive form locking during AI generation (`isSending \|\| isGenerating`). | 🟢 **COMPLETED & LOCKED** |
| **UI-04** | Typed Form Validation | React 19+ native event types — `SubmitEventHandler<HTMLFormElement>`. | 🟢 **COMPLETED & LOCKED** |
| **UI-05** | SecOps Admin Console | Isolated administration console on port 3001 — separated runtime, dedicated BFF routes. | 🟢 **COMPLETED & LOCKED** |
| **UI-06** | Multi-Agent Control Interface | Dynamic 2D/3D graph visualization of the active agent network. | 📅 **ROADMAP** |

---

## 6. Business & Monetization

| ID | Feature | Description | Status |
|:---|:---|:---|:---|
| **BIZ-01** | CinePulse Playbook | Business playbook template for selling sovereign cyberpunk video services. | 🟢 **COMPLETED & LOCKED** |
| **BIZ-02** | Integrated Stripe Billing | SaaS payment gateway with recurring subscriptions and consumption limits. | 📅 **ROADMAP** |
| **BIZ-03** | Multi-User Organization Management | Team management with hierarchical roles and enterprise API keys. | 📅 **ROADMAP** |
| **BIZ-04** | Dynamic AMQP Routing Rules | Data contracts and backend evaluation engine for dynamic model routing based on user tier. | 🟢 **COMPLETED & LOCKED** |

---

## 7. Product Experience & Front-End Strategy

| ID | Feature | Description | Status |
|:---|:---|:---|:---|
| **UX-01** | Sovereign Landing Page | High-conversion showcase landing page focused on Loi 25 / GDPR compliance and AI data sovereignty. | 📅 **ROADMAP (High Priority)** |
| **UX-02** | Pro Admin UI Workspace | Visual interceptor pipeline rendering and Routing Rules editor in the Admin Console. | 📅 **ROADMAP (High Priority)** |
| **UX-03** | Internal Minimalist CLI | Maintenance of the CLI as an internal automation utility for consulting and DevOps. | 🟢 **COMPLETED & LOCKED** |
| **UX-04** | Core Backend Hardening | Stabilized Docker image stack (Postgres, Redis, RabbitMQ, Java 21) for isolated local production. | 🟢 **COMPLETED & LOCKED** |
| **UX-05** | Cross-Platform SaaS Mobile Boilerplate | Production-ready Expo SDK 53 mobile app with complete user lifecycle — secure Login, Registration, Password Recovery, SSE multi-modal streaming terminal, and multi-tier Subscription management. 6-screen typed navigation stack with shared Zod validation via `orazaka-shared`. | 🟢 **COMPLETED & LOCKED** |

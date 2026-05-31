---
title: Interceptor Registry
description: Cross-cutting pipeline interceptors and their DB-driven order.
category: Core
order: 5
generated: true
---

# Interceptor Registry

> 🤖 **Generated from code** by `scripts/generate-docs.mjs` — do not hand-edit. Run `orazaka docs build` to refresh.

| Order | Interceptor | Concern | Enabled |
|:--|:---|:---|:--|
| 1 | `UserContextInterceptor` | context | ✅ |
| 3 | `RagInterceptor` | enrichment | ✅ |
| 4 | `McpInterceptor` | enrichment | ✅ |
| 5 | `MemoryInterceptor` | enrichment | ✅ |
| 6 | `RefinerInterceptor` | reformulation | ✅ |
| 7 | `RouterInterceptor` | reformulation | ✅ |
| 8 | `ToolInterceptor` | tooling | ✅ |
| — | `ClosedLoopValidationInterceptor` | validation | — |
| — | `CostShieldInterceptor` | validation | — |
| — | `LanguageAlignmentInterceptor` | translation | — |
| — | `SemanticRouterInterceptor` | reformulation | — |

---
title: Architecture Reference
description: Module map, dependencies, pipeline and messaging — extracted from the code.
category: Architecture
order: 2
generated: true
---

# Architecture Reference

> 🤖 **Generated from code** by `scripts/generate-docs.mjs` — do not hand-edit. Run `orazaka docs build` to refresh.

## Modules

| Module | Layer | Inbound ports | Outbound ports |
|:---|:---|:---|:---|
| `orazaka-test-support` | framework | — | — |
| `orazaka-persistence` | framework | — | — |
| `orazaka-core` | framework | AiClient, CatalogModelService, ChatSessionService, JobService, McpService | AudioGeneratorClient, CapabilityProvider, ChatGeneratorClient, ImageGeneratorClient, McpOrchestrator, ModelCatalogProvider, PipelineConfigProvider, PlatformMcpServerProvider, PlatformToolConfigProvider, SemanticClassifierPort, TestShaperPort, ToolRegistry, UserCredentialsProvider, UserMcpServerProvider, ValidationPipelineRepository, VideoGeneratorClient |
| `orazaka-interceptors` | framework | — | — |
| `orazaka-business` | framework | — | — |
| `orazaka-identity` | framework | IdentityReconciliationService, IdentityService, PasswordRecoveryService, RateLimitProvider, UserProfileProvider | AuthorityRepositoryPort, CryptographyPort, OAuth2ProviderVerifier, PasswordEventPublisher, PasswordResetTokenRepositoryPort, UserCredentialRepositoryPort, UserEventPublisher, UserInterceptionRepositoryPort, UserProfileRepositoryPort, UserRepositoryPort, VerificationTokenRepositoryPort |
| `orazaka-tools` | framework | — | — |
| `orazaka-router` | app | — | — |
| `orazaka-workers` | app | — | — |
| `orazaka-end2end` | aggregate | — | — |

## Dependency edges

```
orazaka-core → orazaka-persistence-app
orazaka-core → orazaka-test-support
orazaka-interceptors → orazaka-core
orazaka-interceptors → orazaka-test-support
orazaka-business → orazaka-core
orazaka-identity → orazaka-persistence-identity
orazaka-identity → orazaka-test-support
orazaka-tools → orazaka-core
orazaka-tools → orazaka-persistence-app
orazaka-tools → orazaka-test-support
orazaka-router → orazaka-core
orazaka-router → orazaka-identity
orazaka-router → orazaka-tools
orazaka-router → orazaka-business
orazaka-router → orazaka-persistence-app
orazaka-router → orazaka-test-support
orazaka-router → orazaka-interceptors
orazaka-end2end → orazaka-router
orazaka-end2end → orazaka-core
orazaka-end2end → orazaka-identity
orazaka-end2end → orazaka-business
orazaka-end2end → orazaka-persistence-app
orazaka-end2end → orazaka-persistence-identity
```

## Interceptor pipeline (DB-driven order)

| # | Interceptor | Enabled |
|:--|:---|:--|
| 1 | `UserContextResolver` | ✅ |
| 2 | `SystemContextInjector` | ✅ |
| 3 | `RagInterceptor` | ✅ |
| 4 | `McpInterceptor` | ✅ |
| 5 | `MemoryInterceptor` | ✅ |
| 6 | `RefinerInterceptor` | ✅ |
| 7 | `RouterInterceptor` | ✅ |
| 8 | `ToolInterceptor` | ✅ |
| 9 | `MediaInterceptor` | ✅ |
| 10 | `UserContextInterceptor` | ✅ |

## Messaging keys

- `orazaka.jobs.exchange`
- `orazaka.jobs.routingKey`
- `orazaka.routing.media.generate`
- `orazaka.routing.text.process`

---
title: Architecture Reference
description: Module map, dependencies, pipeline and messaging — extracted from the code.
category: Architecture
order: 2
generated: true
---

# Architecture Reference

> 🤖 **Generated from code** by `scripts/generate-docs.mjs` — do not hand-edit. Run `orasaka docs build` to refresh.

## Modules

| Module | Layer | Inbound ports | Outbound ports |
|:---|:---|:---|:---|
| `orasaka-test-support` | framework | — | — |
| `orasaka-persistence` | framework | — | — |
| `orasaka-core` | framework | AiClient, CatalogModelService, ChatSessionService, JobService, McpService | AudioGeneratorClient, CapabilityProvider, ChatGeneratorClient, ImageGeneratorClient, McpOrchestrator, ModelCatalogProvider, PipelineConfigProvider, PlatformMcpServerProvider, PlatformToolConfigProvider, SemanticClassifierPort, TestShaperPort, ToolRegistry, UserCredentialsProvider, UserMcpServerProvider, ValidationPipelineRepository, VideoGeneratorClient |
| `orasaka-interceptors` | framework | — | — |
| `orasaka-business` | framework | — | — |
| `orasaka-identity` | framework | IdentityReconciliationService, IdentityService, PasswordRecoveryService, RateLimitProvider, UserProfileProvider | AuthorityRepositoryPort, CryptographyPort, OAuth2ProviderVerifier, PasswordEventPublisher, PasswordResetTokenRepositoryPort, UserCredentialRepositoryPort, UserEventPublisher, UserInterceptionRepositoryPort, UserProfileRepositoryPort, UserRepositoryPort, VerificationTokenRepositoryPort |
| `orasaka-tools` | framework | — | — |
| `orasaka-router` | app | — | — |
| `orasaka-workers` | app | — | — |
| `orasaka-end2end` | aggregate | — | — |

## Dependency edges

```
orasaka-core → orasaka-persistence-app
orasaka-core → orasaka-test-support
orasaka-interceptors → orasaka-core
orasaka-interceptors → orasaka-test-support
orasaka-business → orasaka-core
orasaka-identity → orasaka-persistence-identity
orasaka-identity → orasaka-test-support
orasaka-tools → orasaka-core
orasaka-tools → orasaka-persistence-app
orasaka-tools → orasaka-test-support
orasaka-router → orasaka-core
orasaka-router → orasaka-identity
orasaka-router → orasaka-tools
orasaka-router → orasaka-business
orasaka-router → orasaka-persistence-app
orasaka-router → orasaka-test-support
orasaka-router → orasaka-interceptors
orasaka-end2end → orasaka-router
orasaka-end2end → orasaka-core
orasaka-end2end → orasaka-identity
orasaka-end2end → orasaka-business
orasaka-end2end → orasaka-persistence-app
orasaka-end2end → orasaka-persistence-identity
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

- `orasaka.jobs.exchange`
- `orasaka.jobs.routingKey`
- `orasaka.routing.media.generate`
- `orasaka.routing.text.process`

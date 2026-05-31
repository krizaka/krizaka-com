---
title: Interface Contracts (generated)
description: Inbound and outbound ports per module, extracted from the code.
category: Architecture
order: 3
generated: true
---

# Interface Contracts (generated)

> 🤖 **Generated from code** by `scripts/generate-docs.mjs` — do not hand-edit. Run `orazaka docs build` to refresh.

## `orazaka-core`

**Inbound ports**

- `AiClient`
- `CatalogModelService`
- `ChatSessionService`
- `JobService`
- `McpService`

**Outbound ports**

- `AudioGeneratorClient`
- `CapabilityProvider`
- `ChatGeneratorClient`
- `ImageGeneratorClient`
- `McpOrchestrator`
- `ModelCatalogProvider`
- `PipelineConfigProvider`
- `PlatformMcpServerProvider`
- `PlatformToolConfigProvider`
- `SemanticClassifierPort`
- `TestShaperPort`
- `ToolRegistry`
- `UserCredentialsProvider`
- `UserMcpServerProvider`
- `ValidationPipelineRepository`
- `VideoGeneratorClient`

## `orazaka-identity`

**Inbound ports**

- `IdentityReconciliationService`
- `IdentityService`
- `PasswordRecoveryService`
- `RateLimitProvider`
- `UserProfileProvider`

**Outbound ports**

- `AuthorityRepositoryPort`
- `CryptographyPort`
- `OAuth2ProviderVerifier`
- `PasswordEventPublisher`
- `PasswordResetTokenRepositoryPort`
- `UserCredentialRepositoryPort`
- `UserEventPublisher`
- `UserInterceptionRepositoryPort`
- `UserProfileRepositoryPort`
- `UserRepositoryPort`
- `VerificationTokenRepositoryPort`


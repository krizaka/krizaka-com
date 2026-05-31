---
title: API Reference
description: Router REST endpoints, extracted from the controllers.
category: API
order: 6
generated: true
---

# API Reference

> 🤖 **Generated from code** by `scripts/generate-docs.mjs` — do not hand-edit. Run `orazaka docs build` to refresh.

| Method | Path | Controller |
|:---|:---|:---|
| PUT | `/api/v1/admin/features/{featureKey}` | AdminFeatureController |
| GET | `/api/v1/admin/jobs/active-connections` | AdminJobController |
| POST | `/api/v1/admin/jobs/purge` | AdminJobController |
| DELETE | `/api/v1/admin/models/{id}` | AdminModelController |
| PUT | `/api/v1/admin/models/{id}` | AdminModelController |
| POST | `/api/v1/admin/pipeline/interceptors/reset` | AdminPipelineController |
| POST | `/api/v1/agent/report` | AgentStreamController |
| GET | `/api/v1/agent/stream` | AgentStreamController |
| POST | `/api/v1/ai/image` | ImageController |
| POST | `/api/v1/ai/speech` | SpeechController |
| POST | `/api/v1/ai/video` | VideoController |
| POST | `/api/v1/auth/forgot` | AuthController |
| POST | `/api/v1/auth/login` | AuthController |
| POST | `/api/v1/auth/oauth` | AuthController |
| POST | `/api/v1/auth/register` | AuthController |
| POST | `/api/v1/auth/reset` | AuthController |
| POST | `/api/v1/auth/verify` | AuthController |
| POST | `/api/v1/automation/jobs/{jobId}/approve` | AutomationJobController |
| POST | `/api/v1/automation/jobs/{jobId}/revoke` | AutomationJobController |
| GET | `/api/v1/bootstrap/features` | BootstrapController |
| POST | `/api/v1/chat/code` | CodeStreamController |
| GET | `/api/v1/chat/stream/{conversationId}` | ChatStreamController |
| POST | `/api/v1/chat/stream/{conversationId}` | ChatStreamController |
| DELETE | `/api/v1/chats/{sessionId}` | ChatSessionController |
| PATCH | `/api/v1/chats/{sessionId}` | ChatSessionController |
| GET | `/api/v1/compliance/health` | ComplianceController |
| POST | `/api/v1/intent/route` | IntentRouterController |
| GET | `/api/v1/jobs/{id}` | JobController |
| POST | `/api/v1/jobs/{id}/progress` | JobController |
| GET | `/api/v1/jobs/stream` | JobController |
| GET | `/api/v1/mcp/servers/platform` | McpController |
| POST | `/api/v1/mcp/servers/platform` | McpController |
| DELETE | `/api/v1/mcp/servers/platform/{id}` | McpController |
| GET | `/api/v1/mcp/servers/user` | McpController |
| POST | `/api/v1/mcp/servers/user` | McpController |
| DELETE | `/api/v1/mcp/servers/user/{id}` | McpController |
| GET | `/api/v1/mcp/tools` | McpController |
| POST | `/api/v1/mcp/tools/{name}/execute` | McpController |
| POST | `/api/v1/media/analyze-audio` | MediaAnalysisController |
| POST | `/api/v1/media/analyze-image` | MediaAnalysisController |
| POST | `/api/v1/media/analyze-video` | MediaAnalysisController |
| GET | `/api/v1/media/search-rag` | MediaAnalysisController |
| POST | `/api/v1/media/upload` | MediaUploadController |
| GET | `/api/v1/models` | ModelController |
| GET | `/api/v1/models/catalog` | ModelController |
| GET | `/api/v1/models/providers` | ModelController |
| GET | `/api/v1/models/supported` | ModelController |
| GET | `/api/v1/operations/graph` | OperationGraphController |
| DELETE | `/api/v1/user/credentials/{providerName}` | UserCredentialsController |

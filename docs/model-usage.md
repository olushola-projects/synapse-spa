# Model Usage Reference

This document provides a comprehensive overview of all language and embedding models referenced in the Synapses GRC platform, including their provider, purpose, and configuration location.

| Provider | Model Name | Purpose | Config Location |
|----------|------------|---------|----------------|
| Google   | gemini-2.5-pro | prompt evaluation/testing | promptfooconfig.yaml, LLMService.ts, EnhancedLLMService.ts |
| Deepseek | text-embedding-3-small | RAG embedding | EnhancedRAGService.ts, LLMService.ts, EnhancedLLMService.ts |
| Deepseek | text-embedding-3-large | RAG embedding | EnhancedRAGService.ts, LLMService.ts, EnhancedLLMService.ts |
| HF       | sentence-transformers/all-MiniLM-L6-v2 | alternative embedding option | EnhancedRAGService.ts, LLMService.ts, EnhancedLLMService.ts |

## Orchestration Logic

All model orchestration logic is centralized in `src/services/LLMService.ts` and `src/services/EnhancedLLMService.ts`.

- **LLMService.ts** provides a minimal registry and utility functions for model lookup, selection, and prompt-to-model mapping. It supports static model selection and can be extended for dynamic selection based on user preferences, task type, or cost.
- **EnhancedLLMService.ts** offers an advanced registry with model capabilities, config locations, and is designed for multi-model orchestration. It enables richer metadata and can be leveraged for dynamic routing, fallback, and capability-based selection.

### Model Selection & Fallback
- Model selection is currently based on static configuration or prompt mapping. To optimize, consider making selection dynamic (e.g., by user preference, task type, or runtime availability).
- For resilience, implement fallback logic: if a preferred model is unavailable, automatically route to a compatible alternative (see `getPromptProviderModel` in both services).

### Extending Orchestration
- To add new models, update the registries in both files and document them above.
- For advanced orchestration (e.g., cost-aware routing, capability-based selection), extend the logic in `EnhancedLLMService.ts`.
- Ensure all changes are tested and referenced in this documentation.

- For additional models or providers, update the registry in these files and extend this documentation accordingly.
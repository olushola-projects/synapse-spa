# Agent Workflow Model Matrix

| Workflow                  | Primary Model         | Fallback Model                | Cost/Quality Tier      | Latency Requirement | Recommended Logic Settings |
|---------------------------|----------------------|-------------------------------|-----------------------|---------------------|----------------------------|
| SFDR Summary              | Gemini-2.5-pro       | deepseek:text-embedding-3-small| High/Best             | <2s                | Default: Gemini, fallback: deepseek |
| Regulatory Q&A            | Gemini-2.5-pro       | Local LLM (e.g. phi-3-mini)   | High/Med/Low          | <3s                | Prefer Gemini, fallback to local if cost/latency high |
| Document Retrieval        | deepseek:text-embedding-3-large | sentence-transformers/all-MiniLM-L6-v2 | Med/Low | <1s | Use deepseek for accuracy, fallback to sentence-transformers for speed |
| Compliance Recommendations| Gemini-2.5-pro       | Local LLM (e.g. phi-3-mini)   | High/Med/Low          | <2s                | Use Gemini for critical, fallback to local for non-critical |
| ESG/SFDR Classification   | Gemini-2.5-pro       | deepseek:text-embedding-3-small| High/Med              | <2s                | Default: Gemini, fallback: deepseek |

**Legend:**
- **Primary Model:** Main LLM or embedding model for the workflow
- **Fallback Model:** Used if primary fails or is unavailable
- **Cost/Quality Tier:** Relative cost and output quality
- **Latency Requirement:** Maximum acceptable response time
- **Recommended Logic:** Suggested default/fallback orchestration

_This matrix should be updated as new models and workflows are added._
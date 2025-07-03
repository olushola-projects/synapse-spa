// LLMService.ts
// Minimal LLM orchestration service for GRC platform

export type LLMProvider = 'google' | 'openai' | 'deepseek' | 'hf';

export interface LLMConfig {
  provider: LLMProvider;
  model: string;
  apiKeyEnv: string;
  purpose: string;
}

export const LLM_MODELS: LLMConfig[] = [
  { provider: 'google', model: 'gemini-2.5-pro', apiKeyEnv: 'GOOGLE_API_KEY', purpose: 'prompt evaluation/testing' },
  { provider: 'deepseek', model: 'text-embedding-3-small', apiKeyEnv: 'OPENAI_API_KEY', purpose: 'RAG embedding' },
  { provider: 'deepseek', model: 'text-embedding-3-large', apiKeyEnv: 'OPENAI_API_KEY', purpose: 'RAG embedding' },
  { provider: 'hf', model: 'sentence-transformers/all-MiniLM-L6-v2', apiKeyEnv: 'HF_API_KEY', purpose: 'alternative embedding option' }
];

import fs from 'fs';
import yaml from 'js-yaml';

export function getModelConfig(model: string): LLMConfig | undefined {
  return LLM_MODELS.find(m => m.model === model);
}

export function listAllModels(): LLMConfig[] {
  return LLM_MODELS;
}

// Loads promptfooconfig.yaml and returns provider/model for a given prompt id
export function getPromptProviderModel(promptId: string): { default: string; fallback?: string } | undefined {
  try {
    const config = yaml.load(fs.readFileSync('promptfooconfig.yaml', 'utf8')) as any;
    if (config && config.prompts) {
      const prompt = config.prompts.find((p: any) => p.id === promptId);
      if (prompt && prompt.provider) {
        return prompt.provider;
      }
    }
  } catch (e) {
    // handle error or log
  }
  return undefined;
}
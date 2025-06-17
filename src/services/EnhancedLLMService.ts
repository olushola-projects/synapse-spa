// EnhancedLLMService.ts
// Advanced LLM orchestration and registry for multi-model GRC platform

export interface EnhancedModelInfo {
  provider: string;
  model: string;
  purpose: string;
  configLocation: string;
  capabilities: string[];
}

export const MODEL_REGISTRY: EnhancedModelInfo[] = [
  {
    provider: 'google',
    model: 'gemini-2.5-pro',
    purpose: 'prompt evaluation/testing',
    configLocation: 'promptfooconfig.yaml',
    capabilities: ['chat', 'reasoning', 'compliance QA']
  },
  {
    provider: 'deepseek',
    model: 'text-embedding-3-small',
    purpose: 'RAG embedding',
    configLocation: 'EnhancedRAGService.ts',
    capabilities: ['embedding', 'semantic search']
  },
  {
    provider: 'deepseek',
    model: 'text-embedding-3-large',
    purpose: 'RAG embedding',
    configLocation: 'EnhancedRAGService.ts',
    capabilities: ['embedding', 'semantic search']
  },
  {
    provider: 'hf',
    model: 'sentence-transformers/all-MiniLM-L6-v2',
    purpose: 'alternative embedding option',
    configLocation: 'EnhancedRAGService.ts',
    capabilities: ['embedding', 'semantic search']
  }
];

import fs from 'fs';
import yaml from 'js-yaml';

export function getModelInfo(model: string): EnhancedModelInfo | undefined {
  return MODEL_REGISTRY.find(m => m.model === model);
}

export function listAllEnhancedModels(): EnhancedModelInfo[] {
  return MODEL_REGISTRY;
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
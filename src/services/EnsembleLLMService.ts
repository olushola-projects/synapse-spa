// EnsembleLLMService.ts
// Invokes two LLMs in parallel, compares outputs, and reranks by confidence for SFDRNavigator

import { getModelConfig } from './LLMService';

export interface LLMResponse {
  output: string;
  model: string;
}

export interface EnsembleOptions {
  prompt: string;
  models: string[]; // e.g. ['gemini-2.5-pro', 'deepseek:text-embedding-3-small']
  keywords?: string[]; // e.g. ['Article 9', 'disclosure']
}

// Mocked LLM call (replace with real API integration)
async function callLLM(model: string, prompt: string): Promise<string> {
  // In production, route to the correct LLM provider
  return `[${model}] ${prompt}`;
}

function overlapScore(a: string, b: string): number {
  // Simple token overlap
  const setA = new Set(a.split(/\s+/));
  const setB = new Set(b.split(/\s+/));
  let overlap = 0;
  setA.forEach(token => {
    if (setB.has(token)) overlap++;
  });
  return overlap / Math.max(setA.size, setB.size);
}

function keywordCoverage(output: string, keywords: string[]): number {
  if (!keywords || keywords.length === 0) return 0;
  let count = 0;
  for (const kw of keywords) {
    if (output.includes(kw)) count++;
  }
  return count / keywords.length;
}

export async function ensembleSFDRNavigator(options: EnsembleOptions): Promise<{best: LLMResponse, all: LLMResponse[], confidence: number}> {
  const { prompt, models, keywords } = options;
  const results: LLMResponse[] = [];
  for (const model of models) {
    const output = await callLLM(model, prompt);
    results.push({ output, model });
  }
  // Compare outputs
  let best = results[0];
  let confidence = 1;
  if (results.length > 1) {
    // Heuristic: prefer output with higher keyword coverage, then longer output, then overlap
    const scores = results.map(r => ({
      coverage: keywords ? keywordCoverage(r.output, keywords) : 0,
      length: r.output.length,
      output: r.output,
      model: r.model
    }));
    scores.sort((a, b) => b.coverage - a.coverage || b.length - a.length);
    best = results.find(r => r.output === scores[0].output)!;
    if (results.length === 2) {
      confidence = overlapScore(results[0].output, results[1].output);
    }
  }
  return { best, all: results, confidence };
}
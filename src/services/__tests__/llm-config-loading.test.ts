import { getPromptProviderModel as getPromptProviderModelBasic } from '../LLMService';
import { getPromptProviderModel as getPromptProviderModelEnhanced } from '../EnhancedLLMService';

describe('Per-prompt provider/model config loading', () => {
  it('should load default and fallback provider/model for sfdr-navigator (basic)', () => {
    const provider = getPromptProviderModelBasic('sfdr-navigator');
    expect(provider).toBeDefined();
    expect(provider?.default).toBe('google:gemini-2.5-pro');
    expect(provider?.fallback).toBe('deepseek:text-embedding-3-small');
  });

  it('should load default and fallback provider/model for sfdr-navigator (enhanced)', () => {
    const provider = getPromptProviderModelEnhanced('sfdr-navigator');
    expect(provider).toBeDefined();
    expect(provider?.default).toBe('google:gemini-2.5-pro');
    expect(provider?.fallback).toBe('deepseek:text-embedding-3-small');
  });

  it('should return undefined for unknown prompt id', () => {
    expect(getPromptProviderModelBasic('unknown-prompt')).toBeUndefined();
    expect(getPromptProviderModelEnhanced('unknown-prompt')).toBeUndefined();
  });
});
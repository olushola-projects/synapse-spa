import { ensembleSFDRNavigator } from '../EnsembleLLMService';

describe('EnsembleLLMService', () => {
  it('should pick the output with higher keyword coverage', async () => {
    // Mock callLLM to return different outputs
    const spy = jest.spyOn(require('../EnsembleLLMService'), 'callLLM' as any);
    spy.mockImplementationOnce(async () => 'Article 9 disclosure: compliant').mockImplementationOnce(async () => 'Compliant');
    const result = await ensembleSFDRNavigator({
      prompt: 'Test prompt',
      models: ['gemini-2.5-pro', 'deepseek:text-embedding-3-small'],
      keywords: ['Article 9', 'disclosure']
    });
    expect(result.best.output).toContain('Article 9 disclosure');
    spy.mockRestore();
  });

  it('should compute overlap confidence', async () => {
    const spy = jest.spyOn(require('../EnsembleLLMService'), 'callLLM' as any);
    spy.mockImplementationOnce(async () => 'A B C').mockImplementationOnce(async () => 'A B D');
    const result = await ensembleSFDRNavigator({
      prompt: 'Test',
      models: ['gemini-2.5-pro', 'deepseek:text-embedding-3-small']
    });
    expect(result.confidence).toBeGreaterThan(0);
    spy.mockRestore();
  });

  it('should merge and rerank outputs with equal coverage', async () => {
    const spy = jest.spyOn(require('../EnsembleLLMService'), 'callLLM' as any);
    spy.mockImplementationOnce(async () => 'A B').mockImplementationOnce(async () => 'A B');
    const result = await ensembleSFDRNavigator({
      prompt: 'Test',
      models: ['gemini-2.5-pro', 'deepseek:text-embedding-3-small'],
      keywords: ['A', 'B']
    });
    expect(result.best.output).toBe('A B');
    expect(result.confidence).toBe(1);
    spy.mockRestore();
  });
});
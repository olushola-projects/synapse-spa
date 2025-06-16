import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SFDRNavigatorAgent } from '../SFDRNavigatorAgent';
import * as regulatory from '../../regulatory';
import SFDRSchema from '@/schemas/sfdr.json';
import { validateResponse } from '@/utils/validation';

const validSFDR = {
  entityId: 'entity-123',
  disclosureDate: '2025-06-16',
  indicators: [
    { indicatorId: 'GHG', value: 123.45, unit: 'tCO2e' }
  ],
  productType: 'fund',
  esgStrategy: 'Best-in-class',
  referencePeriod: '2024',
  notes: 'All good.'
};

const invalidSFDR = {
  entityId: 'entity-123',
  // disclosureDate missing
  indicators: [] // empty, should fail minItems
};

describe('SFDRNavigatorAgent', () => {
  let agent: SFDRNavigatorAgent;

  beforeEach(() => {
    agent = new SFDRNavigatorAgent();
    vi.resetAllMocks();
  });

  it('passes validation for valid SFDR data', async () => {
    vi.spyOn(regulatory, 'fetchRegulatory').mockResolvedValue(validSFDR);
    const input = { entityId: 'entity-123', securityIds: [], startDate: '', endDate: '' };
    await expect(agent.run(input)).resolves.toBeDefined();
  });

  it('throws validation error for invalid SFDR data', async () => {
    vi.spyOn(regulatory, 'fetchRegulatory').mockResolvedValue(invalidSFDR);
    const input = { entityId: 'entity-123', securityIds: [], startDate: '', endDate: '' };
    await expect(agent.run(input)).rejects.toThrow(/Validation failed/);
  });
});

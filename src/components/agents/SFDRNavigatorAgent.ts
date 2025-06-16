// src/services/agents/SFDRNavigatorAgent.ts
import type { FireRegulationSchema } from '@/types/regulatory';
import { validateResponse } from '@/utils/schema-validator';

export interface SFDRInput { /* … */ }
export interface SFDROutput { /* … */ }

export class SFDRNavigatorAgent {
  async run(input: SFDRInput): Promise<SFDROutput> {
    // fetch raw data ...
    const raw = await fetch('/api/sfdr', {/*…*/}).then(r => r.json());
    // validate against the FIRE schema wrapper
    const validated = await validateResponse(
      FireRegulationSchema, 
      raw, 
      'SFDR Navigator'
    );
    // map to your SFDROutput
    return mapToSFDROutput(validated.data);
  }
}

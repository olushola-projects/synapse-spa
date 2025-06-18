import type { Account, Security, Entity, Customer } from '../../types/regulatory';
import SFDRSchema from '@/schemas/sfdr.json';
import { validateResponse } from '@/utils/validation';
import { fetchRegulatory } from '@/services/regulatory';

export interface SFDRInput {
  // SFDR requires entity and security information for proper reporting
  entityId: string;
  securityIds: string[];
  // Optional customer context for retail vs institutional reporting
  customerId?: string;
  // Date range for the report
  startDate: string;
  endDate: string;
}

// Enhanced interfaces for SFDR-enriched data
export interface SustainabilityPreferences {
  esgStrategy: string;
  principalAdverseImpacts: Array<{
    indicatorId: string;
    value: number | string | boolean;
    unit?: string;
  }>;
}

export interface ESGCharacteristics {
  sustainabilityFactors: Array<{
    indicatorId: string;
    value: number | string | boolean;
    unit?: string;
  }>;
  socialFactors: Array<{
    indicatorId: string;
    value: number | string | boolean;
    unit?: string;
  }>;
}

export interface SustainableInvestmentAllocation {
  percentage: number;
  criteria: string;
  reportingPeriod: string;
}

export interface EnrichedEntity extends Entity {
  sfrDisclosure: any;
  sustainabilityPreferences: SustainabilityPreferences;
}

export interface EnrichedSecurity extends Security {
  esgCharacteristics: ESGCharacteristics;
}

export interface EnrichedAccount extends Account {
  sustainableInvestmentAllocation: SustainableInvestmentAllocation;
}

export interface SFDROutput {
  // Entity details with sustainability preferences
  entity: EnrichedEntity;
  // Securities with their ESG characteristics
  securities: EnrichedSecurity[];
  // Optional customer profile if provided
  customer?: Customer;
  // Related accounts and their sustainable investment allocations
  accounts: EnrichedAccount[];
  // Validation status
  validated: boolean;
}

export class SFDRNavigatorAgent {
  private async fetchEntityData(entityId: string): Promise<Entity> {
    const response = await fetch(`/api/fire/entities/${entityId}`);
    const data = await response.json();
    validateResponse('entity', data);
    return data;
  }

  private async fetchSecurities(securityIds: string[]): Promise<Security[]> {
    const securities = await Promise.all(
      securityIds.map(async (id) => {
        const response = await fetch(`/api/fire/securities/${id}`);
        const data = await response.json();
        validateResponse('security', data);
        return data;
      })
    );
    return securities;
  }

  private async fetchCustomer(customerId: string): Promise<Customer | undefined> {
    if (!customerId) return undefined;
    const response = await fetch(`/api/fire/customers/${customerId}`);
    const data = await response.json();
    validateResponse('customer', data);
    return data;
  }

  private async fetchAccounts(entityId: string): Promise<Account[]> {
    const response = await fetch(`/api/fire/accounts?entityId=${entityId}`);
    const data = await response.json();
    if (Array.isArray(data)) {
      data.forEach((account) => validateResponse('account', account));
      return data;
    } else {
      validateResponse('account', data);
      return [data];
    }
  }

  async run(input: SFDRInput): Promise<SFDROutput> {
    try {
      // Fetch SFDR regulatory data
      const sfrData = await fetchRegulatory<any>('sfdr', input.entityId);
      const validatedSFDR = validateResponse<typeof SFDRSchema>(SFDRSchema, sfrData, 'SFDRNavigatorAgent');
      
      // Fetch related FIRE data in parallel
      const [entity, securities, customer, accounts] = await Promise.all([
        this.fetchEntityData(input.entityId),
        this.fetchSecurities(input.securityIds),
        input.customerId ? this.fetchCustomer(input.customerId) : Promise.resolve(undefined),
        this.fetchAccounts(input.entityId)
      ]);
      
      // Map and enrich data with SFDR context
       const enrichedEntity: EnrichedEntity = {
         ...entity,
         sfrDisclosure: validatedSFDR,
         sustainabilityPreferences: {
           esgStrategy: validatedSFDR.esgStrategy || 'Not specified',
           principalAdverseImpacts: validatedSFDR.indicators || []
         }
       };
       
       const enrichedSecurities: EnrichedSecurity[] = securities.map(security => ({
         ...security,
         esgCharacteristics: {
           sustainabilityFactors: (validatedSFDR.indicators || []).filter((ind: any) => 
             ['GHG_EMISSIONS', 'WATER_USAGE', 'WASTE_GENERATION'].includes(ind.indicatorId)
           ),
           socialFactors: (validatedSFDR.indicators || []).filter((ind: any) => 
             ['GENDER_PAY_GAP', 'BOARD_GENDER_DIVERSITY'].includes(ind.indicatorId)
           )
         }
       }));
       
       const enrichedAccounts: EnrichedAccount[] = accounts.map(account => ({
         ...account,
         sustainableInvestmentAllocation: {
           percentage: Math.random() * 100, // Mock calculation - replace with actual logic
           criteria: validatedSFDR.esgStrategy || 'Standard ESG criteria',
           reportingPeriod: validatedSFDR.referencePeriod || new Date().getFullYear().toString()
         }
       }));
      
      return {
        entity: enrichedEntity,
        securities: enrichedSecurities,
        customer,
        accounts: enrichedAccounts,
        validated: true
      };
    } catch (error) {
      console.error('SFDR Navigator error:', error);
      throw new Error(`SFDR processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

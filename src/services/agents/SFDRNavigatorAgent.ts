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

export interface SFDROutput {
  // Entity details with sustainability preferences
  entity: Entity;
  // Securities with their ESG characteristics
  securities: Security[];
  // Optional customer profile if provided
  customer?: Customer;
  // Related accounts and their sustainable investment allocations
  accounts: Account[];
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
    // Example: fetchRegulatory would need to support 'sfdr' endpoint or similar
    const raw = await fetchRegulatory<any>('sfdr', input.entityId);
    const validated = validateResponse<typeof SFDRSchema>(SFDRSchema, raw, 'SFDRNavigatorAgent');
    // TODO: map validated to SFDROutput as needed
    return {
      // ...map fields from validated to SFDROutput...
      entity: undefined as any,
      securities: [],
      accounts: [],
      validated: true
    };
  }
}

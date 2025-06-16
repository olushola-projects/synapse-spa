import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateResponse, fetchRegulatory } from '../regulatory';
import { SFDRNavigatorAgent } from '../agents/SFDRNavigatorAgent';

// Mock fetch
global.fetch = vi.fn();

describe('Regulatory Service', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('validateResponse', () => {
    it('validates entity data correctly', () => {
      const validEntity = {
        id: 'entity1',
        date: '2025-06-16T12:00:00Z',
        type: 'corporate', // valid enum value for entity.type
        version: "1.0.0",
        status: "active", // valid enum value for entity.status
        entity_identifier: {
          identifier: "ABC123",
          identifier_type: "LEI"
        }
      };

      expect(() => validateResponse('entity', validEntity)).not.toThrow();
    });

    it('throws on invalid data', () => {
      const invalidEntity = {
        id: 'entity1',
        type: 'INVALID_TYPE' // Missing required fields and invalid type
      };

      expect(() => validateResponse('entity', invalidEntity)).toThrow();
    });
  });

  describe('SFDRNavigatorAgent', () => {
    const agent = new SFDRNavigatorAgent();
    const mockInput = {
      entityId: 'entity1',
      securityIds: ['sec1', 'sec2'],
      customerId: 'cust1',
      startDate: '2025-01-01',
      endDate: '2025-12-31'
    };

    beforeEach(() => {
      // Mock successful responses with valid FIRE schema data
      (fetch as jest.Mock).mockImplementation((url) => {
        const data = {
          '/api/fire/entities/entity1': {
            id: 'entity1',
            date: '2025-06-16T12:00:00Z',
            type: 'corporate', // valid enum value
            version: "1.0.0",
            status: "active", // valid enum value
            entity_identifier: {
              identifier: "ABC123",
              identifier_type: "LEI"
            }
          },
          '/api/fire/securities/sec1': {
            id: 'sec1',
            date: '2025-06-16T12:00:00Z',
            type: 'bond', // valid enum value for security.type
            version: "1.0.0",
            status: "paid_up", // valid enum value for security.status
            security_identifier: {
              identifier: "SEC123",
              identifier_type: "ISIN"
            }
          },
          '/api/fire/securities/sec2': {
            id: 'sec2',
            date: '2025-06-16T12:00:00Z',
            type: 'bond', // valid enum value
            version: "1.0.0",
            status: "paid_up", // valid enum value for security.status
            security_identifier: {
              identifier: "SEC456",
              identifier_type: "ISIN"
            }
          },
          '/api/fire/customers/cust1': {
            id: 'cust1',
            date: '2025-06-16T12:00:00Z',
            type: 'corporate', // valid enum value for customer.type (inherits from entity)
            version: "1.0.0",
            status: "established", // valid enum value for customer.status
            customer_identifier: {
              identifier: "CUST123",
              identifier_type: "INTERNAL"
            }
          },
          '/api/fire/accounts?entityId=entity1': [{
            id: 'acc1',
            date: '2025-06-16T12:00:00Z',
            type: 'current', // valid enum value for account.type
            version: "1.0.0",
            status: "active", // valid enum value
            account_identifier: {
              identifier: "ACC123",
              identifier_type: "INTERNAL"
            }
          }]
        }[url];

        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(data)
        });
      });
    });

    it('fetches and validates all required data', async () => {
      const result = await agent.run(mockInput);

      expect(result.validated).toBe(true);
      expect(result.entity).toBeDefined();
      expect(result.securities).toHaveLength(2);
      expect(result.customer).toBeDefined();
      expect(result.accounts).toHaveLength(1);
    });

    it('handles missing optional customer data', async () => {
      const inputWithoutCustomer = { ...mockInput, customerId: undefined };
      const result = await agent.run(inputWithoutCustomer);

      expect(result.validated).toBe(true);
      expect(result.customer).toBeUndefined();
    });
  });
});

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SFDRNavigatorAgent } from '../../components/agents/SFDRNavigatorAgent';
import { NayaOneESGData } from '../../types/sfdr';

// Mock fetch for testing
global.fetch = vi.fn();

describe('NayaOne ESG Data Integration', () => {
  let agent: SFDRNavigatorAgent;
  const mockFetch = vi.mocked(fetch);

  beforeEach(() => {
    agent = new SFDRNavigatorAgent();
    vi.clearAllMocks();
    
    // Set up environment variable for testing
    process.env.NAYAONE_SANDPIT_KEY = 'test-sandpit-key-12345';
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('fetchNayaOneESGData', () => {
    it('should fetch ESG data with proper headers and pagination', async () => {
      const mockESGData = [
        {
          company_id: 'AAPL',
          company_name: 'Apple Inc.',
          ticker: 'AAPL',
          sector: 'Technology',
          country: 'United States',
          esg_score: 85.5,
          environmental_score: 88.2,
          social_score: 82.1,
          governance_score: 86.8,
          carbon_intensity: 12.5,
          taxonomy_alignment: 0.35,
          sustainable_investment_percentage: 0.42
        }
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockESGData,
        status: 200,
        statusText: 'OK'
      } as Response);

      // Access private method for testing
      const result = await (agent as any).fetchNayaOneESGData(0);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://data.nayaone.com/esg_scores?offset=0',
        {
          method: 'GET',
          headers: {
            'Accept-Profile': 'api',
            'sandpit-key': 'test-sandpit-key-12345'
          }
        }
      );

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        provider: 'nayaone',
        companyId: 'AAPL',
        companyName: 'Apple Inc.',
        ticker: 'AAPL',
        sector: 'Technology',
        country: 'United States'
      });
    });

    it('should handle pagination correctly', async () => {
      const mockPage1 = Array(10).fill(null).map((_, i) => ({
        company_id: `COMP${i}`,
        company_name: `Company ${i}`,
        esg_score: 70 + i
      }));

      const mockPage2 = Array(5).fill(null).map((_, i) => ({
        company_id: `COMP${i + 10}`,
        company_name: `Company ${i + 10}`,
        esg_score: 80 + i
      }));

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockPage1,
          status: 200,
          statusText: 'OK'
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockPage2,
          status: 200,
          statusText: 'OK'
        } as Response);

      const result = await (agent as any).fetchNayaOneESGData(0);

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockFetch).toHaveBeenNthCalledWith(1, 
        'https://data.nayaone.com/esg_scores?offset=0',
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenNthCalledWith(2,
        'https://data.nayaone.com/esg_scores?offset=10',
        expect.any(Object)
      );
      
      expect(result).toHaveLength(15);
    });

    it('should handle API errors gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized'
      } as Response);

      await expect((agent as any).fetchNayaOneESGData(0))
        .rejects
        .toThrow('NayaOne ESG API integration failed');
    });

    it('should respect safety limit', async () => {
      // Mock 101 pages of 10 records each to test safety limit
      const mockPage = Array(10).fill(null).map((_, i) => ({
        company_id: `COMP${i}`,
        company_name: `Company ${i}`,
        esg_score: 75
      }));

      mockFetch.mockImplementation(() => 
        Promise.resolve({
          ok: true,
          json: async () => mockPage,
          status: 200,
          statusText: 'OK'
        } as Response)
      );

      const result = await (agent as any).fetchNayaOneESGData(0);

      // Should stop at 1000 records due to safety limit
      expect(result).toHaveLength(1000);
      expect(mockFetch).toHaveBeenCalledTimes(100); // 100 calls * 10 records = 1000
    });
  });

  describe('transformNayaOneESGData', () => {
    it('should transform raw data to internal format correctly', () => {
      const rawData = [
        {
          company_id: 'MSFT',
          company_name: 'Microsoft Corporation',
          ticker: 'MSFT',
          sector: 'Technology',
          industry: 'Software',
          country: 'United States',
          esg_score: 92.3,
          environmental_score: 89.5,
          social_score: 94.1,
          governance_score: 93.2,
          esg_rating: 'AA',
          carbon_intensity: 8.2,
          water_usage: 1250,
          employee_turnover: 0.08,
          board_diversity: 0.45,
          taxonomy_alignment: 0.68,
          sustainable_investment_percentage: 0.72,
          last_updated: '2023-12-01',
          data_reliability: 'high'
        }
      ];

      const result = (agent as any).transformNayaOneESGData(rawData);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        provider: 'nayaone',
        companyId: 'MSFT',
        companyName: 'Microsoft Corporation',
        ticker: 'MSFT',
        sector: 'Technology',
        industry: 'Software',
        country: 'United States',
        esgScore: {
          overall: 92.3,
          environmental: 89.5,
          social: 94.1,
          governance: 93.2
        },
        ratings: {
          esgRating: 'AA'
        },
        metrics: {
          carbonIntensity: 8.2,
          waterUsage: 1250,
          employeeTurnover: 0.08,
          boardDiversity: 0.45
        },
        sfdrIndicators: {
          taxonomyAlignment: 0.68,
          sustainableInvestment: 0.72
        },
        lastUpdated: '2023-12-01',
        dataQuality: {
          reliability: 'high',
          source: 'nayaone_global_esg_2022_2023'
        }
      });
    });

    it('should calculate data completeness correctly', () => {
      const completeRecord = {
        company_name: 'Complete Corp',
        esg_score: 85,
        environmental_score: 80,
        social_score: 85,
        governance_score: 90,
        sector: 'Finance',
        country: 'Germany'
      };

      const incompleteRecord = {
        company_name: 'Incomplete Corp',
        esg_score: 75,
        // Missing other required fields
      };

      const completeResult = (agent as any).calculateDataCompleteness(completeRecord);
      const incompleteResult = (agent as any).calculateDataCompleteness(incompleteRecord);

      expect(completeResult).toBe(100);
      expect(incompleteResult).toBeLessThan(50);
    });
  });

  describe('ESG Data Integration in SFDR Agent', () => {
    it('should include NayaOne data in ESG data collection', async () => {
      const mockNayaOneData = [{
        company_id: 'TEST',
        company_name: 'Test Company',
        esg_score: 80
      }];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockNayaOneData,
        status: 200,
        statusText: 'OK'
      } as Response);

      // Mock other ESG provider calls to fail
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      } as Response);

      const result = await (agent as any).fetchESGData();

      expect(result).toHaveLength(1);
      expect(result[0].provider).toBe('nayaone');
      expect(result[0].companyName).toBe('Test Company');
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect((agent as any).fetchNayaOneESGData(0))
        .rejects
        .toThrow('NayaOne ESG API integration failed');
    });

    it('should handle invalid JSON responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => { throw new Error('Invalid JSON'); },
        status: 200,
        statusText: 'OK'
      } as Response);

      await expect((agent as any).fetchNayaOneESGData(0))
        .rejects
        .toThrow('NayaOne ESG API integration failed');
    });

    it('should use fallback API key when environment variable is missing', async () => {
      delete process.env.NAYAONE_SANDPIT_KEY;

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
        status: 200,
        statusText: 'OK'
      } as Response);

      await (agent as any).fetchNayaOneESGData(0);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'sandpit-key': 'your-sandpit-api-key'
          })
        })
      );
    });
  });
});
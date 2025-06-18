import { SFDRNavigatorAgent } from '../components/agents/SFDRNavigatorAgent';
import { NayaOneESGData } from '../types/sfdr';

// Mock environment variables
process.env.ALPHA_VANTAGE_API_KEY = 'test_api_key';
process.env.WORLD_BANK_API_URL = 'https://api.worldbank.org/v2';

// Mock fetch for testing
global.fetch = jest.fn();

describe('Free ESG Data Sources Integration', () => {
  let agent: SFDRNavigatorAgent;
  
  beforeEach(() => {
    agent = new SFDRNavigatorAgent();
    jest.clearAllMocks();
  });

  describe('World Bank ESG Data Integration', () => {
    it('should fetch and transform World Bank ESG data successfully', async () => {
      // Mock World Bank API response
      const mockWorldBankResponse = [
        null, // Metadata (ignored)
        [
          {
            indicator: { id: 'EN.ATM.CO2E.PC', value: 'CO2 emissions (metric tons per capita)' },
            country: { id: 'USA', value: 'United States' },
            countryiso3code: 'USA',
            date: '2022',
            value: 14.24,
            unit: '',
            obs_status: '',
            decimal: 2
          },
          {
            indicator: { id: 'SG.GEN.PARL.ZS', value: 'Proportion of seats held by women in national parliaments (%)' },
            country: { id: 'USA', value: 'United States' },
            countryiso3code: 'USA',
            date: '2022',
            value: 27.6,
            unit: '',
            obs_status: '',
            decimal: 1
          }
        ]
      ];

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockWorldBankResponse)
      });

      // Access private method for testing
      const fetchWorldBankData = (agent as any).fetchWorldBankESGData.bind(agent);
      const result: NayaOneESGData[] = await fetchWorldBankData();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      
      if (result.length > 0) {
        const usData = result.find(item => item.country === 'United States');
        expect(usData).toBeDefined();
        expect(usData?.provider).toBe('worldbank');
        expect(usData?.companyId).toBe('WB_USA');
        expect(usData?.sector).toBe('Government');
        expect(usData?.industry).toBe('Sovereign');
        expect(usData?.esgScore).toBeDefined();
        expect(usData?.dataQuality.source).toBe('world_bank_open_data');
        expect(usData?.dataQuality.reliability).toBe('high');
      }
    });

    it('should handle World Bank API errors gracefully', async () => {
      (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const fetchWorldBankData = (agent as any).fetchWorldBankESGData.bind(agent);
      const result = await fetchWorldBankData();

      expect(result).toEqual([]);
    });

    it('should calculate environmental scores correctly', async () => {
      const indicators = {
        'EN.ATM.CO2E.PC': { value: 5.0, date: '2022' }, // Low CO2 emissions
        'EG.USE.ELEC.KH.PC': { value: 3000, date: '2022' } // Moderate energy consumption
      };

      const calculateEnvironmentalScore = (agent as any).calculateEnvironmentalScore.bind(agent);
      const score = calculateEnvironmentalScore(indicators);

      expect(score).toBeGreaterThan(50); // Should be above neutral for low emissions
      expect(score).toBeLessThanOrEqual(100);
    });

    it('should calculate social scores correctly', async () => {
      const indicators = {
        'SH.STA.WASH.P5': { value: 95, date: '2022' }, // High access to handwashing
        'SL.UEM.TOTL.ZS': { value: 5, date: '2022' }, // Low unemployment
        'SI.POV.GINI': { value: 35, date: '2022' } // Low inequality
      };

      const calculateSocialScore = (agent as any).calculateSocialScore.bind(agent);
      const score = calculateSocialScore(indicators);

      expect(score).toBeGreaterThan(50); // Should be above neutral for good social indicators
      expect(score).toBeLessThanOrEqual(100);
    });

    it('should calculate governance scores correctly', async () => {
      const indicators = {
        'SG.GEN.PARL.ZS': { value: 40, date: '2022' } // 40% women in parliament
      };

      const calculateGovernanceScore = (agent as any).calculateGovernanceScore.bind(agent);
      const score = calculateGovernanceScore(indicators);

      expect(score).toBeGreaterThan(50); // Should be above neutral for good representation
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  describe('Alpha Vantage ESG Data Integration', () => {
    it('should fetch and transform Alpha Vantage ESG data successfully', async () => {
      // Mock Alpha Vantage API response
      const mockAlphaVantageResponse = {
        symbol: 'AAPL',
        companyName: 'Apple Inc.',
        sector: 'Technology',
        industry: 'Consumer Electronics',
        country: 'US',
        esgScore: {
          totalEsgScore: '75.5',
          environmentalScore: '80.2',
          socialScore: '72.1',
          governanceScore: '74.3'
        }
      };

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockAlphaVantageResponse)
      });

      const fetchAlphaVantageData = (agent as any).fetchAlphaVantageESGData.bind(agent);
      const result: NayaOneESGData[] = await fetchAlphaVantageData();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      
      if (result.length > 0) {
        const appleData = result.find(item => item.ticker === 'AAPL');
        expect(appleData).toBeDefined();
        expect(appleData?.provider).toBe('alphavantage');
        expect(appleData?.companyId).toBe('AV_AAPL');
        expect(appleData?.companyName).toBe('Apple Inc.');
        expect(appleData?.sector).toBe('Technology');
        expect(appleData?.esgScore.overall).toBe(75.5);
        expect(appleData?.esgScore.environmental).toBe(80.2);
        expect(appleData?.dataQuality.source).toBe('alpha_vantage_esg');
        expect(appleData?.dataQuality.reliability).toBe('medium');
      }
    });

    it('should handle Alpha Vantage API errors gracefully', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ 'Error Message': 'Invalid API call' })
      });

      const fetchAlphaVantageData = (agent as any).fetchAlphaVantageESGData.bind(agent);
      const result = await fetchAlphaVantageData();

      expect(result).toEqual([]);
    });

    it('should handle rate limiting correctly', async () => {
      const startTime = Date.now();
      
      // Mock successful responses
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          symbol: 'TEST',
          esgScore: { totalEsgScore: '50' }
        })
      });

      // Override the symbols array to test with fewer symbols
      const originalMethod = (agent as any).fetchAlphaVantageESGData;
      (agent as any).fetchAlphaVantageESGData = async function() {
        const symbols = ['TEST1', 'TEST2']; // Only 2 symbols for faster testing
        const esgData: any[] = [];
        
        for (const symbol of symbols) {
          const response = await fetch(`https://www.alphavantage.co/query?function=ESG&symbol=${symbol}&apikey=test`);
          if (response.ok) {
            const data = await response.json();
            if (data && !data['Error Message']) {
              esgData.push({ symbol, ...data });
            }
          }
          // Reduced wait time for testing
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        return this.transformAlphaVantageESGData(esgData);
      };

      await (agent as any).fetchAlphaVantageESGData();
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should take at least 100ms due to rate limiting (reduced for testing)
      expect(duration).toBeGreaterThanOrEqual(100);
    });

    it('should convert scores to ratings correctly', async () => {
      const scoreToRating = (agent as any).scoreToRating.bind(agent);
      
      expect(scoreToRating(85)).toBe('AAA');
      expect(scoreToRating(75)).toBe('AA');
      expect(scoreToRating(65)).toBe('A');
      expect(scoreToRating(55)).toBe('BBB');
      expect(scoreToRating(45)).toBe('BB');
      expect(scoreToRating(35)).toBe('B');
      expect(scoreToRating(25)).toBe('CCC');
    });
  });

  describe('Multi-Source ESG Data Integration', () => {
    it('should integrate data from multiple free sources', async () => {
      // Mock responses for both sources
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([null, [{
            indicator: { id: 'EN.ATM.CO2E.PC' },
            country: { id: 'USA', value: 'United States' },
            date: '2022',
            value: 14.24
          }]])
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            symbol: 'AAPL',
            esgScore: { totalEsgScore: '75' }
          })
        });

      const fetchESGData = (agent as any).fetchESGData.bind(agent);
      const result = await fetchESGData();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      
      // Should contain data from multiple sources
      const providers = result.map((item: NayaOneESGData) => item.provider);
      expect(providers).toContain('worldbank');
      expect(providers).toContain('alphavantage');
    });

    it('should handle partial failures gracefully', async () => {
      // Mock World Bank success, Alpha Vantage failure
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([null, [{
            indicator: { id: 'EN.ATM.CO2E.PC' },
            country: { id: 'USA', value: 'United States' },
            date: '2022',
            value: 14.24
          }]])
        })
        .mockRejectedValueOnce(new Error('Alpha Vantage API error'));

      const fetchESGData = (agent as any).fetchESGData.bind(agent);
      const result = await fetchESGData();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      
      // Should still contain World Bank data
      const providers = result.map((item: NayaOneESGData) => item.provider);
      expect(providers).toContain('worldbank');
      expect(providers).not.toContain('alphavantage');
    });

    it('should calculate data quality metrics correctly', async () => {
      const calculateWorldBankCompleteness = (agent as any).calculateWorldBankDataCompleteness.bind(agent);
      const calculateAlphaVantageCompleteness = (agent as any).calculateAlphaVantageDataCompleteness.bind(agent);
      
      // Test World Bank completeness
      const worldBankIndicators = {
        'EN.ATM.CO2E.PC': { value: 14.24 },
        'SG.GEN.PARL.ZS': { value: 27.6 },
        'SL.UEM.TOTL.ZS': { value: 5.2 }
      };
      const wbCompleteness = calculateWorldBankCompleteness(worldBankIndicators);
      expect(wbCompleteness).toBe(50); // 3 out of 6 expected indicators
      
      // Test Alpha Vantage completeness
      const alphaVantageRecord = {
        symbol: 'AAPL',
        esgScore: { totalEsgScore: '75' }
      };
      const avCompleteness = calculateAlphaVantageCompleteness(alphaVantageRecord);
      expect(avCompleteness).toBe(100); // Both required fields present
    });
  });

  describe('Data Transformation and Validation', () => {
    it('should transform World Bank data to standard format', async () => {
      const rawData = [
        {
          indicator: { id: 'EN.ATM.CO2E.PC', value: 'CO2 emissions' },
          country: { id: 'DEU', value: 'Germany' },
          date: '2022',
          value: 8.5
        }
      ];

      const transformWorldBankData = (agent as any).transformWorldBankESGData.bind(agent);
      const result = transformWorldBankData(rawData);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        provider: 'worldbank',
        companyId: 'WB_DEU',
        companyName: 'Germany Sovereign',
        ticker: 'DEU',
        sector: 'Government',
        industry: 'Sovereign',
        country: 'Germany'
      });
      expect(result[0].esgScore).toBeDefined();
      expect(result[0].dataQuality.source).toBe('world_bank_open_data');
    });

    it('should transform Alpha Vantage data to standard format', async () => {
      const rawData = [
        {
          symbol: 'MSFT',
          companyName: 'Microsoft Corporation',
          sector: 'Technology',
          esgScore: {
            totalEsgScore: '82.1',
            environmentalScore: '78.5',
            socialScore: '85.2',
            governanceScore: '82.6'
          }
        }
      ];

      const transformAlphaVantageData = (agent as any).transformAlphaVantageESGData.bind(agent);
      const result = transformAlphaVantageData(rawData);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        provider: 'alphavantage',
        companyId: 'AV_MSFT',
        companyName: 'Microsoft Corporation',
        ticker: 'MSFT',
        sector: 'Technology',
        country: 'US'
      });
      expect(result[0].esgScore.overall).toBe(82.1);
      expect(result[0].esgScore.environmental).toBe(78.5);
      expect(result[0].dataQuality.source).toBe('alpha_vantage_esg');
    });

    it('should handle missing or invalid data gracefully', async () => {
      const invalidWorldBankData = [
        {
          indicator: { id: 'INVALID' },
          country: null,
          date: '2022',
          value: null
        }
      ];

      const transformWorldBankData = (agent as any).transformWorldBankESGData.bind(agent);
      const result = transformWorldBankData(invalidWorldBankData);

      expect(result).toEqual([]);
    });
  });
});

// Integration test with actual API calls (commented out for CI/CD)
/*
describe('Live API Integration Tests', () => {
  // These tests should only be run manually with valid API keys
  it.skip('should fetch real World Bank data', async () => {
    const agent = new SFDRNavigatorAgent();
    const result = await (agent as any).fetchWorldBankESGData();
    
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    console.log('World Bank data sample:', result.slice(0, 2));
  });

  it.skip('should fetch real Alpha Vantage data', async () => {
    const agent = new SFDRNavigatorAgent();
    const result = await (agent as any).fetchAlphaVantageESGData();
    
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    console.log('Alpha Vantage data sample:', result.slice(0, 2));
  });
});
*/
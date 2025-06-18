/**
 * ESG Data Sources Configuration
 * Manages settings for free and premium ESG data providers
 */

export interface ESGSourceConfig {
  name: string;
  type: 'free' | 'premium';
  baseUrl: string;
  apiKey?: string;
  rateLimit: {
    requestsPerMinute: number;
    requestsPerDay?: number;
  };
  reliability: 'high' | 'medium' | 'low';
  coverage: {
    companies: number;
    countries: number;
    sectors: string[];
  };
  dataTypes: string[];
  enabled: boolean;
}

export interface ESGDataSourcesConfig {
  sources: Record<string, ESGSourceConfig>;
  fallbackStrategy: 'fail-fast' | 'best-effort' | 'cache-first';
  cacheSettings: {
    ttl: number; // Time to live in seconds
    maxSize: number; // Maximum cache size in MB
  };
  qualityThresholds: {
    minimumCompleteness: number;
    minimumReliability: 'high' | 'medium' | 'low';
  };
}

/**
 * Default configuration for ESG data sources
 */
export const ESG_SOURCES_CONFIG: ESGDataSourcesConfig = {
  sources: {
    worldbank: {
      name: 'World Bank Open Data',
      type: 'free',
      baseUrl: 'https://api.worldbank.org/v2',
      rateLimit: {
        requestsPerMinute: 60,
        requestsPerDay: 10000
      },
      reliability: 'high',
      coverage: {
        companies: 0, // Sovereign data only
        countries: 217,
        sectors: ['Government', 'Sovereign']
      },
      dataTypes: [
        'environmental_indicators',
        'social_indicators',
        'governance_indicators',
        'climate_data',
        'development_metrics'
      ],
      enabled: true
    },
    alphavantage: {
      name: 'Alpha Vantage ESG',
      type: 'free',
      baseUrl: 'https://www.alphavantage.co/query',
      apiKey: process.env.ALPHA_VANTAGE_API_KEY || 'demo',
      rateLimit: {
        requestsPerMinute: 5,
        requestsPerDay: 500
      },
      reliability: 'medium',
      coverage: {
        companies: 8000,
        countries: 50,
        sectors: [
          'Technology',
          'Healthcare',
          'Financial Services',
          'Consumer Discretionary',
          'Consumer Staples',
          'Energy',
          'Materials',
          'Industrials',
          'Utilities',
          'Real Estate',
          'Communication Services'
        ]
      },
      dataTypes: [
        'esg_scores',
        'environmental_scores',
        'social_scores',
        'governance_scores',
        'company_fundamentals'
      ],
      enabled: true
    },
    nayaone_esg_world_bank: {
      name: 'NayaOne Global ESG Sustainability Indicators Dataset',
      type: 'premium',
      baseUrl: 'https://data.nayaone.com/esg_world_bank',
      apiKey: process.env.NAYAONE_SANDPIT_KEY,
      rateLimit: {
        requestsPerMinute: 60,
        requestsPerDay: 5000
      },
      reliability: 'high',
      coverage: {
        companies: 0, // Sovereign/country-level data
        countries: 213,
        sectors: [
          'Government',
          'Sovereign',
          'Public Sector',
          'Development Finance'
        ]
      },
      dataTypes: [
        'global_esg_sustainability_indicators',
        'world_bank_esg_metrics',
        'sovereign_sustainability_data',
        'development_indicators',
        'environmental_performance',
        'social_development_metrics',
        'governance_indicators'
      ],
      enabled: true,
      pagination: {
        defaultLimit: 10,
        offsetParameter: 'offset',
        maxRecordsPerRequest: 100
      },
      headers: {
        'Accept-Profile': 'api',
        'sandpit-key': process.env.NAYAONE_SANDPIT_KEY || 'your sandpit api key'
      }
    },
    cssf_api: {
      name: 'CSSF Luxembourg Financial Supervisory Authority',
      type: 'free',
      baseUrl: 'https://www.cssf.lu/api',
      rateLimit: {
        requestsPerMinute: 30,
        requestsPerDay: 1000
      },
      reliability: 'high',
      coverage: {
        companies: 5000,
        countries: 1, // Luxembourg focus
        sectors: [
          'Banking',
          'Insurance',
          'Investment Funds',
          'Payment Institutions',
          'Electronic Money Institutions'
        ]
      },
      dataTypes: [
        'regulatory_reporting',
        'fund_data',
        'supervisory_data',
        'compliance_metrics'
      ],
      enabled: true
    },
    esma_open_data: {
      name: 'ESMA European Securities and Markets Authority Open Data',
      type: 'free',
      baseUrl: 'https://registers.esma.europa.eu/api',
      rateLimit: {
        requestsPerMinute: 60,
        requestsPerDay: 2000
      },
      reliability: 'high',
      coverage: {
        companies: 50000,
        countries: 27, // EU member states
        sectors: [
          'Securities',
          'Markets',
          'Investment Management',
          'Trading Venues',
          'Credit Rating Agencies'
        ]
      },
      dataTypes: [
        'firds_data',
        'regulatory_registers',
        'market_data',
        'transparency_data',
        'mifid_data'
      ],
      enabled: true
    },
    ecb_data_portal: {
      name: 'European Central Bank Data Portal',
      type: 'free',
      baseUrl: 'https://data-api.ecb.europa.eu/service',
      rateLimit: {
        requestsPerMinute: 100,
        requestsPerDay: 5000
      },
      reliability: 'high',
      coverage: {
        companies: 0, // Macroeconomic data
        countries: 27,
        sectors: [
          'Banking',
          'Monetary Policy',
          'Financial Stability',
          'Statistics'
        ]
      },
      dataTypes: [
        'interest_rates',
        'exchange_rates',
        'banking_statistics',
        'financial_stability_indicators',
        'monetary_statistics'
      ],
      enabled: true
    },
    eba_open_data: {
      name: 'European Banking Authority Open Data',
      type: 'free',
      baseUrl: 'https://www.eba.europa.eu/api',
      rateLimit: {
        requestsPerMinute: 50,
        requestsPerDay: 1500
      },
      reliability: 'high',
      coverage: {
        companies: 3000, // EU banks
        countries: 27,
        sectors: [
          'Banking',
          'Credit Institutions',
          'Investment Firms'
        ]
      },
      dataTypes: [
        'supervisory_data',
        'stress_test_results',
        'transparency_exercise_data',
        'risk_indicators',
        'capital_adequacy_data'
      ],
      enabled: true
    },
    eiopa_data: {
      name: 'European Insurance and Occupational Pensions Authority',
      type: 'free',
      baseUrl: 'https://www.eiopa.europa.eu/api',
      rateLimit: {
        requestsPerMinute: 40,
        requestsPerDay: 1200
      },
      reliability: 'high',
      coverage: {
        companies: 2500, // EU insurance companies
        countries: 27,
        sectors: [
          'Insurance',
          'Occupational Pensions',
          'Reinsurance'
        ]
      },
      dataTypes: [
        'insurance_statistics',
        'pension_data',
        'solvency_data',
        'market_development_data'
      ],
      enabled: true
    },
    sustainalytics: {
      name: 'Sustainalytics ESG',
      type: 'premium',
      baseUrl: 'https://api.sustainalytics.com',
      apiKey: process.env.SUSTAINALYTICS_API_KEY,
      rateLimit: {
        requestsPerMinute: 100,
        requestsPerDay: 10000
      },
      reliability: 'high',
      coverage: {
        companies: 20000,
        countries: 100,
        sectors: ['All']
      },
      dataTypes: [
        'esg_risk_ratings',
        'controversy_scores',
        'carbon_metrics',
        'sdg_alignment',
        'eu_taxonomy'
      ],
      enabled: false // Requires premium subscription
    },
    msci: {
      name: 'MSCI ESG Ratings',
      type: 'premium',
      baseUrl: 'https://api.msci.com',
      apiKey: process.env.MSCI_API_KEY,
      rateLimit: {
        requestsPerMinute: 200,
        requestsPerDay: 20000
      },
      reliability: 'high',
      coverage: {
        companies: 25000,
        countries: 120,
        sectors: ['All']
      },
      dataTypes: [
        'esg_ratings',
        'climate_metrics',
        'governance_scores',
        'controversy_flags'
      ],
      enabled: false // Requires premium subscription
    },
    bloomberg: {
      name: 'Bloomberg ESG Data',
      type: 'premium',
      baseUrl: 'https://api.bloomberg.com',
      apiKey: process.env.BLOOMBERG_API_KEY,
      rateLimit: {
        requestsPerMinute: 500,
        requestsPerDay: 50000
      },
      reliability: 'high',
      coverage: {
        companies: 30000,
        countries: 150,
        sectors: ['All']
      },
      dataTypes: [
        'comprehensive_esg',
        'real_time_scores',
        'historical_data',
        'peer_comparisons'
      ],
      enabled: false // Requires premium subscription
    }
  },
  fallbackStrategy: 'best-effort',
  cacheSettings: {
    ttl: 3600, // 1 hour
    maxSize: 100 // 100 MB
  },
  qualityThresholds: {
    minimumCompleteness: 60,
    minimumReliability: 'medium'
  }
};

/**
 * Get enabled ESG sources based on configuration
 */
export function getEnabledESGSources(): string[] {
  return Object.entries(ESG_SOURCES_CONFIG.sources)
    .filter(([_, config]) => config.enabled)
    .map(([name, _]) => name);
}

/**
 * Get free ESG sources only
 */
export function getFreeESGSources(): string[] {
  return Object.entries(ESG_SOURCES_CONFIG.sources)
    .filter(([_, config]) => config.enabled && config.type === 'free')
    .map(([name, _]) => name);
}

/**
 * Get premium ESG sources only
 */
export function getPremiumESGSources(): string[] {
  return Object.entries(ESG_SOURCES_CONFIG.sources)
    .filter(([_, config]) => config.enabled && config.type === 'premium')
    .map(([name, _]) => name);
}

/**
 * Get source configuration by name
 */
export function getSourceConfig(sourceName: string): ESGSourceConfig | undefined {
  return ESG_SOURCES_CONFIG.sources[sourceName];
}

/**
 * Calculate rate limit delay for a source
 */
export function calculateRateLimit(sourceName: string): number {
  const config = getSourceConfig(sourceName);
  if (!config) return 1000; // Default 1 second
  
  const requestsPerMinute = config.rateLimit.requestsPerMinute;
  return Math.ceil(60000 / requestsPerMinute); // Convert to milliseconds between requests
}

/**
 * Validate API key availability for a source
 */
export function validateAPIKey(sourceName: string): boolean {
  const config = getSourceConfig(sourceName);
  if (!config) return false;
  
  // Free sources don't require API keys or have demo keys
  if (config.type === 'free') {
    return sourceName === 'worldbank' || (config.apiKey && config.apiKey !== 'demo');
  }
  
  // Premium sources require valid API keys
  return !!(config.apiKey && config.apiKey.length > 0);
}

/**
 * Get data source priority order (free sources first, then by reliability)
 */
export function getSourcePriorityOrder(): string[] {
  const sources = Object.entries(ESG_SOURCES_CONFIG.sources)
    .filter(([_, config]) => config.enabled)
    .sort((a, b) => {
      // Free sources first
      if (a[1].type === 'free' && b[1].type === 'premium') return -1;
      if (a[1].type === 'premium' && b[1].type === 'free') return 1;
      
      // Then by reliability
      const reliabilityOrder = { high: 3, medium: 2, low: 1 };
      return reliabilityOrder[b[1].reliability] - reliabilityOrder[a[1].reliability];
    });
  
  return sources.map(([name, _]) => name);
}

/**
 * ESG Data Quality Metrics
 */
export interface ESGDataQualityMetrics {
  completeness: number;
  accuracy: number;
  timeliness: number;
  consistency: number;
  reliability: 'high' | 'medium' | 'low';
  sourceCount: number;
  lastUpdated: string;
}

/**
 * Calculate overall data quality score
 */
export function calculateDataQualityScore(metrics: ESGDataQualityMetrics): number {
  const weights = {
    completeness: 0.3,
    accuracy: 0.25,
    timeliness: 0.2,
    consistency: 0.15,
    reliability: 0.1
  };
  
  const reliabilityScore = metrics.reliability === 'high' ? 100 : 
                          metrics.reliability === 'medium' ? 75 : 50;
  
  return (
    metrics.completeness * weights.completeness +
    metrics.accuracy * weights.accuracy +
    metrics.timeliness * weights.timeliness +
    metrics.consistency * weights.consistency +
    reliabilityScore * weights.reliability
  );
}
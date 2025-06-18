import { ESGSourceConfig } from '../config/esg-sources.config';
import { ESGDataPoint, ESGDataQuality, ESGDataResponse } from '../types/esg.types';

/**
 * NayaOne ESG World Bank Dataset Service
 * Handles integration with NayaOne's Global ESG Sustainability Indicators Dataset
 * Host: https://data.nayaone.com/esg_world_bank
 */
export class NayaOneESGService {
  private config: ESGSourceConfig;
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor() {
    this.config = {
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
      enabled: true
    };

    this.baseUrl = this.config.baseUrl;
    this.headers = {
      'Accept-Profile': 'api',
      'sandpit-key': this.config.apiKey || 'your sandpit api key',
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  /**
   * Fetch ESG data from NayaOne with pagination support
   * @param options - Query options including offset and filters
   * @returns Promise<ESGDataResponse>
   */
  async fetchESGData(options: {
    offset?: number;
    limit?: number;
    filters?: Record<string, any>;
  } = {}): Promise<ESGDataResponse> {
    try {
      const { offset = 0, limit = 10, filters = {} } = options;
      
      // Validate offset is multiple of 10
      if (offset % 10 !== 0) {
        throw new Error('Offset must be a multiple of 10');
      }

      // Validate limit
      if (limit > 100) {
        throw new Error('Limit cannot exceed 100 records per request');
      }

      // Build query parameters
      const queryParams = new URLSearchParams();
      if (offset > 0) {
        queryParams.append('offset', offset.toString());
      }
      if (limit !== 10) {
        queryParams.append('limit', limit.toString());
      }

      // Add filters to query parameters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });

      const url = queryParams.toString() 
        ? `${this.baseUrl}?${queryParams.toString()}`
        : this.baseUrl;

      console.log(`Fetching NayaOne ESG data from: ${url}`);

      const response = await fetch(url, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        source: 'nayaone_esg_world_bank',
        data: this.transformData(data),
        metadata: {
          totalRecords: data.length || 0,
          offset,
          limit,
          hasMore: data.length === limit,
          fetchedAt: new Date().toISOString(),
          dataQuality: this.assessDataQuality(data)
        }
      };
    } catch (error) {
      console.error('Error fetching NayaOne ESG data:', error);
      throw new Error(`Failed to fetch NayaOne ESG data: ${error.message}`);
    }
  }

  /**
   * Fetch all available data with automatic pagination
   * @param batchSize - Number of records per batch (default: 50)
   * @param maxRecords - Maximum total records to fetch (default: 1000)
   * @returns Promise<ESGDataResponse>
   */
  async fetchAllESGData(batchSize: number = 50, maxRecords: number = 1000): Promise<ESGDataResponse> {
    const allData: ESGDataPoint[] = [];
    let offset = 0;
    let hasMore = true;
    let totalFetched = 0;

    while (hasMore && totalFetched < maxRecords) {
      const remainingRecords = maxRecords - totalFetched;
      const currentBatchSize = Math.min(batchSize, remainingRecords, 100);

      const response = await this.fetchESGData({ 
        offset, 
        limit: currentBatchSize 
      });

      allData.push(...response.data);
      totalFetched += response.data.length;
      
      hasMore = response.metadata.hasMore && response.data.length === currentBatchSize;
      offset += currentBatchSize;

      // Rate limiting: wait 1 second between requests
      if (hasMore) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return {
      source: 'nayaone_esg_world_bank',
      data: allData,
      metadata: {
        totalRecords: allData.length,
        offset: 0,
        limit: allData.length,
        hasMore: false,
        fetchedAt: new Date().toISOString(),
        dataQuality: this.assessDataQuality(allData)
      }
    };
  }

  /**
   * Fetch ESG data for specific countries
   * @param countries - Array of country codes or names
   * @returns Promise<ESGDataResponse>
   */
  async fetchCountryESGData(countries: string[]): Promise<ESGDataResponse> {
    const allCountryData: ESGDataPoint[] = [];
    
    for (const country of countries) {
      try {
        const response = await this.fetchESGData({
          filters: { country: country }
        });
        allCountryData.push(...response.data);
        
        // Rate limiting between country requests
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.warn(`Failed to fetch data for country ${country}:`, error.message);
      }
    }

    return {
      source: 'nayaone_esg_world_bank',
      data: allCountryData,
      metadata: {
        totalRecords: allCountryData.length,
        offset: 0,
        limit: allCountryData.length,
        hasMore: false,
        fetchedAt: new Date().toISOString(),
        dataQuality: this.assessDataQuality(allCountryData),
        filters: { countries }
      }
    };
  }

  /**
   * Transform raw API data to standardized ESG format
   * @param rawData - Raw data from NayaOne API
   * @returns ESGDataPoint[]
   */
  private transformData(rawData: any[]): ESGDataPoint[] {
    if (!Array.isArray(rawData)) {
      console.warn('Expected array data from NayaOne API, received:', typeof rawData);
      return [];
    }

    return rawData.map((item, index) => {
      try {
        return {
          id: item.id || `nayaone_${index}`,
          source: 'nayaone_esg_world_bank',
          entityId: item.country_code || item.entity_id,
          entityName: item.country_name || item.entity_name,
          entityType: 'sovereign',
          dataType: 'sustainability_indicators',
          metrics: {
            environmental: this.extractEnvironmentalMetrics(item),
            social: this.extractSocialMetrics(item),
            governance: this.extractGovernanceMetrics(item)
          },
          scores: {
            overall: item.overall_esg_score || null,
            environmental: item.environmental_score || null,
            social: item.social_score || null,
            governance: item.governance_score || null
          },
          timestamp: item.last_updated || new Date().toISOString(),
          metadata: {
            dataProvider: 'World Bank',
            methodology: item.methodology || 'World Bank ESG Indicators',
            currency: item.currency || 'USD',
            unit: item.unit || 'index',
            confidence: item.confidence_level || 'high'
          }
        };
      } catch (error) {
        console.warn(`Error transforming data item at index ${index}:`, error);
        return null;
      }
    }).filter(item => item !== null);
  }

  /**
   * Extract environmental metrics from raw data
   */
  private extractEnvironmentalMetrics(item: any): Record<string, number> {
    const metrics: Record<string, number> = {};
    
    // Common environmental indicators
    const envFields = [
      'co2_emissions',
      'renewable_energy_consumption',
      'forest_area',
      'water_productivity',
      'energy_intensity',
      'carbon_intensity',
      'environmental_performance_index'
    ];

    envFields.forEach(field => {
      if (item[field] !== undefined && item[field] !== null) {
        metrics[field] = parseFloat(item[field]);
      }
    });

    return metrics;
  }

  /**
   * Extract social metrics from raw data
   */
  private extractSocialMetrics(item: any): Record<string, number> {
    const metrics: Record<string, number> = {};
    
    // Common social indicators
    const socialFields = [
      'human_development_index',
      'gender_equality_index',
      'education_index',
      'health_index',
      'poverty_rate',
      'unemployment_rate',
      'social_protection_coverage'
    ];

    socialFields.forEach(field => {
      if (item[field] !== undefined && item[field] !== null) {
        metrics[field] = parseFloat(item[field]);
      }
    });

    return metrics;
  }

  /**
   * Extract governance metrics from raw data
   */
  private extractGovernanceMetrics(item: any): Record<string, number> {
    const metrics: Record<string, number> = {};
    
    // Common governance indicators
    const govFields = [
      'governance_effectiveness',
      'regulatory_quality',
      'rule_of_law',
      'control_of_corruption',
      'voice_and_accountability',
      'political_stability',
      'transparency_index'
    ];

    govFields.forEach(field => {
      if (item[field] !== undefined && item[field] !== null) {
        metrics[field] = parseFloat(item[field]);
      }
    });

    return metrics;
  }

  /**
   * Assess data quality of the fetched data
   * @param data - Array of data points
   * @returns ESGDataQuality
   */
  private assessDataQuality(data: any[]): ESGDataQuality {
    if (!Array.isArray(data) || data.length === 0) {
      return {
        score: 0,
        completeness: 0,
        accuracy: 0,
        timeliness: 0,
        issues: ['No data available']
      };
    }

    const totalFields = data.length * 10; // Assuming 10 key fields per record
    let populatedFields = 0;
    let recentData = 0;
    const issues: string[] = [];
    const currentYear = new Date().getFullYear();

    data.forEach((item, index) => {
      // Check completeness
      const requiredFields = ['id', 'country_code', 'country_name'];
      requiredFields.forEach(field => {
        if (item[field] !== undefined && item[field] !== null) {
          populatedFields++;
        }
      });

      // Check timeliness
      if (item.last_updated) {
        const dataYear = new Date(item.last_updated).getFullYear();
        if (currentYear - dataYear <= 2) {
          recentData++;
        }
      }

      // Check for data issues
      if (!item.country_code) {
        issues.push(`Missing country code at index ${index}`);
      }
    });

    const completeness = totalFields > 0 ? (populatedFields / totalFields) * 100 : 0;
    const timeliness = data.length > 0 ? (recentData / data.length) * 100 : 0;
    const accuracy = 85; // Assumed high accuracy for World Bank data
    
    const score = (completeness + accuracy + timeliness) / 3;

    return {
      score: Math.round(score),
      completeness: Math.round(completeness),
      accuracy,
      timeliness: Math.round(timeliness),
      issues: issues.slice(0, 5) // Limit to first 5 issues
    };
  }

  /**
   * Get service configuration
   * @returns ESGSourceConfig
   */
  getConfig(): ESGSourceConfig {
    return this.config;
  }

  /**
   * Test API connectivity
   * @returns Promise<boolean>
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.fetchESGData({ limit: 1 });
      return response.data.length >= 0;
    } catch (error) {
      console.error('NayaOne API connection test failed:', error);
      return false;
    }
  }

  /**
   * Get API usage statistics
   * @returns Promise<object>
   */
  async getUsageStats(): Promise<{
    requestsToday: number;
    requestsThisMinute: number;
    remainingQuota: number;
  }> {
    // This would typically be implemented with a rate limiting service
    // For now, return mock data
    return {
      requestsToday: 0,
      requestsThisMinute: 0,
      remainingQuota: this.config.rateLimit.requestsPerDay
    };
  }
}

export default NayaOneESGService;
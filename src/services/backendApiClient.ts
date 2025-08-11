/**
 * Backend API Client for External API
 * Centralized client for calling https://api.joinsynapses.com with proper error handling
 */

import { config } from '@/config/environment';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

export interface ClassificationRequest {
  text: string;
  document_type?: string;
}

export interface ClassificationResponse {
  classification: string;
  confidence: number;
  processing_time: number;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  version: string;
  uptime: number;
}

export interface MetricsResponse {
  total_requests: number;
  average_processing_time: number;
  uptime: number;
}

export class BackendApiClient {
  private static instance: BackendApiClient;
  private baseUrl: string;
  
  constructor() {
    this.baseUrl = config.API_BASE_URL;
  }
  
  static getInstance(): BackendApiClient {
    if (!BackendApiClient.instance) {
      BackendApiClient.instance = new BackendApiClient();
    }
    return BackendApiClient.instance;
  }

  /**
   * Make HTTP request to the backend API
   */
  private async makeRequest<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}/${endpoint}`;
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Synapse-SFDR-Navigator/1.0',
          ...options.headers
        },
        ...options
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.detail || data.message || `HTTP ${response.status}`,
          status: response.status
        };
      }

      return {
        data,
        status: response.status
      };
    } catch (error) {
      console.error(`Backend API request failed:`, error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 500
      };
    }
  }

  /**
   * Health check for the system
   */
  async healthCheck(): Promise<ApiResponse<HealthResponse>> {
    return this.makeRequest<HealthResponse>('api/health');
  }

  /**
   * Get system metrics
   */
  async getMetrics(): Promise<ApiResponse<MetricsResponse>> {
    return this.makeRequest<MetricsResponse>('api/metrics');
  }

  /**
   * SFDR Classification
   */
  async classifyDocument(request: ClassificationRequest): Promise<ApiResponse<ClassificationResponse>> {
    return this.makeRequest<ClassificationResponse>('api/classify', {
      method: 'POST',
      body: JSON.stringify(request)
    });
  }

  /**
   * Upload document for classification
   */
  async uploadDocument(file: File): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.makeRequest('api/upload', {
      method: 'POST',
      body: formData,
      headers: {} // Don't set Content-Type for FormData
    });
  }

  /**
   * Legacy method for backwards compatibility with existing SFDR classification
   */
  async classifyProduct(productData: any): Promise<ApiResponse<ClassificationResponse>> {
    // Convert the SFDR product data to the expected format
    const text = this.formatProductDataAsText(productData);
    
    return this.classifyDocument({
      text,
      document_type: 'SFDR_Fund_Profile'
    });
  }

  /**
   * Convert SFDR product data to text format for classification
   */
  private formatProductDataAsText(productData: any): string {
    const parts = [];
    
    if (productData.fundProfile) {
      const profile = productData.fundProfile;
      parts.push(`Fund Name: ${profile.fundName || 'N/A'}`);
      parts.push(`Investment Objective: ${profile.investmentObjective || 'N/A'}`);
      parts.push(`Target Article Classification: ${profile.targetArticleClassification || 'N/A'}`);
      
      if (profile.sustainabilityCharacteristics && profile.sustainabilityCharacteristics.length > 0) {
        parts.push(`Sustainability Characteristics: ${profile.sustainabilityCharacteristics.join(', ')}`);
      }
    }
    
    if (productData.paiIndicators) {
      const pai = productData.paiIndicators;
      if (pai.considerationStatement) {
        parts.push(`PAI Consideration: ${pai.considerationStatement}`);
      }
      if (pai.mandatoryIndicators && pai.mandatoryIndicators.length > 0) {
        parts.push(`PAI Indicators: ${pai.mandatoryIndicators.length} mandatory indicators provided`);
      }
    }
    
    if (productData.taxonomyAlignment) {
      const taxonomy = productData.taxonomyAlignment;
      if (taxonomy.alignmentPercentage) {
        parts.push(`EU Taxonomy Alignment: ${taxonomy.alignmentPercentage}%`);
      }
    }
    
    return parts.join('\n');
  }

  /**
   * Get analytics data (placeholder for compatibility)
   */
  async getAnalytics(): Promise<ApiResponse> {
    return this.getMetrics();
  }

  /**
   * Check compliance status (placeholder for compatibility)
   */
  async checkCompliance(data: any): Promise<ApiResponse> {
    // For now, use classification endpoint
    const text = typeof data === 'string' ? data : JSON.stringify(data);
    return this.classifyDocument({
      text,
      document_type: 'compliance_check'
    });
  }

  /**
   * Generate report (placeholder for compatibility)
   */
  async generateReport(_data: any): Promise<ApiResponse> {
    // This would need to be implemented on the backend
    return {
      error: 'Report generation not yet implemented in backend API',
      status: 501
    };
  }

  /**
   * Risk assessment (placeholder for compatibility)
   */
  async riskAssessment(_data: any): Promise<ApiResponse> {
    // This would need to be implemented on the backend
    return {
      error: 'Risk assessment not yet implemented in backend API',
      status: 501
    };
  }
}

// Export singleton instance
export const backendApiClient = BackendApiClient.getInstance();
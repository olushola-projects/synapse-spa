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
  // AI routing
  strategy?: 'primary' | 'secondary' | 'hybrid';
  model?: string;
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
   * Make HTTP request with proper error handling and authentication
   */
  private async makeRequest<T = any>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T> & { 
    success?: boolean;
    requestId?: string;
    authError?: boolean;
    errorCategory?: string;
  }> {
    try {
      const url = `${this.baseUrl}/${endpoint}`;
      
      // Enhanced headers with proper authentication
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'User-Agent': 'Synapse-SFDR-Navigator/1.0',
        ...options.headers as Record<string, string>
      };

      // Add API key authentication if available
      const apiKey = config.NEXUS_API_KEY;
      if (apiKey && apiKey !== 'demo-key-placeholder') {
        headers['Authorization'] = `Bearer ${apiKey}`;
        headers['X-API-Key'] = apiKey;
      } else {
        console.warn('⚠️ NEXUS_API_KEY not configured - API calls may fail');
      }

      console.log(`🔌 Backend API Request: ${options.method || 'GET'} ${url}`);
      
      // Add timeout for requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      let data;
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          data = await response.text();
        }
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        data = null;
      }

      if (!response.ok) {
        const errorMsg = data?.detail || data?.message || data || `HTTP ${response.status}`;
        console.error(`❌ Backend API Error [${response.status}]:`, errorMsg);
        
        // Enhanced error context
        const enhancedError = {
          error: errorMsg,
          status: response.status,
          endpoint,
          timestamp: new Date().toISOString(),
          headers: Object.fromEntries(response.headers.entries())
        };
        
        return enhancedError;
      }

      console.log(`✅ Backend API Success [${response.status}]:`, endpoint);
      return {
        data,
        status: response.status
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error(`⏱️ Backend API Timeout: ${endpoint}`);
        return {
          error: 'Request timeout - API may be unavailable',
          status: 408
        };
      }
      
      console.error(`💥 Backend API Network Error:`, error);
      return {
        error: error instanceof Error ? error.message : 'Network connection failed',
        status: 0 // Network error
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
   * SFDR Classification with strategy support
   */
  async classifyDocument(request: ClassificationRequest): Promise<ApiResponse<ClassificationResponse>> {
    console.log('🤖 Classifying document with strategy:', request.strategy || 'default');
    
    const response = await this.makeRequest<ClassificationResponse>('api/classify', {
      method: 'POST',
      body: JSON.stringify({
        ...request,
        // Ensure strategy is included for LLM routing
        strategy: request.strategy || 'primary',
        timestamp: new Date().toISOString()
      })
    });

    // Enhanced logging for LLM integration debugging
    if (response.data) {
      console.log('✅ LLM Classification Success:', {
        confidence: response.data.confidence,
        processing_time: response.data.processing_time,
        strategy: request.strategy
      });
    } else if (response.error) {
      console.error('❌ LLM Classification Failed:', response.error);
    }

    return response;
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

    // Support strategy from either aiStrategy or modelStrategy fields
    const strategy =
      (productData?.aiStrategy as 'primary' | 'secondary' | 'hybrid' | undefined) ||
      (productData?.modelStrategy as 'primary' | 'secondary' | 'hybrid' | undefined);

    const request: ClassificationRequest = {
      text,
      document_type: 'SFDR_Fund_Profile',
      ...(strategy ? { strategy } as Partial<ClassificationRequest> : {})
    };

    return this.classifyDocument(request);
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
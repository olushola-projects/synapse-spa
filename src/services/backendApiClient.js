/**
 * Backend API Client for External API
 * Centralized client for calling https://api.joinsynapses.com with proper error handling
 */
export class BackendApiClient {
  static instance;
  baseUrl;
  apiKey = null;
  isAuthenticated = false;
  constructor() {
    // SECURITY FIX: Use Supabase Edge Function proxy instead of direct API calls
    this.baseUrl = 'https://hnwwykttyzfvflmcswjk.supabase.co/functions/v1/nexus-proxy';
    this.validateAuthentication();
  }
  validateAuthentication() {
    // Check if we have a valid API key
    this.apiKey = this.getApiKey();
    this.isAuthenticated = !!(
      this.apiKey &&
      this.apiKey !== 'your_nexus_api_key' &&
      this.apiKey !== 'demo_key_placeholder'
    );
    if (!this.isAuthenticated) {
      console.warn(
        '🔐 CRITICAL: BackendApiClient not properly authenticated - using placeholder API key'
      );
    }
  }
  getApiKey() {
    // SECURITY FIX: Remove client-side API key access
    // All API calls should go through Supabase Edge Functions
    console.warn('🔐 SECURITY: Direct API key access removed - use edge function proxy');
    return null;
  }
  static getInstance() {
    if (!BackendApiClient.instance) {
      BackendApiClient.instance = new BackendApiClient();
    }
    return BackendApiClient.instance;
  }
  /**
   * Make HTTP request with proper error handling and authentication
   */
  async makeRequest(endpoint, options = {}) {
    try {
      // SECURITY FIX: Use edge function proxy with proper authentication
      const url = this.baseUrl;
      // Enhanced headers for edge function proxy
      const headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'Synapse-SFDR-Navigator/1.0',
        ...options.headers
      };
      // SECURITY FIX: Remove direct API key usage - edge function handles authentication
      console.log('🔐 Using secure edge function proxy for API calls');
      console.log(`🔌 Backend API Request: ${options.method || 'GET'} ${url}`);
      // Add timeout for requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      // SECURITY FIX: Send request through edge function proxy with proper payload
      const proxyPayload = {
        method: options.method || 'GET',
        endpoint,
        data: options.body ? JSON.parse(options.body) : undefined,
        userId: 'client-request' // Add user context for audit trail
      };
      const response = await fetch(url, {
        method: 'POST', // Edge function expects POST with payload
        headers,
        body: JSON.stringify(proxyPayload),
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
        data: data,
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
   * Health check for the system - Updated to use Supabase Edge Functions
   */
  async healthCheck() {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      // Use Supabase Edge Function for secure API calls
      const { data, error } = await supabase.functions.invoke('nexus-proxy', {
        body: {
          method: 'GET',
          endpoint: 'api/health',
          userId: (await supabase.auth.getUser()).data.user?.id
        }
      });
      if (error) {
        console.error('💔 Edge Function error:', error);
        return {
          error: error.message || 'Health check failed',
          status: 500
        };
      }
      if (!data.success) {
        console.error('💔 Health check API error:', data);
        return {
          error: data.error || 'Health check failed',
          status: data.status || 500
        };
      }
      console.log('💚 Health check response:', data);
      return {
        data: data.data,
        status: data.status || 200
      };
    } catch (error) {
      console.error('💔 Health check failed:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 500
      };
    }
  }
  /**
   * Get system metrics
   */
  async getMetrics() {
    return this.makeRequest('api/metrics');
  }
  /**
   * SFDR Classification with strategy support - Updated to use Supabase Edge Functions
   */
  async classifyDocument(request) {
    try {
      console.log('🤖 Classifying document with strategy:', request.strategy || 'primary');
      const { supabase } = await import('@/integrations/supabase/client');
      // Use Supabase Edge Function for secure API calls
      const { data, error } = await supabase.functions.invoke('nexus-proxy', {
        body: {
          method: 'POST',
          endpoint: 'api/classify',
          data: {
            ...request,
            strategy: request.strategy || 'primary',
            timestamp: new Date().toISOString()
          },
          userId: (await supabase.auth.getUser()).data.user?.id
        }
      });
      if (error) {
        console.error('💥 Edge Function error:', error);
        return {
          error: error.message || 'Classification failed',
          status: 500
        };
      }
      if (!data.success) {
        console.error('💥 Classification API error:', data);
        return {
          error: data.error || 'Classification failed',
          status: data.status || 500
        };
      }
      // Enhanced logging for LLM integration debugging
      if (data.data) {
        console.log('✅ LLM Classification Success:', {
          confidence: data.data.confidence,
          processing_time: data.data.processing_time,
          strategy: request.strategy
        });
      }
      return {
        data: data.data,
        status: data.status || 200
      };
    } catch (error) {
      console.error('💥 Classification failed:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 500
      };
    }
  }
  /**
   * Upload document for classification
   */
  async uploadDocument(file) {
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
  async classifyProduct(productData) {
    // Convert the SFDR product data to the expected format
    const text = this.formatProductDataAsText(productData);
    // Support strategy from either aiStrategy or modelStrategy fields
    const strategy = productData?.aiStrategy || productData?.modelStrategy;
    const request = {
      text,
      document_type: 'SFDR_Fund_Profile',
      include_audit_trail: true,
      include_benchmark_comparison: true,
      require_citations: true, // Critical for regulatory compliance
      ...(strategy ? { strategy } : {})
    };
    return this.classifyDocument(request);
  }
  /**
   * Convert SFDR product data to text format for classification
   */
  formatProductDataAsText(productData) {
    const parts = [];
    if (productData.fundProfile) {
      const profile = productData.fundProfile;
      parts.push(`Fund Name: ${profile.fundName || 'N/A'}`);
      parts.push(`Investment Objective: ${profile.investmentObjective || 'N/A'}`);
      parts.push(`Target Article Classification: ${profile.targetArticleClassification || 'N/A'}`);
      if (
        profile.sustainabilityCharacteristics &&
        profile.sustainabilityCharacteristics.length > 0
      ) {
        parts.push(
          `Sustainability Characteristics: ${profile.sustainabilityCharacteristics.join(', ')}`
        );
      }
    }
    if (productData.paiIndicators) {
      const pai = productData.paiIndicators;
      if (pai.considerationStatement) {
        parts.push(`PAI Consideration: ${pai.considerationStatement}`);
      }
      if (pai.mandatoryIndicators && pai.mandatoryIndicators.length > 0) {
        parts.push(
          `PAI Indicators: ${pai.mandatoryIndicators.length} mandatory indicators provided`
        );
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
  async getAnalytics() {
    return this.getMetrics();
  }
  /**
   * Check compliance status (placeholder for compatibility)
   */
  async checkCompliance(data) {
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
  async generateReport(_data) {
    // This would need to be implemented on the backend
    return {
      error: 'Report generation not yet implemented in backend API',
      status: 501
    };
  }
  /**
   * Risk assessment (placeholder for compatibility)
   */
  async riskAssessment(_data) {
    // This would need to be implemented on the backend
    return {
      error: 'Risk assessment not yet implemented in backend API',
      status: 501
    };
  }
}
// Export singleton instance
export const backendApiClient = BackendApiClient.getInstance();

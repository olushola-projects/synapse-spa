/**
 * Supabase API Client for Edge Functions
 * Centralized client for calling Supabase Edge Functions with proper error handling
 */

import { supabase } from '@/integrations/supabase/client';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

export class SupabaseApiClient {
  private static instance: SupabaseApiClient;
  
  static getInstance(): SupabaseApiClient {
    if (!SupabaseApiClient.instance) {
      SupabaseApiClient.instance = new SupabaseApiClient();
    }
    return SupabaseApiClient.instance;
  }

  /**
   * Call a Supabase Edge Function
   * @param functionName - Name of the edge function
   * @param payload - Request payload
   * @param options - Additional options
   */
  async callFunction<T = any>(
    functionName: string, 
    payload: any = {}, 
    options: { requireAuth?: boolean } = {}
  ): Promise<ApiResponse<T>> {
    try {
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: payload,
        headers: {
          'Content-Type': 'application/json',
          ...(options.requireAuth && { 'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}` })
        }
      });

      if (error) {
        console.error(`Edge function ${functionName} error:`, error);
        return {
          error: error.message || 'Function call failed',
          status: 500
        };
      }

      return {
        data,
        status: 200
      };
    } catch (error) {
      console.error(`Edge function ${functionName} failed:`, error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 500
      };
    }
  }

  /**
   * Health check for the system
   */
  async healthCheck(): Promise<ApiResponse> {
    return this.callFunction('nexus-health');
  }

  /**
   * SFDR Classification
   */
  async classifyProduct(productData: any): Promise<ApiResponse> {
    return this.callFunction('nexus-classify', productData, { requireAuth: true });
  }

  /**
   * Get analytics data
   */
  async getAnalytics(): Promise<ApiResponse> {
    return this.callFunction('nexus-analytics', {}, { requireAuth: true });
  }

  /**
   * Check compliance status
   */
  async checkCompliance(data: any): Promise<ApiResponse> {
    return this.callFunction('check-compliance', data, { requireAuth: true });
  }

  /**
   * Generate report
   */
  async generateReport(data: any): Promise<ApiResponse> {
    return this.callFunction('generate-report', data, { requireAuth: true });
  }

  /**
   * Risk assessment
   */
  async riskAssessment(data: any): Promise<ApiResponse> {
    return this.callFunction('risk-assessment', data, { requireAuth: true });
  }

  /**
   * Upload document
   */
  async uploadDocument(data: any): Promise<ApiResponse> {
    return this.callFunction('upload-document', data, { requireAuth: true });
  }
}

// Export singleton instance
export const apiClient = SupabaseApiClient.getInstance();
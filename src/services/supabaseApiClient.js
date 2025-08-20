/**
 * Supabase API Client for Edge Functions
 * Centralized client for calling Supabase Edge Functions with proper error handling
 */
import { supabase } from '@/integrations/supabase/client';
export class SupabaseApiClient {
    static instance;
    static getInstance() {
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
    async callFunction(functionName, payload = {}, options = {}) {
        try {
            const { data, error } = await supabase.functions.invoke(functionName, {
                body: payload,
                headers: {
                    'Content-Type': 'application/json',
                    ...(options.requireAuth && {
                        Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
                    })
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
        }
        catch (error) {
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
    async healthCheck() {
        return this.callFunction('nexus-health');
    }
    /**
     * SFDR Classification
     */
    async classifyProduct(productData) {
        return this.callFunction('nexus-classify', productData, { requireAuth: true });
    }
    /**
     * Get analytics data
     */
    async getAnalytics() {
        return this.callFunction('nexus-analytics', {}, { requireAuth: true });
    }
    /**
     * Check compliance status
     */
    async checkCompliance(data) {
        return this.callFunction('check-compliance', data, { requireAuth: true });
    }
    /**
     * Generate report
     */
    async generateReport(data) {
        return this.callFunction('generate-report', data, { requireAuth: true });
    }
    /**
     * Risk assessment
     */
    async riskAssessment(data) {
        return this.callFunction('risk-assessment', data, { requireAuth: true });
    }
    /**
     * Upload document
     */
    async uploadDocument(data) {
        return this.callFunction('upload-document', data, { requireAuth: true });
    }
}
// Export singleton instance
export const apiClient = SupabaseApiClient.getInstance();

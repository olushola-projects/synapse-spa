// Nexus Agent Client - Using Supabase Edge Functions
import { supabase } from '@/integrations/supabase/client';

export interface NexusClassificationRequest {
  productName: string;
  productType: string;
  sustainabilityObjectives?: string[];
  investmentStrategy?: string;
  riskProfile?: string;
  targetArticle?: string;
  paiIndicators?: Record<string, any>;
}

export interface NexusClassificationResponse {
  classification: string;
  complianceScore: number;
  riskLevel: string;
  recommendations: string[];
  timestamp: string;
  confidence?: number;
  reasoning?: string;
  validation?: {
    isValid: boolean;
    issues: string[];
  };
}

export interface NexusHealthResponse {
  status: 'healthy' | 'degraded' | 'down';
  version: string;
  uptime: number;
}

export class NexusAgentClient {
  async classifyProduct(
    productData: NexusClassificationRequest
  ): Promise<NexusClassificationResponse> {
    const { data, error } = await supabase.functions.invoke('nexus-classify', {
      body: productData
    });

    if (error) {
      throw new Error(`SFDR Classification Error: ${error.message}`);
    }

    return data;
  }

  async getComplianceStatus(): Promise<any> {
    // Get user's recent compliance assessments
    const { data, error } = await supabase
      .from('compliance_assessments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      throw new Error(`Compliance status error: ${error.message}`);
    }

    return {
      recentAssessments: data,
      status: 'operational',
      lastUpdated: new Date().toISOString()
    };
  }

  async getAnalytics(filters: Record<string, any> = {}): Promise<any> {
    const { data, error } = await supabase.functions.invoke('nexus-analytics', {
      body: filters
    });

    if (error) {
      throw new Error(`Analytics error: ${error.message}`);
    }

    return data;
  }

  async getHealth(): Promise<NexusHealthResponse> {
    const { data, error } = await supabase.functions.invoke('nexus-health');

    if (error) {
      throw new Error(`Health check failed: ${error.message}`);
    }

    return data;
  }

  // Legacy method for backwards compatibility
  async classifyFund(request: NexusClassificationRequest): Promise<NexusClassificationResponse> {
    return this.classifyProduct(request);
  }
}

// Export singleton instance - will be initialized with API key from Supabase secrets
export const nexusClient = new NexusAgentClient();

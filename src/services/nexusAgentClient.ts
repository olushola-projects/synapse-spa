// Nexus Agent Client - Using External Backend API
import { backendApiClient } from './backendApiClient';

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
    const response = await backendApiClient.classifyProduct(productData);

    if (response.error) {
      throw new Error(`SFDR Classification Error: ${response.error}`);
    }

    // Transform backend response to expected format
    const backendData = response.data;
    return {
      classification: backendData?.classification || 'Article 6',
      complianceScore: Math.round((backendData?.confidence || 0.5) * 100),
      riskLevel: this.mapConfidenceToRiskLevel(backendData?.confidence || 0.5),
      recommendations: this.generateRecommendations(backendData?.classification || 'Article 6'),
      timestamp: new Date().toISOString(),
      confidence: backendData?.confidence || 0.5,
      reasoning: `Classified as ${backendData?.classification || 'Article 6'} based on AI analysis`,
      validation: {
        isValid: (backendData?.confidence || 0) > 0.7,
        issues: (backendData?.confidence || 0) < 0.7 ? ['Low confidence classification'] : []
      }
    };
  }

  private mapConfidenceToRiskLevel(confidence: number): string {
    if (confidence >= 0.8) return 'Low';
    if (confidence >= 0.6) return 'Medium';
    return 'High';
  }

  private generateRecommendations(classification: string): string[] {
    const recommendations = [
      'Review fund documentation for accuracy',
      'Ensure all required disclosures are complete'
    ];

    switch (classification) {
      case 'Article 8':
        recommendations.push('Verify sustainability characteristics are clearly defined');
        break;
      case 'Article 9':
        recommendations.push('Confirm sustainable investment objective is met');
        break;
      default:
        recommendations.push('Consider if fund could qualify for Article 8 or 9');
    }

    return recommendations;
  }

  async getComplianceStatus(): Promise<any> {
    const response = await backendApiClient.getMetrics();

    if (response.error) {
      throw new Error(`Compliance status error: ${response.error}`);
    }

    return {
      metrics: response.data,
      status: 'operational',
      lastUpdated: new Date().toISOString()
    };
  }

  async getAnalytics(_filters: Record<string, any> = {}): Promise<any> {
    const response = await backendApiClient.getAnalytics();

    if (response.error) {
      throw new Error(`Analytics error: ${response.error}`);
    }

    return response.data;
  }

  async getHealth(): Promise<NexusHealthResponse> {
    const response = await backendApiClient.healthCheck();

    if (response.error) {
      throw new Error(`Health check failed: ${response.error}`);
    }

    const healthData = response.data;
    return {
      status: healthData?.status === 'healthy' ? 'healthy' : 'degraded',
      version: healthData?.version || '1.0.0',
      uptime: healthData?.uptime || 0
    };
  }

  // Legacy method for backwards compatibility
  async classifyFund(request: NexusClassificationRequest): Promise<NexusClassificationResponse> {
    return this.classifyProduct(request);
  }
}

// Export singleton instance - will be initialized with API key from Supabase secrets
export const nexusClient = new NexusAgentClient();

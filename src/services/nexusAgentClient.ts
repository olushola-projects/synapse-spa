// Nexus Agent Client - Updated with user's API configuration
import { NEXUS_CONFIG } from '../config/nexus';

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
  private baseUrl: string;
  private apiKey?: string;
  private timeout: number;

  constructor(config?: { baseUrl?: string; apiKey?: string; timeout?: number }) {
    this.baseUrl = config?.baseUrl || NEXUS_CONFIG.apiBaseUrl;
    this.apiKey = config?.apiKey;
    this.timeout = config?.timeout || NEXUS_CONFIG.timeout;
  }

  async classifyProduct(
    productData: NexusClassificationRequest
  ): Promise<NexusClassificationResponse> {
    const response = await fetch(`${this.baseUrl}/api/classify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(productData),
      signal: AbortSignal.timeout(this.timeout)
    });

    if (!response.ok) {
      throw new Error(`SFDR API Error: ${response.status}`);
    }

    return response.json();
  }

  async getComplianceStatus(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/compliance/status`);
    return response.json();
  }

  async getAnalytics(filters: Record<string, any> = {}): Promise<any> {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${this.baseUrl}/api/analytics?${params}`);
    return response.json();
  }

  async getHealth(): Promise<NexusHealthResponse> {
    const response = await fetch(`${this.baseUrl}/api/health`);

    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status}`);
    }

    return response.json();
  }

  // Legacy method for backwards compatibility
  async classifyFund(request: NexusClassificationRequest): Promise<NexusClassificationResponse> {
    return this.classifyProduct(request);
  }
}

// Export singleton instance - will be initialized with API key from Supabase secrets
export const nexusClient = new NexusAgentClient();

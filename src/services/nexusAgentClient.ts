// Nexus Agent Client - Updated with user's API configuration
import { NEXUS_CONFIG } from '../config/nexus';

export interface NexusClassificationRequest {
  fundName: string;
  fundType: string;
  targetArticle: string;
  sustainabilityObjectives?: string[];
  paiIndicators?: Record<string, any>;
}

export interface NexusClassificationResponse {
  classification: string;
  confidence: number;
  reasoning: string;
  validation: {
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
  private authToken?: string;

  constructor(authToken?: string) {
    this.baseUrl = NEXUS_CONFIG.apiBaseUrl;
    this.authToken = authToken;
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), NEXUS_CONFIG.timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Nexus API error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async getHealth(): Promise<NexusHealthResponse> {
    return this.makeRequest<NexusHealthResponse>('/api/health');
  }

  async classifyFund(request: NexusClassificationRequest): Promise<NexusClassificationResponse> {
    return this.makeRequest<NexusClassificationResponse>('/api/classify', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getAnalytics(): Promise<any> {
    return this.makeRequest<any>('/api/analytics');
  }

  async getComplianceStatus(): Promise<any> {
    return this.makeRequest<any>('/api/compliance/status');
  }
}

// Export singleton instance
export const nexusClient = new NexusAgentClient();
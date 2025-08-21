// Nexus Agent API Configuration
export const NEXUS_CONFIG = {
  apiBaseUrl: 'https://nexus-82zwpw7xt-aas-projects-66c93685.vercel.app',
  customDomain: 'https://yourcustomer.com',
  endpoints: {
    health: 'GET /api/health',
    classify: 'POST /api/classify',
    analytics: 'GET /api/analytics',
    compliance: 'GET /api/compliance/status'
  },
  authentication: 'Bearer token or API key',
  rateLimit: '1000 requests per 15 minutes',
  timeout: 30000,
  retries: 3
};

// API endpoint helpers
export const getHealthEndpoint = () => `${NEXUS_CONFIG.apiBaseUrl}/api/health`;
export const getClassifyEndpoint = () => `${NEXUS_CONFIG.apiBaseUrl}/api/classify`;
export const getAnalyticsEndpoint = () => `${NEXUS_CONFIG.apiBaseUrl}/api/analytics`;
export const getComplianceEndpoint = () => `${NEXUS_CONFIG.apiBaseUrl}/api/compliance/status`;

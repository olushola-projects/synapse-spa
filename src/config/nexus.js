// Nexus Agent API Configuration - Updated for Supabase Edge Functions
export const NEXUS_CONFIG = {
  apiBaseUrl: 'https://hnwwykttyzfvflmcswjk.supabase.co/functions/v1',
  supabaseUrl: 'https://hnwwykttyzfvflmcswjk.supabase.co',
  endpoints: {
    health: 'nexus-health',
    classify: 'nexus-classify',
    analytics: 'nexus-analytics',
    compliance: 'check-compliance'
  },
  authentication: 'Bearer token or API key',
  rateLimit: '1000 requests per 15 minutes',
  timeout: 30000,
  retries: 3
};
// API endpoint helpers - Updated for Supabase Edge Functions
export const getHealthEndpoint = () =>
  `${NEXUS_CONFIG.apiBaseUrl}/${NEXUS_CONFIG.endpoints.health}`;
export const getClassifyEndpoint = () =>
  `${NEXUS_CONFIG.apiBaseUrl}/${NEXUS_CONFIG.endpoints.classify}`;
export const getAnalyticsEndpoint = () =>
  `${NEXUS_CONFIG.apiBaseUrl}/${NEXUS_CONFIG.endpoints.analytics}`;
export const getComplianceEndpoint = () =>
  `${NEXUS_CONFIG.apiBaseUrl}/${NEXUS_CONFIG.endpoints.compliance}`;

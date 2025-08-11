/**
 * Environment Configuration for SFDR Navigator
 * Centralizes all environment variables with validation and fallbacks
 * Provides type-safe access to configuration values
 */

export interface EnvironmentConfig {
  // Application
  NODE_ENV: 'development' | 'production' | 'test';
  APP_NAME: string;
  APP_VERSION: string;
  
  // Supabase
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  
  // Analytics
  POSTHOG_KEY?: string;
  POSTHOG_HOST?: string;
  
  // AI Services
  OPENAI_API_KEY?: string;
  NEXUS_API_KEY?: string;
  
  // Feature Flags
  ENABLE_ANALYTICS: boolean;
  ENABLE_ERROR_REPORTING: boolean;
  ENABLE_DEBUG_MODE: boolean;
  
  // API Endpoints
  API_BASE_URL: string;
  SFDR_API_URL: string;
  
  // Security
  ENABLE_HTTPS: boolean;
  CORS_ORIGINS: string[];
}

/**
 * Validates required environment variables
 */
function validateEnvironment(): void {
  const required = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];
  
  const missing = required.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    console.warn('Missing required environment variables:', missing);
    
    // In development, provide helpful guidance
    if (import.meta.env.DEV) {
      console.warn(`
🔧 SFDR Navigator Configuration Issue

Missing environment variables: ${missing.join(', ')}

To fix this:
1. Copy .env.example to .env
2. Fill in the required values
3. Restart the development server

For production deployment, ensure all required environment variables are set.
`);
    }
  }
}

/**
 * Parses boolean environment variables with fallback
 */
function parseBoolean(value: string | undefined, defaultValue: boolean = false): boolean {
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true' || value === '1';
}

/**
 * Parses array environment variables (comma-separated)
 */
function parseArray(value: string | undefined, defaultValue: string[] = []): string[] {
  if (!value) return defaultValue;
  return value.split(',').map(item => item.trim()).filter(Boolean);
}

/**
 * Gets the current environment configuration
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  // Validate environment on first load
  validateEnvironment();
  
  const env = import.meta.env;
  
  return {
    // Application
    NODE_ENV: (env.NODE_ENV as any) || 'development',
    APP_NAME: env.VITE_APP_NAME || 'SFDR Navigator',
    APP_VERSION: env.VITE_APP_VERSION || '1.0.0',
    
    // Supabase
    SUPABASE_URL: env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co',
    SUPABASE_ANON_KEY: env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key',
    SUPABASE_SERVICE_ROLE_KEY: env.VITE_SUPABASE_SERVICE_ROLE_KEY,
    
    // Analytics
    POSTHOG_KEY: env.VITE_POSTHOG_KEY,
    POSTHOG_HOST: env.VITE_POSTHOG_HOST || 'https://app.posthog.com',
    
    // AI Services
    OPENAI_API_KEY: env.VITE_OPENAI_API_KEY,
    NEXUS_API_KEY: env.VITE_NEXUS_API_KEY,
    
    // Feature Flags
    ENABLE_ANALYTICS: parseBoolean(env.VITE_ENABLE_ANALYTICS, false),
    ENABLE_ERROR_REPORTING: parseBoolean(env.VITE_ENABLE_ERROR_REPORTING, true),
    ENABLE_DEBUG_MODE: parseBoolean(env.VITE_ENABLE_DEBUG_MODE, env.NODE_ENV === 'development'),
    
    // API Endpoints - Using External Backend API
    API_BASE_URL: 'https://api.joinsynapses.com',
    SFDR_API_URL: 'https://api.joinsynapses.com/api/classify',
    
    // Security
    ENABLE_HTTPS: parseBoolean(env.VITE_ENABLE_HTTPS, env.NODE_ENV === 'production'),
    CORS_ORIGINS: parseArray(env.VITE_CORS_ORIGINS, ['http://localhost:3000', 'http://localhost:8080'])
  };
}

/**
 * Environment configuration singleton
 */
export const config = getEnvironmentConfig();

/**
 * Checks if the application is running in development mode
 */
export const isDevelopment = config.NODE_ENV === 'development';

/**
 * Checks if the application is running in production mode
 */
export const isProduction = config.NODE_ENV === 'production';

/**
 * Checks if the application is running in test mode
 */
export const isTest = config.NODE_ENV === 'test';

/**
 * Gets the appropriate API URL based on environment
 */
export function getApiUrl(endpoint: string = ''): string {
  const baseUrl = config.API_BASE_URL;
  return endpoint ? `${baseUrl}/${endpoint.replace(/^\//, '')}` : baseUrl;
}

/**
 * Gets the Supabase configuration
 */
export function getSupabaseConfig() {
  return {
    url: config.SUPABASE_URL,
    anonKey: config.SUPABASE_ANON_KEY,
    serviceRoleKey: config.SUPABASE_SERVICE_ROLE_KEY
  };
}

/**
 * Gets the PostHog configuration
 */
export function getPostHogConfig() {
  return {
    apiKey: config.POSTHOG_KEY,
    apiHost: config.POSTHOG_HOST,
    enabled: config.ENABLE_ANALYTICS && !!config.POSTHOG_KEY
  };
}

/**
 * Checks if a feature is enabled
 */
export function isFeatureEnabled(feature: keyof Pick<EnvironmentConfig, 'ENABLE_ANALYTICS' | 'ENABLE_ERROR_REPORTING' | 'ENABLE_DEBUG_MODE'>): boolean {
  return config[feature];
}

/**
 * Gets environment-specific configuration for error reporting
 */
export function getErrorReportingConfig() {
  return {
    enabled: config.ENABLE_ERROR_REPORTING,
    environment: config.NODE_ENV,
    version: config.APP_VERSION,
    debug: config.ENABLE_DEBUG_MODE
  };
}

/**
 * Logs the current configuration (excluding sensitive data)
 */
export function logConfiguration(): void {
  if (!isDevelopment) return;
  
  const safeConfig = {
    NODE_ENV: config.NODE_ENV,
    APP_NAME: config.APP_NAME,
    APP_VERSION: config.APP_VERSION,
    SUPABASE_URL: config.SUPABASE_URL,
    SUPABASE_ANON_KEY: config.SUPABASE_ANON_KEY ? '[CONFIGURED]' : '[MISSING]',
    POSTHOG_KEY: config.POSTHOG_KEY ? '[CONFIGURED]' : '[MISSING]',
    OPENAI_API_KEY: config.OPENAI_API_KEY ? '[CONFIGURED]' : '[MISSING]',
    NEXUS_API_KEY: config.NEXUS_API_KEY ? '[CONFIGURED]' : '[MISSING]',
    ENABLE_ANALYTICS: config.ENABLE_ANALYTICS,
    ENABLE_ERROR_REPORTING: config.ENABLE_ERROR_REPORTING,
    ENABLE_DEBUG_MODE: config.ENABLE_DEBUG_MODE,
    API_BASE_URL: config.API_BASE_URL,
    SFDR_API_URL: config.SFDR_API_URL
  };
  
  console.group('🔧 SFDR Navigator Configuration');
  console.table(safeConfig);
  console.groupEnd();
}

// Log configuration in development
if (isDevelopment) {
  logConfiguration();
}

export default config;
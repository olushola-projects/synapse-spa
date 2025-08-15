import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export interface BackendEnvironmentConfig {
  NODE_ENV: string;
  PORT: number;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  NEXUS_API_KEY: string;
  OPENAI_API_KEY: string;
  ENABLE_DEBUG_MODE: boolean;
  CORS_ORIGINS: string[];
}

/**
 * Validates required environment variables for backend
 */
function validateBackendEnvironment(): void {
  const required = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.warn('Missing required backend environment variables:', missing);

    // In development, provide helpful guidance
    if (process.env.NODE_ENV === 'development') {
      console.warn(`
🔧 Backend Configuration Issue

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
function parseBoolean(value: string | undefined, defaultValue = false): boolean {
  if (!value) {
    return defaultValue;
  }
  return value.toLowerCase() === 'true' || value === '1';
}

/**
 * Parses array environment variables (comma-separated)
 */
function parseArray(value: string | undefined, defaultValue: string[] = []): string[] {
  if (!value) {
    return defaultValue;
  }
  return value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
}

/**
 * Gets the current backend environment configuration
 */
export function getBackendEnvironmentConfig(): BackendEnvironmentConfig {
  // Validate environment on first load
  validateBackendEnvironment();

  return {
    // Application
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '3001', 10),

    // Supabase
    SUPABASE_URL: process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key',

    // AI Services
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
    NEXUS_API_KEY: process.env.NEXUS_API_KEY || '',

    // Feature Flags
    ENABLE_DEBUG_MODE: parseBoolean(
      process.env.ENABLE_DEBUG_MODE,
      process.env.NODE_ENV === 'development'
    ),

    // Security
    CORS_ORIGINS: parseArray(process.env.CORS_ORIGINS, [
      'http://localhost:3000',
      'http://localhost:8080'
    ])
  };
}

/**
 * Backend environment configuration singleton
 */
export const backendConfig = getBackendEnvironmentConfig();

/**
 * Checks if the backend is running in development mode
 */
export const isBackendDevelopment = backendConfig.NODE_ENV === 'development';

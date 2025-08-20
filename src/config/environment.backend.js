import dotenv from 'dotenv';
// Load environment variables
dotenv.config();
/**
 * Development Environment Configuration
 */
const developmentConfig = {
    NODE_ENV: 'development',
    APP_NAME: 'Synapses GRC Platform',
    APP_VERSION: '1.0.0',
    PORT: 3001,
    HOST: 'localhost',
    // Database
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://localhost:5432/synapses_dev',
    REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    // Authentication & Security
    JWT_SECRET: process.env.JWT_SECRET || 'dev-jwt-secret-change-in-production',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-in-production',
    SESSION_SECRET: process.env.SESSION_SECRET || 'dev-session-secret-change-in-production',
    COOKIE_SECRET: process.env.COOKIE_SECRET || 'dev-cookie-secret-change-in-production',
    // Security Monitoring (Development - Local monitoring)
    ENABLE_SECURITY_MONITORING: true,
    WAZUH_ENDPOINT: process.env.WAZUH_ENDPOINT || 'http://localhost:55000',
    FALCO_ENDPOINT: process.env.FALCO_ENDPOINT || 'http://localhost:9765',
    SECURITY_ALERT_EMAIL: process.env.SECURITY_ALERT_EMAIL || 'dev-security@synapses.com',
    SECURITY_ALERT_WEBHOOK: process.env.SECURITY_ALERT_WEBHOOK,
    // API Keys
    NEXUS_API_KEY: process.env.NEXUS_API_KEY || 'dev-nexus-api-key',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
    // Logging
    LOG_LEVEL: 'debug',
    LOG_FILE_PATH: './logs/app.log',
    ENABLE_STRUCTURED_LOGGING: true,
    ENABLE_AUDIT_LOGGING: true,
    // Performance & Monitoring
    ENABLE_APM: false,
    APM_SERVICE_NAME: 'synapses-grc-dev',
    APM_SERVER_URL: process.env.APM_SERVER_URL,
    ENABLE_METRICS: true,
    METRICS_PORT: 9090,
    // Rate Limiting (Relaxed for development)
    RATE_LIMIT_ENABLED: true,
    RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    RATE_LIMIT_MAX_REQUESTS: 1000,
    // CORS (Development - Allow all origins)
    CORS_ORIGINS: ['http://localhost:3000', 'http://localhost:8080', 'http://127.0.0.1:3000'],
    CORS_CREDENTIALS: true,
    // File Upload
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_FILE_TYPES: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.csv', '.txt'],
    UPLOAD_PATH: './uploads',
    // Email (Development - Use local SMTP or mock)
    SMTP_HOST: process.env.SMTP_HOST || 'localhost',
    SMTP_PORT: parseInt(process.env.SMTP_PORT || '1025'),
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    EMAIL_FROM: 'dev@synapses.com',
    // External Services
    SUPABASE_URL: process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-role-key',
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || 'placeholder-anon-key',
    // Feature Flags (Development - Enable all features)
    ENABLE_MFA: true,
    ENABLE_SOCIAL_LOGIN: true,
    ENABLE_EMAIL_VERIFICATION: true,
    ENABLE_PASSWORD_RESET: true,
    ENABLE_ACCOUNT_LOCKOUT: true,
    ENABLE_SESSION_MANAGEMENT: true,
    ENABLE_AUDIT_TRAIL: true,
    ENABLE_COMPLIANCE_REPORTING: true,
    // Priority 3 Feature Flags (Development - Enable all features)
    ENABLE_ADVANCED_SECURITY: true,
    ENABLE_THREAT_INTELLIGENCE: true,
    ENABLE_ML_SECURITY: true,
    ENABLE_COMPLIANCE_AUTOMATION: true,
    ENABLE_AUTO_REFRESH: true,
    ENABLE_DOCUMENTATION: true,
    ENABLE_AUTO_REVIEW: true,
    // Performance & APM Configuration (Development)
    ENABLE_PERFORMANCE_MONITORING: true,
    ENABLE_APM_INTEGRATION: false,
    APM_PROVIDER: 'custom',
    APM_API_KEY: process.env.APM_API_KEY,
    APM_ENDPOINT: process.env.APM_ENDPOINT,
    APM_SAMPLE_RATE: 0.1,
    PERFORMANCE_ALERT_WEBHOOK: process.env.PERFORMANCE_ALERT_WEBHOOK
};
/**
 * Staging Environment Configuration
 */
const stagingConfig = {
    ...developmentConfig,
    NODE_ENV: 'staging',
    PORT: parseInt(process.env.PORT || '3001'),
    HOST: '0.0.0.0',
    // Security (Staging - More secure)
    JWT_SECRET: process.env.JWT_SECRET || 'staging-jwt-secret-must-be-set',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'staging-refresh-secret-must-be-set',
    SESSION_SECRET: process.env.SESSION_SECRET || 'staging-session-secret-must-be-set',
    COOKIE_SECRET: process.env.COOKIE_SECRET || 'staging-cookie-secret-must-be-set',
    // Security Monitoring (Staging - Production-like monitoring)
    ENABLE_SECURITY_MONITORING: true,
    WAZUH_ENDPOINT: process.env.WAZUH_ENDPOINT,
    FALCO_ENDPOINT: process.env.FALCO_ENDPOINT,
    SECURITY_ALERT_EMAIL: process.env.SECURITY_ALERT_EMAIL,
    SECURITY_ALERT_WEBHOOK: process.env.SECURITY_ALERT_WEBHOOK,
    // Logging (Staging - Info level)
    LOG_LEVEL: 'info',
    LOG_FILE_PATH: '/var/log/synapses/app.log',
    // Performance & Monitoring (Staging - Enable APM)
    ENABLE_APM: true,
    APM_SERVICE_NAME: 'synapses-grc-staging',
    ENABLE_METRICS: true,
    METRICS_PORT: 9090,
    // Rate Limiting (Staging - Production-like limits)
    RATE_LIMIT_ENABLED: true,
    RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    RATE_LIMIT_MAX_REQUESTS: 500,
    // CORS (Staging - Restricted origins)
    CORS_ORIGINS: process.env.CORS_ORIGINS?.split(',') || [
        'https://staging.synapses.com',
        'https://staging-app.synapses.com'
    ],
    // File Upload (Staging - Production-like limits)
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    UPLOAD_PATH: '/var/uploads',
    // Email (Staging - Real SMTP)
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: parseInt(process.env.SMTP_PORT || '587'),
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@synapses.com'
};
/**
 * Production Environment Configuration
 */
const productionConfig = {
    ...stagingConfig,
    NODE_ENV: 'production',
    PORT: parseInt(process.env.PORT || '3001'),
    HOST: '0.0.0.0',
    // Security (Production - Maximum security)
    JWT_SECRET: process.env.JWT_SECRET || (() => {
        throw new Error('JWT_SECRET must be set in production');
    })(),
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || (() => {
        throw new Error('JWT_REFRESH_SECRET must be set in production');
    })(),
    SESSION_SECRET: process.env.SESSION_SECRET || (() => {
        throw new Error('SESSION_SECRET must be set in production');
    })(),
    COOKIE_SECRET: process.env.COOKIE_SECRET || (() => {
        throw new Error('COOKIE_SECRET must be set in production');
    })(),
    // Security Monitoring (Production - Full monitoring)
    ENABLE_SECURITY_MONITORING: true,
    WAZUH_ENDPOINT: process.env.WAZUH_ENDPOINT || (() => {
        throw new Error('WAZUH_ENDPOINT must be set in production');
    })(),
    FALCO_ENDPOINT: process.env.FALCO_ENDPOINT || (() => {
        throw new Error('FALCO_ENDPOINT must be set in production');
    })(),
    SECURITY_ALERT_EMAIL: process.env.SECURITY_ALERT_EMAIL || (() => {
        throw new Error('SECURITY_ALERT_EMAIL must be set in production');
    })(),
    SECURITY_ALERT_WEBHOOK: process.env.SECURITY_ALERT_WEBHOOK,
    // API Keys (Production - Must be set)
    NEXUS_API_KEY: process.env.NEXUS_API_KEY || (() => {
        throw new Error('NEXUS_API_KEY must be set in production');
    })(),
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
    // Logging (Production - Error level only)
    LOG_LEVEL: 'error',
    LOG_FILE_PATH: '/var/log/synapses/app.log',
    ENABLE_STRUCTURED_LOGGING: true,
    ENABLE_AUDIT_LOGGING: true,
    // Performance & Monitoring (Production - Full monitoring)
    ENABLE_APM: true,
    APM_SERVICE_NAME: 'synapses-grc-production',
    ENABLE_METRICS: true,
    METRICS_PORT: 9090,
    // Rate Limiting (Production - Strict limits)
    RATE_LIMIT_ENABLED: true,
    RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    RATE_LIMIT_MAX_REQUESTS: 200,
    // CORS (Production - Strict origins)
    CORS_ORIGINS: process.env.CORS_ORIGINS?.split(',') || [
        'https://synapses.com',
        'https://app.synapses.com'
    ],
    // File Upload (Production - Strict limits)
    MAX_FILE_SIZE: 2 * 1024 * 1024, // 2MB
    UPLOAD_PATH: '/var/uploads',
    // Email (Production - Must be configured)
    SMTP_HOST: process.env.SMTP_HOST || (() => {
        throw new Error('SMTP_HOST must be set in production');
    })(),
    SMTP_PORT: parseInt(process.env.SMTP_PORT || '587'),
    SMTP_USER: process.env.SMTP_USER || (() => {
        throw new Error('SMTP_USER must be set in production');
    })(),
    SMTP_PASS: process.env.SMTP_PASS || (() => {
        throw new Error('SMTP_PASS must be set in production');
    })(),
    EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@synapses.com'
};
/**
 * Test Environment Configuration
 */
const testConfig = {
    ...developmentConfig,
    NODE_ENV: 'test',
    PORT: 3002,
    HOST: 'localhost',
    // Database (Test - Use test database)
    DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://localhost:5432/synapses_test',
    REDIS_URL: process.env.TEST_REDIS_URL || 'redis://localhost:6379/1',
    // Security (Test - Use test secrets)
    JWT_SECRET: 'test-jwt-secret',
    JWT_REFRESH_SECRET: 'test-refresh-secret',
    SESSION_SECRET: 'test-session-secret',
    COOKIE_SECRET: 'test-cookie-secret',
    // Security Monitoring (Test - Disabled)
    ENABLE_SECURITY_MONITORING: false,
    // API Keys (Test - Use test keys)
    NEXUS_API_KEY: 'test-nexus-api-key',
    OPENAI_API_KEY: 'test-openai-api-key',
    OPENROUTER_API_KEY: 'test-openrouter-api-key',
    // Logging (Test - Silent)
    LOG_LEVEL: 'error',
    LOG_FILE_PATH: './logs/test.log',
    ENABLE_STRUCTURED_LOGGING: false,
    ENABLE_AUDIT_LOGGING: false,
    // Performance & Monitoring (Test - Disabled)
    ENABLE_APM: false,
    ENABLE_METRICS: false,
    // Rate Limiting (Test - Disabled)
    RATE_LIMIT_ENABLED: false,
    // CORS (Test - Allow all)
    CORS_ORIGINS: ['*'],
    // File Upload (Test - Local)
    UPLOAD_PATH: './test-uploads',
    // Email (Test - Mock)
    EMAIL_FROM: 'test@synapses.com'
};
/**
 * Get environment configuration based on NODE_ENV
 */
export function getBackendEnvironmentConfig() {
    const nodeEnv = process.env.NODE_ENV || 'development';
    switch (nodeEnv) {
        case 'production':
            return productionConfig;
        case 'staging':
            return stagingConfig;
        case 'test':
            return testConfig;
        case 'development':
        default:
            return developmentConfig;
    }
}
/**
 * Validate required environment variables
 */
export function validateBackendEnvironment() {
    const config = getBackendEnvironmentConfig();
    const missing = [];
    // Check required variables based on environment
    if (config.NODE_ENV === 'production') {
        const required = [
            'JWT_SECRET',
            'JWT_REFRESH_SECRET',
            'SESSION_SECRET',
            'COOKIE_SECRET',
            'NEXUS_API_KEY',
            'WAZUH_ENDPOINT',
            'FALCO_ENDPOINT',
            'SECURITY_ALERT_EMAIL',
            'SMTP_HOST',
            'SMTP_USER',
            'SMTP_PASS'
        ];
        for (const key of required) {
            if (!process.env[key]) {
                missing.push(key);
            }
        }
    }
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables for ${config.NODE_ENV}: ${missing.join(', ')}`);
    }
}
/**
 * Environment configuration singleton
 */
export const backendConfig = getBackendEnvironmentConfig();
/**
 * Environment-specific utilities
 */
export const isDevelopment = backendConfig.NODE_ENV === 'development';
export const isStaging = backendConfig.NODE_ENV === 'staging';
export const isProduction = backendConfig.NODE_ENV === 'production';
export const isTest = backendConfig.NODE_ENV === 'test';
/**
 * Security configuration based on environment
 */
export const getSecurityConfig = () => ({
    jwtSecret: backendConfig.JWT_SECRET,
    jwtRefreshSecret: backendConfig.JWT_REFRESH_SECRET,
    sessionSecret: backendConfig.SESSION_SECRET,
    cookieSecret: backendConfig.COOKIE_SECRET,
    enableSecurityMonitoring: backendConfig.ENABLE_SECURITY_MONITORING,
    wazuhEndpoint: backendConfig.WAZUH_ENDPOINT,
    falcoEndpoint: backendConfig.FALCO_ENDPOINT,
    securityAlertEmail: backendConfig.SECURITY_ALERT_EMAIL,
    securityAlertWebhook: backendConfig.SECURITY_ALERT_WEBHOOK
});
/**
 * Logging configuration based on environment
 */
export const getLoggingConfig = () => ({
    level: backendConfig.LOG_LEVEL,
    filePath: backendConfig.LOG_FILE_PATH,
    enableStructuredLogging: backendConfig.ENABLE_STRUCTURED_LOGGING,
    enableAuditLogging: backendConfig.ENABLE_AUDIT_LOGGING
});
/**
 * Performance monitoring configuration
 */
export const getMonitoringConfig = () => ({
    enableAPM: backendConfig.ENABLE_APM,
    apmServiceName: backendConfig.APM_SERVICE_NAME,
    apmServerUrl: backendConfig.APM_SERVER_URL,
    enableMetrics: backendConfig.ENABLE_METRICS,
    metricsPort: backendConfig.METRICS_PORT
});
/**
 * Rate limiting configuration
 */
export const getRateLimitConfig = () => ({
    enabled: backendConfig.RATE_LIMIT_ENABLED,
    windowMs: backendConfig.RATE_LIMIT_WINDOW_MS,
    maxRequests: backendConfig.RATE_LIMIT_MAX_REQUESTS
});
// Validate environment on module load
if (!isTest) {
    validateBackendEnvironment();
}
export default backendConfig;

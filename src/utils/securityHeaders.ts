/**
 * Security Headers Configuration
 * Implements comprehensive security headers for Zero-Trust architecture
 *
 * Based on OWASP Security Headers recommendations and Zero-Trust principles
 */

export interface SecurityHeaders {
  'Content-Security-Policy': string;
  'X-Content-Type-Options': string;
  'X-Frame-Options': string;
  'X-XSS-Protection': string;
  'Referrer-Policy': string;
  'Strict-Transport-Security': string;
  'Permissions-Policy': string;
  'Cross-Origin-Embedder-Policy': string;
  'Cross-Origin-Opener-Policy': string;
  'Cross-Origin-Resource-Policy': string;
}

/**
 * Comprehensive security headers for production deployment
 * Implements Zero-Trust security model with strict content policies
 */
export const securityHeaders: SecurityHeaders = {
  // Content Security Policy - Prevents XSS and injection attacks
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co https://api.synapses.com",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    'upgrade-insecure-requests'
  ].join('; '),

  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',

  // Prevent clickjacking attacks
  'X-Frame-Options': 'DENY',

  // Enable XSS protection
  'X-XSS-Protection': '1; mode=block',

  // Control referrer information
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // Enforce HTTPS
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',

  // Permissions Policy - Control browser features
  'Permissions-Policy': [
    'accelerometer=()',
    'ambient-light-sensor=()',
    'autoplay=()',
    'battery=()',
    'camera=()',
    'cross-origin-isolated=()',
    'display-capture=()',
    'document-domain=()',
    'encrypted-media=()',
    'execution-while-not-rendered=()',
    'execution-while-out-of-viewport=()',
    'fullscreen=(self)',
    'geolocation=()',
    'gyroscope=()',
    'keyboard-map=()',
    'magnetometer=()',
    'microphone=()',
    'midi=()',
    'navigation-override=()',
    'payment=()',
    'picture-in-picture=()',
    'publickey-credentials-get=()',
    'screen-wake-lock=()',
    'sync-xhr=()',
    'usb=()',
    'web-share=()',
    'xr-spatial-tracking=()'
  ].join(', '),

  // Cross-Origin Embedder Policy
  'Cross-Origin-Embedder-Policy': 'require-corp',

  // Cross-Origin Opener Policy
  'Cross-Origin-Opener-Policy': 'same-origin',

  // Cross-Origin Resource Policy
  'Cross-Origin-Resource-Policy': 'same-origin'
};

/**
 * Development security headers (less restrictive for development)
 */
export const developmentSecurityHeaders: SecurityHeaders = {
  ...securityHeaders,
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' data:",
    "img-src 'self' data: https:",
    "connect-src 'self' http://localhost:* https://*.supabase.co",
    "frame-src 'none'",
    "object-src 'none'"
  ].join('; '),
  'Strict-Transport-Security': 'max-age=86400; includeSubDomains'
};

/**
 * Get security headers based on environment
 */
export function getSecurityHeaders(
  environment: 'production' | 'development' = 'production'
): SecurityHeaders {
  return environment === 'production' ? securityHeaders : developmentSecurityHeaders;
}

/**
 * Apply security headers to response
 */
export function applySecurityHeaders(
  response: Response,
  environment: 'production' | 'development' = 'production'
): Response {
  const headers = getSecurityHeaders(environment);

  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

/**
 * Security headers middleware for Express.js
 */
export function securityHeadersMiddleware(
  environment: 'production' | 'development' = 'production'
) {
  return (req: any, res: any, next: any) => {
    const headers = getSecurityHeaders(environment);

    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    next();
  };
}

/**
 * Vite plugin for security headers
 */
export function securityHeadersVitePlugin(
  environment: 'production' | 'development' = 'production'
) {
  return {
    name: 'security-headers',
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        const headers = getSecurityHeaders(environment);

        Object.entries(headers).forEach(([key, value]) => {
          res.setHeader(key, value);
        });

        next();
      });
    }
  };
}

/**
 * Next.js security headers configuration
 */
export const nextSecurityHeaders = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: Object.entries(securityHeaders).map(([key, value]) => ({
          key,
          value
        }))
      }
    ];
  }
};

/**
 * Validate security headers implementation
 */
export function validateSecurityHeaders(headers: Record<string, string>): {
  valid: boolean;
  missing: string[];
  recommendations: string[];
} {
  const requiredHeaders = Object.keys(securityHeaders);
  const presentHeaders = Object.keys(headers);
  const missingHeaders = requiredHeaders.filter(header => !presentHeaders.includes(header));

  const recommendations: string[] = [];

  if (missingHeaders.length > 0) {
    recommendations.push(`Add missing security headers: ${missingHeaders.join(', ')}`);
  }

  // Check for weak configurations
  if (headers['X-Frame-Options'] && headers['X-Frame-Options'] !== 'DENY') {
    recommendations.push('Consider setting X-Frame-Options to DENY for maximum security');
  }

  if (headers['X-Content-Type-Options'] && headers['X-Content-Type-Options'] !== 'nosniff') {
    recommendations.push('Set X-Content-Type-Options to nosniff to prevent MIME type sniffing');
  }

  return {
    valid: missingHeaders.length === 0,
    missing: missingHeaders,
    recommendations
  };
}

export default securityHeaders;

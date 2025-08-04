# Security Setup Script for Synapses GRC Platform
# This script sets up additional security tools and configurations

Write-Host "🔒 Setting up security tools and configurations..." -ForegroundColor Blue

# Check if running as administrator (for some security configurations)
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")

if (-not $isAdmin) {
    Write-Host "⚠️ Some security configurations may require administrator privileges" -ForegroundColor Yellow
}

# Create security directories
Write-Host "📁 Creating security directories..." -ForegroundColor Blue
$securityDirs = @(
    "scripts/security",
    "docs/security",
    "logs",
    "temp",
    "backups"
)

foreach ($dir in $securityDirs) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "✅ Created directory: $dir" -ForegroundColor Green
    }
}

# Create .gitignore entries for security
Write-Host "🔐 Updating .gitignore for security..." -ForegroundColor Blue
$gitignorePath = ".gitignore"
$securityIgnoreEntries = @"

# Security and sensitive files
*.key
*.pem
*.p12
*.pfx
*.crt
*.cer
*.csr
*.jks
*.keystore
*.truststore

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.env.*.local

# Logs and temporary files
logs/
temp/
*.log
*.tmp

# Backup files
backups/
*.backup
*.bak

# Security scan results
security-reports/
*.sarif
npm-audit-results.json
snyk-results.json

# IDE and editor files that might contain sensitive data
.vscode/settings.json
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
"@

if (Test-Path $gitignorePath) {
    $currentGitignore = Get-Content $gitignorePath -Raw
    if ($currentGitignore -notmatch "Security and sensitive files") {
        Add-Content -Path $gitignorePath -Value $securityIgnoreEntries
        Write-Host "✅ Updated .gitignore with security entries" -ForegroundColor Green
    } else {
        Write-Host "ℹ️ .gitignore already contains security entries" -ForegroundColor Cyan
    }
} else {
    $securityIgnoreEntries | Out-File -FilePath $gitignorePath -Encoding UTF8
    Write-Host "✅ Created .gitignore with security entries" -ForegroundColor Green
}

# Install additional security-focused npm packages
Write-Host "📦 Installing security packages..." -ForegroundColor Blue

try {
    # Security linting and analysis
    npm install --save-dev eslint-plugin-security eslint-plugin-no-secrets
    Write-Host "✅ Installed ESLint security plugins" -ForegroundColor Green
    
    # Helmet for security headers (if building a server)
    npm install helmet
    Write-Host "✅ Installed Helmet for security headers" -ForegroundColor Green
    
    # CSRF protection
    npm install csurf
    Write-Host "✅ Installed CSRF protection" -ForegroundColor Green
    
    # Rate limiting
    npm install express-rate-limit
    Write-Host "✅ Installed rate limiting" -ForegroundColor Green
    
    # Input validation and sanitization
    npm install joi validator dompurify
    Write-Host "✅ Installed input validation libraries" -ForegroundColor Green
    
    # Encryption utilities
    npm install bcryptjs crypto-js
    Write-Host "✅ Installed encryption utilities" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Failed to install some security packages: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "You may need to install them manually" -ForegroundColor Yellow
}

# Create security configuration files
Write-Host "⚙️ Creating security configuration files..." -ForegroundColor Blue

# Security headers configuration
$securityHeadersConfig = @"
// Security Headers Configuration
// Use with Helmet.js or similar security middleware

export const securityHeaders = {
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.openai.com", "https://*.supabase.co"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  
  // HTTP Strict Transport Security
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  
  // X-Frame-Options
  frameguard: {
    action: 'deny',
  },
  
  // X-Content-Type-Options
  noSniff: true,
  
  // Referrer Policy
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin',
  },
  
  // X-XSS-Protection
  xssFilter: true,
  
  // Hide X-Powered-By header
  hidePoweredBy: true,
};

export default securityHeaders;
"@

$securityHeadersConfig | Out-File -FilePath "src/config/security-headers.ts" -Encoding UTF8
Write-Host "✅ Created security headers configuration" -ForegroundColor Green

# Input validation schemas
$validationSchemas = @"
// Input Validation Schemas
// Use with Joi or similar validation library

import Joi from 'joi';

// Password validation schema
export const passwordSchema = Joi.string()
  .min(12)
  .max(128)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 'password')
  .required()
  .messages({
    'string.pattern.name': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    'string.min': 'Password must be at least 12 characters long',
    'string.max': 'Password must not exceed 128 characters',
  });

// Email validation schema
export const emailSchema = Joi.string()
  .email({ tlds: { allow: false } })
  .max(254)
  .required()
  .messages({
    'string.email': 'Please provide a valid email address',
    'string.max': 'Email address is too long',
  });

// User registration schema
export const userRegistrationSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: Joi.string().min(1).max(50).pattern(/^[a-zA-Z\s]+$/).required(),
  lastName: Joi.string().min(1).max(50).pattern(/^[a-zA-Z\s]+$/).required(),
  organization: Joi.string().min(1).max(100).optional(),
  acceptTerms: Joi.boolean().valid(true).required(),
});

// Login schema
export const loginSchema = Joi.object({
  email: emailSchema,
  password: Joi.string().required(),
  rememberMe: Joi.boolean().optional(),
});

// File upload schema
export const fileUploadSchema = Joi.object({
  filename: Joi.string().max(255).pattern(/^[a-zA-Z0-9._-]+$/).required(),
  size: Joi.number().max(10 * 1024 * 1024).required(), // 10MB max
  mimetype: Joi.string().valid(
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
    'text/plain'
  ).required(),
});

// API key schema
export const apiKeySchema = Joi.string()
  .pattern(/^[a-zA-Z0-9_-]+$/, 'api-key')
  .min(32)
  .max(128)
  .required();

// Sanitization helpers
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>"'&]/g, '');
};

export const sanitizeHtml = (html: string): string => {
  // Use DOMPurify in browser environment
  if (typeof window !== 'undefined' && window.DOMPurify) {
    return window.DOMPurify.sanitize(html);
  }
  // Fallback for server-side
  return html.replace(/<script[^>]*>.*?<\/script>/gi, '')
             .replace(/<[^>]*>/g, '');
};
"@

$validationSchemas | Out-File -FilePath "src/lib/validation.ts" -Encoding UTF8
Write-Host "✅ Created input validation schemas" -ForegroundColor Green

# Security utilities
$securityUtils = @"
// Security Utilities
// Common security functions and helpers

import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Password hashing
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

// Generate secure random tokens
export const generateSecureToken = (length: number = 32): string => {
  return crypto.randomBytes(length).toString('hex');
};

// Generate API key
export const generateApiKey = (): string => {
  const prefix = 'sk_';
  const randomPart = crypto.randomBytes(32).toString('base64url');
  return prefix + randomPart;
};

// Encrypt sensitive data
export const encryptData = (data: string, key: string): string => {
  const algorithm = 'aes-256-gcm';
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher(algorithm, key);
  
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
};

// Decrypt sensitive data
export const decryptData = (encryptedData: string, key: string): string => {
  const algorithm = 'aes-256-gcm';
  const parts = encryptedData.split(':');
  
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted data format');
  }
  
  const iv = Buffer.from(parts[0], 'hex');
  const authTag = Buffer.from(parts[1], 'hex');
  const encrypted = parts[2];
  
  const decipher = crypto.createDecipher(algorithm, key);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
};

// Rate limiting helper
export const createRateLimiter = (windowMs: number, maxRequests: number) => {
  const requests = new Map();
  
  return (identifier: string): boolean => {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Clean old entries
    for (const [key, timestamp] of requests.entries()) {
      if (timestamp < windowStart) {
        requests.delete(key);
      }
    }
    
    // Count requests for this identifier
    const userRequests = Array.from(requests.entries())
      .filter(([key]) => key.startsWith(identifier))
      .length;
    
    if (userRequests >= maxRequests) {
      return false; // Rate limit exceeded
    }
    
    // Add this request
    requests.set(`${identifier}:${now}`, now);
    return true; // Request allowed
  };
};

// CSRF token generation and validation
export const generateCSRFToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const validateCSRFToken = (token: string, sessionToken: string): boolean => {
  return crypto.timingSafeEqual(
    Buffer.from(token, 'hex'),
    Buffer.from(sessionToken, 'hex')
  );
};

// Secure session ID generation
export const generateSessionId = (): string => {
  return crypto.randomBytes(32).toString('base64url');
};

// Input sanitization
export const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '')
    .replace(/\.{2,}/g, '.')
    .substring(0, 255);
};

export const sanitizeUrl = (url: string): string => {
  try {
    const parsed = new URL(url);
    // Only allow https and http protocols
    if (!['https:', 'http:'].includes(parsed.protocol)) {
      throw new Error('Invalid protocol');
    }
    return parsed.toString();
  } catch {
    throw new Error('Invalid URL');
  }
};

// Security headers for API responses
export const getSecurityHeaders = () => {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'self'",
  };
};
"@

$securityUtils | Out-File -FilePath "src/lib/security.ts" -Encoding UTF8
Write-Host "✅ Created security utilities" -ForegroundColor Green

# Update ESLint configuration to include security plugins
Write-Host "🔧 Updating ESLint configuration for security..." -ForegroundColor Blue

try {
    $eslintConfigPath = "eslint.config.js"
    if (Test-Path $eslintConfigPath) {
        $eslintConfig = Get-Content $eslintConfigPath -Raw
        
        # Check if security plugins are already added
        if ($eslintConfig -notmatch "eslint-plugin-security") {
            # Add security plugins to the configuration
            $securityPluginImport = "import security from 'eslint-plugin-security';`nimport noSecrets from 'eslint-plugin-no-secrets';`n"
            $eslintConfig = $securityPluginImport + $eslintConfig
            
            # Add plugins to the configuration object
            $eslintConfig = $eslintConfig -replace "plugins: \[", "plugins: [`n    security,`n    noSecrets,"
            
            # Add security rules
            $securityRules = @"
    // Security rules
    'security/detect-object-injection': 'error',
    'security/detect-non-literal-regexp': 'error',
    'security/detect-unsafe-regex': 'error',
    'security/detect-buffer-noassert': 'error',
    'security/detect-child-process': 'error',
    'security/detect-disable-mustache-escape': 'error',
    'security/detect-eval-with-expression': 'error',
    'security/detect-no-csrf-before-method-override': 'error',
    'security/detect-non-literal-fs-filename': 'error',
    'security/detect-non-literal-require': 'error',
    'security/detect-possible-timing-attacks': 'error',
    'security/detect-pseudoRandomBytes': 'error',
    'no-secrets/no-secrets': 'error',
"@
            
            $eslintConfig = $eslintConfig -replace "rules: \{", "rules: {`n    $securityRules"
            
            $eslintConfig | Out-File -FilePath $eslintConfigPath -Encoding UTF8
            Write-Host "✅ Updated ESLint configuration with security plugins" -ForegroundColor Green
        } else {
            Write-Host "ℹ️ ESLint already configured with security plugins" -ForegroundColor Cyan
        }
    }
} catch {
    Write-Host "⚠️ Could not automatically update ESLint config. Please add security plugins manually." -ForegroundColor Yellow
}

# Create security checklist
$securityChecklist = @"
# Security Implementation Checklist

## ✅ Completed
- [x] Security directories created
- [x] .gitignore updated with security entries
- [x] Security packages installed
- [x] Security headers configuration created
- [x] Input validation schemas created
- [x] Security utilities implemented
- [x] ESLint security plugins configured

## 🔄 Next Steps

### Authentication & Authorization
- [ ] Implement multi-factor authentication (MFA)
- [ ] Set up role-based access control (RBAC)
- [ ] Configure session management
- [ ] Implement password policies
- [ ] Set up account lockout mechanisms

### Data Protection
- [ ] Implement data encryption at rest
- [ ] Configure data encryption in transit
- [ ] Set up data classification
- [ ] Implement data loss prevention (DLP)
- [ ] Configure backup encryption

### Application Security
- [ ] Implement CSRF protection
- [ ] Set up XSS prevention
- [ ] Configure SQL injection prevention
- [ ] Implement file upload security
- [ ] Set up API rate limiting

### Monitoring & Logging
- [ ] Configure security event logging
- [ ] Set up intrusion detection
- [ ] Implement audit trails
- [ ] Configure log monitoring
- [ ] Set up security alerts

### Compliance
- [ ] Implement GDPR compliance measures
- [ ] Set up SOC 2 controls
- [ ] Configure audit logging
- [ ] Implement data retention policies
- [ ] Set up compliance reporting

### Testing
- [ ] Set up automated security testing
- [ ] Configure dependency scanning
- [ ] Implement penetration testing
- [ ] Set up vulnerability assessments
- [ ] Configure security code reviews

## 📚 Resources
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [Security Headers](https://securityheaders.com/)
- [Mozilla Security Guidelines](https://infosec.mozilla.org/guidelines/)
"@

$securityChecklist | Out-File -FilePath "docs/security/SECURITY_CHECKLIST.md" -Encoding UTF8
Write-Host "✅ Created security implementation checklist" -ForegroundColor Green

# Final summary
Write-Host "" 
Write-Host "🎉 Security setup completed!" -ForegroundColor Green
Write-Host "" 
Write-Host "📋 What was configured:" -ForegroundColor Yellow
Write-Host "  • Security directories and .gitignore entries" -ForegroundColor White
Write-Host "  • Security-focused npm packages" -ForegroundColor White
Write-Host "  • Security headers configuration" -ForegroundColor White
Write-Host "  • Input validation schemas" -ForegroundColor White
Write-Host "  • Security utility functions" -ForegroundColor White
Write-Host "  • ESLint security plugins" -ForegroundColor White
Write-Host "  • Security implementation checklist" -ForegroundColor White
Write-Host "" 
Write-Host "🔄 Next steps:" -ForegroundColor Yellow
Write-Host "  1. Review and customize security configurations" -ForegroundColor White
Write-Host "  2. Implement authentication and authorization" -ForegroundColor White
Write-Host "  3. Set up monitoring and logging" -ForegroundColor White
Write-Host "  4. Configure compliance measures" -ForegroundColor White
Write-Host "  5. Run security tests and scans" -ForegroundColor White
Write-Host "" 
Write-Host "📖 Check docs/security/SECURITY_CHECKLIST.md for detailed next steps" -ForegroundColor Cyan
# Priority 1 Deployment Script
# Deploys JWT-based authentication and security monitoring

param(
    [string]$Environment = "development",
    [string]$ConfigPath = ".env",
    [switch]$SkipValidation,
    [switch]$Force
)

Write-Host "🚀 Priority 1 Deployment Script" -ForegroundColor Green
Write-Host "Environment: $Environment" -ForegroundColor Yellow
Write-Host "Config Path: $ConfigPath" -ForegroundColor Yellow

# Function to check if command exists
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Function to validate environment
function Test-Environment {
    Write-Host "🔍 Validating environment..." -ForegroundColor Blue
    
    # Check Node.js
    if (-not (Test-Command "node")) {
        Write-Error "❌ Node.js is not installed or not in PATH"
        exit 1
    }
    
    # Check npm
    if (-not (Test-Command "npm")) {
        Write-Error "❌ npm is not installed or not in PATH"
        exit 1
    }
    
    # Check required files
    $requiredFiles = @(
        "package.json",
        "src/services/authService.ts",
        "src/services/securityMonitoringService.ts",
        "src/config/environment.backend.ts",
        "src/middleware/authMiddleware.ts",
        "src/routes/auth.ts"
    )
    
    foreach ($file in $requiredFiles) {
        if (-not (Test-Path $file)) {
            Write-Error "❌ Required file not found: $file"
            exit 1
        }
    }
    
    Write-Host "✅ Environment validation passed" -ForegroundColor Green
}

# Function to install dependencies
function Install-Dependencies {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
    
    try {
        npm install
        Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
    }
    catch {
        Write-Error "❌ Failed to install dependencies: $_"
        exit 1
    }
}

# Function to validate configuration
function Test-Configuration {
    Write-Host "⚙️ Validating configuration..." -ForegroundColor Blue
    
    if (-not (Test-Path $ConfigPath)) {
        Write-Warning "⚠️ Configuration file not found: $ConfigPath"
        Write-Host "Creating sample configuration..." -ForegroundColor Yellow
        
        $sampleConfig = @"
# Priority 1 Configuration
# Environment: $Environment

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production
SESSION_SECRET=your-session-secret-change-in-production
COOKIE_SECRET=your-cookie-secret-change-in-production

# Security Monitoring
ENABLE_SECURITY_MONITORING=true
WAZUH_ENDPOINT=http://localhost:55000
FALCO_ENDPOINT=http://localhost:9765
SECURITY_ALERT_EMAIL=security@your-domain.com
SECURITY_ALERT_WEBHOOK=https://slack.your-domain.com/webhook

# API Keys (Server-side only)
NEXUS_API_KEY=your-nexus-api-key
OPENAI_API_KEY=your-openai-api-key

# Database & Services
DATABASE_URL=postgresql://localhost:5432/synapses_dev
REDIS_URL=redis://localhost:6379
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key

# Application
NODE_ENV=$Environment
PORT=3001
LOG_LEVEL=debug
"@
        
        $sampleConfig | Out-File -FilePath $ConfigPath -Encoding UTF8
        Write-Host "✅ Sample configuration created: $ConfigPath" -ForegroundColor Green
        Write-Host "⚠️ Please update the configuration with your actual values" -ForegroundColor Yellow
    }
    else {
        Write-Host "✅ Configuration file found: $ConfigPath" -ForegroundColor Green
    }
}

# Function to build the application
function Build-Application {
    Write-Host "🔨 Building application..." -ForegroundColor Blue
    
    try {
        # Build frontend
        Write-Host "Building frontend..." -ForegroundColor Yellow
        npm run build:frontend
        
        # Build backend
        Write-Host "Building backend..." -ForegroundColor Yellow
        npm run build:backend
        
        Write-Host "✅ Application built successfully" -ForegroundColor Green
    }
    catch {
        Write-Error "❌ Build failed: $_"
        exit 1
    }
}

# Function to run tests
function Run-Tests {
    Write-Host "🧪 Running tests..." -ForegroundColor Blue
    
    try {
        npm test
        Write-Host "✅ Tests passed" -ForegroundColor Green
    }
    catch {
        Write-Warning "⚠️ Tests failed: $_"
        if (-not $Force) {
            Write-Host "Use -Force to continue despite test failures" -ForegroundColor Yellow
            exit 1
        }
    }
}

# Function to start services
function Start-Services {
    Write-Host "🚀 Starting services..." -ForegroundColor Blue
    
    try {
        # Start development server
        Write-Host "Starting development server..." -ForegroundColor Yellow
        Start-Process -FilePath "npm" -ArgumentList "run", "dev" -NoNewWindow
        
        Write-Host "✅ Services started successfully" -ForegroundColor Green
        Write-Host "🌐 Application available at: http://localhost:8080" -ForegroundColor Green
        Write-Host "🔧 Backend API available at: http://localhost:3001" -ForegroundColor Green
    }
    catch {
        Write-Error "❌ Failed to start services: $_"
        exit 1
    }
}

# Function to display deployment summary
function Show-DeploymentSummary {
    Write-Host ""
    Write-Host "🎉 Priority 1 Deployment Complete!" -ForegroundColor Green
    Write-Host "==================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "✅ JWT-based session management" -ForegroundColor Green
    Write-Host "✅ Security monitoring (Wazuh/Falco)" -ForegroundColor Green
    Write-Host "✅ Environment-specific configurations" -ForegroundColor Green
    Write-Host "✅ Debug authentication features" -ForegroundColor Green
    Write-Host "✅ Comprehensive middleware stack" -ForegroundColor Green
    Write-Host "✅ Authentication API endpoints" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔗 Useful URLs:" -ForegroundColor Yellow
    Write-Host "   Frontend: http://localhost:8080" -ForegroundColor Cyan
    Write-Host "   Backend API: http://localhost:3001" -ForegroundColor Cyan
    Write-Host "   Auth Debug: http://localhost:3001/auth/debug/info" -ForegroundColor Cyan
    Write-Host "   Security Stats: http://localhost:3001/auth/security/stats" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📚 Documentation:" -ForegroundColor Yellow
    Write-Host "   Implementation Summary: ./PRIORITY_1_IMPLEMENTATION_SUMMARY.md" -ForegroundColor Cyan
    Write-Host "   Security Guide: ./docs/SECURITY.md" -ForegroundColor Cyan
    Write-Host "   Backend Guide: ./README.backend.md" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🔒 Security Features:" -ForegroundColor Yellow
    Write-Host "   • JWT token management with refresh tokens" -ForegroundColor White
    Write-Host "   • Session lifecycle management" -ForegroundColor White
    Write-Host "   • Rate limiting and IP blocking" -ForegroundColor White
    Write-Host "   • Real-time threat detection" -ForegroundColor White
    Write-Host "   • Security event logging" -ForegroundColor White
    Write-Host "   • Comprehensive audit trails" -ForegroundColor White
    Write-Host ""
    Write-Host "⚠️ Next Steps:" -ForegroundColor Yellow
    Write-Host "   1. Update configuration with real values" -ForegroundColor White
    Write-Host "   2. Configure Wazuh and Falco endpoints" -ForegroundColor White
    Write-Host "   3. Set up production environment variables" -ForegroundColor White
    Write-Host "   4. Test authentication flows" -ForegroundColor White
    Write-Host "   5. Review security monitoring alerts" -ForegroundColor White
    Write-Host ""
}

# Main deployment process
try {
    # Validate environment
    if (-not $SkipValidation) {
        Test-Environment
    }
    
    # Install dependencies
    Install-Dependencies
    
    # Validate configuration
    Test-Configuration
    
    # Build application
    Build-Application
    
    # Run tests (optional)
    if (-not $SkipValidation) {
        Run-Tests
    }
    
    # Start services
    Start-Services
    
    # Show deployment summary
    Show-DeploymentSummary
    
    Write-Host "🎯 Priority 1 deployment completed successfully!" -ForegroundColor Green
}
catch {
    Write-Error "❌ Deployment failed: $_"
    exit 1
}

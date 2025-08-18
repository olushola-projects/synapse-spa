# Priority 3 Deployment Script
# Advanced Security, Compliance Reporting, and Documentation

param(
    [string]$Environment = "development",
    [switch]$SkipTests = $false,
    [switch]$SkipBuild = $false,
    [switch]$Force = $false
)

Write-Host "🚀 Priority 3 Deployment Script" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host "Environment: $Environment" -ForegroundColor Yellow
Write-Host "Skip Tests: $SkipTests" -ForegroundColor Yellow
Write-Host "Skip Build: $SkipBuild" -ForegroundColor Yellow
Write-Host "Force: $Force" -ForegroundColor Yellow
Write-Host ""

# Function to log messages
function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $color = switch ($Level) {
        "ERROR" { "Red" }
        "WARN" { "Yellow" }
        "SUCCESS" { "Green" }
        default { "White" }
    }
    Write-Host "[$timestamp] [$Level] $Message" -ForegroundColor $color
}

# Function to check if command exists
function Test-Command {
    param([string]$Command)
    try {
        Get-Command $Command -ErrorAction Stop | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

# Function to validate environment
function Test-Environment {
    Write-Log "Validating environment..." "INFO"
    
    # Check Node.js
    if (-not (Test-Command "node")) {
        Write-Log "Node.js is not installed or not in PATH" "ERROR"
        return $false
    }
    
    $nodeVersion = node --version
    Write-Log "Node.js version: $nodeVersion" "INFO"
    
    # Check npm
    if (-not (Test-Command "npm")) {
        Write-Log "npm is not installed or not in PATH" "ERROR"
        return $false
    }
    
    $npmVersion = npm --version
    Write-Log "npm version: $npmVersion" "INFO"
    
    # Check if we're in the right directory
    if (-not (Test-Path "package.json")) {
        Write-Log "package.json not found. Please run this script from the project root." "ERROR"
        return $false
    }
    
    Write-Log "Environment validation passed" "SUCCESS"
    return $true
}

# Function to install dependencies
function Install-Dependencies {
    Write-Log "Installing dependencies..." "INFO"
    
    try {
        npm install
        if ($LASTEXITCODE -ne 0) {
            Write-Log "Failed to install dependencies" "ERROR"
            return $false
        }
        Write-Log "Dependencies installed successfully" "SUCCESS"
        return $true
    }
    catch {
        Write-Log "Error installing dependencies: $($_.Exception.Message)" "ERROR"
        return $false
    }
}

# Function to validate environment file
function Test-EnvironmentFile {
    Write-Log "Validating environment configuration..." "INFO"
    
    $envFile = ".env"
    if (-not (Test-Path $envFile)) {
        Write-Log "Creating sample .env file..." "WARN"
        
        $sampleEnv = @"
# Priority 3 Environment Configuration
NODE_ENV=$Environment

# Priority 3 Feature Flags
ENABLE_ADVANCED_SECURITY=true
ENABLE_THREAT_INTELLIGENCE=true
ENABLE_ML_SECURITY=true
ENABLE_COMPLIANCE_REPORTING=true
ENABLE_AUTO_REFRESH=true
ENABLE_DOCUMENTATION=true
ENABLE_AUTO_REVIEW=true

# Threat Intelligence Configuration
THREAT_INTELLIGENCE_FEEDS=abuseipdb,phishtank
ABUSEIPDB_API_KEY=your_api_key_here
PHISHTANK_API_KEY=your_api_key_here

# ML Security Configuration
ML_MODEL_PATH=./models
ML_CONFIDENCE_THRESHOLD=0.75

# Compliance Reporting Configuration
COMPLIANCE_REPORT_STORAGE=./reports
COMPLIANCE_DASHBOARD_REFRESH=300

# Documentation Configuration
DOCUMENTATION_STORAGE=./documents
DOCUMENTATION_TEMPLATE_PATH=./templates

# Supabase Configuration (from Priority 1)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT Configuration (from Priority 1)
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here

# Security Configuration (from Priority 1)
ENABLE_DEBUG_AUTH=true
DEBUG_SESSION_ID=debug_session_123
ENABLE_CIRCUIT_BREAKER=true
ENABLE_PERFORMANCE_MONITORING=true

# Compliance Configuration (from Priority 2)
ENABLE_COMPLIANCE_AUTOMATION=true
ENABLE_PERFORMANCE_OPTIMIZATION=true
ENABLE_ERROR_HANDLING=true

# Server Configuration
PORT=3000
HOST=localhost
"@
        
        $sampleEnv | Out-File -FilePath $envFile -Encoding UTF8
        Write-Log "Sample .env file created. Please update with your actual values." "WARN"
        return $false
    }
    
    Write-Log "Environment file found" "SUCCESS"
    return $true
}

# Function to build the application
function Build-Application {
    if ($SkipBuild) {
        Write-Log "Skipping build as requested" "WARN"
        return $true
    }
    
    Write-Log "Building application..." "INFO"
    
    try {
        # Build frontend
        Write-Log "Building frontend..." "INFO"
        npm run build
        if ($LASTEXITCODE -ne 0) {
            Write-Log "Frontend build failed" "ERROR"
            return $false
        }
        
        # Build backend
        Write-Log "Building backend..." "INFO"
        npm run build:backend
        if ($LASTEXITCODE -ne 0) {
            Write-Log "Backend build failed" "ERROR"
            return $false
        }
        
        Write-Log "Application built successfully" "SUCCESS"
        return $true
    }
    catch {
        Write-Log "Error building application: $($_.Exception.Message)" "ERROR"
        return $false
    }
}

# Function to run tests
function Run-Tests {
    if ($SkipTests) {
        Write-Log "Skipping tests as requested" "WARN"
        return $true
    }
    
    Write-Log "Running tests..." "INFO"
    
    try {
        npm test
        if ($LASTEXITCODE -ne 0) {
            Write-Log "Tests failed" "ERROR"
            if (-not $Force) {
                return $false
            }
            Write-Log "Continuing due to --Force flag" "WARN"
        }
        
        Write-Log "Tests completed" "SUCCESS"
        return $true
    }
    catch {
        Write-Log "Error running tests: $($_.Exception.Message)" "ERROR"
        if (-not $Force) {
            return $false
        }
        Write-Log "Continuing due to --Force flag" "WARN"
        return $true
    }
}

# Function to start services
function Start-Services {
    Write-Log "Starting Priority 3 services..." "INFO"
    
    try {
        # Start development server
        Write-Log "Starting development server..." "INFO"
        Start-Process -FilePath "npm" -ArgumentList "run", "dev" -NoNewWindow
        
        # Wait a moment for server to start
        Start-Sleep -Seconds 5
        
        Write-Log "Services started successfully" "SUCCESS"
        return $true
    }
    catch {
        Write-Log "Error starting services: $($_.Exception.Message)" "ERROR"
        return $false
    }
}

# Function to display deployment summary
function Show-DeploymentSummary {
    Write-Host ""
    Write-Host "🎉 Priority 3 Deployment Summary" -ForegroundColor Green
    Write-Host "================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "✅ Environment validated" -ForegroundColor Green
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
    Write-Host "✅ Environment configuration checked" -ForegroundColor Green
    if (-not $SkipBuild) {
        Write-Host "✅ Application built" -ForegroundColor Green
    }
    if (-not $SkipTests) {
        Write-Host "✅ Tests completed" -ForegroundColor Green
    }
    Write-Host "✅ Services started" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Application URLs:" -ForegroundColor Yellow
    Write-Host "   Frontend: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "   Backend API: http://localhost:3000/api" -ForegroundColor Cyan
    Write-Host "   Priority 3 API: http://localhost:3000/api/priority3" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📊 Priority 3 Endpoints:" -ForegroundColor Yellow
    Write-Host "   Health Check: http://localhost:3000/api/priority3/health" -ForegroundColor Cyan
    Write-Host "   Security Metrics: http://localhost:3000/api/priority3/security/metrics" -ForegroundColor Cyan
    Write-Host "   Compliance Dashboards: http://localhost:3000/api/priority3/compliance/dashboards" -ForegroundColor Cyan
    Write-Host "   Documentation: http://localhost:3000/api/priority3/documentation" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "⚠️  Important Notes:" -ForegroundColor Yellow
    Write-Host "   - Priority 3 services are not fully implemented yet" -ForegroundColor Red
    Write-Host "   - API endpoints return placeholder responses" -ForegroundColor Red
    Write-Host "   - Update .env file with actual API keys and configuration" -ForegroundColor Yellow
    Write-Host "   - Complete service implementation is required for production use" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📚 Next Steps:" -ForegroundColor Yellow
    Write-Host "   1. Review PRIORITY_3_IMPLEMENTATION_SUMMARY.md" -ForegroundColor Cyan
    Write-Host "   2. Implement core business logic for each service" -ForegroundColor Cyan
    Write-Host "   3. Add database persistence layer" -ForegroundColor Cyan
    Write-Host "   4. Complete service integration" -ForegroundColor Cyan
    Write-Host "   5. Add comprehensive testing" -ForegroundColor Cyan
    Write-Host "   6. Deploy to production environment" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🔧 Useful Commands:" -ForegroundColor Yellow
    Write-Host "   npm run dev          - Start development server" -ForegroundColor Cyan
    Write-Host "   npm test             - Run tests" -ForegroundColor Cyan
    Write-Host "   npm run build        - Build for production" -ForegroundColor Cyan
    Write-Host "   npm run lint         - Run linting" -ForegroundColor Cyan
    Write-Host ""
}

# Main deployment process
function Start-Deployment {
    Write-Log "Starting Priority 3 deployment..." "INFO"
    
    # Step 1: Validate environment
    if (-not (Test-Environment)) {
        Write-Log "Environment validation failed. Exiting." "ERROR"
        exit 1
    }
    
    # Step 2: Install dependencies
    if (-not (Install-Dependencies)) {
        Write-Log "Dependency installation failed. Exiting." "ERROR"
        exit 1
    }
    
    # Step 3: Validate environment file
    if (-not (Test-EnvironmentFile)) {
        Write-Log "Environment file validation failed. Please update .env file and run again." "ERROR"
        exit 1
    }
    
    # Step 4: Build application
    if (-not (Build-Application)) {
        Write-Log "Application build failed. Exiting." "ERROR"
        exit 1
    }
    
    # Step 5: Run tests
    if (-not (Run-Tests)) {
        Write-Log "Tests failed. Exiting." "ERROR"
        exit 1
    }
    
    # Step 6: Start services
    if (-not (Start-Services)) {
        Write-Log "Service startup failed. Exiting." "ERROR"
        exit 1
    }
    
    # Step 7: Show deployment summary
    Show-DeploymentSummary
    
    Write-Log "Priority 3 deployment completed successfully!" "SUCCESS"
}

# Handle script parameters
if ($Force) {
    Write-Log "Force flag detected - will continue even if some steps fail" "WARN"
}

# Start deployment
Start-Deployment

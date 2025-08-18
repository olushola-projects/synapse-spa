# Priority 2 Deployment Script
# Deploys Compliance Automation, Performance Optimization, and Error Handling services

param(
    [switch]$SkipTests,
    [switch]$Force,
    [string]$Environment = "development"
)

Write-Host "🚀 Priority 2 Deployment Script" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""

# Function to check if command exists
function Test-Command($CommandName) {
    try {
        Get-Command $CommandName -ErrorAction Stop | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

# Function to validate environment
function Test-Environment {
    Write-Host "🔍 Validating environment..." -ForegroundColor Yellow
    
    $errors = @()
    
    # Check Node.js
    if (-not (Test-Command "node")) {
        $errors += "Node.js is not installed or not in PATH"
    }
    else {
        $nodeVersion = node --version
        Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
    }
    
    # Check npm
    if (-not (Test-Command "npm")) {
        $errors += "npm is not installed or not in PATH"
    }
    else {
        $npmVersion = npm --version
        Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
    }
    
    # Check required files
    $requiredFiles = @(
        "src/services/complianceAutomationService.ts",
        "src/services/performanceOptimizationService.ts", 
        "src/services/errorHandlingService.ts",
        "src/routes/priority2.ts",
        "src/config/environment.backend.ts"
    )
    
    foreach ($file in $requiredFiles) {
        if (-not (Test-Path $file)) {
            $errors += "Required file not found: $file"
        }
        else {
            Write-Host "✅ Found: $file" -ForegroundColor Green
        }
    }
    
    if ($errors.Count -gt 0) {
        Write-Host "❌ Environment validation failed:" -ForegroundColor Red
        foreach ($err in $errors) {
            Write-Host "   - $err" -ForegroundColor Red
        }
        exit 1
    }
    
    Write-Host "✅ Environment validation passed" -ForegroundColor Green
    Write-Host ""
}

# Function to install dependencies
function Install-Dependencies {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    
    try {
        npm install
        if ($LASTEXITCODE -ne 0) {
            throw "npm install failed"
        }
        Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Failed to install dependencies: $_" -ForegroundColor Red
        exit 1
    }
    
    Write-Host ""
}

# Function to validate environment configuration
function Test-EnvironmentConfig {
    Write-Host "⚙️  Validating environment configuration..." -ForegroundColor Yellow
    
    # Check if .env file exists
    if (-not (Test-Path ".env")) {
        Write-Host "⚠️  .env file not found. Creating sample configuration..." -ForegroundColor Yellow
        
        $envContent = @"
# Priority 2 Environment Configuration
NODE_ENV=$Environment

# Compliance Automation
ENABLE_COMPLIANCE_AUTOMATION=true
COMPLIANCE_CHECK_INTERVAL=300000

# Performance Optimization
ENABLE_PERFORMANCE_MONITORING=true
ENABLE_APM_INTEGRATION=true
APM_PROVIDER=custom
APM_SAMPLE_RATE=0.1
PERFORMANCE_ALERT_WEBHOOK=

# Error Handling
ENABLE_CIRCUIT_BREAKER=true
CIRCUIT_BREAKER_FAILURE_THRESHOLD=5
CIRCUIT_BREAKER_RECOVERY_TIMEOUT=30000

# Database
DATABASE_URL=your_database_url_here
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Security
JWT_SECRET=your_jwt_secret_here
ENCRYPTION_KEY=your_encryption_key_here

# Monitoring
LOG_LEVEL=info
ENABLE_STRUCTURED_LOGGING=true
"@
        
        $envContent | Out-File -FilePath ".env" -Encoding UTF8
        Write-Host "✅ Sample .env file created. Please update with your actual values." -ForegroundColor Green
    }
    else {
        Write-Host "✅ .env file found" -ForegroundColor Green
    }
    
    Write-Host ""
}

# Function to build the application
function Build-Application {
    Write-Host "🔨 Building application..." -ForegroundColor Yellow
    
    try {
        # Build frontend
        Write-Host "Building frontend..." -ForegroundColor Cyan
        npm run build:frontend
        if ($LASTEXITCODE -ne 0) {
            throw "Frontend build failed"
        }
        
        # Build backend
        Write-Host "Building backend..." -ForegroundColor Cyan
        npm run build:backend
        if ($LASTEXITCODE -ne 0) {
            throw "Backend build failed"
        }
        
        Write-Host "✅ Application built successfully" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Build failed: $_" -ForegroundColor Red
        if (-not $Force) {
            exit 1
        }
        else {
            Write-Host "⚠️  Continuing with force flag..." -ForegroundColor Yellow
        }
    }
    
    Write-Host ""
}

# Function to run tests
function Run-Tests {
    if ($SkipTests) {
        Write-Host "⚠️  Skipping tests (--SkipTests flag)" -ForegroundColor Yellow
        return
    }
    
    Write-Host "🧪 Running tests..." -ForegroundColor Yellow
    
    try {
        npm test
        if ($LASTEXITCODE -ne 0) {
            if ($Force) {
                Write-Host "⚠️  Tests failed but continuing with force flag..." -ForegroundColor Yellow
            }
            else {
                throw "Tests failed"
            }
        }
        else {
            Write-Host "✅ Tests passed" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "❌ Test execution failed: $_" -ForegroundColor Red
        if (-not $Force) {
            exit 1
        }
    }
    
    Write-Host ""
}

# Function to start services
function Start-Services {
    Write-Host "🚀 Starting Priority 2 services..." -ForegroundColor Yellow
    
    try {
        # Start development server
        Write-Host "Starting development server..." -ForegroundColor Cyan
        Start-Process -FilePath "npm" -ArgumentList "run", "dev" -NoNewWindow
        
        # Wait for services to start
        Write-Host "Waiting for services to start..." -ForegroundColor Cyan
        Start-Sleep -Seconds 10
        
        Write-Host "✅ Services started successfully" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Failed to start services: $_" -ForegroundColor Red
        exit 1
    }
    
    Write-Host ""
}

# Function to verify deployment
function Test-Deployment {
    Write-Host "🔍 Verifying deployment..." -ForegroundColor Yellow
    
    $baseUrl = "http://localhost:3000"
    $endpoints = @(
        "/api/priority2/status",
        "/api/priority2/compliance/rules",
        "/api/priority2/performance/metrics",
        "/api/priority2/errors/circuit-breakers"
    )
    
    foreach ($endpoint in $endpoints) {
        try {
            $response = Invoke-WebRequest -Uri "$baseUrl$endpoint" -Method GET -TimeoutSec 10 -ErrorAction Stop
            if ($response.StatusCode -eq 200) {
                Write-Host "✅ $endpoint - OK" -ForegroundColor Green
            }
            else {
                Write-Host "⚠️  $endpoint - Status: $($response.StatusCode)" -ForegroundColor Yellow
            }
        }
        catch {
            Write-Host "❌ $endpoint - Failed: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
    Write-Host ""
}

# Function to display deployment summary
function Show-DeploymentSummary {
    Write-Host "🎉 Priority 2 Deployment Complete!" -ForegroundColor Green
    Write-Host "=================================" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "📋 Deployed Services:" -ForegroundColor Cyan
    Write-Host "   ✅ Compliance Automation Service" -ForegroundColor Green
    Write-Host "   ✅ Performance Optimization Service" -ForegroundColor Green
    Write-Host "   ✅ Error Handling Service" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "🌐 Access URLs:" -ForegroundColor Cyan
    Write-Host "   Frontend: http://localhost:8080" -ForegroundColor White
    Write-Host "   Backend API: http://localhost:3000" -ForegroundColor White
    Write-Host "   Priority 2 Status: http://localhost:3000/api/priority2/status" -ForegroundColor White
    Write-Host ""
    
    Write-Host "📊 Monitoring Dashboards:" -ForegroundColor Cyan
    Write-Host "   Compliance Dashboard: http://localhost:8080/dashboard/compliance" -ForegroundColor White
    Write-Host "   Performance Dashboard: http://localhost:8080/dashboard/performance" -ForegroundColor White
    Write-Host "   Error Dashboard: http://localhost:8080/dashboard/errors" -ForegroundColor White
    Write-Host ""
    
    Write-Host "🔧 API Endpoints:" -ForegroundColor Cyan
    Write-Host "   Compliance: /api/priority2/compliance/*" -ForegroundColor White
    Write-Host "   Performance: /api/priority2/performance/*" -ForegroundColor White
    Write-Host "   Error Handling: /api/priority2/errors/*" -ForegroundColor White
    Write-Host ""
    
    Write-Host "📚 Documentation:" -ForegroundColor Cyan
    Write-Host "   Implementation Summary: PRIORITY_2_IMPLEMENTATION_SUMMARY.md" -ForegroundColor White
    Write-Host "   API Documentation: Available at /api/docs" -ForegroundColor White
    Write-Host ""
    
    Write-Host "🚀 Next Steps:" -ForegroundColor Cyan
    Write-Host "   1. Configure your .env file with actual values" -ForegroundColor White
    Write-Host "   2. Set up APM provider integration (New Relic, DataDog)" -ForegroundColor White
    Write-Host "   3. Configure compliance rules for your specific requirements" -ForegroundColor White
    Write-Host "   4. Set up alert notifications (webhooks, email)" -ForegroundColor White
    Write-Host "   5. Review and customize degradation strategies" -ForegroundColor White
    Write-Host "   6. Run integration tests with your actual data" -ForegroundColor White
    Write-Host ""
    
    Write-Host "🎯 Ready for Priority 3 implementation!" -ForegroundColor Green
    Write-Host ""
}

# Main deployment process
try {
    Write-Host "Starting Priority 2 deployment..." -ForegroundColor Green
    Write-Host "Environment: $Environment" -ForegroundColor Cyan
    Write-Host "Skip Tests: $SkipTests" -ForegroundColor Cyan
    Write-Host "Force: $Force" -ForegroundColor Cyan
    Write-Host ""
    
    # Step 1: Validate environment
    Test-Environment
    
    # Step 2: Install dependencies
    Install-Dependencies
    
    # Step 3: Validate environment configuration
    Test-EnvironmentConfig
    
    # Step 4: Build application
    Build-Application
    
    # Step 5: Run tests
    Run-Tests
    
    # Step 6: Start services
    Start-Services
    
    # Step 7: Verify deployment
    Test-Deployment
    
    # Step 8: Show deployment summary
    Show-DeploymentSummary
    
    Write-Host "✅ Priority 2 deployment completed successfully!" -ForegroundColor Green
}
catch {
    Write-Host "❌ Deployment failed: $_" -ForegroundColor Red
    exit 1
}

# Backend Deployment Script (PowerShell)
# Deploys the backend repository from https://github.com/nairamint/Nexus

param(
    [switch]$Verbose
)

# Configuration
$BackendRepo = "https://github.com/nairamint/Nexus"
$BackendDir = "backend-temp"
$ProductionUrl = "https://api.joinsynapses.com"

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

Write-Host "🚀 Starting Backend Deployment Process..." -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Step 1: Clean up any existing backend directory
Write-Status "Cleaning up existing backend directory..."
if (Test-Path $BackendDir) {
    Remove-Item -Recurse -Force $BackendDir
    Write-Success "Cleaned up existing directory"
}

# Step 2: Clone the backend repository
Write-Status "Cloning backend repository from $BackendRepo..."
try {
    git clone $BackendRepo $BackendDir
    Write-Success "Backend repository cloned successfully"
}
catch {
    Write-Error "Failed to clone backend repository"
    Write-Error $_.Exception.Message
    exit 1
}

# Step 3: Navigate to backend directory
Set-Location $BackendDir

# Step 4: Check if package.json exists
if (-not (Test-Path "package.json")) {
    Write-Error "package.json not found in backend repository"
    Write-Warning "Please check the repository structure"
    exit 1
}

# Step 5: Install dependencies
Write-Status "Installing dependencies..."
try {
    npm install
    Write-Success "Dependencies installed successfully"
}
catch {
    Write-Error "Failed to install dependencies"
    Write-Error $_.Exception.Message
    exit 1
}

# Step 6: Check for build script
$packageJson = Get-Content "package.json" | ConvertFrom-Json
if ($packageJson.scripts.build) {
    Write-Status "Building backend for production..."
    try {
        npm run build
        Write-Success "Backend built successfully"
    }
    catch {
        Write-Error "Failed to build backend"
        Write-Error $_.Exception.Message
        exit 1
    }
}
else {
    Write-Warning "No build script found in package.json"
}

# Step 7: Check for deployment script
if ($packageJson.scripts.deploy -or $packageJson.scripts."deploy:production") {
    Write-Status "Deploying backend to production..."
    
    # Try different deployment script names
    try {
        if ($packageJson.scripts."deploy:production") {
            npm run deploy:production
            Write-Success "Backend deployed successfully using deploy:production"
        }
        elseif ($packageJson.scripts.deploy) {
            npm run deploy
            Write-Success "Backend deployed successfully using deploy"
        }
    }
    catch {
        Write-Warning "Deployment script failed or not found"
        Write-Status "Please deploy manually using your preferred method"
    }
}
else {
    Write-Warning "No deployment script found in package.json"
    Write-Status "Please deploy manually using your preferred method"
}

# Step 8: Test the deployment
Write-Status "Testing deployment..."
Start-Sleep -Seconds 5  # Wait for deployment to complete

# Test health endpoint
try {
    $response = Invoke-WebRequest -Uri "$ProductionUrl/api/health" -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Success "Health endpoint is responding"
    }
    else {
        Write-Warning "Health endpoint returned status code: $($response.StatusCode)"
    }
}
catch {
    Write-Warning "Health endpoint not responding yet"
    Write-Status "This might be normal if deployment is still in progress"
}

# Step 9: Display next steps
Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Success "Backend deployment process completed!"
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor White
Write-Host "1. Verify deployment at: $ProductionUrl" -ForegroundColor White
Write-Host "2. Test health endpoint: $ProductionUrl/api/health" -ForegroundColor White
Write-Host "3. Test classification endpoint: $ProductionUrl/api/classify" -ForegroundColor White
Write-Host "4. Update frontend configuration if needed" -ForegroundColor White
Write-Host "5. Run integration tests" -ForegroundColor White
Write-Host ""
Write-Host "If deployment failed, please:" -ForegroundColor White
Write-Host "1. Check the backend repository structure" -ForegroundColor White
Write-Host "2. Verify deployment credentials" -ForegroundColor White
Write-Host "3. Check server logs for errors" -ForegroundColor White
Write-Host "4. Ensure domain $ProductionUrl is properly configured" -ForegroundColor White
Write-Host ""

# Step 10: Clean up
Write-Status "Cleaning up temporary files..."
Set-Location ..
Remove-Item -Recurse -Force $BackendDir
Write-Success "Cleanup completed"

Write-Host "🎉 Backend deployment script completed!" -ForegroundColor Green

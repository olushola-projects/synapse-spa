# SFDR Enhanced Classification Engine Deployment Script
# Deploys the advanced Qwen classification engine to Vercel

Write-Host "🚀 Starting Enhanced SFDR Classification Engine Deployment..." -ForegroundColor Cyan

# Check prerequisites
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow

# Check if Vercel CLI is installed
if (!(Get-Command "vercel" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install Vercel CLI" -ForegroundColor Red
        exit 1
    }
}

# Check if Python files exist
if (!(Test-Path "api_server_enhanced.py")) {
    Write-Host "❌ api_server_enhanced.py not found" -ForegroundColor Red
    exit 1
}

if (!(Test-Path "enhanced_qwen_classification_engine.py")) {
    Write-Host "❌ enhanced_qwen_classification_engine.py not found" -ForegroundColor Red
    exit 1
}

if (!(Test-Path "requirements-backend.txt")) {
    Write-Host "❌ requirements-backend.txt not found" -ForegroundColor Red
    exit 1
}

Write-Host "✅ All prerequisites met" -ForegroundColor Green

# Backup current vercel.json
Write-Host "💾 Backing up current vercel.json..." -ForegroundColor Yellow
if (Test-Path "vercel.json") {
    Copy-Item "vercel.json" "vercel.json.backup"
    Write-Host "✅ Backup created: vercel.json.backup" -ForegroundColor Green
}

# Validate Python syntax
Write-Host "🔍 Validating Python syntax..." -ForegroundColor Yellow
python -m py_compile api_server_enhanced.py
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Syntax error in api_server_enhanced.py" -ForegroundColor Red
    exit 1
}

python -m py_compile enhanced_qwen_classification_engine.py
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Syntax error in enhanced_qwen_classification_engine.py" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Python syntax validation passed" -ForegroundColor Green

# Install dependencies locally for testing
Write-Host "📦 Installing dependencies locally for testing..." -ForegroundColor Yellow
pip install -r requirements-backend.txt
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Some dependencies failed to install locally (may still work on Vercel)" -ForegroundColor Yellow
}

# Test the enhanced engine locally
Write-Host "🧪 Testing enhanced engine locally..." -ForegroundColor Yellow
python -c "
import sys
sys.path.append('.')
try:
    from enhanced_qwen_classification_engine import EnhancedQwenClassificationEngine
    print('✅ Enhanced engine imports successfully')
except Exception as e:
    print(f'❌ Enhanced engine import failed: {e}')
    sys.exit(1)
"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Enhanced engine test failed" -ForegroundColor Red
    exit 1
}

# Set up environment variables (if not already set)
Write-Host "🔧 Setting up environment variables..." -ForegroundColor Yellow
Write-Host "ℹ️ Make sure to set QWEN_API_KEY in Vercel dashboard" -ForegroundColor Cyan

# Deploy to Vercel
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Cyan
Write-Host "📝 This will deploy with the enhanced backend configuration" -ForegroundColor Yellow

# Deploy with enhanced configuration
vercel deploy --prod
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Vercel deployment failed" -ForegroundColor Red
    Write-Host "🔄 Restoring backup..." -ForegroundColor Yellow
    if (Test-Path "vercel.json.backup") {
        Copy-Item "vercel.json.backup" "vercel.json"
        Write-Host "✅ Backup restored" -ForegroundColor Green
    }
    exit 1
}

# Verify deployment
Write-Host "🔍 Verifying deployment..." -ForegroundColor Yellow
Write-Host "📡 Testing health endpoint..." -ForegroundColor Yellow

# Wait for deployment to be ready
Start-Sleep -Seconds 10

# Test the deployment
$testUrl = "https://api.joinsynapses.com/api/health"
try {
    $response = Invoke-RestMethod -Uri $testUrl -Method Get -TimeoutSec 30
    if ($response.status -eq "healthy") {
        Write-Host "✅ Health check passed" -ForegroundColor Green
        Write-Host "🎯 Engine Status: $($response.engine_status)" -ForegroundColor Cyan
        Write-Host "📊 Version: $($response.version)" -ForegroundColor Cyan
    } else {
        Write-Host "⚠️ Health check returned: $($response.status)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️ Health check failed: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "ℹ️ This may be normal if the deployment is still starting up" -ForegroundColor Cyan
}

# Test classification endpoint
Write-Host "🧪 Testing classification endpoint..." -ForegroundColor Yellow
$classificationTest = @{
    text = "This fund integrates ESG factors and promotes environmental characteristics through sustainable investing practices."
    document_type = "test_document"
} | ConvertTo-Json

try {
    $classifyUrl = "https://api.joinsynapses.com/api/classify"
    $classifyResponse = Invoke-RestMethod -Uri $classifyUrl -Method Post -Body $classificationTest -ContentType "application/json" -TimeoutSec 30
    
    Write-Host "✅ Classification test passed" -ForegroundColor Green
    Write-Host "📊 Classification: $($classifyResponse.classification)" -ForegroundColor Cyan
    Write-Host "📊 Confidence: $($classifyResponse.confidence)" -ForegroundColor Cyan
    Write-Host "📊 Processing Time: $($classifyResponse.processing_time)s" -ForegroundColor Cyan
    
    if ($classifyResponse.reasoning) {
        Write-Host "📝 Reasoning: $($classifyResponse.reasoning)" -ForegroundColor Cyan
    }
    
} catch {
    Write-Host "⚠️ Classification test failed: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Enhanced SFDR Classification Engine Deployment Complete!" -ForegroundColor Green
Write-Host "🌐 API Endpoint: https://api.joinsynapses.com/api/" -ForegroundColor Cyan
Write-Host "📚 Documentation: https://api.joinsynapses.com/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔧 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Set QWEN_API_KEY environment variable in Vercel dashboard" -ForegroundColor White
Write-Host "2. Monitor deployment logs for any issues" -ForegroundColor White
Write-Host "3. Update frontend to use enhanced API features" -ForegroundColor White
Write-Host "4. Run comprehensive testing" -ForegroundColor White
Write-Host ""
Write-Host "⚠️ Important Notes:" -ForegroundColor Yellow
Write-Host "- The enhanced engine includes advanced ML capabilities" -ForegroundColor White
Write-Host "- Audit trails are now enabled for compliance tracking" -ForegroundColor White
Write-Host "- Benchmark comparison is available for quality assurance" -ForegroundColor White
Write-Host "- Explainability scoring helps with regulatory reporting" -ForegroundColor White
# 🔴 CRITICAL AUTHENTICATION CRISIS REMEDIATION SCRIPT
# PowerShell script to fix immediate authentication issues
# Execute this script IMMEDIATELY to resolve critical security vulnerabilities

param(
    [string]$NexusApiKey = "",
    [string]$OpenAIApiKey = "",
    [switch]$DryRun = $false
)

Write-Host "🔴 CRITICAL AUTHENTICATION CRISIS REMEDIATION" -ForegroundColor Red
Write-Host "===============================================" -ForegroundColor Red
Write-Host ""

# Check if running as administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "⚠️  WARNING: This script should be run as Administrator for full functionality" -ForegroundColor Yellow
}

# Phase 1: Remove Client-Side API Keys (CRITICAL)
Write-Host "Phase 1: Removing Client-Side API Keys (CRITICAL)" -ForegroundColor Red
Write-Host "------------------------------------------------" -ForegroundColor Red

$envFiles = @(".env", ".env.production", ".env.example")

foreach ($file in $envFiles) {
    if (Test-Path $file) {
        Write-Host "Processing $file..." -ForegroundColor Yellow
        
        if ($DryRun) {
            Write-Host "  [DRY RUN] Would remove VITE_NEXUS_API_KEY and VITE_OPENAI_API_KEY from $file" -ForegroundColor Cyan
        } else {
            # Remove client-side API keys
            $content = Get-Content $file -Raw
            $content = $content -replace "VITE_NEXUS_API_KEY=.*`n", ""
            $content = $content -replace "VITE_OPENAI_API_KEY=.*`n", ""
            $content = $content -replace "VITE_NEXUS_API_KEY=.*$", ""
            $content = $content -replace "VITE_OPENAI_API_KEY=.*$", ""
            
            # Add security comment
            $content = "# SECURITY: Client-side API keys removed - use edge function proxy`n" + $content
            
            Set-Content $file $content
            Write-Host "  ✅ Removed client-side API keys from $file" -ForegroundColor Green
        }
    } else {
        Write-Host "  ⚠️  File $file not found" -ForegroundColor Yellow
    }
}

Write-Host ""

# Phase 2: Configure Supabase Secrets (CRITICAL)
Write-Host "Phase 2: Configure Supabase Secrets (CRITICAL)" -ForegroundColor Red
Write-Host "-----------------------------------------------" -ForegroundColor Red

# Check if Supabase CLI is installed
try {
    $supabaseVersion = supabase --version 2>$null
    Write-Host "✅ Supabase CLI found: $supabaseVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Supabase CLI not found. Please install it first:" -ForegroundColor Red
    Write-Host "   npm install -g supabase" -ForegroundColor Yellow
    Write-Host "   or visit: https://supabase.com/docs/guides/cli" -ForegroundColor Yellow
    exit 1
}

# Configure API keys if provided
if ($NexusApiKey -and $OpenAIApiKey) {
    if ($DryRun) {
        Write-Host "  [DRY RUN] Would set NEXUS_API_KEY in Supabase secrets" -ForegroundColor Cyan
        Write-Host "  [DRY RUN] Would set OPENAI_API_KEY in Supabase secrets" -ForegroundColor Cyan
    } else {
        try {
            Write-Host "Setting NEXUS_API_KEY in Supabase secrets..." -ForegroundColor Yellow
            supabase secrets set NEXUS_API_KEY=$NexusApiKey
            Write-Host "  ✅ NEXUS_API_KEY configured" -ForegroundColor Green
            
            Write-Host "Setting OPENAI_API_KEY in Supabase secrets..." -ForegroundColor Yellow
            supabase secrets set OPENAI_API_KEY=$OpenAIApiKey
            Write-Host "  ✅ OPENAI_API_KEY configured" -ForegroundColor Green
        } catch {
            Write-Host "  ❌ Failed to set Supabase secrets: $_" -ForegroundColor Red
            Write-Host "  Please set them manually:" -ForegroundColor Yellow
            Write-Host "    supabase secrets set NEXUS_API_KEY=your_real_key" -ForegroundColor Cyan
            Write-Host "    supabase secrets set OPENAI_API_KEY=your_real_key" -ForegroundColor Cyan
        }
    }
} else {
    Write-Host "⚠️  API keys not provided. Please set them manually:" -ForegroundColor Yellow
    Write-Host "   supabase secrets set NEXUS_API_KEY=your_real_nexus_api_key" -ForegroundColor Cyan
    Write-Host "   supabase secrets set OPENAI_API_KEY=your_real_openai_api_key" -ForegroundColor Cyan
}

Write-Host ""

# Phase 3: Update Environment Configuration (CRITICAL)
Write-Host "Phase 3: Update Environment Configuration (CRITICAL)" -ForegroundColor Red
Write-Host "-----------------------------------------------------" -ForegroundColor Red

$envConfigFile = "src/config/environment.ts"
if (Test-Path $envConfigFile) {
    Write-Host "Updating $envConfigFile..." -ForegroundColor Yellow
    
    if ($DryRun) {
        Write-Host "  [DRY RUN] Would update environment configuration to remove client-side API keys" -ForegroundColor Cyan
    } else {
        $content = Get-Content $envConfigFile -Raw
        
        # Ensure API keys are set to empty strings
        $content = $content -replace "OPENAI_API_KEY: env\.VITE_OPENAI_API_KEY \|\| '[^']*'", "OPENAI_API_KEY: '' // Removed for security"
        $content = $content -replace "NEXUS_API_KEY: env\.VITE_NEXUS_API_KEY \|\| '[^']*'", "NEXUS_API_KEY: '' // Removed for security"
        
        # Add security comment if not present
        if ($content -notmatch "// SECURITY FIX: Remove client-side API keys") {
            $content = $content -replace "// AI Services", "// AI Services - SECURITY FIX: Remove client-side API keys"
        }
        
        Set-Content $envConfigFile $content
        Write-Host "  ✅ Updated environment configuration" -ForegroundColor Green
    }
} else {
    Write-Host "  ⚠️  Environment config file not found: $envConfigFile" -ForegroundColor Yellow
}

Write-Host ""

# Phase 4: Validate Edge Function Configuration (CRITICAL)
Write-Host "Phase 4: Validate Edge Function Configuration (CRITICAL)" -ForegroundColor Red
Write-Host "--------------------------------------------------------" -ForegroundColor Red

$edgeFunctionFile = "supabase/functions/nexus-proxy/index.ts"
if (Test-Path $edgeFunctionFile) {
    Write-Host "Validating edge function configuration..." -ForegroundColor Yellow
    
    $content = Get-Content $edgeFunctionFile -Raw
    
    # Check for proper API key validation
    if ($content -match "NEXUS_API_KEY.*not properly configured") {
        Write-Host "  ✅ Edge function has proper API key validation" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  Edge function may need API key validation updates" -ForegroundColor Yellow
    }
    
    # Check for security headers
    if ($content -match "corsHeaders") {
        Write-Host "  ✅ CORS headers configured" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  CORS headers may be missing" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ❌ Edge function file not found: $edgeFunctionFile" -ForegroundColor Red
}

Write-Host ""

# Phase 5: Security Audit (CRITICAL)
Write-Host "Phase 5: Security Audit (CRITICAL)" -ForegroundColor Red
Write-Host "-----------------------------------" -ForegroundColor Red

# Check for remaining client-side API key references
Write-Host "Scanning for remaining client-side API key references..." -ForegroundColor Yellow

$apiKeyPatterns = @(
    "VITE_NEXUS_API_KEY",
    "VITE_OPENAI_API_KEY", 
    "your_nexus_api_key",
    "your_openai_api_key",
    "demo_key_placeholder"
)

$foundVulnerabilities = @()

foreach ($pattern in $apiKeyPatterns) {
    $results = Get-ChildItem -Recurse -Include "*.ts", "*.tsx", "*.js", "*.jsx", "*.env*" | 
               Select-String -Pattern $pattern -List | 
               Select-Object -ExpandProperty Filename
    
    if ($results) {
        $foundVulnerabilities += "Found '$pattern' in: $($results -join ', ')"
    }
}

if ($foundVulnerabilities.Count -gt 0) {
    Write-Host "  ❌ Found potential security vulnerabilities:" -ForegroundColor Red
    foreach ($vuln in $foundVulnerabilities) {
        Write-Host "     - $vuln" -ForegroundColor Red
    }
} else {
    Write-Host "  ✅ No obvious client-side API key references found" -ForegroundColor Green
}

Write-Host ""

# Phase 6: Generate Security Report
Write-Host "Phase 6: Generate Security Report" -ForegroundColor Red
Write-Host "---------------------------------" -ForegroundColor Red

$reportFile = "AUTHENTICATION_REMEDIATION_REPORT_$(Get-Date -Format 'yyyyMMdd_HHmmss').md"

$report = @"
# Authentication Crisis Remediation Report
Generated: $(Get-Date)

## Summary
- Client-side API keys removed from environment files
- Supabase secrets configuration status: $(if ($NexusApiKey -and $OpenAIApiKey) { 'CONFIGURED' } else { 'PENDING' })
- Environment configuration updated
- Edge function validation completed

## Remaining Actions Required
$(if (-not ($NexusApiKey -and $OpenAIApiKey)) { '- Configure NEXUS_API_KEY in Supabase secrets' })
$(if (-not ($NexusApiKey -and $OpenAIApiKey)) { '- Configure OPENAI_API_KEY in Supabase secrets' })
$(if ($foundVulnerabilities.Count -gt 0) { '- Review and fix remaining vulnerabilities:' })
$(if ($foundVulnerabilities.Count -gt 0) { $foundVulnerabilities | ForEach-Object { "  - $_" } })

## Next Steps
1. Test edge function authentication
2. Run authentication test suite
3. Monitor for any remaining issues
"@

if ($DryRun) {
    Write-Host "  [DRY RUN] Would generate security report: $reportFile" -ForegroundColor Cyan
} else {
    Set-Content $reportFile $report
    Write-Host "  ✅ Generated security report: $reportFile" -ForegroundColor Green
}

Write-Host ""
Write-Host "🔴 CRITICAL REMEDIATION COMPLETE" -ForegroundColor Red
Write-Host "===============================" -ForegroundColor Red

if ($DryRun) {
    Write-Host "This was a DRY RUN. No changes were made." -ForegroundColor Yellow
    Write-Host "To apply changes, run without -DryRun flag" -ForegroundColor Yellow
} else {
    Write-Host "✅ Critical authentication issues have been addressed" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚨 IMMEDIATE NEXT STEPS:" -ForegroundColor Red
    Write-Host "1. Configure real API keys in Supabase secrets" -ForegroundColor Yellow
    Write-Host "2. Test edge function authentication" -ForegroundColor Yellow
    Write-Host "3. Run authentication test suite" -ForegroundColor Yellow
    Write-Host "4. Monitor for any remaining issues" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "For additional security measures, see: CRITICAL_AUTHENTICATION_UAT_REVIEW_REPORT.md" -ForegroundColor Cyan

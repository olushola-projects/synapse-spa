# 🔴 CRITICAL AUTHENTICATION CRISIS REMEDIATION SCRIPT
# Simplified version to fix immediate authentication issues

param(
    [switch]$DryRun = $false
)

Write-Host "🔴 CRITICAL AUTHENTICATION CRISIS REMEDIATION" -ForegroundColor Red
Write-Host "===============================================" -ForegroundColor Red
Write-Host ""

# Phase 1: Remove Client-Side API Keys (CRITICAL)
Write-Host "Phase 1: Removing Client-Side API Keys (CRITICAL)" -ForegroundColor Red
Write-Host "------------------------------------------------" -ForegroundColor Red

$envFiles = @(".env", ".env.production")

foreach ($file in $envFiles) {
    if (Test-Path $file) {
        Write-Host "Processing $file..." -ForegroundColor Yellow
        
        if ($DryRun) {
            Write-Host "  [DRY RUN] Would remove VITE_NEXUS_API_KEY and VITE_OPENAI_API_KEY from $file" -ForegroundColor Cyan
        } else {
            # Read file content
            $content = Get-Content $file -Raw
            
            # Remove API key lines
            $lines = $content -split "`n"
            $filteredLines = $lines | Where-Object { 
                $_ -notmatch "VITE_NEXUS_API_KEY" -and 
                $_ -notmatch "VITE_OPENAI_API_KEY" 
            }
            
            # Add security comment
            $newContent = "# SECURITY: Client-side API keys removed - use edge function proxy`n" + ($filteredLines -join "`n")
            
            Set-Content $file $newContent
            Write-Host "  ✅ Removed client-side API keys from $file" -ForegroundColor Green
        }
    } else {
        Write-Host "  ⚠️  File $file not found" -ForegroundColor Yellow
    }
}

Write-Host ""

# Phase 2: Update Environment Configuration (CRITICAL)
Write-Host "Phase 2: Update Environment Configuration (CRITICAL)" -ForegroundColor Red
Write-Host "-----------------------------------------------------" -ForegroundColor Red

$envConfigFile = "src/config/environment.ts"
if (Test-Path $envConfigFile) {
    Write-Host "Updating $envConfigFile..." -ForegroundColor Yellow
    
    if ($DryRun) {
        Write-Host "  [DRY RUN] Would update environment configuration to remove client-side API keys" -ForegroundColor Cyan
    } else {
        $content = Get-Content $envConfigFile -Raw
        
        # Simple replacements
        $content = $content -replace "OPENAI_API_KEY: env\.VITE_OPENAI_API_KEY \|\| '[^']*'", "OPENAI_API_KEY: '' // Removed for security"
        $content = $content -replace "NEXUS_API_KEY: env\.VITE_NEXUS_API_KEY \|\| '[^']*'", "NEXUS_API_KEY: '' // Removed for security"
        
        Set-Content $envConfigFile $content
        Write-Host "  ✅ Updated environment configuration" -ForegroundColor Green
    }
} else {
    Write-Host "  ⚠️  Environment config file not found: $envConfigFile" -ForegroundColor Yellow
}

Write-Host ""

# Phase 3: Security Audit (CRITICAL)
Write-Host "Phase 3: Security Audit (CRITICAL)" -ForegroundColor Red
Write-Host "-----------------------------------" -ForegroundColor Red

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

# Phase 4: Generate Security Report
Write-Host "Phase 4: Generate Security Report" -ForegroundColor Red
Write-Host "---------------------------------" -ForegroundColor Red

$reportFile = "AUTHENTICATION_REMEDIATION_REPORT_$(Get-Date -Format 'yyyyMMdd_HHmmss').md"

$report = @"
# Authentication Crisis Remediation Report
Generated: $(Get-Date)

## Summary
- Client-side API keys removed from environment files
- Environment configuration updated
- Security audit completed

## Remaining Actions Required
- Configure NEXUS_API_KEY in Supabase secrets
- Configure OPENAI_API_KEY in Supabase secrets
$(if ($foundVulnerabilities.Count -gt 0) { "- Review and fix remaining vulnerabilities:" })
$(if ($foundVulnerabilities.Count -gt 0) { $foundVulnerabilities | ForEach-Object { "  - $_" } })

## Next Steps
1. Test edge function authentication
2. Run authentication test suite
3. Monitor for any remaining issues

## Manual Commands Required
```bash
# Configure Supabase secrets (replace with real API keys)
supabase secrets set NEXUS_API_KEY=your_real_nexus_api_key
supabase secrets set OPENAI_API_KEY=your_real_openai_api_key
```
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

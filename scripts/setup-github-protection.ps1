# GitHub Branch Protection Setup Script
# Run this script after installing GitHub CLI (gh) and authenticating

# Check if GitHub CLI is installed
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Host "❌ GitHub CLI (gh) is not installed." -ForegroundColor Red
    Write-Host "Please install it from: https://cli.github.com/" -ForegroundColor Yellow
    Write-Host "Then run: gh auth login" -ForegroundColor Yellow
    exit 1
}

# Check if authenticated
try {
    gh auth status
} catch {
    Write-Host "❌ Not authenticated with GitHub CLI." -ForegroundColor Red
    Write-Host "Please run: gh auth login" -ForegroundColor Yellow
    exit 1
}

Write-Host "🔧 Setting up GitHub branch protection rules..." -ForegroundColor Blue

# Get repository information
$repo = gh repo view --json owner,name | ConvertFrom-Json
$owner = $repo.owner.login
$repoName = $repo.name

Write-Host "Repository: $owner/$repoName" -ForegroundColor Green

# Branch protection configuration
$protectionConfig = @{
    required_status_checks = @{
        strict = $true
        contexts = @(
            "Quality Checks / quality-checks (18.x)",
            "Quality Checks / quality-checks (20.x)",
            "CI/CD / security-scan",
            "CI/CD / code-quality",
            "CI/CD / build",
            "CI/CD / compliance-checks"
        )
    }
    enforce_admins = $true
    required_pull_request_reviews = @{
        required_approving_review_count = 2
        dismiss_stale_reviews = $true
        require_code_owner_reviews = $true
        require_last_push_approval = $true
    }
    restrictions = $null
    allow_force_pushes = $false
    allow_deletions = $false
    block_creations = $false
    required_conversation_resolution = $true
    lock_branch = $false
    allow_fork_syncing = $true
}

# Convert to JSON
$configJson = $protectionConfig | ConvertTo-Json -Depth 10

try {
    # Apply branch protection to main branch
    Write-Host "🛡️ Applying protection rules to main branch..." -ForegroundColor Blue
    
    # Use GitHub API to set branch protection
    $response = gh api -X PUT "repos/$owner/$repoName/branches/main/protection" --input - <<< $configJson
    
    Write-Host "✅ Branch protection rules applied successfully!" -ForegroundColor Green
    
    # Also protect develop branch if it exists
    $branches = gh api "repos/$owner/$repoName/branches" | ConvertFrom-Json
    $developBranch = $branches | Where-Object { $_.name -eq "develop" }
    
    if ($developBranch) {
        Write-Host "🛡️ Applying protection rules to develop branch..." -ForegroundColor Blue
        $response = gh api -X PUT "repos/$owner/$repoName/branches/develop/protection" --input - <<< $configJson
        Write-Host "✅ Develop branch protection rules applied successfully!" -ForegroundColor Green
    }
    
} catch {
    Write-Host "❌ Failed to apply branch protection rules: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "You may need to apply these manually in GitHub repository settings." -ForegroundColor Yellow
    exit 1
}

# Enable security features
Write-Host "🔒 Enabling security features..." -ForegroundColor Blue

try {
    # Enable vulnerability alerts
    gh api -X PUT "repos/$owner/$repoName/vulnerability-alerts"
    Write-Host "✅ Vulnerability alerts enabled" -ForegroundColor Green
    
    # Enable automated security fixes
    gh api -X PUT "repos/$owner/$repoName/automated-security-fixes"
    Write-Host "✅ Automated security fixes enabled" -ForegroundColor Green
    
    # Enable dependency graph
    gh api -X PATCH "repos/$owner/$repoName" -f has_vulnerability_alerts=true
    Write-Host "✅ Dependency graph enabled" -ForegroundColor Green
    
} catch {
    Write-Host "⚠️ Some security features may already be enabled or require admin permissions" -ForegroundColor Yellow
}

# Create CODEOWNERS file if it doesn't exist
$codeownersPath = ".github/CODEOWNERS"
if (-not (Test-Path $codeownersPath)) {
    Write-Host "📝 Creating CODEOWNERS file..." -ForegroundColor Blue
    
    $codeownersContent = @"
# Global code owners
* @$owner

# Security-related files
/SECURITY.md @$owner
/COMPLIANCE.md @$owner
/.github/workflows/ @$owner
/scripts/security/ @$owner

# Configuration files
*.config.js @$owner
*.config.ts @$owner
package.json @$owner
package-lock.json @$owner

# Environment and deployment
.env* @$owner
Dockerfile @$owner
docker-compose*.yml @$owner

# Documentation
/docs/ @$owner
README.md @$owner
"@
    
    $codeownersContent | Out-File -FilePath $codeownersPath -Encoding UTF8
    Write-Host "✅ CODEOWNERS file created" -ForegroundColor Green
}

Write-Host "" 
Write-Host "🎉 GitHub repository setup completed!" -ForegroundColor Green
Write-Host "" 
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Review branch protection rules in GitHub repository settings" -ForegroundColor White
Write-Host "2. Add team members to the repository" -ForegroundColor White
Write-Host "3. Configure any additional security settings as needed" -ForegroundColor White
Write-Host "4. Test the CI/CD pipeline with a test commit" -ForegroundColor White
# Fully Automated Deployment via GitHub Actions

This document describes the **fully automated deployment process** using GitHub Actions. No manual steps required!

## 🚀 What GitHub Actions Will Do Automatically

### When you push to `develop` branch:

1. ✅ Run tests and linting
2. 🔧 Install and configure AWS CDK
3. 🔍 Verify AWS credentials and certificate
4. 🏗️ Bootstrap CDK (if not already done)
5. 📝 Set up SSM parameters
6. 🔨 Build the React application
7. 🌍 Deploy to development environment
8. 🎯 Available at: `https://synapse-dev.digitalpasshub.com`

### When you push to `main` branch:

1. ✅ Run tests and linting
2. 🔧 Install and configure AWS CDK
3. 🔍 Verify AWS credentials and certificate (fails if no cert)
4. 🏗️ Bootstrap CDK (if not already done)
5. 📝 Set up SSM parameters
6. 🔨 Build the React application
7. 🚀 Deploy to production environment
8. 🎯 Available at: `https://synapse.digitalpasshub.com`

## ⚙️ Required GitHub Configuration

### Secrets (Repository Settings > Secrets and variables > Actions)

```
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_ACCOUNT_ID=your-aws-account-id
VITE_API_BASE_URL=https://aichatbe.digitalpasshub.com
```

### Variables (Repository Settings > Secrets and variables > Actions)

```
AWS_REGION=us-east-1
VITE_API_TIMEOUT=30000
```

## 🎯 Zero-Touch Deployment Process

### First Time Setup:

1. Configure GitHub secrets and variables (above)
2. Ensure `digitalpasshub.com` hosted zone exists in Route 53
3. Push to `develop` or `main` branch (SSL certificate created automatically)

### Every Subsequent Deployment:

1. Make your code changes
2. Commit and push to `develop` or `main`
3. ☕ Grab coffee while GitHub Actions does everything!

## 🔍 What Gets Automatically Verified

Before deployment, GitHub Actions checks:

- ✅ AWS credentials are valid
- ✅ SSL certificate will be created automatically
- ✅ CDK is properly bootstrapped
- ✅ All dependencies are installed
- ✅ Tests pass
- ✅ Code is properly linted

## 📋 No Manual Steps Required

The following are **automatically handled** by GitHub Actions:

- ✅ CDK bootstrap
- ✅ SSM parameter creation/updates
- ✅ Certificate lookup
- ✅ Infrastructure deployment
- ✅ Application build and deployment
- ✅ CloudFront invalidation

## 🚨 Deployment Status

### Success ✅

Your application will be available at:

- **Development**: `https://synapse-dev.digitalpasshub.com`
- **Production**: `https://synapse.digitalpasshub.com`

### Failure ❌

Common issues and automatic handling:

- **Missing Certificate**: Production fails with clear error message
- **AWS Credentials**: Deployment fails with credential error
- **CDK Bootstrap**: Automatically attempted if needed
- **SSM Parameters**: Automatically created/updated

## 📊 Monitoring Deployment

1. Go to your repository on GitHub
2. Click "Actions" tab
3. Watch the deployment progress in real-time
4. See logs for each step
5. Get notification when complete

## 🔄 Rollback Process

If you need to rollback:

1. Revert your commit: `git revert <commit-hash>`
2. Push to the branch: `git push origin main`
3. GitHub Actions automatically deploys the reverted version

## 💡 Tips for Success

1. **Test First**: Always push to `develop` before `main`
2. **Watch Logs**: Monitor GitHub Actions for any issues
3. **Certificate**: Ensure SSL certificate exists before first deployment
4. **Environment**: Development is more forgiving than production
5. **Secrets**: Double-check all GitHub secrets are set correctly

## 🎉 That's It!

Once configured, your deployment is **completely automated**. Just push code and GitHub Actions handles everything else!

### Example Workflow:

```bash
# Make changes
git add .
git commit -m "feat: add new feature"

# Deploy to development
git push origin develop

# After testing, deploy to production
git checkout main
git merge develop
git push origin main
```

**No CDK commands, no AWS CLI, no manual steps - just pure automation!** 🚀

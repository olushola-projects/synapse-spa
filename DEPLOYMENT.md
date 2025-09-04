# Synapse SPA Deployment Guide

This guide explains how to deploy the Synapse SPA using AWS CDK.

## Prerequisites

1. **AWS Account**: You need an AWS account with appropriate permissions
2. **AWS CLI**: Install and configure with your credentials
3. **Node.js**: Version 18.x or later
4. **CDK CLI**: Install globally with `npm install -g aws-cdk`

## Setup

### 1. Install Dependencies

```bash
# Install main application dependencies
npm install

# Install infrastructure dependencies
npm run infra:install
```

### 2. Configure Environment Variables

Copy the environment template:

```bash
cp env.example .env.local
```

Edit `.env.local` with your configuration:

```bash
VITE_API_BASE_URL=https://your-api.example.com
VITE_API_TIMEOUT=30000
VITE_ENVIRONMENT=development
```

### 3. Set up AWS SSM Parameters

For each environment (dev, staging, prod), create SSM parameters:

```bash
# Development
aws ssm put-parameter --name "/synapse/dev/api-base-url" --value "https://dev-api.example.com" --type "String"
aws ssm put-parameter --name "/synapse/dev/api-timeout" --value "30000" --type "String"


# Production
aws ssm put-parameter --name "/synapse/prod/api-base-url" --value "https://api.example.com" --type "String"
aws ssm put-parameter --name "/synapse/prod/api-timeout" --value "30000" --type "String"
```

### 4. Bootstrap CDK

First-time setup for each AWS account/region:

```bash
cd infrastructure
npx cdk bootstrap
```

## Deployment

### Local Development Deployment

```bash
# Deploy to development environment
npm run deploy:dev


# Deploy to production environment
npm run deploy:prod
```

### CI/CD Deployment

The repository includes GitHub Actions workflows for automated deployment:

- **Pull Request**: Runs tests and security scans
- **Development Branch**: Deploys to dev environment
- **Main Branch**: Deploys directly to production environment

#### Required GitHub Secrets

Set these secrets in your GitHub repository:

```
# AWS Credentials
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_ACCOUNT_ID

# Production AWS Credentials (separate account recommended)
AWS_ACCESS_KEY_ID_PROD
AWS_SECRET_ACCESS_KEY_PROD
AWS_ACCOUNT_ID_PROD

# Environment Variables
VITE_API_BASE_URL_DEV
VITE_API_BASE_URL_PROD
VITE_API_TIMEOUT
```

#### GitHub Variables

Set these variables in your GitHub repository:

```
AWS_REGION=us-east-1
```

## Infrastructure Components

### S3 Bucket

- Hosts static website files
- Versioning enabled
- Public access blocked
- S3 managed encryption

### CloudFront Distribution

- Global CDN for fast content delivery
- HTTPS enforcement
- Origin Access Control for S3 security
- Optimized caching policies
- SPA routing support (404 → index.html)

### SSM Parameters

- Store configuration values
- Environment-specific settings
- Deployment outputs

## Monitoring and Troubleshooting

### CloudFront Logs

Enable CloudFront logging for debugging:

```bash
aws cloudfront get-distribution --id YOUR_DISTRIBUTION_ID
```

### S3 Access Logs

Check S3 access logs for upload issues:

```bash
aws s3 ls s3://synapse-spa-{environment}-{account}/
```

### CDK Diff

Check what will change before deployment:

```bash
cd infrastructure
npm run diff
```

### Rollback

To rollback to a previous version:

```bash
# Destroy current stack
cd infrastructure
npm run destroy

# Redeploy previous version
git checkout PREVIOUS_COMMIT
npm run deploy:{environment}
```

## Security Considerations

1. **IAM Permissions**: Use least-privilege principle
2. **S3 Bucket Policy**: Only CloudFront can access
3. **HTTPS Only**: All traffic redirected to HTTPS
4. **Security Headers**: Applied via CloudFront
5. **Environment Isolation**: Separate AWS accounts for prod

## Cost Optimization

1. **CloudFront Price Class**: Uses 100 (US, Canada, Europe)
2. **S3 Storage Class**: Standard for frequently accessed files
3. **Cache Settings**: Long cache times for assets
4. **Compression**: Enabled for better performance

## Useful Commands

```bash
# Build and test locally
npm run build
npm run preview

# Infrastructure commands
npm run infra:build    # Compile TypeScript
npm run infra:synth    # Generate CloudFormation
cd infrastructure && npm run test  # Run infrastructure tests

# Cleanup
cd infrastructure && npm run destroy  # Destroy stack
```

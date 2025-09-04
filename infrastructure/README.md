# Synapse SPA Infrastructure

This CDK application deploys a Single Page Application (SPA) for Synapse using AWS CloudFront and S3.

## Architecture

- **S3 Bucket**: Hosts the static website files
- **CloudFront Distribution**: Global CDN for fast content delivery
- **SSM Parameters**: Store configuration values and outputs
- **Origin Access Control**: Secure access between CloudFront and S3

## Prerequisites

1. AWS CLI configured with appropriate credentials
2. Node.js 18.x or later
3. AWS CDK CLI installed globally: `npm install -g aws-cdk`

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Bootstrap CDK (first time only):
   ```bash
   npm run bootstrap
   ```

3. Set up SSM parameters for your environment:
   ```bash
   aws ssm put-parameter --name "/synapse/dev/api-base-url" --value "https://api.example.com" --type "String"
   aws ssm put-parameter --name "/synapse/dev/api-timeout" --value "30000" --type "String"
   ```

## Deployment

### Development Environment
```bash
npm run deploy:dev
```

### Staging Environment
```bash
npm run deploy:staging
```

### Production Environment
```bash
npm run deploy:prod
```

## Environment Variables

The following environment variables are configured via SSM parameters and injected during build:

- `VITE_API_BASE_URL`: Base URL for API calls
- `VITE_API_TIMEOUT`: API timeout in milliseconds

## Useful Commands

- `npm run build` - Compile TypeScript to JavaScript
- `npm run watch` - Watch for changes and compile
- `npm run test` - Run unit tests
- `npm run synth` - Synthesize CloudFormation template
- `npm run diff` - Compare deployed stack with current state
- `npm run destroy` - Destroy the stack

## Outputs

After deployment, the following values are available:

- **Website URL**: The CloudFront distribution URL
- **S3 Bucket Name**: The bucket hosting the files
- **Distribution ID**: CloudFront distribution identifier

These values are also stored in SSM parameters for use by other applications.

## Security

- S3 bucket is private with public access blocked
- CloudFront uses Origin Access Control for secure S3 access
- HTTPS is enforced via CloudFront
- Security headers are applied via CloudFront response headers policy

## Cost Optimization

- CloudFront uses PriceClass 100 (US, Canada, Europe)
- S3 versioning is enabled for rollback capability
- Assets are compressed for faster delivery

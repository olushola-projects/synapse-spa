#!/bin/bash

# Synapse SPA - SSM Parameter Setup Script
# This script sets up the required SSM parameters for the CDK deployment

set -e

# Configuration
API_BASE_URL="https://aichatbe.digitalpasshub.com"
API_TIMEOUT="30000"
AWS_REGION="${AWS_REGION:-us-east-1}"

echo "🚀 Setting up SSM parameters for Synapse SPA..."
echo "Region: $AWS_REGION"
echo "API Base URL: $API_BASE_URL"

# Function to create or update SSM parameter
create_parameter() {
    local name=$1
    local value=$2
    local description=$3
    
    echo "📝 Setting parameter: $name"
    aws ssm put-parameter \
        --name "$name" \
        --value "$value" \
        --type "String" \
        --description "$description" \
        --overwrite \
        --region "$AWS_REGION"
}

# Development environment parameters
echo "🔧 Setting up Development environment parameters..."
create_parameter "/synapse/dev/api-base-url" "$API_BASE_URL" "API base URL for Synapse SPA development environment"
create_parameter "/synapse/dev/api-timeout" "$API_TIMEOUT" "API timeout for Synapse SPA development environment"

# Production environment parameters
echo "🚀 Setting up Production environment parameters..."
create_parameter "/synapse/prod/api-base-url" "$API_BASE_URL" "API base URL for Synapse SPA production environment"
create_parameter "/synapse/prod/api-timeout" "$API_TIMEOUT" "API timeout for Synapse SPA production environment"

echo "✅ SSM parameters setup complete!"
echo ""
echo "📋 Summary of created parameters:"
echo "  /synapse/dev/api-base-url = $API_BASE_URL"
echo "  /synapse/dev/api-timeout = $API_TIMEOUT"
echo "  /synapse/prod/api-base-url = $API_BASE_URL"
echo "  /synapse/prod/api-timeout = $API_TIMEOUT"
echo ""
echo "🎯 Next steps:"
echo "  1. Deploy to development: npm run deploy:dev"
echo "  2. Deploy to production: npm run deploy:prod"

#!/bin/bash

# Script to find the ACM certificate for *.digitalpasshub.com

echo "🔍 Looking for ACM certificates for digitalpasshub.com..."
echo ""

# Check if AWS CLI is available
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed or not in PATH"
    echo "Please install AWS CLI and configure it with your credentials"
    exit 1
fi

# Check AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials not configured"
    echo "Please run: aws configure"
    exit 1
fi

echo "🔑 AWS Identity:"
aws sts get-caller-identity --query '[Account,Arn]' --output table

echo ""
echo "📜 Looking for certificates in us-east-1 (required for CloudFront)..."

# List all certificates
certificates=$(aws acm list-certificates --region us-east-1 --output json)

# Filter for digitalpasshub.com certificates
echo "$certificates" | jq -r '.CertificateSummaryList[] | select(.DomainName | test("digitalpasshub.com")) | "Domain: \(.DomainName)\nARN: \(.CertificateArn)\nStatus: \(.Status)\n---"'

echo ""
echo "🔍 Looking for wildcard certificates..."
echo "$certificates" | jq -r '.CertificateSummaryList[] | select(.DomainName == "*.digitalpasshub.com") | "✅ Found wildcard certificate!\nDomain: \(.DomainName)\nARN: \(.CertificateArn)\nStatus: \(.Status)"'

# Check if no certificates found
wildcard_count=$(echo "$certificates" | jq -r '[.CertificateSummaryList[] | select(.DomainName == "*.digitalpasshub.com")] | length')

if [ "$wildcard_count" -eq 0 ]; then
    echo ""
    echo "⚠️  No wildcard certificate found for *.digitalpasshub.com"
    echo "You may need to:"
    echo "1. Create a certificate in ACM for *.digitalpasshub.com"
    echo "2. Or check if the certificate exists in a different region"
    echo "3. Or modify the CDK stack to use a different certificate"
fi

echo ""
echo "💡 If you have the certificate ARN, the CDK stack will automatically use it!"

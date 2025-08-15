#!/bin/bash

# Backend Deployment Script
# Deploys the backend repository from https://github.com/nairamint/Nexus

set -e  # Exit on any error

echo "🚀 Starting Backend Deployment Process..."
echo "=========================================="

# Configuration
BACKEND_REPO="https://github.com/nairamint/Nexus"
BACKEND_DIR="backend-temp"
PRODUCTION_URL="https://api.joinsynapses.com"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Step 1: Clean up any existing backend directory
print_status "Cleaning up existing backend directory..."
if [ -d "$BACKEND_DIR" ]; then
    rm -rf "$BACKEND_DIR"
    print_success "Cleaned up existing directory"
fi

# Step 2: Clone the backend repository
print_status "Cloning backend repository from $BACKEND_REPO..."
if git clone "$BACKEND_REPO" "$BACKEND_DIR"; then
    print_success "Backend repository cloned successfully"
else
    print_error "Failed to clone backend repository"
    exit 1
fi

# Step 3: Navigate to backend directory
cd "$BACKEND_DIR"

# Step 4: Check if package.json exists
if [ ! -f "package.json" ]; then
    print_error "package.json not found in backend repository"
    print_warning "Please check the repository structure"
    exit 1
fi

# Step 5: Install dependencies
print_status "Installing dependencies..."
if npm install; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Step 6: Check for build script
if grep -q "\"build\"" package.json; then
    print_status "Building backend for production..."
    if npm run build; then
        print_success "Backend built successfully"
    else
        print_error "Failed to build backend"
        exit 1
    fi
else
    print_warning "No build script found in package.json"
fi

# Step 7: Check for deployment script
if grep -q "\"deploy\"" package.json || grep -q "\"deploy:production\"" package.json; then
    print_status "Deploying backend to production..."
    
    # Try different deployment script names
    if npm run deploy:production 2>/dev/null; then
        print_success "Backend deployed successfully using deploy:production"
    elif npm run deploy 2>/dev/null; then
        print_success "Backend deployed successfully using deploy"
    else
        print_warning "Deployment script failed or not found"
        print_status "Please deploy manually using your preferred method"
    fi
else
    print_warning "No deployment script found in package.json"
    print_status "Please deploy manually using your preferred method"
fi

# Step 8: Test the deployment
print_status "Testing deployment..."
sleep 5  # Wait for deployment to complete

# Test health endpoint
if curl -s -f "$PRODUCTION_URL/api/health" > /dev/null; then
    print_success "Health endpoint is responding"
else
    print_warning "Health endpoint not responding yet"
    print_status "This might be normal if deployment is still in progress"
fi

# Step 9: Display next steps
echo ""
echo "=========================================="
print_success "Backend deployment process completed!"
echo ""
echo "Next Steps:"
echo "1. Verify deployment at: $PRODUCTION_URL"
echo "2. Test health endpoint: $PRODUCTION_URL/api/health"
echo "3. Test classification endpoint: $PRODUCTION_URL/api/classify"
echo "4. Update frontend configuration if needed"
echo "5. Run integration tests"
echo ""
echo "If deployment failed, please:"
echo "1. Check the backend repository structure"
echo "2. Verify deployment credentials"
echo "3. Check server logs for errors"
echo "4. Ensure domain $PRODUCTION_URL is properly configured"
echo ""

# Step 10: Clean up
print_status "Cleaning up temporary files..."
cd ..
rm -rf "$BACKEND_DIR"
print_success "Cleanup completed"

echo "🎉 Backend deployment script completed!"

# Multi-stage build for production optimization
# Stage 1: Build environment
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    git \
    python3 \
    make \
    g++ \
    && rm -rf /var/cache/apk/*

# Copy package files
COPY package*.json ./
COPY yarn.lock* ./

# Install dependencies
RUN npm ci --only=production --silent

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production environment
FROM nginx:alpine AS production

# Install security updates
RUN apk update && apk upgrade && rm -rf /var/cache/apk/*

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx-default.conf /etc/nginx/conf.d/default.conf

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

# Development stage
FROM node:18-alpine AS development

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    git \
    python3 \
    make \
    g++ \
    curl \
    && rm -rf /var/cache/apk/*

# Copy package files
COPY package*.json ./
COPY yarn.lock* ./

# Install all dependencies (including dev)
RUN npm install

# Copy source code
COPY . .

# Expose development port
EXPOSE 5173

# Start development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Testing stage
FROM development AS testing

# Run tests
RUN npm run test:run
RUN npm run test:e2e
RUN npm run lint
RUN npm run type-check

# Security scanning stage
FROM builder AS security

# Install security scanning tools
RUN npm install -g audit-ci snyk

# Run security audits
RUN npm audit --audit-level moderate
RUN audit-ci --moderate

# Optional: Snyk security scan (requires SNYK_TOKEN)
# RUN snyk test

LABEL maintainer="Synapses Technical Team <tech@synapses.com>"
LABEL version="1.0.0"
LABEL description="Synapses GRC Platform - AI-powered compliance automation"
LABEL org.opencontainers.image.source="https://github.com/synapses/grc-platform"
LABEL org.opencontainers.image.documentation="https://docs.synapses-grc.com"
LABEL org.opencontainers.image.licenses="MIT"
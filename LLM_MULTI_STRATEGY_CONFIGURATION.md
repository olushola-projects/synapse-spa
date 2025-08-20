# 🤖 Multi-Strategy LLM Configuration

## Overview

This document describes the comprehensive multi-strategy LLM integration system that supports **Qwen3_235B_A22B** and **OpenAI gpt-oss-20b** models for SFDR classification and compliance analysis.

## 🚀 New LLM Models

### 1. Qwen3 235B A22B

- **Provider**: Qwen
- **Model ID**: `Qwen3_235B_A22B`
- **API Key**: `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`
- **Capabilities**: SFDR classification, risk assessment, compliance analysis
- **Max Tokens**: 8,192
- **Temperature**: 0.1
- **Cost per Token**: $0.0001

### 2. OpenAI GPT-OSS-20B

- **Provider**: OpenAI
- **Model ID**: `gpt-oss-20b`
- **API Key**: `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`
- **Capabilities**: SFDR classification, document analysis, regulatory compliance
- **Max Tokens**: 4,096
- **Temperature**: 0.2
- **Cost per Token**: $0.0002

## 🏗️ Architecture

### Strategy Types

#### 1. Primary Strategy (Qwen3)

- **Purpose**: High-performance primary SFDR classification
- **Model**: Qwen3 235B A22B
- **Fallback**: Secondary Strategy
- **Use Case**: Main classification requests

#### 2. Secondary Strategy (OpenAI)

- **Purpose**: Validation and alternative analysis
- **Model**: OpenAI GPT-OSS-20B
- **Fallback**: Hybrid Strategy
- **Use Case**: Validation and cross-checking

#### 3. Hybrid Strategy (Consensus)

- **Purpose**: Consensus-based routing between models
- **Models**: Both Qwen3 and OpenAI
- **Use Case**: High-confidence classification with consensus

## 🔧 Configuration Files

### 1. LLM Configuration Service

**File**: `src/services/llmConfigurationService.ts`

```typescript
// Key features:
- Model configuration management
- Strategy routing rules
- Priority-based model selection
- Configuration validation
- Health monitoring
```

### 2. LLM Integration Service

**File**: `src/services/llmIntegrationService.ts`

```typescript
// Key features:
- Intelligent model routing
- Consensus-based classification
- Fallback mechanisms
- Health status tracking
- Cost calculation
```

### 3. LLM Validation Service

**File**: `src/services/llmValidationService.ts`

```typescript
// Key features:
- Strategy validation
- Response quality assessment
- Performance monitoring
- Error handling
```

## 🧪 Testing

### Test Component

**File**: `src/components/testing/LLMStrategyTest.tsx`

### Test Page

**URL**: `/llm-strategy-test`

### Test Features

- ✅ Configuration validation
- ✅ Connectivity testing
- ✅ Strategy validation
- ✅ Performance monitoring
- ✅ Health status display
- ✅ Real-time progress tracking

## 🔒 Security

### API Key Management

- **Client-side**: No API keys exposed
- **Server-side**: Keys stored in Supabase Edge Function secrets
- **Proxy**: All requests routed through secure edge functions

### Edge Function Configuration

**File**: `supabase/functions/nexus-proxy/index.ts`

```typescript
// Security features:
- API key validation
- Model-specific headers
- Request logging
- Error handling
- Rate limiting
```

## 📊 Monitoring

### Health Status

- **Qwen3**: Response time, availability, error rate
- **OpenAI**: Response time, availability, error rate
- **Overall**: Combined system health

### Metrics

- Response times
- Success rates
- Cost tracking
- Model usage statistics
- Error rates

## 🚀 Usage

### Basic Classification

```typescript
import { llmIntegrationService } from '@/services/llmIntegrationService';

const response = await llmIntegrationService.classifyDocument({
  text: 'Fund classification text...',
  document_type: 'SFDR_Fund_Profile',
  strategy: 'primary-strategy',
  useConsensus: false
});
```

### Consensus Classification

```typescript
const response = await llmIntegrationService.classifyDocument({
  text: 'Fund classification text...',
  document_type: 'SFDR_Fund_Profile',
  strategy: 'hybrid-strategy',
  useConsensus: true
});
```

### Provider-Specific Classification

```typescript
const response = await llmIntegrationService.classifyDocument({
  text: 'Fund classification text...',
  document_type: 'SFDR_Fund_Profile',
  provider: 'qwen' // or 'openai'
});
```

## 🔄 Fallback Mechanisms

### Strategy Fallback

1. **Primary** → **Secondary** → **Hybrid**
2. Automatic fallback on failure
3. Error logging and monitoring

### Model Fallback

1. **Qwen3** → **OpenAI** (within strategy)
2. Performance-based routing
3. Health-based selection

## 📈 Performance Optimization

### Response Time Targets

- **Qwen3**: < 10 seconds
- **OpenAI**: < 8 seconds
- **Consensus**: < 15 seconds

### Caching Strategy

- Model responses cached
- Strategy results cached
- Configuration cached

## 🛠️ Deployment

### Environment Variables

```bash
# Supabase Secrets (Edge Functions)
NEXUS_API_KEY=your_nexus_api_key
QWEN_API_KEY=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
OPENAI_API_KEY=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
```

### Deployment Steps

1. Configure Supabase secrets
2. Deploy edge functions
3. Update environment configuration
4. Run validation tests
5. Monitor health status

## 🔍 Troubleshooting

### Common Issues

#### 1. API Key Errors

```bash
# Check Supabase secrets
supabase secrets list

# Set secrets if missing
supabase secrets set NEXUS_API_KEY=your_key
supabase secrets set QWEN_API_KEY=your_key
supabase secrets set OPENAI_API_KEY=your_key
```

#### 2. Model Not Available

- Check model configuration
- Verify API keys
- Test connectivity
- Check rate limits

#### 3. High Response Times

- Monitor model performance
- Check network connectivity
- Review model configuration
- Consider fallback strategies

### Debug Commands

```bash
# Test configuration
npm run test:llm

# Run validation
npm run validate:llm

# Check health status
npm run health:llm
```

## 📋 Validation Checklist

### Pre-Deployment

- [ ] API keys configured in Supabase
- [ ] Edge functions deployed
- [ ] Configuration validated
- [ ] Connectivity tested
- [ ] Health monitoring active

### Post-Deployment

- [ ] All strategies working
- [ ] Fallback mechanisms tested
- [ ] Performance within targets
- [ ] Error handling verified
- [ ] Monitoring alerts configured

## 🔮 Future Enhancements

### Planned Features

- **Model Fine-tuning**: Custom model training
- **Advanced Routing**: ML-based model selection
- **Cost Optimization**: Intelligent cost management
- **Performance Analytics**: Detailed performance insights
- **Auto-scaling**: Dynamic resource allocation

### Integration Opportunities

- **Additional Models**: Claude, Gemini, etc.
- **Specialized Models**: Domain-specific fine-tuning
- **Multi-modal**: Image and document processing
- **Real-time**: Streaming responses

## 📞 Support

### Documentation

- [API Documentation](./docs/api.md)
- [Configuration Guide](./docs/configuration.md)
- [Troubleshooting Guide](./docs/troubleshooting.md)

### Testing

- [Test Suite](./src/components/testing/LLMStrategyTest.tsx)
- [Validation Service](./src/services/llmValidationService.ts)
- [Health Monitoring](./src/services/llmIntegrationService.ts)

### Monitoring

- [Health Dashboard](./src/components/testing/BackendHealthDashboard.tsx)
- [API Connectivity Test](./src/components/testing/EnhancedApiConnectivityTest.tsx)
- [Real-time Monitoring](./src/components/monitoring/RealTimeMonitoringDashboard.tsx)

---

**Last Updated**: January 2025
**Version**: 2.0.0
**Status**: Production Ready ✅

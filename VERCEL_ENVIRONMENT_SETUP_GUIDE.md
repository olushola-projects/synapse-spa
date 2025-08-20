# 🔐 Vercel Environment Variables Setup Guide

## Critical Environment Variables for Enhanced SFDR Backend

### **QWEN_API_KEY Setup for Full AI Capabilities**

#### 1. **Access Vercel Dashboard**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to your project: `synapse-landing-nexus`
3. Click on **Settings** tab
4. Go to **Environment Variables** section

#### 2. **Add QWEN_API_KEY**

```bash
Variable Name: QWEN_API_KEY
Value: [Your Qwen API Key from Alibaba Cloud]
Environment: Production, Preview, Development
```

#### 3. **Additional Recommended Environment Variables**

##### **AI Configuration**

```bash
# Primary AI Model Configuration
OPENAI_API_KEY=[Your OpenAI API Key] # Fallback AI model
AI_MODEL_PRIORITY=qwen-plus,gpt-4,gpt-3.5-turbo

# SFDR-Specific Configuration
SFDR_CONFIDENCE_THRESHOLD=0.75
SFDR_ARTICLE_9_THRESHOLD=0.85
ENABLE_AUDIT_TRAILS=true
```

##### **Performance Monitoring**

```bash
# Monitoring Configuration
ENABLE_PERFORMANCE_MONITORING=true
MONITORING_WEBHOOK_URL=[Your monitoring endpoint]
LOG_LEVEL=info

# Classification Accuracy Tracking
ENABLE_CLASSIFICATION_ANALYTICS=true
BENCHMARK_MODE=production
```

##### **Security & Compliance**

```bash
# Security Headers
ENABLE_SECURITY_HEADERS=true
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Regulatory Compliance
REGULATORY_FRAMEWORK_VERSION=sfdr_2024
CITATION_REQUIREMENT=mandatory
AUDIT_RETENTION_DAYS=2555  # 7 years as per EU regulation
```

#### 4. **Deployment After Environment Setup**

After adding environment variables:

1. **Trigger New Deployment**:

   ```bash
   # Option 1: Push to main branch
   git add .
   git commit -m "feat: environment variables configured"
   git push origin main

   # Option 2: Manual redeploy in Vercel dashboard
   # Go to Deployments tab → Click "Redeploy" on latest deployment
   ```

2. **Verify Environment Variables**:
   - Check deployment logs for environment variable loading
   - Test `/api/health` endpoint for enhanced features
   - Verify AI capabilities are active

#### 5. **Testing Enhanced Features**

##### **Test API with QWEN Integration**

```bash
# Test enhanced classification endpoint
curl -X POST https://your-deployment-url.vercel.app/api/classify \
  -H "Content-Type: application/json" \
  -d '{
    "text": "This fund promotes environmental and social characteristics through ESG integration and screening.",
    "document_type": "fund_prospectus"
  }'
```

##### **Expected Enhanced Response**

```json
{
  "classification": "Article 8",
  "confidence": 0.87,
  "processing_time": 0.245,
  "reasoning": "Document promotes environmental and social characteristics...",
  "sustainability_score": 0.76,
  "key_indicators": ["ESG Integration", "Environmental Consideration"],
  "risk_factors": ["No significant risks identified"],
  "regulatory_basis": ["SFDR Article 8 - Products promoting E/S characteristics"],
  "benchmark_comparison": {
    "industry_baseline": 0.75,
    "current_confidence": 0.87,
    "performance_vs_baseline": 0.12,
    "percentile_rank": 74
  },
  "audit_trail": {
    "classification_id": "clf_1706567890123",
    "timestamp": "2025-01-29T...",
    "engine_version": "2.0.0",
    "processing_time": 0.245
  },
  "explainability_score": 0.82
}
```

## 🎯 Environment Variable Impact on Features

| Environment Variable           | Feature Enhanced        | Impact                                                   |
| ------------------------------ | ----------------------- | -------------------------------------------------------- |
| `QWEN_API_KEY`                 | AI Classification       | 🚀 **Major**: Enables advanced ML-powered classification |
| `SFDR_CONFIDENCE_THRESHOLD`    | Classification Accuracy | 📊 **High**: Fine-tunes confidence scoring               |
| `ENABLE_AUDIT_TRAILS`          | Compliance Tracking     | 📋 **High**: Enables regulatory audit trails             |
| `MONITORING_WEBHOOK_URL`       | Performance Monitoring  | 📈 **Medium**: Real-time performance tracking            |
| `REGULATORY_FRAMEWORK_VERSION` | Citation Accuracy       | 📚 **High**: Ensures up-to-date regulatory references    |

## 🔍 Verification Checklist

### ✅ **Environment Variables Set**

- [ ] `QWEN_API_KEY` configured in Vercel
- [ ] Additional AI keys added (OpenAI fallback)
- [ ] Performance monitoring enabled
- [ ] Security headers configured

### ✅ **Deployment Verification**

- [ ] New deployment triggered successfully
- [ ] No environment variable errors in logs
- [ ] `/api/health` returns enhanced status
- [ ] `/api/metrics` shows full feature set

### ✅ **Feature Testing**

- [ ] Enhanced classification responses received
- [ ] Audit trails generated correctly
- [ ] Benchmark comparisons working
- [ ] Explainability scores calculated

### ✅ **Performance Monitoring**

- [ ] Response times under 500ms
- [ ] Confidence scores in expected ranges (0.50-0.95)
- [ ] Error rates below 1%
- [ ] Regulatory citations included

## 🚨 Troubleshooting

### **Common Issues & Solutions**

#### **QWEN_API_KEY Not Working**

```bash
# Check API key format
QWEN_API_KEY should start with 'sk-' or similar format

# Verify key permissions
# Ensure key has access to qwen-plus or qwen-turbo models

# Test key directly
curl -H "Authorization: Bearer $QWEN_API_KEY" \
  https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation
```

#### **Environment Variables Not Loading**

```bash
# Check Vercel deployment logs
vercel logs --project-name=synapse-landing-nexus

# Verify variable names (case-sensitive)
# Ensure no trailing spaces in values
# Confirm environment scope (Production/Preview/Development)
```

#### **Performance Issues**

```bash
# Monitor API response times
# Check memory usage in Vercel dashboard
# Verify region setting (should be closest to users)
# Consider upgrading Vercel plan for better performance
```

## 📞 **Support & Next Steps**

### **Immediate Actions Required**

1. ✅ **Set QWEN_API_KEY** in Vercel dashboard
2. ✅ **Trigger new deployment** to activate enhanced features
3. ✅ **Test enhanced API responses** with new fields
4. ✅ **Monitor performance** for first 24 hours

### **Follow-up Tasks**

1. **Frontend Integration**: Update UI to display new response fields
2. **Performance Tuning**: Optimize confidence thresholds based on usage
3. **Analytics Setup**: Implement classification accuracy tracking
4. **Documentation**: Update API documentation with enhanced fields

---

**📚 Related Documentation:**

- [Enhanced Backend Deployment Success Report](ENHANCED_BACKEND_DEPLOYMENT_SUCCESS.md)
- [Performance Monitoring Setup Guide](PERFORMANCE_MONITORING_SETUP.md)
- [Frontend Integration Guide](FRONTEND_INTEGRATION_GUIDE.md)

---

_Last Updated: January 29, 2025_  
_Version: Enhanced Backend v2.0.0_

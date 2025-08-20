# 🔐 Vercel Environment Variables Setup

## ✅ API Keys Provided:

- **Qwen3_235B_A22B_SFDR**: `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`
- **OpenAI gpt-oss-20b**: `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`

## 🎯 Quick Setup Instructions:

### Step 1: Access Vercel Dashboard

```
https://vercel.com/aas-projects-66c93685/nexus/settings/environment-variables
```

### Step 2: Add Environment Variables

#### 🧠 Primary AI Model (Qwen)

```
Variable Name: QWEN_API_KEY
Value: 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
Environments: ✅ Production ✅ Preview ✅ Development
```

#### 🔄 Fallback AI Model (OpenAI)

```
Variable Name: OPENAI_API_KEY
Value: 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
Environments: ✅ Production ✅ Preview ✅ Development
```

#### 🎛️ Optional Configuration (Recommended)

```
Variable Name: AI_MODEL_PRIORITY
Value: qwen-plus,gpt-4,gpt-3.5-turbo
Environments: ✅ Production ✅ Preview ✅ Development

Variable Name: SFDR_CONFIDENCE_THRESHOLD
Value: 0.75
Environments: ✅ Production ✅ Preview ✅ Development

Variable Name: ENABLE_AUDIT_TRAILS
Value: true
Environments: ✅ Production ✅ Preview ✅ Development
```

### Step 3: Trigger Redeployment

1. Go to **Deployments** tab
2. Click **Redeploy** on the latest deployment
3. Wait for deployment to complete (~2-3 minutes)

### Step 4: Validate Setup

Run the validation script:

```bash
node scripts/validate-ai-integration.js
```

## 🎯 Expected Results After Setup:

### ✅ Health Check Response:

```json
{
  "status": "healthy",
  "version": "2.0.0",
  "features": [
    "Enhanced AI Classification",
    "Qwen model integration",
    "OpenAI fallback",
    "Audit trail generation",
    "Benchmark comparison"
  ]
}
```

### ✅ Metrics Response:

```json
{
  "api_keys_configured": {
    "qwen": true,
    "openai": true
  },
  "capabilities": [
    "SFDR Article 6/8/9 classification",
    "Dynamic confidence scoring",
    "Regulatory compliance validation"
  ]
}
```

### ✅ Classification Response (Enhanced):

```json
{
  "classification": "Article 8",
  "confidence": 0.87,
  "processing_time": 0.245,
  "reasoning": "Document promotes environmental and social characteristics...",
  "sustainability_score": 0.76,
  "regulatory_basis": ["SFDR Article 8 - Products promoting E/S characteristics"],
  "benchmark_comparison": {
    "industry_baseline": 0.75,
    "percentile_rank": 74
  },
  "audit_trail": {
    "classification_id": "clf_1706567890123",
    "engine_version": "2.0.0"
  },
  "explainability_score": 0.82
}
```

## 🚨 After Configuration Complete:

1. ✅ Run validation script
2. ✅ Test frontend integration
3. ✅ Verify regulatory citations are displayed
4. ✅ Monitor performance metrics

---

_Ready to unlock full AI capabilities! 🚀_

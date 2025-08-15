# 🚨 CRITICAL API KEY SETUP GUIDE

## URGENT: Configure Real API Keys in Supabase Secrets

**STATUS: CRITICAL - IMMEDIATE ACTION REQUIRED**  
**DATE: January 29, 2025**

### ✅ PHASE 1 COMPLETED: Client-Side API Key Removal

The following critical security fixes have been completed:

1. ✅ **Removed client-side API keys from `.env` file**
2. ✅ **Removed client-side API keys from `.env.production` file**
3. ✅ **Added security comments to environment files**
4. ✅ **Fixed Supabase configuration issues**

### 🚨 CRITICAL NEXT STEP: Configure Supabase Secrets

**You MUST configure real API keys in Supabase secrets to restore functionality.**

#### Step 1: Get Your Real API Keys

1. **Nexus API Key**: Get your real Nexus API key from your account
2. **OpenAI API Key**: Get your real OpenAI API key from your account

#### Step 2: Configure Supabase Secrets

Run these commands in your terminal:

```bash
# Replace with your REAL API keys
npx supabase secrets set NEXUS_API_KEY=your_real_nexus_api_key
npx supabase secrets set OPENAI_API_KEY=your_real_openai_api_key
```

#### Step 3: Verify Secrets Are Set

```bash
npx supabase secrets list
```

You should see both `NEXUS_API_KEY` and `OPENAI_API_KEY` in the list.

### 🔧 Manual Configuration (Alternative)

If the CLI doesn't work, you can configure secrets through the Supabase Dashboard:

1. Go to: https://supabase.com/dashboard/project/hnwwykttyzfvflmcswjk/settings/api
2. Navigate to "Edge Functions" section
3. Add the following secrets:
   - `NEXUS_API_KEY` = your_real_nexus_api_key
   - `OPENAI_API_KEY` = your_real_openai_api_key

### 🧪 Test Authentication After Configuration

Once you've configured the secrets, run these tests:

```bash
# Test edge function health
curl -X POST https://hnwwykttyzfvflmcswjk.supabase.co/functions/v1/nexus-proxy \
  -H "Content-Type: application/json" \
  -d '{"method":"GET","endpoint":"api/health"}'

# Test classification endpoint
curl -X POST https://hnwwykttyzfvflmcswjk.supabase.co/functions/v1/nexus-proxy \
  -H "Content-Type: application/json" \
  -d '{"method":"POST","endpoint":"api/classify","data":{"text":"test","document_type":"test"}}'
```

### 📊 Expected Results

After configuring the secrets, you should see:

- ✅ Edge function health check returns 200 OK
- ✅ Classification endpoint returns successful response
- ✅ All LLM functionality restored
- ✅ Authentication flows working properly

### 🚨 Security Status

**BEFORE (CRITICAL VULNERABILITIES):**
- ❌ Client-side API key exposure
- ❌ All API calls failing
- ❌ LLM functionality broken

**AFTER (SECURE):**
- ✅ Client-side API keys removed
- ✅ Server-side secrets configured
- ✅ All functionality restored
- ✅ Security compliance achieved

### 📞 Immediate Action Required

**You must provide your real API keys to complete this critical security fix.**

**Contact your API key administrators immediately if you don't have access to these keys.**

---

**DOCUMENT STATUS:** CRITICAL - AWAITING API KEY CONFIGURATION  
**NEXT STEP:** Configure real API keys in Supabase secrets  
**ESCALATION:** Contact API key administrators if keys are not available

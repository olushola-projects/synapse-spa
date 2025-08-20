// Nexus API Proxy Edge Function
// Securely handles API calls to external Nexus service with proper authentication

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

serve(async req => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { method, endpoint, data, userId } = await req.json();

    // Get the NEXUS API key from environment variables
    const nexusApiKey = Deno.env.get('NEXUS_API_KEY');

    // Enhanced API key validation with circuit breaker pattern
    if (
      !nexusApiKey ||
      nexusApiKey === 'demo_key_placeholder' ||
      nexusApiKey === 'your_nexus_api_key' ||
      nexusApiKey === 'placeholder'
    ) {
      console.error('🚨 CRITICAL: NEXUS_API_KEY not properly configured');

      // Log audit trail for security monitoring
      console.log(
        `🔒 API Key Authentication Failed - User: ${userId || 'anonymous'} - Endpoint: ${endpoint}`
      );

      return new Response(
        JSON.stringify({
          error: 'API authentication not configured',
          details: 'Real NEXUS_API_KEY must be configured in Supabase Edge Function Secrets',
          code: 'AUTH_KEY_MISSING',
          timestamp: new Date().toISOString(),
          severity: 'critical'
        }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Construct the full URL
    const baseUrl = 'https://api.joinsynapses.com';
    const url = `${baseUrl}/${endpoint}`;

    console.log(`🔌 Proxying request: ${method} ${url}`);

    // Prepare headers for the external API
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${nexusApiKey}`,
      'User-Agent': 'Synapse-SFDR-Navigator/1.0',
      'X-Client-Version': '1.0.0'
    };

    // Prepare the request options
    const requestOptions: RequestInit = {
      method: method || 'GET',
      headers
    };

    // Add body for POST requests
    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      requestOptions.body = JSON.stringify(data);
    }

    // Make the request to the external API with timeout and retry logic
    const startTime = Date.now();
    let response: Response;
    let attempt = 0;
    const maxRetries = 3;

    while (attempt < maxRetries) {
      try {
        // Add timeout of 30 seconds
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        response = await fetch(url, {
          ...requestOptions,
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        break;
      } catch (fetchError) {
        attempt++;
        console.error(`🔄 Retry ${attempt}/${maxRetries} for ${endpoint}:`, fetchError);

        if (attempt >= maxRetries) {
          throw fetchError;
        }

        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }

    const processingTime = Date.now() - startTime;

    // Get response data
    let responseData;
    const contentType = response.headers.get('content-type');

    try {
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }
    } catch (parseError) {
      console.error('Failed to parse response:', parseError);
      responseData = null;
    }

    // Enhanced error handling with audit logging
    if (!response.ok) {
      console.error(`❌ Nexus API Error [${response.status}]:`, responseData);

      // Log API failure for monitoring
      console.log(
        `📊 API Call Failed - Endpoint: ${endpoint} - Status: ${response.status} - Time: ${processingTime}ms`
      );

      return new Response(
        JSON.stringify({
          error: `Nexus API Error: ${response.status} ${response.statusText}`,
          details: responseData,
          status: response.status,
          timestamp: new Date().toISOString(),
          processingTime,
          endpoint
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate response quality for LLM classification endpoints
    if (endpoint.includes('classify') && responseData) {
      const confidence = responseData.confidence || 0;
      if (confidence < 0.7) {
        console.warn(`⚠️ Low confidence classification: ${confidence} for endpoint: ${endpoint}`);
        responseData._warning = 'Low confidence result - consider manual review';
      }
    }

    console.log(`✅ Nexus API Success [${response.status}]:`, endpoint, `(${processingTime}ms)`);

    // Enhanced response with metadata for monitoring
    return new Response(
      JSON.stringify({
        success: true,
        data: responseData,
        status: response.status,
        metadata: {
          processingTime,
          timestamp: new Date().toISOString(),
          endpoint,
          attempts: attempt + 1,
          apiKeyConfigured: true
        }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('💥 Nexus Proxy Error:', error);

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

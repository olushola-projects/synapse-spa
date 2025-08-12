// Nexus API Proxy Edge Function
// Securely handles API calls to external Nexus service with proper authentication

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { method, endpoint, data } = await req.json();
    
    // Get the NEXUS API key from environment variables
    const nexusApiKey = Deno.env.get('NEXUS_API_KEY');
    
    if (!nexusApiKey || nexusApiKey === 'demo_key_placeholder') {
      console.error('NEXUS_API_KEY not configured');
      return new Response(
        JSON.stringify({ 
          error: 'API authentication not configured',
          details: 'NEXUS_API_KEY secret is missing or invalid'
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
      'Authorization': `Bearer ${nexusApiKey}`,
      'User-Agent': 'Synapse-SFDR-Navigator/1.0',
      'X-Client-Version': '1.0.0'
    };

    // Prepare the request options
    const requestOptions: RequestInit = {
      method: method || 'GET',
      headers,
    };

    // Add body for POST requests
    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      requestOptions.body = JSON.stringify(data);
    }

    // Make the request to the external API
    const response = await fetch(url, requestOptions);
    
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

    if (!response.ok) {
      console.error(`❌ Nexus API Error [${response.status}]:`, responseData);
      
      return new Response(
        JSON.stringify({
          error: `Nexus API Error: ${response.status} ${response.statusText}`,
          details: responseData,
          status: response.status
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`✅ Nexus API Success [${response.status}]:`, endpoint);

    return new Response(
      JSON.stringify({
        success: true,
        data: responseData,
        status: response.status
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
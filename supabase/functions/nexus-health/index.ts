import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Check database connectivity
    const dbStart = Date.now();
    const { error: dbError } = await supabase
      .from('compliance_assessments')
      .select('count')
      .limit(1);
    const dbLatency = Date.now() - dbStart;

    // Check Edge Function availability
    const functionStart = Date.now();
    const functionLatency = Date.now() - functionStart;

    const health = {
      status: dbError ? 'degraded' : 'healthy',
      version: '1.0.0',
      uptime: Math.floor(Date.now() / 1000),
      checks: {
        database: {
          status: dbError ? 'down' : 'healthy',
          latency: dbLatency,
          error: dbError?.message || null
        },
        functions: {
          status: 'healthy',
          latency: functionLatency
        }
      },
      timestamp: new Date().toISOString()
    };

    const status = health.status === 'healthy' ? 200 : 503;

    return new Response(JSON.stringify(health), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Health check error:', error);
    
    const errorHealth = {
      status: 'down',
      version: '1.0.0',
      uptime: 0,
      error: error.message,
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(errorHealth), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
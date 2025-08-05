import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

interface ClassificationRequest {
  productName: string;
  productType: string;
  sustainabilityObjectives?: string[];
  investmentStrategy?: string;
  riskProfile?: string;
  targetArticle?: string;
  paiIndicators?: Record<string, any>;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user from JWT
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const productData: ClassificationRequest = await req.json();

    // Perform SFDR classification logic
    const classification = await performSFDRClassification(productData);

    // Save to database
    const { data: assessment, error: dbError } = await supabase
      .from('compliance_assessments')
      .insert({
        user_id: user.id,
        entity_id: `product_${Date.now()}`,
        fund_name: productData.productName,
        target_article: productData.targetArticle || classification.classification,
        assessment_data: productData,
        validation_results: classification.validation || {},
        compliance_score: Math.round(classification.complianceScore),
        status: 'completed'
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(JSON.stringify({ error: 'Failed to save assessment' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(classification), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Classification error:', error);
    return new Response(JSON.stringify({ error: 'Classification failed' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function performSFDRClassification(data: ClassificationRequest) {
  // SFDR classification logic
  let classification = 'Article 6';
  let complianceScore = 60;
  let riskLevel = 'Medium';
  const recommendations: string[] = [];

  // Determine article classification
  if (data.targetArticle) {
    classification = data.targetArticle;
  } else if (data.sustainabilityObjectives && data.sustainabilityObjectives.length > 0) {
    classification = 'Article 8';
    complianceScore = 75;
  } else if (data.investmentStrategy?.toLowerCase().includes('sustainable')) {
    classification = 'Article 9';
    complianceScore = 85;
  }

  // Risk assessment
  if (data.riskProfile === 'low') {
    riskLevel = 'Low';
    complianceScore += 5;
  } else if (data.riskProfile === 'high') {
    riskLevel = 'High';
    complianceScore -= 5;
  }

  // Generate recommendations
  if (classification === 'Article 6') {
    recommendations.push('Consider implementing ESG characteristics to qualify for Article 8');
  }
  if (classification === 'Article 8') {
    recommendations.push('Ensure clear documentation of promoted environmental/social characteristics');
    recommendations.push('Implement robust PAI consideration process');
  }
  if (classification === 'Article 9') {
    recommendations.push('Verify sustainable investment objective alignment');
    recommendations.push('Ensure minimum proportion of sustainable investments');
  }

  return {
    classification,
    complianceScore: Math.max(0, Math.min(100, complianceScore)),
    riskLevel,
    recommendations,
    timestamp: new Date().toISOString(),
    confidence: 0.85,
    reasoning: `Classification based on ${data.productType} with ${data.investmentStrategy || 'standard'} strategy`,
    validation: {
      isValid: true,
      issues: []
    }
  };
}
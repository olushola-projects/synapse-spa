import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async req => {
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
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const url = new URL(req.url);
    const filters = Object.fromEntries(url.searchParams);

    // Get user's compliance assessments for analytics
    let query = supabase.from('compliance_assessments').select('*').eq('user_id', user.id);

    // Apply filters
    if (filters.article) {
      query = query.eq('target_article', filters.article);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.since) {
      query = query.gte('created_at', filters.since);
    }

    const { data: assessments, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Generate analytics
    const analytics = generateAnalytics(assessments || []);

    return new Response(JSON.stringify(analytics), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return new Response(JSON.stringify({ error: 'Analytics generation failed' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

function generateAnalytics(assessments: any[]) {
  const total = assessments.length;
  const articleDistribution = {
    'Article 6': 0,
    'Article 8': 0,
    'Article 9': 0
  };

  let totalScore = 0;
  const riskDistribution = { Low: 0, Medium: 0, High: 0 };
  const monthlyTrends: Record<string, number> = {};

  assessments.forEach(assessment => {
    // Article distribution
    if (assessment.target_article in articleDistribution) {
      articleDistribution[assessment.target_article as keyof typeof articleDistribution]++;
    }

    // Average compliance score
    if (assessment.compliance_score) {
      totalScore += assessment.compliance_score;
    }

    // Monthly trends
    const month = new Date(assessment.created_at).toISOString().substring(0, 7);
    monthlyTrends[month] = (monthlyTrends[month] || 0) + 1;

    // Risk distribution (extract from validation_results if available)
    const riskLevel = assessment.validation_results?.riskLevel || 'Medium';
    if (riskLevel in riskDistribution) {
      riskDistribution[riskLevel as keyof typeof riskDistribution]++;
    }
  });

  return {
    summary: {
      totalAssessments: total,
      averageComplianceScore: total > 0 ? Math.round(totalScore / total) : 0,
      lastUpdated: new Date().toISOString()
    },
    distribution: {
      articles: articleDistribution,
      riskLevels: riskDistribution
    },
    trends: {
      monthly: monthlyTrends
    },
    insights: generateInsights(assessments)
  };
}

function generateInsights(assessments: any[]) {
  const insights = [];
  const total = assessments.length;

  if (total === 0) {
    return ['No assessments available for analysis'];
  }

  const avgScore = assessments.reduce((sum, a) => sum + (a.compliance_score || 0), 0) / total;

  if (avgScore >= 85) {
    insights.push('Excellent compliance performance across assessments');
  } else if (avgScore >= 70) {
    insights.push('Good compliance performance with room for improvement');
  } else {
    insights.push('Compliance scores indicate need for focused improvement');
  }

  const recentAssessments = assessments.filter(
    a => new Date(a.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );

  if (recentAssessments.length > 0) {
    insights.push(`${recentAssessments.length} assessments completed in the last 30 days`);
  }

  return insights;
}

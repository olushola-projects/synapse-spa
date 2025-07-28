import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async req => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
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

    const { assessmentId, reportType = 'full_compliance', includeCharts = true } = await req.json();

    if (!assessmentId) {
      return new Response(JSON.stringify({ error: 'Assessment ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get assessment data
    const { data: assessment, error: assessmentError } = await supabase
      .from('compliance_assessments')
      .select('*')
      .eq('id', assessmentId)
      .eq('user_id', user.id)
      .single();

    if (assessmentError || !assessment) {
      return new Response(JSON.stringify({ error: 'Assessment not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Generate report based on type
    const reportData = await generateReport(assessment, reportType, includeCharts);

    // Save report to database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days expiry

    const { data: report, error: reportError } = await supabase
      .from('compliance_reports')
      .insert({
        user_id: user.id,
        assessment_id: assessmentId,
        report_type: reportType,
        report_data: reportData,
        expires_at: expiresAt.toISOString()
      })
      .select()
      .single();

    if (reportError) {
      console.error('Report save error:', reportError);
      return new Response(JSON.stringify({ error: 'Failed to save report' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        report,
        downloadUrl: `/api/reports/${report.id}/download`,
        message: 'Report generated successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Function error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function generateReport(assessment: any, reportType: string, includeCharts: boolean) {
  const validationResults = assessment.validation_results || {};
  const assessmentData = assessment.assessment_data || {};

  const report = {
    metadata: {
      reportType,
      generatedAt: new Date().toISOString(),
      fundName: assessment.fund_name,
      entityId: assessment.entity_id,
      targetArticle: assessment.target_article,
      assessmentDate: assessment.created_at,
      reportVersion: '1.0'
    },
    executiveSummary: generateExecutiveSummary(assessment, validationResults),
    complianceOverview: generateComplianceOverview(validationResults),
    detailedFindings: generateDetailedFindings(validationResults, assessmentData),
    recommendations: generateRecommendations(validationResults),
    appendices: generateAppendices(assessment, includeCharts)
  };

  // Add report type specific sections
  if (reportType === 'pai_summary') {
    report.paiAnalysis = generatePAIAnalysis(assessmentData);
  } else if (reportType === 'taxonomy_alignment') {
    report.taxonomyAnalysis = generateTaxonomyAnalysis(assessmentData);
  } else if (reportType === 'risk_assessment') {
    report.riskAnalysis = generateRiskAnalysis(validationResults);
  }

  return report;
}

function generateExecutiveSummary(assessment: any, validationResults: any) {
  const score = assessment.compliance_score || 0;
  const status = score >= 80 ? 'Compliant' : score >= 60 ? 'Partially Compliant' : 'Non-Compliant';

  return {
    overallStatus: status,
    complianceScore: score,
    keyFindings: [
      `Fund classification: ${assessment.target_article}`,
      `Overall compliance score: ${score}%`,
      `Article compliance: ${validationResults.validationDetails?.articleCompliance ? 'Passed' : 'Failed'}`,
      `PAI consistency: ${validationResults.validationDetails?.paiConsistency ? 'Passed' : 'Failed'}`
    ],
    criticalIssues: (validationResults.issues || [])
      .filter((issue: any) => issue.severity === 'error')
      .map((issue: any) => issue.message),
    nextSteps:
      score >= 80
        ? ['Ready for regulatory submission', 'Monitor for regulatory updates']
        : ['Address critical compliance gaps', 'Revalidate after corrections']
  };
}

function generateComplianceOverview(validationResults: any) {
  const details = validationResults.validationDetails || {};

  return {
    articleCompliance: {
      status: details.articleCompliance ? 'Compliant' : 'Non-Compliant',
      description: 'Fund classification meets SFDR article requirements'
    },
    paiConsistency: {
      status: details.paiConsistency ? 'Compliant' : 'Non-Compliant',
      description: 'Principal Adverse Impact indicators properly documented'
    },
    taxonomyAlignment: {
      status: details.taxonomyAlignment ? 'Compliant' : 'Not Applicable',
      description: 'EU Taxonomy alignment calculation and disclosure'
    },
    dataQuality: {
      status: details.dataQuality ? 'Satisfactory' : 'Needs Improvement',
      description: 'Data coverage and quality assessment'
    },
    disclosureCompleteness: {
      status: details.disclosureCompleteness ? 'Complete' : 'Incomplete',
      description: 'Required disclosure statements and documentation'
    }
  };
}

function generateDetailedFindings(validationResults: any, assessmentData: any) {
  const checks = validationResults.checks || [];

  return checks.map((check: any) => ({
    category: check.category,
    status: check.passed ? 'Passed' : 'Failed',
    finding: check.message,
    severity: check.severity || 'info',
    evidence: getEvidence(check.category, assessmentData),
    recommendations: check.recommendations || []
  }));
}

function generateRecommendations(validationResults: any) {
  const recommendations = validationResults.recommendations || [];
  const issues = validationResults.issues || [];

  return {
    immediate: issues
      .filter((issue: any) => issue.severity === 'error')
      .map((issue: any) => ({
        priority: 'High',
        action: `Address: ${issue.message}`,
        timeline: 'Within 30 days',
        impact: 'Critical for compliance'
      })),
    shortTerm: recommendations.slice(0, 3).map((rec: string) => ({
      priority: 'Medium',
      action: rec,
      timeline: '1-3 months',
      impact: 'Improves compliance quality'
    })),
    longTerm: [
      {
        priority: 'Low',
        action: 'Implement automated compliance monitoring',
        timeline: '6-12 months',
        impact: 'Reduces ongoing compliance burden'
      },
      {
        priority: 'Low',
        action: 'Regular SFDR training for investment team',
        timeline: 'Ongoing',
        impact: 'Maintains compliance culture'
      }
    ]
  };
}

function generateAppendices(assessment: any, includeCharts: boolean) {
  const appendices = {
    regulatoryReferences: [
      'SFDR Regulation (EU) 2019/2088',
      'Commission Delegated Regulation (EU) 2022/1288',
      'ESMA Guidelines on SFDR Article 8 and 9',
      'EU Taxonomy Regulation (EU) 2020/852'
    ],
    glossary: {
      SFDR: 'Sustainable Finance Disclosure Regulation',
      PAI: 'Principal Adverse Impact',
      DNSH: 'Do No Significant Harm',
      'Article 6': 'Financial products that do not promote environmental or social characteristics',
      'Article 8': 'Financial products that promote environmental or social characteristics',
      'Article 9': 'Financial products with sustainable investment as their objective'
    },
    methodology:
      'This report was generated using the SFDR Navigator compliance validation engine, which applies regulatory requirements from SFDR and related delegated acts.'
  };

  if (includeCharts) {
    appendices.charts = {
      complianceScoreChart: generateComplianceChart(assessment.compliance_score || 0),
      issueDistribution: generateIssueDistributionChart(assessment.validation_results?.issues || [])
    };
  }

  return appendices;
}

function generatePAIAnalysis(assessmentData: any) {
  const paiData = assessmentData.paiIndicators || {};

  return {
    mandatoryIndicators: {
      total: 18,
      provided: (paiData.mandatoryIndicators || []).length,
      completeness: `${Math.round(((paiData.mandatoryIndicators || []).length / 18) * 100)}%`
    },
    optionalIndicators: {
      provided: (paiData.optionalIndicators || []).length,
      categories: ['Environmental', 'Social', 'Governance']
    },
    dataQuality: paiData.dataQuality || {
      coveragePercentage: 0,
      dataFrequency: 'Unknown',
      lastUpdated: 'Not provided'
    }
  };
}

function generateTaxonomyAnalysis(assessmentData: any) {
  const taxonomyData = assessmentData.taxonomyAlignment || {};

  return {
    alignmentPercentage: taxonomyData.alignmentPercentage || 0,
    eligibleActivities: taxonomyData.eligibleActivities || [],
    alignedActivities: taxonomyData.alignedActivities || [],
    screeningCriteria: {
      substantialContribution: taxonomyData.substantialContribution || false,
      doNoSignificantHarm: taxonomyData.doNoSignificantHarm || false,
      minimumSafeguards: taxonomyData.minimumSafeguards || false
    }
  };
}

function generateRiskAnalysis(validationResults: any) {
  const issues = validationResults.issues || [];

  return {
    riskLevel: issues.some((i: any) => i.severity === 'error')
      ? 'High'
      : issues.some((i: any) => i.severity === 'warning')
        ? 'Medium'
        : 'Low',
    identifiedRisks: issues.map((issue: any) => ({
      category: issue.category,
      description: issue.message,
      severity: issue.severity,
      likelihood: 'Medium',
      impact: issue.severity === 'error' ? 'High' : 'Medium'
    })),
    mitigationPlan: issues.map((issue: any) => ({
      risk: issue.message,
      mitigation: `Address ${issue.category.toLowerCase()} compliance gap`,
      owner: 'Compliance Team',
      timeline: issue.severity === 'error' ? '30 days' : '90 days'
    }))
  };
}

function getEvidence(category: string, assessmentData: any): string {
  switch (category) {
    case 'Article Classification':
      return assessmentData.investmentObjective || 'Investment objective not provided';
    case 'PAI Indicators':
      return `${(assessmentData.paiIndicators?.mandatoryIndicators || []).length} mandatory indicators provided`;
    case 'EU Taxonomy Alignment':
      return assessmentData.taxonomyAlignment
        ? `${assessmentData.taxonomyAlignment.alignmentPercentage}% alignment reported`
        : 'No taxonomy alignment data provided';
    default:
      return 'Assessment data reviewed';
  }
}

function generateComplianceChart(score: number) {
  return {
    type: 'gauge',
    data: {
      value: score,
      max: 100,
      thresholds: [
        { value: 60, color: '#ff4444', label: 'Non-Compliant' },
        { value: 80, color: '#ffaa00', label: 'Partially Compliant' },
        { value: 100, color: '#44ff44', label: 'Compliant' }
      ]
    }
  };
}

function generateIssueDistributionChart(issues: any[]) {
  const distribution = issues.reduce((acc: any, issue: any) => {
    acc[issue.severity] = (acc[issue.severity] || 0) + 1;
    return acc;
  }, {});

  return {
    type: 'pie',
    data: Object.entries(distribution).map(([severity, count]) => ({
      label: severity,
      value: count,
      color: severity === 'error' ? '#ff4444' : severity === 'warning' ? '#ffaa00' : '#4444ff'
    }))
  };
}

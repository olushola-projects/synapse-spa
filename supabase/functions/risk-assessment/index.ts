import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get user from JWT
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { assessmentId } = await req.json()

    if (!assessmentId) {
      return new Response(
        JSON.stringify({ error: 'Assessment ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get assessment data
    const { data: assessment, error: assessmentError } = await supabase
      .from('compliance_assessments')
      .select('*')
      .eq('id', assessmentId)
      .eq('user_id', user.id)
      .single()

    if (assessmentError || !assessment) {
      return new Response(
        JSON.stringify({ error: 'Assessment not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Perform comprehensive risk assessment
    const riskAssessment = await performRiskAssessment(assessment)

    // Save risk assessment to database
    const { data: riskData, error: riskError } = await supabase
      .from('risk_assessments')
      .insert({
        user_id: user.id,
        assessment_id: assessmentId,
        risk_categories: riskAssessment.categories,
        risk_score: riskAssessment.overallRiskScore,
        identified_risks: riskAssessment.identifiedRisks,
        mitigation_recommendations: riskAssessment.mitigationRecommendations
      })
      .select()
      .single()

    if (riskError) {
      console.error('Risk assessment save error:', riskError)
      return new Response(
        JSON.stringify({ error: 'Failed to save risk assessment' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        riskAssessment: riskData,
        analysis: riskAssessment,
        message: 'Risk assessment completed successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function performRiskAssessment(assessment: any) {
  const validationResults = assessment.validation_results || {}
  const assessmentData = assessment.assessment_data || {}
  const issues = validationResults.issues || []
  
  // Define risk categories
  const riskCategories = {
    regulatory: analyzeRegulatoryRisk(assessment, issues),
    operational: analyzeOperationalRisk(assessmentData),
    reputational: analyzeReputationalRisk(assessment, issues),
    financial: analyzeFinancialRisk(assessmentData),
    data: analyzeDataRisk(assessmentData)
  }

  // Calculate overall risk score (0-100, higher = more risky)
  const categoryScores = Object.values(riskCategories).map((cat: any) => cat.score)
  const overallRiskScore = Math.round(
    categoryScores.reduce((sum, score) => sum + score, 0) / categoryScores.length
  )

  // Identify top risks
  const identifiedRisks = identifyTopRisks(riskCategories, issues)

  // Generate mitigation recommendations
  const mitigationRecommendations = generateMitigationRecommendations(riskCategories, identifiedRisks)

  return {
    overallRiskScore,
    riskLevel: getRiskLevel(overallRiskScore),
    categories: riskCategories,
    identifiedRisks,
    mitigationRecommendations,
    assessmentDate: new Date().toISOString(),
    nextReviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() // 90 days
  }
}

function analyzeRegulatoryRisk(assessment: any, issues: any[]) {
  let score = 0
  const findings = []
  
  // Critical compliance failures
  const criticalIssues = issues.filter(issue => issue.severity === 'error')
  score += criticalIssues.length * 25 // Each critical issue adds 25 points
  
  if (criticalIssues.length > 0) {
    findings.push(`${criticalIssues.length} critical compliance failures identified`)
  }

  // Article classification risk
  if (assessment.target_article === 'Article9' && assessment.compliance_score < 90) {
    score += 20
    findings.push('Article 9 funds face heightened regulatory scrutiny')
  }

  // Missing PAI indicators
  const paiIssues = issues.filter(issue => issue.category === 'PAI Indicators')
  if (paiIssues.length > 0) {
    score += 15
    findings.push('PAI indicator gaps create regulatory non-compliance risk')
  }

  return {
    score: Math.min(score, 100),
    level: getRiskLevel(score),
    findings,
    category: 'Regulatory Compliance',
    description: 'Risk of regulatory penalties, enforcement actions, or compliance failures'
  }
}

function analyzeOperationalRisk(assessmentData: any) {
  let score = 0
  const findings = []

  // Data quality issues
  const dataQuality = assessmentData.dataQuality || {}
  const coveragePercentage = dataQuality.coveragePercentage || 0
  
  if (coveragePercentage < 60) {
    score += 30
    findings.push('Poor data coverage may lead to operational reporting failures')
  } else if (coveragePercentage < 80) {
    score += 15
    findings.push('Moderate data coverage requires monitoring and improvement')
  }

  // Process automation
  if (!assessmentData.automatedReporting) {
    score += 20
    findings.push('Manual reporting processes increase operational risk')
  }

  // Resource adequacy
  if (!assessmentData.dedicatedComplianceTeam) {
    score += 15
    findings.push('Lack of dedicated compliance resources increases operational burden')
  }

  return {
    score: Math.min(score, 100),
    level: getRiskLevel(score),
    findings,
    category: 'Operational',
    description: 'Risk of operational failures in compliance processes and reporting'
  }
}

function analyzeReputationalRisk(assessment: any, issues: any[]) {
  let score = 0
  const findings = []

  // Public fund with compliance issues
  if (assessment.fund_type === 'UCITS' && issues.length > 0) {
    score += 25
    findings.push('Public fund compliance issues may attract media attention')
  }

  // Article 8/9 greenwashing risk
  if (['Article8', 'Article9'].includes(assessment.target_article)) {
    const sustainabilityIssues = issues.filter(issue => 
      issue.category.includes('sustainability') || 
      issue.category.includes('PAI') ||
      issue.category.includes('Taxonomy')
    )
    
    if (sustainabilityIssues.length > 0) {
      score += 30
      findings.push('Sustainability compliance gaps create greenwashing risk')
    }
  }

  // Low compliance score
  if (assessment.compliance_score < 70) {
    score += 20
    findings.push('Poor compliance rating may damage market reputation')
  }

  return {
    score: Math.min(score, 100),
    level: getRiskLevel(score),
    findings,
    category: 'Reputational',
    description: 'Risk of reputational damage due to compliance failures or greenwashing accusations'
  }
}

function analyzeFinancialRisk(assessmentData: any) {
  let score = 0
  const findings = []

  // Potential fines and penalties
  const fundSize = assessmentData.fundSize || 0
  if (fundSize > 1000000000) { // €1B+
    score += 20
    findings.push('Large fund size increases potential financial impact of penalties')
  }

  // Remediation costs
  const complexity = assessmentData.investmentComplexity || 'medium'
  if (complexity === 'high') {
    score += 15
    findings.push('Complex investment strategies increase remediation costs')
  }

  // Market access risk
  if (assessmentData.crossBorderDistribution) {
    score += 10
    findings.push('Cross-border distribution amplifies financial impact of compliance failures')
  }

  return {
    score: Math.min(score, 100),
    level: getRiskLevel(score),
    findings,
    category: 'Financial',
    description: 'Financial impact of compliance failures, penalties, and remediation costs'
  }
}

function analyzeDataRisk(assessmentData: any) {
  let score = 0
  const findings = []

  // Data source reliability
  const dataSources = assessmentData.dataSources || {}
  if (!dataSources.primary || dataSources.primary === 'manual') {
    score += 25
    findings.push('Reliance on manual data entry increases error risk')
  }

  // Third-party data dependencies
  if (dataSources.thirdParty && dataSources.thirdParty.length > 3) {
    score += 15
    findings.push('Multiple third-party data dependencies create operational risk')
  }

  // Data governance
  if (!assessmentData.dataGovernanceFramework) {
    score += 20
    findings.push('Lack of data governance framework increases data quality risk')
  }

  return {
    score: Math.min(score, 100),
    level: getRiskLevel(score),
    findings,
    category: 'Data Quality',
    description: 'Risk related to data accuracy, completeness, and reliability'
  }
}

function identifyTopRisks(categories: any, issues: any[]) {
  const risks = []

  // Get highest scoring categories
  const sortedCategories = Object.entries(categories)
    .sort(([,a], [,b]) => (b as any).score - (a as any).score)
    .slice(0, 5)

  sortedCategories.forEach(([categoryName, categoryData]: [string, any]) => {
    risks.push({
      id: `RISK_${categoryName.toUpperCase()}_${Date.now()}`,
      category: categoryData.category,
      description: categoryData.description,
      riskLevel: categoryData.level,
      likelihood: categoryData.score > 70 ? 'High' : categoryData.score > 40 ? 'Medium' : 'Low',
      impact: categoryData.score > 60 ? 'High' : categoryData.score > 30 ? 'Medium' : 'Low',
      findings: categoryData.findings,
      priority: categoryData.score > 70 ? 'Critical' : categoryData.score > 40 ? 'High' : 'Medium'
    })
  })

  return risks
}

function generateMitigationRecommendations(categories: any, risks: any[]) {
  const recommendations = []

  // High-priority risks
  const criticalRisks = risks.filter(risk => risk.priority === 'Critical')
  criticalRisks.forEach(risk => {
    recommendations.push({
      riskId: risk.id,
      priority: 'Immediate',
      action: `Address ${risk.category.toLowerCase()} compliance gaps`,
      description: getSpecificMitigation(risk.category),
      timeline: '30 days',
      owner: 'Compliance Team',
      resources: getMitigationResources(risk.category)
    })
  })

  // Medium-priority risks
  const highRisks = risks.filter(risk => risk.priority === 'High')
  highRisks.forEach(risk => {
    recommendations.push({
      riskId: risk.id,
      priority: 'Short-term',
      action: `Improve ${risk.category.toLowerCase()} processes`,
      description: getProcessImprovement(risk.category),
      timeline: '90 days',
      owner: 'Operations Team',
      resources: getMitigationResources(risk.category)
    })
  })

  // General recommendations
  recommendations.push(
    {
      priority: 'Long-term',
      action: 'Implement continuous monitoring',
      description: 'Establish automated compliance monitoring and alerting system',
      timeline: '6 months',
      owner: 'Technology Team',
      resources: ['Compliance software', 'Data integration tools', 'Training']
    },
    {
      priority: 'Ongoing',
      action: 'Regular risk assessments',
      description: 'Conduct quarterly risk assessments and annual comprehensive reviews',
      timeline: 'Quarterly',
      owner: 'Risk Committee',
      resources: ['Risk assessment framework', 'External consultants (if needed)']
    }
  )

  return recommendations
}

function getSpecificMitigation(category: string): string {
  const mitigations: { [key: string]: string } = {
    'Regulatory Compliance': 'Review and update compliance procedures, engage regulatory counsel, implement immediate corrective actions',
    'Operational': 'Strengthen operational controls, improve data collection processes, enhance reporting procedures',
    'Reputational': 'Develop crisis communication plan, engage with stakeholders, improve transparency in sustainability reporting',
    'Financial': 'Assess financial impact, establish remediation budget, consider compliance insurance',
    'Data Quality': 'Implement data validation controls, establish data quality metrics, improve data governance'
  }
  
  return mitigations[category] || 'Implement category-specific risk controls'
}

function getProcessImprovement(category: string): string {
  const improvements: { [key: string]: string } = {
    'Regulatory Compliance': 'Establish compliance calendar, implement regular regulatory updates review, create compliance dashboard',
    'Operational': 'Automate manual processes, implement quality controls, establish backup procedures',
    'Reputational': 'Create sustainability reporting standards, implement greenwashing prevention controls',
    'Financial': 'Establish cost-benefit analysis framework, implement financial impact assessment procedures',
    'Data Quality': 'Create data quality framework, implement automated data validation, establish data lineage tracking'
  }
  
  return improvements[category] || 'Implement process improvement initiatives'
}

function getMitigationResources(category: string): string[] {
  const resources: { [key: string]: string[] } = {
    'Regulatory Compliance': ['Legal counsel', 'Compliance software', 'Regulatory updates service'],
    'Operational': ['Process automation tools', 'Staff training', 'Quality management system'],
    'Reputational': ['Communication strategy', 'ESG expertise', 'Stakeholder engagement plan'],
    'Financial': ['Financial modeling tools', 'Risk quantification software', 'Insurance coverage'],
    'Data Quality': ['Data management platform', 'Validation tools', 'Data governance framework']
  }
  
  return resources[category] || ['Expert consultation', 'Process documentation', 'Training materials']
}

function getRiskLevel(score: number): string {
  if (score >= 70) return 'High'
  if (score >= 40) return 'Medium'
  return 'Low'
}
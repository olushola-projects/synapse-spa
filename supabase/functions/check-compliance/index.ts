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

    const { 
      fundName, 
      entityId, 
      targetArticle, 
      assessmentData 
    } = await req.json()

    // Validate required fields
    if (!fundName || !entityId || !targetArticle) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: fundName, entityId, targetArticle' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Perform comprehensive SFDR compliance check
    const complianceResults = await performComplianceCheck({
      fundName,
      entityId,
      targetArticle,
      assessmentData: assessmentData || {}
    })

    // Save assessment to database
    const { data: assessment, error: dbError } = await supabase
      .from('compliance_assessments')
      .insert({
        user_id: user.id,
        fund_name: fundName,
        entity_id: entityId,
        target_article: targetArticle,
        assessment_data: assessmentData || {},
        validation_results: complianceResults,
        compliance_score: complianceResults.overallScore,
        status: 'validated'
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return new Response(
        JSON.stringify({ error: 'Failed to save compliance assessment' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        assessment,
        complianceResults,
        message: 'Compliance check completed successfully'
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

async function performComplianceCheck(data: any) {
  const { fundName, targetArticle, assessmentData } = data
  
  const results = {
    overallScore: 0,
    checks: [] as any[],
    issues: [] as any[],
    recommendations: [] as string[],
    validationDetails: {
      articleCompliance: false,
      paiConsistency: false,
      taxonomyAlignment: false,
      dataQuality: false,
      disclosureCompleteness: false
    }
  }

  let passedChecks = 0
  const totalChecks = 5

  // Article Classification Check
  const articleCheck = checkArticleClassification(targetArticle, assessmentData)
  results.checks.push(articleCheck)
  if (articleCheck.passed) passedChecks++
  results.validationDetails.articleCompliance = articleCheck.passed

  // PAI Indicators Check
  const paiCheck = checkPAIIndicators(targetArticle, assessmentData)
  results.checks.push(paiCheck)
  if (paiCheck.passed) passedChecks++
  results.validationDetails.paiConsistency = paiCheck.passed

  // Taxonomy Alignment Check
  const taxonomyCheck = checkTaxonomyAlignment(targetArticle, assessmentData)
  results.checks.push(taxonomyCheck)
  if (taxonomyCheck.passed) passedChecks++
  results.validationDetails.taxonomyAlignment = taxonomyCheck.passed

  // Data Quality Check
  const dataQualityCheck = checkDataQuality(assessmentData)
  results.checks.push(dataQualityCheck)
  if (dataQualityCheck.passed) passedChecks++
  results.validationDetails.dataQuality = dataQualityCheck.passed

  // Disclosure Completeness Check
  const disclosureCheck = checkDisclosureCompleteness(targetArticle, assessmentData)
  results.checks.push(disclosureCheck)
  if (disclosureCheck.passed) passedChecks++
  results.validationDetails.disclosureCompleteness = disclosureCheck.passed

  // Calculate overall score
  results.overallScore = Math.round((passedChecks / totalChecks) * 100)

  // Collect issues and recommendations
  results.checks.forEach(check => {
    if (!check.passed) {
      results.issues.push({
        category: check.category,
        message: check.message,
        severity: check.severity || 'warning'
      })
    }
    if (check.recommendations) {
      results.recommendations.push(...check.recommendations)
    }
  })

  // Add general recommendations based on score
  if (results.overallScore < 70) {
    results.recommendations.push('Consider reviewing SFDR requirements more thoroughly before submission')
  }
  if (results.overallScore > 90) {
    results.recommendations.push('Excellent compliance level - ready for regulatory submission')
  }

  return results
}

function checkArticleClassification(targetArticle: string, data: any) {
  const check = {
    category: 'Article Classification',
    passed: false,
    message: '',
    severity: 'error',
    recommendations: [] as string[]
  }

  if (targetArticle === 'Article8') {
    if (data.sustainabilityCharacteristics && data.sustainabilityCharacteristics.length > 0) {
      check.passed = true
      check.message = 'Article 8 classification requirements met'
    } else {
      check.message = 'Article 8 funds must specify sustainability characteristics being promoted'
      check.recommendations.push('Define specific environmental or social characteristics')
    }
  } else if (targetArticle === 'Article9') {
    if (data.investmentObjective && data.investmentObjective.toLowerCase().includes('sustainable')) {
      check.passed = true
      check.message = 'Article 9 classification requirements met'
    } else {
      check.message = 'Article 9 funds must have sustainable investment as primary objective'
      check.recommendations.push('Clarify sustainable investment objective in fund documentation')
    }
  } else {
    check.passed = true
    check.message = 'Article 6 classification is appropriate'
  }

  return check
}

function checkPAIIndicators(targetArticle: string, data: any) {
  const check = {
    category: 'PAI Indicators',
    passed: false,
    message: '',
    severity: 'warning',
    recommendations: [] as string[]
  }

  if (data.paiIndicators) {
    const mandatoryIndicators = data.paiIndicators.mandatoryIndicators || []
    const requiredCount = 18

    if (mandatoryIndicators.length >= requiredCount) {
      check.passed = true
      check.message = `All ${requiredCount} mandatory PAI indicators provided`
    } else {
      check.message = `Missing PAI indicators: ${requiredCount - mandatoryIndicators.length} remaining`
      check.recommendations.push('Complete all 18 mandatory PAI indicators')
    }
  } else {
    check.message = 'PAI indicators data not provided'
    check.recommendations.push('Provide Principal Adverse Impact indicators data')
  }

  return check
}

function checkTaxonomyAlignment(targetArticle: string, data: any) {
  const check = {
    category: 'EU Taxonomy Alignment',
    passed: false,
    message: '',
    severity: 'info',
    recommendations: [] as string[]
  }

  if (targetArticle === 'Article9') {
    if (data.taxonomyAlignment && data.taxonomyAlignment.alignmentPercentage !== undefined) {
      check.passed = true
      check.message = `Taxonomy alignment: ${data.taxonomyAlignment.alignmentPercentage}%`
    } else {
      check.message = 'EU Taxonomy alignment percentage not provided'
      check.recommendations.push('Calculate and report EU Taxonomy alignment percentage')
    }
  } else {
    check.passed = true
    check.message = 'EU Taxonomy alignment optional for this article classification'
  }

  return check
}

function checkDataQuality(data: any) {
  const check = {
    category: 'Data Quality',
    passed: false,
    message: '',
    severity: 'warning',
    recommendations: [] as string[]
  }

  const dataQuality = data.dataQuality || {}
  const coveragePercentage = dataQuality.coveragePercentage || 0

  if (coveragePercentage >= 80) {
    check.passed = true
    check.message = `Data coverage: ${coveragePercentage}% - Excellent quality`
  } else if (coveragePercentage >= 60) {
    check.message = `Data coverage: ${coveragePercentage}% - Acceptable but could be improved`
    check.recommendations.push('Improve data coverage to above 80%')
  } else {
    check.message = `Data coverage: ${coveragePercentage}% - Insufficient for reliable analysis`
    check.recommendations.push('Significantly improve data collection and coverage')
  }

  return check
}

function checkDisclosureCompleteness(targetArticle: string, data: any) {
  const check = {
    category: 'Disclosure Completeness',
    passed: false,
    message: '',
    severity: 'error',
    recommendations: [] as string[]
  }

  const requiredFields = ['investmentObjective', 'riskProfile']
  if (targetArticle !== 'Article6') {
    requiredFields.push('sustainabilityCharacteristics')
  }

  const missingFields = requiredFields.filter(field => !data[field])

  if (missingFields.length === 0) {
    check.passed = true
    check.message = 'All required disclosure fields completed'
  } else {
    check.message = `Missing required fields: ${missingFields.join(', ')}`
    check.recommendations.push(`Complete the following fields: ${missingFields.join(', ')}`)
  }

  return check
}
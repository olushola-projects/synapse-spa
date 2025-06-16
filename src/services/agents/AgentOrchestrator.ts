import { llmService } from '../nlp/LLMService';
import { ragService, RAGQuery } from '../rag/RAGService';
import { supabase } from '../supabase';

// Types for agent orchestration
export interface Agent {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  status: 'idle' | 'busy' | 'error';
  lastActivity: Date;
}

export interface WorkflowStep {
  id: string;
  name: string;
  agentId: string;
  inputs: Record<string, any>;
  outputs?: Record<string, any>;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime?: Date;
  endTime?: Date;
  error?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  status: 'created' | 'running' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
  metadata: Record<string, any>;
}

export interface AgentTask {
  id: string;
  type: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  payload: Record<string, any>;
  assignedAgent?: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  result?: any;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
}

// Specialized agents
export class SFDRComplianceAgent {
  private id = 'sfdr-compliance';
  private name = 'SFDR Compliance Agent';

  async assessSFDRCompliance(entityData: {
    entityType: 'fund' | 'portfolio' | 'product';
    sustainabilityObjective?: string;
    investments: any[];
    disclosures: any[];
  }): Promise<{
    complianceLevel: 'article6' | 'article8' | 'article9';
    requirements: string[];
    gaps: string[];
    recommendations: string[];
    confidence: number;
  }> {
    try {
      // Step 1: Analyze sustainability objective
      const objectiveAnalysis = await this.analyzeSustainabilityObjective(
        entityData.sustainabilityObjective || ''
      );

      // Step 2: Assess investment alignment
      const investmentAnalysis = await this.assessInvestmentAlignment(
        entityData.investments
      );

      // Step 3: Review disclosure completeness
      const disclosureAnalysis = await this.reviewDisclosures(
        entityData.disclosures
      );

      // Step 4: Determine SFDR classification
      const classification = await this.determineSFDRClassification({
        objective: objectiveAnalysis,
        investments: investmentAnalysis,
        disclosures: disclosureAnalysis
      });

      return classification;
    } catch (error) {
      console.error('SFDR compliance assessment failed:', error);
      throw error;
    }
  }

  private async analyzeSustainabilityObjective(objective: string): Promise<{
    hasEnvironmentalObjective: boolean;
    hasSocialObjective: boolean;
    specificity: 'vague' | 'moderate' | 'specific';
    keywords: string[];
  }> {
    const prompt = `
Analyze this sustainability objective for SFDR compliance:

"${objective}"

Determine:
1. Does it have environmental objectives?
2. Does it have social objectives?
3. How specific is the objective (vague/moderate/specific)?
4. What key sustainability keywords are present?

Return JSON:
{
  "hasEnvironmentalObjective": boolean,
  "hasSocialObjective": boolean,
  "specificity": "vague|moderate|specific",
  "keywords": ["keyword1", "keyword2"]
}
`;

    const response = await llmService.generateCompletion(prompt, {
      temperature: 0.1,
      maxTokens: 300
    });

    return JSON.parse(response.text);
  }

  private async assessInvestmentAlignment(investments: any[]): Promise<{
    sustainablePercentage: number;
    taxonomyAligned: number;
    exclusions: string[];
    riskFactors: string[];
  }> {
    // Simplified analysis - in production, this would integrate with ESG data providers
    const sustainabilityKeywords = [
      'renewable', 'clean energy', 'sustainable', 'green', 'esg',
      'carbon neutral', 'climate', 'biodiversity', 'social impact'
    ];

    const exclusionKeywords = [
      'fossil fuel', 'tobacco', 'weapons', 'gambling', 'coal',
      'oil', 'gas', 'mining'
    ];

    let sustainableCount = 0;
    const exclusions: string[] = [];
    const riskFactors: string[] = [];

    investments.forEach(investment => {
      const description = (investment.description || '').toLowerCase();
      const sector = (investment.sector || '').toLowerCase();
      
      // Check for sustainability indicators
      if (sustainabilityKeywords.some(keyword => 
        description.includes(keyword) || sector.includes(keyword)
      )) {
        sustainableCount++;
      }

      // Check for exclusions
      exclusionKeywords.forEach(keyword => {
        if (description.includes(keyword) || sector.includes(keyword)) {
          exclusions.push(`${investment.name}: ${keyword}`);
        }
      });

      // Identify risk factors
      if (investment.esgScore && investment.esgScore < 50) {
        riskFactors.push(`${investment.name}: Low ESG score (${investment.esgScore})`);
      }
    });

    return {
      sustainablePercentage: (sustainableCount / investments.length) * 100,
      taxonomyAligned: sustainableCount * 0.7, // Simplified estimation
      exclusions,
      riskFactors
    };
  }

  private async reviewDisclosures(disclosures: any[]): Promise<{
    completeness: number;
    missingElements: string[];
    qualityScore: number;
  }> {
    const requiredElements = [
      'sustainability_objective',
      'investment_strategy',
      'proportion_sustainable_investments',
      'monitoring_sustainability_indicators',
      'methodologies',
      'data_sources',
      'due_diligence',
      'engagement_policies'
    ];

    const providedElements = disclosures.map(d => d.type || d.category);
    const missingElements = requiredElements.filter(element => 
      !providedElements.includes(element)
    );

    const completeness = ((requiredElements.length - missingElements.length) / requiredElements.length) * 100;
    
    // Quality assessment based on content length and specificity
    const avgContentLength = disclosures.reduce((sum, d) => 
      sum + (d.content || '').length, 0
    ) / disclosures.length;
    
    const qualityScore = Math.min((avgContentLength / 500) * 100, 100);

    return {
      completeness,
      missingElements,
      qualityScore
    };
  }

  private async determineSFDRClassification(analysis: {
    objective: any;
    investments: any;
    disclosures: any;
  }): Promise<{
    complianceLevel: 'article6' | 'article8' | 'article9';
    requirements: string[];
    gaps: string[];
    recommendations: string[];
    confidence: number;
  }> {
    let complianceLevel: 'article6' | 'article8' | 'article9' = 'article6';
    const requirements: string[] = [];
    const gaps: string[] = [];
    const recommendations: string[] = [];

    // Article 9 criteria (sustainable investment as objective)
    if (analysis.objective.hasEnvironmentalObjective && 
        analysis.objective.specificity === 'specific' &&
        analysis.investments.sustainablePercentage > 80) {
      complianceLevel = 'article9';
      requirements.push('Minimum 80% sustainable investments');
      requirements.push('Specific environmental or social objective');
      requirements.push('Detailed sustainability indicators');
      
      if (analysis.disclosures.completeness < 90) {
        gaps.push('Disclosure completeness below 90%');
        recommendations.push('Complete all required SFDR disclosures');
      }
    }
    // Article 8 criteria (promotes environmental/social characteristics)
    else if ((analysis.objective.hasEnvironmentalObjective || analysis.objective.hasSocialObjective) &&
             analysis.investments.sustainablePercentage > 20) {
      complianceLevel = 'article8';
      requirements.push('Promote environmental or social characteristics');
      requirements.push('Minimum 20% sustainable investments');
      requirements.push('Binding elements in investment strategy');
      
      if (analysis.investments.sustainablePercentage < 50) {
        recommendations.push('Consider increasing sustainable investment proportion for Article 9 classification');
      }
    }
    // Article 6 (no sustainability claims)
    else {
      complianceLevel = 'article6';
      requirements.push('Principal adverse impact disclosures');
      requirements.push('No misleading sustainability claims');
      
      if (analysis.objective.hasEnvironmentalObjective || analysis.objective.hasSocialObjective) {
        recommendations.push('Align investment strategy with stated sustainability objectives');
        recommendations.push('Increase proportion of sustainable investments');
      }
    }

    // Common gaps and recommendations
    if (analysis.investments.exclusions.length > 0) {
      gaps.push(`Exclusion concerns: ${analysis.investments.exclusions.join(', ')}`);
      recommendations.push('Review and address investment exclusions');
    }

    if (analysis.disclosures.qualityScore < 70) {
      gaps.push('Disclosure quality below standards');
      recommendations.push('Improve disclosure detail and specificity');
    }

    // Calculate confidence based on data quality
    const confidence = Math.min(
      (analysis.disclosures.completeness + analysis.disclosures.qualityScore) / 200 + 0.3,
      0.95
    );

    return {
      complianceLevel,
      requirements,
      gaps,
      recommendations,
      confidence
    };
  }
}

export class AMLInvestigationAgent {
  private id = 'aml-investigation';
  private name = 'AML Investigation Agent';

  async investigateTransaction(transaction: {
    id: string;
    amount: number;
    currency: string;
    fromAccount: string;
    toAccount: string;
    timestamp: Date;
    description?: string;
    metadata?: Record<string, any>;
  }): Promise<{
    riskScore: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    flags: string[];
    recommendations: string[];
    requiresReview: boolean;
  }> {
    try {
      // Step 1: Amount-based risk assessment
      const amountRisk = this.assessAmountRisk(transaction.amount, transaction.currency);
      
      // Step 2: Pattern analysis
      const patternRisk = await this.analyzeTransactionPatterns(transaction);
      
      // Step 3: Entity risk assessment
      const entityRisk = await this.assessEntityRisk(transaction.fromAccount, transaction.toAccount);
      
      // Step 4: Geographic risk
      const geoRisk = await this.assessGeographicRisk(transaction);
      
      // Step 5: Combine risk factors
      const combinedRisk = this.combineRiskFactors({
        amount: amountRisk,
        pattern: patternRisk,
        entity: entityRisk,
        geographic: geoRisk
      });

      return combinedRisk;
    } catch (error) {
      console.error('AML investigation failed:', error);
      throw error;
    }
  }

  private assessAmountRisk(amount: number, currency: string): {
    score: number;
    flags: string[];
  } {
    const flags: string[] = [];
    let score = 0;

    // Convert to USD for standardized thresholds
    const usdAmount = this.convertToUSD(amount, currency);

    if (usdAmount > 10000) {
      score += 0.3;
      flags.push('Large transaction (>$10,000)');
    }

    if (usdAmount > 50000) {
      score += 0.2;
      flags.push('Very large transaction (>$50,000)');
    }

    // Round number detection
    if (amount % 1000 === 0 && amount > 5000) {
      score += 0.1;
      flags.push('Round number transaction');
    }

    // Just below reporting threshold
    if (usdAmount > 9000 && usdAmount < 10000) {
      score += 0.4;
      flags.push('Just below reporting threshold (potential structuring)');
    }

    return { score: Math.min(score, 1.0), flags };
  }

  private async analyzeTransactionPatterns(transaction: any): Promise<{
    score: number;
    flags: string[];
  }> {
    // Query recent transactions for pattern analysis
    const { data: recentTransactions } = await supabase
      .from('transactions')
      .select('*')
      .or(`from_account.eq.${transaction.fromAccount},to_account.eq.${transaction.toAccount}`)
      .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('timestamp', { ascending: false })
      .limit(50);

    const flags: string[] = [];
    let score = 0;

    if (recentTransactions && recentTransactions.length > 0) {
      // Frequency analysis
      const dailyTransactions = recentTransactions.filter(t => 
        new Date(t.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
      ).length;

      if (dailyTransactions > 10) {
        score += 0.3;
        flags.push(`High frequency: ${dailyTransactions} transactions in 24h`);
      }

      // Velocity analysis
      const totalAmount = recentTransactions.reduce((sum, t) => sum + t.amount, 0);
      if (totalAmount > 100000) {
        score += 0.2;
        flags.push('High velocity: Large cumulative amount in 30 days');
      }

      // Structuring detection
      const similarAmounts = recentTransactions.filter(t => 
        Math.abs(t.amount - transaction.amount) < transaction.amount * 0.1
      ).length;

      if (similarAmounts > 3) {
        score += 0.4;
        flags.push('Potential structuring: Multiple similar amounts');
      }
    }

    return { score: Math.min(score, 1.0), flags };
  }

  private async assessEntityRisk(fromAccount: string, toAccount: string): Promise<{
    score: number;
    flags: string[];
  }> {
    // Check entity risk profiles
    const { data: entities } = await supabase
      .from('entity_risk_profiles')
      .select('*')
      .in('account_id', [fromAccount, toAccount]);

    const flags: string[] = [];
    let score = 0;

    entities?.forEach(entity => {
      if (entity.risk_level === 'high') {
        score += 0.5;
        flags.push(`High-risk entity: ${entity.account_id}`);
      } else if (entity.risk_level === 'medium') {
        score += 0.2;
        flags.push(`Medium-risk entity: ${entity.account_id}`);
      }

      if (entity.pep_status) {
        score += 0.3;
        flags.push(`PEP (Politically Exposed Person): ${entity.account_id}`);
      }

      if (entity.sanctions_match) {
        score += 0.8;
        flags.push(`Sanctions match: ${entity.account_id}`);
      }
    });

    return { score: Math.min(score, 1.0), flags };
  }

  private async assessGeographicRisk(transaction: any): Promise<{
    score: number;
    flags: string[];
  }> {
    // Simplified geographic risk assessment
    const highRiskCountries = ['AF', 'IR', 'KP', 'SY']; // Example high-risk countries
    const mediumRiskCountries = ['PK', 'BD', 'MM']; // Example medium-risk countries

    const flags: string[] = [];
    let score = 0;

    // This would typically integrate with geographic data from account profiles
    const fromCountry = transaction.metadata?.fromCountry;
    const toCountry = transaction.metadata?.toCountry;

    if (fromCountry && highRiskCountries.includes(fromCountry)) {
      score += 0.4;
      flags.push(`High-risk origin country: ${fromCountry}`);
    }

    if (toCountry && highRiskCountries.includes(toCountry)) {
      score += 0.4;
      flags.push(`High-risk destination country: ${toCountry}`);
    }

    if (fromCountry && mediumRiskCountries.includes(fromCountry)) {
      score += 0.2;
      flags.push(`Medium-risk origin country: ${fromCountry}`);
    }

    if (toCountry && mediumRiskCountries.includes(toCountry)) {
      score += 0.2;
      flags.push(`Medium-risk destination country: ${toCountry}`);
    }

    return { score: Math.min(score, 1.0), flags };
  }

  private combineRiskFactors(risks: {
    amount: { score: number; flags: string[] };
    pattern: { score: number; flags: string[] };
    entity: { score: number; flags: string[] };
    geographic: { score: number; flags: string[] };
  }): {
    riskScore: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    flags: string[];
    recommendations: string[];
    requiresReview: boolean;
  } {
    // Weighted combination of risk factors
    const weights = {
      amount: 0.2,
      pattern: 0.3,
      entity: 0.4,
      geographic: 0.1
    };

    const riskScore = 
      risks.amount.score * weights.amount +
      risks.pattern.score * weights.pattern +
      risks.entity.score * weights.entity +
      risks.geographic.score * weights.geographic;

    const allFlags = [
      ...risks.amount.flags,
      ...risks.pattern.flags,
      ...risks.entity.flags,
      ...risks.geographic.flags
    ];

    let riskLevel: 'low' | 'medium' | 'high' | 'critical';
    let requiresReview = false;
    const recommendations: string[] = [];

    if (riskScore >= 0.8) {
      riskLevel = 'critical';
      requiresReview = true;
      recommendations.push('Immediate manual review required');
      recommendations.push('Consider filing SAR (Suspicious Activity Report)');
      recommendations.push('Enhanced due diligence on all parties');
    } else if (riskScore >= 0.6) {
      riskLevel = 'high';
      requiresReview = true;
      recommendations.push('Manual review within 24 hours');
      recommendations.push('Additional documentation required');
    } else if (riskScore >= 0.3) {
      riskLevel = 'medium';
      recommendations.push('Automated monitoring for 30 days');
      recommendations.push('Review if part of larger pattern');
    } else {
      riskLevel = 'low';
      recommendations.push('Standard monitoring sufficient');
    }

    return {
      riskScore: Math.round(riskScore * 100) / 100,
      riskLevel,
      flags: allFlags,
      recommendations,
      requiresReview
    };
  }

  private convertToUSD(amount: number, currency: string): number {
    // Simplified currency conversion - in production, use real exchange rates
    const rates: Record<string, number> = {
      'USD': 1.0,
      'EUR': 1.1,
      'GBP': 1.25,
      'JPY': 0.007,
      'CAD': 0.75,
      'AUD': 0.65
    };

    return amount * (rates[currency] || 1.0);
  }
}

export class AgentOrchestrator {
  private agents: Map<string, Agent> = new Map();
  private workflows: Map<string, Workflow> = new Map();
  private taskQueue: AgentTask[] = [];
  private sfdrAgent: SFDRComplianceAgent;
  private amlAgent: AMLInvestigationAgent;

  constructor() {
    this.sfdrAgent = new SFDRComplianceAgent();
    this.amlAgent = new AMLInvestigationAgent();
    this.initializeAgents();
  }

  private initializeAgents(): void {
    const agents: Agent[] = [
      {
        id: 'sfdr-compliance',
        name: 'SFDR Compliance Agent',
        description: 'Specialized in SFDR regulation compliance assessment',
        capabilities: ['sfdr_assessment', 'sustainability_analysis', 'disclosure_review'],
        status: 'idle',
        lastActivity: new Date()
      },
      {
        id: 'aml-investigation',
        name: 'AML Investigation Agent',
        description: 'Anti-Money Laundering transaction analysis and investigation',
        capabilities: ['transaction_analysis', 'risk_assessment', 'pattern_detection'],
        status: 'idle',
        lastActivity: new Date()
      },
      {
        id: 'regulatory-research',
        name: 'Regulatory Research Agent',
        description: 'Research and analysis of regulatory documents and updates',
        capabilities: ['document_analysis', 'regulatory_search', 'impact_assessment'],
        status: 'idle',
        lastActivity: new Date()
      },
      {
        id: 'compliance-monitor',
        name: 'Compliance Monitoring Agent',
        description: 'Continuous monitoring of compliance status and alerts',
        capabilities: ['status_monitoring', 'alert_generation', 'reporting'],
        status: 'idle',
        lastActivity: new Date()
      }
    ];

    agents.forEach(agent => this.agents.set(agent.id, agent));
  }

  /**
   * Create and execute a workflow
   */
  async executeWorkflow(
    workflowName: string,
    steps: Omit<WorkflowStep, 'id' | 'status'>[],
    metadata: Record<string, any> = {}
  ): Promise<Workflow> {
    const workflowId = `workflow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const workflow: Workflow = {
      id: workflowId,
      name: workflowName,
      description: `Automated workflow: ${workflowName}`,
      steps: steps.map((step, index) => ({
        ...step,
        id: `${workflowId}_step_${index}`,
        status: 'pending'
      })),
      status: 'created',
      createdAt: new Date(),
      metadata
    };

    this.workflows.set(workflowId, workflow);

    try {
      workflow.status = 'running';
      
      // Execute steps sequentially
      for (const step of workflow.steps) {
        await this.executeWorkflowStep(step);
      }

      workflow.status = 'completed';
      workflow.completedAt = new Date();
    } catch (error) {
      workflow.status = 'failed';
      console.error(`Workflow ${workflowId} failed:`, error);
    }

    return workflow;
  }

  /**
   * Execute a single workflow step
   */
  private async executeWorkflowStep(step: WorkflowStep): Promise<void> {
    step.status = 'running';
    step.startTime = new Date();

    try {
      const agent = this.agents.get(step.agentId);
      if (!agent) {
        throw new Error(`Agent ${step.agentId} not found`);
      }

      agent.status = 'busy';
      agent.lastActivity = new Date();

      // Route to appropriate agent method
      switch (step.agentId) {
        case 'sfdr-compliance':
          step.outputs = await this.sfdrAgent.assessSFDRCompliance(step.inputs);
          break;
        case 'aml-investigation':
          step.outputs = await this.amlAgent.investigateTransaction(step.inputs);
          break;
        case 'regulatory-research':
          step.outputs = await this.executeRegulatoryResearch(step.inputs);
          break;
        case 'compliance-monitor':
          step.outputs = await this.executeComplianceMonitoring(step.inputs);
          break;
        default:
          throw new Error(`Unknown agent: ${step.agentId}`);
      }

      step.status = 'completed';
      agent.status = 'idle';
    } catch (error) {
      step.status = 'failed';
      step.error = error instanceof Error ? error.message : 'Unknown error';
      
      const agent = this.agents.get(step.agentId);
      if (agent) {
        agent.status = 'error';
      }
      
      throw error;
    } finally {
      step.endTime = new Date();
    }
  }

  /**
   * Execute regulatory research task
   */
  private async executeRegulatoryResearch(inputs: any): Promise<any> {
    const query: RAGQuery = {
      question: inputs.question || inputs.query,
      filters: inputs.filters,
      maxResults: inputs.maxResults || 5
    };

    const result = await ragService.answerQuestion(query);
    
    return {
      answer: result.answer,
      sources: result.sources.map(source => ({
        title: source.metadata.title,
        source: source.metadata.source,
        jurisdiction: source.metadata.jurisdiction
      })),
      confidence: result.confidence,
      followUpQuestions: result.followUpQuestions
    };
  }

  /**
   * Execute compliance monitoring task
   */
  private async executeComplianceMonitoring(inputs: any): Promise<any> {
    // This would integrate with various compliance monitoring systems
    const monitoringResults = {
      status: 'active',
      alerts: [],
      metrics: {
        complianceScore: 85,
        riskLevel: 'medium',
        lastUpdate: new Date().toISOString()
      },
      recommendations: [
        'Review quarterly compliance reports',
        'Update risk assessment documentation',
        'Schedule compliance training for new staff'
      ]
    };

    return monitoringResults;
  }

  /**
   * Get workflow status
   */
  getWorkflowStatus(workflowId: string): Workflow | undefined {
    return this.workflows.get(workflowId);
  }

  /**
   * Get all agent statuses
   */
  getAgentStatuses(): Agent[] {
    return Array.from(this.agents.values());
  }

  /**
   * Get workflow execution metrics
   */
  getWorkflowMetrics(): {
    totalWorkflows: number;
    completedWorkflows: number;
    failedWorkflows: number;
    averageExecutionTime: number;
    activeAgents: number;
  } {
    const workflows = Array.from(this.workflows.values());
    const completed = workflows.filter(w => w.status === 'completed');
    const failed = workflows.filter(w => w.status === 'failed');
    
    const executionTimes = completed
      .filter(w => w.completedAt)
      .map(w => w.completedAt!.getTime() - w.createdAt.getTime());
    
    const averageExecutionTime = executionTimes.length > 0 
      ? executionTimes.reduce((sum, time) => sum + time, 0) / executionTimes.length
      : 0;

    const activeAgents = Array.from(this.agents.values())
      .filter(agent => agent.status === 'busy').length;

    return {
      totalWorkflows: workflows.length,
      completedWorkflows: completed.length,
      failedWorkflows: failed.length,
      averageExecutionTime: Math.round(averageExecutionTime / 1000), // Convert to seconds
      activeAgents
    };
  }
}

// Export singleton instance
export const agentOrchestrator = new AgentOrchestrator();
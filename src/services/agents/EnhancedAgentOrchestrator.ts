import { enhancedLLMService } from '../nlp/EnhancedLLMService';
import { enhancedRAGService } from '../rag/EnhancedRAGService';
import { supabase } from '../supabase';
import { EventEmitter } from 'events';

// Enhanced types for multi-agent orchestration
export interface Agent {
  id: string;
  name: string;
  type: 'specialist' | 'coordinator' | 'validator' | 'researcher' | 'analyst';
  capabilities: string[];
  status: 'idle' | 'busy' | 'error' | 'offline';
  metadata: {
    version: string;
    description: string;
    expertise: string[];
    maxConcurrentTasks: number;
    averageResponseTime: number;
    successRate: number;
  };
  config: {
    temperature: number;
    maxTokens: number;
    timeout: number;
    retryAttempts: number;
  };
}

export interface Task {
  id: string;
  type: 'analysis' | 'research' | 'validation' | 'synthesis' | 'monitoring';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  assignedAgentId?: string;
  parentTaskId?: string;
  dependencies: string[];
  input: {
    query: string;
    context?: string;
    parameters?: Record<string, any>;
    constraints?: {
      maxDuration: number;
      requiredQuality: number;
      complianceLevel: 'basic' | 'standard' | 'strict';
    };
  };
  output?: {
    result: any;
    confidence: number;
    sources: string[];
    reasoning: string;
    metadata: Record<string, any>;
  };
  metrics: {
    createdAt: string;
    startedAt?: string;
    completedAt?: string;
    duration?: number;
    retryCount: number;
  };
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  type: 'sequential' | 'parallel' | 'conditional' | 'loop' | 'hybrid';
  status: 'draft' | 'active' | 'paused' | 'completed' | 'failed';
  steps: WorkflowStep[];
  triggers: WorkflowTrigger[];
  variables: Record<string, any>;
  metadata: {
    version: string;
    createdBy: string;
    lastModified: string;
    executionCount: number;
    successRate: number;
  };
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'agent_task' | 'condition' | 'loop' | 'parallel' | 'webhook' | 'delay';
  agentId?: string;
  taskTemplate: Partial<Task>;
  conditions?: {
    field: string;
    operator: 'equals' | 'contains' | 'greater_than' | 'less_than';
    value: any;
  }[];
  nextSteps: string[];
  errorHandling: {
    retryCount: number;
    fallbackStepId?: string;
    escalationAgentId?: string;
  };
}

export interface WorkflowTrigger {
  id: string;
  type: 'schedule' | 'event' | 'webhook' | 'manual';
  config: {
    schedule?: string; // cron expression
    eventType?: string;
    webhookUrl?: string;
  };
  enabled: boolean;
}

export interface ExecutionContext {
  workflowId: string;
  executionId: string;
  variables: Record<string, any>;
  currentStep: string;
  history: ExecutionStep[];
  startTime: string;
  userId?: string;
}

export interface ExecutionStep {
  stepId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  startTime: string;
  endTime?: string;
  input: any;
  output?: any;
  error?: string;
  agentId?: string;
  taskId?: string;
}

export interface AgentMessage {
  id: string;
  fromAgentId: string;
  toAgentId: string;
  type: 'request' | 'response' | 'notification' | 'error';
  content: any;
  timestamp: string;
  correlationId?: string;
}

export interface CollaborationSession {
  id: string;
  name: string;
  participants: string[]; // agent IDs
  objective: string;
  status: 'active' | 'paused' | 'completed';
  messages: AgentMessage[];
  sharedContext: Record<string, any>;
  createdAt: string;
}

/**
 * Enhanced Agent Orchestrator with multi-agent collaboration
 */
export class EnhancedAgentOrchestrator extends EventEmitter {
  private agents: Map<string, Agent> = new Map();
  private tasks: Map<string, Task> = new Map();
  private workflows: Map<string, Workflow> = new Map();
  private activeExecutions: Map<string, ExecutionContext> = new Map();
  private collaborationSessions: Map<string, CollaborationSession> = new Map();
  private taskQueue: Task[] = [];
  private isProcessing = false;
  private n8nWebhookUrl?: string;

  constructor(config: { n8nWebhookUrl?: string } = {}) {
    super();
    this.n8nWebhookUrl = config.n8nWebhookUrl;
    this.initializeDefaultAgents();
    this.startTaskProcessor();
  }

  /**
   * Initialize default GRC agents
   */
  private initializeDefaultAgents(): void {
    const defaultAgents: Agent[] = [
      {
        id: 'sfdr-specialist',
        name: 'SFDR Compliance Specialist',
        type: 'specialist',
        capabilities: ['sfdr_analysis', 'esg_assessment', 'regulatory_interpretation'],
        status: 'idle',
        metadata: {
          version: '1.0.0',
          description: 'Specialized in SFDR compliance and ESG regulations',
          expertise: ['SFDR', 'ESG', 'EU Taxonomy', 'Sustainability Reporting'],
          maxConcurrentTasks: 3,
          averageResponseTime: 5000,
          successRate: 0.95
        },
        config: {
          temperature: 0.1,
          maxTokens: 2000,
          timeout: 30000,
          retryAttempts: 3
        }
      },
      {
        id: 'aml-analyst',
        name: 'AML Risk Analyst',
        type: 'analyst',
        capabilities: ['aml_screening', 'risk_assessment', 'transaction_analysis'],
        status: 'idle',
        metadata: {
          version: '1.0.0',
          description: 'Anti-Money Laundering analysis and risk assessment',
          expertise: ['AML', 'KYC', 'Transaction Monitoring', 'Risk Scoring'],
          maxConcurrentTasks: 5,
          averageResponseTime: 3000,
          successRate: 0.92
        },
        config: {
          temperature: 0.05,
          maxTokens: 1500,
          timeout: 25000,
          retryAttempts: 2
        }
      },
      {
        id: 'regulatory-researcher',
        name: 'Regulatory Research Agent',
        type: 'researcher',
        capabilities: ['regulatory_search', 'document_analysis', 'change_detection'],
        status: 'idle',
        metadata: {
          version: '1.0.0',
          description: 'Research and analysis of regulatory changes and requirements',
          expertise: ['Regulatory Research', 'Document Analysis', 'Change Management'],
          maxConcurrentTasks: 4,
          averageResponseTime: 8000,
          successRate: 0.88
        },
        config: {
          temperature: 0.2,
          maxTokens: 2500,
          timeout: 45000,
          retryAttempts: 3
        }
      },
      {
        id: 'compliance-coordinator',
        name: 'Compliance Coordination Agent',
        type: 'coordinator',
        capabilities: ['workflow_coordination', 'task_delegation', 'quality_assurance'],
        status: 'idle',
        metadata: {
          version: '1.0.0',
          description: 'Coordinates complex compliance workflows and ensures quality',
          expertise: ['Workflow Management', 'Quality Assurance', 'Task Coordination'],
          maxConcurrentTasks: 10,
          averageResponseTime: 2000,
          successRate: 0.97
        },
        config: {
          temperature: 0.1,
          maxTokens: 1000,
          timeout: 15000,
          retryAttempts: 2
        }
      },
      {
        id: 'validation-agent',
        name: 'Compliance Validator',
        type: 'validator',
        capabilities: ['result_validation', 'accuracy_checking', 'compliance_verification'],
        status: 'idle',
        metadata: {
          version: '1.0.0',
          description: 'Validates compliance analysis results and ensures accuracy',
          expertise: ['Result Validation', 'Accuracy Assessment', 'Quality Control'],
          maxConcurrentTasks: 6,
          averageResponseTime: 4000,
          successRate: 0.99
        },
        config: {
          temperature: 0.05,
          maxTokens: 1200,
          timeout: 20000,
          retryAttempts: 1
        }
      }
    ];

    defaultAgents.forEach(agent => {
      this.agents.set(agent.id, agent);
    });
  }

  /**
   * Register a new agent
   */
  async registerAgent(agent: Agent): Promise<void> {
    this.agents.set(agent.id, agent);
    await this.persistAgent(agent);
    this.emit('agentRegistered', agent);
  }

  /**
   * Create and execute a task
   */
  async executeTask(taskInput: Omit<Task, 'id' | 'status' | 'metrics'>): Promise<Task> {
    const task: Task = {
      ...taskInput,
      id: this.generateId('task'),
      status: 'pending',
      metrics: {
        createdAt: new Date().toISOString(),
        retryCount: 0
      }
    };

    this.tasks.set(task.id, task);
    this.taskQueue.push(task);
    
    await this.persistTask(task);
    this.emit('taskCreated', task);
    
    // Start processing if not already running
    if (!this.isProcessing) {
      this.processTaskQueue();
    }

    return task;
  }

  /**
   * Create and execute a workflow
   */
  async executeWorkflow(workflow: Workflow, variables: Record<string, any> = {}): Promise<string> {
    const executionId = this.generateId('execution');
    
    const context: ExecutionContext = {
      workflowId: workflow.id,
      executionId,
      variables,
      currentStep: workflow.steps[0]?.id || '',
      history: [],
      startTime: new Date().toISOString()
    };

    this.activeExecutions.set(executionId, context);
    
    // Trigger n8n workflow if configured
    if (this.n8nWebhookUrl) {
      await this.triggerN8nWorkflow(workflow, variables);
    }
    
    // Start workflow execution
    this.executeWorkflowStep(context, workflow.steps[0]);
    
    this.emit('workflowStarted', { workflowId: workflow.id, executionId });
    
    return executionId;
  }

  /**
   * Start a collaboration session between agents
   */
  async startCollaboration(objective: string, participantIds: string[]): Promise<CollaborationSession> {
    const session: CollaborationSession = {
      id: this.generateId('collab'),
      name: `Collaboration: ${objective.substring(0, 50)}`,
      participants: participantIds,
      objective,
      status: 'active',
      messages: [],
      sharedContext: {},
      createdAt: new Date().toISOString()
    };

    this.collaborationSessions.set(session.id, session);
    
    // Notify participants
    for (const agentId of participantIds) {
      await this.sendMessage({
        id: this.generateId('msg'),
        fromAgentId: 'system',
        toAgentId: agentId,
        type: 'notification',
        content: {
          type: 'collaboration_invite',
          sessionId: session.id,
          objective
        },
        timestamp: new Date().toISOString()
      });
    }

    this.emit('collaborationStarted', session);
    return session;
  }

  /**
   * Process task queue
   */
  private async processTaskQueue(): Promise<void> {
    if (this.isProcessing || this.taskQueue.length === 0) return;
    
    this.isProcessing = true;
    
    try {
      while (this.taskQueue.length > 0) {
        const task = this.taskQueue.shift()!;
        await this.processTask(task);
      }
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Process individual task
   */
  private async processTask(task: Task): Promise<void> {
    try {
      // Find suitable agent
      const agent = await this.findSuitableAgent(task);
      if (!agent) {
        throw new Error('No suitable agent found for task');
      }

      // Assign task to agent
      task.assignedAgentId = agent.id;
      task.status = 'assigned';
      task.metrics.startedAt = new Date().toISOString();
      
      await this.updateTaskStatus(task);
      this.emit('taskAssigned', { task, agent });

      // Execute task
      const result = await this.executeAgentTask(agent, task);
      
      // Update task with result
      task.output = result;
      task.status = 'completed';
      task.metrics.completedAt = new Date().toISOString();
      task.metrics.duration = Date.now() - new Date(task.metrics.startedAt!).getTime();
      
      await this.updateTaskStatus(task);
      this.emit('taskCompleted', task);
      
    } catch (error) {
      task.status = 'failed';
      task.metrics.retryCount++;
      
      // Retry if attempts remaining
      if (task.metrics.retryCount < 3) {
        task.status = 'pending';
        this.taskQueue.push(task);
      }
      
      await this.updateTaskStatus(task);
      this.emit('taskFailed', { task, error });
    }
  }

  /**
   * Find suitable agent for task
   */
  private async findSuitableAgent(task: Task): Promise<Agent | null> {
    const availableAgents = Array.from(this.agents.values())
      .filter(agent => 
        agent.status === 'idle' && 
        this.hasRequiredCapabilities(agent, task)
      )
      .sort((a, b) => {
        // Sort by success rate and response time
        const scoreA = a.metadata.successRate - (a.metadata.averageResponseTime / 10000);
        const scoreB = b.metadata.successRate - (b.metadata.averageResponseTime / 10000);
        return scoreB - scoreA;
      });

    return availableAgents[0] || null;
  }

  /**
   * Check if agent has required capabilities
   */
  private hasRequiredCapabilities(agent: Agent, task: Task): boolean {
    const requiredCapabilities = this.getRequiredCapabilities(task);
    return requiredCapabilities.every(cap => agent.capabilities.includes(cap));
  }

  /**
   * Get required capabilities for task
   */
  private getRequiredCapabilities(task: Task): string[] {
    const capabilityMap: Record<string, string[]> = {
      'analysis': ['regulatory_analysis', 'document_analysis'],
      'research': ['regulatory_search', 'document_analysis'],
      'validation': ['result_validation', 'accuracy_checking'],
      'synthesis': ['workflow_coordination', 'task_delegation'],
      'monitoring': ['change_detection', 'regulatory_search']
    };
    
    return capabilityMap[task.type] || [];
  }

  /**
   * Execute task with specific agent
   */
  private async executeAgentTask(agent: Agent, task: Task): Promise<any> {
    // Update agent status
    agent.status = 'busy';
    
    try {
      let result;
      
      switch (task.type) {
        case 'analysis':
          result = await this.executeAnalysisTask(agent, task);
          break;
        case 'research':
          result = await this.executeResearchTask(agent, task);
          break;
        case 'validation':
          result = await this.executeValidationTask(agent, task);
          break;
        case 'synthesis':
          result = await this.executeSynthesisTask(agent, task);
          break;
        case 'monitoring':
          result = await this.executeMonitoringTask(agent, task);
          break;
        default:
          throw new Error(`Unknown task type: ${task.type}`);
      }
      
      return result;
    } finally {
      agent.status = 'idle';
    }
  }

  /**
   * Execute analysis task
   */
  private async executeAnalysisTask(agent: Agent, task: Task): Promise<any> {
    const prompt = `
You are ${agent.name}, a ${agent.metadata.description}.

Task: ${task.input.query}
Context: ${task.input.context || 'None provided'}

Provide a comprehensive analysis focusing on:
1. Key regulatory requirements
2. Compliance implications
3. Risk assessment
4. Recommended actions

Analysis:`;

    const response = await enhancedLLMService.generateCompletion(prompt, {
      taskType: 'reasoning',
      complexity: 'high',
      config: {
        temperature: agent.config.temperature,
        maxTokens: agent.config.maxTokens
      }
    });

    // Get supporting documents
    const ragResponse = await enhancedRAGService.query({
      question: task.input.query,
      context: task.input.context,
      maxResults: 5,
      retrievalStrategy: 'hybrid'
    });

    return {
      result: response.text,
      confidence: ragResponse.confidence,
      sources: ragResponse.sources.map(s => s.id),
      reasoning: ragResponse.reasoning,
      metadata: {
        agentId: agent.id,
        model: response.model,
        tokensUsed: response.usage?.totalTokens || 0,
        supportingDocuments: ragResponse.sources.length
      }
    };
  }

  /**
   * Execute research task
   */
  private async executeResearchTask(agent: Agent, task: Task): Promise<any> {
    // Use RAG service for comprehensive research
    const ragResponse = await enhancedRAGService.query({
      question: task.input.query,
      context: task.input.context,
      maxResults: 10,
      retrievalStrategy: 'hierarchical',
      filters: task.input.parameters?.filters
    });

    const synthesisPrompt = `
You are ${agent.name}. Synthesize the following research findings:

Query: ${task.input.query}
Findings: ${ragResponse.answer}

Provide:
1. Executive summary
2. Key findings
3. Regulatory implications
4. Recommendations

Research Summary:`;

    const synthesis = await enhancedLLMService.generateCompletion(synthesisPrompt, {
      taskType: 'reasoning',
      complexity: 'high',
      config: {
        temperature: agent.config.temperature,
        maxTokens: agent.config.maxTokens
      }
    });

    return {
      result: synthesis.text,
      confidence: ragResponse.confidence,
      sources: ragResponse.sources.map(s => s.id),
      reasoning: 'Comprehensive research using RAG and synthesis',
      metadata: {
        agentId: agent.id,
        documentsAnalyzed: ragResponse.sources.length,
        retrievalMetrics: ragResponse.retrievalMetrics
      }
    };
  }

  /**
   * Execute validation task
   */
  private async executeValidationTask(agent: Agent, task: Task): Promise<any> {
    const validationPrompt = `
You are ${agent.name}, responsible for validating compliance analysis results.

Original Query: ${task.input.query}
Result to Validate: ${task.input.parameters?.resultToValidate}
Sources: ${task.input.parameters?.sources?.join(', ') || 'None'}

Validate this result by checking:
1. Accuracy of regulatory interpretation
2. Completeness of analysis
3. Source reliability
4. Logical consistency

Provide validation score (0-1) and detailed feedback:

Validation:`;

    const response = await enhancedLLMService.generateCompletion(validationPrompt, {
      taskType: 'reasoning',
      complexity: 'medium',
      config: {
        temperature: agent.config.temperature,
        maxTokens: agent.config.maxTokens
      }
    });

    // Extract validation score
    const scoreMatch = response.text.match(/score[:\s]*(\d*\.?\d+)/i);
    const validationScore = scoreMatch ? parseFloat(scoreMatch[1]) : 0.8;

    return {
      result: response.text,
      confidence: validationScore,
      sources: [],
      reasoning: 'Expert validation analysis',
      metadata: {
        agentId: agent.id,
        validationScore,
        validationType: 'expert_review'
      }
    };
  }

  /**
   * Execute synthesis task
   */
  private async executeSynthesisTask(agent: Agent, task: Task): Promise<any> {
    const inputs = task.input.parameters?.inputs || [];
    
    const synthesisPrompt = `
You are ${agent.name}, coordinating multiple analysis results.

Objective: ${task.input.query}
Inputs to synthesize:
${inputs.map((input: any, i: number) => `${i + 1}. ${input.summary || input.result}`).join('\n')}

Provide:
1. Integrated analysis
2. Consensus findings
3. Conflicting viewpoints
4. Final recommendations

Synthesis:`;

    const response = await enhancedLLMService.generateCompletion(synthesisPrompt, {
      taskType: 'reasoning',
      complexity: 'high',
      config: {
        temperature: agent.config.temperature,
        maxTokens: agent.config.maxTokens
      }
    });

    return {
      result: response.text,
      confidence: 0.9,
      sources: inputs.flatMap((input: any) => input.sources || []),
      reasoning: 'Multi-agent synthesis and coordination',
      metadata: {
        agentId: agent.id,
        inputCount: inputs.length,
        synthesisType: 'multi_agent_coordination'
      }
    };
  }

  /**
   * Execute monitoring task
   */
  private async executeMonitoringTask(agent: Agent, task: Task): Promise<any> {
    // This would typically involve checking for regulatory changes
    const monitoringQuery = {
      question: `Monitor for changes related to: ${task.input.query}`,
      filters: {
        dateRange: {
          start: task.input.parameters?.since || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          end: new Date().toISOString()
        }
      },
      maxResults: 20
    };

    const ragResponse = await enhancedRAGService.query(monitoringQuery);

    const analysisPrompt = `
You are ${agent.name}, monitoring regulatory changes.

Monitoring Query: ${task.input.query}
Recent Updates Found: ${ragResponse.answer}

Analyze:
1. Significant changes detected
2. Impact assessment
3. Required actions
4. Monitoring recommendations

Monitoring Report:`;

    const analysis = await enhancedLLMService.generateCompletion(analysisPrompt, {
      taskType: 'reasoning',
      complexity: 'medium',
      config: {
        temperature: agent.config.temperature,
        maxTokens: agent.config.maxTokens
      }
    });

    return {
      result: analysis.text,
      confidence: ragResponse.confidence,
      sources: ragResponse.sources.map(s => s.id),
      reasoning: 'Automated regulatory change monitoring',
      metadata: {
        agentId: agent.id,
        changesDetected: ragResponse.sources.length,
        monitoringPeriod: task.input.parameters?.since || '30 days'
      }
    };
  }

  /**
   * Execute workflow step
   */
  private async executeWorkflowStep(context: ExecutionContext, step: WorkflowStep): Promise<void> {
    const executionStep: ExecutionStep = {
      stepId: step.id,
      status: 'running',
      startTime: new Date().toISOString(),
      input: context.variables
    };

    context.history.push(executionStep);
    
    try {
      switch (step.type) {
        case 'agent_task':
          if (step.agentId && step.taskTemplate) {
            const task = await this.executeTask({
              ...step.taskTemplate,
              input: {
                ...step.taskTemplate.input!,
                context: JSON.stringify(context.variables)
              }
            } as Omit<Task, 'id' | 'status' | 'metrics'>);
            
            executionStep.output = task.output;
            executionStep.taskId = task.id;
          }
          break;
          
        case 'condition':
          const conditionResult = this.evaluateConditions(step.conditions || [], context.variables);
          executionStep.output = { conditionMet: conditionResult };
          break;
          
        case 'webhook':
          if (this.n8nWebhookUrl) {
            const webhookResult = await this.callWebhook(this.n8nWebhookUrl, {
              step: step.name,
              variables: context.variables
            });
            executionStep.output = webhookResult;
          }
          break;
      }
      
      executionStep.status = 'completed';
      executionStep.endTime = new Date().toISOString();
      
      // Determine next steps
      const nextSteps = this.determineNextSteps(step, executionStep.output);
      
      // Execute next steps
      for (const nextStepId of nextSteps) {
        const workflow = this.workflows.get(context.workflowId);
        const nextStep = workflow?.steps.find(s => s.id === nextStepId);
        if (nextStep) {
          await this.executeWorkflowStep(context, nextStep);
        }
      }
      
    } catch (error) {
      executionStep.status = 'failed';
      executionStep.error = error instanceof Error ? error.message : 'Unknown error';
      executionStep.endTime = new Date().toISOString();
      
      // Handle error according to step configuration
      await this.handleStepError(context, step, error);
    }
  }

  /**
   * Send message between agents
   */
  private async sendMessage(message: AgentMessage): Promise<void> {
    // Store message
    await supabase.from('agent_messages').insert({
      id: message.id,
      from_agent_id: message.fromAgentId,
      to_agent_id: message.toAgentId,
      type: message.type,
      content: message.content,
      timestamp: message.timestamp,
      correlation_id: message.correlationId
    });
    
    this.emit('messageSent', message);
  }

  /**
   * Trigger n8n workflow
   */
  private async triggerN8nWorkflow(workflow: Workflow, variables: Record<string, any>): Promise<any> {
    if (!this.n8nWebhookUrl) return;
    
    try {
      const response = await fetch(this.n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          workflowId: workflow.id,
          workflowName: workflow.name,
          variables,
          timestamp: new Date().toISOString()
        })
      });
      
      return await response.json();
    } catch (error) {
      console.warn('Failed to trigger n8n workflow:', error);
    }
  }

  /**
   * Helper methods
   */
  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private evaluateConditions(conditions: WorkflowStep['conditions'], variables: Record<string, any>): boolean {
    return conditions?.every(condition => {
      const value = variables[condition.field];
      switch (condition.operator) {
        case 'equals': return value === condition.value;
        case 'contains': return String(value).includes(condition.value);
        case 'greater_than': return Number(value) > Number(condition.value);
        case 'less_than': return Number(value) < Number(condition.value);
        default: return false;
      }
    }) || false;
  }

  private determineNextSteps(step: WorkflowStep, output: any): string[] {
    // Simple implementation - could be enhanced with complex routing logic
    return step.nextSteps;
  }

  private async handleStepError(context: ExecutionContext, step: WorkflowStep, error: any): Promise<void> {
    if (step.errorHandling.retryCount > 0) {
      // Implement retry logic
      setTimeout(() => {
        this.executeWorkflowStep(context, step);
      }, 5000);
    } else if (step.errorHandling.fallbackStepId) {
      // Execute fallback step
      const workflow = this.workflows.get(context.workflowId);
      const fallbackStep = workflow?.steps.find(s => s.id === step.errorHandling.fallbackStepId);
      if (fallbackStep) {
        await this.executeWorkflowStep(context, fallbackStep);
      }
    }
  }

  private async callWebhook(url: string, data: any): Promise<any> {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await response.json();
  }

  private async persistAgent(agent: Agent): Promise<void> {
    await supabase.from('agents').upsert({
      id: agent.id,
      name: agent.name,
      type: agent.type,
      capabilities: agent.capabilities,
      status: agent.status,
      metadata: agent.metadata,
      config: agent.config,
      updated_at: new Date().toISOString()
    });
  }

  private async persistTask(task: Task): Promise<void> {
    await supabase.from('tasks').upsert({
      id: task.id,
      type: task.type,
      priority: task.priority,
      status: task.status,
      assigned_agent_id: task.assignedAgentId,
      parent_task_id: task.parentTaskId,
      dependencies: task.dependencies,
      input: task.input,
      output: task.output,
      metrics: task.metrics,
      updated_at: new Date().toISOString()
    });
  }

  private async updateTaskStatus(task: Task): Promise<void> {
    await supabase.from('tasks')
      .update({
        status: task.status,
        output: task.output,
        metrics: task.metrics,
        updated_at: new Date().toISOString()
      })
      .eq('id', task.id);
  }

  /**
   * Public API methods
   */
  async getAgent(agentId: string): Promise<Agent | undefined> {
    return this.agents.get(agentId);
  }

  async getTask(taskId: string): Promise<Task | undefined> {
    return this.tasks.get(taskId);
  }

  async getWorkflow(workflowId: string): Promise<Workflow | undefined> {
    return this.workflows.get(workflowId);
  }

  async listAgents(): Promise<Agent[]> {
    return Array.from(this.agents.values());
  }

  async listActiveTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => 
      ['pending', 'assigned', 'in_progress'].includes(task.status)
    );
  }

  async getExecutionStatus(executionId: string): Promise<ExecutionContext | undefined> {
    return this.activeExecutions.get(executionId);
  }

  private startTaskProcessor(): void {
    // Process task queue every 5 seconds
    setInterval(() => {
      if (!this.isProcessing && this.taskQueue.length > 0) {
        this.processTaskQueue();
      }
    }, 5000);
  }
}

// Export singleton instance
export const enhancedAgentOrchestrator = new EnhancedAgentOrchestrator({
  n8nWebhookUrl: import.meta.env.VITE_N8N_WEBHOOK_URL
});
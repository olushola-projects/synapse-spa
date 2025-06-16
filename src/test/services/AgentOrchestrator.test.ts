import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AgentOrchestrator, SFDRComplianceAgent, AMLInvestigationAgent } from '../../services/AgentOrchestrator';
import type { Agent, Workflow, WorkflowStep, AgentTask } from '../../services/AgentOrchestrator';

// Mock LLMService
const mockLLMService = {
  completeText: vi.fn(),
  classifyRegulatoryText: vi.fn(),
  extractEntities: vi.fn(),
  summarizeDocument: vi.fn()
};

// Mock RAGService
const mockRAGService = {
  answerQuestion: vi.fn(),
  semanticSearch: vi.fn(),
  ingestDocument: vi.fn()
};

// Mock Supabase client
const mockSupabaseClient = {
  from: vi.fn(() => ({
    insert: vi.fn().mockResolvedValue({ data: null, error: null }),
    select: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    then: vi.fn().mockResolvedValue({ data: [], error: null }),
    single: vi.fn().mockResolvedValue({ data: null, error: null })
  })),
  rpc: vi.fn().mockResolvedValue({ data: [], error: null })
};

describe('AgentOrchestrator', () => {
  let orchestrator: AgentOrchestrator;
  
  beforeEach(() => {
    vi.clearAllMocks();
    orchestrator = new AgentOrchestrator(
      mockSupabaseClient as any,
      mockLLMService as any,
      mockRAGService as any
    );
  });
  
  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Agent Registration and Management', () => {
    it('should initialize with default agents', async () => {
      await orchestrator.initialize();
      
      const agents = orchestrator.getAgentStatuses();
      expect(agents).toHaveProperty('sfdr-compliance');
      expect(agents).toHaveProperty('aml-investigation');
      expect(agents['sfdr-compliance'].status).toBe('ready');
      expect(agents['aml-investigation'].status).toBe('ready');
    });

    it('should register custom agents', async () => {
      const customAgent: Agent = {
        id: 'custom-agent',
        name: 'Custom Compliance Agent',
        description: 'A custom agent for testing',
        capabilities: ['analysis', 'reporting'],
        status: 'ready',
        execute: vi.fn().mockResolvedValue({
          success: true,
          result: 'Custom agent executed successfully',
          confidence: 0.9
        })
      };

      await orchestrator.initialize();
      orchestrator.registerAgent(customAgent);
      
      const agents = orchestrator.getAgentStatuses();
      expect(agents).toHaveProperty('custom-agent');
      expect(agents['custom-agent'].name).toBe('Custom Compliance Agent');
    });
  });

  describe('Workflow Execution', () => {
    beforeEach(async () => {
      await orchestrator.initialize();
    });

    it('should execute a simple workflow', async () => {
      const workflow: Workflow = {
        id: 'test-workflow',
        name: 'Test Compliance Workflow',
        description: 'A test workflow for compliance checking',
        steps: [
          {
            id: 'step-1',
            name: 'Document Analysis',
            agentId: 'sfdr-compliance',
            input: {
              document: 'Test regulatory document content',
              analysisType: 'compliance-check'
            },
            dependencies: []
          }
        ],
        metadata: {
          priority: 'medium',
          estimatedDuration: 300
        }
      };

      mockLLMService.classifyRegulatoryText.mockResolvedValue({
        category: 'SFDR',
        subcategory: 'Sustainability Disclosure',
        confidence: 0.92,
        reasoning: 'Document contains SFDR-related content'
      });

      const result = await orchestrator.executeWorkflow(workflow);

      expect(result.success).toBe(true);
      expect(result.workflowId).toBe('test-workflow');
      expect(result.results).toHaveLength(1);
      expect(result.results[0].success).toBe(true);
    });

    it('should handle workflow with dependencies', async () => {
      const workflow: Workflow = {
        id: 'dependency-workflow',
        name: 'Multi-Step Workflow',
        description: 'Workflow with step dependencies',
        steps: [
          {
            id: 'step-1',
            name: 'Initial Analysis',
            agentId: 'sfdr-compliance',
            input: { document: 'Initial document' },
            dependencies: []
          },
          {
            id: 'step-2',
            name: 'Follow-up Investigation',
            agentId: 'aml-investigation',
            input: { transactionData: 'Transaction details' },
            dependencies: ['step-1']
          }
        ],
        metadata: { priority: 'high' }
      };

      mockLLMService.classifyRegulatoryText.mockResolvedValue({
        category: 'SFDR',
        confidence: 0.9
      });

      mockLLMService.extractEntities.mockResolvedValue({
        entities: [
          { type: 'PERSON', value: 'John Doe', confidence: 0.95 },
          { type: 'AMOUNT', value: '€50,000', confidence: 0.88 }
        ],
        confidence: 0.91
      });

      const result = await orchestrator.executeWorkflow(workflow);

      expect(result.success).toBe(true);
      expect(result.results).toHaveLength(2);
      expect(result.executionOrder).toEqual(['step-1', 'step-2']);
    });

    it('should handle workflow step failures gracefully', async () => {
      const workflow: Workflow = {
        id: 'failing-workflow',
        name: 'Workflow with Failure',
        description: 'Test workflow failure handling',
        steps: [
          {
            id: 'failing-step',
            name: 'Failing Step',
            agentId: 'sfdr-compliance',
            input: { document: 'Invalid document' },
            dependencies: []
          }
        ],
        metadata: { priority: 'low' }
      };

      mockLLMService.classifyRegulatoryText.mockRejectedValue(
        new Error('Classification failed')
      );

      const result = await orchestrator.executeWorkflow(workflow);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Classification failed');
      expect(result.results[0].success).toBe(false);
    });
  });

  describe('Workflow Status Tracking', () => {
    beforeEach(async () => {
      await orchestrator.initialize();
    });

    it('should track workflow execution status', async () => {
      const workflow: Workflow = {
        id: 'status-workflow',
        name: 'Status Tracking Workflow',
        description: 'Test status tracking',
        steps: [
          {
            id: 'step-1',
            name: 'Long Running Step',
            agentId: 'sfdr-compliance',
            input: { document: 'Test document' },
            dependencies: []
          }
        ],
        metadata: { priority: 'medium' }
      };

      // Mock a delayed response
      mockLLMService.classifyRegulatoryText.mockImplementation(
        () => new Promise(resolve => 
          setTimeout(() => resolve({
            category: 'SFDR',
            confidence: 0.85
          }), 100)
        )
      );

      const executionPromise = orchestrator.executeWorkflow(workflow);
      
      // Check status while running
      const runningStatus = await orchestrator.getWorkflowStatus('status-workflow');
      expect(['running', 'completed']).toContain(runningStatus.status);

      await executionPromise;
      
      // Check final status
      const completedStatus = await orchestrator.getWorkflowStatus('status-workflow');
      expect(completedStatus.status).toBe('completed');
      expect(completedStatus.progress).toBe(100);
    });

    it('should provide workflow metrics', async () => {
      mockSupabaseClient.from().then.mockResolvedValue({
        data: [
          {
            workflow_id: 'test-1',
            status: 'completed',
            execution_time: 150,
            created_at: new Date().toISOString()
          },
          {
            workflow_id: 'test-2',
            status: 'failed',
            execution_time: 75,
            created_at: new Date().toISOString()
          }
        ],
        error: null
      });

      const metrics = await orchestrator.getWorkflowMetrics('2024-01-01', '2024-01-31');

      expect(metrics.totalWorkflows).toBe(2);
      expect(metrics.successRate).toBe(0.5);
      expect(metrics.averageExecutionTime).toBe(112.5);
      expect(metrics.statusBreakdown.completed).toBe(1);
      expect(metrics.statusBreakdown.failed).toBe(1);
    });
  });

  describe('SFDR Compliance Agent', () => {
    let sfdrAgent: SFDRComplianceAgent;

    beforeEach(() => {
      sfdrAgent = new SFDRComplianceAgent(mockLLMService as any, mockRAGService as any);
    });

    it('should assess SFDR compliance correctly', async () => {
      const task: AgentTask = {
        id: 'sfdr-task-1',
        type: 'compliance-assessment',
        input: {
          document: 'This fund follows SFDR Article 8 requirements for sustainability disclosure.',
          assessmentType: 'article-classification'
        },
        priority: 'high'
      };

      mockLLMService.classifyRegulatoryText.mockResolvedValue({
        category: 'SFDR',
        subcategory: 'Article 8',
        confidence: 0.94,
        reasoning: 'Document explicitly mentions SFDR Article 8 requirements'
      });

      mockRAGService.answerQuestion.mockResolvedValue({
        answer: 'Article 8 funds must disclose how environmental and social characteristics are promoted.',
        confidence: 0.89,
        sources: ['sfdr-guidance.pdf'],
        followUpQuestions: ['What are the specific disclosure requirements?']
      });

      const result = await sfdrAgent.execute(task);

      expect(result.success).toBe(true);
      expect(result.result.classification).toBe('Article 8');
      expect(result.result.complianceScore).toBeGreaterThan(0.8);
      expect(result.result.recommendations).toBeInstanceOf(Array);
      expect(result.confidence).toBeGreaterThan(0.9);
    });

    it('should identify compliance gaps', async () => {
      const task: AgentTask = {
        id: 'sfdr-gap-analysis',
        type: 'gap-analysis',
        input: {
          document: 'This fund invests in sustainable companies but lacks proper disclosure.',
          currentDisclosures: ['basic-esg-info']
        },
        priority: 'medium'
      };

      mockLLMService.classifyRegulatoryText.mockResolvedValue({
        category: 'SFDR',
        subcategory: 'Incomplete Disclosure',
        confidence: 0.87
      });

      const result = await sfdrAgent.execute(task);

      expect(result.success).toBe(true);
      expect(result.result.gaps).toBeInstanceOf(Array);
      expect(result.result.gaps.length).toBeGreaterThan(0);
      expect(result.result.priority).toBe('medium');
    });
  });

  describe('AML Investigation Agent', () => {
    let amlAgent: AMLInvestigationAgent;

    beforeEach(() => {
      amlAgent = new AMLInvestigationAgent(mockLLMService as any, mockRAGService as any);
    });

    it('should investigate suspicious transactions', async () => {
      const task: AgentTask = {
        id: 'aml-investigation-1',
        type: 'transaction-investigation',
        input: {
          transactionData: {
            amount: 50000,
            currency: 'EUR',
            sender: 'John Doe',
            receiver: 'Shell Company Ltd',
            country: 'Cyprus',
            timestamp: new Date().toISOString()
          },
          investigationType: 'suspicious-activity'
        },
        priority: 'high'
      };

      mockLLMService.extractEntities.mockResolvedValue({
        entities: [
          { type: 'PERSON', value: 'John Doe', confidence: 0.95 },
          { type: 'ORGANIZATION', value: 'Shell Company Ltd', confidence: 0.92 },
          { type: 'LOCATION', value: 'Cyprus', confidence: 0.88 },
          { type: 'AMOUNT', value: '€50,000', confidence: 0.96 }
        ],
        confidence: 0.93
      });

      mockRAGService.semanticSearch.mockResolvedValue({
        chunks: [
          {
            content: 'Cyprus is considered a high-risk jurisdiction for money laundering.',
            score: 0.89,
            metadata: { source: 'aml-guidelines.pdf' }
          }
        ],
        totalResults: 1
      });

      const result = await amlAgent.execute(task);

      expect(result.success).toBe(true);
      expect(result.result.riskScore).toBeGreaterThan(0.7);
      expect(result.result.riskFactors).toContain('high-risk-jurisdiction');
      expect(result.result.entities).toHaveLength(4);
      expect(result.result.recommendation).toContain('enhanced due diligence');
    });

    it('should assess customer risk profiles', async () => {
      const task: AgentTask = {
        id: 'customer-risk-assessment',
        type: 'customer-assessment',
        input: {
          customerData: {
            name: 'High Net Worth Individual',
            occupation: 'Politically Exposed Person',
            country: 'High Risk Country',
            transactionVolume: 1000000
          },
          assessmentType: 'pep-screening'
        },
        priority: 'high'
      };

      mockLLMService.classifyRegulatoryText.mockResolvedValue({
        category: 'AML',
        subcategory: 'PEP Classification',
        confidence: 0.96
      });

      const result = await amlAgent.execute(task);

      expect(result.success).toBe(true);
      expect(result.result.riskLevel).toBe('high');
      expect(result.result.pepStatus).toBe(true);
      expect(result.result.requiredActions).toContain('enhanced-due-diligence');
    });
  });

  describe('Error Handling and Resilience', () => {
    beforeEach(async () => {
      await orchestrator.initialize();
    });

    it('should handle agent execution timeouts', async () => {
      const workflow: Workflow = {
        id: 'timeout-workflow',
        name: 'Timeout Test',
        description: 'Test timeout handling',
        steps: [
          {
            id: 'slow-step',
            name: 'Slow Step',
            agentId: 'sfdr-compliance',
            input: { document: 'Test' },
            dependencies: [],
            timeout: 100 // 100ms timeout
          }
        ],
        metadata: { priority: 'low' }
      };

      // Mock a slow response
      mockLLMService.classifyRegulatoryText.mockImplementation(
        () => new Promise(resolve => 
          setTimeout(() => resolve({ category: 'SFDR' }), 200)
        )
      );

      const result = await orchestrator.executeWorkflow(workflow);

      expect(result.success).toBe(false);
      expect(result.error).toContain('timeout');
    });

    it('should retry failed steps when configured', async () => {
      const workflow: Workflow = {
        id: 'retry-workflow',
        name: 'Retry Test',
        description: 'Test retry mechanism',
        steps: [
          {
            id: 'retry-step',
            name: 'Retry Step',
            agentId: 'sfdr-compliance',
            input: { document: 'Test' },
            dependencies: [],
            retryConfig: {
              maxRetries: 2,
              retryDelay: 50
            }
          }
        ],
        metadata: { priority: 'medium' }
      };

      let callCount = 0;
      mockLLMService.classifyRegulatoryText.mockImplementation(() => {
        callCount++;
        if (callCount < 3) {
          throw new Error('Temporary failure');
        }
        return Promise.resolve({ category: 'SFDR', confidence: 0.8 });
      });

      const result = await orchestrator.executeWorkflow(workflow);

      expect(result.success).toBe(true);
      expect(callCount).toBe(3); // Initial call + 2 retries
    });
  });

  describe('Performance and Monitoring', () => {
    beforeEach(async () => {
      await orchestrator.initialize();
    });

    it('should track execution metrics', async () => {
      const workflow: Workflow = {
        id: 'metrics-workflow',
        name: 'Metrics Test',
        description: 'Test metrics collection',
        steps: [
          {
            id: 'metrics-step',
            name: 'Metrics Step',
            agentId: 'sfdr-compliance',
            input: { document: 'Test document' },
            dependencies: []
          }
        ],
        metadata: { priority: 'medium' }
      };

      mockLLMService.classifyRegulatoryText.mockResolvedValue({
        category: 'SFDR',
        confidence: 0.85
      });

      const startTime = Date.now();
      await orchestrator.executeWorkflow(workflow);
      const endTime = Date.now();

      const status = await orchestrator.getWorkflowStatus('metrics-workflow');
      expect(status.executionTime).toBeGreaterThan(0);
      expect(status.executionTime).toBeLessThan(endTime - startTime + 100); // Allow some margin
    });
  });
});
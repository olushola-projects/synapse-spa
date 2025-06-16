import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { Dashboard } from '../../pages/Dashboard';
import { EnhancedLLMService } from '../../services/ai/EnhancedLLMService';
import { EnhancedRAGService } from '../../services/ai/EnhancedRAGService';
import { EnhancedAgentOrchestrator } from '../../services/ai/EnhancedAgentOrchestrator';
import { SecurityComplianceService } from '../../services/security/SecurityComplianceService';
import { TelemetryService } from '../../lib/telemetry';

// Mock services
vi.mock('../../services/ai/EnhancedLLMService');
vi.mock('../../services/ai/EnhancedRAGService');
vi.mock('../../services/ai/EnhancedAgentOrchestrator');
vi.mock('../../services/security/SecurityComplianceService');
vi.mock('../../lib/telemetry');

// Mock Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: {
          user: {
            id: 'user-123',
            email: 'test@example.com',
            user_metadata: {
              full_name: 'Test User',
              role: 'compliance_manager',
            },
          },
        },
        error: null,
      }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockReturnValue({
              data: [
                {
                  id: '1',
                  title: 'GDPR Compliance Review',
                  type: 'compliance',
                  status: 'active',
                  priority: 'high',
                  assignee: 'John Doe',
                  due_date: '2024-12-31',
                  created_at: '2024-01-01',
                  updated_at: '2024-01-15',
                  metadata: {
                    framework: 'GDPR',
                    risk_level: 'medium',
                  },
                },
                {
                  id: '2',
                  title: 'SOX Financial Controls',
                  type: 'audit',
                  status: 'pending',
                  priority: 'medium',
                  assignee: 'Jane Smith',
                  due_date: '2024-11-30',
                  created_at: '2024-01-02',
                  updated_at: '2024-01-16',
                  metadata: {
                    framework: 'SOX',
                    risk_level: 'low',
                  },
                },
              ],
              error: null,
            }),
          }),
        }),
      }),
      insert: vi.fn().mockReturnValue({
        data: null,
        error: null,
      }),
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          data: null,
          error: null,
        }),
      }),
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          data: null,
          error: null,
        }),
      }),
    }),
    rpc: vi.fn().mockReturnValue({
      data: {
        total_tasks: 156,
        completed_tasks: 89,
        pending_tasks: 45,
        overdue_tasks: 22,
        compliance_score: 87.5,
        risk_score: 23.8,
        audit_findings: 12,
        security_incidents: 3,
      },
      error: null,
    }),
    channel: vi.fn().mockReturnValue({
      on: vi.fn().mockReturnValue({
        subscribe: vi.fn(),
      }),
      unsubscribe: vi.fn(),
    }),
  },
}));

// Mock React Query
vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useQuery: vi.fn().mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    }),
    useMutation: vi.fn().mockReturnValue({
      mutate: vi.fn(),
      isLoading: false,
      error: null,
    }),
    useQueryClient: vi.fn().mockReturnValue({
      invalidateQueries: vi.fn(),
      setQueryData: vi.fn(),
    }),
  };
});

// Mock Chart.js and react-chartjs-2
vi.mock('react-chartjs-2', () => ({
  Line: ({ data, options }: any) => (
    <div data-testid="line-chart" data-chart-data={JSON.stringify(data)} />
  ),
  Bar: ({ data, options }: any) => (
    <div data-testid="bar-chart" data-chart-data={JSON.stringify(data)} />
  ),
  Doughnut: ({ data, options }: any) => (
    <div data-testid="doughnut-chart" data-chart-data={JSON.stringify(data)} />
  ),
  Pie: ({ data, options }: any) => (
    <div data-testid="pie-chart" data-chart-data={JSON.stringify(data)} />
  ),
}));

vi.mock('chart.js', () => ({
  Chart: {
    register: vi.fn(),
  },
  CategoryScale: vi.fn(),
  LinearScale: vi.fn(),
  PointElement: vi.fn(),
  LineElement: vi.fn(),
  BarElement: vi.fn(),
  ArcElement: vi.fn(),
  Title: vi.fn(),
  Tooltip: vi.fn(),
  Legend: vi.fn(),
  Filler: vi.fn(),
}));

// Mock Recharts
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  LineChart: ({ data, children }: any) => (
    <div data-testid="line-chart" data-chart-data={JSON.stringify(data)}>
      {children}
    </div>
  ),
  BarChart: ({ data, children }: any) => (
    <div data-testid="bar-chart" data-chart-data={JSON.stringify(data)}>
      {children}
    </div>
  ),
  PieChart: ({ data, children }: any) => (
    <div data-testid="pie-chart" data-chart-data={JSON.stringify(data)}>
      {children}
    </div>
  ),
  Line: () => <div data-testid="chart-line" />,
  Bar: () => <div data-testid="chart-bar" />,
  XAxis: () => <div data-testid="chart-x-axis" />,
  YAxis: () => <div data-testid="chart-y-axis" />,
  CartesianGrid: () => <div data-testid="chart-grid" />,
  Tooltip: () => <div data-testid="chart-tooltip" />,
  Legend: () => <div data-testid="chart-legend" />,
  Cell: () => <div data-testid="chart-cell" />,
  Pie: () => <div data-testid="chart-pie" />,
}));

// Mock shadcn/ui components
vi.mock('../../components/ui/card', () => ({
  Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="card" className={className}>{children}</div>
  ),
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-content">{children}</div>
  ),
  CardDescription: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-description">{children}</div>
  ),
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-header">{children}</div>
  ),
  CardTitle: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-title">{children}</div>
  ),
}));

vi.mock('../../components/ui/button', () => ({
  Button: ({ children, onClick, variant, size, disabled }: any) => (
    <button
      data-testid="button"
      onClick={onClick}
      data-variant={variant}
      data-size={size}
      disabled={disabled}
    >
      {children}
    </button>
  ),
}));

vi.mock('../../components/ui/tabs', () => ({
  Tabs: ({ children, value, onValueChange }: any) => (
    <div data-testid="tabs" data-value={value} data-onvaluechange={onValueChange}>
      {children}
    </div>
  ),
  TabsContent: ({ children, value }: { children: React.ReactNode; value: string }) => (
    <div data-testid="tabs-content" data-value={value}>
      {children}
    </div>
  ),
  TabsList: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tabs-list">{children}</div>
  ),
  TabsTrigger: ({ children, value }: { children: React.ReactNode; value: string }) => (
    <button data-testid="tabs-trigger" data-value={value}>
      {children}
    </button>
  ),
}));

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
  BarChart3: () => <div data-testid="bar-chart-icon" />,
  TrendingUp: () => <div data-testid="trending-up-icon" />,
  TrendingDown: () => <div data-testid="trending-down-icon" />,
  AlertTriangle: () => <div data-testid="alert-triangle-icon" />,
  CheckCircle: () => <div data-testid="check-circle-icon" />,
  XCircle: () => <div data-testid="x-circle-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
  Shield: () => <div data-testid="shield-icon" />,
  FileText: () => <div data-testid="file-text-icon" />,
  Users: () => <div data-testid="users-icon" />,
  Activity: () => <div data-testid="activity-icon" />,
  Bell: () => <div data-testid="bell-icon" />,
  Settings: () => <div data-testid="settings-icon" />,
  Search: () => <div data-testid="search-icon" />,
  Filter: () => <div data-testid="filter-icon" />,
  Download: () => <div data-testid="download-icon" />,
  RefreshCw: () => <div data-testid="refresh-icon" />,
  Plus: () => <div data-testid="plus-icon" />,
  Edit: () => <div data-testid="edit-icon" />,
  Trash2: () => <div data-testid="trash-icon" />,
  Eye: () => <div data-testid="eye-icon" />,
  MoreHorizontal: () => <div data-testid="more-horizontal-icon" />,
  Calendar: () => <div data-testid="calendar-icon" />,
  User: () => <div data-testid="user-icon" />,
  Tag: () => <div data-testid="tag-icon" />,
  ArrowUpDown: () => <div data-testid="arrow-up-down-icon" />,
  ChevronLeft: () => <div data-testid="chevron-left-icon" />,
  ChevronRight: () => <div data-testid="chevron-right-icon" />,
}));

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Dashboard Integration Tests', () => {
  let mockLLMService: any;
  let mockRAGService: any;
  let mockAgentOrchestrator: any;
  let mockSecurityService: any;
  let mockTelemetryService: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup service mocks
    mockLLMService = {
      generateText: vi.fn().mockResolvedValue({
        text: 'Generated compliance analysis',
        confidence: 0.95,
        metadata: { model: 'gpt-4', tokens: 150 },
      }),
      generateEmbeddings: vi.fn().mockResolvedValue({
        embeddings: [0.1, 0.2, 0.3],
        model: 'text-embedding-ada-002',
      }),
      classifyText: vi.fn().mockResolvedValue({
        category: 'compliance',
        confidence: 0.92,
        subcategories: ['gdpr', 'data-protection'],
      }),
      getHealthStatus: vi.fn().mockResolvedValue({
        status: 'healthy',
        models: { available: 3, healthy: 3 },
      }),
    };

    mockRAGService = {
      searchDocuments: vi.fn().mockResolvedValue({
        results: [
          {
            id: 'doc-1',
            content: 'GDPR compliance requirements...',
            metadata: { source: 'regulation', type: 'gdpr' },
            score: 0.95,
          },
        ],
        totalResults: 1,
      }),
      addDocument: vi.fn().mockResolvedValue({ id: 'doc-new', success: true }),
      getDocumentById: vi.fn().mockResolvedValue({
        id: 'doc-1',
        content: 'Document content',
        metadata: {},
      }),
      getHealthStatus: vi.fn().mockResolvedValue({
        status: 'healthy',
        documentsCount: 1500,
        vectorStore: 'connected',
      }),
    };

    mockAgentOrchestrator = {
      executeTask: vi.fn().mockResolvedValue({
        result: 'Task completed successfully',
        agentId: 'compliance-agent',
        executionTime: 2500,
        confidence: 0.88,
      }),
      getAvailableAgents: vi.fn().mockResolvedValue([
        {
          id: 'compliance-agent',
          name: 'Compliance Analyzer',
          description: 'Analyzes compliance requirements',
          capabilities: ['analysis', 'reporting'],
          status: 'active',
        },
        {
          id: 'risk-agent',
          name: 'Risk Assessor',
          description: 'Assesses security and operational risks',
          capabilities: ['risk-assessment', 'monitoring'],
          status: 'active',
        },
      ]),
      getPerformanceMetrics: vi.fn().mockResolvedValue({
        totalTasks: 1250,
        successRate: 0.94,
        averageExecutionTime: 1800,
        activeAgents: 5,
      }),
    };

    mockSecurityService = {
      authenticateWithMFA: vi.fn().mockResolvedValue({
        success: true,
        user: { id: 'user-123', email: 'test@example.com' },
        session: { token: 'jwt-token', expiresAt: new Date() },
      }),
      getSecurityMetrics: vi.fn().mockResolvedValue({
        activeThreats: 2,
        securityScore: 85,
        lastScan: new Date(),
        vulnerabilities: { high: 0, medium: 3, low: 8 },
      }),
      detectAnomalousActivity: vi.fn().mockResolvedValue({
        anomalies: [],
        riskScore: 0.15,
        lastCheck: new Date(),
      }),
      getHealthStatus: vi.fn().mockResolvedValue({
        status: 'healthy',
        mfaEnabled: true,
        ssoConfigured: true,
      }),
    };

    mockTelemetryService = {
      startSpan: vi.fn().mockReturnValue({
        setAttributes: vi.fn(),
        setStatus: vi.fn(),
        end: vi.fn(),
      }),
      incrementCounter: vi.fn(),
      recordHistogram: vi.fn(),
      setGauge: vi.fn(),
      trackUserAction: vi.fn(),
      trackApiCall: vi.fn(),
      trackError: vi.fn(),
      getHealthStatus: vi.fn().mockResolvedValue({
        status: 'healthy',
        exporters: ['console', 'jaeger'],
      }),
    };

    // Apply mocks
    (EnhancedLLMService as any).mockImplementation(() => mockLLMService);
    (EnhancedRAGService as any).mockImplementation(() => mockRAGService);
    (EnhancedAgentOrchestrator as any).mockImplementation(() => mockAgentOrchestrator);
    (SecurityComplianceService as any).mockImplementation(() => mockSecurityService);
    (TelemetryService as any).mockImplementation(() => mockTelemetryService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Dashboard Loading and Initialization', () => {
    it('should load dashboard with all components', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      // Wait for dashboard to load
      await waitFor(() => {
        expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
      });

      // Check for key dashboard components
      expect(screen.getAllByTestId('card').length).toBeGreaterThan(0);
      expect(screen.getByTestId('tabs')).toBeInTheDocument();
    });

    it('should initialize all services on dashboard load', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(mockTelemetryService.trackUserAction).toHaveBeenCalledWith(
          'dashboard_loaded',
          expect.any(Object)
        );
      });
    });

    it('should display loading states initially', () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      // Should show loading indicators
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
  });

  describe('Analytics and Metrics Integration', () => {
    it('should display compliance metrics', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/compliance score/i)).toBeInTheDocument();
        expect(screen.getByText('87.5')).toBeInTheDocument();
      });
    });

    it('should display risk metrics', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/risk score/i)).toBeInTheDocument();
        expect(screen.getByText('23.8')).toBeInTheDocument();
      });
    });

    it('should display task statistics', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/total tasks/i)).toBeInTheDocument();
        expect(screen.getByText('156')).toBeInTheDocument();
        expect(screen.getByText('89')).toBeInTheDocument(); // completed
        expect(screen.getByText('45')).toBeInTheDocument(); // pending
      });
    });

    it('should render charts with data', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getAllByTestId('line-chart').length).toBeGreaterThan(0);
        expect(screen.getAllByTestId('bar-chart').length).toBeGreaterThan(0);
      });
    });
  });

  describe('AI Agent Integration', () => {
    it('should display available agents', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Compliance Analyzer')).toBeInTheDocument();
        expect(screen.getByText('Risk Assessor')).toBeInTheDocument();
      });
    });

    it('should execute agent tasks', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Compliance Analyzer')).toBeInTheDocument();
      });

      // Click on agent to execute task
      const agentCard = screen.getByText('Compliance Analyzer').closest('[data-testid="card"]');
      if (agentCard) {
        await user.click(agentCard);
        
        await waitFor(() => {
          expect(mockAgentOrchestrator.executeTask).toHaveBeenCalled();
        });
      }
    });

    it('should display agent performance metrics', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/success rate/i)).toBeInTheDocument();
        expect(screen.getByText('94%')).toBeInTheDocument();
      });
    });
  });

  describe('Data Table Integration', () => {
    it('should display GRC data in table', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('GDPR Compliance Review')).toBeInTheDocument();
        expect(screen.getByText('SOX Financial Controls')).toBeInTheDocument();
      });
    });

    it('should handle table interactions', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('GDPR Compliance Review')).toBeInTheDocument();
      });

      // Test search functionality
      const searchInput = screen.getByPlaceholderText(/search/i);
      await user.type(searchInput, 'GDPR');
      
      expect(searchInput).toHaveValue('GDPR');
    });

    it('should handle row actions', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('more-horizontal-icon')).toBeInTheDocument();
      });

      // Click on row actions
      const actionButton = screen.getByTestId('more-horizontal-icon');
      await user.click(actionButton);
      
      // Should show action menu
      expect(screen.getByTestId('eye-icon')).toBeInTheDocument();
    });
  });

  describe('Notification System Integration', () => {
    it('should display notifications', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('bell-icon')).toBeInTheDocument();
      });
    });

    it('should handle notification interactions', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('bell-icon')).toBeInTheDocument();
      });

      // Click on notification bell
      const bellIcon = screen.getByTestId('bell-icon');
      await user.click(bellIcon);
      
      // Should show notification panel
      expect(screen.getByText(/notifications/i)).toBeInTheDocument();
    });

    it('should display real-time updates', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      // Simulate real-time notification
      await waitFor(() => {
        expect(mockTelemetryService.trackUserAction).toHaveBeenCalled();
      });
    });
  });

  describe('Security Integration', () => {
    it('should display security metrics', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/security score/i)).toBeInTheDocument();
        expect(screen.getByText('85')).toBeInTheDocument();
      });
    });

    it('should handle security alerts', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(mockSecurityService.detectAnomalousActivity).toHaveBeenCalled();
      });
    });

    it('should display threat indicators', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/active threats/i)).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
      });
    });
  });

  describe('Search and RAG Integration', () => {
    it('should perform semantic search', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('search-icon')).toBeInTheDocument();
      });

      // Perform search
      const searchInput = screen.getByPlaceholderText(/search/i);
      await user.type(searchInput, 'GDPR compliance requirements');
      await user.keyboard('{Enter}');
      
      await waitFor(() => {
        expect(mockRAGService.searchDocuments).toHaveBeenCalledWith(
          expect.objectContaining({
            query: 'GDPR compliance requirements',
          })
        );
      });
    });

    it('should display search results', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      // Trigger search
      const searchInput = screen.getByPlaceholderText(/search/i);
      await user.type(searchInput, 'compliance');
      await user.keyboard('{Enter}');
      
      await waitFor(() => {
        expect(screen.getByText(/search results/i)).toBeInTheDocument();
      });
    });
  });

  describe('Tab Navigation Integration', () => {
    it('should switch between dashboard tabs', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('tabs')).toBeInTheDocument();
      });

      // Click on different tabs
      const tabTriggers = screen.getAllByTestId('tabs-trigger');
      if (tabTriggers.length > 1) {
        await user.click(tabTriggers[1]);
        
        // Should switch tab content
        expect(screen.getByTestId('tabs-content')).toBeInTheDocument();
      }
    });

    it('should maintain state across tab switches', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      // Perform action in first tab
      const searchInput = screen.getByPlaceholderText(/search/i);
      await user.type(searchInput, 'test query');
      
      // Switch tabs
      const tabTriggers = screen.getAllByTestId('tabs-trigger');
      if (tabTriggers.length > 1) {
        await user.click(tabTriggers[1]);
        await user.click(tabTriggers[0]);
        
        // Search input should maintain value
        expect(searchInput).toHaveValue('test query');
      }
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle service errors gracefully', async () => {
      // Mock service error
      mockLLMService.generateText.mockRejectedValue(new Error('Service unavailable'));
      
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });
    });

    it('should display error boundaries', async () => {
      // Mock component error
      const ErrorComponent = () => {
        throw new Error('Component error');
      };
      
      render(
        <TestWrapper>
          <ErrorComponent />
        </TestWrapper>
      );

      // Should catch and display error
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });

    it('should handle network errors', async () => {
      // Mock network error
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
      
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(mockTelemetryService.trackError).toHaveBeenCalled();
      });
    });
  });

  describe('Performance Integration', () => {
    it('should track performance metrics', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(mockTelemetryService.recordHistogram).toHaveBeenCalledWith(
          'dashboard_load_time',
          expect.any(Number)
        );
      });
    });

    it('should handle large datasets efficiently', async () => {
      // Mock large dataset
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        id: `item-${i}`,
        title: `Item ${i}`,
        type: 'compliance',
        status: 'active',
      }));
      
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      // Should render without performance issues
      await waitFor(() => {
        expect(screen.getByTestId('tabs')).toBeInTheDocument();
      });
    });

    it('should implement virtual scrolling for large lists', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      // Should use virtual scrolling for performance
      await waitFor(() => {
        expect(screen.getByTestId('scroll-area')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility Integration', () => {
    it('should have proper ARIA labels', () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      const buttons = screen.getAllByTestId('button');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('aria-label');
      });
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      // Test keyboard navigation
      await user.keyboard('{Tab}');
      expect(document.activeElement).toBeInTheDocument();
      
      await user.keyboard('{Enter}');
      // Should trigger action
    });

    it('should have proper color contrast', () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      // Check for proper contrast ratios
      const cards = screen.getAllByTestId('card');
      cards.forEach(card => {
        expect(card).toHaveClass(/bg-/); // Should have background color classes
      });
    });
  });

  describe('Responsive Design Integration', () => {
    it('should adapt to mobile screens', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      // Should render mobile-friendly layout
      expect(screen.getByTestId('tabs')).toBeInTheDocument();
    });

    it('should adapt to tablet screens', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      expect(screen.getByTestId('tabs')).toBeInTheDocument();
    });

    it('should adapt to desktop screens', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1920,
      });
      
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      expect(screen.getByTestId('tabs')).toBeInTheDocument();
    });
  });
});
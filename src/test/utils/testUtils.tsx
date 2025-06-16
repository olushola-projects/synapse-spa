import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';

// Mock data generators
export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  role: 'user' as const,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const mockAgent = {
  id: 'test-agent-id',
  name: 'Test Agent',
  description: 'A test agent for testing purposes',
  type: 'analysis' as const,
  status: 'active' as const,
  capabilities: ['text_analysis', 'data_processing'],
  config: {
    model: 'gpt-4',
    temperature: 0.7,
    max_tokens: 1000,
  },
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const mockDocument = {
  id: 'test-doc-id',
  title: 'Test Document',
  content: 'This is a test document content',
  type: 'regulation' as const,
  source: 'test-source',
  metadata: {
    author: 'Test Author',
    date: '2024-01-01',
    tags: ['test', 'document'],
  },
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const mockNotification = {
  id: 'test-notification-id',
  title: 'Test Notification',
  message: 'This is a test notification',
  type: 'info' as const,
  priority: 'medium' as const,
  status: 'unread' as const,
  user_id: 'test-user-id',
  created_at: '2024-01-01T00:00:00Z',
  read_at: null,
};

export const mockAnalyticsData = {
  metrics: {
    totalUsers: 1250,
    activeAgents: 15,
    completedTasks: 3420,
    avgResponseTime: 2.3,
  },
  chartData: [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 },
  ],
  trends: {
    users: { value: 12.5, direction: 'up' as const },
    tasks: { value: 8.2, direction: 'up' as const },
    performance: { value: 3.1, direction: 'down' as const },
  },
};

// Test wrapper component
interface AllTheProvidersProps {
  children: React.ReactNode;
}

const AllTheProviders: React.FC<AllTheProvidersProps> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

// Custom render function
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Utility functions
export const createMockSupabaseClient = () => ({
  auth: {
    getUser: jest.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
    signInWithPassword: jest.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
    signUp: jest.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
    signOut: jest.fn().mockResolvedValue({ error: null }),
    onAuthStateChange: jest.fn().mockReturnValue({ data: { subscription: { unsubscribe: jest.fn() } } }),
  },
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  neq: jest.fn().mockReturnThis(),
  gt: jest.fn().mockReturnThis(),
  gte: jest.fn().mockReturnThis(),
  lt: jest.fn().mockReturnThis(),
  lte: jest.fn().mockReturnThis(),
  like: jest.fn().mockReturnThis(),
  ilike: jest.fn().mockReturnThis(),
  in: jest.fn().mockReturnThis(),
  contains: jest.fn().mockReturnThis(),
  order: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  range: jest.fn().mockReturnThis(),
  single: jest.fn().mockResolvedValue({ data: mockDocument, error: null }),
  maybeSingle: jest.fn().mockResolvedValue({ data: mockDocument, error: null }),
});

export const createMockQdrantClient = () => ({
  search: jest.fn().mockResolvedValue({
    result: [
      {
        id: 'test-vector-id',
        score: 0.95,
        payload: {
          content: 'Test content',
          metadata: { source: 'test' },
        },
      },
    ],
  }),
  upsert: jest.fn().mockResolvedValue({ status: 'acknowledged' }),
  delete: jest.fn().mockResolvedValue({ status: 'acknowledged' }),
  getCollectionInfo: jest.fn().mockResolvedValue({
    result: {
      status: 'green',
      vectors_count: 1000,
    },
  }),
});

export const createMockLLMResponse = (content: string = 'Test response') => ({
  choices: [
    {
      message: {
        content,
        role: 'assistant',
      },
      finish_reason: 'stop',
    },
  ],
  usage: {
    prompt_tokens: 10,
    completion_tokens: 20,
    total_tokens: 30,
  },
});

export const createMockEmbeddingResponse = (dimensions: number = 1536) => ({
  data: [
    {
      embedding: Array(dimensions).fill(0).map(() => Math.random()),
      index: 0,
    },
  ],
  usage: {
    prompt_tokens: 5,
    total_tokens: 5,
  },
});

// Wait utilities
export const waitForNextTick = () => new Promise(resolve => setTimeout(resolve, 0));

export const waitForCondition = async (
  condition: () => boolean,
  timeout: number = 5000,
  interval: number = 100
): Promise<void> => {
  const startTime = Date.now();
  
  while (!condition() && Date.now() - startTime < timeout) {
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  
  if (!condition()) {
    throw new Error(`Condition not met within ${timeout}ms`);
  }
};

// Mock implementations
export const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

export const mockSessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

export const mockNavigator = {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined),
    readText: jest.fn().mockResolvedValue(''),
  },
  permissions: {
    query: jest.fn().mockResolvedValue({ state: 'granted' }),
  },
};

// Error simulation utilities
export const simulateNetworkError = () => {
  throw new Error('Network Error');
};

export const simulateTimeoutError = () => {
  throw new Error('Request timeout');
};

export const simulateAuthError = () => {
  throw new Error('Authentication failed');
};

// Performance testing utilities
export const measurePerformance = async (fn: () => Promise<void> | void): Promise<number> => {
  const start = performance.now();
  await fn();
  const end = performance.now();
  return end - start;
};

export const createLargeDataset = (size: number) => {
  return Array.from({ length: size }, (_, index) => ({
    id: `item-${index}`,
    name: `Item ${index}`,
    value: Math.random() * 100,
    category: `Category ${index % 5}`,
    created_at: new Date(Date.now() - Math.random() * 86400000).toISOString(),
  }));
};

// Accessibility testing utilities
export const checkAriaLabels = (container: HTMLElement) => {
  const elementsWithAriaLabel = container.querySelectorAll('[aria-label]');
  const elementsWithAriaLabelledBy = container.querySelectorAll('[aria-labelledby]');
  
  return {
    hasAriaLabels: elementsWithAriaLabel.length > 0,
    hasAriaLabelledBy: elementsWithAriaLabelledBy.length > 0,
    totalAccessibleElements: elementsWithAriaLabel.length + elementsWithAriaLabelledBy.length,
  };
};

export const checkKeyboardNavigation = (element: HTMLElement) => {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  return {
    hasFocusableElements: focusableElements.length > 0,
    focusableCount: focusableElements.length,
  };
};

// Re-export everything from testing-library
export * from '@testing-library/react';
export { customRender as render };
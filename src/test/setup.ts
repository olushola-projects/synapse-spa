
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, afterAll } from 'vitest';

// Cleanup after each test case
afterEach(() => {
  cleanup();
});

// Mock environment variables
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock WebGL context for Three.js components
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: vi.fn().mockImplementation((contextType) => {
    if (contextType === 'webgl' || contextType === 'webgl2') {
      return {
        canvas: {},
        drawingBufferWidth: 1024,
        drawingBufferHeight: 768,
        getExtension: vi.fn(),
        getParameter: vi.fn(),
        createShader: vi.fn(),
        shaderSource: vi.fn(),
        compileShader: vi.fn(),
        createProgram: vi.fn(),
        attachShader: vi.fn(),
        linkProgram: vi.fn(),
        useProgram: vi.fn(),
        createBuffer: vi.fn(),
        bindBuffer: vi.fn(),
        bufferData: vi.fn(),
        enableVertexAttribArray: vi.fn(),
        vertexAttribPointer: vi.fn(),
        uniform1f: vi.fn(),
        uniform2f: vi.fn(),
        uniform3f: vi.fn(),
        uniform4f: vi.fn(),
        uniformMatrix4fv: vi.fn(),
        drawArrays: vi.fn(),
        drawElements: vi.fn(),
        viewport: vi.fn(),
        clear: vi.fn(),
        clearColor: vi.fn(),
        enable: vi.fn(),
        disable: vi.fn(),
        blendFunc: vi.fn(),
        depthFunc: vi.fn(),
      };
    }
    return null;
  }),
});

// Mock Supabase
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      signInWithPassword: vi.fn().mockResolvedValue({ data: { user: null, session: null }, error: null }),
      signUp: vi.fn().mockResolvedValue({ data: { user: null, session: null }, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
      then: vi.fn().mockResolvedValue({ data: [], error: null }),
    })),
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn().mockResolvedValue({ data: null, error: null }),
        download: vi.fn().mockResolvedValue({ data: null, error: null }),
        remove: vi.fn().mockResolvedValue({ data: null, error: null }),
        list: vi.fn().mockResolvedValue({ data: [], error: null }),
      })),
    },
    functions: {
      invoke: vi.fn().mockResolvedValue({ data: null, error: null }),
    },
  })),
}));

// Mock React Router
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/', search: '', hash: '', state: null }),
    useParams: () => ({}),
    useSearchParams: () => [new URLSearchParams(), vi.fn()],
  };
});

// Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    span: 'span',
    button: 'button',
    section: 'section',
    article: 'article',
    header: 'header',
    nav: 'nav',
    main: 'main',
    footer: 'footer',
    aside: 'aside',
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    p: 'p',
    a: 'a',
    img: 'img',
    ul: 'ul',
    ol: 'ol',
    li: 'li',
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  useAnimation: () => ({
    start: vi.fn(),
    stop: vi.fn(),
    set: vi.fn(),
  }),
  useInView: () => true,
  useMotionValue: (initial: any) => ({ get: () => initial, set: vi.fn() }),
  useTransform: () => ({ get: () => 0, set: vi.fn() }),
  useSpring: () => ({ get: () => 0, set: vi.fn() }),
}));

// Mock Three.js
vi.mock('three', () => ({
  WebGLRenderer: vi.fn().mockImplementation(() => ({
    setSize: vi.fn(),
    render: vi.fn(),
    dispose: vi.fn(),
    domElement: document.createElement('canvas'),
  })),
  Scene: vi.fn().mockImplementation(() => ({
    add: vi.fn(),
    remove: vi.fn(),
  })),
  PerspectiveCamera: vi.fn().mockImplementation(() => ({
    position: { set: vi.fn() },
    lookAt: vi.fn(),
  })),
  PlaneGeometry: vi.fn(),
  ShaderMaterial: vi.fn(),
  Mesh: vi.fn().mockImplementation(() => ({
    position: { set: vi.fn() },
    rotation: { set: vi.fn() },
    scale: { set: vi.fn() },
  })),
  Clock: vi.fn().mockImplementation(() => ({
    getElapsedTime: vi.fn().mockReturnValue(0),
  })),
  Vector2: vi.fn(),
  Vector3: vi.fn(),
  Color: vi.fn(),
}));

// Mock @react-three/fiber
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => children,
  useFrame: vi.fn(),
  useThree: () => ({
    gl: { domElement: document.createElement('canvas') },
    scene: {},
    camera: {},
    size: { width: 1024, height: 768 },
  }),
  extend: vi.fn(),
}));

// Mock Tremor components - Fixed syntax
vi.mock('@tremor/react', () => ({
  Card: ({ children, ...props }: any) => React.createElement('div', { 'data-testid': 'tremor-card', ...props }, children),
  Title: ({ children, ...props }: any) => React.createElement('h2', { 'data-testid': 'tremor-title', ...props }, children),
  Text: ({ children, ...props }: any) => React.createElement('p', { 'data-testid': 'tremor-text', ...props }, children),
  Metric: ({ children, ...props }: any) => React.createElement('div', { 'data-testid': 'tremor-metric', ...props }, children),
  Flex: ({ children, ...props }: any) => React.createElement('div', { 'data-testid': 'tremor-flex', ...props }, children),
  Badge: ({ children, ...props }: any) => React.createElement('span', { 'data-testid': 'tremor-badge', ...props }, children),
  ProgressBar: (props: any) => React.createElement('div', { 'data-testid': 'tremor-progress-bar', ...props }),
  AreaChart: (props: any) => React.createElement('div', { 'data-testid': 'tremor-area-chart', ...props }),
  BarChart: (props: any) => React.createElement('div', { 'data-testid': 'tremor-bar-chart', ...props }),
  DonutChart: (props: any) => React.createElement('div', { 'data-testid': 'tremor-donut-chart', ...props }),
  LineChart: (props: any) => React.createElement('div', { 'data-testid': 'tremor-line-chart', ...props }),
  Grid: ({ children, ...props }: any) => React.createElement('div', { 'data-testid': 'tremor-grid', ...props }, children),
  Col: ({ children, ...props }: any) => React.createElement('div', { 'data-testid': 'tremor-col', ...props }, children),
  TabGroup: ({ children, ...props }: any) => React.createElement('div', { 'data-testid': 'tremor-tab-group', ...props }, children),
  TabList: ({ children, ...props }: any) => React.createElement('div', { 'data-testid': 'tremor-tab-list', ...props }, children),
  Tab: ({ children, ...props }: any) => React.createElement('button', { 'data-testid': 'tremor-tab', ...props }, children),
  TabPanels: ({ children, ...props }: any) => React.createElement('div', { 'data-testid': 'tremor-tab-panels', ...props }, children),
  TabPanel: ({ children, ...props }: any) => React.createElement('div', { 'data-testid': 'tremor-tab-panel', ...props }, children),
  Callout: ({ children, ...props }: any) => React.createElement('div', { 'data-testid': 'tremor-callout', ...props }, children),
  Button: ({ children, ...props }: any) => React.createElement('button', { 'data-testid': 'tremor-button', ...props }, children),
  Select: ({ children, ...props }: any) => React.createElement('select', { 'data-testid': 'tremor-select', ...props }, children),
  SelectItem: ({ children, ...props }: any) => React.createElement('option', { 'data-testid': 'tremor-select-item', ...props }, children),
  DateRangePicker: (props: any) => React.createElement('div', { 'data-testid': 'tremor-date-range-picker', ...props }),
}));

// Mock TanStack Table
vi.mock('@tanstack/react-table', () => ({
  useReactTable: vi.fn(() => ({
    getHeaderGroups: vi.fn(() => []),
    getRowModel: vi.fn(() => ({ rows: [] })),
    getFilteredRowModel: vi.fn(() => ({ rows: [] })),
    getFilteredSelectedRowModel: vi.fn(() => ({ rows: [] })),
    getState: vi.fn(() => ({ pagination: { pageIndex: 0 } })),
    getPageCount: vi.fn(() => 1),
    getCanPreviousPage: vi.fn(() => false),
    getCanNextPage: vi.fn(() => false),
    previousPage: vi.fn(),
    nextPage: vi.fn(),
    setPageIndex: vi.fn(),
    setPageSize: vi.fn(),
    toggleAllPageRowsSelected: vi.fn(),
    getAllColumns: vi.fn(() => []),
  })),
  getCoreRowModel: vi.fn(),
  getFilteredRowModel: vi.fn(),
  getPaginationRowModel: vi.fn(),
  getSortedRowModel: vi.fn(),
  getExpandedRowModel: vi.fn(),
  flexRender: vi.fn((component, context) => {
    if (typeof component === 'function') {
      return component(context);
    }
    return component;
  }),
}));

// Mock external APIs
vi.mock('openai', () => ({
  default: vi.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: vi.fn().mockResolvedValue({
          choices: [{ message: { content: 'Mock response' } }],
          usage: { total_tokens: 100 },
        }),
      },
    },
    embeddings: {
      create: vi.fn().mockResolvedValue({
        data: [{ embedding: new Array(1536).fill(0.1) }],
        usage: { total_tokens: 50 },
      }),
    },
  })),
}));

// Mock Hugging Face
global.fetch = vi.fn();

// Console warnings suppression for tests
const originalConsoleWarn = console.warn;
beforeAll(() => {
  console.warn = (...args: any[]) => {
    // Suppress specific warnings that are expected in test environment
    const message = args[0];
    if (
      typeof message === 'string' &&
      (message.includes('React Router') ||
       message.includes('act()') ||
       message.includes('Warning: '))
    ) {
      return;
    }
    originalConsoleWarn(...args);
  };
});

afterAll(() => {
  console.warn = originalConsoleWarn;
});

// Global test utilities
global.testUtils = {
  createMockRegulatoryEvent: (overrides = {}) => ({
    id: 'test-event-1',
    title: 'Test Regulatory Event',
    description: 'A test regulatory event for testing purposes',
    regulation: 'Test Regulation',
    jurisdiction: 'EU',
    effectiveDate: new Date('2024-01-01'),
    status: 'effective' as const,
    impact: 'medium' as const,
    category: 'Compliance',
    tags: ['test', 'regulation'],
    source: 'Test Source',
    lastUpdated: new Date(),
    assignedTo: 'Test User',
    complianceDeadline: new Date('2024-12-31'),
    implementationStatus: 'in-progress' as const,
    riskScore: 65,
    estimatedCost: 50000,
    relatedEvents: [],
    ...overrides,
  }),
  
  createMockUser: (overrides = {}) => ({
    id: 'test-user-1',
    email: 'test@example.com',
    name: 'Test User',
    role: 'analyst',
    permissions: ['read', 'write'],
    ...overrides,
  }),
  
  waitFor: (callback: () => void, timeout = 1000) => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const check = () => {
        try {
          callback();
          resolve(true);
        } catch (error) {
          if (Date.now() - startTime > timeout) {
            reject(error);
          } else {
            setTimeout(check, 10);
          }
        }
      };
      check();
    });
  },
};

// Type declarations for global test utilities
declare global {
  var testUtils: {
    createMockRegulatoryEvent: (overrides?: any) => any;
    createMockUser: (overrides?: any) => any;
    waitFor: (callback: () => void, timeout?: number) => Promise<any>;
  };
}

import { config } from 'dotenv';
import { TextEncoder, TextDecoder } from 'util';

/**
 * Global setup for Jest tests
 * Runs once before all test suites
 */
export default async function globalSetup() {
  // Load environment variables from .env.test file
  config({ path: '.env.test' });
  
  // Set up global polyfills for Node.js environment
  if (typeof global.TextEncoder === 'undefined') {
    global.TextEncoder = TextEncoder;
  }
  
  if (typeof global.TextDecoder === 'undefined') {
    global.TextDecoder = TextDecoder;
  }
  
  // Mock fetch if not available
  if (typeof global.fetch === 'undefined') {
    const { default: fetch, Request, Response, Headers } = await import('node-fetch');
    global.fetch = fetch as any;
    global.Request = Request as any;
    global.Response = Response as any;
    global.Headers = Headers as any;
  }
  
  // Set up crypto polyfill for Node.js
  if (typeof global.crypto === 'undefined') {
    const { webcrypto } = await import('crypto');
    global.crypto = webcrypto as any;
  }
  
  // Set up URL polyfill
  if (typeof global.URL === 'undefined') {
    const { URL, URLSearchParams } = await import('url');
    global.URL = URL as any;
    global.URLSearchParams = URLSearchParams as any;
  }
  
  // Set up performance polyfill
  if (typeof global.performance === 'undefined') {
    const { performance } = await import('perf_hooks');
    global.performance = performance as any;
  }
  
  // Set up ResizeObserver mock
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  
  // Set up IntersectionObserver mock
  global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  
  // Set up MutationObserver mock
  global.MutationObserver = class MutationObserver {
    constructor() {}
    observe() {}
    disconnect() {}
    takeRecords() { return []; }
  };
  
  // Set up matchMedia mock
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
  
  // Set up localStorage mock
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    length: 0,
    key: jest.fn(),
  };
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
  });
  
  // Set up sessionStorage mock
  const sessionStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    length: 0,
    key: jest.fn(),
  };
  Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock
  });
  
  // Set up location mock
  delete (window as any).location;
  window.location = {
    href: 'http://localhost:3000',
    origin: 'http://localhost:3000',
    protocol: 'http:',
    host: 'localhost:3000',
    hostname: 'localhost',
    port: '3000',
    pathname: '/',
    search: '',
    hash: '',
    assign: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
  } as any;
  
  // Set up navigator mock
  Object.defineProperty(window, 'navigator', {
    value: {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      language: 'en-US',
      languages: ['en-US', 'en'],
      platform: 'Win32',
      cookieEnabled: true,
      onLine: true,
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
        readText: jest.fn().mockResolvedValue(''),
      },
      permissions: {
        query: jest.fn().mockResolvedValue({ state: 'granted' }),
      },
    },
    writable: true,
  });
  
  // Set up console methods for testing
  const originalConsole = global.console;
  global.console = {
    ...originalConsole,
    warn: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
  };
  
  // Set up environment variables for testing
  process.env.NODE_ENV = 'test';
  process.env.VITE_SUPABASE_URL = 'https://test.supabase.co';
  process.env.VITE_SUPABASE_ANON_KEY = 'test-anon-key';
  process.env.VITE_OPENAI_API_KEY = 'test-openai-key';
  process.env.VITE_HUGGINGFACE_API_KEY = 'test-hf-key';
  
  console.log('🧪 Global test setup completed');
}
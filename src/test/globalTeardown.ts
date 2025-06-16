/**
 * Global teardown for Jest tests
 * Runs once after all test suites have completed
 */
export default async function globalTeardown() {
  // Clean up any global resources
  
  // Clear all timers
  jest.clearAllTimers();
  
  // Clear all mocks
  jest.clearAllMocks();
  
  // Restore all mocks
  jest.restoreAllMocks();
  
  // Clean up environment variables
  delete process.env.VITE_SUPABASE_URL;
  delete process.env.VITE_SUPABASE_ANON_KEY;
  delete process.env.VITE_OPENAI_API_KEY;
  delete process.env.VITE_HUGGINGFACE_API_KEY;
  
  // Clean up global polyfills
  delete (global as any).TextEncoder;
  delete (global as any).TextDecoder;
  delete (global as any).fetch;
  delete (global as any).Request;
  delete (global as any).Response;
  delete (global as any).Headers;
  delete (global as any).crypto;
  delete (global as any).URL;
  delete (global as any).URLSearchParams;
  delete (global as any).performance;
  delete (global as any).ResizeObserver;
  delete (global as any).IntersectionObserver;
  delete (global as any).MutationObserver;
  
  // Force garbage collection if available
  if (global.gc) {
    global.gc();
  }
  
  console.log('🧹 Global test teardown completed');
}
import { API_CONFIG, REQUEST_CONFIG } from '@/config/api';
import type { ApiError as ApiErrorType } from '@/types/chat-api';

export class ApiError extends Error {
  constructor(
    public status: number,
    public code?: string,
    public details?: unknown,
    message?: string
  ) {
    super(message || 'API Error');
    this.name = 'ApiError';
  }
}

export class ApiClient {
  private readonly baseURL: string;
  private readonly timeout: number;
  private authToken: string | null = null;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.loadAuthToken();
  }

  // Token management
  private loadAuthToken(): void {
    this.authToken = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  }

  public setAuthToken(token: string, remember = false): void {
    this.authToken = token;
    if (remember) {
      localStorage.setItem('auth_token', token);
      sessionStorage.removeItem('auth_token');
    } else {
      sessionStorage.setItem('auth_token', token);
      localStorage.removeItem('auth_token');
    }
  }

  public clearAuthToken(): void {
    this.authToken = null;
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
  }

  public getAuthToken(): string | null {
    return this.authToken;
  }

  private async request<T = unknown>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    // Ensure we have the latest token from storage
    this.loadAuthToken();

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    const config: RequestInit = {
      signal: controller.signal,
      ...options,
      headers: {
        ...REQUEST_CONFIG.DEFAULT_HEADERS,
        ...(this.authToken && { Authorization: `Bearer ${this.authToken}` }),
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          response.status,
          errorData.code,
          errorData.details,
          errorData.message || response.statusText
        );
      }

      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        return await response.json();
      }

      return response as any;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          const TIMEOUT_STATUS = 408;
          throw new ApiError(TIMEOUT_STATUS, 'TIMEOUT', null, 'Request timeout');
        }
        throw new ApiError(0, 'NETWORK_ERROR', error, error.message);
      }

      throw new ApiError(500, 'UNKNOWN_ERROR', error, 'Unknown error occurred');
    }
  }

  async get<T = any>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(`${this.baseURL}${endpoint}`);
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, String(params[key]));
        }
      });
    }

    return this.request<T>(url.pathname + url.search, {
      method: 'GET'
    });
  }

  async post<T = any>(endpoint: string, data?: any, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options
    });
  }

  async postFormData<T = any>(
    endpoint: string,
    formData: FormData,
    options: RequestInit = {}
  ): Promise<T> {
    const headers = { ...options.headers };
    // Remove Content-Type to let browser set it with boundary for FormData
    delete (headers as any)['Content-Type'];

    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers,
      ...options
    });
  }

  async put<T = any>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  async delete<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE'
    });
  }

  // Streaming request for Server-Sent Events
  async *streamRequest(
    endpoint: string,
    data?: any,
    options: RequestInit = {}
  ): AsyncGenerator<any, void, unknown> {
    const url = `${this.baseURL}${endpoint}`;

    // Ensure we have the latest token from storage
    this.loadAuthToken();

    // When FormData is passed via options.body, don't include default Content-Type header
    const isFormData = options.body instanceof FormData;
    const baseHeaders = isFormData
      ? { Accept: 'text/event-stream' } // Only Accept header for FormData
      : REQUEST_CONFIG.STREAMING_HEADERS; // Full streaming headers for JSON

    const config: RequestInit = {
      method: 'POST',
      body: options.body || (data ? JSON.stringify(data) : undefined),
      ...options,
      headers: {
        ...baseHeaders,
        ...(this.authToken && { Authorization: `Bearer ${this.authToken}` }),
        ...options.headers
      }
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        errorData.code,
        errorData.details,
        errorData.message || response.statusText
      );
    }

    if (!response.body) {
      throw new ApiError(500, 'NO_STREAM', null, 'Response body is null');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { value, done } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');

        // Keep incomplete line in buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const DATA_PREFIX_LENGTH = 6;
            const data = line.slice(DATA_PREFIX_LENGTH).trim();
            if (data === '[DONE]') {
              return;
            }

            try {
              const parsed = JSON.parse(data);
              yield parsed;
            } catch (_error) {
              console.warn('Failed to parse SSE data:', data);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string; version: string }> {
    return this.get(API_CONFIG.ENDPOINTS.CHAT.HEALTH);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

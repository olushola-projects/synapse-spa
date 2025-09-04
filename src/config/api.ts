// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL,
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT, 10),
  ENDPOINTS: {
    // Chat endpoints
    CHAT: {
      AI_CHAT: '/chat/ai-chat',
      THREADS: '/chat/threads',
      MESSAGES: '/chat/messages',
      HEALTH: '/chat/health'
    },
    // User management endpoints
    USERS: {
      REGISTER: '/users/register',
      LOGIN: '/users/login',
      LOGOUT: '/users/logout',
      LOGOUT_ALL: '/users/logout-all',
      ME: '/users/me',
      CHANGE_PASSWORD: '/users/change-password',
      FORGOT_PASSWORD: '/users/forgot-password',
      RESET_PASSWORD: '/users/reset-password',
      SESSIONS: '/users/sessions',
      VERIFY_EMAIL: '/users/verify-email',
      RESEND_VERIFICATION: '/users/resend-verification',
      HEALTH: '/users/health'
    },
    // User memory endpoints
    MEMORY: {
      USER_MEMORY: '/memory/user-memory'
    },
    // MCP Server endpoints
    MCP: {
      SERVERS: '/mcp/servers',
      TOOLS: '/mcp/tools'
    },
    // Admin endpoints
    ADMIN: {
      DASHBOARD: '/admin/dashboard',
      VECTOR_STORES: '/admin/vector-stores',
      VECTOR_STORE_UPLOAD: '/admin/vector-stores/upload-documents',
      VECTOR_STORE_JSON_UPLOAD: (id: string) => `/admin/vector-stores/${id}/upload-json`,
      VECTOR_STORE_FILES: (id: string) => `/admin/vector-stores/${id}/files`,
      VECTOR_STORE_REMOVE_FILE: (storeId: string, fileId: string) =>
        `/admin/vector-stores/${storeId}/files/${fileId}`,
      VECTOR_STORE_SEARCH: (id: string) => `/admin/vector-stores/${id}/search`
    }
  }
} as const;

export const REQUEST_CONFIG = {
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json'
  },
  MULTIPART_HEADERS: {
    // Content-Type will be set automatically for multipart/form-data
  },
  STREAMING_HEADERS: {
    Accept: 'text/event-stream',
    'Content-Type': 'application/json'
  }
} as const;

import { apiClient } from '@/lib/api-client';
import { API_CONFIG } from '@/config/api';
import type {
  ChatThread,
  ChatMessage,
  CreateThreadDto,
  CreateMessageDto,
  ChatRequestDto,
  ThreadStatus,
  MessageRole,
  StreamChunk
} from '@/types/chat-api';

export class ChatApiService {
  // Thread management
  async createThread(data: Omit<CreateThreadDto, 'userId'>): Promise<ChatThread> {
    // Note: userId is automatically set by the backend from the authenticated user
    return apiClient.post<ChatThread>(API_CONFIG.ENDPOINTS.CHAT.THREADS, data);
  }

  async getThread(threadId: string): Promise<ChatThread> {
    return apiClient.get<ChatThread>(`${API_CONFIG.ENDPOINTS.CHAT.THREADS}/${threadId}`);
  }

  async getUserThreads(_userId: string, limit?: number): Promise<ChatThread[]> {
    // Note: userId parameter is kept for API compatibility but not used in the request
    // The backend uses the authenticated user from the AuthGuard
    const params = limit ? { limit } : undefined;
    return apiClient.get<ChatThread[]>(API_CONFIG.ENDPOINTS.CHAT.THREADS, params);
  }

  async updateThread(threadId: string, updates: Partial<ChatThread>): Promise<ChatThread> {
    return apiClient.put<ChatThread>(`${API_CONFIG.ENDPOINTS.CHAT.THREADS}/${threadId}`, updates);
  }

  async deleteThread(threadId: string): Promise<void> {
    return apiClient.delete<void>(`${API_CONFIG.ENDPOINTS.CHAT.THREADS}/${threadId}`);
  }

  async getThreadsByStatus(status: ThreadStatus, limit?: number): Promise<ChatThread[]> {
    const params = limit ? { limit } : undefined;
    return apiClient.get<ChatThread[]>(
      `${API_CONFIG.ENDPOINTS.CHAT.THREADS}/status/${status}`,
      params
    );
  }

  // Message management
  async createMessage(data: CreateMessageDto): Promise<ChatMessage> {
    if (data.attachments && data.attachments.length > 0) {
      const formData = new FormData();
      formData.append('threadId', data.threadId);
      formData.append('role', data.role);
      formData.append('content', data.content);

      if (data.metadata) {
        formData.append('metadata', JSON.stringify(data.metadata));
      }

      data.attachments.forEach((file, _index) => {
        formData.append('attachments', file);
      });

      return apiClient.postFormData<ChatMessage>(API_CONFIG.ENDPOINTS.CHAT.MESSAGES, formData);
    }

    return apiClient.post<ChatMessage>(API_CONFIG.ENDPOINTS.CHAT.MESSAGES, data);
  }

  async getMessage(messageId: string): Promise<ChatMessage> {
    return apiClient.get<ChatMessage>(`${API_CONFIG.ENDPOINTS.CHAT.MESSAGES}/${messageId}`);
  }

  async getThreadMessages(threadId: string, limit?: number): Promise<ChatMessage[]> {
    const params = limit ? { limit } : undefined;
    return apiClient.get<ChatMessage[]>(
      `${API_CONFIG.ENDPOINTS.CHAT.THREADS}/${threadId}/messages`,
      params
    );
  }

  async getMessagesByRole(threadId: string, role: MessageRole): Promise<ChatMessage[]> {
    return apiClient.get<ChatMessage[]>(
      `${API_CONFIG.ENDPOINTS.CHAT.THREADS}/${threadId}/messages/role/${role}`
    );
  }

  // AI Chat - Non-streaming
  async sendMessage(data: ChatRequestDto): Promise<ChatMessage> {
    if (data.attachments && data.attachments.length > 0) {
      const formData = new FormData();
      formData.append('threadId', data.threadId);
      formData.append('content', data.content);

      if (data.expertType) {
        formData.append('expertType', data.expertType);
      }
      if (data.systemInstructions) {
        formData.append('systemInstructions', data.systemInstructions);
      }
      if (data.temperature !== undefined) {
        formData.append('temperature', data.temperature.toString());
      }
      if (data.maxTokens !== undefined) {
        formData.append('maxTokens', data.maxTokens.toString());
      }
      if (data.tools) {
        formData.append('tools', JSON.stringify(data.tools));
      }

      data.attachments.forEach(file => {
        formData.append('attachments', file);
      });

      return apiClient.postFormData<ChatMessage>(API_CONFIG.ENDPOINTS.CHAT.AI_CHAT, formData);
    }

    return apiClient.post<ChatMessage>(API_CONFIG.ENDPOINTS.CHAT.AI_CHAT, data);
  }

  // AI Chat - Streaming
  async *sendMessageStream(data: ChatRequestDto): AsyncGenerator<StreamChunk, void, unknown> {
    if (data.attachments && data.attachments.length > 0) {
      const formData = new FormData();
      formData.append('threadId', data.threadId);
      formData.append('content', data.content);

      if (data.expertType) {
        formData.append('expertType', data.expertType);
      }
      if (data.systemInstructions) {
        formData.append('systemInstructions', data.systemInstructions);
      }
      if (data.temperature !== undefined) {
        formData.append('temperature', data.temperature.toString());
      }
      if (data.maxTokens !== undefined) {
        formData.append('maxTokens', data.maxTokens.toString());
      }
      if (data.tools) {
        formData.append('tools', JSON.stringify(data.tools));
      }

      data.attachments.forEach(file => {
        formData.append('attachments', file);
      });

      yield* apiClient.streamRequest(API_CONFIG.ENDPOINTS.CHAT.AI_CHAT, undefined, {
        body: formData,
        headers: {
          Accept: 'text/event-stream'
          // Don't set Content-Type for FormData
        }
      });
    } else {
      yield* apiClient.streamRequest(API_CONFIG.ENDPOINTS.CHAT.AI_CHAT, data);
    }
  }

  // Batch operations
  async batchGetThreads(threadIds: string[]): Promise<ChatThread[]> {
    return apiClient.post<ChatThread[]>(`${API_CONFIG.ENDPOINTS.CHAT.THREADS}/batch`, {
      threadIds
    });
  }

  async batchGetMessages(messageIds: string[]): Promise<ChatMessage[]> {
    return apiClient.post<ChatMessage[]>(`${API_CONFIG.ENDPOINTS.CHAT.MESSAGES}/batch`, {
      messageIds
    });
  }

  // Analytics
  async getThreadAnalytics(threadId: string): Promise<Record<string, unknown>> {
    return apiClient.get<Record<string, unknown>>(
      `${API_CONFIG.ENDPOINTS.CHAT.THREADS}/${threadId}/analytics`
    );
  }

  async getUserAnalytics(userId: string): Promise<Record<string, unknown>> {
    return apiClient.get<Record<string, unknown>>(
      `${API_CONFIG.ENDPOINTS.CHAT.THREADS.replace('/threads', '')}/users/${userId}/analytics`
    );
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string; version: string }> {
    return apiClient.get<{ status: string; timestamp: string; version: string }>(
      API_CONFIG.ENDPOINTS.CHAT.HEALTH
    );
  }
}

// Export singleton instance
export const chatApiService = new ChatApiService();

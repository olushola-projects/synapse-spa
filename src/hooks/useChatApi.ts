import { useState, useCallback, useRef } from 'react';
import { chatApiService } from '@/services/chat-api';
import { useAuth } from '@/contexts/AuthContext';
import type {
  ChatThread,
  ChatMessage,
  CreateThreadDto,
  ChatRequestDto,
  StreamChunk,
  ApiError as ChatApiError
} from '@/types/chat-api';

interface UseChatApiReturn {
  // State
  threads: ChatThread[];
  currentThread: ChatThread | null;
  messages: ChatMessage[];
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;

  // Thread operations
  createThread: (title: string, metadata?: Record<string, any>) => Promise<ChatThread | null>;
  loadThread: (threadId: string) => Promise<void>;
  loadUserThreads: (limit?: number) => Promise<void>;
  deleteThread: (threadId: string) => Promise<void>;

  // Message operations
  sendMessage: (
    content: string,
    options?: {
      systemInstructions?: string;
      temperature?: number;
      maxTokens?: number;
      tools?: string[];
      attachments?: File[];
    }
  ) => Promise<ChatMessage | null>;

  sendMessageStream: (
    content: string,
    options?: {
      systemInstructions?: string;
      temperature?: number;
      maxTokens?: number;
      tools?: string[];
      attachments?: File[];
    }
  ) => Promise<void>;

  // Utility
  clearError: () => void;
  healthCheck: () => Promise<boolean>;
}

export const useChatApi = (): UseChatApiReturn => {
  const { user } = useAuth();
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [currentThread, setCurrentThread] = useState<ChatThread | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs for streaming
  const streamingMessageRef = useRef<string>('');
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleError = useCallback((err: unknown) => {
    console.error('Chat API Error:', err);
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError('An unknown error occurred');
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Thread operations
  const createThread = useCallback(
    async (title: string, metadata?: Record<string, any>): Promise<ChatThread | null> => {
      if (!user) {
        setError('User not authenticated');
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const threadData: CreateThreadDto = {
          userId: user.id,
          title,
          metadata
        };

        const newThread = await chatApiService.createThread(threadData);
        setThreads(prev => [newThread, ...prev]);
        setCurrentThread(newThread);
        setMessages([]); // Clear messages for new thread
        return newThread;
      } catch (err) {
        handleError(err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [user, handleError]
  );

  const loadThread = useCallback(
    async (threadId: string): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const [thread, threadMessages] = await Promise.all([
          chatApiService.getThread(threadId),
          chatApiService.getThreadMessages(threadId)
        ]);

        setCurrentThread(thread);
        setMessages(threadMessages);
      } catch (err) {
        handleError(err);
      } finally {
        setIsLoading(false);
      }
    },
    [handleError]
  );

  const loadUserThreads = useCallback(
    async (limit?: number): Promise<void> => {
      if (!user) {
        setError('User not authenticated');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const userThreads = await chatApiService.getUserThreads(user.id, limit);
        setThreads(userThreads);
      } catch (err) {
        handleError(err);
      } finally {
        setIsLoading(false);
      }
    },
    [user, handleError]
  );

  const deleteThread = useCallback(
    async (threadId: string): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        await chatApiService.deleteThread(threadId);
        setThreads(prev => prev.filter(t => t.id !== threadId));

        // Clear current thread if it was deleted
        if (currentThread?.id === threadId) {
          setCurrentThread(null);
          setMessages([]);
        }
      } catch (err) {
        handleError(err);
      } finally {
        setIsLoading(false);
      }
    },
    [currentThread, handleError]
  );

  // Message operations
  const sendMessage = useCallback(
    async (
      content: string,
      options?: {
        systemInstructions?: string;
        temperature?: number;
        maxTokens?: number;
        tools?: string[];
        attachments?: File[];
      }
    ): Promise<ChatMessage | null> => {
      if (!currentThread) {
        setError('No active thread');
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const requestData: ChatRequestDto = {
          threadId: currentThread.id,
          content,
          ...options
        };

        const response = await chatApiService.sendMessage(requestData);

        // Refresh thread messages to get the complete conversation
        const updatedMessages = await chatApiService.getThreadMessages(currentThread.id);
        setMessages(updatedMessages);

        return response;
      } catch (err) {
        handleError(err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [currentThread, handleError]
  );

  const sendMessageStream = useCallback(
    async (
      content: string,
      options?: {
        systemInstructions?: string;
        temperature?: number;
        maxTokens?: number;
        tools?: string[];
        attachments?: File[];
      }
    ): Promise<void> => {
      if (!currentThread) {
        setError('No active thread');
        return;
      }

      setIsStreaming(true);
      setError(null);
      streamingMessageRef.current = '';

      // Create abort controller for this request
      abortControllerRef.current = new AbortController();

      try {
        const requestData: ChatRequestDto = {
          threadId: currentThread.id,
          content,
          ...options
        };

        // Add user message immediately
        const userMessage: ChatMessage = {
          id: `temp-${Date.now()}`,
          threadId: currentThread.id,
          role: 'user' as const,
          content,
          status: 'completed' as const,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        setMessages(prev => [...prev, userMessage]);

        // Add placeholder for assistant message
        const assistantMessage: ChatMessage = {
          id: `temp-assistant-${Date.now()}`,
          threadId: currentThread.id,
          role: 'assistant' as const,
          content: '',
          status: 'processing' as const,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        setMessages(prev => [...prev, assistantMessage]);

        // Stream the response
        for await (const chunk of chatApiService.sendMessageStream(requestData)) {
          if (abortControllerRef.current?.signal.aborted) {
            break;
          }

          const streamChunk = chunk as StreamChunk;

          if (streamChunk.type === 'message') {
            streamingMessageRef.current += streamChunk.data.content || '';

            // Update the assistant message with streaming content
            setMessages(prev =>
              prev.map(msg =>
                msg.id === assistantMessage.id
                  ? { ...msg, content: streamingMessageRef.current }
                  : msg
              )
            );
          } else if (streamChunk.type === 'finished') {
            // Mark message as completed
            setMessages(prev =>
              prev.map(msg =>
                msg.id === assistantMessage.id
                  ? {
                      ...msg,
                      status: 'completed' as const,
                      id: streamChunk.data.messageId || msg.id
                    }
                  : msg
              )
            );
            break;
          } else if (streamChunk.type === 'error') {
            setError(streamChunk.data.error || 'Streaming error occurred');
            setMessages(prev =>
              prev.map(msg =>
                msg.id === assistantMessage.id ? { ...msg, status: 'failed' as const } : msg
              )
            );
            break;
          }
        }
      } catch (err) {
        handleError(err);
        // Remove the temporary assistant message on error
        setMessages(prev => prev.filter(msg => !msg.id.startsWith('temp-assistant-')));
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [currentThread, handleError]
  );

  // Health check
  const healthCheck = useCallback(async (): Promise<boolean> => {
    try {
      const health = await chatApiService.healthCheck();
      return health.status === 'healthy';
    } catch (err) {
      console.error('Health check failed:', err);
      return false;
    }
  }, []);

  return {
    // State
    threads,
    currentThread,
    messages,
    isLoading,
    isStreaming,
    error,

    // Thread operations
    createThread,
    loadThread,
    loadUserThreads,
    deleteThread,

    // Message operations
    sendMessage,
    sendMessageStream,

    // Utility
    clearError,
    healthCheck
  };
};

export default useChatApi;

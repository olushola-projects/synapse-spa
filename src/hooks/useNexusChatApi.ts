import { useState, useCallback, useRef, useEffect } from 'react';
import { chatApiService } from '@/services/chat-api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import {
  ExpertType,
  type ChatThread,
  type ChatMessage,
  type ChatRequestDto,
  MessageRole
} from '@/types/chat-api';

interface ChatState {
  thread: ChatThread | null;
  messages: ChatMessage[];
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;
  streamingMessage: string;
}

interface UseNexusChatApiOptions {
  expertType?: ExpertType;
  temperature?: number;
  maxTokens?: number;
  systemInstructions?: string;
  threadId?: string; // Optional thread ID to load existing thread
  onThreadUpdate?: (threadId: string, updates: Partial<ChatThread>) => void; // Callback for thread updates
}

export const useNexusChatApi = (options: UseNexusChatApiOptions = {}) => {
  const { user } = useAuth();
  const [state, setState] = useState<ChatState>({
    thread: null,
    messages: [],
    isLoading: false,
    isStreaming: false,
    error: null,
    streamingMessage: ''
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesRef = useRef<ChatMessage[]>([]);

  // Update ref when messages change
  useEffect(() => {
    messagesRef.current = state.messages;
  }, [state.messages]);

  // Initialize or load thread
  const initializeThread = useCallback(
    async (threadId?: string) => {
      if (!user) {
        setState(prev => ({ ...prev, error: 'User not authenticated' }));
        return null;
      }

      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        let thread: ChatThread;

        if (threadId || options.threadId) {
          // Load existing thread
          const existingThreadId = threadId || options.threadId!;
          thread = await chatApiService.getThread(existingThreadId);

          // Load thread messages
          const messages = await chatApiService.getThreadMessages(existingThreadId);
          setState(prev => ({
            ...prev,
            thread,
            messages,
            isLoading: false
          }));
        } else {
          // Create new thread
          thread = await chatApiService.createThread({
            title: `SFDR Expert Chat - ${new Date().toLocaleDateString()}`,
            metadata: {
              expertType: options.expertType || ExpertType.SFDR_EXPERT,
              createdFrom: 'nexus-agent'
            }
          });

          setState(prev => ({
            ...prev,
            thread,
            messages: [], // New thread has no messages
            isLoading: false
          }));
        }

        return thread;
      } catch (error: any) {
        const errorMessage = error?.message || 'Failed to initialize chat thread';
        setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
        toast({
          title: 'Chat Error',
          description: errorMessage,
          variant: 'destructive'
        });
        return null;
      }
    },
    [user, options.expertType, options.threadId]
  );

  // Helper function to generate thread title from message
  const generateThreadTitle = (content: string): string => {
    // Clean the content and take first 50 characters
    const cleaned = content.trim().replace(/\s+/g, ' ');
    if (cleaned.length <= 50) {
      return cleaned;
    }
    // Find the last complete word within 50 characters
    const truncated = cleaned.substring(0, 50);
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    return lastSpaceIndex > 20 ? truncated.substring(0, lastSpaceIndex) + '...' : truncated + '...';
  };

  // Send message with streaming
  const sendMessage = useCallback(
    async (content: string, attachments?: File[]) => {
      if (!state.thread) {
        const newThread = await initializeThread();
        if (!newThread) return;
      }

      const currentThread = state.thread!;
      const isFirstMessage = state.messages.length === 0;

      try {
        // Cancel any ongoing stream
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        setState(prev => ({
          ...prev,
          isStreaming: true,
          error: null,
          streamingMessage: ''
        }));

        // Add user message optimistically
        const userMessage: ChatMessage = {
          id: `temp-${Date.now()}`,
          threadId: currentThread.id,
          role: MessageRole.USER,
          content,
          status: 'completed' as any,
          createdAt: new Date(),
          updatedAt: new Date(),
          ...(attachments && {
            attachments: attachments.map(file => ({
              id: `temp-${Date.now()}-${file.name}`,
              name: file.name,
              type: file.type,
              size: file.size,
              url: ''
            }))
          })
        };

        setState(prev => ({
          ...prev,
          messages: [...prev.messages, userMessage]
        }));

        // Update thread title if this is the first message
        if (isFirstMessage) {
          try {
            const newTitle = generateThreadTitle(content);
            await chatApiService.updateThread(currentThread.id, { title: newTitle });

            // Update local thread state
            setState(prev => ({
              ...prev,
              thread: prev.thread ? { ...prev.thread, title: newTitle } : prev.thread
            }));

            // Notify parent component of thread update
            if (options.onThreadUpdate) {
              options.onThreadUpdate(currentThread.id, { title: newTitle });
            }
          } catch (error) {
            // Log error but don't fail the message sending
            console.warn('Failed to update thread title:', error);
          }
        }

        // Prepare chat request
        const chatRequest: ChatRequestDto = {
          threadId: currentThread.id,
          content,
          expertType: options.expertType || ExpertType.SFDR_EXPERT,
          systemInstructions: options.systemInstructions,
          temperature: options.temperature,
          maxTokens: options.maxTokens,
          attachments
        };

        // Start streaming response
        let streamingContent = '';
        let assistantMessage: ChatMessage | null = null;

        for await (const chunk of chatApiService.sendMessageStream(chatRequest)) {
          // Check if request was aborted
          if (abortControllerRef.current?.signal.aborted) {
            break;
          }

          if (chunk.type === 'content') {
            // Handle streaming content chunks
            if (chunk.data && typeof chunk.data === 'object' && 'content' in chunk.data) {
              streamingContent += chunk.data.content || '';
              setState(prev => ({ ...prev, streamingMessage: streamingContent }));
            }
          } else if (chunk.type === 'message') {
            // Handle complete message chunks (for user messages or completed assistant messages)
            // These don't contribute to streaming content but might be useful for state updates
          } else if (chunk.type === 'finished') {
            // Create final assistant message
            assistantMessage = {
              id: chunk.data.id || `msg-${Date.now()}`,
              threadId: currentThread.id,
              role: MessageRole.ASSISTANT,
              content: streamingContent,
              status: 'completed' as any,
              metadata: chunk.data.metadata,
              createdAt: new Date(),
              updatedAt: new Date()
            };

            setState(prev => ({
              ...prev,
              messages: [...prev.messages, assistantMessage!],
              streamingMessage: '',
              isStreaming: false
            }));
          } else if (chunk.type === 'error') {
            throw new Error(chunk.data.message || 'Streaming error occurred');
          }
        }
      } catch (error: any) {
        const errorMessage = error?.message || 'Failed to send message';
        setState(prev => ({
          ...prev,
          error: errorMessage,
          isStreaming: false,
          streamingMessage: ''
        }));

        toast({
          title: 'Message Error',
          description: errorMessage,
          variant: 'destructive'
        });
      }
    },
    [state.thread, initializeThread, options]
  );

  // Load thread messages
  const loadMessages = useCallback(async (threadId: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const [thread, messages] = await Promise.all([
        chatApiService.getThread(threadId),
        chatApiService.getThreadMessages(threadId)
      ]);

      setState(prev => ({
        ...prev,
        thread,
        messages,
        isLoading: false
      }));
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to load messages';
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      toast({
        title: 'Load Error',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  }, []);

  // Clear chat
  const clearChat = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setState({
      thread: null,
      messages: [],
      isLoading: false,
      isStreaming: false,
      error: null,
      streamingMessage: ''
    });
  }, []);

  // Stop streaming
  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setState(prev => ({
      ...prev,
      isStreaming: false,
      streamingMessage: ''
    }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    // State
    thread: state.thread,
    messages: state.messages,
    isLoading: state.isLoading,
    isStreaming: state.isStreaming,
    error: state.error,
    streamingMessage: state.streamingMessage,

    // Actions
    initializeThread,
    sendMessage,
    loadMessages,
    clearChat,
    stopStreaming
  };
};

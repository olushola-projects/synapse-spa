import { useState, useCallback, useEffect } from 'react';
import { chatApiService } from '@/services/chat-api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { ChatThread, ThreadStatus } from '@/types/chat-api';

interface ThreadManagementState {
  threads: ChatThread[];
  isLoading: boolean;
  error: string | null;
}

export const useThreadManagement = () => {
  const { user } = useAuth();
  const [state, setState] = useState<ThreadManagementState>({
    threads: [],
    isLoading: false,
    error: null
  });

  // Load user threads
  const loadThreads = useCallback(async () => {
    if (!user) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const threads = await chatApiService.getUserThreads(user.id);
      setState(prev => ({
        ...prev,
        threads: threads.sort((a, b) => {
          const aDate = new Date(a.lastMessageAt || a.createdAt);
          const bDate = new Date(b.lastMessageAt || b.createdAt);
          return bDate.getTime() - aDate.getTime();
        }),
        isLoading: false
      }));
    } catch (error) {
      console.error('Failed to load threads:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to load chat threads',
        isLoading: false
      }));
      toast({
        title: 'Error',
        description: 'Failed to load chat threads',
        variant: 'destructive'
      });
    }
  }, [user]);

  // Create new thread
  const createThread = useCallback(
    async (title?: string): Promise<ChatThread | null> => {
      if (!user) return null;

      setState(prev => ({ ...prev, isLoading: true, error: null }));

             try {
         const newThread = await chatApiService.createThread({
           title: title || `Chat ${new Date().toLocaleDateString()}`,
           metadata: {
             expertType: 'sfdr-expert'
           }
         });

        setState(prev => ({
          ...prev,
          threads: [newThread, ...prev.threads],
          isLoading: false
        }));

        toast({
          title: 'Success',
          description: 'New chat thread created'
        });

        return newThread;
      } catch (error) {
        console.error('Failed to create thread:', error);
        setState(prev => ({
          ...prev,
          error: 'Failed to create thread',
          isLoading: false
        }));
        toast({
          title: 'Error',
          description: 'Failed to create new thread',
          variant: 'destructive'
        });
        return null;
      }
    },
    [user]
  );

  // Update thread
  const updateThread = useCallback(async (threadId: string, updates: Partial<ChatThread>) => {
    setState(prev => ({ ...prev, error: null }));

    try {
      const updatedThread = await chatApiService.updateThread(threadId, updates);

      setState(prev => ({
        ...prev,
        threads: prev.threads.map(thread => (thread.id === threadId ? updatedThread : thread))
      }));

      toast({
        title: 'Success',
        description: 'Thread updated successfully'
      });
    } catch (error) {
      console.error('Failed to update thread:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to update thread'
      }));
      toast({
        title: 'Error',
        description: 'Failed to update thread',
        variant: 'destructive'
      });
    }
  }, []);

  // Delete thread
  const deleteThread = useCallback(async (threadId: string) => {
    setState(prev => ({ ...prev, error: null }));

    try {
      await chatApiService.deleteThread(threadId);

      setState(prev => ({
        ...prev,
        threads: prev.threads.filter(thread => thread.id !== threadId)
      }));

      toast({
        title: 'Success',
        description: 'Thread deleted successfully'
      });
    } catch (error) {
      console.error('Failed to delete thread:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to delete thread'
      }));
      toast({
        title: 'Error',
        description: 'Failed to delete thread',
        variant: 'destructive'
      });
    }
  }, []);

  // Archive thread
  const archiveThread = useCallback(
    async (threadId: string) => {
      await updateThread(threadId, { status: ThreadStatus.ARCHIVED });
    },
    [updateThread]
  );

  // Get thread by ID
  const getThread = useCallback(
    (threadId: string): ChatThread | undefined => {
      return state.threads.find(thread => thread.id === threadId);
    },
    [state.threads]
  );

  // Load threads on mount and when user changes
  useEffect(() => {
    if (user) {
      loadThreads();
    }
  }, [user, loadThreads]);

  return {
    // State
    threads: state.threads,
    isLoading: state.isLoading,
    error: state.error,

    // Actions
    loadThreads,
    createThread,
    updateThread,
    deleteThread,
    archiveThread,
    getThread
  };
};

export default useThreadManagement;

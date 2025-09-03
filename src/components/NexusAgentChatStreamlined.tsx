import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useCallback
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { EnhancedInput } from '@/components/ui/enhanced-input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, AlertCircle, Shield, User, Bot, FileText, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { useNexusChatApi } from '@/hooks/useNexusChatApi';
import { useThreadManagement } from '@/hooks/useThreadManagement';
import { chatApiService } from '@/services/chat-api';
import ThreadSidebar from '@/components/ThreadSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { ExpertType, MessageRole, MessageStatus, type ChatThread } from '@/types/chat-api';

// Custom markdown components
const MarkdownComponents = {
  pre: ({ children, ...props }: React.ComponentProps<'pre'>) => (
    <pre {...props} className='overflow-x-auto bg-muted p-3 rounded-md text-sm border'>
      {children}
    </pre>
  ),
  code: ({ children, ...props }: React.ComponentProps<'code'>) => (
    <code {...props} className='px-1 py-0.5 rounded bg-muted text-foreground text-sm font-mono'>
      {children}
    </code>
  ),
  table: ({ children, ...props }: React.ComponentProps<'table'>) => (
    <div className='overflow-x-auto my-2'>
      <table {...props} className='min-w-full border-collapse border border-muted'>
        {children}
      </table>
    </div>
  )
};

interface NexusAgentChatStreamlinedProps {
  className?: string;
  suggestions?: string[];
}

interface ChatHandle {
  sendMessage: (message: string) => void;
  clearChat: () => void;
}

/**
 * Streamlined Nexus Agent Chat component using the chat API with streaming
 * Specialized for SFDR compliance with sfdr-expert type
 */
export const NexusAgentChatStreamlined = forwardRef<ChatHandle, NexusAgentChatStreamlinedProps>(
  ({ className, suggestions = [] }, ref) => {
    const { user } = useAuth();
    const [inputValue, setInputValue] = useState('');

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [currentThreadId, setCurrentThreadId] = useState<string | undefined>();
    const [isInitialized, setIsInitialized] = useState(false);
    const [initializedForUserId, setInitializedForUserId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Thread management
    const {
      threads,
      isLoading: isThreadsLoading,
      createThread,
      updateThread,
      deleteThread,
      loadThreads
    } = useThreadManagement();

    // Silent thread update for automatic operations (no toast)
    const handleSilentThreadUpdate = useCallback(
      async (threadId: string, updates: Partial<ChatThread>) => {
        try {
          await chatApiService.updateThread(threadId, updates);

          // Reload threads to reflect the change
          await loadThreads();
        } catch (error) {
          console.warn('Silent thread update failed:', error);
        }
      },
      [loadThreads]
    );

    // Chat API for current thread
    const {
      thread,
      messages,
      isLoading,
      isStreaming,
      error,
      streamingMessage,
      initializeThread,
      sendMessage,
      clearChat,
      stopStreaming
    } = useNexusChatApi({
      threadId: currentThreadId,
      expertType: ExpertType.SFDR_EXPERT,
      temperature: 0.7,
      maxTokens: 2000,
      systemInstructions:
        'You are Sophia, an expert SFDR (Sustainable Finance Disclosure Regulation) compliance advisor. Provide precise, regulatory-compliant guidance for ESG compliance, article classification, PAI indicators, and EU taxonomy alignment.',
      onThreadUpdate: handleSilentThreadUpdate
    });

    // Initialize thread when currentThreadId changes
    useEffect(() => {
      if (user?.id && currentThreadId) {
        initializeThread(currentThreadId);
      }
    }, [user?.id, currentThreadId, initializeThread]);

    // Reset initialization when user ID changes (not user object reference)
    useEffect(() => {
      if (user?.id && user.id !== initializedForUserId) {
        setIsInitialized(false);
        setCurrentThreadId(undefined);
        setInitializedForUserId(user.id);
      }
    }, [user?.id, initializedForUserId]);

    // Handle initial thread selection after threads are loaded (only once per user)
    useEffect(() => {
      // Only run initialization if:
      // 1. User is authenticated
      // 2. We haven't initialized for this user yet
      // 3. Threads have finished loading
      // 4. No current thread is selected
      if (user?.id && user.id === initializedForUserId && !isInitialized && !isThreadsLoading) {
        const initializeThreadSelection = async () => {
          // Mark as initialized immediately to prevent multiple runs
          setIsInitialized(true);
          console.log(
            '🔄 Initializing threads for user:',
            user.id,
            'Threads count:',
            threads.length
          );

          if (threads.length > 0) {
            // Select the most recent thread (threads are sorted by creation date, latest first)
            const mostRecentThread = threads[0];
            if (mostRecentThread) {
              console.log('✅ Selecting existing thread:', mostRecentThread.id);
              setCurrentThreadId(mostRecentThread.id);
            }
          } else {
            // Only create a new thread if no threads exist (new user)
            console.log('🆕 Creating new thread for new user');
            try {
              const newThread = await createThread();
              if (newThread) {
                console.log('✅ Created new thread:', newThread.id);
                setCurrentThreadId(newThread.id);
              }
            } catch (error) {
              console.error('❌ Failed to create initial thread:', error);
              // Reset initialization flag so user can try again
              setIsInitialized(false);
            }
          }
        };

        initializeThreadSelection();
      }
    }, [user?.id, initializedForUserId, isInitialized, isThreadsLoading, threads, createThread]);

    // Thread management handlers
    const handleCreateNewThread = useCallback(async () => {
      const newThread = await createThread();
      if (newThread) {
        setCurrentThreadId(newThread.id);
      }
    }, [createThread]);

    const handleSelectThread = async (threadId: string) => {
      setCurrentThreadId(threadId);
    };

    const handleUpdateThread = async (threadId: string, updates: Partial<ChatThread>) => {
      await updateThread(threadId, updates);
    };

    const handleDeleteThread = async (threadId: string) => {
      await deleteThread(threadId);
      // If we deleted the current thread, select another one or create new
      if (threadId === currentThreadId) {
        setCurrentThreadId(undefined);

        // Find remaining threads (excluding the one we just deleted)
        const remainingThreads = threads.filter(t => t.id !== threadId);

        if (remainingThreads.length > 0) {
          // Select the most recent remaining thread
          const mostRecentThread = remainingThreads[0];
          if (mostRecentThread) {
            setCurrentThreadId(mostRecentThread.id);
          }
        } else {
          // Only create a new thread if no threads remain
          await handleCreateNewThread();
        }
      }
    };

    // Auto-scroll to bottom
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, streamingMessage]);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      sendMessage: (message: string) => {
        setInputValue(message);
        sendMessage(message);
      },
      clearChat
    }));

    const allMessages = [...messages];
    if (isStreaming && streamingMessage) {
      allMessages.push({
        id: 'streaming',
        threadId: thread?.id || '',
        role: MessageRole.ASSISTANT,
        content: streamingMessage,
        status: MessageStatus.PROCESSING,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    return (
      <div
        className={cn('flex h-[600px] bg-background border rounded-lg overflow-hidden', className)}
      >
        {/* Thread Sidebar */}
        <ThreadSidebar
          threads={threads}
          currentThreadId={currentThreadId}
          isLoading={isThreadsLoading}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onCreateThread={handleCreateNewThread}
          onSelectThread={handleSelectThread}
          onUpdateThread={handleUpdateThread}
          onDeleteThread={handleDeleteThread}
          className='flex-shrink-0'
        />

        {/* Chat Area */}
        <Card className='flex flex-col flex-1 border-0 rounded-none border-l min-w-0 overflow-hidden'>
          <CardHeader className='flex-shrink-0 pb-3'>
            <CardTitle className='flex items-center space-x-3'>
              <div className='relative'>
                <Avatar className='h-8 w-8'>
                  <img
                    src='/lovable-uploads/794c2751-9650-4079-ab13-82bacd5914db.png'
                    alt='Sophia - SFDR Expert'
                    className='object-cover'
                  />
                  <AvatarFallback>SE</AvatarFallback>
                </Avatar>
                <div className='absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white'></div>
              </div>
              <div>
                <h3 className='text-lg font-semibold'>SFDR Expert Chat</h3>
                <p className='text-sm text-muted-foreground'>Powered by Sophia AI</p>
              </div>
              <div className='flex items-center space-x-2 ml-auto'>
                <Badge variant='outline' className='text-green-600 border-green-200'>
                  <Shield className='w-3 h-3 mr-1' />
                  SFDR Certified
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className='flex-1 flex flex-col p-0 min-w-0 overflow-hidden'>
            {/* Error Display */}
            {error && (
              <Alert variant='destructive' className='mx-4 mb-4'>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Messages Area */}
            <ScrollArea className='flex-1 px-4' style={{ overflowX: 'auto' }}>
              <div className='space-y-4 pb-4 min-w-0 w-full'>
                {/* Welcome Message */}
                {allMessages.length === 0 && !isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='text-center py-8 space-y-4'
                  >
                    <div className='w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center'>
                      <Sparkles className='w-8 h-8 text-primary' />
                    </div>
                    <div>
                      <h4 className='text-lg font-semibold text-foreground'>
                        Welcome to SFDR Expert Chat
                      </h4>
                      <p className='text-sm text-muted-foreground mt-2 max-w-md mx-auto'>
                        I'm Sophia, your AI-powered SFDR compliance advisor. Ask me about article
                        classification, PAI indicators, EU taxonomy alignment, or any sustainable
                        finance disclosure requirements.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Loading indicator */}
                {isLoading && allMessages.length === 0 && (
                  <div className='flex items-center justify-center py-8'>
                    <Loader2 className='w-6 h-6 animate-spin text-primary' />
                    <span className='ml-2 text-sm text-muted-foreground'>
                      Initializing SFDR Expert...
                    </span>
                  </div>
                )}

                {/* Messages */}
                <AnimatePresence>
                  {allMessages.map((message, _index) => {
                    const isUser = message.role === MessageRole.USER;
                    const isStreaming = message.id === 'streaming';

                    return (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={cn(
                          'flex items-start space-x-3',
                          isUser && 'flex-row-reverse space-x-reverse'
                        )}
                      >
                        <Avatar className='h-8 w-8 flex-shrink-0'>
                          {isUser ? (
                            <div className='w-8 h-8 bg-primary rounded-full flex items-center justify-center'>
                              <User className='w-4 h-4 text-primary-foreground' />
                            </div>
                          ) : (
                            <>
                              <img
                                src='/lovable-uploads/794c2751-9650-4079-ab13-82bacd5914db.png'
                                alt='Sophia'
                                className='object-cover'
                              />
                              <AvatarFallback>
                                <Bot className='w-4 h-4' />
                              </AvatarFallback>
                            </>
                          )}
                        </Avatar>

                        <div className={cn('flex-1 min-w-0', isUser && 'items-end')}>
                          <div
                            className={cn(
                              'rounded-lg px-4 py-2 text-sm max-w-full',
                              isUser
                                ? 'bg-primary text-primary-foreground ml-12'
                                : 'bg-muted text-foreground mr-12',
                              isStreaming && 'relative'
                            )}
                          >
                            <div className='overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent'>
                              {isUser ? (
                                // User messages: render as plain text with pre-wrap
                                <div className='whitespace-pre-wrap break-words'>
                                  {message.content}
                                </div>
                              ) : (
                                // Assistant messages: render as markdown
                                <div
                                  className='prose prose-sm dark:prose-invert max-w-none
                                  prose-headings:mt-3 prose-headings:mb-2
                                  prose-p:my-1 prose-p:leading-relaxed
                                  prose-pre:my-2 prose-pre:p-3 prose-pre:rounded-md prose-pre:bg-muted
                                  prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:bg-muted prose-code:text-foreground
                                  prose-blockquote:border-l-primary prose-blockquote:pl-4 prose-blockquote:italic
                                  prose-ul:my-2 prose-ol:my-2 prose-li:my-0
                                  prose-table:my-2 prose-th:p-2 prose-td:p-2 prose-th:border prose-td:border
                                  prose-img:rounded-md prose-img:my-2
                                  prose-strong:text-foreground prose-em:text-foreground
                                  prose-a:text-primary prose-a:underline'
                                >
                                  <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[rehypeHighlight, rehypeRaw]}
                                    components={MarkdownComponents}
                                  >
                                    {message.content}
                                  </ReactMarkdown>
                                </div>
                              )}
                              {isStreaming && (
                                <span className='inline-block w-2 h-4 ml-1 bg-foreground animate-pulse' />
                              )}
                            </div>

                            {/* Message metadata */}
                            {!isStreaming && (
                              <div
                                className={cn(
                                  'text-xs mt-1 opacity-70',
                                  isUser ? 'text-primary-foreground' : 'text-muted-foreground'
                                )}
                              >
                                {new Date(message.createdAt).toLocaleTimeString()}
                              </div>
                            )}

                            {/* Attachments */}
                            {message.attachments && message.attachments.length > 0 && (
                              <div className='mt-2 space-y-1'>
                                {message.attachments.map((attachment, idx) => (
                                  <div
                                    key={`attachment-${message.id}-${idx}`}
                                    className='flex items-center space-x-2 text-xs bg-background/20 rounded px-2 py-1'
                                  >
                                    <FileText className='w-3 h-3' />
                                    <span>{attachment.name}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {/* AI Typing Indicator */}
                {isLoading && !isStreaming && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className='flex items-start space-x-3'
                  >
                    <Avatar className='h-8 w-8 flex-shrink-0'>
                      <img
                        src='/lovable-uploads/794c2751-9650-4079-ab13-82bacd5914db.png'
                        alt='Sophia'
                        className='object-cover'
                      />
                      <AvatarFallback>
                        <Bot className='w-4 h-4' />
                      </AvatarFallback>
                    </Avatar>

                    <div className='flex-1 min-w-0'>
                      <div className='rounded-lg px-4 py-2 text-sm max-w-full bg-muted text-foreground mr-12'>
                        <div className='flex items-center space-x-2'>
                          <div className='flex space-x-1'>
                            <div
                              className='w-2 h-2 bg-primary rounded-full animate-bounce'
                              style={{ animationDelay: '0ms' }}
                            ></div>
                            <div
                              className='w-2 h-2 bg-primary rounded-full animate-bounce'
                              style={{ animationDelay: '150ms' }}
                            ></div>
                            <div
                              className='w-2 h-2 bg-primary rounded-full animate-bounce'
                              style={{ animationDelay: '300ms' }}
                            ></div>
                          </div>
                          <span className='text-xs text-muted-foreground'>
                            Sophia is thinking...
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Input Area */}
            <div className='border-t p-4'>
              <EnhancedInput
                value={inputValue}
                onChange={setInputValue}
                onSubmit={(message, files) => {
                  setInputValue('');
                  sendMessage(message, files);
                }}
                onStop={stopStreaming}
                placeholder='Ask me about SFDR compliance, article classification, PAI indicators...'
                disabled={false}
                isLoading={isStreaming}
                suggestions={suggestions}
                supportedFileTypes={[
                  // Documents
                  '.pdf',
                  '.doc',
                  '.docx',
                  '.txt',
                  '.rtf',
                  '.odt',
                  // Spreadsheets
                  '.xlsx',
                  '.xls',
                  '.csv',
                  '.ods',
                  // Presentations
                  '.pptx',
                  '.ppt',
                  '.odp',
                  // Images
                  '.jpg',
                  '.jpeg',
                  '.png',
                  '.gif',
                  '.bmp',
                  '.svg',
                  '.webp',
                  '.tiff',
                  // Other formats
                  '.json',
                  '.xml',
                  '.html',
                  '.md',
                  '.zip',
                  '.rar'
                ]}
                maxFileSize={10}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
);

NexusAgentChatStreamlined.displayName = 'NexusAgentChatStreamlined';

export default NexusAgentChatStreamlined;

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, AlertCircle, Send, Bot, User, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useChatApi } from '@/hooks/useChatApi';
import { useAuth } from '@/contexts/AuthContext';
import type { ChatMessage as ApiChatMessage, MessageRole } from '@/types/chat-api';

interface NexusAgentChatProps {
  className?: string;
  threadId?: string;
  onThreadChange?: (threadId: string) => void;
}

export const NexusAgentChat: React.FC<NexusAgentChatProps> = ({
  className = '',
  threadId,
  onThreadChange
}) => {
  const { user } = useAuth();
  const {
    threads,
    currentThread,
    messages,
    isLoading,
    isStreaming,
    error,
    createThread,
    loadThread,
    loadUserThreads,
    sendMessage,
    sendMessageStream,
    clearError,
    healthCheck
  } = useChatApi();

  const [inputMessage, setInputMessage] = useState('');
  const [useStreaming, setUseStreaming] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize component
  useEffect(() => {
    if (user) {
      loadUserThreads(10); // Load recent threads

      // Check API health
      healthCheck().then(isHealthy => {
        if (!isHealthy) {
          toast({
            title: 'API Connection Issue',
            description: 'Unable to connect to chat backend. Some features may not work.',
            variant: 'destructive'
          });
        }
      });
    }
  }, [user, loadUserThreads, healthCheck]);

  // Load specific thread if provided
  useEffect(() => {
    if (threadId && threadId !== currentThread?.id) {
      loadThread(threadId);
    }
  }, [threadId, currentThread?.id, loadThread]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle thread change
  useEffect(() => {
    if (currentThread && onThreadChange) {
      onThreadChange(currentThread.id);
    }
  }, [currentThread, onThreadChange]);

  const handleCreateNewThread = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to start a new conversation.',
        variant: 'destructive'
      });
      return;
    }

    const newThread = await createThread(`Chat ${new Date().toLocaleDateString()}`, {
      source: 'nexus-agent-chat'
    });

    if (newThread) {
      toast({
        title: 'New Conversation Started',
        description: 'Ready to help with your SFDR compliance questions!'
      });
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !currentThread) {
      if (!currentThread) {
        await handleCreateNewThread();
        // Wait a bit for thread creation to complete
        setTimeout(() => {
          if (inputMessage.trim()) {
            handleSendMessage();
          }
        }, 500);
        return;
      }
      return;
    }

    const messageContent = inputMessage.trim();
    setInputMessage('');

    try {
      if (useStreaming) {
        await sendMessageStream(messageContent, {
          systemInstructions: `You are Sophia, an SFDR Navigator and Sustainable Finance Expert. 
            Help users with SFDR compliance, ESG reporting, and regulatory requirements. 
            Provide clear, actionable guidance for sustainable finance disclosures.`,
          temperature: 0.7,
          maxTokens: 1000
        });
      } else {
        await sendMessage(messageContent, {
          systemInstructions: `You are Sophia, an SFDR Navigator and Sustainable Finance Expert. 
            Help users with SFDR compliance, ESG reporting, and regulatory requirements. 
            Provide clear, actionable guidance for sustainable finance disclosures.`,
          temperature: 0.7,
          maxTokens: 1000
        });
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatRole = (role: MessageRole): string => {
    switch (role) {
      case 'user':
        return 'You';
      case 'assistant':
        return 'Sophia';
      case 'system':
        return 'System';
      default:
        return role;
    }
  };

  const getRoleIcon = (role: MessageRole) => {
    switch (role) {
      case 'user':
        return <User className='h-4 w-4' />;
      case 'assistant':
        return <Bot className='h-4 w-4' />;
      default:
        return <AlertCircle className='h-4 w-4' />;
    }
  };

  return (
    <Card className={`flex flex-col h-[600px] ${className}`}>
      <CardHeader className='flex-none'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <Avatar>
              <AvatarFallback>
                <Bot className='h-5 w-5' />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className='text-lg'>SFDR Navigator Chat</CardTitle>
              <p className='text-sm text-muted-foreground'>
                {currentThread ? `Thread: ${currentThread.title}` : 'No active conversation'}
              </p>
            </div>
          </div>

          <div className='flex items-center space-x-2'>
            <Badge variant='secondary' className='text-xs'>
              {useStreaming ? 'Streaming' : 'Standard'}
            </Badge>
            <Button
              variant='outline'
              size='sm'
              onClick={handleCreateNewThread}
              disabled={isLoading}
            >
              <Plus className='h-4 w-4 mr-1' />
              New Chat
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription className='flex items-center justify-between'>
              {error}
              <Button variant='ghost' size='sm' onClick={clearError}>
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>

      <CardContent className='flex-1 flex flex-col space-y-4 p-4'>
        {/* Messages Area */}
        <ScrollArea className='flex-1 space-y-4'>
          <div className='space-y-4 p-2'>
            {!currentThread && (
              <div className='text-center text-muted-foreground py-8'>
                <Bot className='h-12 w-12 mx-auto mb-4 opacity-50' />
                <p className='text-lg font-medium mb-2'>Welcome to SFDR Navigator</p>
                <p className='text-sm'>
                  Start a new conversation to get help with sustainable finance compliance
                </p>
                <Button onClick={handleCreateNewThread} className='mt-4' disabled={isLoading}>
                  Start New Conversation
                </Button>
              </div>
            )}

            <AnimatePresence>
              {messages.map(message => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex items-start space-x-3 ${
                    message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <Avatar className='flex-none'>
                    <AvatarFallback>{getRoleIcon(message.role)}</AvatarFallback>
                  </Avatar>

                  <div
                    className={`flex-1 space-y-1 ${message.role === 'user' ? 'text-right' : ''}`}
                  >
                    <div className='flex items-center space-x-2'>
                      <span className='text-sm font-medium'>{formatRole(message.role)}</span>
                      <span className='text-xs text-muted-foreground'>
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </span>
                      {message.status === 'processing' && (
                        <Loader2 className='h-3 w-3 animate-spin' />
                      )}
                    </div>

                    <div
                      className={`rounded-lg p-3 max-w-[80%] ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground ml-auto'
                          : 'bg-muted'
                      }`}
                    >
                      <p className='text-sm whitespace-pre-wrap'>{message.content}</p>

                      {message.attachments && message.attachments.length > 0 && (
                        <div className='mt-2 space-y-1'>
                          {message.attachments.map(attachment => (
                            <Badge key={attachment.id} variant='outline' className='text-xs'>
                              {attachment.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && !isStreaming && (
              <div className='flex items-center space-x-3'>
                <Avatar>
                  <AvatarFallback>
                    <Bot className='h-4 w-4' />
                  </AvatarFallback>
                </Avatar>
                <div className='bg-muted rounded-lg p-3'>
                  <div className='flex items-center space-x-2'>
                    <Loader2 className='h-4 w-4 animate-spin' />
                    <span className='text-sm'>Sophia is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        {/* Input Area */}
        <div className='flex-none space-y-2'>
          <div className='flex items-center space-x-2'>
            <label className='flex items-center space-x-2 text-sm'>
              <input
                type='checkbox'
                checked={useStreaming}
                onChange={e => setUseStreaming(e.target.checked)}
                className='rounded'
              />
              <span>Enable streaming responses</span>
            </label>
          </div>

          <div className='flex space-x-2'>
            <Textarea
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                currentThread
                  ? 'Ask about SFDR compliance, ESG reporting, or regulatory requirements...'
                  : 'Start a new conversation to begin chatting...'
              }
              disabled={isLoading || isStreaming || !user}
              className='flex-1 min-h-[60px] resize-none'
              rows={2}
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || isStreaming || !inputMessage.trim() || !user}
              size='lg'
              className='self-end'
            >
              {isLoading || isStreaming ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <Send className='h-4 w-4' />
              )}
            </Button>
          </div>

          {!user && (
            <p className='text-xs text-muted-foreground text-center'>
              Please log in to start chatting with the SFDR Navigator
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

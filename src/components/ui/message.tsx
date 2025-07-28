import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Copy,
  ThumbsUp,
  ThumbsDown,
  Bot,
  User,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';

export interface MessageContent {
  type: 'text' | 'code' | 'table' | 'chart' | 'file' | 'compliance-report';
  content: string;
  language?: string; // for code blocks
  data?: any; // for charts/tables
  metadata?: {
    confidence?: number;
    source?: string;
    timestamp?: Date;
  };
}

export interface Message {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: MessageContent[];
  timestamp: Date;
  isLoading?: boolean;
  isStreaming?: boolean;
  reactions?: {
    thumbsUp: number;
    thumbsDown: number;
    userReaction?: 'up' | 'down' | null;
  };
  metadata?: {
    agentType?: 'sfdr-expert' | 'risk-analyst' | 'compliance-officer';
    confidence?: number;
    processingTime?: number;
  };
}

interface MessageComponentProps {
  message: Message;
  onReaction?: (messageId: string, reaction: 'up' | 'down') => void;
  onCopy?: (content: string) => void;
  className?: string;
}

/**
 * Enhanced message component with streaming animation and rich content support
 * Supports multiple content types, reactions, and professional SFDR branding
 */
export const MessageComponent: React.FC<MessageComponentProps> = ({
  message,
  onReaction,
  onCopy,
  className
}) => {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  /**
   * Handle copying message content to clipboard
   */
  const handleCopy = () => {
    const textContent = message.content
      .filter(c => c.type === 'text')
      .map(c => c.content)
      .join('\n');

    navigator.clipboard.writeText(textContent);
    onCopy?.(textContent);
    toast({
      title: 'Copied to clipboard',
      description: 'Message content has been copied.'
    });
  };

  /**
   * Handle reaction to message
   */
  const handleReaction = (reaction: 'up' | 'down') => {
    onReaction?.(message.id, reaction);
  };

  /**
   * Get agent avatar based on agent type
   */
  const getAgentAvatar = () => {
    const agentType = message.metadata?.agentType || 'sfdr-expert';
    const avatarMap = {
      'sfdr-expert': '/lovable-uploads/6856e5f8-5b1a-4520-bdc7-da986d98d082.png',
      'risk-analyst': '/lovable-uploads/88a5c7a6-e347-41ee-ad94-701d034e7258.png',
      'compliance-officer': '/lovable-uploads/93f022b9-560f-49fe-95a3-72816c483659.png'
    };
    return avatarMap[agentType];
  };

  /**
   * Render different content types
   */
  const renderContent = (content: MessageContent, index: number) => {
    switch (content.type) {
      case 'code':
        return (
          <Card key={index} className='bg-muted p-4 font-mono text-sm'>
            <div className='flex items-center justify-between mb-2'>
              <Badge variant='secondary'>{content.language || 'code'}</Badge>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => navigator.clipboard.writeText(content.content)}
              >
                <Copy className='h-4 w-4' />
              </Button>
            </div>
            <pre className='whitespace-pre-wrap'>{content.content}</pre>
          </Card>
        );

      case 'compliance-report':
        return (
          <Card key={index} className='border-green-200 bg-green-50 dark:bg-green-950 p-4'>
            <div className='flex items-center gap-2 mb-3'>
              <CheckCircle2 className='h-5 w-5 text-green-600' />
              <span className='font-semibold text-green-800 dark:text-green-200'>
                SFDR Compliance Report
              </span>
              {content.metadata?.confidence && (
                <Badge variant='secondary'>
                  {Math.round(content.metadata.confidence * 100)}% confidence
                </Badge>
              )}
            </div>
            <div className='prose prose-sm max-w-none'>
              <pre className='whitespace-pre-wrap text-sm'>{content.content}</pre>
            </div>
          </Card>
        );

      case 'table':
        return (
          <Card key={index} className='p-4'>
            <div className='flex items-center gap-2 mb-3'>
              <BarChart3 className='h-5 w-5' />
              <span className='font-semibold'>Data Analysis</span>
            </div>
            <div className='overflow-x-auto'>
              <div dangerouslySetInnerHTML={{ __html: content.content }} />
            </div>
          </Card>
        );

      case 'file':
        return (
          <Card key={index} className='p-4 border-blue-200 bg-blue-50 dark:bg-blue-950'>
            <div className='flex items-center gap-2'>
              <FileText className='h-5 w-5 text-blue-600' />
              <span className='font-medium text-blue-800 dark:text-blue-200'>
                {content.content}
              </span>
            </div>
          </Card>
        );

      default:
        return (
          <div key={index} className='prose prose-sm max-w-none dark:prose-invert'>
            {message.isStreaming ? (
              <StreamingText text={content.content} />
            ) : (
              <p className='whitespace-pre-wrap'>{content.content}</p>
            )}
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex gap-3 p-4',
        isUser ? 'flex-row-reverse' : 'flex-row',
        isSystem && 'justify-center',
        className
      )}
    >
      {!isSystem && (
        <Avatar className={cn('h-8 w-8', isUser && 'order-2')}>
          <AvatarImage
            src={isUser ? undefined : getAgentAvatar()}
            alt={isUser ? 'User' : 'SFDR Navigator'}
          />
          <AvatarFallback>
            {isUser ? <User className='h-4 w-4' /> : <Bot className='h-4 w-4' />}
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          'flex-1 space-y-2',
          isUser ? 'items-end' : 'items-start',
          isSystem && 'text-center'
        )}
      >
        {/* Message Header */}
        {!isSystem && (
          <div
            className={cn(
              'flex items-center gap-2 text-xs text-muted-foreground',
              isUser && 'flex-row-reverse'
            )}
          >
            <span className='font-medium'>
              {isUser
                ? 'You'
                : message.metadata?.agentType
                    ?.replace('-', ' ')
                    .replace(/\b\w/g, l => l.toUpperCase()) || 'SFDR Navigator'}
            </span>
            <span>{message.timestamp.toLocaleTimeString()}</span>
            {message.metadata?.processingTime && (
              <Badge variant='outline' className='text-xs'>
                <Clock className='h-3 w-3 mr-1' />
                {message.metadata.processingTime}ms
              </Badge>
            )}
          </div>
        )}

        {/* Message Content */}
        <div className={cn('space-y-2', isUser && 'flex flex-col items-end')}>
          {message.content.map((content, index) => renderContent(content, index))}
        </div>

        {/* Loading Indicator */}
        <AnimatePresence>
          {message.isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='flex items-center gap-2 text-sm text-muted-foreground'
            >
              <div className='flex space-x-1'>
                <div className='w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                <div className='w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                <div className='w-2 h-2 bg-current rounded-full animate-bounce'></div>
              </div>
              <span>SFDR Navigator is analyzing...</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message Actions */}
        {!isUser && !isSystem && !message.isLoading && (
          <div className='flex items-center gap-2 mt-2'>
            <Button variant='ghost' size='sm' onClick={handleCopy} className='h-8 px-2'>
              <Copy className='h-3 w-3' />
            </Button>

            <div className='flex items-center gap-1'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleReaction('up')}
                className={cn(
                  'h-8 px-2',
                  message.reactions?.userReaction === 'up' && 'bg-green-100 text-green-700'
                )}
              >
                <ThumbsUp className='h-3 w-3' />
                {message.reactions?.thumbsUp || 0}
              </Button>

              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleReaction('down')}
                className={cn(
                  'h-8 px-2',
                  message.reactions?.userReaction === 'down' && 'bg-red-100 text-red-700'
                )}
              >
                <ThumbsDown className='h-3 w-3' />
                {message.reactions?.thumbsDown || 0}
              </Button>
            </div>

            {message.metadata?.confidence && (
              <Badge variant='outline' className='text-xs'>
                {Math.round(message.metadata.confidence * 100)}% confident
              </Badge>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

/**
 * Streaming text animation component
 */
const StreamingText: React.FC<{ text: string }> = ({ text }) => {
  const [displayedText, setDisplayedText] = React.useState('');

  React.useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 20); // Adjust speed as needed

    return () => clearInterval(timer);
  }, [text]);

  return (
    <p className='whitespace-pre-wrap'>
      {displayedText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className='inline-block w-2 h-4 bg-current ml-1'
      />
    </p>
  );
};

export default MessageComponent;

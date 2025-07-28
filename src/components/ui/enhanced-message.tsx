import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Copy,
  ThumbsUp,
  ThumbsDown,
  Download,
  Share2,
  Bot,
  User,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface EnhancedMessageProps {
  id: string;
  type: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
  isStreaming?: boolean;
  confidence?: number;
  messageType?: 'text' | 'compliance-report' | 'risk-analysis' | 'code' | 'table';
  metadata?: {
    agentRole?: string;
    processingTime?: number;
    sources?: string[];
  };
  onReaction?: (messageId: string, reaction: 'like' | 'dislike') => void;
  onCopy?: (content: string) => void;
  onExport?: (messageId: string) => void;
}

/**
 * Enhanced message component with streaming animation, reactions, and rich content support
 * Provides professional UI for SFDR compliance conversations
 */
export const EnhancedMessage: React.FC<EnhancedMessageProps> = ({
  id,
  type,
  content,
  timestamp,
  isLoading = false,
  isStreaming = false,
  confidence,
  messageType = 'text',
  metadata,
  onReaction,
  onCopy,
  onExport
}) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [showActions, setShowActions] = useState(false);
  const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(null);

  // Streaming text animation effect
  useEffect(() => {
    if (isStreaming && content) {
      setDisplayedContent('');
      let currentIndex = 0;
      const streamInterval = setInterval(() => {
        if (currentIndex < content.length) {
          setDisplayedContent(content.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(streamInterval);
        }
      }, 20); // Adjust speed as needed

      return () => clearInterval(streamInterval);
    } else {
      setDisplayedContent(content);
    }
  }, [content, isStreaming]);

  /**
   * Handle copying message content to clipboard
   */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: 'Copied to clipboard',
        description: 'Message content has been copied.'
      });
      onCopy?.(content);
    } catch (error) {
      toast({
        title: 'Copy failed',
        description: 'Unable to copy to clipboard.',
        variant: 'destructive'
      });
    }
  };

  /**
   * Handle user reaction to message
   */
  const handleReaction = (reaction: 'like' | 'dislike') => {
    setUserReaction(reaction);
    onReaction?.(id, reaction);
    toast({
      title: 'Feedback recorded',
      description: `Thank you for your ${reaction === 'like' ? 'positive' : 'constructive'} feedback.`
    });
  };

  /**
   * Handle exporting message
   */
  const handleExport = () => {
    onExport?.(id);
    toast({
      title: 'Export initiated',
      description: 'Message is being prepared for export.'
    });
  };

  /**
   * Get avatar configuration based on message type
   */
  const getAvatarConfig = () => {
    switch (type) {
      case 'agent':
        return {
          icon: <Bot className='h-4 w-4' />,
          fallback: 'AI',
          className: 'bg-blue-500 text-white'
        };
      case 'user':
        return {
          icon: <User className='h-4 w-4' />,
          fallback: 'U',
          className: 'bg-green-500 text-white'
        };
      case 'system':
        return {
          icon: <Sparkles className='h-4 w-4' />,
          fallback: 'SYS',
          className: 'bg-purple-500 text-white'
        };
      default:
        return {
          icon: <Bot className='h-4 w-4' />,
          fallback: 'AI',
          className: 'bg-gray-500 text-white'
        };
    }
  };

  /**
   * Render content based on message type
   */
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className='flex items-center space-x-2'>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Clock className='h-4 w-4 text-muted-foreground' />
          </motion.div>
          <span className='text-muted-foreground'>Processing your request...</span>
        </div>
      );
    }

    switch (messageType) {
      case 'compliance-report':
        return (
          <div className='space-y-3'>
            <div className='flex items-center space-x-2'>
              <CheckCircle2 className='h-4 w-4 text-green-500' />
              <Badge variant='outline'>Compliance Report</Badge>
            </div>
            <div className='prose prose-sm max-w-none'>
              <pre className='whitespace-pre-wrap font-sans'>{displayedContent}</pre>
            </div>
          </div>
        );

      case 'risk-analysis':
        return (
          <div className='space-y-3'>
            <div className='flex items-center space-x-2'>
              <AlertCircle className='h-4 w-4 text-orange-500' />
              <Badge variant='outline'>Risk Analysis</Badge>
              {confidence && (
                <Badge variant='secondary'>{Math.round(confidence * 100)}% confidence</Badge>
              )}
            </div>
            <div className='prose prose-sm max-w-none'>
              <pre className='whitespace-pre-wrap font-sans'>{displayedContent}</pre>
            </div>
          </div>
        );

      case 'code':
        return (
          <div className='space-y-2'>
            <Badge variant='outline'>Code</Badge>
            <pre className='bg-muted p-3 rounded-md overflow-x-auto'>
              <code>{displayedContent}</code>
            </pre>
          </div>
        );

      default:
        return (
          <div className='prose prose-sm max-w-none'>
            <p className='whitespace-pre-wrap'>{displayedContent}</p>
          </div>
        );
    }
  };

  const avatarConfig = getAvatarConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('group relative', type === 'user' ? 'ml-12' : 'mr-12')}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <Card
        className={cn(
          'relative',
          type === 'user' ? 'bg-blue-50 border-blue-200' : 'bg-white',
          isStreaming && 'border-blue-300 shadow-sm'
        )}
      >
        <CardContent className='p-4'>
          <div className='flex space-x-3'>
            <Avatar className={cn('h-8 w-8', avatarConfig.className)}>
              <AvatarFallback>{avatarConfig.fallback}</AvatarFallback>
              {avatarConfig.icon}
            </Avatar>

            <div className='flex-1 space-y-2'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  <span className='text-sm font-medium'>
                    {type === 'agent'
                      ? metadata?.agentRole || 'SFDR Navigator'
                      : type === 'user'
                        ? 'You'
                        : 'System'}
                  </span>
                  <span className='text-xs text-muted-foreground'>
                    {timestamp.toLocaleTimeString()}
                  </span>
                </div>

                {metadata?.processingTime && (
                  <Badge variant='secondary' className='text-xs'>
                    {metadata.processingTime}ms
                  </Badge>
                )}
              </div>

              {renderContent()}

              {metadata?.sources && metadata.sources.length > 0 && (
                <div className='mt-3 pt-2 border-t'>
                  <p className='text-xs text-muted-foreground mb-1'>Sources:</p>
                  <div className='flex flex-wrap gap-1'>
                    {metadata.sources.map((source, index) => (
                      <Badge key={index} variant='outline' className='text-xs'>
                        {source}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>

        {/* Action buttons */}
        <AnimatePresence>
          {showActions && type === 'agent' && !isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className='absolute -right-2 top-2 flex flex-col space-y-1 bg-white border rounded-lg shadow-lg p-1'
            >
              <Button variant='ghost' size='sm' onClick={handleCopy} className='h-8 w-8 p-0'>
                <Copy className='h-3 w-3' />
              </Button>

              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleReaction('like')}
                className={cn(
                  'h-8 w-8 p-0',
                  userReaction === 'like' && 'bg-green-100 text-green-600'
                )}
              >
                <ThumbsUp className='h-3 w-3' />
              </Button>

              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleReaction('dislike')}
                className={cn(
                  'h-8 w-8 p-0',
                  userReaction === 'dislike' && 'bg-red-100 text-red-600'
                )}
              >
                <ThumbsDown className='h-3 w-3' />
              </Button>

              <Separator className='my-1' />

              <Button variant='ghost' size='sm' onClick={handleExport} className='h-8 w-8 p-0'>
                <Download className='h-3 w-3' />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Streaming indicator */}
        {isStreaming && (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className='absolute bottom-2 right-2'
          >
            <div className='h-2 w-2 bg-blue-500 rounded-full' />
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
};

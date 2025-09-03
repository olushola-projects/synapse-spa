import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  MessageSquare,
  MoreVertical,
  Trash2,
  Edit3,
  Clock,
  ChevronLeft,
  ChevronRight,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatThread, ThreadStatus } from '@/types/chat-api';

interface ThreadSidebarProps {
  threads: ChatThread[];
  currentThreadId?: string;
  isLoading: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onCreateThread: () => Promise<void>;
  onSelectThread: (threadId: string) => void;
  onUpdateThread: (threadId: string, updates: Partial<ChatThread>) => Promise<void>;
  onDeleteThread: (threadId: string) => Promise<void>;
  className?: string;
}

export const ThreadSidebar: React.FC<ThreadSidebarProps> = ({
  threads,
  currentThreadId,
  isLoading,
  isCollapsed,
  onToggleCollapse,
  onCreateThread,
  onSelectThread,
  onUpdateThread,
  onDeleteThread,
  className
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingThreadId, setEditingThreadId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [deletingThreadId, setDeletingThreadId] = useState<string | null>(null);

  // Filter threads based on search query
  const filteredThreads = threads.filter(thread =>
    thread.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort threads by last message date (most recent first)
  const sortedThreads = [...filteredThreads].sort((a, b) => {
    const aDate = a.lastMessageAt || a.createdAt;
    const bDate = b.lastMessageAt || b.createdAt;
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  });

  const handleEditThread = (thread: ChatThread) => {
    setEditingThreadId(thread.id);
    setEditingTitle(thread.title);
  };

  const handleSaveEdit = async () => {
    if (editingThreadId && editingTitle.trim()) {
      try {
        await onUpdateThread(editingThreadId, { title: editingTitle.trim() });
        setEditingThreadId(null);
        setEditingTitle('');
      } catch (error) {
        console.error('Error updating thread:', error);
        // Keep editing mode open on error so user can try again
      }
    } else {
      // If title is empty, cancel editing
      handleCancelEdit();
    }
  };

  const handleCancelEdit = () => {
    setEditingThreadId(null);
    setEditingTitle('');
  };

  const handleDeleteThread = async (threadId: string) => {
    try {
      await onDeleteThread(threadId);
      setDeletingThreadId(null);
    } catch (error) {
      console.error('Error deleting thread:', error);
      // Keep dialog open on error so user can try again
    }
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div
      className={cn(
        'flex flex-col bg-background border-r transition-all duration-200 ease-in-out',
        isCollapsed ? 'w-12' : 'w-80',
        className
      )}
    >
      {/* Header */}
      <div className='flex items-center justify-between p-3 border-b bg-muted/50'>
        {!isCollapsed && (
          <div className='flex items-center space-x-2'>
            <MessageSquare className='w-5 h-5 text-primary' />
            <h2 className='font-semibold text-sm'>Chat Threads</h2>
            <Badge variant='secondary' className='text-xs'>
              {threads.length}
            </Badge>
          </div>
        )}
        <Button
          variant='ghost'
          size='sm'
          onClick={onToggleCollapse}
          className='h-8 w-8 p-0'
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className='w-4 h-4' /> : <ChevronLeft className='w-4 h-4' />}
        </Button>
      </div>

      {!isCollapsed && (
        <>
          {/* New Thread Button */}
          <div className='p-3 border-b'>
            <Button
              onClick={onCreateThread}
              disabled={isLoading}
              className='w-full justify-start'
              size='sm'
            >
              <Plus className='w-4 h-4 mr-2' />
              New Thread
            </Button>
          </div>

          {/* Search */}
          <div className='p-3 border-b'>
            <div className='relative'>
              <Search className='absolute left-2 top-2.5 w-4 h-4 text-muted-foreground' />
              <Input
                placeholder='Search threads...'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className='pl-8 h-8 text-sm'
              />
            </div>
          </div>

          {/* Threads List */}
          <ScrollArea className='flex-1'>
            <div className='p-2 space-y-1'>
              <AnimatePresence>
                {sortedThreads.map(thread => {
                  const isActive = thread.id === currentThreadId;
                  const isEditing = editingThreadId === thread.id;

                  return (
                    <motion.div
                      key={thread.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className={cn(
                        'group relative rounded-lg border p-3 cursor-pointer transition-all duration-150',
                        isActive
                          ? 'bg-primary/10 border-primary/20'
                          : 'hover:bg-muted/50 border-transparent'
                      )}
                      onClick={() => !isEditing && onSelectThread(thread.id)}
                    >
                      {/* Thread Content */}
                      <div className='space-y-2'>
                        {isEditing ? (
                          <div className='space-y-2'>
                            <Input
                              value={editingTitle}
                              onChange={e => setEditingTitle(e.target.value)}
                              className='h-7 text-sm'
                              placeholder='Thread title'
                              autoFocus
                              maxLength={100}
                              onKeyDown={e => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleSaveEdit();
                                } else if (e.key === 'Escape') {
                                  e.preventDefault();
                                  handleCancelEdit();
                                }
                              }}
                            />
                            <div className='flex space-x-1'>
                              <Button
                                size='sm'
                                className='h-6 px-2 text-xs'
                                disabled={!editingTitle.trim()}
                                onClick={e => {
                                  e.stopPropagation();
                                  handleSaveEdit();
                                }}
                              >
                                Save
                              </Button>
                              <Button
                                variant='outline'
                                size='sm'
                                className='h-6 px-2 text-xs'
                                onClick={e => {
                                  e.stopPropagation();
                                  handleCancelEdit();
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className='flex items-start justify-between'>
                              <h3 className='font-medium text-sm line-clamp-2 flex-1 pr-2'>
                                {thread.title}
                              </h3>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant='ghost'
                                    size='sm'
                                    className='h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity'
                                    onClick={e => e.stopPropagation()}
                                  >
                                    <MoreVertical className='w-3 h-3' />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align='end' className='w-32'>
                                  <DropdownMenuItem
                                    onClick={e => {
                                      e.stopPropagation();
                                      handleEditThread(thread);
                                    }}
                                  >
                                    <Edit3 className='w-3 h-3 mr-2' />
                                    Rename
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className='text-destructive focus:text-destructive'
                                    onClick={e => {
                                      e.stopPropagation();
                                      setDeletingThreadId(thread.id);
                                    }}
                                  >
                                    <Trash2 className='w-3 h-3 mr-2' />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            <div className='flex items-center justify-between text-xs text-muted-foreground'>
                              <div className='flex items-center space-x-1'>
                                <Clock className='w-3 h-3' />
                                <span>
                                  {formatRelativeTime(thread.lastMessageAt || thread.createdAt)}
                                </span>
                              </div>
                              {thread.messageCount > 0 && (
                                <Badge variant='secondary' className='text-xs h-4 px-1'>
                                  {thread.messageCount}
                                </Badge>
                              )}
                            </div>

                            {thread.status !== ThreadStatus.ACTIVE && (
                              <Badge variant='outline' className='text-xs h-4 px-1 self-start'>
                                {thread.status}
                              </Badge>
                            )}
                          </>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {sortedThreads.length === 0 && !isLoading && (
                <div className='text-center py-8 text-muted-foreground'>
                  <MessageSquare className='w-8 h-8 mx-auto mb-2 opacity-50' />
                  <p className='text-sm'>
                    {searchQuery ? 'No matching threads' : 'No threads yet'}
                  </p>
                  {!searchQuery && <p className='text-xs mt-1'>Start a new conversation!</p>}
                </div>
              )}

              {isLoading && (
                <div className='space-y-2'>
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={`loading-placeholder-${i}`}
                      className='p-3 rounded-lg border animate-pulse'
                    >
                      <div className='h-4 bg-muted rounded mb-2' />
                      <div className='h-3 bg-muted rounded w-2/3' />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog
        open={deletingThreadId !== null}
        onOpenChange={open => {
          if (!open) setDeletingThreadId(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Thread</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "
              {deletingThreadId && threads.find(t => t.id === deletingThreadId)?.title}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setDeletingThreadId(null)}>
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={() => deletingThreadId && handleDeleteThread(deletingThreadId)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ThreadSidebar;

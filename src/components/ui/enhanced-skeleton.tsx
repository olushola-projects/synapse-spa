import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Enterprise-grade skeleton components based on Carbon Design System and GitHub Primer
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'rounded' | 'circular';
  animation?: 'pulse' | 'wave' | 'shimmer';
}

export function EnhancedSkeleton({
  className,
  variant = 'default',
  animation = 'shimmer',
  ...props
}: SkeletonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'rounded':
        return 'rounded-lg';
      case 'circular':
        return 'rounded-full';
      default:
        return 'rounded-md';
    }
  };

  const getAnimationStyles = () => {
    switch (animation) {
      case 'pulse':
        return 'animate-pulse';
      case 'wave':
        return 'animate-pulse';
      case 'shimmer':
      default:
        return 'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent';
    }
  };

  return (
    <div
      className={cn('bg-muted', getVariantStyles(), getAnimationStyles(), className)}
      {...props}
    />
  );
}

// Specialized skeleton components for Nexus Agent
export function ChatMessageSkeleton() {
  return (
    <div className='space-y-3 p-4'>
      <div className='flex items-start space-x-3'>
        <EnhancedSkeleton variant='circular' className='w-8 h-8' />
        <div className='flex-1 space-y-2'>
          <EnhancedSkeleton className='h-4 w-1/4' />
          <div className='space-y-2'>
            <EnhancedSkeleton className='h-4 w-full' />
            <EnhancedSkeleton className='h-4 w-3/4' />
            <EnhancedSkeleton className='h-4 w-1/2' />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AgentCardSkeleton() {
  return (
    <div className='border border-border rounded-lg p-6 space-y-4'>
      <div className='flex items-center space-x-3'>
        <EnhancedSkeleton variant='circular' className='w-12 h-12' />
        <div className='space-y-2'>
          <EnhancedSkeleton className='h-5 w-32' />
          <EnhancedSkeleton className='h-4 w-24' />
        </div>
      </div>
      <div className='space-y-2'>
        <EnhancedSkeleton className='h-4 w-full' />
        <EnhancedSkeleton className='h-4 w-2/3' />
      </div>
      <div className='flex space-x-2'>
        <EnhancedSkeleton className='h-8 w-20 rounded-full' />
        <EnhancedSkeleton className='h-8 w-16 rounded-full' />
      </div>
    </div>
  );
}

export function QuickActionSkeleton() {
  return (
    <div className='space-y-3'>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className='flex items-center p-3 border border-border rounded-lg'>
          <EnhancedSkeleton variant='circular' className='w-6 h-6 mr-3' />
          <div className='flex-1 space-y-1'>
            <EnhancedSkeleton className='h-4 w-24' />
            <EnhancedSkeleton className='h-3 w-32' />
          </div>
        </div>
      ))}
    </div>
  );
}

export function MetricCardSkeleton() {
  return (
    <div className='border border-border rounded-lg p-4 space-y-3'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <EnhancedSkeleton variant='circular' className='w-5 h-5' />
          <EnhancedSkeleton className='h-4 w-20' />
        </div>
        <EnhancedSkeleton className='h-6 w-12' />
      </div>
      <EnhancedSkeleton className='h-2 w-full' />
    </div>
  );
}

export function ComplianceOverviewSkeleton() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <div className='border border-border rounded-lg p-6 space-y-4'>
            <div className='flex items-center space-x-2'>
              <EnhancedSkeleton variant='circular' className='w-6 h-6' />
              <EnhancedSkeleton className='h-5 w-32' />
            </div>
            <div className='space-y-3'>
              <div className='flex justify-between'>
                <EnhancedSkeleton className='h-4 w-20' />
                <EnhancedSkeleton className='h-4 w-12' />
              </div>
              <EnhancedSkeleton className='h-2 w-full' />
              <EnhancedSkeleton className='h-3 w-24' />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function TabContentSkeleton({ type }: { type: 'chat' | 'overview' | 'testing' }) {
  switch (type) {
    case 'chat':
      return (
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
          <div className='lg:col-span-3 space-y-4'>
            <ChatMessageSkeleton />
            <ChatMessageSkeleton />
            <ChatMessageSkeleton />
          </div>
          <div className='space-y-4'>
            <AgentCardSkeleton />
            <div className='border border-border rounded-lg p-4'>
              <QuickActionSkeleton />
            </div>
          </div>
        </div>
      );

    case 'overview':
      return <ComplianceOverviewSkeleton />;

    case 'testing':
      return (
        <div className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <AgentCardSkeleton />
            <AgentCardSkeleton />
          </div>
          <div className='border border-border rounded-lg p-6 space-y-4'>
            <EnhancedSkeleton className='h-6 w-48' />
            <div className='space-y-2'>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className='flex items-center space-x-3'>
                  <EnhancedSkeleton variant='circular' className='w-4 h-4' />
                  <EnhancedSkeleton className='h-4 w-full' />
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className='space-y-4'>
          <EnhancedSkeleton className='h-8 w-48' />
          <EnhancedSkeleton className='h-32 w-full' />
        </div>
      );
  }
}

// Add shimmer animation to global CSS
export const SKELETON_STYLES = `
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
`;

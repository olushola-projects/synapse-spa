import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('animate-pulse rounded-md bg-muted', className)} {...props} />;
}

function SkeletonCard() {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-[100px]" />
      </div>
      <Skeleton className="h-16 w-full" />
    </div>
  );
}

function SkeletonChatMessage() {
  return (
    <div className="flex items-start space-x-3 p-4">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[300px]" />
        <Skeleton className="h-4 w-[150px]" />
      </div>
    </div>
  );
}

function SkeletonQuickAction() {
  return (
    <div className="border rounded-lg p-3 space-y-2">
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-[120px]" />
      </div>
    </div>
  );
}

export { Skeleton, SkeletonCard, SkeletonChatMessage, SkeletonQuickAction };

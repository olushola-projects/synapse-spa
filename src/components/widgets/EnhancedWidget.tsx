
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, MoreHorizontal } from 'lucide-react';
import { WidgetStateWrapper, WidgetState } from './WidgetStates';

interface EnhancedWidgetProps {
  title: string;
  children: React.ReactNode;
  onRemove?: () => void;
  initialState?: WidgetState;
  emptyMessage?: string;
  emptyIllustration?: React.ReactNode;
  onDataRefresh?: () => Promise<void>;
  className?: string;
}

export const EnhancedWidget: React.FC<EnhancedWidgetProps> = ({
  title,
  children,
  onRemove,
  initialState = 'idle',
  emptyMessage,
  emptyIllustration,
  onDataRefresh,
  className = ""
}) => {
  const [state, setState] = useState<WidgetState>(initialState);

  const handleRetry = useCallback(async () => {
    if (!onDataRefresh) return;
    
    setState('loading');
    try {
      await onDataRefresh();
      setState('idle');
    } catch (error) {
      setState('error');
    }
  }, [onDataRefresh]);

  return (
    <Card className={`h-full flex flex-col ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
              aria-label="Widget options"
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
            {onRemove && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="h-6 w-6 p-0 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
                aria-label={`Remove ${title} widget`}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pt-0">
        <WidgetStateWrapper
          state={state}
          widgetName={title}
          onRetry={handleRetry}
          emptyMessage={emptyMessage}
          emptyIllustration={emptyIllustration}
        >
          {children}
        </WidgetStateWrapper>
      </CardContent>
    </Card>
  );
};

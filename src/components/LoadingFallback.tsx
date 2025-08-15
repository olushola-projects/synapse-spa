import { Loader2, Brain, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface LoadingFallbackProps {
  message?: string;
  progress?: number;
  stage?: string;
  showSystemStatus?: boolean;
  variant?: 'default' | 'minimal' | 'detailed';
  className?: string;
}

/**
 * Enhanced Loading Fallback Component for SFDR Navigator
 * Provides progressive loading indicators with system status
 * Follows enterprise UX patterns for regulatory applications
 */
export function LoadingFallback({
  message = 'Loading SFDR Navigator...',
  progress = 0,
  stage = 'Initializing',
  showSystemStatus = true,
  variant = 'default',
  className
}: LoadingFallbackProps) {
  const stages = [
    { name: 'Initializing', description: 'Setting up secure environment' },
    { name: 'Authentication', description: 'Verifying credentials' },
    { name: 'Loading Data', description: 'Fetching compliance data' },
    { name: 'Finalizing', description: 'Preparing interface' }
  ];

  const currentStageIndex = stages.findIndex(s => s.name === stage);
  const calculatedProgress =
    currentStageIndex >= 0 ? ((currentStageIndex + 1) / stages.length) * 100 : progress;

  if (variant === 'minimal') {
    return (
      <div className={cn('flex items-center justify-center p-8', className)}>
        <div className='flex items-center space-x-3'>
          <Loader2 className='w-6 h-6 animate-spin text-primary' />
          <span className='text-sm text-muted-foreground'>{message}</span>
        </div>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div
        className={cn(
          'min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4',
          className
        )}
      >
        <Card className='w-full max-w-2xl shadow-lg'>
          <CardHeader className='text-center'>
            <div className='mx-auto w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4'>
              <Brain className='w-10 h-10 text-white animate-pulse' />
            </div>
            <CardTitle className='text-2xl text-gray-900'>SFDR Navigator</CardTitle>
            <p className='text-muted-foreground'>
              Initializing AI-powered regulatory compliance platform
            </p>
          </CardHeader>

          <CardContent className='space-y-6'>
            {/* Progress Bar */}
            <div className='space-y-2'>
              <div className='flex justify-between items-center'>
                <span className='text-sm font-medium text-gray-700'>{stage}</span>
                <span className='text-sm text-muted-foreground'>
                  {Math.round(calculatedProgress)}%
                </span>
              </div>
              <Progress value={calculatedProgress} className='h-2' />
            </div>

            {/* Stage Indicators */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              {stages.map((stageItem, index) => {
                const isActive = stageItem.name === stage;
                const isCompleted = index < currentStageIndex;

                return (
                  <div
                    key={stageItem.name}
                    className={cn(
                      'flex items-center space-x-3 p-3 rounded-lg border transition-all',
                      isActive && 'bg-blue-50 border-blue-200',
                      isCompleted && 'bg-green-50 border-green-200',
                      !isActive && !isCompleted && 'bg-gray-50 border-gray-200'
                    )}
                  >
                    <div
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center',
                        isActive && 'bg-blue-600',
                        isCompleted && 'bg-green-600',
                        !isActive && !isCompleted && 'bg-gray-300'
                      )}
                    >
                      {isActive && <Loader2 className='w-4 h-4 text-white animate-spin' />}
                      {isCompleted && <Shield className='w-4 h-4 text-white' />}
                      {!isActive && !isCompleted && (
                        <span className='text-xs text-gray-600'>{index + 1}</span>
                      )}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p
                        className={cn(
                          'text-sm font-medium',
                          isActive && 'text-blue-900',
                          isCompleted && 'text-green-900',
                          !isActive && !isCompleted && 'text-gray-600'
                        )}
                      >
                        {stageItem.name}
                      </p>
                      <p className='text-xs text-muted-foreground truncate'>
                        {stageItem.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* System Status */}
            {showSystemStatus && (
              <div className='bg-gray-50 rounded-lg p-4'>
                <h4 className='text-sm font-medium text-gray-900 mb-3'>System Status</h4>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='flex items-center justify-between'>
                    <span className='text-xs text-gray-600'>Security</span>
                    <Badge variant='secondary' className='bg-green-100 text-green-800'>
                      Secure
                    </Badge>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-xs text-gray-600'>Compliance</span>
                    <Badge variant='secondary' className='bg-blue-100 text-blue-800'>
                      GDPR Ready
                    </Badge>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-xs text-gray-600'>Connection</span>
                    <Badge variant='secondary' className='bg-green-100 text-green-800'>
                      Encrypted
                    </Badge>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-xs text-gray-600'>Region</span>
                    <Badge variant='secondary' className='bg-gray-100 text-gray-800'>
                      EU-West
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            {/* Loading Message */}
            <div className='text-center'>
              <p className='text-sm text-muted-foreground'>{message}</p>
              <p className='text-xs text-gray-500 mt-1'>
                This may take a few moments while we ensure secure access to your compliance data.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn('flex items-center justify-center min-h-[400px] p-8', className)}>
      <Card className='w-full max-w-md'>
        <CardContent className='pt-6'>
          <div className='text-center space-y-4'>
            <div className='mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center'>
              <Loader2 className='w-8 h-8 text-white animate-spin' />
            </div>

            <div className='space-y-2'>
              <h3 className='text-lg font-semibold text-gray-900'>{stage}</h3>
              <p className='text-sm text-muted-foreground'>{message}</p>
            </div>

            {progress > 0 && (
              <div className='space-y-2'>
                <Progress value={calculatedProgress} className='h-2' />
                <p className='text-xs text-muted-foreground'>
                  {Math.round(calculatedProgress)}% complete
                </p>
              </div>
            )}

            {showSystemStatus && (
              <div className='flex items-center justify-center space-x-2 text-xs text-muted-foreground'>
                <Shield className='w-3 h-3' />
                <span>Secure Connection</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Page-level loading component for full-page loading states
 */
export function PageLoadingFallback({
  subtitle = 'Loading compliance interface...'
}: {
  subtitle?: string;
}) {
  return (
    <LoadingFallback
      variant='detailed'
      message={subtitle}
      stage='Loading Data'
      showSystemStatus={true}
      className='min-h-screen'
    />
  );
}

/**
 * Component-level loading for smaller sections
 */
export function ComponentLoadingFallback({
  message = 'Loading...',
  size = 'default'
}: {
  message?: string;
  size?: 'small' | 'default' | 'large';
}) {
  const sizeClasses = {
    small: 'min-h-[200px]',
    default: 'min-h-[300px]',
    large: 'min-h-[400px]'
  };

  return <LoadingFallback variant='minimal' message={message} className={sizeClasses[size]} />;
}

export default LoadingFallback;

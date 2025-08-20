import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ExternalLink, Shield, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WixEmbedSecureProps {
  src: string;
  title?: string;
  className?: string;
  allowedOrigins?: string[];
  onMessage?: (data: any) => void;
  onError?: (error: Error) => void;
}

/**
 * Secure Wix iframe embed component with CSP compliance and postMessage security
 */
export const WixEmbedSecure: React.FC<WixEmbedSecureProps> = ({
  src,
  title = 'Embedded Content',
  className,
  allowedOrigins = ['*.wix.com', '*.wixsite.com'],
  onMessage,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Validate URL origin
  const isValidOrigin = useCallback(
    (url: string) => {
      try {
        const urlObj = new URL(url);
        return allowedOrigins.some(origin => {
          const pattern = origin.replace(/\*/g, '.*');
          return new RegExp(`^${pattern}$`).test(urlObj.hostname);
        });
      } catch {
        return false;
      }
    },
    [allowedOrigins]
  );

  // Handle postMessage communication
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Verify origin
      if (!isValidOrigin(event.origin)) {
        console.warn('Rejected message from untrusted origin:', event.origin);
        return;
      }

      try {
        // Process the message
        onMessage?.(event.data);
      } catch (error) {
        console.error('Error processing iframe message:', error);
        onError?.(error as Error);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isValidOrigin, onMessage, onError]);

  // Validate source URL
  if (!isValidOrigin(src)) {
    return (
      <Alert variant='destructive'>
        <AlertTriangle className='h-4 w-4' />
        <AlertDescription>
          Invalid or untrusted iframe source. Only Wix domains are allowed.
        </AlertDescription>
      </Alert>
    );
  }

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleError = () => {
    setHasError(true);
    setErrorMessage('Failed to load embedded content');
    onError?.(new Error('Iframe load error'));
  };

  const openInNewTab = () => {
    window.open(src, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium flex items-center gap-2'>
          <Shield className='h-4 w-4 text-green-600' />
          {title}
        </CardTitle>
        <Button variant='outline' size='sm' onClick={openInNewTab} className='h-8 w-8 p-0'>
          <ExternalLink className='h-3 w-3' />
        </Button>
      </CardHeader>
      <CardContent className='p-0'>
        {hasError ? (
          <div className='p-4'>
            <Alert variant='destructive'>
              <AlertTriangle className='h-4 w-4' />
              <AlertDescription>
                {errorMessage}
                <Button
                  variant='link'
                  className='p-0 h-auto font-normal ml-2'
                  onClick={openInNewTab}
                >
                  Open in new tab
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <div className='relative'>
            {!isLoaded && (
              <div className='absolute inset-0 bg-muted animate-pulse flex items-center justify-center'>
                <div className='text-muted-foreground text-sm'>Loading...</div>
              </div>
            )}
            <iframe
              src={src}
              title={title}
              className='w-full h-96 border-0'
              sandbox='allow-scripts allow-same-origin allow-forms allow-popups'
              referrerPolicy='strict-origin-when-cross-origin'
              loading='lazy'
              onLoad={handleLoad}
              onError={handleError}
              style={{
                minHeight: '400px',
                opacity: isLoaded ? 1 : 0,
                transition: 'opacity 0.3s ease'
              }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Hook for postMessage communication
export const useWixPostMessage = (targetOrigin: string = '*') => {
  const sendMessage = useCallback(
    (data: any, iframe?: HTMLIFrameElement) => {
      if (iframe?.contentWindow) {
        iframe.contentWindow.postMessage(data, targetOrigin);
      }
    },
    [targetOrigin]
  );

  return { sendMessage };
};

export default WixEmbedSecure;

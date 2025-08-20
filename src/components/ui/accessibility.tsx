import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
    AlertTriangle,
    Eye,
    Info,
    Keyboard,
    SkipForward,
    VolumeX
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

// Skip to main content link
export function SkipToMainContent() {
  const handleSkip = () => {
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSkip}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50"
      aria-label="Skip to main content"
    >
      <SkipForward className="w-4 h-4 mr-2" />
      Skip to main content
    </Button>
  );
}

// Accessibility toolbar
export function AccessibilityToolbar() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isLargeText, setIsLargeText] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    // Apply accessibility preferences
    if (isHighContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    if (isLargeText) {
      document.documentElement.classList.add('large-text');
    } else {
      document.documentElement.classList.remove('large-text');
    }

    if (isReducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
  }, [isHighContrast, isLargeText, isReducedMotion]);

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsVisible(!isVisible)}
        aria-label="Toggle accessibility options"
        className="bg-background/80 backdrop-blur-sm"
      >
        <Keyboard className="w-4 h-4" />
      </Button>

      {isVisible && (
        <Card className="absolute top-12 right-0 w-64 shadow-lg">
          <CardContent className="p-4 space-y-3">
            <h3 className="text-sm font-semibold">Accessibility Options</h3>
            
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsHighContrast(!isHighContrast)}
                className="w-full justify-start"
                aria-pressed={isHighContrast}
              >
                <Eye className="w-4 h-4 mr-2" />
                High Contrast
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLargeText(!isLargeText)}
                className="w-full justify-start"
                aria-pressed={isLargeText}
              >
                <Eye className="w-4 h-4 mr-2" />
                Large Text
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsReducedMotion(!isReducedMotion)}
                className="w-full justify-start"
                aria-pressed={isReducedMotion}
              >
                <VolumeX className="w-4 h-4 mr-2" />
                Reduced Motion
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Focus trap for modals and dialogs
export function FocusTrap({ children, isActive = true }: { children: React.ReactNode; isActive?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [focusableElements, setFocusableElements] = useState<HTMLElement[]>([]);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const elements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    setFocusableElements(Array.from(elements));

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive, focusableElements]);

  return <div ref={containerRef}>{children}</div>;
}

// Screen reader only text
export function SrOnly({ children }: { children: React.ReactNode }) {
  return <span className="sr-only">{children}</span>;
}

// Live region for announcements
export function LiveRegion({ 
  message, 
  role = 'status',
  className 
}: { 
  message: string; 
  role?: 'status' | 'alert' | 'log';
  className?: string;
}) {
  return (
    <div
      role={role}
      aria-live="polite"
      aria-atomic="true"
      className={cn('sr-only', className)}
    >
      {message}
    </div>
  );
}

// Keyboard navigation hook
export function useKeyboardNavigation() {
  const [focusedIndex, setFocusedIndex] = useState(0);

  const handleKeyDown = (event: React.KeyboardEvent, itemCount: number) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % itemCount);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + itemCount) % itemCount);
        break;
      case 'Home':
        event.preventDefault();
        setFocusedIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setFocusedIndex(itemCount - 1);
        break;
    }
  };

  return { focusedIndex, setFocusedIndex, handleKeyDown };
}

// Accessibility announcement hook
export function useAccessibilityAnnouncement() {
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  return { announce };
}

// Accessibility info component
export function AccessibilityInfo({ 
  title, 
  description,
  type = 'info'
}: { 
  title: string; 
  description: string;
  type?: 'info' | 'warning' | 'error';
}) {
  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  return (
    <Alert className="border-l-4 border-l-blue-500 bg-blue-50">
      {getIcon()}
      <AlertDescription>
        <strong>{title}:</strong> {description}
      </AlertDescription>
    </Alert>
  );
}

// Enhanced button with better accessibility
export function AccessibleButton({
  children,
  onClick,
  disabled = false,
  loading = false,
  ariaLabel,
  ariaDescribedBy,
  className,
  ...props
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  className?: string;
  [key: string]: any;
}) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-busy={loading}
      className={cn(className)}
      {...props}
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </Button>
  );
}

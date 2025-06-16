import React, { useState, Suspense, memo, useCallback, useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from "@/lib/utils";

// Enhanced lazy loading with error boundary and preloading
const Dashboard = React.lazy(() => {
  // Preload hint for better UX
  const link = document.createElement('link');
  link.rel = 'modulepreload';
  link.href = '../webapp/CustomizableDashboard';
  document.head.appendChild(link);
  
  return import('../webapp/CustomizableDashboard').then(module => ({
    default: module.CustomizableDashboard
  })).catch(error => {
    console.warn('Dashboard component failed to load:', error);
    // Return a fallback component
    return {
      default: () => (
        <div className="w-full h-96 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center rounded-lg border border-gray-200">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Dashboard Preview</h3>
            <p className="text-gray-600 text-sm">Interactive GRC dashboard with real-time insights</p>
          </div>
        </div>
      )
    };
  });
});

// Error boundary for dashboard component
class DashboardErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('Dashboard embed failed to render:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="w-full h-96 bg-gray-50 flex items-center justify-center rounded-lg border border-gray-200">
          <div className="text-center p-6">
            <div className="text-gray-400 mb-2">⚠️</div>
            <p className="text-gray-600 text-sm">Dashboard preview unavailable</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

interface DashboardHeroEmbedProps {
  className?: string;
  onClick?: () => void;
}

export const DashboardHeroEmbed: React.FC<DashboardHeroEmbedProps> = memo(({ 
  className = "",
  onClick 
}) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick();
    }
    // Analytics tracking
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'dashboard_preview_click', {
        'custom_parameter': 'hero_embed'
      });
    }
  }, [onClick, navigate]);

  const handleDashboardLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  // Mock dashboard props for the embed
  const mockDashboardProps = {
    widgets: [
      {
        id: '1',
        title: 'Compliance Status',
        type: 'metric' as const,
        size: 'small' as const,
        position: { x: 0, y: 0 },
        visible: true,
        customizable: true,
      },
      {
        id: '2',
        title: 'Regulatory Calendar',
        type: 'calendar' as const,
        size: 'medium' as const,
        position: { x: 1, y: 0 },
        visible: true,
        customizable: true,
      },
      {
        id: '3',
        title: 'Risk Insights',
        type: 'chart' as const,
        size: 'large' as const,
        position: { x: 0, y: 1 },
        visible: true,
        customizable: true,
      },
    ],
    isCustomizing: false,
    onToggleCustomize: () => {},
    onWidgetUpdate: () => {},
    onAddWidget: () => {},
  };

  // Enhanced animation variants
  const animationVariants = {
    hidden: { 
      opacity: 0, 
      y: 20, 
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: prefersReducedMotion ? 0.1 : 0.6,
        ease: "easeOut"
      }
    },
    hover: prefersReducedMotion ? {} : {
      scale: 1.03,
      y: -4,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className={`relative cursor-pointer group ${className}`}
      variants={animationVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      whileHover="hover"
      onClick={handleClick}
      style={{
        width: '60%',
        height: 'auto',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        background: 'white'
      }}
      role="button"
      tabIndex={0}
      aria-label="Explore Synapses Dashboard - Interactive preview of GRC compliance tools"
      aria-describedby="dashboard-description"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Screen reader description */}
      <div id="dashboard-description" className="sr-only">
        Interactive dashboard preview showing compliance metrics, regulatory calendar, and risk insights. Click to explore the full dashboard.
      </div>

      {/* Loading state indicator */}
      {isVisible && !isLoaded && (
        <div className="absolute top-2 right-2 z-10">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" aria-label="Loading" />
        </div>
      )}

      <DashboardErrorBoundary>
        <Suspense 
          fallback={
            <div className="w-full h-96 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
                <div className="text-gray-600 text-sm font-medium">Loading Dashboard Preview...</div>
                <div className="text-gray-400 text-xs mt-1">Preparing your GRC insights</div>
              </div>
            </div>
          }
        >
          {isVisible && (
            <div 
              className={`transform scale-75 origin-top-left transition-opacity duration-500 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`} 
              style={{ width: '133.33%', height: 'auto' }}
            >
              <Dashboard {...mockDashboardProps} onLoad={handleDashboardLoad} />
            </div>
          )}
        </Suspense>
      </DashboardErrorBoundary>
      
      {/* Enhanced click overlay indicator */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-600/0 via-transparent to-transparent group-hover:from-blue-600/5 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100">
        <motion.div 
          className="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-lg shadow-xl border border-white/20"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <span className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Explore Dashboard
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </motion.div>
      </div>

      {/* Performance indicator */}
      {isLoaded && (
        <div className="absolute bottom-2 left-2 z-10">
          <div className="bg-green-500/20 text-green-700 text-xs px-2 py-1 rounded-full border border-green-200 backdrop-blur-sm">
            ✓ Live Preview
          </div>
        </div>
      )}
    </motion.div>
  );
});

// Display name for debugging
DashboardHeroEmbed.displayName = 'DashboardHeroEmbed';

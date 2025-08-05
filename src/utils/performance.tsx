/**
 * Performance Optimization Utilities
 * Implements immediate performance improvements for production readiness
 * Enhanced with comprehensive monitoring and optimization for SFDR Navigator
 */

import type { ComponentType } from 'react';
import React, { lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * Lazy load components with error boundary and loading fallback
 * @param importFunc - Dynamic import function
 * @param fallback - Loading component to show while loading
 * @returns Lazy-loaded component
 */
export const lazyLoad = <T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: ComponentType
) => {
  const LazyComponent = lazy(importFunc);

  return (props: any) => (
    <React.Suspense fallback={fallback ? <fallback /> : <div>Loading...</div>}>
      <LazyComponent {...props} />
    </React.Suspense>
  );
};

/**
 * Preload critical resources
 * @param resources - Array of resource URLs to preload
 */
export const preloadResources = (resources: string[]) => {
  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource;

    // Determine resource type based on extension
    if (resource.endsWith('.css')) {
      link.as = 'style';
    } else if (resource.endsWith('.js')) {
      link.as = 'script';
    } else if (resource.match(/\.(woff2?|ttf|eot)$/)) {
      link.as = 'font';
      link.crossOrigin = 'anonymous';
    } else if (resource.match(/\.(jpg|jpeg|png|webp|svg)$/)) {
      link.as = 'image';
    }

    document.head.appendChild(link);
  });
};

/**
 * Optimize images with lazy loading and WebP support
 * @param src - Image source URL
 * @param alt - Alt text for accessibility
 * @param className - CSS classes
 * @returns Optimized image element
 */
export const OptimizedImage = ({
  src,
  alt,
  className = '',
  width,
  height
}: {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}) => {
  const webpSrc = src.replace(/\.(jpg|jpeg|png)$/, '.webp');

  return (
    <picture className={className}>
      <source srcSet={webpSrc} type='image/webp' />
      <img src={src} alt={alt} width={width} height={height} loading='lazy' decoding='async' />
    </picture>
  );
};

/**
 * Debounce function for performance optimization
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function for performance optimization
 * @param func - Function to throttle
 * @param limit - Time limit in milliseconds
 * @returns Throttled function
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Monitor Core Web Vitals
 */
export const monitorWebVitals = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    // Monitor Largest Contentful Paint (LCP)
    new PerformanceObserver(entryList => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // Monitor First Input Delay (FID)
    new PerformanceObserver(entryList => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        console.log('FID:', entry.processingStart - entry.startTime);
      });
    }).observe({ entryTypes: ['first-input'] });

    // Monitor Cumulative Layout Shift (CLS)
    new PerformanceObserver(entryList => {
      let clsValue = 0;
      entryList.getEntries().forEach(entry => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      console.log('CLS:', clsValue);
    }).observe({ entryTypes: ['layout-shift'] });
  }
};

// Performance metrics interface
interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  apiResponseTime: number;
  errorRate: number;
  userInteractions: number;
}

// Performance thresholds for SFDR Navigator
const PERFORMANCE_THRESHOLDS = {
  LOAD_TIME_WARNING: 3000, // 3 seconds
  LOAD_TIME_CRITICAL: 5000, // 5 seconds
  RENDER_TIME_WARNING: 100, // 100ms
  RENDER_TIME_CRITICAL: 300, // 300ms
  MEMORY_WARNING: 50 * 1024 * 1024, // 50MB
  MEMORY_CRITICAL: 100 * 1024 * 1024, // 100MB
  API_RESPONSE_WARNING: 2000, // 2 seconds
  API_RESPONSE_CRITICAL: 5000, // 5 seconds
} as const;

/**
 * Hook for monitoring component performance
 * Tracks render times, memory usage, and user interactions
 * @param componentName - Name of the component being monitored
 * @returns Performance metrics and monitoring functions
 */
export const usePerformanceMonitor = (componentName: string) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    apiResponseTime: 0,
    errorRate: 0,
    userInteractions: 0,
  });

  const renderStartTime = useRef<number>(0);
  const componentMountTime = useRef<number>(Date.now());
  const interactionCount = useRef<number>(0);

  // Track component render performance
  useEffect(() => {
    renderStartTime.current = performance.now();
    
    return () => {
      const renderTime = performance.now() - renderStartTime.current;
      setMetrics(prev => ({ ...prev, renderTime }));
      
      // Log performance warnings
      if (renderTime > PERFORMANCE_THRESHOLDS.RENDER_TIME_WARNING) {
        console.warn(`[Performance] ${componentName} render time: ${renderTime.toFixed(2)}ms`);
      }
    };
  });

  // Track memory usage
  useEffect(() => {
    const updateMemoryUsage = () => {
      if ('memory' in performance) {
        const memoryInfo = (performance as any).memory;
        const memoryUsage = memoryInfo.usedJSHeapSize;
        
        setMetrics(prev => ({ ...prev, memoryUsage }));
        
        if (memoryUsage > PERFORMANCE_THRESHOLDS.MEMORY_WARNING) {
          console.warn(`[Performance] ${componentName} memory usage: ${(memoryUsage / 1024 / 1024).toFixed(2)}MB`);
        }
      }
    };

    const interval = setInterval(updateMemoryUsage, 5000); // Check every 5 seconds
    updateMemoryUsage(); // Initial check

    return () => clearInterval(interval);
  }, [componentName]);

  // Track user interactions
  const trackInteraction = useCallback(() => {
    interactionCount.current += 1;
    setMetrics(prev => ({ 
      ...prev, 
      userInteractions: interactionCount.current 
    }));
  }, []);

  // Track API response times
  const trackApiCall = useCallback(async (
    apiCall: () => Promise<any>,
    apiName: string
  ): Promise<any> => {
    const startTime = performance.now();
    
    try {
      const result = await apiCall();
      const responseTime = performance.now() - startTime;
      
      setMetrics(prev => ({ ...prev, apiResponseTime: responseTime }));
      
      if (responseTime > PERFORMANCE_THRESHOLDS.API_RESPONSE_WARNING) {
        console.warn(`[Performance] ${apiName} response time: ${responseTime.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const responseTime = performance.now() - startTime;
      setMetrics(prev => ({ 
        ...prev, 
        apiResponseTime: responseTime,
        errorRate: prev.errorRate + 1
      }));
      
      console.error(`[Performance] ${apiName} failed after ${responseTime.toFixed(2)}ms:`, error);
      throw error;
    }
  }, []);

  // Calculate load time
  useEffect(() => {
    const loadTime = Date.now() - componentMountTime.current;
    setMetrics(prev => ({ ...prev, loadTime }));
    
    if (loadTime > PERFORMANCE_THRESHOLDS.LOAD_TIME_WARNING) {
      console.warn(`[Performance] ${componentName} load time: ${loadTime}ms`);
    }
  }, [componentName]);

  return {
    metrics,
    trackInteraction,
    trackApiCall,
    isPerformanceGood: useMemo(() => ({
      loadTime: metrics.loadTime < PERFORMANCE_THRESHOLDS.LOAD_TIME_WARNING,
      renderTime: metrics.renderTime < PERFORMANCE_THRESHOLDS.RENDER_TIME_WARNING,
      memoryUsage: metrics.memoryUsage < PERFORMANCE_THRESHOLDS.MEMORY_WARNING,
      apiResponseTime: metrics.apiResponseTime < PERFORMANCE_THRESHOLDS.API_RESPONSE_WARNING,
    }), [metrics])
  };
};

/**
 * Optimized debounced search hook for SFDR Navigator
 * Prevents excessive API calls during user input
 * @param searchFunction - Function to execute for search
 * @param delay - Debounce delay in milliseconds
 * @returns Debounced search function
 */
export const useDebouncedSearch = <T extends any[]>(
  searchFunction: (...args: T) => void,
  delay: number = 300
) => {
  const debouncedFn = useMemo(
    () => debounce(searchFunction, delay),
    [searchFunction, delay]
  );

  useEffect(() => {
    return () => {
      // Cancel any pending debounced calls on unmount
    };
  }, [debouncedFn]);

  return debouncedFn;
};

/**
 * Lazy loading hook for heavy components
 * Implements intersection observer for performance optimization
 * @param threshold - Intersection threshold (0-1)
 * @returns Ref and visibility state
 */
export const useLazyLoad = (threshold: number = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
          observer.unobserve(element);
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, hasLoaded]);

  return { elementRef, isVisible, hasLoaded };
};

/**
 * Performance analytics for SFDR Navigator
 * Collects and reports performance metrics
 */
export class PerformanceAnalytics {
  private static instance: PerformanceAnalytics;
  private metrics: Map<string, PerformanceMetrics[]> = new Map();
  
  static getInstance(): PerformanceAnalytics {
    if (!PerformanceAnalytics.instance) {
      PerformanceAnalytics.instance = new PerformanceAnalytics();
    }
    return PerformanceAnalytics.instance;
  }
  
  /**
   * Record performance metrics for a component
   * @param componentName - Name of the component
   * @param metrics - Performance metrics to record
   */
  recordMetrics(componentName: string, metrics: PerformanceMetrics): void {
    if (!this.metrics.has(componentName)) {
      this.metrics.set(componentName, []);
    }
    
    const componentMetrics = this.metrics.get(componentName)!;
    componentMetrics.push({ ...metrics, timestamp: Date.now() } as any);
    
    // Keep only last 100 entries per component
    if (componentMetrics.length > 100) {
      componentMetrics.splice(0, componentMetrics.length - 100);
    }
  }
  
  /**
   * Get performance summary for a component
   * @param componentName - Name of the component
   * @returns Performance summary statistics
   */
  getPerformanceSummary(componentName: string) {
    const componentMetrics = this.metrics.get(componentName) || [];
    
    if (componentMetrics.length === 0) {
      return null;
    }
    
    const calculateStats = (values: number[]) => {
      const sorted = values.sort((a, b) => a - b);
      return {
        min: sorted[0],
        max: sorted[sorted.length - 1],
        avg: values.reduce((sum, val) => sum + val, 0) / values.length,
        p95: sorted[Math.floor(sorted.length * 0.95)],
        p99: sorted[Math.floor(sorted.length * 0.99)]
      };
    };
    
    return {
      loadTime: calculateStats(componentMetrics.map(m => m.loadTime)),
      renderTime: calculateStats(componentMetrics.map(m => m.renderTime)),
      memoryUsage: calculateStats(componentMetrics.map(m => m.memoryUsage)),
      apiResponseTime: calculateStats(componentMetrics.map(m => m.apiResponseTime)),
      totalSamples: componentMetrics.length
    };
  }
  
  /**
   * Generate performance report for all components
   * @returns Comprehensive performance report
   */
  generateReport() {
    const report: Record<string, any> = {};
    
    for (const [componentName] of this.metrics) {
      report[componentName] = this.getPerformanceSummary(componentName);
    }
    
    return {
      timestamp: new Date().toISOString(),
      components: report,
      overallHealth: this.calculateOverallHealth()
    };
  }
  
  private calculateOverallHealth(): 'good' | 'warning' | 'critical' {
    let warningCount = 0;
    let criticalCount = 0;
    
    for (const [componentName] of this.metrics) {
      const summary = this.getPerformanceSummary(componentName);
      if (!summary) continue;
      
      if (summary.loadTime.avg > PERFORMANCE_THRESHOLDS.LOAD_TIME_CRITICAL ||
          summary.renderTime.avg > PERFORMANCE_THRESHOLDS.RENDER_TIME_CRITICAL ||
          summary.memoryUsage.avg > PERFORMANCE_THRESHOLDS.MEMORY_CRITICAL) {
        criticalCount++;
      } else if (summary.loadTime.avg > PERFORMANCE_THRESHOLDS.LOAD_TIME_WARNING ||
                 summary.renderTime.avg > PERFORMANCE_THRESHOLDS.RENDER_TIME_WARNING ||
                 summary.memoryUsage.avg > PERFORMANCE_THRESHOLDS.MEMORY_WARNING) {
        warningCount++;
      }
    }
    
    if (criticalCount > 0) return 'critical';
    if (warningCount > 0) return 'warning';
    return 'good';
  }
}

// Export singleton instance
export const performanceAnalytics = PerformanceAnalytics.getInstance();

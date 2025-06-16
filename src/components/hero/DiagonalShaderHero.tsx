import React, { useState, useEffect, Suspense, lazy } from 'react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ErrorBoundary } from './ErrorBoundary';

// Lazy load the 3D canvas to improve FCP
const ShaderCanvas = lazy(() => 
  import('./ShaderCanvas').then(module => ({
    default: module.default || module
  }))
);

interface DiagonalShaderHeroProps {
  children: React.ReactNode;
  colorStart?: string;
  colorEnd?: string;
  angle?: number;
  speed?: number;
  className?: string;
}

export const DiagonalShaderHero: React.FC<DiagonalShaderHeroProps> = ({
  children,
  colorStart = "#ff511c",
  colorEnd = "#9a89e4",
  angle = 45,
  speed = 0.2,
  className
}) => {
  const [shouldUseShader, setShouldUseShader] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const [showReducedMotionToggle, setShowReducedMotionToggle] = useState(false);

  // CSS gradient fallback style
  const fallbackGradient = {
    background: `linear-gradient(135deg, ${colorStart} 0%, ${colorEnd} 100%)`
  };

  useEffect(() => {
    // Show toggle for users who can control motion preference
    setShowReducedMotionToggle(true);

    // Delay shader loading for better FCP, but only if motion is allowed
    if (!prefersReducedMotion) {
      const timer = setTimeout(() => {
        setShouldUseShader(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [prefersReducedMotion]);

  const toggleReducedMotion = () => {
    setShouldUseShader(!shouldUseShader);
  };

  return (
    <div className={cn("relative min-h-screen overflow-hidden", className)}>
      {/* Static CSS gradient fallback - always rendered for SSR/FCP */}
      <div className="absolute inset-0 z-0" style={fallbackGradient} aria-hidden="true" />
      
      {/* 3D Shader Canvas - lazy loaded and respects motion preferences */}
      {shouldUseShader && !prefersReducedMotion && (
        <ErrorBoundary fallback={
          <div className="absolute inset-0 z-0" style={fallbackGradient} aria-hidden="true" />
        }>
          <Suspense fallback={
            <div className="absolute inset-0 z-0" style={fallbackGradient} aria-hidden="true" />
          }>
            <div className="absolute inset-0 z-0" aria-hidden="true">
              <ShaderCanvas
                colorStart={colorStart}
                colorEnd={colorEnd}
                angle={angle}
                speed={speed}
              />
            </div>
          </Suspense>
        </ErrorBoundary>
      )}

      {/* Content overlay */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Optional reduced motion toggle */}
      {showReducedMotionToggle && (
        <button
          onClick={toggleReducedMotion}
          className="fixed bottom-4 right-4 z-50 rounded-full bg-background/80 p-2 text-foreground/80 shadow-lg backdrop-blur-sm hover:bg-background/90 hover:text-foreground"
          aria-label={shouldUseShader ? "Disable animations" : "Enable animations"}
        >
          {shouldUseShader ? "🚫" : "✨"}
        </button>
      )}
    </div>
  );
};

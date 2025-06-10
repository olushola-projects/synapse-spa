
import React, { useState, useEffect, Suspense } from 'react';
import { cn } from '@/lib/utils';

// Lazy load the 3D canvas to improve FCP
const ShaderCanvas = React.lazy(() => import('./ShaderCanvas'));

interface DiagonalShaderHeroProps {
  children: React.ReactNode;
  colorStart?: string;
  colorEnd?: string;
  angle?: number;
  speed?: number;
  reducedMotionFallback?: boolean;
  className?: string;
}

export const DiagonalShaderHero: React.FC<DiagonalShaderHeroProps> = ({
  children,
  colorStart = "#ff511c",
  colorEnd = "#9a89e4",
  angle = 45,
  speed = 0.2,
  reducedMotionFallback = true,
  className
}) => {
  const [shouldUseShader, setShouldUseShader] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [showReducedMotionToggle, setShowReducedMotionToggle] = useState(false);

  // CSS gradient fallback style
  const fallbackGradient = {
    background: `linear-gradient(${135}deg, ${colorStart} 0%, ${colorEnd} 100%)`
  };

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);

    // Show toggle for users who can control motion preference
    setShowReducedMotionToggle(true);

    // Delay shader loading for better FCP
    const timer = setTimeout(() => {
      if (!mediaQuery.matches && reducedMotionFallback) {
        setShouldUseShader(true);
      }
    }, 100);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      clearTimeout(timer);
    };
  }, [reducedMotionFallback]);

  const toggleReducedMotion = () => {
    setPrefersReducedMotion(!prefersReducedMotion);
    setShouldUseShader(!prefersReducedMotion);
  };

  return (
    <div className={cn("relative min-h-screen overflow-hidden", className)}>
      {/* Static CSS gradient fallback - always rendered for SSR/FCP */}
      <div 
        className="absolute inset-0 z-0"
        style={fallbackGradient}
        aria-hidden="true"
      />

      {/* 3D Shader Canvas - lazy loaded */}
      {shouldUseShader && !prefersReducedMotion && (
        <Suspense fallback={null}>
          <div className="absolute inset-0 z-0" aria-hidden="true">
            <ShaderCanvas
              colorStart={colorStart}
              colorEnd={colorEnd}
              speed={speed}
              angle={angle}
            />
          </div>
        </Suspense>
      )}

      {/* Reduced motion toggle */}
      {showReducedMotionToggle && (
        <button
          onClick={toggleReducedMotion}
          className="absolute top-4 left-4 z-50 px-3 py-1.5 text-xs bg-white/20 backdrop-blur-sm rounded-md text-white hover:bg-white/30 transition-colors"
          aria-label={`${prefersReducedMotion ? 'Enable' : 'Disable'} motion effects`}
        >
          {prefersReducedMotion ? '🎬 Enable Motion' : '⏸️ Reduce Motion'}
        </button>
      )}

      {/* Hero content overlay */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {children}
      </div>
    </div>
  );
};

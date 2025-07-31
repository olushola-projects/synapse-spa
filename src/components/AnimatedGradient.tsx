import { useEffect, useRef } from 'react';

interface AnimatedGradientProps {
  className?: string;
}

export const AnimatedGradient: React.FC<AnimatedGradientProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Professional GRC/RegTech color palette with proper contrast
    const colors = [
      '#1e3a8a', // Deep blue
      '#3b82f6', // Blue
      '#60a5fa', // Light blue
      '#1e40af'  // Royal blue
    ];
    
    let step = 0;
    let animationId: number;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * 1.5;
      canvas.height = rect.height * 1.5;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      
      // Create multiple gradient layers for depth
      const gradient1 = ctx.createLinearGradient(0, 0, w, h);
      const gradient2 = ctx.createRadialGradient(w * 0.3, h * 0.3, 0, w * 0.7, h * 0.7, w);
      
      const pct = (Math.sin(step) + 1) / 2;
      const pct2 = (Math.cos(step * 0.7) + 1) / 2;
      
      // Primary gradient
      gradient1.addColorStop(0, colors[0]!);
      gradient1.addColorStop(pct, colors[1]!);
      gradient1.addColorStop(1, colors[2]!);
      
      // Secondary overlay gradient
      gradient2.addColorStop(0, colors[3]! + '40'); // 25% opacity
      gradient2.addColorStop(pct2, colors[1]! + '20'); // 12% opacity
      gradient2.addColorStop(1, 'transparent');

      // Fill with primary gradient
      ctx.fillStyle = gradient1;
      ctx.fillRect(0, 0, w, h);
      
      // Add overlay gradient
      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, w, h);
    };

    const animate = () => {
      step += 0.005; // Slower, more professional animation
      draw();
      animationId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      resize();
      draw();
    };

    window.addEventListener('resize', handleResize);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{
        transform: 'rotate(15deg) translate(-20%, -20%)',
        transformOrigin: 'center center'
      }}
    />
  );
};
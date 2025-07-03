import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';
import { ChevronRight, Shield, Zap, Users, TrendingUp } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Interface for product/feature cards in the parallax hero
 */
export interface Product {
  title: string;
  link: string;
  thumbnail: string;
  description: string;
  category: string;
}

/**
 * Props for the HeroParallax component
 */
interface HeroParallaxProps {
  products: Product[];
  className?: string;
  enableParallax?: boolean; // Accessibility option to disable animations
}

/**
 * Individual product card component with hover effects
 */
const ProductCard: React.FC<{
  product: Product;
  translate: MotionValue<number>;
  enableParallax: boolean;
}> = ({ product, translate, enableParallax }) => {
  return (
    <motion.div
      style={{
        x: enableParallax ? translate : 0,
      }}
      whileHover={{
        y: enableParallax ? -20 : 0,
        transition: { duration: 0.3 }
      }}
      className="group/product h-96 w-[30rem] relative flex-shrink-0"
    >
      <div className="block group-hover/product:shadow-2xl transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-synapse-primary/10 to-synapse-secondary/10 rounded-3xl" />
        <div className="relative h-full w-full overflow-hidden rounded-3xl bg-white/80 backdrop-blur-sm border border-synapse-primary/20 p-6 flex flex-col justify-between">
          {/* Category Badge */}
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-synapse-primary/10 text-synapse-primary border border-synapse-primary/20">
              {product.category}
            </span>
            <div className="p-2 rounded-full bg-synapse-primary/10">
              <Shield className="h-4 w-4 text-synapse-primary" />
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover/product:text-synapse-primary transition-colors">
              {product.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              {product.description}
            </p>
          </div>
          
          {/* Thumbnail/Icon Area */}
          <div className="h-32 bg-gradient-to-br from-synapse-primary/5 to-synapse-secondary/5 rounded-2xl flex items-center justify-center mb-4">
            <div className="text-synapse-primary/40">
              <TrendingUp className="h-12 w-12" />
            </div>
          </div>
          
          {/* Action */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Learn more</span>
            <ChevronRight className="h-4 w-4 text-synapse-primary group-hover/product:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Header component with main hero content
 */
const Header: React.FC<{ enableParallax: boolean }> = ({ enableParallax }) => {
  return (
    <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full left-0 top-0">
      <motion.h1 
        initial={{ opacity: 0, y: enableParallax ? 20 : 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-2xl md:text-7xl font-bold text-gray-900 leading-tight"
      >
        Transform Your{' '}
        <span className="bg-gradient-to-r from-synapse-primary to-synapse-secondary bg-clip-text text-transparent">
          GRC Operations
        </span>{' '}
        with AI
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: enableParallax ? 20 : 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-2xl text-base md:text-xl text-gray-600 mt-8 leading-relaxed"
      >
        Synapses empowers GRC professionals with AI-native compliance automation, 
        real-time risk assessment, and intelligent regulatory navigation. 
        Your Agentic Hub for the future of compliance.
      </motion.p>
      
      <motion.div 
        initial={{ opacity: 0, y: enableParallax ? 20 : 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-4 mt-8"
      >
        <button className="group inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-synapse-primary hover:bg-synapse-primary/90 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
          Start Free Trial
          <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </button>
        
        <button className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-synapse-primary bg-white hover:bg-gray-50 rounded-xl border border-synapse-primary/20 transition-all duration-200 shadow-sm hover:shadow-md">
          Watch Demo
        </button>
      </motion.div>
      
      {/* Feature highlights */}
      <motion.div 
        initial={{ opacity: 0, y: enableParallax ? 20 : 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="flex flex-wrap gap-6 mt-12"
      >
        {[
          { icon: Shield, text: 'SOC 2 Compliant' },
          { icon: Zap, text: 'Real-time Monitoring' },
          { icon: Users, text: 'Expert Support' }
        ].map((feature, index) => (
          <div key={index} className="flex items-center gap-2 text-gray-600">
            <feature.icon className="h-5 w-5 text-synapse-primary" />
            <span className="text-sm font-medium">{feature.text}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

/**
 * Main HeroParallax component with accessibility considerations
 */
export const HeroParallax: React.FC<HeroParallaxProps> = ({ 
  products, 
  className,
  enableParallax = true 
}) => {
  const [reducedMotion, setReducedMotion] = useState(false);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Check for user's motion preferences
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handleChange = () => setReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const shouldAnimate = enableParallax && !reducedMotion;

  // Parallax transforms with smooth spring animations
  const springConfig = { stiffness: 300, damping: 30, restDelta: 0.001 };
  
  const translateFirst = useSpring(
    useTransform(scrollYProgress, [0, 1], shouldAnimate ? [0, -200] : [0, 0]),
    springConfig
  );
  const translateSecond = useSpring(
    useTransform(scrollYProgress, [0, 1], shouldAnimate ? [0, 200] : [0, 0]),
    springConfig
  );
  const translateThird = useSpring(
    useTransform(scrollYProgress, [0, 1], shouldAnimate ? [0, -200] : [0, 0]),
    springConfig
  );

  // Split products into three rows for parallax effect
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);

  return (
    <div
      ref={ref}
      className={cn(
        "h-[300vh] py-40 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]",
        "bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20",
        className
      )}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      
      <Header enableParallax={shouldAnimate} />
      
      {/* Parallax product rows */}
      <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
        {firstRow.map((product, index) => (
          <ProductCard
            key={`first-${index}`}
            product={product}
            translate={translateFirst}
            enableParallax={shouldAnimate}
          />
        ))}
      </motion.div>
      
      <motion.div className="flex flex-row mb-20 space-x-20">
        {secondRow.map((product, index) => (
          <ProductCard
            key={`second-${index}`}
            product={product}
            translate={translateSecond}
            enableParallax={shouldAnimate}
          />
        ))}
      </motion.div>
      
      <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
        {thirdRow.map((product, index) => (
          <ProductCard
            key={`third-${index}`}
            product={product}
            translate={translateThird}
            enableParallax={shouldAnimate}
          />
        ))}
      </motion.div>
    </div>
  );
};

// Default export
export default HeroParallax;
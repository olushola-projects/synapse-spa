
import React, { ReactNode } from 'react';
import { motion, MotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StripeSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  containerClassName?: string;
  withGrid?: boolean;
  withStripes?: boolean;
}

export const StripeSection = ({
  children,
  className,
  containerClassName,
  withGrid = false,
  withStripes = false,
  ...props
}: StripeSectionProps) => {
  return (
    <section className={cn("relative overflow-hidden py-20", className)} {...props}>
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50/30"></div>
      
      {/* Optional grid pattern */}
      {withGrid && (
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f030_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f030_1px,transparent_1px)] bg-[size:20px_20px]"></div>
      )}
      
      {/* Optional diagonal stripes */}
      {withStripes && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 rotate-[-35deg] translate-y-[-25%] translate-x-[-15%]">
            <div className="h-1 w-[200%] bg-gradient-to-r from-blue-200/40 to-blue-100/10 mb-16"></div>
            <div className="h-2 w-[200%] bg-gradient-to-r from-indigo-200/30 to-purple-100/20 mb-20"></div>
            <div className="h-1 w-[200%] bg-gradient-to-r from-blue-100/20 to-indigo-100/10 mb-14"></div>
            <div className="h-3 w-[200%] bg-gradient-to-r from-purple-100/15 to-indigo-200/25 mb-24"></div>
          </div>
        </div>
      )}
      
      {/* Content container */}
      <div className={cn("container relative mx-auto px-4", containerClassName)}>
        {children}
      </div>
    </section>
  );
};

interface StripeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  withShadow?: boolean;
  withHover?: boolean;
}

export const StripeCard = ({
  children,
  className,
  withShadow = true,
  withHover = true,
  ...props
}: StripeCardProps) => {
  return (
    <div 
      className={cn(
        "bg-white backdrop-blur-sm rounded-xl p-6 border border-gray-100 relative z-10",
        withShadow && "shadow-sm hover:shadow-md",
        withHover && "transition-all duration-300 hover:-translate-y-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface StripeMotionProps extends MotionProps {
  children: ReactNode;
  className?: string;
}

export const StripeMotionContainer = ({
  children,
  className,
  ...props
}: StripeMotionProps) => {
  return (
    <motion.div
      className={cn("", className)}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.6,
        staggerChildren: 0.2
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const StripeMotionItem = ({
  children,
  className,
  ...props
}: StripeMotionProps) => {
  return (
    <motion.div
      className={cn("", className)}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const StripeBadge = ({ 
  children, 
  className 
}: { 
  children: ReactNode; 
  className?: string;
}) => (
  <span className={cn(
    "inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10",
    className
  )}>
    {children}
  </span>
);

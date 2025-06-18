"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card"
import { Badge } from "./badge"
import { Button } from "./button"
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react"

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "metric" | "alert" | "success" | "warning"
  title?: string
  description?: string
  value?: string | number
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  status?: "active" | "inactive" | "pending"
  interactive?: boolean
  loading?: boolean
  children?: React.ReactNode
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
  hover: {
    y: -4,
    scale: 1.02,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1
    }
  }
}

const valueVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      delay: 0.2,
      duration: 0.3
    }
  }
}

const trendVariants = {
  up: {
    color: "#10b981",
    rotate: [0, -5, 5, 0],
    transition: {
      rotate: {
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  },
  down: {
    color: "#ef4444",
    rotate: [0, 5, -5, 0],
    transition: {
      rotate: {
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  },
  neutral: {
    color: "#6b7280"
  }
}

const statusColors = {
  active: "bg-green-500",
  inactive: "bg-gray-400",
  pending: "bg-yellow-500"
}

const variantStyles = {
  default: "border-border",
  metric: "border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50",
  alert: "border-red-200 bg-gradient-to-br from-red-50 to-pink-50",
  success: "border-green-200 bg-gradient-to-br from-green-50 to-emerald-50",
  warning: "border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50"
}

const AnimatedCard = React.forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ 
    className, 
    variant = "default", 
    title, 
    description, 
    value, 
    trend, 
    trendValue, 
    status, 
    interactive = false, 
    loading = false,
    children,
    ...props 
  }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false)

    const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : null

    return (
      <motion.div
        ref={ref}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={interactive ? "hover" : undefined}
        whileTap={interactive ? "tap" : undefined}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className={cn(
          "relative overflow-hidden",
          className
        )}
        {...props}
      >
        <Card className={cn(
          "transition-all duration-300 border-2",
          variantStyles[variant],
          interactive && "cursor-pointer"
        )}>
          {/* Status indicator */}
          {status && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 500 }}
              className={cn(
                "absolute top-3 right-3 w-3 h-3 rounded-full",
                statusColors[status]
              )}
            />
          )}

          {/* Loading overlay */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                {title && (
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                  </CardTitle>
                )}
                {description && (
                  <CardDescription className="text-xs">
                    {description}
                  </CardDescription>
                )}
              </div>
              {variant === "alert" && (
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, -5, 5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </motion.div>
              )}
              {variant === "success" && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
                >
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </motion.div>
              )}
            </div>
          </CardHeader>

          <CardContent>
            {value && (
              <motion.div 
                variants={valueVariants}
                initial="hidden"
                animate="visible"
                className="flex items-baseline space-x-2"
              >
                <span className="text-2xl font-bold tracking-tight">
                  {value}
                </span>
                {trend && TrendIcon && (
                  <motion.div
                    variants={trendVariants}
                    animate={trend}
                    className="flex items-center space-x-1"
                  >
                    <TrendIcon className="h-4 w-4" />
                    {trendValue && (
                      <span className="text-sm font-medium">
                        {trendValue}
                      </span>
                    )}
                  </motion.div>
                )}
              </motion.div>
            )}
            {children}
          </CardContent>

          {/* Interactive glow effect */}
          <AnimatePresence>
            {isHovered && interactive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 pointer-events-none"
              />
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    )
  }
)

AnimatedCard.displayName = "AnimatedCard"

export { AnimatedCard }
export type { AnimatedCardProps }
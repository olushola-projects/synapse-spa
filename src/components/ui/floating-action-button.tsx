"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"
import { Badge } from "./badge"
import { 
  Plus, 
  MessageSquare, 
  Bell, 
  Settings, 
  HelpCircle, 
  Zap, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  X,
  ChevronUp
} from "lucide-react"

interface FloatingAction {
  id: string
  label: string
  icon: React.ReactNode
  onClick: () => void
  variant?: "default" | "primary" | "secondary" | "success" | "warning" | "danger"
  badge?: string | number
  disabled?: boolean
  shortcut?: string
}

interface FloatingActionButtonProps {
  actions?: FloatingAction[]
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left"
  size?: "sm" | "md" | "lg"
  variant?: "default" | "primary" | "secondary"
  showLabels?: boolean
  expandDirection?: "up" | "down" | "left" | "right"
  triggerIcon?: React.ReactNode
  triggerLabel?: string
  className?: string
  onToggle?: (isOpen: boolean) => void
}

const positionClasses = {
  "bottom-right": "fixed bottom-6 right-6",
  "bottom-left": "fixed bottom-6 left-6",
  "top-right": "fixed top-6 right-6",
  "top-left": "fixed top-6 left-6"
}

const sizeClasses = {
  sm: "w-12 h-12",
  md: "w-14 h-14",
  lg: "w-16 h-16"
}

const variantStyles = {
  default: "bg-background border-border shadow-lg hover:shadow-xl",
  primary: "bg-primary text-primary-foreground shadow-lg hover:shadow-xl",
  secondary: "bg-secondary text-secondary-foreground shadow-lg hover:shadow-xl",
  success: "bg-green-500 text-white shadow-lg hover:shadow-xl",
  warning: "bg-yellow-500 text-white shadow-lg hover:shadow-xl",
  danger: "bg-red-500 text-white shadow-lg hover:shadow-xl"
}

const expandVariants = {
  up: {
    container: "flex-col-reverse",
    spacing: "space-y-reverse space-y-3"
  },
  down: {
    container: "flex-col",
    spacing: "space-y-3"
  },
  left: {
    container: "flex-row-reverse",
    spacing: "space-x-reverse space-x-3"
  },
  right: {
    container: "flex-row",
    spacing: "space-x-3"
  }
}

const containerVariants = {
  closed: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  },
  open: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
}

const itemVariants = {
  closed: {
    opacity: 0,
    scale: 0,
    y: 20,
    transition: {
      duration: 0.2
    }
  },
  open: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30
    }
  }
}

const triggerVariants = {
  closed: {
    rotate: 0,
    scale: 1
  },
  open: {
    rotate: 45,
    scale: 1.1
  }
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  actions = [],
  position = "bottom-right",
  size = "md",
  variant = "primary",
  showLabels = true,
  expandDirection = "up",
  triggerIcon = <Plus className="h-6 w-6" />,
  triggerLabel = "Actions",
  className,
  onToggle
}) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [hoveredAction, setHoveredAction] = React.useState<string | null>(null)

  const handleToggle = () => {
    const newState = !isOpen
    setIsOpen(newState)
    onToggle?.(newState)
  }

  const handleActionClick = (action: FloatingAction) => {
    if (!action.disabled) {
      action.onClick()
      setIsOpen(false)
    }
  }

  const handleKeyDown = React.useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' && isOpen) {
      setIsOpen(false)
    }
    
    // Handle keyboard shortcuts
    actions.forEach(action => {
      if (action.shortcut && event.key === action.shortcut && (event.ctrlKey || event.metaKey)) {
        event.preventDefault()
        handleActionClick(action)
      }
    })
  }, [isOpen, actions])

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const expandConfig = expandVariants[expandDirection]

  return (
    <TooltipProvider>
      <div className={cn(positionClasses[position], "z-50", className)}>
        <motion.div
          className={cn(
            "flex items-end",
            expandConfig.container,
            expandConfig.spacing
          )}
          variants={containerVariants}
          initial="closed"
          animate={isOpen ? "open" : "closed"}
        >
          {/* Action Items */}
          <AnimatePresence>
            {isOpen && actions.map((action) => (
              <motion.div
                key={action.id}
                variants={itemVariants}
                className="relative"
                onHoverStart={() => setHoveredAction(action.id)}
                onHoverEnd={() => setHoveredAction(null)}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant={action.variant || "default"}
                      className={cn(
                        "relative rounded-full shadow-lg transition-all duration-200",
                        sizeClasses.sm,
                        action.disabled && "opacity-50 cursor-not-allowed",
                        hoveredAction === action.id && "scale-110"
                      )}
                      onClick={() => handleActionClick(action)}
                      disabled={action.disabled}
                    >
                      {action.icon}
                      
                      {/* Badge */}
                      {action.badge && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1"
                        >
                          <Badge 
                            variant="destructive" 
                            className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                          >
                            {action.badge}
                          </Badge>
                        </motion.div>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <div className="flex items-center gap-2">
                      <span>{action.label}</span>
                      {action.shortcut && (
                        <Badge variant="outline" className="text-xs">
                          ⌘{action.shortcut}
                        </Badge>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>

                {/* Label */}
                {showLabels && (
                  <AnimatePresence>
                    {hoveredAction === action.id && (
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap"
                      >
                        <div className="bg-popover text-popover-foreground px-3 py-1 rounded-md shadow-lg border text-sm font-medium">
                          {action.label}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Trigger Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className={cn(
                    "rounded-full border-2 transition-all duration-300",
                    sizeClasses[size],
                    variantStyles[variant],
                    isOpen && "shadow-2xl"
                  )}
                  onClick={handleToggle}
                >
                  <motion.div
                    variants={triggerVariants}
                    animate={isOpen ? "open" : "closed"}
                    transition={{ duration: 0.2 }}
                  >
                    {isOpen ? <X className="h-6 w-6" /> : triggerIcon}
                  </motion.div>
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent side="left">
              {isOpen ? "Close" : triggerLabel}
            </TooltipContent>
          </Tooltip>
        </motion.div>

        {/* Backdrop */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
              onClick={() => setIsOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  )
}

// Predefined GRC-specific actions
const createGRCActions = (handlers: {
  onNewRisk?: () => void
  onNewCompliance?: () => void
  onAIAssistant?: () => void
  onNotifications?: () => void
  onSettings?: () => void
  onHelp?: () => void
}): FloatingAction[] => [
  {
    id: "new-risk",
    label: "New Risk Assessment",
    icon: <AlertTriangle className="h-4 w-4" />,
    onClick: handlers.onNewRisk || (() => {}),
    variant: "warning",
    shortcut: "r"
  },
  {
    id: "new-compliance",
    label: "New Compliance Check",
    icon: <CheckCircle className="h-4 w-4" />,
    onClick: handlers.onNewCompliance || (() => {}),
    variant: "success",
    shortcut: "c"
  },
  {
    id: "ai-assistant",
    label: "AI Assistant",
    icon: <Zap className="h-4 w-4" />,
    onClick: handlers.onAIAssistant || (() => {}),
    variant: "primary",
    shortcut: "a",
    badge: "AI"
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: <Bell className="h-4 w-4" />,
    onClick: handlers.onNotifications || (() => {}),
    variant: "default",
    badge: 3
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings className="h-4 w-4" />,
    onClick: handlers.onSettings || (() => {}),
    variant: "secondary"
  },
  {
    id: "help",
    label: "Help & Support",
    icon: <HelpCircle className="h-4 w-4" />,
    onClick: handlers.onHelp || (() => {}),
    variant: "default"
  }
]

export { FloatingActionButton, createGRCActions }
export type { FloatingActionButtonProps, FloatingAction }
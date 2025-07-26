import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Bot, Brain, Search, FileText, Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TypingIndicatorProps {
  agentName?: string;
  processingType?: 'thinking' | 'searching' | 'analyzing' | 'calculating' | 'generating';
  message?: string;
  className?: string;
}

/**
 * Typing indicator component that shows agent processing status
 * Provides visual feedback during SFDR compliance analysis
 */
export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  agentName = 'SFDR Navigator',
  processingType = 'thinking',
  message,
  className
}) => {
  /**
   * Get processing configuration based on type
   */
  const getProcessingConfig = () => {
    switch (processingType) {
      case 'searching':
        return {
          icon: <Search className="h-4 w-4" />,
          color: 'text-blue-500',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          defaultMessage: 'Searching regulatory databases...'
        };
      case 'analyzing':
        return {
          icon: <FileText className="h-4 w-4" />,
          color: 'text-green-500',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          defaultMessage: 'Analyzing compliance requirements...'
        };
      case 'calculating':
        return {
          icon: <Calculator className="h-4 w-4" />,
          color: 'text-purple-500',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          defaultMessage: 'Calculating ESG metrics...'
        };
      case 'generating':
        return {
          icon: <Brain className="h-4 w-4" />,
          color: 'text-orange-500',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          defaultMessage: 'Generating compliance report...'
        };
      default: // thinking
        return {
          icon: <Bot className="h-4 w-4" />,
          color: 'text-blue-500',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          defaultMessage: 'Processing your request...'
        };
    }
  };

  const config = getProcessingConfig();
  const displayMessage = message || config.defaultMessage;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={cn("mr-12", className)}
    >
      <Card className={cn(
        "relative",
        config.bgColor,
        config.borderColor
      )}>
        <CardContent className="p-4">
          <div className="flex space-x-3">
            <Avatar className="h-8 w-8 bg-blue-500 text-white">
              <AvatarFallback>AI</AvatarFallback>
              {config.icon}
            </Avatar>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{agentName}</span>
                  <Badge variant="outline" className={cn("text-xs", config.color)}>
                    {processingType}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className={config.color}
                >
                  {config.icon}
                </motion.div>
                
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{displayMessage}</p>
                  
                  {/* Animated dots */}
                  <div className="flex items-center space-x-1 mt-2">
                    {[0, 1, 2].map((index) => (
                      <motion.div
                        key={index}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: index * 0.2
                        }}
                        className={cn(
                          "h-2 w-2 rounded-full",
                          config.color.replace('text-', 'bg-')
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        
        {/* Pulse border effect */}
        <motion.div
          animate={{
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={cn(
            "absolute inset-0 rounded-lg border-2",
            config.borderColor,
            "pointer-events-none"
          )}
        />
      </Card>
    </motion.div>
  );
};

/**
 * Simple dots typing indicator for minimal UI
 */
export const SimpleTypingIndicator: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn("flex items-center space-x-1", className)}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 1, 0.3]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.2
          }}
          className="h-2 w-2 bg-blue-500 rounded-full"
        />
      ))}
    </div>
  );
};

/**
 * Processing stages indicator for complex operations
 */
interface ProcessingStagesProps {
  stages: Array<{
    name: string;
    status: 'pending' | 'active' | 'completed';
    description?: string;
  }>;
  className?: string;
}

export const ProcessingStages: React.FC<ProcessingStagesProps> = ({ stages, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("mr-12", className)}
    >
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex space-x-3">
            <Avatar className="h-8 w-8 bg-blue-500 text-white">
              <AvatarFallback>AI</AvatarFallback>
              <Brain className="h-4 w-4" />
            </Avatar>
            
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">SFDR Navigator</span>
                <Badge variant="outline" className="text-xs text-blue-500">
                  Processing
                </Badge>
              </div>
              
              <div className="space-y-2">
                {stages.map((stage, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={cn(
                      "h-2 w-2 rounded-full",
                      stage.status === 'completed' && "bg-green-500",
                      stage.status === 'active' && "bg-blue-500",
                      stage.status === 'pending' && "bg-gray-300"
                    )}>
                      {stage.status === 'active' && (
                        <motion.div
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="h-full w-full bg-blue-500 rounded-full"
                        />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <p className={cn(
                        "text-sm",
                        stage.status === 'active' && "font-medium text-blue-700",
                        stage.status === 'completed' && "text-green-700",
                        stage.status === 'pending' && "text-muted-foreground"
                      )}>
                        {stage.name}
                      </p>
                      {stage.description && stage.status === 'active' && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {stage.description}
                        </p>
                      )}
                    </div>
                    
                    {stage.status === 'completed' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-green-500"
                      >
                        ✓
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
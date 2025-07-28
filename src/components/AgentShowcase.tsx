import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Star,
  ArrowRight,
  CheckCircle,
  Sparkles,
  BarChart3,
  Play,
  Pause,
  Eye,
  Share2,
  Bookmark
} from 'lucide-react';

/**
 * Enhanced agent interface with additional showcase features
 */
interface EnhancedAgent {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  status: 'launching' | 'beta' | 'coming-soon' | 'live';
  category: 'finance' | 'compliance' | 'analytics' | 'automation';
  capabilities: string[];
  metrics: {
    accuracy: number;
    speed: number;
    reliability: number;
    satisfaction: number;
  };
  icon: React.ReactNode;
  gradient: string;
  features: string[];
  useCases: string[];
  launchDate: string;
  demoVideo?: string;
  screenshots: string[];
  pricing: {
    tier: string;
    price: string;
    features: string[];
  };
  testimonials: {
    name: string;
    company: string;
    quote: string;
    rating: number;
  }[];
}

/**
 * Interactive demo component for agent capabilities
 */
const AgentDemo: React.FC<{ agent: EnhancedAgent }> = ({}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  const demoSteps = [
    { title: 'Data Input', description: 'Agent receives and processes input data' },
    { title: 'Analysis', description: 'AI algorithms analyze and interpret information' },
    { title: 'Processing', description: 'Advanced processing using machine learning models' },
    { title: 'Output', description: 'Generates accurate results and recommendations' }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % demoSteps.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, demoSteps.length]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold flex items-center gap-2">
          <Play className="w-4 h-4" />
          Live Demo
        </h4>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
      </div>
      
      <div className="relative">
        <div className="grid grid-cols-2 gap-2">
          {demoSteps.map((step, index) => (
            <motion.div
              key={index}
              className={`p-3 rounded-lg border transition-all duration-300 ${
                currentStep === index 
                  ? 'bg-primary/10 border-primary' 
                  : 'bg-muted/50 border-border'
              }`}
              animate={{
                scale: currentStep === index ? 1.02 : 1,
                opacity: currentStep === index ? 1 : 0.7
              }}
            >
              <div className="text-sm font-medium">{step.title}</div>
              <div className="text-xs text-muted-foreground">{step.description}</div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            background: `conic-gradient(from ${currentStep * 90}deg, transparent, rgba(var(--primary), 0.1), transparent)`
          }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
};

/**
 * Advanced metrics visualization component
 */
const MetricsVisualization: React.FC<{ metrics: EnhancedAgent['metrics'] }> = ({ metrics }) => {
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);
  
  return (
    <div className="space-y-4">
      <h4 className="font-semibold flex items-center gap-2">
        <BarChart3 className="w-4 h-4" />
        Performance Metrics
      </h4>
      
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(metrics).map(([key, value]) => (
          <motion.div
            key={key}
            className="space-y-2 cursor-pointer"
            onHoverStart={() => setHoveredMetric(key)}
            onHoverEnd={() => setHoveredMetric(null)}
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium capitalize">{key}</span>
              <span className="text-sm font-bold text-primary">{value}%</span>
            </div>
            <Progress 
              value={value} 
              className={`h-2 transition-all duration-300 ${
                hoveredMetric === key ? 'h-3' : 'h-2'
              }`} 
            />
            <AnimatePresence>
              {hoveredMetric === key && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-xs text-muted-foreground"
                >
                  {key === 'accuracy' && 'Precision in task completion'}
                  {key === 'speed' && 'Processing time efficiency'}
                  {key === 'reliability' && 'Consistent performance'}
                  {key === 'satisfaction' && 'User satisfaction rating'}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

/**
 * Testimonials carousel component
 */
const TestimonialsCarousel: React.FC<{ testimonials: EnhancedAgent['testimonials'] }> = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);
  
  if (!testimonials.length) return null;
  
  return (
    <div className="space-y-4">
      <h4 className="font-semibold flex items-center gap-2">
        <Star className="w-4 h-4" />
        Customer Testimonials
      </h4>
      
      <div className="relative overflow-hidden rounded-lg bg-muted/30 p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < (testimonials[currentIndex]?.rating || 0)
                      ? 'text-yellow-400 fill-current'
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm italic">"{testimonials[currentIndex]?.quote || ''}"</p>
            <div className="text-xs text-muted-foreground">
              <div className="font-medium">{testimonials[currentIndex]?.name || ''}</div>
              <div>{testimonials[currentIndex]?.company || ''}</div>
            </div>
          </motion.div>
        </AnimatePresence>
        
        <div className="flex justify-center gap-2 mt-4">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-primary' : 'bg-muted-foreground/30'
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Enhanced agent card with advanced interactions
 */
const EnhancedAgentCard: React.FC<{ agent: EnhancedAgent; index: number }> = ({ agent, index }) => {
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);
  
  const handleMouseMove = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(event.clientX - centerX);
    mouseY.set(event.clientY - centerY);
  };
  
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };
  
  return (
    <motion.div
      className="h-full perspective-1000"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d'
      }}
    >
      <Card className="h-full overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-background via-background to-muted/20 backdrop-blur-sm">
        <CardHeader className="pb-4 relative">
          {/* Action buttons */}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsBookmarked(!isBookmarked)}
              className="h-8 w-8 p-0"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-start justify-between pr-16">
            <div className={`p-4 rounded-2xl bg-gradient-to-r ${agent.gradient} text-white shadow-lg transform transition-transform hover:scale-110`}>
              {agent.icon}
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge 
                variant={agent.status === 'launching' ? 'default' : agent.status === 'live' ? 'secondary' : 'secondary'}
                className="capitalize font-medium animate-pulse"
              >
                {agent.status === 'launching' ? (
                  <>
                    <Sparkles className="w-3 h-3 mr-1" />
                    Launching Soon
                  </>
                ) : agent.status === 'live' ? (
                  <>
                    <Sparkles className="w-3 h-3 mr-1" />
                    Live
                  </>
                ) : (
                  agent.status.replace('-', ' ')
                )}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {agent.launchDate}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-3 mt-4">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {agent.name}
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              {agent.description}
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex gap-1 p-1 bg-muted rounded-lg">
            {['overview', 'demo', 'metrics', 'testimonials'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-all capitalize ${
                  activeTab === tab
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="min-h-[200px]"
            >
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      Core Capabilities
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {agent.capabilities.map((capability, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {capability}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Key Features
                    </h4>
                    <ul className="space-y-2">
                      {agent.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              {activeTab === 'demo' && <AgentDemo agent={agent} />}
              
              {activeTab === 'metrics' && <MetricsVisualization metrics={agent.metrics} />}
              
              {activeTab === 'testimonials' && <TestimonialsCarousel testimonials={agent.testimonials} />}
            </motion.div>
          </AnimatePresence>
          
          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" size="sm" className="flex-1">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button size="sm" className="flex-1">
              Get Access
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export { EnhancedAgentCard, AgentDemo, MetricsVisualization, TestimonialsCarousel };
export type { EnhancedAgent };
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Shield,
  Users,
  Brain,
  Zap,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Clock,
  Globe,
  Lock,
  Eye,
  FileText,
  BarChart3,
  Activity,
  Target,
  Sparkles,
  ArrowRight,
  Play,
  ChevronRight,
  Star,
  Award,
  Layers,
  Database,
  Cpu,
  Network
} from 'lucide-react';

// Enhanced Metrics Dashboard
export const CDDMetricsDashboard: React.FC = () => {
  const [activeMetric, setActiveMetric] = useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  const metrics = [
    {
      label: 'Identity Verification Accuracy',
      value: 99.7,
      icon: <Shield className='w-6 h-6' />,
      color: 'from-green-500 to-emerald-600',
      description: 'Advanced biometric and document verification'
    },
    {
      label: 'Processing Speed',
      value: 94.2,
      icon: <Zap className='w-6 h-6' />,
      color: 'from-blue-500 to-cyan-600',
      description: 'Real-time KYC completion in seconds'
    },
    {
      label: 'Risk Detection Rate',
      value: 98.1,
      icon: <Target className='w-6 h-6' />,
      color: 'from-orange-500 to-red-600',
      description: 'ML-powered risk assessment and scoring'
    },
    {
      label: 'Compliance Coverage',
      value: 96.8,
      icon: <CheckCircle className='w-6 h-6' />,
      color: 'from-purple-500 to-indigo-600',
      description: 'Global regulatory compliance standards'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMetric((prev) => (prev + 1) % metrics.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={ref} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
      {metrics.map((metric, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: index * 0.1 }}
          className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${metric.color} text-white cursor-pointer transform transition-all duration-300 hover:scale-105 ${
            activeMetric === index ? 'ring-4 ring-white/30 scale-105' : ''
          }`}
          onClick={() => setActiveMetric(index)}
        >
          <div className='flex items-center justify-between mb-4'>
            <div className='p-2 bg-white/20 rounded-lg backdrop-blur-sm'>
              {metric.icon}
            </div>
            <Badge variant='secondary' className='bg-white/20 text-white border-white/30'>
              {metric.value}%
            </Badge>
          </div>
          <h3 className='font-semibold text-lg mb-2'>{metric.label}</h3>
          <p className='text-sm text-white/80 mb-4'>{metric.description}</p>
          <div className='space-y-2'>
            <div className='flex justify-between text-sm'>
              <span>Performance</span>
              <span>{metric.value}%</span>
            </div>
            <Progress value={metric.value} className='h-2 bg-white/20' />
          </div>
          <motion.div
            className='absolute inset-0 bg-white/10'
            initial={{ x: '-100%' }}
            animate={activeMetric === index ? { x: '100%' } : { x: '-100%' }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          />
        </motion.div>
      ))}
    </div>
  );
};

// Interactive Feature Showcase
export const CDDFeatureShowcase: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  const features = [
    {
      title: 'Biometric Identity Verification',
      description: 'Advanced facial recognition and liveness detection with 99.7% accuracy',
      icon: <Eye className='w-8 h-8' />,
      gradient: 'from-blue-500 to-cyan-500',
      details: [
        'Real-time facial recognition',
        'Liveness detection technology',
        'Document-to-face matching',
        'Anti-spoofing protection'
      ],
      demo: 'Interactive biometric verification demo'
    },
    {
      title: 'AI-Powered Document Analysis',
      description: 'Intelligent OCR and document authenticity validation across 200+ document types',
      icon: <FileText className='w-8 h-8' />,
      gradient: 'from-green-500 to-emerald-500',
      details: [
        'Multi-language OCR support',
        'Forgery detection algorithms',
        'Template matching validation',
        'Real-time data extraction'
      ],
      demo: 'Document scanning simulation'
    },
    {
      title: 'Dynamic Risk Scoring',
      description: 'Machine learning algorithms for real-time risk assessment and behavioral analysis',
      icon: <Brain className='w-8 h-8' />,
      gradient: 'from-purple-500 to-indigo-500',
      details: [
        'ML-based risk models',
        'Behavioral pattern analysis',
        'Transaction monitoring',
        'Adaptive scoring algorithms'
      ],
      demo: 'Risk scoring visualization'
    },
    {
      title: 'Global Sanctions Screening',
      description: 'Real-time screening against 50+ global watchlists and sanctions databases',
      icon: <Globe className='w-8 h-8' />,
      gradient: 'from-orange-500 to-red-500',
      details: [
        'OFAC sanctions screening',
        'PEP database matching',
        'Adverse media monitoring',
        'Real-time updates'
      ],
      demo: 'Sanctions screening interface'
    }
  ];

  return (
    <div ref={ref} className='space-y-8'>
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-4'>
        {features.map((feature, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: index * 0.1 }}
            onClick={() => setActiveFeature(index)}
            className={`p-6 rounded-2xl text-left transition-all duration-300 ${
              activeFeature === index
                ? `bg-gradient-to-br ${feature.gradient} text-white shadow-2xl scale-105`
                : 'bg-card hover:bg-muted border border-border'
            }`}
          >
            <div className={`p-3 rounded-xl mb-4 inline-block ${
              activeFeature === index ? 'bg-white/20' : 'bg-primary/10'
            }`}>
              {feature.icon}
            </div>
            <h3 className='font-semibold text-lg mb-2'>{feature.title}</h3>
            <p className={`text-sm ${
              activeFeature === index ? 'text-white/80' : 'text-muted-foreground'
            }`}>
              {feature.description}
            </p>
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode='wait'>
        <motion.div
          key={activeFeature}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className='bg-card rounded-2xl p-8 border border-border'
        >
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-center'>
            <div className='space-y-6'>
              <div className='flex items-center gap-4'>
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${features[activeFeature].gradient} text-white`}>
                  {features[activeFeature].icon}
                </div>
                <div>
                  <h3 className='text-2xl font-bold'>{features[activeFeature].title}</h3>
                  <p className='text-muted-foreground'>{features[activeFeature].description}</p>
                </div>
              </div>
              
              <div className='space-y-3'>
                <h4 className='font-semibold text-lg'>Key Capabilities</h4>
                <ul className='space-y-2'>
                  {features[activeFeature].details.map((detail, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className='flex items-center gap-3 text-sm'
                    >
                      <div className='w-2 h-2 bg-primary rounded-full' />
                      {detail}
                    </motion.li>
                  ))}
                </ul>
              </div>
              
              <Button className='w-full'>
                <Play className='w-4 h-4 mr-2' />
                Try {features[activeFeature].demo}
              </Button>
            </div>
            
            <div className='bg-muted/50 rounded-2xl p-8 flex items-center justify-center min-h-[300px]'>
              <div className='text-center space-y-4'>
                <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${features[activeFeature].gradient} flex items-center justify-center text-white`}>
                  {features[activeFeature].icon}
                </div>
                <h4 className='font-semibold'>{features[activeFeature].demo}</h4>
                <p className='text-sm text-muted-foreground'>Interactive demo coming soon</p>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Compliance Standards Grid
export const ComplianceStandards: React.FC = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  const standards = [
    { name: 'GDPR', region: 'EU', icon: <Shield className='w-6 h-6' />, color: 'from-blue-500 to-blue-600' },
    { name: 'KYC/AML', region: 'Global', icon: <Users className='w-6 h-6' />, color: 'from-green-500 to-green-600' },
    { name: 'SOX', region: 'US', icon: <FileText className='w-6 h-6' />, color: 'from-purple-500 to-purple-600' },
    { name: 'PCI DSS', region: 'Global', icon: <Lock className='w-6 h-6' />, color: 'from-orange-500 to-orange-600' },
    { name: 'CCPA', region: 'California', icon: <Eye className='w-6 h-6' />, color: 'from-red-500 to-red-600' },
    { name: 'MiFID II', region: 'EU', icon: <BarChart3 className='w-6 h-6' />, color: 'from-indigo-500 to-indigo-600' }
  ];

  return (
    <div ref={ref} className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
      {standards.map((standard, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: index * 0.1 }}
          className={`p-4 rounded-2xl bg-gradient-to-br ${standard.color} text-white text-center space-y-2 hover:scale-105 transition-transform cursor-pointer`}
        >
          <div className='flex justify-center'>{standard.icon}</div>
          <h4 className='font-semibold text-sm'>{standard.name}</h4>
          <p className='text-xs text-white/80'>{standard.region}</p>
        </motion.div>
      ))}
    </div>
  );
};

// Architecture Diagram
export const CDDArchitecture: React.FC = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  const layers = [
    {
      name: 'User Interface',
      description: 'Intuitive dashboard and API endpoints',
      icon: <Layers className='w-8 h-8' />,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'AI Processing Engine',
      description: 'Machine learning models and NLP processing',
      icon: <Brain className='w-8 h-8' />,
      color: 'from-purple-500 to-indigo-500'
    },
    {
      name: 'Data Integration',
      description: 'Real-time data feeds and external APIs',
      icon: <Database className='w-8 h-8' />,
      color: 'from-green-500 to-emerald-500'
    },
    {
      name: 'Security Layer',
      description: 'Encryption, access control, and audit trails',
      icon: <Shield className='w-8 h-8' />,
      color: 'from-red-500 to-orange-500'
    }
  ];

  return (
    <div ref={ref} className='space-y-6'>
      {layers.map((layer, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: index * 0.2 }}
          className='relative'
        >
          <div className={`p-6 rounded-2xl bg-gradient-to-r ${layer.color} text-white`}>
            <div className='flex items-center gap-4'>
              <div className='p-3 bg-white/20 rounded-xl'>
                {layer.icon}
              </div>
              <div className='flex-1'>
                <h3 className='text-xl font-semibold mb-2'>{layer.name}</h3>
                <p className='text-white/80'>{layer.description}</p>
              </div>
              <ChevronRight className='w-6 h-6' />
            </div>
          </div>
          {index < layers.length - 1 && (
            <div className='flex justify-center py-4'>
              <div className='w-px h-8 bg-border' />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

// Performance Benchmarks
export const PerformanceBenchmarks: React.FC = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  const benchmarks = [
    { metric: 'Identity Verification', ourScore: 99.7, industry: 94.2, unit: '%' },
    { metric: 'Processing Time', ourScore: 2.3, industry: 8.7, unit: 's', inverse: true },
    { metric: 'False Positive Rate', ourScore: 0.8, industry: 3.2, unit: '%', inverse: true },
    { metric: 'Customer Satisfaction', ourScore: 96.8, industry: 87.3, unit: '%' }
  ];

  return (
    <div ref={ref} className='space-y-6'>
      {benchmarks.map((benchmark, index) => {
        const isOursBetter = benchmark.inverse 
          ? benchmark.ourScore < benchmark.industry
          : benchmark.ourScore > benchmark.industry;
        
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: index * 0.1 }}
            className='bg-card rounded-2xl p-6 border border-border'
          >
            <div className='flex items-center justify-between mb-4'>
              <h4 className='font-semibold text-lg'>{benchmark.metric}</h4>
              {isOursBetter && (
                <Badge variant='secondary' className='bg-green-100 text-green-800'>
                  <TrendingUp className='w-3 h-3 mr-1' />
                  Leading
                </Badge>
              )}
            </div>
            
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-muted-foreground'>CDD Agent</span>
                <span className='font-semibold text-lg'>
                  {benchmark.ourScore}{benchmark.unit}
                </span>
              </div>
              <Progress 
                value={benchmark.inverse ? 100 - benchmark.ourScore : benchmark.ourScore} 
                className='h-3'
              />
              
              <div className='flex items-center justify-between'>
                <span className='text-sm text-muted-foreground'>Industry Average</span>
                <span className='font-medium'>
                  {benchmark.industry}{benchmark.unit}
                </span>
              </div>
              <Progress 
                value={benchmark.inverse ? 100 - benchmark.industry : benchmark.industry} 
                className='h-2 opacity-50'
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// Customer Success Stories
export const CustomerSuccessStories: React.FC = () => {
  const [activeStory, setActiveStory] = useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  const stories = [
    {
      company: 'NeoBank Digital',
      industry: 'Digital Banking',
      challenge: 'Manual KYC processes taking 3-5 days',
      solution: 'Automated CDD verification in under 2 minutes',
      results: [
        '95% reduction in onboarding time',
        '60% decrease in operational costs',
        '99.2% customer satisfaction rate'
      ],
      quote: 'CDD Agent transformed our customer onboarding from days to minutes while maintaining the highest compliance standards.',
      author: 'Sarah Chen, Chief Compliance Officer',
      logo: '🏦'
    },
    {
      company: 'CryptoExchange Pro',
      industry: 'Cryptocurrency',
      challenge: 'Complex regulatory compliance across multiple jurisdictions',
      solution: 'Unified compliance platform with real-time monitoring',
      results: [
        '100% regulatory compliance maintained',
        '40% reduction in false positives',
        '24/7 automated monitoring'
      ],
      quote: 'The AI-powered risk scoring has been a game-changer for our compliance operations.',
      author: 'Michael Rodriguez, Head of Risk',
      logo: '₿'
    },
    {
      company: 'Global Payments Inc',
      industry: 'Payment Processing',
      challenge: 'High volume transaction monitoring and screening',
      solution: 'Scalable AI platform processing millions of transactions',
      results: [
        '10x increase in processing capacity',
        '85% reduction in manual reviews',
        '99.8% accuracy in risk detection'
      ],
      quote: 'CDD Agent scales effortlessly with our business growth while maintaining exceptional accuracy.',
      author: 'David Kim, VP of Operations',
      logo: '💳'
    }
  ];

  return (
    <div ref={ref} className='space-y-8'>
      <div className='flex justify-center'>
        <div className='flex gap-2'>
          {stories.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveStory(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                activeStory === index ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>
      
      <AnimatePresence mode='wait'>
        <motion.div
          key={activeStory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className='bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8'
        >
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            <div className='space-y-6'>
              <div className='flex items-center gap-4'>
                <div className='text-4xl'>{stories[activeStory].logo}</div>
                <div>
                  <h3 className='text-2xl font-bold'>{stories[activeStory].company}</h3>
                  <p className='text-muted-foreground'>{stories[activeStory].industry}</p>
                </div>
              </div>
              
              <div className='space-y-4'>
                <div>
                  <h4 className='font-semibold text-red-600 mb-2'>Challenge</h4>
                  <p className='text-sm'>{stories[activeStory].challenge}</p>
                </div>
                
                <div>
                  <h4 className='font-semibold text-blue-600 mb-2'>Solution</h4>
                  <p className='text-sm'>{stories[activeStory].solution}</p>
                </div>
              </div>
            </div>
            
            <div className='space-y-6'>
              <div>
                <h4 className='font-semibold text-green-600 mb-4'>Results</h4>
                <ul className='space-y-2'>
                  {stories[activeStory].results.map((result, idx) => (
                    <li key={idx} className='flex items-center gap-3 text-sm'>
                      <CheckCircle className='w-4 h-4 text-green-600' />
                      {result}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className='bg-white/50 rounded-xl p-6'>
                <blockquote className='text-sm italic mb-4'>
                  "{stories[activeStory].quote}"
                </blockquote>
                <cite className='text-xs text-muted-foreground font-medium'>
                  — {stories[activeStory].author}
                </cite>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
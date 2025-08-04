import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CDDMetricsDashboard,
  CDDFeatureShowcase,
  ComplianceStandards,
  CDDArchitecture,
  PerformanceBenchmarks,
  CustomerSuccessStories
} from '@/components/CDDComponents';
import { NexusAgentChat } from '@/components/NexusAgentChat';
import {
  Shield,
  Brain,
  Zap,
  CheckCircle,
  TrendingUp,
  Globe,
  Eye,
  BarChart3,
  Target,
  Sparkles,
  ArrowRight,
  Play,
  ArrowLeft,
  Download,
  Calendar,
  MessageCircle,
  ExternalLink
} from 'lucide-react';

const CDDAgentPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const navigate = useNavigate();
  const heroRef = React.useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center'>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className='text-center space-y-4'
        >
          <div className='w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto' />
          <p className='text-lg text-muted-foreground'>Loading CDD Agent...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-background via-background to-muted/20'>
      {/* Navigation Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className='sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border'
      >
        <div className='container mx-auto max-w-7xl px-4 py-4'>
          <div className='flex items-center justify-between'>
            <Button
              variant='ghost'
              onClick={() => navigate('/agents')}
              className='flex items-center gap-2'
            >
              <ArrowLeft className='w-4 h-4' />
              Back to Agents
            </Button>

            <div className='flex items-center gap-4'>
              <Button variant='outline' size='sm'>
                <Download className='w-4 h-4 mr-2' />
                Download Whitepaper
              </Button>
              <Button size='sm'>
                <MessageCircle className='w-4 h-4 mr-2' />
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Hero Section */}
      <section ref={heroRef} className='relative overflow-hidden py-20 px-4'>
        <div className='absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-600/10' />

        {/* Animated Background Elements */}
        <div className='absolute inset-0 overflow-hidden'>
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className='absolute w-2 h-2 bg-primary/20 rounded-full'
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                scale: 0
              }}
              animate={{
                y: [null, -100],
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        <div className='container mx-auto max-w-7xl relative z-10'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className='text-center space-y-8'
          >
            <div className='flex justify-center'>
              <Badge
                variant='secondary'
                className='px-6 py-3 text-sm font-medium bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20'
              >
                <Sparkles className='w-4 h-4 mr-2' />
                Next-Generation CDD Technology • Launching Q2 2024
              </Badge>
            </div>

            <div className='space-y-4'>
              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.2, duration: 0.8 }}
                className='text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent'
              >
                CDD Agent
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={isHeroInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.4, duration: 0.8 }}
                className='text-lg md:text-xl text-primary font-semibold'
              >
                Redefining Customer Due Diligence with Artificial Intelligence
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.8 }}
              className='text-xl md:text-2xl text-muted-foreground max-w-5xl mx-auto leading-relaxed'
            >
              Revolutionary AI-powered platform that transforms compliance operations with
              <span className='text-primary font-semibold bg-primary/10 px-2 py-1 rounded'>
                {' '}
                99.7% accuracy
              </span>
              ,
              <span className='text-primary font-semibold bg-primary/10 px-2 py-1 rounded'>
                {' '}
                95% faster processing
              </span>
              , and
              <span className='text-primary font-semibold bg-primary/10 px-2 py-1 rounded'>
                {' '}
                60% cost reduction
              </span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8, duration: 0.8 }}
              className='flex flex-col sm:flex-row gap-4 justify-center items-center'
            >
              <Button
                size='lg'
                className='px-10 py-6 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-2xl'
                onClick={() => setIsVideoPlaying(true)}
              >
                <Play className='w-5 h-5 mr-2' />
                Watch Live Demo
              </Button>
              <Button variant='outline' size='lg' className='px-10 py-6 text-lg border-2'>
                <Calendar className='w-5 h-5 mr-2' />
                Schedule Consultation
              </Button>
              <Button variant='ghost' size='lg' className='px-6 py-6 text-lg'>
                <ExternalLink className='w-5 h-5 mr-2' />
                View Documentation
              </Button>
            </motion.div>

            {/* Enhanced Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1, duration: 0.8 }}
              className='grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto pt-16'
            >
              {[
                {
                  label: 'Accuracy Rate',
                  value: '99.7%',
                  icon: <Target className='w-8 h-8' />,
                  color: 'from-green-500 to-emerald-600'
                },
                {
                  label: 'Processing Speed',
                  value: '2.3s',
                  icon: <Zap className='w-8 h-8' />,
                  color: 'from-blue-500 to-cyan-600'
                },
                {
                  label: 'Cost Reduction',
                  value: '60%',
                  icon: <TrendingUp className='w-8 h-8' />,
                  color: 'from-purple-500 to-indigo-600'
                },
                {
                  label: 'Global Coverage',
                  value: '50+',
                  icon: <Globe className='w-8 h-8' />,
                  color: 'from-orange-500 to-red-600'
                }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={isHeroInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`relative p-6 rounded-2xl bg-gradient-to-br ${stat.color} text-white text-center space-y-3 shadow-xl cursor-pointer group`}
                >
                  <div className='flex justify-center text-white/90 group-hover:text-white transition-colors'>
                    {stat.icon}
                  </div>
                  <div className='text-3xl md:text-4xl font-bold'>{stat.value}</div>
                  <div className='text-sm text-white/80 font-medium'>{stat.label}</div>
                  <motion.div
                    className='absolute inset-0 bg-white/10 rounded-2xl'
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Performance Metrics Dashboard */}
      <section className='py-20 px-4 bg-gradient-to-br from-muted/30 to-background'>
        <div className='container mx-auto max-w-7xl'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='text-center space-y-4 mb-16'
          >
            <h2 className='text-4xl md:text-5xl font-bold'>Performance Excellence</h2>
            <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
              Industry-leading metrics that set new standards for CDD technology
            </p>
          </motion.div>

          <CDDMetricsDashboard />
        </div>
      </section>

      {/* Main Content Tabs */}
      <section className='py-20 px-4'>
        <div className='container mx-auto max-w-7xl'>
          <Tabs value={activeTab} onValueChange={setActiveTab} className='space-y-12'>
            <div className='flex justify-center'>
              <TabsList className='grid grid-cols-2 md:grid-cols-6 h-auto p-2 bg-muted/50 rounded-2xl'>
                <TabsTrigger
                  value='overview'
                  className='py-4 px-6 data-[state=active]:bg-background data-[state=active]:shadow-lg rounded-xl'
                >
                  <Eye className='w-4 h-4 mr-2' />
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value='features'
                  className='py-4 px-6 data-[state=active]:bg-background data-[state=active]:shadow-lg rounded-xl'
                >
                  <Sparkles className='w-4 h-4 mr-2' />
                  Features
                </TabsTrigger>
                <TabsTrigger
                  value='demo'
                  className='py-4 px-6 data-[state=active]:bg-background data-[state=active]:shadow-lg rounded-xl'
                >
                  <Play className='w-4 h-4 mr-2' />
                  Live Demo
                </TabsTrigger>
                <TabsTrigger
                  value='architecture'
                  className='py-4 px-6 data-[state=active]:bg-background data-[state=active]:shadow-lg rounded-xl'
                >
                  <Brain className='w-4 h-4 mr-2' />
                  Architecture
                </TabsTrigger>
                <TabsTrigger
                  value='compliance'
                  className='py-4 px-6 data-[state=active]:bg-background data-[state=active]:shadow-lg rounded-xl'
                >
                  <Shield className='w-4 h-4 mr-2' />
                  Compliance
                </TabsTrigger>
                <TabsTrigger
                  value='benchmarks'
                  className='py-4 px-6 data-[state=active]:bg-background data-[state=active]:shadow-lg rounded-xl'
                >
                  <BarChart3 className='w-4 h-4 mr-2' />
                  Benchmarks
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value='overview' className='space-y-16'>
              {/* Enhanced Feature Showcase */}
              <div className='space-y-8'>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className='text-center space-y-4'
                >
                  <h2 className='text-4xl md:text-5xl font-bold'>Revolutionary Features</h2>
                  <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
                    Experience the future of Customer Due Diligence with our cutting-edge AI
                    capabilities
                  </p>
                </motion.div>

                <CDDFeatureShowcase />
              </div>

              {/* Customer Success Stories */}
              <div className='space-y-8'>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className='text-center space-y-4'
                >
                  <h2 className='text-4xl md:text-5xl font-bold'>Customer Success Stories</h2>
                  <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
                    See how leading organizations are transforming their compliance operations
                  </p>
                </motion.div>

                <CustomerSuccessStories />
              </div>
            </TabsContent>

            <TabsContent value='features' className='space-y-12'>
              <CDDFeatureShowcase />
            </TabsContent>

            <TabsContent value='demo' className='space-y-12'>
              <div className='text-center space-y-8'>
                <h2 className='text-4xl font-bold'>Interactive Demo</h2>
                <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
                  Experience CDD Agent in action with our interactive demonstration
                </p>

                <div className='relative max-w-4xl mx-auto'>
                  <div className='bg-background rounded-2xl border shadow-lg'>
                    <NexusAgentChat apiEndpoint='/api/cdd-agent' className='h-[600px]' />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value='architecture' className='space-y-12'>
              <div className='text-center space-y-4 mb-12'>
                <h2 className='text-4xl font-bold'>System Architecture</h2>
                <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
                  Scalable, secure, and intelligent infrastructure designed for enterprise needs
                </p>
              </div>

              <CDDArchitecture />
            </TabsContent>

            <TabsContent value='compliance' className='space-y-12'>
              <div className='text-center space-y-4 mb-12'>
                <h2 className='text-4xl font-bold'>Regulatory Compliance</h2>
                <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
                  Comprehensive coverage of global compliance standards and regulations
                </p>
              </div>

              <ComplianceStandards />

              <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12'>
                <Card className='border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20'>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-3 text-green-700 dark:text-green-400'>
                      <Shield className='w-6 h-6' />
                      Security & Privacy
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    {[
                      'End-to-end encryption for all data in transit and at rest',
                      'SOC 2 Type II certified infrastructure with annual audits',
                      'GDPR compliant data processing with privacy by design',
                      'Regular security audits and penetration testing',
                      'Zero-trust security architecture with multi-factor authentication',
                      'Data anonymization and pseudonymization capabilities'
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className='flex items-start gap-3'
                      >
                        <CheckCircle className='w-5 h-5 text-green-500 mt-0.5 flex-shrink-0' />
                        <span className='text-sm leading-relaxed'>{item}</span>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>

                <Card className='border-0 shadow-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20'>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-3 text-blue-700 dark:text-blue-400'>
                      <Globe className='w-6 h-6' />
                      Global Coverage
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    {[
                      '50+ countries regulatory compliance with local expertise',
                      'Real-time sanctions list updates from OFAC, UN, EU, and more',
                      'Multi-language document processing in 25+ languages',
                      'Local data residency options in major jurisdictions',
                      '24/7 compliance monitoring with intelligent alerting',
                      'Regulatory change management with automatic updates'
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className='flex items-start gap-3'
                      >
                        <CheckCircle className='w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0' />
                        <span className='text-sm leading-relaxed'>{item}</span>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value='benchmarks' className='space-y-12'>
              <div className='text-center space-y-4 mb-12'>
                <h2 className='text-4xl font-bold'>Performance Benchmarks</h2>
                <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
                  See how CDD Agent outperforms industry standards across key metrics
                </p>
              </div>

              <PerformanceBenchmarks />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Call to Action */}
      <section className='py-20 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white relative overflow-hidden'>
        <div className='absolute inset-0 bg-black/10' />
        <div className='container mx-auto max-w-7xl relative z-10'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='text-center space-y-8'
          >
            <h2 className='text-4xl md:text-5xl font-bold'>Ready to Transform Your CDD Process?</h2>
            <p className='text-xl text-white/90 max-w-3xl mx-auto'>
              Join leading financial institutions using CDD Agent to streamline compliance, reduce
              costs, and enhance customer experience.
            </p>

            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
              <Button
                size='lg'
                variant='secondary'
                className='bg-white text-blue-600 hover:bg-blue-50 px-10 py-6 text-lg'
              >
                Start Free Trial
                <ArrowRight className='w-5 h-5 ml-2' />
              </Button>
              <Button
                size='lg'
                variant='outline'
                className='border-white text-white hover:bg-white/10 px-10 py-6 text-lg'
              >
                <Calendar className='w-5 h-5 mr-2' />
                Schedule Demo
              </Button>
            </div>

            <div className='flex items-center justify-center gap-8 pt-8 text-sm text-white/80'>
              <div className='flex items-center gap-2'>
                <CheckCircle className='w-4 h-4' />
                No setup fees
              </div>
              <div className='flex items-center gap-2'>
                <CheckCircle className='w-4 h-4' />
                30-day free trial
              </div>
              <div className='flex items-center gap-2'>
                <CheckCircle className='w-4 h-4' />
                Cancel anytime
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CDDAgentPage;

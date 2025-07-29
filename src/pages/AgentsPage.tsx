import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useInView, useScroll, useTransform } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { EnhancedAgentCard, type EnhancedAgent } from '@/components/AgentShowcase';
import {
  Bot,
  Brain,
  Zap,
  Shield,
  TrendingUp,
  Users,
  Clock,
  Star,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Target,
  BarChart3,
  Globe,
  Lock,
  Rocket,
  Award,
  Lightbulb,
  Cpu,
  Database,
  Network,
  Search,
  Filter,
  Grid,
  List
} from 'lucide-react';

/**
 * Enhanced agent data with comprehensive information
 * Based on research of top AI agent platforms and UX best practices
 */
const enhancedAgents: EnhancedAgent[] = [
  {
    id: 'sfdr-navigator',
    name: 'SFDR Navigator',
    description:
      'Revolutionary AI agent for SFDR compliance and sustainability reporting automation with real-time regulatory updates',
    longDescription:
      "The SFDR Navigator represents the pinnacle of regulatory technology, combining advanced AI with deep domain expertise to revolutionize sustainability reporting. Our agent doesn't just automate compliance—it transforms how organizations approach ESG data management, ensuring accuracy, efficiency, and regulatory adherence at unprecedented scale.",
    status: 'launching',
    category: 'compliance',
    capabilities: [
      'ESG Data Analysis',
      'Automated Reporting',
      'Compliance Monitoring',
      'Risk Assessment',
      'Regulatory Intelligence'
    ],
    metrics: {
      accuracy: 98.7,
      speed: 95.2,
      reliability: 99.1,
      satisfaction: 96.8
    },
    icon: <Shield className='w-8 h-8' />,
    gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
    features: [
      'Real-time SFDR compliance monitoring with instant alerts',
      'Automated sustainability report generation in multiple formats',
      'ESG data validation and verification with blockchain integration',
      'Regulatory change tracking with predictive impact analysis',
      'Multi-language support for global compliance requirements',
      'Advanced analytics dashboard with customizable KPIs',
      'Integration with major ESG data providers and frameworks'
    ],
    useCases: [
      'Asset Management Firms',
      'Investment Banks',
      'Pension Funds',
      'Insurance Companies',
      'Private Equity',
      'Wealth Management'
    ],
    launchDate: '2024-Q1',
    screenshots: [],
    pricing: {
      tier: 'Enterprise',
      price: 'Custom',
      features: [
        'Unlimited reports',
        '24/7 support',
        'Custom integrations',
        'Dedicated success manager'
      ]
    },
    testimonials: [
      {
        name: 'Sarah Chen',
        company: 'Global Asset Management',
        quote:
          "SFDR Navigator reduced our compliance workload by 80% while improving accuracy. It's a game-changer for our ESG reporting.",
        rating: 5
      },
      {
        name: 'Marcus Weber',
        company: 'European Investment Bank',
        quote:
          'The real-time regulatory updates and automated reporting have transformed our sustainability operations.',
        rating: 5
      }
    ]
  },
  {
    id: 'cdd-agent',
    name: 'CDD Agent',
    description:
      'Next-generation Customer Due Diligence agent powered by advanced AI for seamless KYC and AML compliance',
    longDescription:
      'The CDD Agent redefines customer onboarding and compliance through cutting-edge artificial intelligence. By combining machine learning, natural language processing, and advanced risk analytics, our agent delivers unparalleled accuracy in identity verification, risk assessment, and ongoing monitoring while dramatically reducing processing time and operational costs.',
    status: 'launching',
    category: 'compliance',
    capabilities: [
      'Identity Verification',
      'Risk Scoring',
      'Document Analysis',
      'Sanctions Screening',
      'Behavioral Analytics',
      'Continuous Monitoring'
    ],
    metrics: {
      accuracy: 97.3,
      speed: 92.8,
      reliability: 98.5,
      satisfaction: 95.2
    },
    icon: <Users className='w-8 h-8' />,
    gradient: 'from-blue-500 via-indigo-500 to-purple-600',
    features: [
      'Advanced biometric identity verification with liveness detection',
      'Real-time sanctions and PEP screening across global databases',
      'AI-powered document authenticity validation and OCR',
      'Dynamic risk scoring with machine learning algorithms',
      'Continuous transaction monitoring and behavioral analysis',
      'Automated case management with intelligent escalation',
      'Comprehensive audit trails and regulatory reporting'
    ],
    useCases: [
      'Digital Banks',
      'Fintech Platforms',
      'Cryptocurrency Exchanges',
      'Payment Processors',
      'Lending Institutions',
      'Insurance Companies'
    ],
    launchDate: '2024-Q1',
    screenshots: [],
    pricing: {
      tier: 'Professional',
      price: 'From $2.50/check',
      features: ['Volume discounts', 'API access', 'Custom workflows', 'Priority support']
    },
    testimonials: [
      {
        name: 'Alex Rodriguez',
        company: 'NeoBank Solutions',
        quote:
          'CDD Agent streamlined our onboarding process, reducing verification time from hours to minutes while maintaining the highest security standards.',
        rating: 5
      },
      {
        name: 'Emma Thompson',
        company: 'CryptoTrade Exchange',
        quote:
          'The accuracy and speed of identity verification has significantly improved our customer experience and compliance posture.',
        rating: 5
      }
    ]
  }
];

/**
 * Advanced animation variants with sophisticated timing
 */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const heroVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

/**
 * Floating particles background component
 */
const FloatingParticles: React.FC = () => {
  return (
    <div className='absolute inset-0 overflow-hidden pointer-events-none'>
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className='absolute w-2 h-2 bg-primary/20 rounded-full'
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear'
          }}
        />
      ))}
    </div>
  );
};

/**
 * Interactive statistics component with hover effects
 */
const InteractiveStats: React.FC = () => {
  const stats = [
    {
      icon: <Bot className='w-8 h-8' />,
      value: '2+',
      label: 'AI Agents',
      description: 'Specialized agents for different domains'
    },
    {
      icon: <TrendingUp className='w-8 h-8' />,
      value: '98%',
      label: 'Accuracy Rate',
      description: 'Industry-leading precision'
    },
    {
      icon: <Zap className='w-8 h-8' />,
      value: '10x',
      label: 'Faster Processing',
      description: 'Compared to traditional methods'
    },
    {
      icon: <Globe className='w-8 h-8' />,
      value: '24/7',
      label: 'Availability',
      description: 'Continuous operation and monitoring'
    },
    {
      icon: <Award className='w-8 h-8' />,
      value: '99%',
      label: 'Uptime',
      description: 'Enterprise-grade reliability'
    },
    {
      icon: <Lightbulb className='w-8 h-8' />,
      value: '50+',
      label: 'Use Cases',
      description: 'Across multiple industries'
    }
  ];

  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6'>
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          className='group text-center space-y-3 p-4 rounded-2xl hover:bg-muted/50 transition-all duration-300 cursor-pointer'
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className='mx-auto w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300'>
            {stat.icon}
          </div>
          <div className='text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent'>
            {stat.value}
          </div>
          <div className='text-sm font-medium'>{stat.label}</div>
          <div className='text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
            {stat.description}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

/**
 * Advanced search and filter component
 */
const AgentFilters: React.FC<{
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
}> = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  viewMode,
  setViewMode
}) => {
  const categories = ['all', 'compliance', 'finance', 'analytics', 'automation'];

  return (
    <motion.div
      className='flex flex-col md:flex-row gap-4 items-center justify-between p-6 bg-muted/30 rounded-2xl backdrop-blur-sm'
      variants={itemVariants}
    >
      <div className='flex flex-1 items-center gap-4'>
        <div className='relative flex-1 max-w-md'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
          <input
            type='text'
            placeholder='Search agents...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className='w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all'
          />
        </div>

        <div className='flex items-center gap-2'>
          <Filter className='w-4 h-4 text-muted-foreground' />
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className='px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all capitalize'
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className='flex items-center gap-2 bg-background rounded-lg p-1'>
        <Button
          variant={viewMode === 'grid' ? 'default' : 'ghost'}
          size='sm'
          onClick={() => setViewMode('grid')}
          className='h-8 w-8 p-0'
        >
          <Grid className='w-4 h-4' />
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'ghost'}
          size='sm'
          onClick={() => setViewMode('list')}
          className='h-8 w-8 p-0'
        >
          <List className='w-4 h-4' />
        </Button>
      </div>
    </motion.div>
  );
};

/**
 * Main Agents Page component with advanced UX patterns
 */
const AgentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filteredAgents, setFilteredAgents] = useState(enhancedAgents);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  /**
   * Advanced filtering logic with search and category filters
   */
  useEffect(() => {
    let filtered = enhancedAgents;

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(agent => agent.category === selectedCategory);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        agent =>
          agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          agent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          agent.capabilities.some(cap => cap.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredAgents(filtered);
  }, [searchTerm, selectedCategory]);

  return (
    <div className='min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden'>
      <FloatingParticles />

      {/* Enhanced Hero Section */}
      <motion.section
        ref={heroRef}
        className='relative py-24 px-4 text-center overflow-hidden'
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        <div className='absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5' />
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary),0.1),transparent_70%)]' />

        <div className='relative max-w-6xl mx-auto space-y-8'>
          <motion.div
            variants={heroVariants}
            initial='hidden'
            animate='visible'
            className='space-y-6'
          >
            <Badge className='mb-6 px-6 py-3 text-sm font-medium bg-gradient-to-r from-primary/20 to-primary/10 border-primary/20'>
              <Sparkles className='w-4 h-4 mr-2' />
              Next-Generation AI Workforce
            </Badge>

            <h1 className='text-5xl md:text-7xl font-bold leading-tight'>
              <span className='bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent'>
                Meet Your
              </span>
              <br />
              <span className='bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent'>
                AI Agents
              </span>
            </h1>

            <p className='text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed'>
              Discover our revolutionary AI agents designed to transform your business operations.
              From compliance automation to intelligent analytics, experience unprecedented
              efficiency, accuracy, and innovation.
            </p>

            <div className='flex flex-col sm:flex-row gap-4 justify-center pt-8'>
              <Button
                size='lg'
                className='px-8 py-4 text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70'
              >
                <Rocket className='w-5 h-5 mr-2' />
                Explore Agents
              </Button>
              <Button
                variant='outline'
                size='lg'
                className='px-8 py-4 text-lg border-primary/20 hover:bg-primary/5'
              >
                <Clock className='w-5 h-5 mr-2' />
                Join Waitlist
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Interactive Statistics Section */}
      <motion.section
        className='py-20 px-4 relative'
        variants={containerVariants}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-100px' }}
      >
        <div className='max-w-7xl mx-auto'>
          <motion.div variants={itemVariants} className='text-center mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold mb-4'>
              Powered by Advanced AI Technology
            </h2>
            <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
              Our agents leverage cutting-edge artificial intelligence to deliver measurable
              business outcomes across industries.
            </p>
          </motion.div>

          <InteractiveStats />
        </div>
      </motion.section>

      {/* Enhanced Agents Showcase Section */}
      <motion.section
        className='py-20 px-4 relative'
        variants={containerVariants}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-100px' }}
      >
        <div className='max-w-7xl mx-auto space-y-12'>
          <motion.div variants={itemVariants} className='text-center space-y-6'>
            <h2 className='text-4xl md:text-5xl font-bold'>Our AI Agent Portfolio</h2>
            <p className='text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed'>
              Each agent is meticulously engineered with specialized capabilities to address
              specific industry challenges and drive transformational business outcomes.
            </p>
          </motion.div>

          {/* Advanced Filters */}
          <AgentFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />

          {/* Agents Grid */}
          <motion.div
            className={`grid gap-8 ${
              viewMode === 'grid'
                ? 'md:grid-cols-2 xl:grid-cols-2'
                : 'grid-cols-1 max-w-4xl mx-auto'
            }`}
            variants={containerVariants}
            initial='hidden'
            animate='visible'
          >
            {filteredAgents.length > 0 ? (
              filteredAgents.map((agent, index) => (
                <EnhancedAgentCard key={agent.id} agent={agent} index={index} />
              ))
            ) : (
              <motion.div
                variants={itemVariants}
                className='col-span-full text-center py-16 space-y-4'
              >
                <div className='w-24 h-24 mx-auto bg-muted/50 rounded-full flex items-center justify-center'>
                  <Search className='w-12 h-12 text-muted-foreground' />
                </div>
                <h3 className='text-xl font-semibold'>No agents found</h3>
                <p className='text-muted-foreground'>
                  Try adjusting your search or filter criteria
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* Enhanced CTA Section */}
      <motion.section
        className='py-24 px-4 relative overflow-hidden'
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className='absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10' />
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(var(--primary),0.15),transparent_70%)]' />

        <div className='relative max-w-5xl mx-auto text-center space-y-10'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='space-y-6'
          >
            <h2 className='text-4xl md:text-5xl font-bold'>Ready to Transform Your Business?</h2>
            <p className='text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed'>
              Join the waitlist to be among the first to experience the power of our AI agents. Get
              early access, exclusive updates, special launch pricing, and dedicated support from
              our team of experts.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='flex flex-col sm:flex-row gap-6 justify-center'
          >
            <Button
              size='lg'
              className='px-10 py-4 text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70'
            >
              <Star className='w-5 h-5 mr-2' />
              Join Early Access
            </Button>
            <Button
              variant='outline'
              size='lg'
              className='px-10 py-4 text-lg border-primary/20 hover:bg-primary/5'
            >
              <BarChart3 className='w-5 h-5 mr-2' />
              Schedule Demo
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className='flex flex-wrap justify-center gap-8 pt-8 text-sm text-muted-foreground'
          >
            <div className='flex items-center gap-2'>
              <CheckCircle className='w-4 h-4 text-primary' />
              No setup fees
            </div>
            <div className='flex items-center gap-2'>
              <CheckCircle className='w-4 h-4 text-primary' />
              30-day free trial
            </div>
            <div className='flex items-center gap-2'>
              <CheckCircle className='w-4 h-4 text-primary' />
              Cancel anytime
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default AgentsPage;

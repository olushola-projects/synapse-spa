import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import {
  Bot,
  Shield,
  Target,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Brain,
  FileCheck,
  TrendingUp,
  Zap
} from 'lucide-react';

/**
 * NexusAgentSection component - Showcases the SFDR Navigator on the landing page
 * Provides an overview and call-to-action to try the SFDR compliance validation tool
 */
const NexusAgentSection = () => {
  const features = [
    {
      icon: <Target className='w-5 h-5' />,
      title: 'SFDR Classification',
      description: 'Intelligent Article 6/8/9 classification with 94% accuracy'
    },
    {
      icon: <Shield className='w-5 h-5' />,
      title: 'Compliance Validation',
      description: 'Real-time regulatory compliance checking and validation'
    },
    {
      icon: <FileCheck className='w-5 h-5' />,
      title: 'Document Analysis',
      description: 'AI-powered document review and compliance gap analysis'
    },
    {
      icon: <Brain className='w-5 h-5' />,
      title: 'PAI Analysis',
      description: 'Principal Adverse Impact indicators analysis and reporting'
    }
  ];
  return (
    <section className='py-20 bg-gradient-to-br from-slate-50 to-blue-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          viewport={{
            once: true
          }}
          transition={{
            duration: 0.6
          }}
          className='text-center mb-16'
        >
          <div className='flex items-center justify-center gap-3 mb-6'>
            <div className='relative'>
              <Bot className='w-12 h-12 text-primary' />
              <motion.div
                className='absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full'
                animate={{
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2
                }}
              />
            </div>
            <div>
              <h2 className='text-4xl font-bold text-gray-900'>Meet Sophia</h2>
              <Badge
                variant='secondary'
                className='mt-2 bg-primary/10 text-primary border-primary/20'
              >
                SFDR Navigator Agent
              </Badge>
            </div>
          </div>

          <p className='text-gray-600 max-w-3xl mx-auto mb-8 text-base'>
            Your AI-powered guide to sustainable finance disclosures. Sophia breaks down complex
            SFDR requirements into actionable steps, ensuring compliant and accurate reporting.
          </p>

          <div className='flex items-center justify-center gap-6 text-sm text-gray-500'>
            <div className='flex items-center gap-2'>
              <CheckCircle className='w-4 h-4 text-green-600' />
              <span>94% Classification Accuracy</span>
            </div>
            <div className='flex items-center gap-2'>
              <Zap className='w-4 h-4 text-yellow-600' />
              <span>3.2s Average Response</span>
            </div>
            <div className='flex items-center gap-2'>
              <TrendingUp className='w-4 h-4 text-blue-600' />
              <span>500+ Active Users</span>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12'>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{
                opacity: 0,
                y: 20
              }}
              whileInView={{
                opacity: 1,
                y: 0
              }}
              viewport={{
                once: true
              }}
              transition={{
                duration: 0.6,
                delay: index * 0.1
              }}
            >
              <Card className='h-full hover:shadow-lg transition-shadow duration-300'>
                <CardHeader className='pb-3'>
                  <div className='flex items-center gap-3'>
                    <div className='p-2 bg-primary/10 rounded-lg text-primary'>{feature.icon}</div>
                    <CardTitle className='text-lg'>{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className='text-gray-600 text-sm'>{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          viewport={{
            once: true
          }}
          transition={{
            duration: 0.6,
            delay: 0.4
          }}
          className='text-center'
        >
          <Card className='bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20'>
            <CardContent className='py-12'>
              <div className='flex items-center justify-center gap-2 mb-4'>
                <Sparkles className='w-6 h-6 text-primary' />
                <h3 className='text-2xl font-bold text-gray-900'>
                  Ready to Transform Your SFDR Compliance?
                </h3>
              </div>

              <p className='text-gray-600 mb-8 max-w-2xl mx-auto'>
                Experience intelligent SFDR guidance with Sophia. Get instant classifications,
                compliance validation, and regulatory insights tailored to your fund structure.
              </p>

              <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <Button asChild size='lg' className='group'>
                  <Link
                    to='/nexus-agent'
                    className='bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-200'
                  >
                    <Bot className='w-5 h-5 mr-2' />
                    Try SFDR Navigator
                    <ArrowRight className='w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform' />
                  </Link>
                </Button>

                <Button asChild variant='outline' size='lg' className='group'>
                  <Link to='/sfdr-gem'>
                    <Sparkles className='w-5 h-5 mr-2' />
                    Explore SFDR Gem
                    <ArrowRight className='w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform' />
                  </Link>
                </Button>
              </div>

              <div className='mt-6 text-sm text-gray-500'>
                No registration required • Free to explore • Enterprise plans available
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
export default NexusAgentSection;

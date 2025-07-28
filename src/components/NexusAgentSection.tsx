import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Bot,
  Shield,
  TrendingUp,
  FileCheck,
  ArrowRight,
  Zap,
  CheckCircle2,
  Globe
} from 'lucide-react';

/**
 * NexusAgentSection component - Showcases the SFDR Navigator on the landing page
 * Provides an overview and call-to-action to try the SFDR compliance validation tool
 */
const NexusAgentSection = () => {
  const features = [
    {
      icon: <Shield className='w-5 h-5 text-blue-600' />,
      title: 'SFDR Compliance',
      description: 'Real-time validation against EU regulations'
    },
    {
      icon: <FileCheck className='w-5 h-5 text-green-600' />,
      title: 'Article Classification',
      description: 'Automated Article 6, 8, and 9 categorization'
    },
    {
      icon: <TrendingUp className='w-5 h-5 text-purple-600' />,
      title: 'PAI Analysis',
      description: 'Principal Adverse Impact indicator checking'
    },
    {
      icon: <Zap className='w-5 h-5 text-yellow-600' />,
      title: 'Instant Results',
      description: 'Get validation results in under 2 seconds'
    }
  ];

  const stats = [
    { label: 'Accuracy', value: '99.2%' },
    { label: 'Processing Time', value: '<2s' },
    { label: 'Regulatory Coverage', value: 'EU+UK' }
  ];

  return (
    <section className='py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50'>
      <div className='container mx-auto px-4'>
        {/* Header */}
        <div className='text-center mb-16'>
          <div className='flex items-center justify-center gap-3 mb-6'>
            <div className='p-3 bg-blue-100 rounded-full'>
              <Bot className='w-8 h-8 text-blue-600' />
            </div>
            <h2 className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
              Introducing SFDR Navigator
            </h2>
          </div>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto mb-6'>
            AI-powered SFDR compliance validation that helps financial institutions ensure
            regulatory compliance with confidence.
          </p>
          <div className='flex justify-center gap-2 mb-8'>
            <Badge variant='secondary' className='bg-blue-100 text-blue-700'>
              <CheckCircle2 className='w-3 h-3 mr-1' />
              SFDR Compliant
            </Badge>
            <Badge variant='secondary' className='bg-green-100 text-green-700'>
              <Globe className='w-3 h-3 mr-1' />
              EU Regulatory
            </Badge>
            <Badge variant='secondary' className='bg-purple-100 text-purple-700'>
              <Zap className='w-3 h-3 mr-1' />
              Real-time
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <div className='grid lg:grid-cols-2 gap-12 items-center mb-16'>
          {/* Left Column - Features */}
          <div>
            <h3 className='text-2xl font-bold text-gray-900 mb-6'>
              Streamline Your SFDR Compliance Process
            </h3>
            <p className='text-gray-600 mb-8'>
              SFDR Navigator leverages advanced AI to validate fund classifications, analyze PAI
              indicators, and ensure your financial products meet SFDR requirements before
              submission.
            </p>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8'>
              {features.map((feature, index) => (
                <div
                  key={index}
                  className='flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow'
                >
                  <div className='flex-shrink-0 mt-1'>{feature.icon}</div>
                  <div>
                    <h4 className='font-semibold text-gray-900 mb-1'>{feature.title}</h4>
                    <p className='text-sm text-gray-600'>{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className='grid grid-cols-3 gap-4 mb-8'>
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className='text-center p-4 bg-white rounded-lg border border-gray-100'
                >
                  <div className='text-2xl font-bold text-blue-600'>{stat.value}</div>
                  <div className='text-sm text-gray-600'>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className='flex flex-col sm:flex-row gap-4'>
              <Link to='/nexus-agent'>
                <Button
                  size='lg'
                  className='w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white'
                >
                  Try SFDR Navigator
                  <ArrowRight className='w-4 h-4 ml-2' />
                </Button>
              </Link>
              <Button
                variant='outline'
                size='lg'
                className='w-full sm:w-auto border-blue-200 text-blue-600 hover:bg-blue-50'
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Right Column - Demo Preview */}
          <div className='relative'>
            <Card className='shadow-2xl border-0 overflow-hidden'>
              <CardHeader className='bg-gradient-to-r from-blue-600 to-purple-600 text-white'>
                <div className='flex items-center gap-3'>
                  <Bot className='w-6 h-6' />
                  <div>
                    <CardTitle className='text-white'>SFDR Navigator</CardTitle>
                    <CardDescription className='text-blue-100'>
                      SFDR Compliance Validation
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='p-6'>
                {/* Mock Chat Interface */}
                <div className='space-y-4'>
                  <div className='flex gap-3'>
                    <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0'>
                      <Bot className='w-4 h-4 text-blue-600' />
                    </div>
                    <div className='bg-gray-100 rounded-lg p-3 max-w-[80%]'>
                      <p className='text-sm text-gray-800'>
                        Welcome! I can help validate your SFDR fund classification. What type of
                        fund would you like to analyze?
                      </p>
                    </div>
                  </div>

                  <div className='flex gap-3 justify-end'>
                    <div className='bg-blue-600 text-white rounded-lg p-3 max-w-[80%]'>
                      <p className='text-sm'>
                        I need to validate an Article 8 ESG equity fund for EU distribution.
                      </p>
                    </div>
                    <div className='w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0'>
                      <span className='text-xs font-medium text-gray-600'>You</span>
                    </div>
                  </div>

                  <div className='flex gap-3'>
                    <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0'>
                      <Bot className='w-4 h-4 text-blue-600' />
                    </div>
                    <div className='bg-gray-100 rounded-lg p-3 max-w-[80%]'>
                      <div className='space-y-2'>
                        <p className='text-sm text-gray-800 font-medium'>✅ Validation Complete</p>
                        <p className='text-sm text-gray-600'>
                          <strong>Classification:</strong> Article 8 (Confirmed)
                          <br />
                          <strong>Confidence:</strong> 94.2%
                          <br />
                          <strong>Status:</strong> SFDR Compliant
                        </p>
                        <div className='flex gap-1 mt-2'>
                          <Badge
                            variant='secondary'
                            className='text-xs bg-green-100 text-green-700'
                          >
                            PAI Compliant
                          </Badge>
                          <Badge variant='secondary' className='text-xs bg-blue-100 text-blue-700'>
                            EU Ready
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Input Area */}
                <div className='mt-6 pt-4 border-t border-gray-100'>
                  <div className='flex gap-2'>
                    <div className='flex-1 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-500'>
                      Ask about SFDR compliance...
                    </div>
                    <Button size='sm' className='bg-blue-600 hover:bg-blue-700'>
                      <ArrowRight className='w-4 h-4' />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Floating Elements */}
            <div className='absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse'></div>
            <div className='absolute -bottom-6 -left-6 w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-20 animate-pulse delay-1000'></div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className='text-center'>
          <div className='bg-white rounded-2xl p-8 shadow-lg border border-gray-100 max-w-4xl mx-auto'>
            <h3 className='text-2xl font-bold text-gray-900 mb-4'>
              Ready to Streamline Your SFDR Compliance?
            </h3>
            <p className='text-gray-600 mb-6'>
              Join hundreds of financial institutions already using SFDR Navigator to ensure
              regulatory compliance.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Link to='/nexus-agent'>
                <Button
                  size='lg'
                  className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                >
                  Start Free Validation
                  <ArrowRight className='w-4 h-4 ml-2' />
                </Button>
              </Link>
              <Button
                variant='outline'
                size='lg'
                className='border-gray-300 text-gray-700 hover:bg-gray-50'
              >
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NexusAgentSection;

// import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, Brain, Users, LineChart, ShieldCheck, Layers, Database } from 'lucide-react';

const Features = () => {
  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <div className='flex-grow'>
        {/* Hero Section */}
        <section className='bg-gradient-to-br from-synapse-primary to-synapse-secondary text-white py-20'>
          <div className='container mx-auto px-4'>
            <div className='max-w-4xl mx-auto text-center'>
              <h1 className='text-4xl md:text-5xl font-bold mb-6'>Platform Features</h1>
              <p className='text-xl md:text-2xl opacity-90 leading-relaxed'>
                Discover the comprehensive suite of tools that make Synapse the leading platform for
                GRC professionals.
              </p>
              <div className='mt-10 flex flex-col sm:flex-row justify-center gap-4'>
                <Button size='lg' className='bg-white text-synapse-primary hover:bg-white/90'>
                  Request a Demo
                </Button>
                <Button
                  size='lg'
                  variant='outline'
                  className='border-white text-white hover:bg-white/10'
                >
                  Join Waitlist
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section className='py-20'>
          <div className='container mx-auto px-4'>
            <div className='text-center mb-16'>
              <Badge className='mb-4'>Core Capabilities</Badge>
              <h2 className='text-3xl font-bold mb-4'>Comprehensive GRC Intelligence</h2>
              <p className='text-lg text-gray-600 max-w-3xl mx-auto'>
                Our platform combines AI-powered insights, specialized knowledge, and community
                connections to streamline your compliance workflows.
              </p>
            </div>

            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto'>
              {[
                {
                  icon: <Brain className='h-8 w-8 text-synapse-primary' />,
                  title: 'AI Compliance Copilot',
                  description:
                    'Dara, our AI assistant, analyzes regulations and provides actionable insights tailored to your specific compliance needs.'
                },
                {
                  icon: <Database className='h-8 w-8 text-synapse-primary' />,
                  title: 'Regulatory Knowledge Base',
                  description:
                    'Access a comprehensive library of global regulations, frameworks, and standards with expert interpretations.'
                },
                {
                  icon: <Users className='h-8 w-8 text-synapse-primary' />,
                  title: 'GRC Community Network',
                  description:
                    'Connect with peers, share insights, and collaborate with other compliance professionals facing similar challenges.'
                },
                {
                  icon: <LineChart className='h-8 w-8 text-synapse-primary' />,
                  title: 'Compliance Analytics',
                  description:
                    'Visualize your compliance posture with real-time dashboards and reports for informed decision-making.'
                },
                {
                  icon: <ShieldCheck className='h-8 w-8 text-synapse-primary' />,
                  title: 'Control Mapping',
                  description:
                    'Map controls across multiple frameworks to streamline audits and reduce duplicate compliance efforts.'
                },
                {
                  icon: <Layers className='h-8 w-8 text-synapse-primary' />,
                  title: 'Workflow Automation',
                  description:
                    'Automate routine compliance tasks, notifications, and approvals to improve efficiency and reduce errors.'
                }
              ].map((feature, index) => (
                <Card key={index} className='p-6 hover:shadow-md transition-shadow'>
                  <div className='rounded-full bg-blue-50 p-3 w-fit mb-4'>{feature.icon}</div>
                  <h3 className='font-bold text-xl mb-2'>{feature.title}</h3>
                  <p className='text-gray-600'>{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Details Tabs */}
        <section className='py-20 bg-gray-50'>
          <div className='container mx-auto px-4'>
            <div className='text-center mb-16'>
              <Badge className='mb-4'>Explore Features</Badge>
              <h2 className='text-3xl font-bold mb-4'>Designed for GRC Professionals</h2>
              <p className='text-lg text-gray-600 max-w-3xl mx-auto'>
                Each feature is built to address specific challenges faced by compliance teams.
              </p>
            </div>

            <div className='max-w-6xl mx-auto'>
              <Tabs defaultValue='ai' className='w-full'>
                <TabsList className='grid grid-cols-4 gap-4 mb-12'>
                  <TabsTrigger value='ai' className='py-4'>
                    AI Copilot
                  </TabsTrigger>
                  <TabsTrigger value='knowledge' className='py-4'>
                    Knowledge Base
                  </TabsTrigger>
                  <TabsTrigger value='community' className='py-4'>
                    Community
                  </TabsTrigger>
                  <TabsTrigger value='analytics' className='py-4'>
                    Analytics
                  </TabsTrigger>
                </TabsList>

                <TabsContent value='ai' className='pt-6'>
                  <div className='grid md:grid-cols-2 gap-12 items-center'>
                    <div>
                      <h3 className='text-2xl font-bold mb-4'>AI-Powered Compliance Assistance</h3>
                      <p className='text-gray-600 mb-6'>
                        Dara is more than just a chatbot. Built on advanced language models and
                        trained on millions of regulatory documents, Dara provides contextually
                        relevant guidance for your specific compliance scenarios.
                      </p>

                      <ul className='space-y-3'>
                        {[
                          'Ask complex regulatory questions in plain language',
                          'Receive interpretations of new regulations and their impact',
                          'Get step-by-step guidance for compliance processes',
                          'Generate policy templates tailored to your organization',
                          'Analyze documents for potential compliance gaps'
                        ].map((item, i) => (
                          <li key={i} className='flex items-start'>
                            <CheckCircle2 className='h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0' />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className='bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100'>
                      <img
                        src='/placeholder.svg'
                        alt='AI Copilot Interface'
                        className='w-full h-auto'
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value='knowledge' className='pt-6'>
                  <div className='grid md:grid-cols-2 gap-12 items-center'>
                    <div className='order-2 md:order-1 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100'>
                      <img
                        src='/placeholder.svg'
                        alt='Knowledge Base Interface'
                        className='w-full h-auto'
                      />
                    </div>
                    <div className='order-1 md:order-2'>
                      <h3 className='text-2xl font-bold mb-4'>
                        Comprehensive Regulatory Knowledge
                      </h3>
                      <p className='text-gray-600 mb-6'>
                        Access the most up-to-date regulatory information from around the world,
                        organized and searchable to find exactly what you need, when you need it.
                      </p>

                      <ul className='space-y-3'>
                        {[
                          'Global coverage of regulations across industries and jurisdictions',
                          'Regular updates when regulatory changes occur',
                          'Expert annotations and practical interpretations',
                          'Advanced search capabilities with filters and bookmarking',
                          'Customizable alerts for regulations relevant to your business'
                        ].map((item, i) => (
                          <li key={i} className='flex items-start'>
                            <CheckCircle2 className='h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0' />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value='community' className='pt-6'>
                  <div className='grid md:grid-cols-2 gap-12 items-center'>
                    <div>
                      <h3 className='text-2xl font-bold mb-4'>Connect with GRC Professionals</h3>
                      <p className='text-gray-600 mb-6'>
                        Join a vibrant community of compliance professionals who share knowledge,
                        best practices, and opportunities. Network with peers facing similar
                        challenges.
                      </p>

                      <ul className='space-y-3'>
                        {[
                          'Discussion forums organized by industry and regulatory domain',
                          'Private messaging to connect directly with peers',
                          'Expert Q&A sessions with industry leaders',
                          'Career opportunities and professional development resources',
                          'Regional and special interest groups for focused networking'
                        ].map((item, i) => (
                          <li key={i} className='flex items-start'>
                            <CheckCircle2 className='h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0' />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className='bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100'>
                      <img
                        src='/placeholder.svg'
                        alt='Community Interface'
                        className='w-full h-auto'
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value='analytics' className='pt-6'>
                  <div className='grid md:grid-cols-2 gap-12 items-center'>
                    <div className='order-2 md:order-1 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100'>
                      <img
                        src='/placeholder.svg'
                        alt='Analytics Dashboard'
                        className='w-full h-auto'
                      />
                    </div>
                    <div className='order-1 md:order-2'>
                      <h3 className='text-2xl font-bold mb-4'>Data-Driven Compliance Insights</h3>
                      <p className='text-gray-600 mb-6'>
                        Visualize your compliance posture with intuitive dashboards and reports that
                        help you identify gaps, track progress, and demonstrate effectiveness to
                        stakeholders.
                      </p>

                      <ul className='space-y-3'>
                        {[
                          'Real-time compliance status dashboards',
                          'Customizable reports for different stakeholders',
                          'Trend analysis to track improvement over time',
                          'Risk heat maps to identify priority areas',
                          'Automated board and executive reporting'
                        ].map((item, i) => (
                          <li key={i} className='flex items-start'>
                            <CheckCircle2 className='h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0' />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className='bg-synapse-primary py-16'>
          <div className='container mx-auto px-4'>
            <div className='max-w-4xl mx-auto text-center text-white'>
              <h2 className='text-3xl font-bold mb-4'>Ready to transform your GRC experience?</h2>
              <p className='text-xl opacity-90 mb-8'>
                Join the thousands of compliance professionals already using Synapse to simplify
                their workflows.
              </p>
              <div className='flex flex-col sm:flex-row justify-center gap-4'>
                <Button size='lg' className='bg-white text-synapse-primary hover:bg-white/90'>
                  Request a Demo
                </Button>
                <Button
                  size='lg'
                  variant='outline'
                  className='border-white text-white hover:bg-white/10'
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Features;

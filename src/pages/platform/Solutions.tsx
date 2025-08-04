// import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  CheckCircle2,
  Building,
  CreditCard,
  HeartPulse,
  ShieldCheck,
  Network,
  Server
} from 'lucide-react';

const Solutions = () => {
  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <div className='flex-grow'>
        {/* Hero Section */}
        <section className='bg-gradient-to-br from-synapse-primary to-synapse-secondary text-white py-20'>
          <div className='container mx-auto px-4'>
            <div className='max-w-4xl mx-auto text-center'>
              <h1 className='text-4xl md:text-5xl font-bold mb-6'>Industry Solutions</h1>
              <p className='text-xl md:text-2xl opacity-90 leading-relaxed'>
                Tailored compliance solutions to address the unique regulatory challenges in your
                industry.
              </p>
              <div className='mt-10 flex flex-col sm:flex-row justify-center gap-4'>
                <Button size='lg' className='bg-white text-synapse-primary hover:bg-white/90'>
                  Explore Solutions
                </Button>
                <Button
                  size='lg'
                  variant='outline'
                  className='border-white text-white hover:bg-white/10'
                >
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Industry Solutions */}
        <section className='py-20'>
          <div className='container mx-auto px-4'>
            <div className='text-center mb-16'>
              <Badge className='mb-4'>Industry Focus</Badge>
              <h2 className='text-3xl font-bold mb-4'>Specialized for Your Industry</h2>
              <p className='text-lg text-gray-600 max-w-3xl mx-auto'>
                Our platform is customized to meet the specific compliance requirements across
                different regulated industries.
              </p>
            </div>

            <div className='max-w-6xl mx-auto'>
              <Tabs defaultValue='financial' className='w-full'>
                <TabsList className='grid grid-cols-2 md:grid-cols-6 mb-12'>
                  <TabsTrigger value='financial' className='flex items-center gap-2 py-2'>
                    <CreditCard className='h-4 w-4' /> Financial
                  </TabsTrigger>
                  <TabsTrigger value='healthcare' className='flex items-center gap-2 py-2'>
                    <HeartPulse className='h-4 w-4' /> Healthcare
                  </TabsTrigger>
                  <TabsTrigger value='technology' className='flex items-center gap-2 py-2'>
                    <Server className='h-4 w-4' /> Technology
                  </TabsTrigger>
                  <TabsTrigger value='energy' className='flex items-center gap-2 py-2'>
                    <Network className='h-4 w-4' /> Energy
                  </TabsTrigger>
                  <TabsTrigger value='manufacturing' className='flex items-center gap-2 py-2'>
                    <Building className='h-4 w-4' /> Manufacturing
                  </TabsTrigger>
                  <TabsTrigger value='government' className='flex items-center gap-2 py-2'>
                    <ShieldCheck className='h-4 w-4' /> Government
                  </TabsTrigger>
                </TabsList>

                <TabsContent value='financial' className='pt-6'>
                  <div className='grid md:grid-cols-2 gap-12 items-center'>
                    <div>
                      <h3 className='text-2xl font-bold mb-4'>Financial Services Compliance</h3>
                      <p className='text-gray-600 mb-6'>
                        Navigate the complex landscape of financial regulations with solutions
                        tailored for banks, investment firms, insurance companies, and fintech
                        startups.
                      </p>

                      <div className='mb-8'>
                        <h4 className='font-semibold mb-3'>Key Regulations Covered:</h4>
                        <div className='flex flex-wrap gap-2'>
                          {[
                            'GDPR',
                            'AML',
                            'KYC',
                            'Basel III',
                            'Dodd-Frank',
                            'FATCA',
                            'PSD2',
                            'MiFID II'
                          ].map((reg, i) => (
                            <Badge key={i} variant='outline' className='bg-blue-50'>
                              {reg}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <ul className='space-y-3'>
                        {[
                          'Anti-money laundering (AML) compliance automation',
                          'Know Your Customer (KYC) process streamlining',
                          'Regulatory reporting for multiple jurisdictions',
                          'Risk assessment and management frameworks',
                          'Audit trail and evidence collection'
                        ].map((item, i) => (
                          <li key={i} className='flex items-start'>
                            <CheckCircle2 className='h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0' />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>

                      <Button className='mt-6 flex items-center gap-1'>
                        Learn More <ArrowRight size={16} />
                      </Button>
                    </div>
                    <div className='bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100'>
                      <img
                        src='/lovable-uploads/6ac8bd07-6906-427c-b832-be14819a3aed.png'
                        alt='Financial Services Compliance Dashboard'
                        className='w-full h-auto'
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value='healthcare' className='pt-6'>
                  <div className='grid md:grid-cols-2 gap-12 items-center'>
                    <div className='order-2 md:order-1 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100'>
                      <div className='flex flex-col items-center justify-center p-10 bg-gray-50 h-full'>
                        <p className='text-xl font-semibold text-center mb-4'>
                          Coming Soon to Healthcare Sector
                        </p>
                        <p className='text-gray-500 text-center'>
                          Our specialized healthcare compliance solutions are currently in
                          development.
                        </p>
                      </div>
                    </div>
                    <div className='order-1 md:order-2'>
                      <h3 className='text-2xl font-bold mb-4'>
                        Healthcare & Life Sciences Compliance
                      </h3>
                      <p className='text-gray-600 mb-6'>
                        Ensure patient data protection, adhere to clinical standards, and manage the
                        complex web of healthcare regulations.
                      </p>

                      <div className='mb-8'>
                        <h4 className='font-semibold mb-3'>Key Regulations Covered:</h4>
                        <div className='flex flex-wrap gap-2'>
                          {['HIPAA', 'HITECH', 'FDA', 'GxP', 'CLIA', 'PhRMA Code', 'IEC'].map(
                            (reg, i) => (
                              <Badge key={i} variant='outline' className='bg-blue-50'>
                                {reg}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>

                      <p className='mt-6 font-medium text-blue-600'>Coming soon to this sector</p>

                      <Button disabled className='mt-6 flex items-center gap-1 opacity-70'>
                        Learn More <ArrowRight size={16} />
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* Additional tabs content with "Coming Soon" messaging */}
                <TabsContent value='technology' className='pt-6'>
                  <div className='text-center py-10'>
                    <p className='text-2xl font-semibold mb-4'>Coming Soon to Technology Sector</p>
                    <p className='text-gray-600 max-w-lg mx-auto'>
                      Our specialized technology compliance solutions are currently in development.
                      Contact us for details about our upcoming solutions for tech companies.
                    </p>
                    <Button variant='outline' className='mt-8'>
                      Get Notified When Available
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value='energy' className='pt-6'>
                  <div className='text-center py-10'>
                    <p className='text-2xl font-semibold mb-4'>Coming Soon to Energy Sector</p>
                    <p className='text-gray-600 max-w-lg mx-auto'>
                      Our specialized energy compliance solutions are currently in development.
                      Contact us for details about our upcoming solutions for energy companies.
                    </p>
                    <Button variant='outline' className='mt-8'>
                      Get Notified When Available
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value='manufacturing' className='pt-6'>
                  <div className='text-center py-10'>
                    <p className='text-2xl font-semibold mb-4'>
                      Coming Soon to Manufacturing Sector
                    </p>
                    <p className='text-gray-600 max-w-lg mx-auto'>
                      Our specialized manufacturing compliance solutions are currently in
                      development. Contact us for details about our upcoming solutions for
                      manufacturing companies.
                    </p>
                    <Button variant='outline' className='mt-8'>
                      Get Notified When Available
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value='government' className='pt-6'>
                  <div className='text-center py-10'>
                    <p className='text-2xl font-semibold mb-4'>Coming Soon to Government Sector</p>
                    <p className='text-gray-600 max-w-lg mx-auto'>
                      Our specialized government compliance solutions are currently in development.
                      Contact us for details about our upcoming solutions for government agencies.
                    </p>
                    <Button variant='outline' className='mt-8'>
                      Get Notified When Available
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className='py-20 bg-gray-50'>
          <div className='container mx-auto px-4'>
            <div className='text-center mb-16'>
              <Badge className='mb-4'>Use Cases</Badge>
              <h2 className='text-3xl font-bold mb-4'>Common Compliance Challenges Solved</h2>
              <p className='text-lg text-gray-600 max-w-3xl mx-auto'>
                See how Synapse helps organizations address their most pressing compliance needs.
              </p>
            </div>

            <div className='max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {[
                {
                  title: 'Regulatory Change Management',
                  description:
                    'Stay ahead of evolving regulations with automated alerts and impact analysis.',
                  link: '#'
                },
                {
                  title: 'Third-Party Risk Management',
                  description:
                    'Assess, monitor, and manage compliance risks in your vendor ecosystem.',
                  link: '#'
                },
                {
                  title: 'Policy Management',
                  description:
                    'Create, distribute, and track acknowledgment of policies and procedures.',
                  link: '#'
                },
                {
                  title: 'Compliance Training',
                  description:
                    'Deliver and track role-based compliance training across your organization.',
                  link: '#'
                },
                {
                  title: 'Audit Management',
                  description:
                    'Streamline internal and external audit processes with centralized evidence collection.',
                  link: '#'
                },
                {
                  title: 'Incident Management',
                  description: 'Report, investigate, and resolve compliance incidents efficiently.',
                  link: '#'
                }
              ].map((useCase, index) => (
                <Card key={index} className='hover-lift'>
                  <CardHeader className='pb-2'>
                    <CardTitle>{useCase.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className='text-base mb-4'>
                      {useCase.description}
                    </CardDescription>
                    <a
                      href={useCase.link}
                      className='text-synapse-primary font-medium inline-flex items-center hover:underline'
                    >
                      View Case Study <ArrowRight size={16} className='ml-1' />
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className='bg-white py-16 border-t border-gray-100'>
          <div className='container mx-auto px-4'>
            <div className='max-w-4xl mx-auto text-center'>
              <Badge className='mb-4'>Get Started</Badge>
              <h2 className='text-3xl font-bold mb-4'>Find the Right Solution for Your Industry</h2>
              <p className='text-lg text-gray-600 mb-8 max-w-2xl mx-auto'>
                Our team of compliance experts will help you identify the specific features and
                configurations that best address your regulatory challenges.
              </p>
              <div className='flex flex-col sm:flex-row justify-center gap-4'>
                <Button size='lg'>Schedule a Consultation</Button>
                <Button size='lg' variant='outline'>
                  Download Solutions Guide
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

export default Solutions;

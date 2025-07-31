// import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Users, Briefcase } from 'lucide-react';

const Careers = () => {
  const openPositions = [
    {
      title: 'Senior GRC Analyst',
      department: 'Product',
      location: 'Remote',
      type: 'Full-time',
      description:
        'Lead the development of our AI-powered GRC solutions and work directly with compliance professionals.',
      skills: ['GRC', 'Risk Management', 'Compliance', 'AI/ML']
    },
    {
      title: 'Frontend Developer',
      department: 'Engineering',
      location: 'London, UK',
      type: 'Full-time',
      description:
        'Build beautiful and functional user interfaces for our GRC intelligence platform.',
      skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js']
    },
    {
      title: 'AI/ML Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'Develop and optimize AI agents for regulatory compliance and risk assessment.',
      skills: ['Python', 'TensorFlow', 'NLP', 'Machine Learning']
    }
  ];

  return (
    <div className='min-h-screen bg-white'>
      <Navbar />

      <main className='pt-24 pb-16'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
          {/* Header */}
          <div className='text-center mb-12'>
            <h1 className='text-4xl font-bold text-gray-900 mb-4'>Join Our Mission</h1>
            <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
              Help us build the future of GRC intelligence. We're looking for passionate individuals
              who want to revolutionize compliance and risk management.
            </p>
          </div>

          {/* Company Values */}
          <div className='mb-12'>
            <h2 className='text-2xl font-bold text-gray-900 mb-6'>Why Work With Us</h2>
            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
              <div className='text-center'>
                <div className='bg-[#7A73FF] rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4'>
                  <Users className='h-6 w-6 text-white' />
                </div>
                <h3 className='font-semibold mb-2'>Collaborative Culture</h3>
                <p className='text-gray-600 text-sm'>
                  Work with experts across GRC, AI, and technology in a supportive environment.
                </p>
              </div>
              <div className='text-center'>
                <div className='bg-[#7A73FF] rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4'>
                  <Briefcase className='h-6 w-6 text-white' />
                </div>
                <h3 className='font-semibold mb-2'>Meaningful Impact</h3>
                <p className='text-gray-600 text-sm'>
                  Build solutions that help professionals navigate complex regulatory landscapes.
                </p>
              </div>
              <div className='text-center'>
                <div className='bg-[#7A73FF] rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4'>
                  <MapPin className='h-6 w-6 text-white' />
                </div>
                <h3 className='font-semibold mb-2'>Remote-First</h3>
                <p className='text-gray-600 text-sm'>
                  Flexible work arrangements with a global team of talented individuals.
                </p>
              </div>
            </div>
          </div>

          {/* Open Positions */}
          <div className='mb-12'>
            <h2 className='text-2xl font-bold text-gray-900 mb-6'>Open Positions</h2>
            <div className='space-y-6'>
              {openPositions.map((position, index) => (
                <Card
                  key={index}
                  className='border border-gray-200 hover:border-[#7A73FF] transition-colors'
                >
                  <CardHeader>
                    <div className='flex justify-between items-start'>
                      <div>
                        <CardTitle className='text-xl'>{position.title}</CardTitle>
                        <CardDescription className='mt-1'>{position.department}</CardDescription>
                      </div>
                      <Button className='bg-[#7A73FF] hover:bg-[#6366F1]'>Apply Now</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className='text-gray-600 mb-4'>{position.description}</p>

                    <div className='flex items-center gap-4 mb-4 text-sm text-gray-500'>
                      <div className='flex items-center gap-1'>
                        <MapPin className='h-4 w-4' />
                        {position.location}
                      </div>
                      <div className='flex items-center gap-1'>
                        <Clock className='h-4 w-4' />
                        {position.type}
                      </div>
                    </div>

                    <div className='flex flex-wrap gap-2'>
                      {position.skills.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant='secondary'>
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className='text-center bg-gray-50 rounded-lg p-8'>
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>Don't See Your Role?</h2>
            <p className='text-gray-600 mb-6'>
              We're always looking for talented individuals. Send us your resume and tell us how
              you'd like to contribute.
            </p>
            <Button size='lg' className='bg-[#7A73FF] hover:bg-[#6366F1]'>
              Get In Touch
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Careers;

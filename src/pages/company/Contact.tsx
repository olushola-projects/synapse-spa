import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import {
  MessageSquare,
  Mail,
  MapPin,
  Phone,
  Users,
  BookOpen,
  HelpCircle,
  Briefcase
} from 'lucide-react';

const Contact = () => {
  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <div className='flex-grow bg-gray-50'>
        <div className='container mx-auto px-4 py-12'>
          <div className='text-center mb-16'>
            <h1 className='text-4xl font-bold mb-4'>Contact Us</h1>
            <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
              Have questions about Synapse? Our team is here to help you.
            </p>
          </div>

          <div className='max-w-6xl mx-auto grid md:grid-cols-3 gap-8'>
            {/* Contact Form */}
            <div className='md:col-span-2'>
              <Card className='p-8 shadow-sm'>
                <h2 className='text-2xl font-semibold mb-6'>Send a Message</h2>
                <form className='space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                      <label
                        htmlFor='name'
                        className='block text-sm font-medium text-gray-700 mb-1'
                      >
                        Name
                      </label>
                      <Input id='name' placeholder='Your name' className='w-full' />
                    </div>
                    <div>
                      <label
                        htmlFor='email'
                        className='block text-sm font-medium text-gray-700 mb-1'
                      >
                        Email
                      </label>
                      <Input
                        id='email'
                        type='email'
                        placeholder='your.email@example.com'
                        className='w-full'
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor='company'
                      className='block text-sm font-medium text-gray-700 mb-1'
                    >
                      Company
                    </label>
                    <Input id='company' placeholder='Your company name' className='w-full' />
                  </div>

                  <div>
                    <label
                      htmlFor='subject'
                      className='block text-sm font-medium text-gray-700 mb-1'
                    >
                      Subject
                    </label>
                    <select
                      id='subject'
                      className='w-full h-10 px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-synapse-primary'
                    >
                      <option value=''>Select a topic</option>
                      <option value='General Inquiry'>General Inquiry</option>
                      <option value='Platform Demo'>Platform Demo</option>
                      <option value='Partnership Opportunity'>Partnership Opportunity</option>
                      <option value='Technical Support'>Technical Support</option>
                      <option value='Pricing & Plans'>Pricing & Plans</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor='message'
                      className='block text-sm font-medium text-gray-700 mb-1'
                    >
                      Message
                    </label>
                    <Textarea
                      id='message'
                      placeholder='How can we help you?'
                      rows={6}
                      className='w-full'
                    />
                  </div>

                  <div>
                    <Button type='submit' size='lg' className='w-full md:w-auto'>
                      Send Message
                    </Button>
                  </div>
                </form>
              </Card>
            </div>

            {/* Contact Info */}
            <div>
              <Card className='p-6 mb-6 shadow-sm'>
                <h3 className='text-lg font-semibold mb-4'>Contact Information</h3>
                <div className='space-y-4'>
                  <div className='flex items-start'>
                    <Mail className='h-5 w-5 text-synapse-primary mt-1 mr-3' />
                    <div>
                      <p className='font-medium'>Email</p>
                      <a
                        href='mailto:contact@synapse-platform.com'
                        className='text-sm text-gray-600 hover:text-synapse-primary'
                      >
                        contact@synapse-platform.com
                      </a>
                    </div>
                  </div>

                  <div className='flex items-start'>
                    <Phone className='h-5 w-5 text-synapse-primary mt-1 mr-3' />
                    <div>
                      <p className='font-medium'>Phone</p>
                      <a
                        href='tel:+18005551234'
                        className='text-sm text-gray-600 hover:text-synapse-primary'
                      >
                        +1 (800) 555-1234
                      </a>
                    </div>
                  </div>

                  <div className='flex items-start'>
                    <MapPin className='h-5 w-5 text-synapse-primary mt-1 mr-3' />
                    <div>
                      <p className='font-medium'>Location</p>
                      <p className='text-sm text-gray-600'>
                        123 Compliance Way
                        <br />
                        Regulatory District, RC 12345
                        <br />
                        United States
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className='p-6 shadow-sm'>
                <h3 className='text-lg font-semibold mb-4'>Connect with the right team</h3>
                <div className='space-y-4'>
                  <div className='flex items-start'>
                    <Users className='h-5 w-5 text-synapse-primary mt-1 mr-3' />
                    <div>
                      <p className='font-medium'>Sales</p>
                      <a
                        href='mailto:sales@synapse-platform.com'
                        className='text-sm text-gray-600 hover:text-synapse-primary'
                      >
                        sales@synapse-platform.com
                      </a>
                    </div>
                  </div>

                  <div className='flex items-start'>
                    <HelpCircle className='h-5 w-5 text-synapse-primary mt-1 mr-3' />
                    <div>
                      <p className='font-medium'>Support</p>
                      <a
                        href='mailto:support@synapse-platform.com'
                        className='text-sm text-gray-600 hover:text-synapse-primary'
                      >
                        support@synapse-platform.com
                      </a>
                    </div>
                  </div>

                  <div className='flex items-start'>
                    <Briefcase className='h-5 w-5 text-synapse-primary mt-1 mr-3' />
                    <div>
                      <p className='font-medium'>Partnerships</p>
                      <a
                        href='mailto:partners@synapse-platform.com'
                        className='text-sm text-gray-600 hover:text-synapse-primary'
                      >
                        partners@synapse-platform.com
                      </a>
                    </div>
                  </div>

                  <div className='flex items-start'>
                    <BookOpen className='h-5 w-5 text-synapse-primary mt-1 mr-3' />
                    <div>
                      <p className='font-medium'>Press</p>
                      <a
                        href='mailto:press@synapse-platform.com'
                        className='text-sm text-gray-600 hover:text-synapse-primary'
                      >
                        press@synapse-platform.com
                      </a>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <div className='max-w-3xl mx-auto mt-20'>
            <h2 className='text-2xl font-bold text-center mb-8'>Frequently Asked Questions</h2>
            <div className='space-y-4'>
              {[
                {
                  question: 'How can I request a demo of Synapse?',
                  answer:
                    'You can request a personalized demo by filling out the contact form above or emailing sales@synapse-platform.com directly. One of our account executives will get in touch to schedule a time that works for you.'
                },
                {
                  question: 'Is Synapse available internationally?',
                  answer:
                    'Yes, Synapse is available to customers worldwide. Our platform supports multiple languages and regulatory frameworks across different jurisdictions.'
                },
                {
                  question: 'How do I get technical support?',
                  answer:
                    "If you're a current customer, you can access support through your account dashboard or by emailing support@synapse-platform.com. For urgent issues, we also offer phone support during business hours."
                }
              ].map((faq, index) => (
                <div
                  key={index}
                  className='bg-white rounded-lg shadow-sm p-6 border border-gray-100'
                >
                  <h3 className='font-semibold mb-2'>{faq.question}</h3>
                  <p className='text-gray-600'>{faq.answer}</p>
                </div>
              ))}
            </div>
            <div className='text-center mt-8'>
              <Button variant='outline'>View All FAQs</Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;

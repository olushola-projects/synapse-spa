
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { partnerCategories } from '../data/partnersData';
import PartnerCategoryCard from '../components/partners/PartnerCategoryCard';
import { Button } from '@/components/ui/button';
import { MailIcon } from 'lucide-react';

const Partners = () => {
  return (
    <div className='min-h-screen'>
      <Navbar />

      {/* Hero Section */}
      <section className='bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24 pb-16'>
        <div className='container mx-auto px-6'>
          <div className='max-w-3xl mx-auto text-center'>
            <motion.h1
              className='text-4xl md:text-5xl font-bold mb-4 text-gray-900'
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Partner with <span className='text-blue-700'>Synapse</span>
            </motion.h1>
            <motion.p
              className='text-lg text-gray-600 mb-8'
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Join our ecosystem of regulatory and compliance professionals and organizations to
              drive innovation, share knowledge, and create better GRC outcomes together.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button size='lg' className='bg-blue-700 hover:bg-blue-800'>
                Become a Partner
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partner Categories */}
      <section className='py-16 bg-white'>
        <div className='container mx-auto px-6'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold mb-4'>Who Can Partner with Us?</h2>
            <p className='text-gray-600 max-w-2xl mx-auto'>
              We're building a comprehensive ecosystem to connect all stakeholders in the regulatory
              and compliance space. Discover how you can get involved.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {partnerCategories.map((category, index) => (
              <PartnerCategoryCard key={category.id} category={category} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Process */}
      <section className='py-16 bg-gray-50'>
        <div className='container mx-auto px-6'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold mb-4'>Partnership Process</h2>
            <p className='text-gray-600 max-w-2xl mx-auto'>
              Joining our partner network is simple. Follow these steps to get started.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto'>
            {[
              {
                step: '1',
                title: 'Initial Consultation',
                description:
                  'Schedule a call with our partnership team to discuss opportunities and alignment.'
              },
              {
                step: '2',
                title: 'Customize Partnership',
                description:
                  'Work together to define the scope and terms of the partnership that works for both parties.'
              },
              {
                step: '3',
                title: 'Launch & Grow',
                description:
                  'Implement the partnership and collaborate to achieve mutual business objectives.'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className='bg-white p-8 rounded-lg shadow-sm text-center border-t-4 border-blue-500'
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className='w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 font-bold'>
                  {item.step}
                </div>
                <h3 className='text-xl font-bold mb-3'>{item.title}</h3>
                <p className='text-gray-600'>{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className='py-16 bg-blue-700 text-white'>
        <div className='container mx-auto px-6'>
          <div className='max-w-4xl mx-auto text-center'>
            <h2 className='text-3xl font-bold mb-4'>Ready to Join Our Partner Network?</h2>
            <p className='mb-8 text-blue-100'>
              Contact our partnership team today to discuss how we can collaborate to meet your
              business objectives.
            </p>
            <Button size='lg' variant='outline' className='bg-white text-blue-700 hover:bg-blue-50'>
              <MailIcon className='mr-2 h-4 w-4' /> Contact the Partnership Team
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Partners;

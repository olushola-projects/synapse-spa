// import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const TermsOfService = () => {
  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <div className='flex-grow'>
        <div className='container mx-auto px-4 py-12 max-w-4xl'>
          <h1 className='text-3xl font-bold mb-8'>Terms of Service</h1>

          <div className='prose prose-lg max-w-none'>
            <p className='text-gray-600 mb-6'>Last Updated: April 14, 2025</p>

            <h2 className='text-2xl font-semibold mt-8 mb-4'>1. Agreement to Terms</h2>
            <p>
              By accessing or using the Synapse platform, you agree to be bound by these Terms of
              Service and all applicable laws and regulations. If you do not agree with any of these
              terms, you are prohibited from using or accessing this platform.
            </p>

            <h2 className='text-2xl font-semibold mt-8 mb-4'>2. Use License</h2>
            <p>
              Permission is granted to temporarily access the materials on Synapse's platform for
              personal, non-commercial transitory viewing only. This is the grant of a license, not
              a transfer of title, and under this license you may not:
            </p>
            <ul className='list-disc pl-6 my-4 space-y-2'>
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>
                Attempt to decompile or reverse engineer any software contained on Synapse's
                platform
              </li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>
                Transfer the materials to another person or "mirror" the materials on any other
                server
              </li>
            </ul>

            <h2 className='text-2xl font-semibold mt-8 mb-4'>3. Disclaimer</h2>
            <p>
              The materials on Synapse's platform are provided on an 'as is' basis. Synapse makes no
              warranties, expressed or implied, and hereby disclaims and negates all other
              warranties including, without limitation, implied warranties or conditions of
              merchantability, fitness for a particular purpose, or non-infringement of intellectual
              property or other violation of rights.
            </p>

            <h2 className='text-2xl font-semibold mt-8 mb-4'>4. Limitations</h2>
            <p>
              In no event shall Synapse or its suppliers be liable for any damages (including,
              without limitation, damages for loss of data or profit, or due to business
              interruption) arising out of the use or inability to use the materials on Synapse's
              platform, even if Synapse or a Synapse authorized representative has been notified
              orally or in writing of the possibility of such damage.
            </p>

            <h2 className='text-2xl font-semibold mt-8 mb-4'>5. Compliance Status</h2>
            <div className='bg-blue-50 border-l-4 border-blue-500 p-4 mb-6'>
              <p className='font-medium'>Current compliance framework status: In Progress</p>
              <p className='text-sm mt-2'>
                We are actively developing our legal framework to ensure compliance with relevant
                regulations and best practices in the industry.
              </p>
            </div>

            <h2 className='text-2xl font-semibold mt-8 mb-4'>6. User Conduct</h2>
            <p>As a user of the platform, you agree not to:</p>
            <ul className='list-disc pl-6 my-4 space-y-2'>
              <li>
                Use the platform in any way that violates any applicable local, state, national, or
                international law or regulation
              </li>
              <li>
                Engage in any conduct that restricts or inhibits anyone's use or enjoyment of the
                platform
              </li>
              <li>Use the platform to advertise or offer to sell goods and services</li>
              <li>Engage in unauthorized framing or linking to the platform</li>
              <li>Upload or transmit viruses, malware, or other types of malicious software</li>
            </ul>

            <h2 className='text-2xl font-semibold mt-8 mb-4'>7. Modifications and Interruptions</h2>
            <p>
              We reserve the right to change, modify, or remove the contents of the platform at any
              time or for any reason at our sole discretion without notice. We have no obligation to
              update any information on our platform. We also reserve the right to modify or
              discontinue all or part of the platform without notice at any time.
            </p>

            <h2 className='text-2xl font-semibold mt-8 mb-4'>8. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at:</p>
            <p className='mt-2'>Email: legal@synapse-platform.com</p>
            <p className='mt-1'>Address: 123 Compliance Way, Regulatory District, RC 12345</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsOfService;

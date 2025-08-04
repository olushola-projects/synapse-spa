// import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <div className='flex-grow'>
        <div className='container mx-auto px-4 py-12 max-w-4xl'>
          <h1 className='text-3xl font-bold mb-8'>Privacy Policy</h1>

          <div className='prose prose-lg max-w-none'>
            <p className='text-gray-600 mb-6'>Last Updated: April 14, 2025</p>

            <h2 className='text-2xl font-semibold mt-8 mb-4'>1. Introduction</h2>
            <p>
              At Synapse, we take your privacy seriously. This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you use our platform.
              Please read this privacy policy carefully. If you do not agree with the terms of this
              privacy policy, please do not access the platform.
            </p>

            <h2 className='text-2xl font-semibold mt-8 mb-4'>2. Information We Collect</h2>
            <h3 className='text-xl font-medium mt-6 mb-3'>2.1 Personal Data</h3>
            <p>We may collect personal identification information, including but not limited to:</p>
            <ul className='list-disc pl-6 my-4 space-y-2'>
              <li>Name and contact details</li>
              <li>Email address</li>
              <li>Company name and job title</li>
              <li>Professional qualifications and certifications</li>
              <li>Payment information (when applicable)</li>
            </ul>

            <h3 className='text-xl font-medium mt-6 mb-3'>2.2 Usage Data</h3>
            <p>We may also collect information on how you use our platform, including:</p>
            <ul className='list-disc pl-6 my-4 space-y-2'>
              <li>Log and usage data</li>
              <li>Device and connection information</li>
              <li>Browser and device characteristics</li>
              <li>Operating system</li>
              <li>Language preferences</li>
              <li>Referring URLs</li>
            </ul>

            <h2 className='text-2xl font-semibold mt-8 mb-4'>3. How We Use Your Information</h2>
            <p>We may use the information we collect for various purposes, including to:</p>
            <ul className='list-disc pl-6 my-4 space-y-2'>
              <li>Provide, operate, and maintain our platform</li>
              <li>Improve, personalize, and expand our platform</li>
              <li>Understand and analyze how you use our platform</li>
              <li>Develop new products, services, features, and functionality</li>
              <li>Communicate with you about updates, security alerts, and support</li>
              <li>Send you marketing and promotional communications (with your consent)</li>
              <li>Find and prevent fraud</li>
            </ul>

            <h2 className='text-2xl font-semibold mt-8 mb-4'>4. Compliance Status</h2>
            <div className='bg-blue-50 border-l-4 border-blue-500 p-4 mb-6'>
              <p className='font-medium'>Current compliance framework status: In Progress</p>
              <p className='text-sm mt-2'>
                We are actively working to ensure compliance with global privacy regulations
                including GDPR, CCPA, and other relevant frameworks.
              </p>
            </div>

            <h2 className='text-2xl font-semibold mt-8 mb-4'>5. Data Security</h2>
            <p>
              We have implemented appropriate technical and organizational security measures
              designed to protect the security of any personal information we process. However,
              despite our safeguards and efforts to secure your information, no electronic
              transmission over the Internet or information storage technology can be guaranteed to
              be 100% secure.
            </p>

            <h2 className='text-2xl font-semibold mt-8 mb-4'>6. Third-Party Disclosure</h2>
            <p>
              We may share your information with third parties in certain situations, including:
            </p>
            <ul className='list-disc pl-6 my-4 space-y-2'>
              <li>Business partners and service providers who support our business</li>
              <li>In response to a legal request if we believe disclosure is required by law</li>
              <li>To protect and defend our rights and property</li>
              <li>With your consent or at your direction</li>
            </ul>

            <h2 className='text-2xl font-semibold mt-8 mb-4'>7. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
            <p className='mt-2'>Email: privacy@synapse-platform.com</p>
            <p className='mt-1'>Address: 123 Compliance Way, Regulatory District, RC 12345</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;

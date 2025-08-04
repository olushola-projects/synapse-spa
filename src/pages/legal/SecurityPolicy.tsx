// import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ShieldCheck, LockKeyhole, Server, Database } from 'lucide-react';

const SecurityPolicy = () => {
  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <div className='flex-grow'>
        <div className='container mx-auto px-4 py-12 max-w-4xl'>
          <h1 className='text-3xl font-bold mb-8'>Security Policy</h1>

          <div className='prose prose-lg max-w-none'>
            <p className='text-gray-600 mb-6'>Last Updated: April 14, 2025</p>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-10'>
              <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
                <div className='flex items-center mb-4'>
                  <ShieldCheck className='h-6 w-6 text-synapse-primary mr-2' />
                  <h3 className='font-medium text-lg'>Data Protection</h3>
                </div>
                <p className='text-gray-600'>
                  Your data is encrypted both in transit and at rest using industry-standard
                  protocols and algorithms.
                </p>
              </div>

              <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
                <div className='flex items-center mb-4'>
                  <LockKeyhole className='h-6 w-6 text-synapse-primary mr-2' />
                  <h3 className='font-medium text-lg'>Access Control</h3>
                </div>
                <p className='text-gray-600'>
                  We implement strict role-based access controls with multi-factor authentication
                  for all internal systems.
                </p>
              </div>

              <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
                <div className='flex items-center mb-4'>
                  <Server className='h-6 w-6 text-synapse-primary mr-2' />
                  <h3 className='font-medium text-lg'>Infrastructure Security</h3>
                </div>
                <p className='text-gray-600'>
                  Our infrastructure is monitored 24/7 with automated threat detection and response
                  capabilities.
                </p>
              </div>

              <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
                <div className='flex items-center mb-4'>
                  <Database className='h-6 w-6 text-synapse-primary mr-2' />
                  <h3 className='font-medium text-lg'>Backups & Recovery</h3>
                </div>
                <p className='text-gray-600'>
                  We perform regular backups with tested recovery procedures to ensure business
                  continuity.
                </p>
              </div>
            </div>

            <h2 className='text-2xl font-semibold mt-8 mb-4'>1. Security Overview</h2>
            <p>
              At Synapse, security is our top priority. We implement comprehensive security measures
              to protect your data and ensure the integrity of our platform. Our security program is
              designed with multiple layers of protection and follows industry best practices.
            </p>

            <h2 className='text-2xl font-semibold mt-8 mb-4'>2. Data Security</h2>
            <p>We protect your data through:</p>
            <ul className='list-disc pl-6 my-4 space-y-2'>
              <li>Encryption of data in transit using TLS 1.3</li>
              <li>Encryption of data at rest using AES-256</li>
              <li>Regular security assessments and penetration testing</li>
              <li>Secure coding practices and regular code reviews</li>
              <li>Comprehensive logging and monitoring</li>
            </ul>

            <h2 className='text-2xl font-semibold mt-8 mb-4'>3. Physical Security</h2>
            <p>Our infrastructure is hosted in SOC 2 compliant data centers with:</p>
            <ul className='list-disc pl-6 my-4 space-y-2'>
              <li>24/7 physical security</li>
              <li>Biometric access controls</li>
              <li>Video surveillance</li>
              <li>Environmental controls</li>
              <li>Redundant power and network connections</li>
            </ul>

            <h2 className='text-2xl font-semibold mt-8 mb-4'>4. Compliance Status</h2>
            <div className='bg-blue-50 border-l-4 border-blue-500 p-4 mb-6'>
              <p className='font-medium'>Current security framework status: In Progress</p>
              <p className='text-sm mt-2'>
                We are actively working towards compliance with ISO 27001, SOC 2 Type II, and
                relevant industry standards.
              </p>
            </div>

            <h2 className='text-2xl font-semibold mt-8 mb-4'>5. Security Incident Response</h2>
            <p>We have a formal incident response process to address:</p>
            <ul className='list-disc pl-6 my-4 space-y-2'>
              <li>Identification and classification of security incidents</li>
              <li>Containment and eradication procedures</li>
              <li>Recovery and post-incident analysis</li>
              <li>Customer notification when applicable</li>
            </ul>

            <h2 className='text-2xl font-semibold mt-8 mb-4'>6. Employee Security</h2>
            <p>Our security practices for employees include:</p>
            <ul className='list-disc pl-6 my-4 space-y-2'>
              <li>Background checks for all employees</li>
              <li>Regular security awareness training</li>
              <li>Principle of least privilege access</li>
              <li>Multi-factor authentication</li>
            </ul>

            <h2 className='text-2xl font-semibold mt-8 mb-4'>7. Contact Us</h2>
            <p>
              To report security concerns or for more information about our security practices,
              please contact us at:
            </p>
            <p className='mt-2'>Email: security@synapse-platform.com</p>
            <p className='mt-1'>For urgent security issues: +1-800-555-0123</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SecurityPolicy;

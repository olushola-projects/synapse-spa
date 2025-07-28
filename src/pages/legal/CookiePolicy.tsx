import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const CookiePolicy = () => {
  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <div className='flex-grow'>
        <div className='container mx-auto px-4 py-12 max-w-4xl'>
          <h1 className='text-3xl font-bold mb-8'>Cookie Policy</h1>

          <div className='prose prose-lg max-w-none'>
            <p className='text-gray-600 mb-6'>Last Updated: April 14, 2025</p>

            <h2 className='text-2xl font-semibold mt-8 mb-4'>1. What are Cookies?</h2>
            <p>
              Cookies are small text files that are placed on your computer or mobile device when
              you visit a website. They are widely used to make websites work more efficiently and
              provide information to the website owners. Cookies help enhance your experience by
              remembering your preferences and enabling certain functionality.
            </p>

            <h2 className='text-2xl font-semibold mt-8 mb-4'>2. How We Use Cookies</h2>
            <p>We use cookies for the following purposes:</p>
            <ul className='list-disc pl-6 my-4 space-y-2'>
              <li>
                <strong>Essential Cookies:</strong> These cookies are necessary for the website to
                function properly and cannot be switched off in our systems.
              </li>
              <li>
                <strong>Performance Cookies:</strong> These cookies allow us to count visits and
                traffic sources so we can measure and improve the performance of our site.
              </li>
              <li>
                <strong>Functional Cookies:</strong> These cookies enable the website to provide
                enhanced functionality and personalization.
              </li>
              <li>
                <strong>Targeting Cookies:</strong> These cookies may be set through our site by our
                advertising partners to build a profile of your interests.
              </li>
            </ul>

            <h2 className='text-2xl font-semibold mt-8 mb-4'>3. Types of Cookies We Use</h2>
            <table className='min-w-full border border-gray-200 my-6'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='border border-gray-200 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Cookie Type
                  </th>
                  <th className='border border-gray-200 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Purpose
                  </th>
                  <th className='border border-gray-200 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Duration
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                <tr>
                  <td className='border border-gray-200 px-6 py-4 whitespace-nowrap'>
                    Session Cookies
                  </td>
                  <td className='border border-gray-200 px-6 py-4'>
                    Temporary cookies that expire when you close your browser
                  </td>
                  <td className='border border-gray-200 px-6 py-4'>Session</td>
                </tr>
                <tr>
                  <td className='border border-gray-200 px-6 py-4 whitespace-nowrap'>
                    Persistent Cookies
                  </td>
                  <td className='border border-gray-200 px-6 py-4'>
                    Cookies that remain on your device for a defined period
                  </td>
                  <td className='border border-gray-200 px-6 py-4'>Varies</td>
                </tr>
                <tr>
                  <td className='border border-gray-200 px-6 py-4 whitespace-nowrap'>
                    Authentication Cookies
                  </td>
                  <td className='border border-gray-200 px-6 py-4'>
                    Used to identify logged-in users
                  </td>
                  <td className='border border-gray-200 px-6 py-4'>Session</td>
                </tr>
                <tr>
                  <td className='border border-gray-200 px-6 py-4 whitespace-nowrap'>
                    Analytics Cookies
                  </td>
                  <td className='border border-gray-200 px-6 py-4'>
                    Used to track user behavior on the website
                  </td>
                  <td className='border border-gray-200 px-6 py-4'>Up to 2 years</td>
                </tr>
              </tbody>
            </table>

            <h2 className='text-2xl font-semibold mt-8 mb-4'>4. Cookie Consent</h2>
            <p>
              When you first visit our site, we will display a cookie banner allowing you to accept
              or decline non-essential cookies. You can change your cookie preferences at any time
              by clicking on the Cookie Settings link in the footer of our website.
            </p>

            <h2 className='text-2xl font-semibold mt-8 mb-4'>5. Managing Cookies</h2>
            <p>
              Most web browsers allow you to control cookies through their settings. You can usually
              find these settings in the "options" or "preferences" menu of your browser. You can
              delete all cookies that are already on your computer and you can set most browsers to
              prevent them from being placed.
            </p>

            <h2 className='text-2xl font-semibold mt-8 mb-4'>6. Compliance Status</h2>
            <div className='bg-blue-50 border-l-4 border-blue-500 p-4 mb-6'>
              <p className='font-medium'>Current compliance framework status: In Progress</p>
              <p className='text-sm mt-2'>
                We are actively working to ensure our cookie practices comply with global
                regulations including GDPR and ePrivacy Directive.
              </p>
            </div>

            <h2 className='text-2xl font-semibold mt-8 mb-4'>7. Changes to This Cookie Policy</h2>
            <p>
              We may update our Cookie Policy from time to time. We will notify you of any changes
              by posting the new Cookie Policy on this page and updating the "Last Updated" date at
              the top of this page.
            </p>

            <h2 className='text-2xl font-semibold mt-8 mb-4'>8. Contact Us</h2>
            <p>If you have any questions about our Cookie Policy, please contact us at:</p>
            <p className='mt-2'>Email: privacy@synapse-platform.com</p>
            <p className='mt-1'>Address: 123 Compliance Way, Regulatory District, RC 12345</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CookiePolicy;

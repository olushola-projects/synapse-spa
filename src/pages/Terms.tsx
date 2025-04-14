
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-white py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
            <p className="text-gray-500 mb-8">Last updated: April 14, 2025</p>

            <div className="prose max-w-none">
              <p>
                These Terms of Service ("Terms") govern your access to and use of Synapse, including our website, 
                platform, and services (collectively, the "Services"). Please read these Terms carefully before using 
                our Services.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing or using our Services, you agree to be bound by these Terms. If you do not agree 
                to these Terms, you may not access or use the Services.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4">2. Changes to Terms</h2>
              <p>
                We may modify these Terms at any time. If we make material changes to these Terms, we will notify 
                you by email or through the Services. Your continued use of the Services after such notification 
                constitutes your acceptance of the modified Terms.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4">3. Account Registration</h2>
              <p>
                To use certain features of the Services, you may need to register for an account. When you register, 
                you agree to provide accurate, current, and complete information and to keep this information updated.
              </p>
              <p>
                You are responsible for safeguarding your account credentials and for all activities that occur under 
                your account. You agree to notify us immediately of any unauthorized use of your account.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4">4. User Responsibilities</h2>
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on the rights of others</li>
                <li>Use the Services for any illegal or unauthorized purpose</li>
                <li>Interfere with or disrupt the Services or servers</li>
                <li>Attempt to gain unauthorized access to the Services</li>
                <li>Transmit viruses, malware, or other harmful code</li>
                <li>Collect or harvest user information without consent</li>
              </ul>

              <h2 className="text-xl font-bold mt-8 mb-4">5. Intellectual Property Rights</h2>
              <p>
                The Services and all content, features, and functionality are owned by Synapse or its licensors 
                and are protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p>
                You may not copy, modify, distribute, sell, or lease any part of the Services without our express 
                written consent.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4">6. User Content</h2>
              <p>
                You retain all rights to any content you submit, post, or display through the Services ("User Content"). 
                By submitting User Content, you grant us a worldwide, non-exclusive, royalty-free license to use, 
                reproduce, modify, adapt, publish, and display such User Content for the purpose of providing the Services.
              </p>
              <p>
                You are solely responsible for your User Content and the consequences of sharing it. We reserve the 
                right to remove any User Content that violates these Terms or that we find objectionable.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4">7. Limitation of Liability</h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, SYNAPSE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, 
                SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED 
                DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICES</li>
                <li>ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICES</li>
                <li>ANY CONTENT OBTAINED FROM THE SERVICES</li>
                <li>UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT</li>
              </ul>

              <h2 className="text-xl font-bold mt-8 mb-4">8. Disclaimer of Warranties</h2>
              <p>
                THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS 
                OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
                PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4">9. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the State of California, 
                without regard to its conflict of law provisions.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4">10. Dispute Resolution</h2>
              <p>
                Any dispute arising from these Terms shall be resolved through binding arbitration in San Francisco, 
                California, in accordance with the rules of the American Arbitration Association.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4">11. Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <p className="mb-8">
                Email: legal@synapse-platform.com<br />
                Address: 123 Compliance Way, Suite 500<br />
                San Francisco, CA 94105
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Terms;

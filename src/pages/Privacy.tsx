
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Separator } from "@/components/ui/separator";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-white py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-gray-500 mb-8">Last updated: April 14, 2025</p>

            <div className="prose max-w-none">
              <p>
                At Synapse, we take your privacy seriously. This Privacy Policy explains how we collect, use, 
                disclose, and safeguard your information when you use our platform.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4">1. Information We Collect</h2>
              
              <h3 className="text-lg font-semibold mt-6 mb-2">1.1 Personal Information</h3>
              <p>
                We collect personal information that you voluntarily provide to us when you register on the platform, 
                express interest in obtaining information about us or our products and services, or otherwise contact us.
                This may include:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Name</li>
                <li>Email address</li>
                <li>Company name</li>
                <li>Job title</li>
                <li>Phone number</li>
                <li>Professional credentials</li>
              </ul>

              <h3 className="text-lg font-semibold mt-6 mb-2">1.2 Usage Data</h3>
              <p>
                We automatically collect certain information when you visit, use, or navigate the platform. 
                This information does not reveal your specific identity but may include:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Device and browser information</li>
                <li>IP address</li>
                <li>Usage patterns and preferences</li>
                <li>Interactions with features and content</li>
              </ul>

              <h2 className="text-xl font-bold mt-8 mb-4">2. How We Use Your Information</h2>
              <p>We use the information we collect for various purposes, including to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Provide, operate, and maintain our platform</li>
                <li>Improve, personalize, and expand our platform</li>
                <li>Understand how you use our platform</li>
                <li>Develop new products, features, and services</li>
                <li>Communicate with you about updates, security alerts, and support</li>
                <li>Prevent fraudulent activities and security risks</li>
              </ul>

              <h2 className="text-xl font-bold mt-8 mb-4">3. How We Share Your Information</h2>
              <p>We may share your information with third parties in the following situations:</p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Service Providers:</strong> We may share your information with third-party vendors, consultants, and other service providers who perform services on our behalf.</li>
                <li><strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.</li>
                <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities.</li>
              </ul>

              <h2 className="text-xl font-bold mt-8 mb-4">4. Data Security</h2>
              <p>
                We implement appropriate technical and organizational security measures designed to protect your information. 
                However, no security system is impenetrable, and we cannot guarantee the absolute security of your information.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4">5. Data Retention</h2>
              <p>
                We will only keep your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, 
                unless a longer retention period is required or permitted by law.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4">6. Your Privacy Rights</h2>
              <p>
                Depending on your location, you may have certain rights regarding your personal information, including:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>The right to access your personal information</li>
                <li>The right to rectify inaccurate personal information</li>
                <li>The right to request deletion of your personal information</li>
                <li>The right to restrict processing of your personal information</li>
                <li>The right to data portability</li>
                <li>The right to object to processing of your personal information</li>
              </ul>

              <h2 className="text-xl font-bold mt-8 mb-4">7. Children's Privacy</h2>
              <p>
                Our platform is not intended for children under the age of 18. We do not knowingly collect personal 
                information from children under 18 years of age.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4">8. Updates to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. The updated version will be indicated by an updated 
                "Last updated" date at the top of this document. We encourage you to review this Privacy Policy frequently.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4">9. Contact Us</h2>
              <p>
                If you have questions or comments about this Privacy Policy, please contact us at:
              </p>
              <p className="mb-8">
                Email: privacy@synapse-platform.com<br />
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

export default Privacy;


import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Shield, Lock, CheckCircle2, Server, AlertCircle } from "lucide-react";

const Security = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-white py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Security & Compliance</h1>
            <p className="text-lg text-gray-600 mb-8">
              At Synapse, security is at the core of everything we do. We are committed to protecting your data 
              with industry-leading security practices and compliance standards.
            </p>

            {/* Security Overview */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="h-8 w-8 text-blue-700" />
                <h2 className="text-2xl font-bold">Our Security Approach</h2>
              </div>
              
              <p className="mb-6">
                Synapse employs a comprehensive security strategy built on multiple layers of protection to safeguard 
                your sensitive data. Our security practices include:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Lock className="h-5 w-5 text-blue-700" />
                    Data Encryption
                  </h3>
                  <p className="text-gray-600">
                    All data is encrypted both in transit and at rest using industry-standard encryption protocols.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Server className="h-5 w-5 text-blue-700" />
                    Secure Infrastructure
                  </h3>
                  <p className="text-gray-600">
                    Our infrastructure is hosted in SOC 2 compliant data centers with 24/7 monitoring and intrusion detection.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-blue-700" />
                    Vulnerability Management
                  </h3>
                  <p className="text-gray-600">
                    Regular security assessments, penetration testing, and vulnerability scanning to identify and address potential risks.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-700" />
                    Access Controls
                  </h3>
                  <p className="text-gray-600">
                    Role-based access controls, multi-factor authentication, and principle of least privilege to ensure data access is restricted.
                  </p>
                </div>
              </div>
            </div>

            {/* Compliance Certifications */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Compliance & Certifications</h2>
              
              <p className="mb-6">
                Synapse complies with major regulatory requirements and security frameworks relevant to GRC professionals:
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                <div className="border rounded-lg p-4 text-center">
                  <div className="font-semibold">SOC 2 Type II</div>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <div className="font-semibold">GDPR Compliant</div>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <div className="font-semibold">HIPAA Compliant</div>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <div className="font-semibold">ISO 27001</div>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <div className="font-semibold">CCPA Ready</div>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <div className="font-semibold">NIST Aligned</div>
                </div>
              </div>
            </div>

            {/* Security Practices */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Our Security Practices</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Security Development Lifecycle</h3>
                  <p className="text-gray-600">
                    Security is integrated throughout our development process. We conduct regular code reviews, 
                    automated security testing, and follow secure coding practices to identify and remediate 
                    vulnerabilities before they reach production.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Incident Response</h3>
                  <p className="text-gray-600">
                    Our team has established incident response procedures to quickly address security incidents. 
                    We maintain a 24/7 on-call rotation and conduct regular drills to ensure our team is prepared 
                    to respond effectively to security events.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">Employee Security</h3>
                  <p className="text-gray-600">
                    All Synapse employees undergo background checks and regular security training. Access to 
                    production systems is strictly limited and all access is logged and regularly reviewed.
                  </p>
                </div>
              </div>
            </div>

            {/* Security FAQs */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-6">Security FAQs</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">How is my data protected?</h3>
                  <p className="text-gray-600">
                    Your data is encrypted using AES-256 encryption at rest and TLS 1.2+ in transit. We implement 
                    multiple layers of security controls to protect against unauthorized access.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Do you conduct security assessments?</h3>
                  <p className="text-gray-600">
                    Yes, we conduct regular internal security assessments and engage third-party security firms 
                    to perform independent penetration tests and security reviews at least annually.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">How do you handle security incidents?</h3>
                  <p className="text-gray-600">
                    We have a comprehensive incident response plan that includes detection, containment, 
                    eradication, recovery, and lessons learned phases. We commit to notifying affected 
                    customers promptly in the event of a data breach.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <h3 className="font-semibold mb-3">Have Additional Security Questions?</h3>
              <p className="mb-4">
                Our security team is available to answer any questions about our security practices and policies.
              </p>
              <a 
                href="mailto:security@synapse-platform.com" 
                className="text-blue-700 font-medium hover:underline"
              >
                Contact Security Team
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Security;

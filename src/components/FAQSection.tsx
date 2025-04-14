
import { useState } from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is Synapse and how does it help GRC professionals?",
    answer: "Synapse is a specialized platform designed for Governance, Risk, and Compliance professionals. It combines intelligent tools, specialized knowledge, and a vibrant community to help you navigate complex regulatory landscapes. From AI-powered insights to networking opportunities, Synapse supports your professional growth and day-to-day compliance needs."
  },
  {
    question: "Who is Dara and what can the AI copilot do?",
    answer: "Dara is Synapse's AI copilot specifically trained on GRC knowledge. Dara can provide instant regulatory insights, analyze compliance requirements, answer complex questions about regulations, and offer actionable recommendations tailored to your specific situation and jurisdiction."
  },
  {
    question: "When will Synapse be available?",
    answer: "Synapse is currently in private beta with select organizations. We're expanding access through our waitlist, prioritizing GRC professionals across various industries. Join the waitlist now to secure your early access when we launch publicly."
  },
  {
    question: "Is my data secure on the platform?",
    answer: "Absolutely. At Synapse, security is our top priority. We implement industry-leading encryption standards, regular security audits, and strict access controls. Your compliance data is sensitive, and we treat it with the utmost care, ensuring full compliance with privacy regulations including GDPR, CCPA, and more."
  },
  {
    question: "How does the job matching feature work?",
    answer: "Our job matching feature uses AI to analyze your skills, experience, and preferences against open positions in the GRC field. Unlike generic job boards, we specialize in compliance roles and can identify opportunities that align with your specific expertise, whether that's financial compliance, data protection, healthcare regulations, or other specialized areas."
  },
  {
    question: "Can I use Synapse for my entire compliance team?",
    answer: "Yes! Synapse offers team collaboration features that allow compliance departments to work together efficiently. Team members can share insights, assign tasks, track regulatory projects, and maintain a centralized knowledge base, all while maintaining appropriate access controls."
  }
];

const FAQSection = () => {
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);

  return (
    <div id="faq" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about Synapse and how it can transform your GRC experience.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible>
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg font-medium text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 p-6 bg-white rounded-lg shadow-sm border border-gray-100 text-center">
            <h3 className="text-lg font-semibold mb-2">Still have questions?</h3>
            <p className="text-gray-600 mb-6">Our team is ready to help you with any questions about Synapse.</p>
            <a 
              href="mailto:contact@synapse-platform.com" 
              className="text-synapse-primary hover:text-synapse-secondary font-medium"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;

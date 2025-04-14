
import { useState } from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserRound, MessageCircle } from "lucide-react";

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

// Support team profiles
const supportTeam = [
  { name: "Alex Rivera", role: "Compliance Specialist", avatar: "/placeholder.svg" },
  { name: "Sarah Chen", role: "GRC Advisor", avatar: "/placeholder.svg" },
  { name: "Michael Okoye", role: "Support Lead", avatar: "/placeholder.svg" },
  { name: "Taylor Mason", role: "Regulatory Expert", avatar: "/placeholder.svg" },
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
          <Accordion type="single" collapsible className="mb-12">
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

          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Still have questions?</h3>
              <p className="text-gray-600">
                Our expert team is ready to help with any questions about Synapse.
              </p>
            </div>
            
            {/* Support Team Avatars */}
            <div className="flex justify-center mb-6">
              <div className="flex -space-x-2">
                {supportTeam.map((member, index) => (
                  <Avatar key={index} className="border-2 border-white w-12 h-12 transition-transform hover:scale-110 hover:z-10">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="bg-synapse-primary text-white">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>
            
            {/* Contact Button */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="mailto:contact@synapse-platform.com" 
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-synapse-primary text-white hover:bg-synapse-primary/90 transition-colors"
              >
                <MessageCircle size={18} />
                Contact Support Team
              </a>
              <a 
                href="#" 
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-synapse-primary text-synapse-primary hover:bg-synapse-primary/10 transition-colors"
              >
                <UserRound size={18} />
                Schedule a Demo
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;

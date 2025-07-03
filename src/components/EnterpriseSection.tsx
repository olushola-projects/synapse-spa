
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShieldCheck, Shield, FileText, CheckCircle2, Briefcase, Users, Award, Compass, Settings, MessageSquareText, AlertTriangle, BarChart3, LineChart, FileSearch } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import ExternalFormDialog from './ExternalFormDialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from '@/components/ui/badge';
import useEmblaCarousel from "embla-carousel-react";

// Agent data for the carousel
const agentData = [
  {
    name: "Dara",
    role: "KYC Analyst",
    icon: <Briefcase className="text-[#7A73FF]" size={24} />,
    integratedTools: ["iDenfy", "Onfido", "SEON"],
    valueAdd: [
      "Automates document verification and metadata analysis.",
      "Flags risk patterns and compiles enhanced due diligence reports.",
      "Functions as a Tier-2 AML analyst within your case management tool."
    ],
    outcomes: [
      "Accelerated onboarding processes.",
      "Reduction in false positives.",
      "Enhanced compliance accuracy."
    ],
    metrics: [
      { text: "78% of organizations use AI in at least one business function.", source: "McKinsey & Company" },
      { text: "68% of financial services firms prioritize AI in risk and compliance functions.", source: "Confluence" }
    ]
  },
  {
    name: "Exception Analyst",
    role: "Post-Trade Exception Management",
    icon: <AlertTriangle className="text-amber-500" size={24} />,
    integratedTools: ["DTCC Exception Manager", "UnaVista", "SteelEye"],
    valueAdd: [
      "Filters false positives, flags exceptions",
      "Synthesizes regulatory rules",
      "Automates routine exception handling"
    ],
    outcomes: [
      "Faster exception triage",
      "Improved audit preparedness",
      "Reduced operational risk"
    ],
    metrics: [
      { text: "60% of firms report reducing exception handling time with AI", source: "Deloitte" },
      { text: "42% reduction in false positive exceptions", source: "DTCC Research" }
    ]
  },
  {
    name: "Promotions Compliance Reviewer",
    role: "Marketing & Financial Promotions",
    icon: <FileSearch className="text-emerald-500" size={24} />,
    integratedTools: ["Red Oak", "Proofpoint", "Global Relay"],
    valueAdd: [
      "Reviews content for compliance",
      "Highlights jurisdictional risks",
      "Suggests compliant alternatives"
    ],
    outcomes: [
      "Reduced regulatory risk",
      "Improved cross-border alignment",
      "Faster promotion approvals"
    ],
    metrics: [
      { text: "53% faster approval times for financial promotions with AI", source: "Financial Promotions Council" },
      { text: "71% reduction in compliance review cycles", source: "Marketing Compliance Institute" }
    ]
  },
  {
    name: "ESG Compliance Analyst",
    role: "ESG Regulatory & Disclosure",
    icon: <LineChart className="text-green-500" size={24} />,
    integratedTools: ["Workiva", "Novisto", "Persefoni"],
    valueAdd: [
      "Interprets ESG regulations",
      "Flags disclosure gaps",
      "Monitors reporting requirements"
    ],
    outcomes: [
      "Clearer ESG disclosures",
      "Aligned policies",
      "Improved sustainability metrics"
    ],
    metrics: [
      { text: "92% of executives say ESG compliance is a top priority", source: "KPMG" },
      { text: "64% struggle with ESG data aggregation", source: "EY Global Survey" }
    ]
  },
  {
    name: "CMS Investigator",
    role: "Complaint Management Systems",
    icon: <MessageSquareText className="text-blue-500" size={24} />,
    integratedTools: ["Zendesk", "Zoho Desk", "Freshdesk"],
    valueAdd: [
      "Contextualizes complaints",
      "Suggests case categorization",
      "Identifies emerging patterns"
    ],
    outcomes: [
      "More accurate resolution outcomes",
      "Enhanced regulatory reporting",
      "Proactive risk identification"
    ],
    metrics: [
      { text: "82% improvement in complaint categorization accuracy", source: "Financial Conduct Authority" },
      { text: "47% reduction in complaint resolution time", source: "Consumer Financial Protection Bureau" }
    ]
  },
  {
    name: "Screening Validator",
    role: "PEP, Sanctions & Adverse Media",
    icon: <Shield className="text-purple-500" size={24} />,
    integratedTools: ["LexisNexis", "ComplyAdvantage", "Dow Jones"],
    valueAdd: [
      "Reviews cases",
      "Drafts risk reports",
      "Analyzes adverse media"
    ],
    outcomes: [
      "Smarter decisions",
      "Stronger SAR narratives",
      "Enhanced risk detection"
    ],
    metrics: [
      { text: "73% reduction in false positive screening alerts", source: "ACAMS" },
      { text: "58% faster PEP & sanctions reviews", source: "Wolfsberg Group" }
    ]
  },
  {
    name: "Board Advisor",
    role: "Board Reporting & Governance",
    icon: <Users className="text-indigo-600" size={24} />,
    integratedTools: ["Diligent Boards", "Nasdaq Boardvantage", "BoardEffect"],
    valueAdd: [
      "Drafts reports",
      "Translates technical findings",
      "Highlights governance trends"
    ],
    outcomes: [
      "Faster report creation",
      "Improved decision-making",
      "Enhanced governance insights"
    ],
    metrics: [
      { text: "67% of boards cite improved decision quality with AI-enhanced reporting", source: "Corporate Board Member" },
      { text: "40% reduction in board preparation time", source: "Spencer Stuart" }
    ]
  },
  {
    name: "TPRM Analyst",
    role: "Third-Party Risk Management",
    icon: <BarChart3 className="text-rose-500" size={24} />,
    integratedTools: ["OneTrust", "Prevalent", "Archer"],
    valueAdd: [
      "Reviews vendor data",
      "Flags documentation gaps",
      "Monitors third-party risk"
    ],
    outcomes: [
      "Stronger oversight",
      "Better control visibility",
      "Streamlined vendor assessments"
    ],
    metrics: [
      { text: "76% of organizations plan to increase TPRM automation", source: "Deloitte" },
      { text: "54% reduction in vendor risk assessment time", source: "Shared Assessments" }
    ]
  }
];

const EnterpriseSection = () => {
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("Join Synapse");

  const openFormDialog = (title: string = "Join Synapse") => {
    setDialogTitle(title);
    setShowFormDialog(true);
  };

  // Animation variants with proper TypeScript types
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  return (
    <section className="bg-[#F9FAFB] py-16 md:py-[90px]">
      <div className="container mx-auto max-w-[1200px] px-4 md:px-6">
        {/* Small label/tag above the main headline - matching Stripe's "Enterprise reinvention" */}
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
          className="text-[#7A73FF] font-medium mb-4 text-lg"
        >
          Enterprise Risk Reinvention
        </motion.p>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left column - Text content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-7"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-3xl md:text-[2.75rem] font-bold tracking-tight leading-[1.15] text-gray-900 -tracking-[0.5px]"
            >
              Empower Your Enterprise GRC with Intelligent AI Agents
            </motion.h2>
            
            <motion.div variants={itemVariants}>
              <p className="text-[1.125rem] text-[#4B4B4B] leading-relaxed font-normal">
                Seamlessly integrate AI agents to streamline compliance, enhance decisions, and reduce manual work across your existing GRC ecosystem.
              </p>
              <p className="mt-4 text-[1.125rem] text-[#4B4B4B] leading-relaxed font-normal">
                <a href="#" onClick={(e) => {e.preventDefault(); openFormDialog("Learn about Professional Services");}} className="text-[#7A73FF] hover:text-[#6366F1] underline-offset-4 hover:underline">Professional services</a> and <a href="#" onClick={(e) => {e.preventDefault(); openFormDialog("Learn about Certified Partners");}} className="text-[#7A73FF] hover:text-[#6366F1] underline-offset-4 hover:underline">certified partners</a> available for seamless implementation.
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="pt-2">
              <Button 
                size="lg" 
                className="bg-[#7A73FF] hover:bg-[#6366F1] text-white px-8 py-6 text-base font-medium rounded-full"
                onClick={() => openFormDialog("Explore Synapses for enterprises")}
              >
                Explore Synapses for enterprises <ArrowRight size={18} className="ml-2" />
              </Button>
            </motion.div>

            {/* Stats updated with new text and content */}
            <motion.div
              variants={itemVariants}
              className="pt-6 mt-8 border-t border-gray-200"
            >
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-1">Status</h4>
                  <p className="text-gray-600">Early Access Program Open</p>
                </div>
                
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-1">Regions</h4>
                  <div className="flex flex-col gap-1">
                    <p className="text-gray-600">Global Regulatory Coverage</p>
                    <p className="text-gray-600 text-sm">Continuously Expanding Jurisdictions</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-1">Powered by Innovation</h4>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-gray-600">
                      <div className="w-3 h-3 bg-[#7A73FF] rounded-full"></div>
                      <span>AML Agent</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <div className="w-3 h-3 bg-[#10b981] rounded-full"></div>
                      <span>ESGR Agent</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Right column - Interactive carousel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-4 md:mt-0"
          >
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
              ref={emblaRef}
            >
              <CarouselContent>
                {agentData.map((agent, index) => (
                  <CarouselItem key={index} className="md:basis-[100%] lg:basis-[100%]">
                    <div 
                      className="p-1 h-full"
                      onClick={() => openFormDialog(`Learn about ${agent.name} - ${agent.role}`)}
                    >
                      <Card className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 h-full cursor-pointer group border border-gray-200">
                        <div className="bg-gradient-to-r from-[rgba(60,90,180,0.03)] to-[rgba(60,90,180,0.1)] absolute inset-0 opacity-50"></div>
                        <CardContent className="p-6 relative z-10 h-full flex flex-col">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="bg-white p-2 rounded-full shadow-sm">
                              {agent.icon}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{agent.name}</h3>
                              <p className="text-sm text-gray-600">{agent.role}</p>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <p className="text-xs uppercase font-semibold text-gray-500 mb-2">Integrated Tools</p>
                            <div className="flex flex-wrap gap-2">
                              {agent.integratedTools.map((tool, i) => (
                                <Badge key={i} variant="outline" className="bg-blue-50 text-blue-700">
                                  {tool}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <p className="text-xs uppercase font-semibold text-gray-500 mb-2">Value Add</p>
                            <ul className="space-y-2">
                              {agent.valueAdd.map((value, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                  <span>{value}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <p className="text-xs uppercase font-semibold text-gray-500 mb-2">Outcomes</p>
                            <ul className="space-y-1">
                              {agent.outcomes.map((outcome, i) => (
                                <li key={i} className="text-sm text-gray-700">• {outcome}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="mt-auto pt-3">
                            <p className="text-xs uppercase font-semibold text-gray-500 mb-2">Supporting Metrics</p>
                            {agent.metrics.map((metric, i) => (
                              <div key={i} className="mb-2 last:mb-0">
                                <p className="text-sm text-gray-700 font-medium mb-1">{metric.text}</p>
                                <p className="text-xs text-gray-500">Source: {metric.source}</p>
                              </div>
                            ))}
                          </div>
                          
                          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-[#7A73FF] hover:bg-[#7A73FF]/10 p-0"
                            >
                              Learn more <ArrowRight size={16} className="ml-1" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              
              <div className="flex items-center justify-center mt-6">
                <CarouselPrevious className="relative inset-0 translate-y-0 mr-2" />
                <div className="flex gap-2">
                  {agentData.map((_, index) => (
                    <div key={index} className="w-2 h-2 rounded-full bg-gray-300"></div>
                  ))}
                </div>
                <CarouselNext className="relative inset-0 translate-y-0 ml-2" />
              </div>
            </Carousel>
          </motion.div>
        </div>
      </div>
      
      <ExternalFormDialog 
        open={showFormDialog} 
        onOpenChange={setShowFormDialog}
        title={dialogTitle}
      />
    </section>
  );
};

export default EnterpriseSection;


import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Shield, Globe, Users, Target, ArrowRight } from 'lucide-react';

const About = () => {
  // Industry perspectives data
  const industryPerspectives = [
    {
      name: "Thomson Reuters",
      role: "Future of Professionals Report, 2024",
      bio: "77% of professionals said the rise of AI would transform their work in the next five years.",
      image: "/lovable-uploads/7ef540cb-b6cd-435f-851f-791b450bf977.png"
    },
    {
      name: "Complia",
      role: "Strategic Briefing, 2025",
      bio: "AI is not just a tool—it's the next compliance culture. We're not replacing professionals; we're enabling faster, traceable, defensible decisions.",
      image: "/lovable-uploads/03eec3f2-1d7f-4ea9-a37d-a5f0a40dd23a.png"
    },
    {
      name: "World Economic Forum & Citi",
      role: "AI Impact in Compliance Report",
      bio: "Compliance officers will evolve into Compliance Analysts and Risk Advisors—focusing on predictive analytics, strategic advisory, and AI-aided decision-making.",
      image: "/lovable-uploads/a445b7c1-0e73-4cf1-95a3-e072d9a2a739.png"
    },
    {
      name: "Deloitte & McKinsey",
      role: "State of Compliance & Automation Trends",
      bio: "Up to 50% of compliance tasks currently performed manually will be automated by 2027.",
      image: "/lovable-uploads/fb0adfe3-6046-421c-aeb4-b4c2e7e4a834.png"
    },
    {
      name: "Synapses",
      role: "Our AI Strategy",
      bio: "Many compliance professionals currently lack familiarity with AI tools. Traditional training systems aren't built for the speed of regulatory change.",
      image: "/lovable-uploads/82f61427-efb3-492c-9be8-fee00268a56a.png"
    }
  ];

  // Leadership team data
  const leadershipTeam = [
    {
      name: "Sarah Chen",
      role: "CEO & Co-founder",
      bio: "Former Compliance Officer at HSBC with 15+ years experience in global financial regulations.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80"
    },
    {
      name: "David Okonkwo",
      role: "CTO & Co-founder",
      bio: "AI researcher and former RegTech lead at Accenture, specialized in machine learning for regulatory compliance.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
    },
    {
      name: "Emma Rodriguez",
      role: "Chief Product Officer",
      bio: "Previously led product at a leading GRC platform with deep expertise in user-centered design for complex workflows.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=922&q=80"
    },
    {
      name: "Michael Chang",
      role: "Chief Compliance Strategist",
      bio: "Former regulator with the SEC and compliance consultant to Fortune 500 companies.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-synapse-primary to-synapse-secondary text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Mission</h1>
              <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
                We're empowering GRC professionals to navigate complexity with confidence through intelligent tools, specialized knowledge, and community.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <Badge variant="outline" className="mb-4">Our Story</Badge>
                  <h2 className="text-3xl font-bold mb-6">Building the Future of GRC</h2>
                  <p className="text-gray-600 mb-4">
                    Synapse was founded in 2023 by a team of GRC practitioners who experienced firsthand the challenges of navigating complex regulatory landscapes with outdated tools and fragmented information.
                  </p>
                  <p className="text-gray-600 mb-4">
                    We recognized that compliance professionals deserved better—a platform that combines cutting-edge technology with deep domain expertise to simplify compliance tasks and foster professional growth.
                  </p>
                  <p className="text-gray-600 mb-4">
                    Today, we're building the most comprehensive GRC intelligence platform that serves as the central nervous system for compliance operations, connecting professionals, knowledge, and tools in one integrated ecosystem.
                  </p>
                </div>
                <div className="relative">
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 relative z-10">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-synapse-primary/10 rounded-full -mt-6 -mr-6"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-synapse-secondary/10 rounded-full -mb-4 -ml-4"></div>
                    
                    <h3 className="text-xl font-bold mb-4">Our Values</h3>
                    
                    <div className="space-y-4">
                      {[
                        { icon: <Shield className="h-5 w-5" />, title: "Integrity", text: "We uphold the highest ethical standards in everything we do" },
                        { icon: <Users className="h-5 w-5" />, title: "Community", text: "We believe in the power of connection and shared knowledge" },
                        { icon: <Globe className="h-5 w-5" />, title: "Innovation", text: "We continuously push boundaries to solve complex problems" },
                        { icon: <Target className="h-5 w-5" />, title: "Excellence", text: "We strive for exceptional quality in our platform and service" }
                      ].map((value, index) => (
                        <div key={index} className="flex gap-3">
                          <div className="flex-shrink-0 bg-white p-2 rounded-full shadow-sm">
                            {value.icon}
                          </div>
                          <div>
                            <h4 className="font-medium">{value.title}</h4>
                            <p className="text-sm text-gray-600">{value.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Industry Perspectives */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <Badge variant="outline" className="mb-4">Industry Insights</Badge>
                <h2 className="text-3xl font-bold mb-4">Perspectives Powering the Future of GRC</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Industry leaders and analysts agree that AI and technology are transforming the landscape of governance, risk, and compliance.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {industryPerspectives.map((perspective, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow p-6">
                    <div className="h-16 mb-4 flex items-center justify-center">
                      <img 
                        src={perspective.image} 
                        alt={perspective.name}
                        className="max-h-full object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{perspective.name}</h3>
                      <p className="text-blue-600 font-medium text-sm mb-3">{perspective.role}</p>
                      <p className="text-gray-600 text-sm">{perspective.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Leadership Team */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <Badge variant="outline" className="mb-4">Our Team</Badge>
                <h2 className="text-3xl font-bold mb-4">Leadership</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Our team brings together expertise in compliance, technology, and user experience to build a platform that truly meets the needs of GRC professionals.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {leadershipTeam.map((member, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-lg">{member.name}</h3>
                      <p className="text-synapse-primary font-medium text-sm mb-3">{member.role}</p>
                      <p className="text-gray-600 text-sm">{member.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-12">
                <Button variant="outline" className="inline-flex items-center gap-2">
                  View Full Team <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Join Us */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="outline" className="mb-4">Careers</Badge>
              <h2 className="text-3xl font-bold mb-4">Join Our Team</h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                We're looking for passionate individuals who want to transform the GRC industry through innovative technology and deep domain expertise.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button>View Open Positions</Button>
                <Button variant="outline">Our Culture</Button>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default About;

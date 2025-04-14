
import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Shield, Globe, Users, Target, ArrowRight } from 'lucide-react';

const About = () => {
  // Leadership team data
  const leadershipTeam = [
    {
      name: "Alexandra Chen",
      role: "Chief Executive Officer",
      bio: "Former regulatory compliance advisor with 15+ years of experience across financial services and technology sectors.",
      image: "/placeholder.svg"
    },
    {
      name: "Marcus Williams",
      role: "Chief Technology Officer",
      bio: "AI and machine learning expert who previously led engineering teams at leading regtech startups.",
      image: "/placeholder.svg"
    },
    {
      name: "Sophia Rodriguez",
      role: "Chief Compliance Officer",
      bio: "Certified compliance professional with extensive experience implementing GRC programs for Fortune 500 companies.",
      image: "/placeholder.svg"
    },
    {
      name: "James Kim",
      role: "VP of Product",
      bio: "Former GRC practitioner turned product leader focused on building intuitive solutions for complex regulatory challenges.",
      image: "/placeholder.svg"
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

        {/* Leadership Team */}
        <section className="py-20 bg-gray-50">
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
        <section className="py-20">
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

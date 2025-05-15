
import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Globe, Users, Target, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const About = () => {
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        {/* Hero Section with animated gradient and Stripe-inspired elements */}
        <section className="relative overflow-hidden py-20">
          {/* Diagonal stripes in background - Stripe inspired */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-synapse-primary/5 to-synapse-secondary/10"></div>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-synapse-primary to-synapse-secondary"></div>
            <div className="absolute inset-0 rotate-[-35deg] translate-y-[-25%] translate-x-[-15%]">
              <div className="h-1 w-[200%] bg-gradient-to-r from-blue-200/40 to-blue-100/10 mb-16"></div>
              <div className="h-2 w-[200%] bg-gradient-to-r from-indigo-200/30 to-purple-100/20 mb-20"></div>
              <div className="h-1 w-[200%] bg-gradient-to-r from-blue-100/20 to-indigo-100/10 mb-14"></div>
              <div className="h-3 w-[200%] bg-gradient-to-r from-purple-100/15 to-indigo-200/25 mb-24"></div>
            </div>
          </div>
          
          <div className="container relative mx-auto px-4">
            <motion.div 
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <Badge variant="outline" className="mb-4 bg-white/80 backdrop-blur-sm">About Synapses</Badge>
              <h1 className="text-5xl md:text-6xl font-normal mb-6 bg-gradient-to-br from-synapse-primary to-synapse-secondary bg-clip-text text-transparent">Our Mission</h1>
              <p className="text-xl md:text-2xl leading-relaxed">
                We're empowering GRC professionals to navigate complexity with confidence through intelligent tools, specialized knowledge, and community.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Our Story with modern card design */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <motion.div 
                className="grid md:grid-cols-2 gap-12 items-center"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                <motion.div variants={itemVariants}>
                  <Badge variant="outline" className="mb-4">Our Story</Badge>
                  <h2 className="text-3xl font-bold mb-6 bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent">Building the Future of GRC</h2>
                  <p className="text-gray-600 mb-4">
                    Synapses was founded in 2025 with a clear vision: to democratize access to regulatory agents for GRC professionals—empowering them not just to navigate, but to lead the future of compliance. 
                  </p>
                  <p className="text-gray-600 mb-4">
                    As regulatory complexity accelerates, Synapses is designed to fundamentally upskill and reskill compliance teams, enabling them to operate as strategic conductors in the era of agentic compliance. Our intuitive AI copilots and intelligent agents augment—not replace—human judgment, transforming how compliance work is done by enhancing expertise, insight, and strategic decision-making.
                  </p>
                  <p className="text-gray-600 mb-4">
                    We recognized that compliance professionals deserved better—a platform that combines emerging technologies with deep domain expertise to simplify compliance tasks and foster professional growth.
                  </p>
                  <p className="text-gray-600 mb-4">
                    Today, we're building the most comprehensive GRC intelligence platform that serves as the central nervous system for compliance operations, connecting professionals, knowledge, and tools in one integrated ecosystem.
                  </p>
                </motion.div>
                
                <motion.div 
                  className="relative"
                  variants={itemVariants}
                >
                  <div className="absolute inset-0 translate-x-4 translate-y-4 bg-gradient-to-br from-synapse-primary/10 to-synapse-secondary/10 rounded-2xl"></div>
                  <div className="bg-white backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-gray-100 relative z-10">
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
                        <motion.div 
                          key={index} 
                          className="flex gap-3"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          viewport={{ once: true }}
                        >
                          <div className="flex-shrink-0 bg-gradient-to-br from-gray-50 to-white p-2 rounded-full shadow-sm">
                            {value.icon}
                          </div>
                          <div>
                            <h4 className="font-medium">{value.title}</h4>
                            <p className="text-sm text-gray-600">{value.text}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Join Us - CTA section with Stripe-inspired design */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50"></div>
          
          {/* Stripe-inspired grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f030_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f030_1px,transparent_1px)] bg-[size:20px_20px]"></div>
          
          <div className="container relative mx-auto px-4">
            <motion.div 
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <Badge variant="outline" className="mb-4">Careers</Badge>
              <h2 className="text-3xl font-bold mb-4">Join Our Team</h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                We're looking for passionate individuals who want to transform the GRC industry through innovative technology and deep domain expertise.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/company/careers">
                  <Button className="group bg-synapse-primary hover:bg-synapse-secondary transition-all duration-300">
                    View Careers
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/company/careers">
                  <Button variant="outline" className="border-synapse-primary text-synapse-primary hover:bg-synapse-primary/5">
                    Our Culture
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default About;

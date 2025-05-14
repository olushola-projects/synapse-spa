
import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from "react-router-dom";
import { 
  BarChart3, 
  Brain, 
  ClipboardCheck, 
  Clock, 
  Code2, 
  Coffee, 
  Compass, 
  Globe2, 
  HeartHandshake, 
  Lightbulb, 
  LineChart, 
  Medal, 
  MessageSquare, 
  School, 
  Zap
} from 'lucide-react';

const Careers = () => {
  // Define benefits array for the benefits section
  const benefits = [
    { icon: <Globe2 className="h-6 w-6" />, title: "Remote-first culture", description: "Work from anywhere in the world with our distributed team" },
    { icon: <Brain className="h-6 w-6" />, title: "Learning & development", description: "Budget for courses, conferences, and books to help you grow" },
    { icon: <MessageSquare className="h-6 w-6" />, title: "Regular team retreats", description: "Connect with colleagues in person at our company meetups" },
    { icon: <Clock className="h-6 w-6" />, title: "Flexible hours", description: "We trust you to manage your time and deliver results" },
    { icon: <Coffee className="h-6 w-6" />, title: "Wellness stipend", description: "Monthly allowance for physical and mental wellbeing" },
    { icon: <HeartHandshake className="h-6 w-6" />, title: "Meaningful equity", description: "Share in our success with our equity compensation plan" },
  ];

  // Define values array for the values section
  const values = [
    { icon: <Lightbulb className="h-8 w-8" />, title: "Innovation", description: "We constantly push boundaries to solve complex regulatory challenges" },
    { icon: <ClipboardCheck className="h-8 w-8" />, title: "Excellence", description: "We're committed to quality in everything we create" },
    { icon: <Compass className="h-8 w-8" />, title: "Integrity", description: "We build trust through transparent and ethical practices" },
    { icon: <Zap className="h-8 w-8" />, title: "Impact", description: "We focus on making a real difference for compliance professionals" }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-synapse-primary to-synapse-secondary text-white py-24">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute w-96 h-96 bg-white/5 rounded-full -top-20 -left-20"></div>
            <div className="absolute w-64 h-64 bg-white/5 rounded-full top-40 right-20"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="outline" className="border-white/30 text-white mb-4">Careers</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Join Us in Shaping the Future of GRC</h1>
              <p className="text-xl opacity-90 leading-relaxed mb-8">
                At Synapses, we're building the next generation of tools for governance, risk, and compliance professionals.
              </p>
              <p className="text-lg bg-white/10 backdrop-blur-sm px-5 py-3 rounded-lg inline-block">
                We're always looking for talented individuals to join our team
              </p>
            </div>
          </div>
        </section>

        {/* Current Openings */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="outline" className="mb-4">Opportunities</Badge>
              <h2 className="text-3xl font-bold mb-4">Current Openings</h2>
              <p className="text-gray-600 mb-12">
                We're growing our team with passionate and talented individuals
              </p>
              
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-12 text-center">
                <LineChart className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-medium mb-4">No Open Positions</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  We don't have any open positions at the moment, but we're always interested in connecting with talented individuals.
                </p>
                <Button asChild>
                  <Link to="/company/contact">
                    Contact Us
                  </Link>
                </Button>
              </div>
              
              <p className="text-gray-500 mt-6">
                Check back later for new opportunities or send us your CV at <a href="mailto:careers@joinsynapses.com" className="text-synapse-primary hover:underline">careers@joinsynapses.com</a>
              </p>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <Badge variant="outline" className="mb-4">Our Culture</Badge>
                <h2 className="text-3xl font-bold mb-4">Our Values</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  These core principles guide everything we do at Synapses
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {values.map((value, index) => (
                  <div key={index} className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                    <div className="bg-synapse-primary/10 p-4 rounded-full mb-4 text-synapse-primary">
                      {value.icon}
                    </div>
                    <h3 className="font-bold text-xl mb-2">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <Badge variant="outline" className="mb-4">Why Join Us</Badge>
                <h2 className="text-3xl font-bold mb-4">Benefits & Perks</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  We believe in taking care of our team and providing the support you need to do your best work
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-5 p-6 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="flex-shrink-0 bg-white p-3 rounded-full shadow-sm h-12 w-12 flex items-center justify-center text-synapse-primary">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Photos */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <Badge variant="outline" className="mb-4">Life at Synapses</Badge>
                <h2 className="text-3xl font-bold mb-4">Our Team</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  We're a diverse and passionate team working together to transform the GRC industry
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80" 
                    alt="Team collaboration" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80" 
                    alt="Working remotely" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80" 
                    alt="Team meeting" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80" 
                    alt="Team event" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Apply CTA */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-synapse-primary/10 to-synapse-secondary/10 rounded-2xl p-12 text-center">
              <Badge variant="outline" className="mb-4">Join Our Team</Badge>
              <h2 className="text-3xl font-bold mb-4">Ready to Make an Impact?</h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Even if we don't have any open positions right now, we're always interested in connecting with talented individuals who are passionate about transforming the GRC industry.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button asChild>
                  <Link to="/company/contact">
                    Contact Us
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <a href="mailto:careers@joinsynapses.com">
                    Send Your CV
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Careers;

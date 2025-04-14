
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MessageSquare, Shield, Cog, Users, LineChart, Brain } from "lucide-react";

const Platform = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-white py-12 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
              The Synapse Platform
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Our comprehensive platform combines cutting-edge AI, specialized knowledge, and a 
              vibrant community to transform how GRC professionals work.
            </p>
          </div>
        </div>
      </div>

      {/* Platform Overview */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="overview" className="max-w-5xl mx-auto">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="features">Key Features</TabsTrigger>
              <TabsTrigger value="technology">Technology</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Overview</CardTitle>
                  <CardDescription>
                    Understanding the core components of Synapse
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p>
                    Synapse integrates specialized tools for GRC professionals into a cohesive platform
                    designed to streamline compliance workflows, provide actionable insights, and connect
                    professionals with peers and experts.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6 mt-8">
                    <div className="flex gap-4">
                      <Brain className="w-10 h-10 text-blue-600" />
                      <div>
                        <h3 className="font-semibold mb-2">Dara: AI Compliance Assistant</h3>
                        <p className="text-gray-600">Trained specifically on regulatory frameworks and GRC best practices</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <Users className="w-10 h-10 text-blue-600" />
                      <div>
                        <h3 className="font-semibold mb-2">Community & Networking</h3>
                        <p className="text-gray-600">Connect with peers, share insights, and build professional relationships</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <Shield className="w-10 h-10 text-blue-600" />
                      <div>
                        <h3 className="font-semibold mb-2">Compliance Tracking</h3>
                        <p className="text-gray-600">Real-time monitoring of regulatory changes and compliance status</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <LineChart className="w-10 h-10 text-blue-600" />
                      <div>
                        <h3 className="font-semibold mb-2">Analytics Dashboard</h3>
                        <p className="text-gray-600">Visualize compliance data and identify trends or risks</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="features" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Key Features</CardTitle>
                  <CardDescription>
                    Explore the powerful capabilities of Synapse
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-6">
                    <li className="flex gap-3">
                      <MessageSquare className="w-6 h-6 text-blue-600 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold">Ask Dara</h3>
                        <p className="text-gray-600">Get instant answers to complex regulatory questions with our AI assistant trained on GRC knowledge</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <Shield className="w-6 h-6 text-blue-600 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold">Regulatory Monitoring</h3>
                        <p className="text-gray-600">Stay up-to-date with changing regulations across multiple jurisdictions</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <Users className="w-6 h-6 text-blue-600 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold">Expert Community</h3>
                        <p className="text-gray-600">Connect with fellow GRC professionals to share best practices and insights</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <Cog className="w-6 h-6 text-blue-600 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold">Customizable Dashboard</h3>
                        <p className="text-gray-600">Personalize your workspace with widgets that match your specific needs and workflows</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="technology" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Our Technology</CardTitle>
                  <CardDescription>
                    The innovation powering Synapse
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-6">
                    Synapse leverages cutting-edge technology to deliver intelligent, secure, and user-friendly
                    compliance solutions for GRC professionals.
                  </p>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">AI & Machine Learning</h3>
                      <p className="text-gray-600">
                        Our proprietary AI models are trained on extensive regulatory data, compliance frameworks,
                        and industry best practices to provide accurate, contextual insights and recommendations.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Secure Infrastructure</h3>
                      <p className="text-gray-600">
                        Built with enterprise-grade security from the ground up, with end-to-end encryption,
                        regular security audits, and compliance with major security frameworks.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Data Processing</h3>
                      <p className="text-gray-600">
                        Advanced natural language processing capabilities to analyze regulatory text,
                        identify requirements, and extract actionable insights.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to experience Synapse?</h2>
          <p className="max-w-2xl mx-auto mb-8 text-blue-100">
            Join the waitlist today and be among the first to access our platform when it launches.
          </p>
          <Button size="lg" variant="outline" className="bg-white text-blue-700 hover:bg-blue-50">
            Join Waitlist
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Platform;
